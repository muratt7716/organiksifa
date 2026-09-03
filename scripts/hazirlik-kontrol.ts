/**
 * Ürünlerin görsel dışındaki alanları eksiksiz mi? — `npx tsx scripts/hazirlik-kontrol.ts`
 *
 * "Görselleri hallettik, gerisi hazır mı?" sorusunu tahminle değil ölçümle
 * cevaplar. Yalnızca rapor verir.
 */
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import postgres from "postgres";
import { URUNLER as A } from "./urunler-verisi";
import { URUNLER_2 as B } from "./urunler-verisi-2";

async function main() {
  const tanimlar = [...A, ...B];
  console.log(`\n${tanimlar.length} ürün tanımı\n${"=".repeat(60)}`);

  /* ---- Tanım dosyalarında eksik alan var mı? ---- */
  const eksik: string[] = [];
  for (const u of tanimlar) {
    if (!u.baslik?.trim()) eksik.push(`${u.slug}: başlık boş`);
    if (!u.kisa?.trim()) eksik.push(`${u.slug}: kısa açıklama boş`);
    if (!u.aciklama?.trim() || u.aciklama.length < 80)
      eksik.push(`${u.slug}: açıklama çok kısa (${u.aciklama?.length ?? 0} karakter)`);
    if (!u.kategoriSlug) eksik.push(`${u.slug}: kategori yok`);
    if (!u.fiyat || Number(u.fiyat) <= 0) eksik.push(`${u.slug}: fiyat geçersiz`);
    if (u.baslik.length > 70) eksik.push(`${u.slug}: başlık 70 karakterden uzun`);
    if (u.kisa.length > 160) eksik.push(`${u.slug}: kısa açıklama 160 karakterden uzun`);
  }
  console.log(
    eksik.length
      ? `TANIMLARDA EKSİK (${eksik.length}):\n  ` + eksik.join("\n  ")
      : "tanımlar: tamam — başlık, kısa/uzun açıklama, kategori, fiyat hepsinde dolu",
  );

  /* ---- Set olduğu hâlde içeriği yazılmamış olanlar ---- */
  const setsiz = tanimlar.filter(
    (u) => /\bset\b/i.test(u.baslik) && (!u.setIcerigi || u.setIcerigi.length === 0),
  );
  console.log(
    `\nset içeriği: ${setsiz.length ? `${setsiz.length} sette eksik → ` + setsiz.map((s) => s.slug).join(", ") : "tamam"}`,
  );

  /* ---- Canlı veritabanı ---- */
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return;
  const sql = postgres(dbUrl, { prepare: false, max: 1 });

  const [s] = await sql<
    {
      urun: number;
      yayinda: number;
      one_cikan: number;
      aciklamasiz: number;
      kategorisiz: number;
      gorselsiz: number;
      kategori: number;
    }[]
  >`
    SELECT
      (SELECT count(*)::int FROM products)                              AS urun,
      (SELECT count(*)::int FROM products WHERE yayinda)                AS yayinda,
      (SELECT count(*)::int FROM products WHERE one_cikan)              AS one_cikan,
      (SELECT count(*)::int FROM products WHERE coalesce(aciklama,'')='') AS aciklamasiz,
      (SELECT count(*)::int FROM products WHERE kategori_id IS NULL)    AS kategorisiz,
      (SELECT count(*)::int FROM products p
         LEFT JOIN product_images i ON i.urun_id = p.id
         WHERE i.id IS NULL)                                            AS gorselsiz,
      (SELECT count(*)::int FROM categories)                            AS kategori`;

  console.log(`\nCANLI VERİTABANI\n${"=".repeat(60)}`);
  console.log(`  ürün            ${s.urun} (${s.yayinda} yayında)`);
  console.log(`  kategori        ${s.kategori}`);
  console.log(`  açıklaması boş  ${s.aciklamasiz}`);
  console.log(`  kategorisiz     ${s.kategorisiz}`);
  console.log(`  görselsiz       ${s.gorselsiz}`);
  console.log(`  ÖNE ÇIKAN       ${s.one_cikan}  ${s.one_cikan === 0 ? "← ana sayfa vitrini BOŞ kalır" : ""}`);

  const [ayar] = await sql<
    { whatsapp: string | null; unvan: string | null; adres: string | null; tel: string | null }[]
  >`
    SELECT whatsapp_numarasi AS whatsapp, ticaret_unvani AS unvan,
           adres, iletisim_telefon AS tel
    FROM settings WHERE id = 1`;

  console.log(`\nAYARLAR\n${"=".repeat(60)}`);
  const d = (v: string | null, ad: string, kritik = false) =>
    console.log(`  ${v ? "DOLU" : "BOŞ "}  ${ad}${!v && kritik ? "  ← KRİTİK" : ""}`);
  d(ayar.whatsapp, "WhatsApp sipariş numarası", true);
  d(ayar.unvan, "Ticaret unvanı (yasal)", true);
  d(ayar.adres, "Adres (yasal)", true);
  d(ayar.tel, "İletişim telefonu");

  await sql.end();
  console.log("");
}

main().catch((e) => {
  console.error("Kontrol başarısız:", e);
  process.exit(1);
});
