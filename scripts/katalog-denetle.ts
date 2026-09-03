/**
 * Katalog denetimi — `npx tsx scripts/katalog-denetle.ts`
 *
 * Üç soruyu cevaplar:
 *   1. Aynı ürün iki kez mi girilmiş? (slug, başlık, benzer başlık, aynı görsel)
 *   2. Canlı veritabanında mükerrer kayıt var mı?
 *   3. Görseller profesyonel mi? (çözünürlük, en-boy oranı, dosya boyutu)
 *
 * Hiçbir şey yazmaz, yalnızca rapor verir.
 */
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import postgres from "postgres";
import { URUNLER as URUNLER_1 } from "./urunler-verisi";
import { URUNLER_2 } from "./urunler-verisi-2";

const KOK = path.join(import.meta.dirname, "..");
const URUNLER = [...URUNLER_1, ...URUNLER_2];

/** Başlıkları karşılaştırmak için sadeleştirir. */
function anahtar(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[c]!)
    .replace(/\b(seti|set|destek|dogal|ozel|urun|urunler|parca|ml|gr|g|adet)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/** İki metnin ortak karakter oranı (basit benzerlik). */
function benzerlik(a: string, b: string): number {
  const [kisa, uzun] = a.length < b.length ? [a, b] : [b, a];
  if (uzun.length === 0) return 1;
  let ortak = 0;
  const havuz = uzun.split("");
  for (const ch of kisa) {
    const i = havuz.indexOf(ch);
    if (i >= 0) {
      ortak++;
      havuz.splice(i, 1);
    }
  }
  return ortak / uzun.length;
}

async function main() {
  const bulgular: string[] = [];
  const basiliklar = (b: string) => console.log(`\n${b}\n${"=".repeat(b.length)}`);

  /* ---------- 1. Tanım dosyalarında mükerrer ---------- */
  basiliklar("1. TANIMLARDA MUKERRER");

  const slugSayaci = new Map<string, number>();
  const baslikSayaci = new Map<string, number>();
  const gorselSahibi = new Map<string, string[]>();

  for (const u of URUNLER) {
    slugSayaci.set(u.slug, (slugSayaci.get(u.slug) ?? 0) + 1);
    baslikSayaci.set(u.baslik, (baslikSayaci.get(u.baslik) ?? 0) + 1);
    const liste = gorselSahibi.get(u.infografik) ?? [];
    liste.push(u.slug);
    gorselSahibi.set(u.infografik, liste);
  }

  let temiz = true;
  for (const [s, n] of slugSayaci) if (n > 1) { console.log(`  ! slug ${n} kez: ${s}`); temiz = false; }
  for (const [b, n] of baslikSayaci) if (n > 1) { console.log(`  ! başlık ${n} kez: ${b}`); temiz = false; }
  for (const [g, liste] of gorselSahibi)
    if (liste.length > 1) { console.log(`  ! aynı görsel ${liste.length} üründe: ${g}\n      ${liste.join(", ")}`); temiz = false; }
  if (temiz) console.log("  tamam — slug, başlık ve görsel tekrarı yok");

  /* ---------- 2. Benzer başlıklar (elle bakılmalı) ---------- */
  basiliklar("2. BENZER BASLIKLAR (ayni urun olabilir)");

  const anahtarlar = URUNLER.map((u) => ({ u, k: anahtar(u.baslik) }));
  const ciftler: { a: string; b: string; oran: number }[] = [];
  for (let i = 0; i < anahtarlar.length; i++) {
    for (let j = i + 1; j < anahtarlar.length; j++) {
      const o = benzerlik(anahtarlar[i].k, anahtarlar[j].k);
      if (o >= 0.75) ciftler.push({ a: anahtarlar[i].u.baslik, b: anahtarlar[j].u.baslik, oran: o });
    }
  }
  ciftler.sort((x, y) => y.oran - x.oran);
  if (ciftler.length === 0) console.log("  tamam — belirgin benzerlik yok");
  else ciftler.forEach((c) => console.log(`  %${Math.round(c.oran * 100)}  ${c.a}\n        ${c.b}`));

  /* ---------- 3. Görsel kalitesi ---------- */
  basiliklar("3. GORSEL KALITESI");

  type Satir = { slug: string; kaynak: string; g: number; y: number; oran: number; kb: number; showroom: boolean };
  const satirlar: Satir[] = [];

  for (const u of URUNLER) {
    const showroom = Boolean(u.showroom);
    const yol = showroom
      ? path.join(KOK, "urun-gorselleri", u.showroom!)
      : path.join(KOK, "urunler-ham", u.infografik);
    if (!fs.existsSync(yol)) { console.log(`  ! dosya yok: ${u.slug}`); continue; }
    const m = await sharp(yol).metadata();
    const st = fs.statSync(yol);
    satirlar.push({
      slug: u.slug,
      kaynak: path.basename(yol),
      g: m.width ?? 0,
      y: m.height ?? 0,
      oran: (m.width ?? 1) / (m.height ?? 1),
      kb: Math.round(st.size / 1024),
      showroom,
    });
  }

  const dusukCozunurluk = satirlar.filter((s) => Math.min(s.g, s.y) < 700);
  const asiriDikey = satirlar.filter((s) => s.oran < 0.45);
  const kucukDosya = satirlar.filter((s) => s.kb < 60);

  console.log(`  toplam ${satirlar.length} kapak · ${satirlar.filter((s) => s.showroom).length} showroom · ${satirlar.filter((s) => !s.showroom).length} infografik`);

  const yaz = (ad: string, liste: Satir[]) => {
    console.log(`\n  ${ad} (${liste.length})`);
    liste
      .sort((a, b) => a.g * a.y - b.g * b.y)
      .forEach((s) => console.log(`    ${s.slug.padEnd(40)} ${s.g}x${s.y}  oran ${s.oran.toFixed(2)}  ${s.kb} KB`));
  };

  if (dusukCozunurluk.length) yaz("DUSUK COZUNURLUK (kisa kenar < 700 px)", dusukCozunurluk);
  if (asiriDikey.length) yaz("ASIRI DIKEY (oran < 0.45 — kartta cok kirpilir)", asiriDikey);
  if (kucukDosya.length) yaz("KUCUK DOSYA (< 60 KB — sikistirma izi olabilir)", kucukDosya);
  if (!dusukCozunurluk.length && !asiriDikey.length && !kucukDosya.length)
    console.log("  tamam — hepsi kabul edilebilir");

  /* ---------- 4. Canlı veritabanı ---------- */
  basiliklar("4. CANLI VERITABANI");

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.log("  DATABASE_URL yok, atlandı"); return; }
  const sql = postgres(dbUrl, { prepare: false, max: 1 });

  const [say] = await sql<{ urun: number; yayinda: number; gorsel: number }[]>`
    SELECT (SELECT count(*)::int FROM products)        AS urun,
           (SELECT count(*)::int FROM products WHERE yayinda) AS yayinda,
           (SELECT count(*)::int FROM product_images)  AS gorsel`;
  console.log(`  ${say.urun} ürün (${say.yayinda} yayında) · ${say.gorsel} görsel`);

  const mukerrerBaslik = await sql<{ baslik: string; n: number }[]>`
    SELECT baslik, count(*)::int AS n FROM products GROUP BY baslik HAVING count(*) > 1`;
  const mukerrerGorsel = await sql<{ url: string; n: number }[]>`
    SELECT url, count(DISTINCT urun_id)::int AS n FROM product_images
    GROUP BY url HAVING count(DISTINCT urun_id) > 1`;
  const gorselsiz = await sql<{ slug: string }[]>`
    SELECT p.slug FROM products p
    LEFT JOIN product_images i ON i.urun_id = p.id
    WHERE i.id IS NULL`;

  if (mukerrerBaslik.length) mukerrerBaslik.forEach((r) => console.log(`  ! başlık ${r.n} kez: ${r.baslik}`));
  if (mukerrerGorsel.length) mukerrerGorsel.forEach((r) => console.log(`  ! aynı görsel ${r.n} üründe: ${r.url.slice(-50)}`));
  if (gorselsiz.length) gorselsiz.forEach((r) => console.log(`  ! GÖRSELSİZ ürün: ${r.slug}`));
  if (!mukerrerBaslik.length && !mukerrerGorsel.length && !gorselsiz.length)
    console.log("  tamam — mükerrer kayıt ve görselsiz ürün yok");

  await sql.end();
  console.log("");
  if (bulgular.length) console.log(bulgular.join("\n"));
}

main().catch((e) => {
  console.error("Denetim başarısız:", e);
  process.exit(1);
});
