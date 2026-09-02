"use server";

import { revalidatePath } from "next/cache";
import { eq, ne, and, asc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { products, productImages, categories } from "@/db/schema";
import { benzersizSlug } from "@/lib/slug";
import { fiyatAyristir } from "@/lib/price";
import { yetkiGerekli } from "./auth";
import { depodanSil } from "./uploads";

const GorselSemasi = z.object({
  url: z.string().min(1),
  storagePath: z.string().min(1),
  genislik: z.number().int().positive(),
  yukseklik: z.number().int().positive(),
  zeminRengi: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  alt: z.string().default(""),
});

const UrunSemasi = z.object({
  id: z.string().uuid().optional(),
  baslik: z.string().trim().min(3, "Ürün adı en az 3 harf olmalı").max(160),
  fiyatMetni: z.string().min(1, "Fiyat girmen gerekiyor — örnek: 450"),
  eskiFiyatMetni: z.string().optional(),
  kategoriId: z.string().uuid("Kategori seçmen gerekiyor"),
  kisaAciklama: z.string().max(300).optional(),
  aciklama: z.string().optional(),
  setIcerigi: z.array(z.string().trim().min(1)).default([]),
  stokta: z.boolean().default(true),
  yayinda: z.boolean().default(true),
  oneCikan: z.boolean().default(false),
  kargoBedava: z.boolean().default(false),
  gorseller: z.array(GorselSemasi).min(1, "En az bir fotoğraf eklemen gerekiyor"),
});

export type UrunGirdisi = z.input<typeof UrunSemasi>;

function gorselTuru(g: { genislik: number; yukseklik: number }, index: number) {
  if (index === 0) return "kapak";
  return g.yukseklik > g.genislik * 1.4 ? "infografik" : "galeri";
}

export async function urunKaydet(
  girdi: UrunGirdisi,
): Promise<{ hata?: string; id?: string }> {
  try {
    await yetkiGerekli();
  } catch {
    return { hata: "Oturumun kapanmış. Tekrar giriş yap." };
  }

  const parsed = UrunSemasi.safeParse(girdi);
  if (!parsed.success) return { hata: parsed.error.issues[0].message };
  const v = parsed.data;

  const fiyat = fiyatAyristir(v.fiyatMetni);
  if (fiyat === null) return { hata: "Fiyatı anlayamadım. Örnek: 450 veya 1.250,00" };
  if (fiyat === 0) return { hata: "Fiyat sıfır olamaz" };

  let eskiFiyat: number | null = null;
  if (v.eskiFiyatMetni?.trim()) {
    eskiFiyat = fiyatAyristir(v.eskiFiyatMetni);
    if (eskiFiyat === null) {
      return { hata: "Eski fiyatı anlayamadım. Boş bırakabilirsin." };
    }
    if (eskiFiyat <= fiyat) {
      return { hata: "Eski fiyat, yeni fiyattan büyük olmalı" };
    }
  }

  const mevcutSluglar = await db
    .select({ slug: products.slug })
    .from(products)
    .where(v.id ? ne(products.id, v.id) : undefined);

  const ortak = {
    baslik: v.baslik,
    fiyat: fiyat.toFixed(2),
    eskiFiyat: eskiFiyat?.toFixed(2) ?? null,
    kategoriId: v.kategoriId,
    kisaAciklama: v.kisaAciklama?.trim() || null,
    aciklama: v.aciklama?.trim() || null,
    setIcerigi: v.setIcerigi.length ? v.setIcerigi : null,
    stokta: v.stokta,
    yayinda: v.yayinda,
    oneCikan: v.oneCikan,
    kargoBedava: v.kargoBedava,
    updatedAt: new Date(),
  };

  let urunId: string;

  if (v.id) {
    const [mevcut] = await db.select().from(products).where(eq(products.id, v.id));
    if (!mevcut) return { hata: "Ürün bulunamadı" };

    const slug =
      mevcut.baslik === v.baslik
        ? mevcut.slug
        : benzersizSlug(
            v.baslik,
            mevcutSluglar.map((s) => s.slug),
          );

    await db.update(products).set({ ...ortak, slug }).where(eq(products.id, v.id));
    urunId = v.id;

    const eskiler = await db
      .select()
      .from(productImages)
      .where(eq(productImages.urunId, v.id));
    const kalan = new Set(v.gorseller.map((g) => g.storagePath));
    const silinecek = eskiler.filter((e) => !kalan.has(e.storagePath));

    await db.delete(productImages).where(eq(productImages.urunId, v.id));
    if (silinecek.length) {
      await depodanSil(silinecek.map((s) => s.storagePath)).catch(() => {});
    }
  } else {
    const slug = benzersizSlug(
      v.baslik,
      mevcutSluglar.map((s) => s.slug),
    );
    const [yeni] = await db
      .insert(products)
      .values({ ...ortak, slug })
      .returning({ id: products.id });
    urunId = yeni.id;
  }

  await db.insert(productImages).values(
    v.gorseller.map((g, i) => ({
      urunId,
      url: g.url,
      storagePath: g.storagePath,
      alt: g.alt || v.baslik,
      genislik: g.genislik,
      yukseklik: g.yukseklik,
      zeminRengi: g.zeminRengi,
      tur: gorselTuru(g, i),
      sira: i,
    })),
  );

  revalidatePath("/panel/urunler");
  revalidatePath("/", "layout");
  return { id: urunId };
}

export async function urunGetir(id: string) {
  const [urun] = await db.select().from(products).where(eq(products.id, id));
  if (!urun) return null;
  const gorseller = await db
    .select()
    .from(productImages)
    .where(eq(productImages.urunId, id))
    .orderBy(asc(productImages.sira));
  return { urun, gorseller };
}

export type UrunSatirVerisi = {
  id: string;
  baslik: string;
  fiyat: string;
  stokta: boolean;
  yayinda: boolean;
  kapakUrl: string | null;
  zeminRengi: string | null;
  kategoriAdi: string | null;
};

export async function urunleriGetir(): Promise<UrunSatirVerisi[]> {
  try {
    const satirlar = await db
      .select({
        id: products.id,
        baslik: products.baslik,
        fiyat: products.fiyat,
        stokta: products.stokta,
        yayinda: products.yayinda,
        kategoriAdi: categories.ad,
        kapakUrl: productImages.url,
        zeminRengi: productImages.zeminRengi,
      })
      .from(products)
      .leftJoin(categories, eq(products.kategoriId, categories.id))
      .leftJoin(
        productImages,
        and(eq(productImages.urunId, products.id), eq(productImages.sira, 0)),
      )
      .orderBy(asc(products.sira), asc(products.baslik));
    return satirlar;
  } catch {
    return [];
  }
}

export async function urunAnahtarDegistir(
  id: string,
  alan: "stokta" | "yayinda" | "oneCikan",
  deger: boolean,
) {
  await yetkiGerekli();
  await db
    .update(products)
    .set({ [alan]: deger, updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidatePath("/panel/urunler");
  revalidatePath("/", "layout");
}

/** Silme değil arşivleme — veri kaybolmaz, sipariş geçmişi bozulmaz. */
export async function urunArsivle(id: string) {
  await yetkiGerekli();
  await db
    .update(products)
    .set({ yayinda: false, stokta: false, updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidatePath("/panel/urunler");
  revalidatePath("/", "layout");
}
