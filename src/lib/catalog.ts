import { eq, and, asc, desc, inArray } from "drizzle-orm";
import { db } from "@/db";
import { products, productImages, categories } from "@/db/schema";

export type KatalogUrunu = {
  id: string;
  baslik: string;
  slug: string;
  kisaAciklama: string | null;
  fiyat: string;
  eskiFiyat: string | null;
  stokta: boolean;
  kargoBedava: boolean;
  ortalamaPuan: string | null;
  yorumSayisi: number;
  kategoriAdi: string | null;
  kategoriSlug: string | null;
  kapakUrl: string | null;
  kapakAlt: string | null;
  zeminRengi: string;
};

const KAPAK_ALANLARI = {
  id: products.id,
  baslik: products.baslik,
  slug: products.slug,
  kisaAciklama: products.kisaAciklama,
  fiyat: products.fiyat,
  eskiFiyat: products.eskiFiyat,
  stokta: products.stokta,
  kargoBedava: products.kargoBedava,
  ortalamaPuan: products.ortalamaPuan,
  yorumSayisi: products.yorumSayisi,
  kategoriAdi: categories.ad,
  kategoriSlug: categories.slug,
  kapakUrl: productImages.url,
  kapakAlt: productImages.alt,
  zeminRengi: productImages.zeminRengi,
};

function normalize(satirlar: unknown[]): KatalogUrunu[] {
  return satirlar as KatalogUrunu[];
}

export async function yayindakiUrunler(opts?: {
  kategoriSlug?: string;
  oneCikan?: boolean;
  limit?: number;
}): Promise<KatalogUrunu[]> {
  try {
    const kosullar = [eq(products.yayinda, true)];
    if (opts?.kategoriSlug) kosullar.push(eq(categories.slug, opts.kategoriSlug));
    if (opts?.oneCikan) kosullar.push(eq(products.oneCikan, true));

    const q = db
      .select(KAPAK_ALANLARI)
      .from(products)
      .leftJoin(categories, eq(products.kategoriId, categories.id))
      .leftJoin(
        productImages,
        and(eq(productImages.urunId, products.id), eq(productImages.sira, 0)),
      )
      .where(and(...kosullar))
      .orderBy(asc(products.sira), desc(products.createdAt));

    const satirlar = opts?.limit ? await q.limit(opts.limit) : await q;
    return normalize(satirlar);
  } catch {
    return [];
  }
}

export async function urunDetay(slug: string) {
  try {
    const [urun] = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.yayinda, true)));
    if (!urun) return null;

    const [gorseller, kategori] = await Promise.all([
      db
        .select()
        .from(productImages)
        .where(and(eq(productImages.urunId, urun.id), eq(productImages.yayinda, true)))
        .orderBy(asc(productImages.sira)),
      urun.kategoriId
        ? db.select().from(categories).where(eq(categories.id, urun.kategoriId))
        : Promise.resolve([]),
    ]);

    return { urun, gorseller, kategori: kategori[0] ?? null };
  } catch {
    return null;
  }
}

export async function benzerUrunler(
  kategoriId: string | null,
  haricId: string,
  limit = 4,
): Promise<KatalogUrunu[]> {
  if (!kategoriId) return [];
  const hepsi = await yayindakiUrunler({ limit: limit + 4 });
  return hepsi.filter((u) => u.id !== haricId).slice(0, limit);
}

export async function aktifKategoriler() {
  try {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.aktif, true))
      .orderBy(asc(categories.sira), asc(categories.ad));
  } catch {
    return [];
  }
}

/** Sepet sayfası için — istemciden gelen id listesiyle güncel ürün bilgisi. */
export async function sepetUrunleri(idler: string[]): Promise<KatalogUrunu[]> {
  if (idler.length === 0) return [];
  try {
    const satirlar = await db
      .select(KAPAK_ALANLARI)
      .from(products)
      .leftJoin(categories, eq(products.kategoriId, categories.id))
      .leftJoin(
        productImages,
        and(eq(productImages.urunId, products.id), eq(productImages.sira, 0)),
      )
      .where(and(inArray(products.id, idler), eq(products.yayinda, true)));
    return normalize(satirlar);
  } catch {
    return [];
  }
}
