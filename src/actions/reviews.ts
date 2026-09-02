"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, and, desc, avg, count } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { reviews, products, orders } from "@/db/schema";
import { sureliVeyaYedek } from "@/lib/db-sure";
import { yetkiGerekli } from "./auth";

const YorumSemasi = z.object({
  urunId: z.string().uuid(),
  ad: z.string().trim().min(2, "Adını yazman gerekiyor").max(60),
  puan: z.number().int().min(1, "Puan ver").max(5),
  yorum: z
    .string()
    .trim()
    .min(10, "Yorumun en az 10 karakter olsun")
    .max(1500, "Yorum çok uzun"),
  siparisNo: z.string().optional(),
  siparisToken: z.string().uuid().optional(),
  website: z.string().max(0).optional(),
});

export type YorumGirdisi = z.input<typeof YorumSemasi>;

/**
 * Müşteri yorumu ekler. Yorum "bekliyor" durumunda kaydedilir ve
 * ONAYLANMADAN sitede görünmez — spam bu yüzden hiç yayına çıkmaz.
 */
export async function yorumEkle(
  girdi: YorumGirdisi,
): Promise<{ hata?: string; basarili?: boolean }> {
  const parsed = YorumSemasi.safeParse(girdi);
  if (!parsed.success) return { hata: parsed.error.issues[0].message };
  const v = parsed.data;

  if (v.website) return { hata: "İstek doğrulanamadı." };

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;

  // Sipariş sayfasından gelen yorum "doğrulanmış alıcı" rozeti alır.
  let siparisId: string | null = null;
  if (v.siparisNo && v.siparisToken) {
    const [s] = await db
      .select({ id: orders.id })
      .from(orders)
      .where(
        and(eq(orders.siparisNo, v.siparisNo), eq(orders.erisimToken, v.siparisToken)),
      );
    siparisId = s?.id ?? null;
  }

  await db.insert(reviews).values({
    urunId: v.urunId,
    ad: v.ad,
    puan: v.puan,
    yorum: v.yorum,
    siparisId,
    dogrulanmisAlici: Boolean(siparisId),
    ip,
  });

  revalidatePath("/panel/yorumlar");
  return { basarili: true };
}

export async function urunYorumlari(urunId: string) {
  return sureliVeyaYedek(
    () =>
      db
        .select()
        .from(reviews)
        .where(and(eq(reviews.urunId, urunId), eq(reviews.durum, "onayli")))
        .orderBy(desc(reviews.dogrulanmisAlici), desc(reviews.onayAt)),
    [] as (typeof reviews.$inferSelect)[],
  );
}

/* ------------------------------ Panel ------------------------------ */

export async function yorumlariGetir(durum: string = "bekliyor") {
  return sureliVeyaYedek(async () => {
    return await db
      .select({
        id: reviews.id,
        ad: reviews.ad,
        puan: reviews.puan,
        yorum: reviews.yorum,
        durum: reviews.durum,
        dogrulanmisAlici: reviews.dogrulanmisAlici,
        saticiYaniti: reviews.saticiYaniti,
        createdAt: reviews.createdAt,
        urunId: reviews.urunId,
        urunBaslik: products.baslik,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.urunId, products.id))
      .where(durum === "hepsi" ? undefined : eq(reviews.durum, durum))
      .orderBy(desc(reviews.createdAt))
      .limit(200);
  }, [] as Awaited<ReturnType<typeof yorumSorgusu>>);
}

/** yorumlariGetir'in dönüş tipini türetmek için — çalıştırılmaz. */
declare function yorumSorgusu(): Promise<
  {
    id: string;
    ad: string;
    puan: number;
    yorum: string;
    durum: string;
    dogrulanmisAlici: boolean;
    saticiYaniti: string | null;
    createdAt: Date;
    urunId: string;
    urunBaslik: string | null;
  }[]
>;

/** Ürünün ortalama puanını ve yorum sayısını yeniden hesaplar. */
async function puanTazele(urunId: string) {
  const [ozet] = await db
    .select({ ort: avg(reviews.puan), n: count() })
    .from(reviews)
    .where(and(eq(reviews.urunId, urunId), eq(reviews.durum, "onayli")));

  await db
    .update(products)
    .set({
      ortalamaPuan: ozet?.ort ? Number(ozet.ort).toFixed(1) : null,
      yorumSayisi: ozet?.n ?? 0,
    })
    .where(eq(products.id, urunId));
}

export async function yorumOnayla(id: string) {
  await yetkiGerekli();
  const [y] = await db
    .update(reviews)
    .set({ durum: "onayli", onayAt: new Date() })
    .where(eq(reviews.id, id))
    .returning({ urunId: reviews.urunId });

  if (y) await puanTazele(y.urunId);
  revalidatePath("/panel/yorumlar");
  revalidatePath("/", "layout");
}

export async function yorumReddet(id: string) {
  await yetkiGerekli();
  const [y] = await db
    .update(reviews)
    .set({ durum: "reddedildi" })
    .where(eq(reviews.id, id))
    .returning({ urunId: reviews.urunId });

  if (y) await puanTazele(y.urunId);
  revalidatePath("/panel/yorumlar");
  revalidatePath("/", "layout");
}

export async function saticiYanitiKaydet(id: string, yanit: string) {
  await yetkiGerekli();
  await db
    .update(reviews)
    .set({ saticiYaniti: yanit.trim() || null })
    .where(eq(reviews.id, id));
  revalidatePath("/panel/yorumlar");
  revalidatePath("/", "layout");
}
