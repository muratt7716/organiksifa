"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { headers } from "next/headers";
import { eq, desc, sql, inArray, and, or, ilike, count } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  products,
  productImages,
  orders,
  orderItems,
  orderEvents,
  rateLimits,
  DURUM_ETIKET,
  type SiparisDurumu,
  type OdemeDurumu,
} from "@/db/schema";
import { sayi } from "@/lib/price";
import { telefonNormalize } from "@/lib/phone";
import { kargoHesapla } from "@/lib/shipping";
import { ayarlariGetir, kargoAyari } from "@/lib/settings";
import { ilGecerliMi } from "@/lib/tr-iller";
import { siparisBildir } from "@/lib/notify";
import { sureliVeyaYedek } from "@/lib/db-sure";
import { yetkiGerekli } from "./auth";

/* =========================================================================
   MÜŞTERİ TARAFI — sipariş oluşturma
   ========================================================================= */

const SepetSemasi = z
  .array(
    z.object({
      urunId: z.string().uuid(),
      adet: z.number().int().min(1).max(50),
    }),
  )
  .min(1, "Sepetin boş görünüyor")
  .max(40);

const CheckoutSemasi = z.object({
  musteriAdi: z.string().trim().min(3, "Ad soyad yazman gerekiyor"),
  telefon: z.string().trim().min(1, "Telefon numarası yazman gerekiyor"),
  email: z.string().trim().optional(),
  il: z.string().trim().min(1, "İl seçmen gerekiyor"),
  ilce: z.string().trim().min(2, "İlçe yazman gerekiyor"),
  adres: z.string().trim().min(10, "Adresi biraz daha açık yazar mısın?"),
  not: z.string().trim().max(500).optional(),
  sozlesmeOnay: z.literal(true, {
    message: "Mesafeli satış sözleşmesini onaylaman gerekiyor",
  }),
  kvkkOnay: z.literal(true, { message: "Aydınlatma metnini onaylaman gerekiyor" }),
  ticariIletiIzni: z.boolean().default(false),
  idempotencyKey: z.string().uuid(),
  // Bot tuzağı — insan bu alanı görmez, bot doldurur.
  website: z.string().max(0).optional(),
  sepet: SepetSemasi,
});

export type CheckoutGirdisi = z.input<typeof CheckoutSemasi>;

export type SiparisSonucu =
  | { hata: string }
  | { siparisNo: string; token: string };

async function hizSiniriAsildiMi(anahtar: string): Promise<boolean> {
  const simdi = new Date();
  const pencere = 15 * 60 * 1000;
  try {
    const [kayit] = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.anahtar, anahtar));

    if (!kayit || simdi.getTime() - kayit.pencereAt.getTime() > pencere) {
      await db
        .insert(rateLimits)
        .values({ anahtar, sayac: 1, pencereAt: simdi })
        .onConflictDoUpdate({
          target: rateLimits.anahtar,
          set: { sayac: 1, pencereAt: simdi },
        });
      return false;
    }

    if (kayit.sayac >= 3) return true;

    await db
      .update(rateLimits)
      .set({ sayac: kayit.sayac + 1 })
      .where(eq(rateLimits.anahtar, anahtar));
    return false;
  } catch {
    return false;
  }
}

/**
 * Sipariş oluşturur.
 *
 * GÜVENLİK: İstemciden YALNIZCA [{urunId, adet}] alınır. Başlık, fiyat, kargo
 * ve toplam sunucuda veritabanından okunarak hesaplanır. Sepet localStorage'da
 * durduğu için istemciden gelen tutara asla güvenilmez.
 */
export async function siparisOlustur(
  girdi: CheckoutGirdisi,
): Promise<SiparisSonucu> {
  const parsed = CheckoutSemasi.safeParse(girdi);
  if (!parsed.success) return { hata: parsed.error.issues[0].message };
  const v = parsed.data;

  if (v.website) return { hata: "İstek doğrulanamadı." };

  const telefonE164 = telefonNormalize(v.telefon);
  if (!telefonE164) {
    return { hata: "Telefon numarasını anlayamadım. Örnek: 0532 111 22 33" };
  }
  if (!ilGecerliMi(v.il)) return { hata: "Listeden bir il seçmen gerekiyor" };

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;

  if (await hizSiniriAsildiMi(`tel:${telefonE164}`)) {
    return { hata: "Çok fazla sipariş denemesi. 15 dakika sonra tekrar dene." };
  }

  // Aynı idempotency key ile ikinci istek → mevcut siparişi döndür (F5 koruması)
  const [zatenVar] = await db
    .select({ siparisNo: orders.siparisNo, token: orders.erisimToken })
    .from(orders)
    .where(eq(orders.idempotencyKey, v.idempotencyKey));
  if (zatenVar) {
    return { siparisNo: zatenVar.siparisNo, token: zatenVar.token };
  }

  const idler = [...new Set(v.sepet.map((s) => s.urunId))];
  const bulunan = await db
    .select({
      id: products.id,
      baslik: products.baslik,
      slug: products.slug,
      fiyat: products.fiyat,
      kdvOrani: products.kdvOrani,
      kargoBedava: products.kargoBedava,
      stokta: products.stokta,
      yayinda: products.yayinda,
    })
    .from(products)
    .where(inArray(products.id, idler));

  const harita = new Map(bulunan.map((u) => [u.id, u]));
  const satirlar: {
    urun: (typeof bulunan)[number];
    adet: number;
    birimFiyat: number;
    satirToplam: number;
  }[] = [];

  for (const s of v.sepet) {
    const urun = harita.get(s.urunId);
    if (!urun) return { hata: "Sepetteki bir ürün artık satışta değil. Sepeti yenile." };
    if (!urun.yayinda || !urun.stokta) {
      return { hata: `"${urun.baslik}" şu an stokta yok. Sepetten çıkarır mısın?` };
    }
    const birimFiyat = sayi(urun.fiyat);
    satirlar.push({
      urun,
      adet: s.adet,
      birimFiyat,
      satirToplam: Math.round(birimFiyat * s.adet * 100) / 100,
    });
  }

  const ayar = await ayarlariGetir();
  const araToplam =
    Math.round(satirlar.reduce((t, s) => t + s.satirToplam, 0) * 100) / 100;

  const kargo = kargoHesapla(
    satirlar.map((s) => ({
      fiyat: s.birimFiyat,
      adet: s.adet,
      kargoBedava: s.urun.kargoBedava,
    })),
    kargoAyari(ayar),
  );

  const toplam = Math.round((araToplam + kargo.ucret) * 100) / 100;
  const kapaklar = await db
    .select({ urunId: productImages.urunId, url: productImages.url })
    .from(productImages)
    .where(and(inArray(productImages.urunId, idler), eq(productImages.sira, 0)));
  const kapakHarita = new Map(kapaklar.map((k) => [k.urunId, k.url]));

  // Sipariş numarası Postgres sequence'inden gelir. "Son siparişi bul, 1 ekle"
  // mantığı iki eşzamanlı siparişte aynı numarayı üretir.
  const noSonuc = (await db.execute(
    sql`SELECT yeni_siparis_no() AS no`,
  )) as unknown as { no: string }[];
  const siparisNo = noSonuc[0]?.no;
  if (!siparisNo) {
    return { hata: "Sipariş numarası üretilemedi. Lütfen tekrar dene." };
  }

  const simdi = new Date();
  const [yeniSiparis] = await db
    .insert(orders)
    .values({
      siparisNo,
      idempotencyKey: v.idempotencyKey,
      musteriAdi: v.musteriAdi,
      telefon: v.telefon,
      telefonE164,
      email: v.email?.trim() || null,
      il: v.il,
      ilce: v.ilce,
      adres: v.adres,
      not: v.not?.trim() || null,
      araToplam: araToplam.toFixed(2),
      kargoUcreti: kargo.ucret.toFixed(2),
      kargoKuraliSnapshot: kargo.kural,
      toplam: toplam.toFixed(2),
      mesafeliSozlesmeOnayAt: simdi,
      kvkkOnayAt: simdi,
      ticariIletiIzni: v.ticariIletiIzni,
      ip,
      userAgent: h.get("user-agent") ?? null,
    })
    .returning({ id: orders.id, token: orders.erisimToken });

  await db.insert(orderItems).values(
    satirlar.map((s) => ({
      siparisId: yeniSiparis.id,
      urunId: s.urun.id,
      baslikSnapshot: s.urun.baslik,
      slugSnapshot: s.urun.slug,
      gorselSnapshot: kapakHarita.get(s.urun.id) ?? null,
      birimFiyat: s.birimFiyat.toFixed(2),
      kdvOraniSnapshot: s.urun.kdvOrani,
      adet: s.adet,
      satirToplam: s.satirToplam.toFixed(2),
    })),
  );

  await db.insert(orderEvents).values({
    siparisId: yeniSiparis.id,
    tip: "olusturuldu",
    yeniDeger: "yeni",
    aktorAdi: "Müşteri",
  });

  // Bildirim yanıttan SONRA gönderilir — sipariş kaydını asla bloklamaz.
  after(async () => {
    await siparisBildir(
      {
        siparisNo,
        musteriAdi: v.musteriAdi,
        telefon: v.telefon,
        il: v.il,
        ilce: v.ilce,
        toplam,
        kalemSayisi: satirlar.length,
        satirlar: satirlar.map((s) => ({ baslik: s.urun.baslik, adet: s.adet })),
        siparisUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/siparis/${siparisNo}?t=${yeniSiparis.token}`,
      },
      ayar.bildirimKanallari ?? {},
    );
  });

  revalidatePath("/panel/siparisler");
  return { siparisNo, token: yeniSiparis.token };
}

/* =========================================================================
   MÜŞTERİ TARAFI — sipariş görüntüleme
   ========================================================================= */

export async function siparisGetirToken(siparisNo: string, token: string) {
  return sureliVeyaYedek(async () => {
    const [siparis] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.siparisNo, siparisNo), eq(orders.erisimToken, token)));
    if (!siparis) return null;
    const kalemler = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.siparisId, siparis.id));
    return { siparis, kalemler };
  }, null);
}

export async function whatsappTiklandi(siparisNo: string) {
  await db
    .update(orders)
    .set({
      whatsappTiklama: sql`${orders.whatsappTiklama} + 1`,
      whatsappSonTiklamaAt: new Date(),
    })
    .where(eq(orders.siparisNo, siparisNo));
}

/* =========================================================================
   PANEL TARAFI
   ========================================================================= */

export async function siparisleriGetir(arama?: string, durum?: string) {
  return sureliVeyaYedek(async () => {
    const kosullar = [];
    if (arama?.trim()) {
      const q = `%${arama.trim()}%`;
      const tel = telefonNormalize(arama);
      kosullar.push(
        or(
          ilike(orders.siparisNo, q),
          ilike(orders.musteriAdi, q),
          ilike(orders.telefonE164, tel ? `%${tel}%` : q),
        ),
      );
    }
    if (durum && durum !== "hepsi") kosullar.push(eq(orders.durum, durum));

    return await db
      .select()
      .from(orders)
      .where(kosullar.length ? and(...kosullar) : undefined)
      .orderBy(desc(orders.createdAt))
      .limit(100);
  }, [] as (typeof orders.$inferSelect)[]);
}

export async function siparisDetay(id: string) {
  return sureliVeyaYedek(() => siparisDetayOku(id), null, 8000);
}

async function siparisDetayOku(id: string) {
  const [siparis] = await db.select().from(orders).where(eq(orders.id, id));
  if (!siparis) return null;
  const [kalemler, olaylar, gecmis] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.siparisId, id)),
    db
      .select()
      .from(orderEvents)
      .where(eq(orderEvents.siparisId, id))
      .orderBy(desc(orderEvents.createdAt)),
    // Aynı telefondan gelen önceki siparişler — ayrı customers tablosu olmadan
    // tekrar-müşteri görünürlüğü sağlar.
    db
      .select({
        siparisNo: orders.siparisNo,
        toplam: orders.toplam,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(
        and(
          eq(orders.telefonE164, siparis.telefonE164),
          sql`${orders.id} <> ${id}`,
        ),
      )
      .orderBy(desc(orders.createdAt))
      .limit(5),
  ]);
  return { siparis, kalemler, olaylar, gecmis };
}

export async function durumGuncelle(id: string, yeniDurum: SiparisDurumu, not?: string) {
  const admin = await yetkiGerekli();
  const [mevcut] = await db
    .select({ durum: orders.durum })
    .from(orders)
    .where(eq(orders.id, id));
  if (!mevcut) return;

  await db
    .update(orders)
    .set({ durum: yeniDurum, updatedAt: new Date() })
    .where(eq(orders.id, id));

  await db.insert(orderEvents).values({
    siparisId: id,
    tip: "durum",
    eskiDeger: DURUM_ETIKET[mevcut.durum as SiparisDurumu] ?? mevcut.durum,
    yeniDeger: DURUM_ETIKET[yeniDurum],
    aktorAdi: admin.ad,
    not: not ?? null,
  });

  revalidatePath("/panel/siparisler");
  revalidatePath(`/panel/siparisler/${id}`);
}

export async function odemeGuncelle(
  id: string,
  odemeDurumu: OdemeDurumu,
  odenenTutar?: number,
  odemeYontemi?: string,
) {
  const admin = await yetkiGerekli();
  await db
    .update(orders)
    .set({
      odemeDurumu,
      odenenTutar: odenenTutar?.toFixed(2) ?? null,
      odemeYontemi: odemeYontemi ?? null,
      odemeAt: odemeDurumu === "alindi" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id));

  await db.insert(orderEvents).values({
    siparisId: id,
    tip: "odeme",
    yeniDeger: odemeDurumu,
    aktorAdi: admin.ad,
  });

  revalidatePath(`/panel/siparisler/${id}`);
  revalidatePath("/panel/siparisler");
}

export async function kargoGuncelle(
  id: string,
  kargoFirmasi: string,
  kargoTakipNo: string,
) {
  const admin = await yetkiGerekli();
  await db
    .update(orders)
    .set({
      kargoFirmasi: kargoFirmasi || null,
      kargoTakipNo: kargoTakipNo || null,
      kargoyaVerildiAt: kargoTakipNo ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id));

  await db.insert(orderEvents).values({
    siparisId: id,
    tip: "kargo",
    yeniDeger: `${kargoFirmasi} ${kargoTakipNo}`.trim(),
    aktorAdi: admin.ad,
  });

  revalidatePath(`/panel/siparisler/${id}`);
}

export async function panelOzeti() {
  return sureliVeyaYedek(async () => {
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);

    const [[bugunku], [bekleyen], [odemeBekleyen]] = await Promise.all([
      db
        .select({ n: count(), toplam: sql<string>`coalesce(sum(${orders.toplam}), 0)` })
        .from(orders)
        .where(sql`${orders.createdAt} >= ${bugun.toISOString()}`),
      db.select({ n: count() }).from(orders).where(eq(orders.durum, "yeni")),
      db
        .select({ n: count() })
        .from(orders)
        .where(
          and(
            eq(orders.odemeDurumu, "bekliyor"),
            sql`${orders.durum} <> 'iptal'`,
          ),
        ),
    ]);

    return {
      bugunSiparis: bugunku?.n ?? 0,
      bugunCiro: sayi(bugunku?.toplam ?? "0"),
      bekleyen: bekleyen?.n ?? 0,
      odemeBekleyen: odemeBekleyen?.n ?? 0,
    };
  }, { bugunSiparis: 0, bugunCiro: 0, bekleyen: 0, odemeBekleyen: 0 });
}
