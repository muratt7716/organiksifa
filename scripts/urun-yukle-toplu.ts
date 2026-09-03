/**
 * Katalogdaki tüm ürünleri Supabase'e yükler.
 *   npx tsx scripts/urun-yukle-toplu.ts            (yükler)
 *   npx tsx scripts/urun-yukle-toplu.ts --kuru     (hiçbir şey yazmaz, rapor verir)
 *
 * NEREYE YAZAR: .env.local içindeki DATABASE_URL — yani Vercel'in kullandığı
 * Supabase'in ta kendisi. "Yerel veritabanı" diye ayrı bir şey yok; buradan
 * yüklenen ürün canlı sitede anında görünür.
 *
 * Ürün tanımları scripts/urunler-verisi.ts içinde.
 *
 * GÖRSELLER
 *   kapak  — urun-gorselleri/<showroom>   (varsa; kare, hero'ya uygun)
 *   detay  — urunler-ham/<infografik>     (ablamın gönderdiği bilgi görseli)
 * Showroom yoksa infografik kapak olur.
 *
 * Aynı slug ile tekrar çalıştırılırsa ürün güncellenir, kopya oluşmaz.
 */
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";
import { URUNLER as URUNLER_1 } from "./urunler-verisi";
import { URUNLER_2 } from "./urunler-verisi-2";

/** İki parti birlikte yüklenir; slug tekrarı ön kontrolde yakalanır. */
const TUMU = [...URUNLER_1, ...URUNLER_2];

/** Görseli hazır olmayanlar siteye konmaz (bkz. UrunTanimi.beklet). */
const URUNLER = TUMU.filter((u) => !u.beklet);
const BEKLEYENLER = TUMU.filter((u) => u.beklet);

/**
 * Katalogdan tamamen çıkarılanlar — canlıda varsa silinir.
 * `altin-yag-2`: ilk kurulumdan kalma, açıklaması boş, kapağı yok.
 */
const SILINECEK_SLUGLAR = ["altin-yag-2", ...BEKLEYENLER.map((u) => u.slug)];

const KOK = path.join(import.meta.dirname, "..");
const KOVA = "urunler";
const KURU = process.argv.includes("--kuru");

/** Panelde olmayan kategoriler açılır. */
const KATEGORILER: { slug: string; ad: string; sira: number }[] = [
  { slug: "setler", ad: "Setler", sira: 1 },
  { slug: "takviye-urunler", ad: "Takviye Ürünler", sira: 2 },
  { slug: "cilt-bakimi", ad: "Cilt Bakımı", sira: 3 },
  { slug: "sac-bakimi", ad: "Saç Bakımı", sira: 4 },
  { slug: "bitkisel-yaglar", ad: "Bitkisel Yağlar", sira: 5 },
  { slug: "cay-detoks", ad: "Çay & Detoks", sira: 6 },
  { slug: "sabun-temizlik", ad: "Sabun & Temizlik", sira: 7 },
  { slug: "anne-bebek", ad: "Anne & Bebek", sira: 8 },
  { slug: "agiz-dis", ad: "Ağız & Diş", sira: 9 },
  { slug: "ev-koku", ad: "Ev & Koku", sira: 10 },
];

/** Görseli WebP'ye çevirir, ölçüsünü ve kenar zemin rengini döndürür. */
async function hazirla(dosyaYolu: string, enBoy: number) {
  const girdi = sharp(dosyaYolu).rotate();
  const ust = await girdi.metadata();

  const veri = await girdi
    .resize({
      width: Math.min(ust.width ?? enBoy, enBoy),
      height: Math.min(ust.height ?? enBoy, enBoy),
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  const son = await sharp(veri).metadata();

  // Zemin rengi: sol üst köşe. Kart içinde görselin etrafına konan dolgu bu
  // renkle boyanıyor, böylece dikey infografik kesintisiz duruyor.
  const kose = await sharp(veri)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .raw()
    .toBuffer();

  return {
    veri,
    genislik: son.width ?? 0,
    yukseklik: son.height ?? 0,
    zeminRengi:
      "#" +
      [kose[0], kose[1], kose[2]]
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase(),
  };
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!dbUrl || !sbUrl || !sbKey) {
    console.error("DATABASE_URL / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY eksik.");
    process.exit(1);
  }

  console.log(`\nHedef: ${new URL(dbUrl).host}`);
  console.log(
    `${URUNLER.length} ürün yüklenecek · ${BEKLEYENLER.length} bekletiliyor` +
      `${KURU ? "  (KURU ÇALIŞTIRMA)" : ""}\n`,
  );
  if (BEKLEYENLER.length) {
    console.log("BEKLETİLENLER (görseli hazır değil, siteye konmayacak):");
    BEKLEYENLER.forEach((u) => console.log(`  ${u.slug}`));
    console.log("");
  }

  /* ---- Ön kontrol: dosyalar yerinde mi, slug tekrarı var mı? ---- */
  const hatalar: string[] = [];
  const gorulenSlug = new Set<string>();
  for (const u of URUNLER) {
    if (gorulenSlug.has(u.slug)) hatalar.push(`slug tekrarı: ${u.slug}`);
    gorulenSlug.add(u.slug);

    const info = path.join(KOK, "urunler-ham", u.infografik);
    if (!fs.existsSync(info)) hatalar.push(`infografik yok: ${u.slug} -> ${u.infografik}`);

    if (u.showroom) {
      const sh = path.join(KOK, "urun-gorselleri", u.showroom);
      if (!fs.existsSync(sh)) hatalar.push(`showroom yok: ${u.slug} -> ${u.showroom}`);
    }

    const kat = KATEGORILER.find((k) => k.slug === u.kategoriSlug);
    if (!kat) hatalar.push(`kategori tanımsız: ${u.slug} -> ${u.kategoriSlug}`);
  }

  if (hatalar.length) {
    console.error("ÖN KONTROL BAŞARISIZ:\n  " + hatalar.join("\n  ") + "\n");
    process.exit(1);
  }
  console.log("ön kontrol: tamam\n");

  /* ---- Kullanılmayan ham dosyalar ---- */
  const kullanilan = new Set(URUNLER.map((u) => u.infografik));
  const tumHam = fs
    .readdirSync(path.join(KOK, "urunler-ham"))
    .filter((f) => f.endsWith(".jpeg"));
  const bosta = tumHam.filter((f) => !kullanilan.has(f));

  const sql = postgres(dbUrl, { prepare: false, max: 1 });
  const depo = createClient(sbUrl, sbKey, { auth: { persistSession: false } });

  /* ---- Siteden çıkarılacaklar ---- */
  if (!KURU && SILINECEK_SLUGLAR.length) {
    const silinen = await sql<{ slug: string }[]>`
      DELETE FROM products WHERE slug IN ${sql(SILINECEK_SLUGLAR)}
      RETURNING slug`;
    if (silinen.length) {
      console.log(`siteden çıkarıldı (${silinen.length}):`);
      silinen.forEach((r) => console.log(`  ${r.slug}`));
      console.log("");
    }
  }

  /* ---- Kategoriler ---- */
  if (!KURU) {
    for (const k of KATEGORILER) {
      await sql`
        INSERT INTO categories (ad, slug, sira, aktif)
        VALUES (${k.ad}, ${k.slug}, ${k.sira}, true)
        ON CONFLICT (slug) DO UPDATE SET ad = EXCLUDED.ad, sira = EXCLUDED.sira`;
    }
    console.log(`${KATEGORILER.length} kategori hazır\n`);
  }

  /* ---- Ürünler ---- */
  let eklenen = 0;
  for (const u of URUNLER) {
    const satirlar: { kaynak: string; enBoy: number; tur: string; sira: number }[] = [];

    if (u.showroom) {
      satirlar.push({
        kaynak: path.join(KOK, "urun-gorselleri", u.showroom),
        enBoy: 1400,
        tur: "kapak",
        sira: 0,
      });
      satirlar.push({
        kaynak: path.join(KOK, "urunler-ham", u.infografik),
        enBoy: 1600,
        tur: "detay",
        sira: 1,
      });
    } else {
      satirlar.push({
        kaynak: path.join(KOK, "urunler-ham", u.infografik),
        enBoy: 1600,
        tur: "kapak",
        sira: 0,
      });
    }

    if (KURU) {
      console.log(
        `${u.slug.padEnd(38)} ${u.kategoriSlug.padEnd(16)} ${satirlar.length} görsel` +
          (u.showroom ? "  (showroom kapak)" : "  (infografik kapak)"),
      );
      eklenen++;
      continue;
    }

    const yuklenen: {
      url: string;
      storagePath: string;
      genislik: number;
      yukseklik: number;
      zeminRengi: string;
      tur: string;
      sira: number;
    }[] = [];

    for (const g of satirlar) {
      const hazir = await hazirla(g.kaynak, g.enBoy);
      const yol = `urunler/${u.slug}/${g.sira === 0 ? "kapak" : "detay"}.webp`;

      const { error } = await depo.storage
        .from(KOVA)
        .upload(yol, hazir.veri, { contentType: "image/webp", upsert: true });

      if (error) {
        console.error(`  ! ${u.slug} görsel yüklenemedi: ${error.message}`);
        continue;
      }

      yuklenen.push({
        url: `${sbUrl}/storage/v1/object/public/${KOVA}/${yol}`,
        storagePath: yol,
        genislik: hazir.genislik,
        yukseklik: hazir.yukseklik,
        zeminRengi: hazir.zeminRengi,
        tur: g.tur,
        sira: g.sira,
      });
    }

    if (yuklenen.length === 0) {
      console.error(`  ! ${u.slug}: hiç görsel yüklenemedi, ürün eklenmedi`);
      continue;
    }

    const [kat] = await sql<{ id: string }[]>`
      SELECT id FROM categories WHERE slug = ${u.kategoriSlug}`;

    const [urun] = await sql<{ id: string }[]>`
      INSERT INTO products (baslik, slug, kisa_aciklama, aciklama, fiyat,
                            kategori_id, set_icerigi, stokta, yayinda, one_cikan, sira)
      VALUES (${u.baslik}, ${u.slug}, ${u.kisa}, ${u.aciklama}, ${u.fiyat},
              ${kat?.id ?? null},
              ${u.setIcerigi ? sql.array(u.setIcerigi) : null},
              true, true, false, 0)
      ON CONFLICT (slug) DO UPDATE SET
        baslik        = EXCLUDED.baslik,
        kisa_aciklama = EXCLUDED.kisa_aciklama,
        aciklama      = EXCLUDED.aciklama,
        fiyat         = EXCLUDED.fiyat,
        kategori_id   = EXCLUDED.kategori_id,
        set_icerigi   = EXCLUDED.set_icerigi,
        yayinda       = true,
        updated_at    = now()
      RETURNING id`;

    await sql`DELETE FROM product_images WHERE urun_id = ${urun.id}`;
    for (const g of yuklenen) {
      await sql`
        INSERT INTO product_images (urun_id, url, storage_path, alt, genislik,
                                    yukseklik, zemin_rengi, tur, yayinda, sira)
        VALUES (${urun.id}, ${g.url}, ${g.storagePath}, ${u.baslik},
                ${g.genislik}, ${g.yukseklik}, ${g.zeminRengi}, ${g.tur}, true, ${g.sira})`;
    }

    eklenen++;
    const k = yuklenen[0];
    console.log(
      `${String(eklenen).padStart(2)}/${URUNLER.length}  ${u.baslik.slice(0, 44).padEnd(44)} ` +
        `${yuklenen.length} görsel  kapak ${k.genislik}x${k.yukseklik}`,
    );
  }

  const [sayim] = await sql<{ urun: number; yayinda: number; kategori: number }[]>`
    SELECT (SELECT count(*)::int FROM products)               AS urun,
           (SELECT count(*)::int FROM products WHERE yayinda) AS yayinda,
           (SELECT count(*)::int FROM categories)             AS kategori`;
  await sql.end();

  console.log(`\n${"=".repeat(60)}`);
  console.log(`${eklenen} ürün işlendi`);
  if (!KURU) {
    console.log(
      `veritabanı: ${sayim.urun} ürün (${sayim.yayinda} yayında) · ${sayim.kategori} kategori`,
    );
  }
  if (bosta.length) {
    console.log(`\nkullanılmayan ham görsel (${bosta.length}):`);
    bosta.forEach((f) => console.log(`  ${f}`));
  }
  console.log("\nFiyatlar geçicidir — panelden düzeltilecek.\n");
}

main().catch((e) => {
  console.error("\nYükleme başarısız:", e);
  process.exit(1);
});
