/**
 * Test verisini temizler — `npm run temizle`
 *
 * `npm run test:panel` çalıştırıldığında veritabanına gerçek kayıtlar yazılır:
 * "Test Ürünü …" adında ürünler ve "Otomatik Test" adına siparişler.
 * Bu betik onları veritabanından ve Storage'dan kalıcı olarak siler.
 *
 * Gerçek ürünlere ve gerçek siparişlere DOKUNMAZ — yalnızca test
 * imzasına birebir uyan kayıtları hedefler.
 *
 * Kuru çalıştırma (hiçbir şey silmez, ne silineceğini gösterir):
 *   npm run temizle -- --kuru
 */
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

const KURU = process.argv.includes("--kuru");
const URUN_DESENI = "Test Ürünü %";
const MUSTERI_ADI = "Otomatik Test";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL tanımlı değil.");
    process.exit(1);
  }

  const sql = postgres(url, { prepare: false, max: 1 });

  console.log(
    `\nTest verisi temizliği${KURU ? " (KURU ÇALIŞTIRMA — hiçbir şey silinmez)" : ""}\n` +
      "=".repeat(46),
  );

  /* ---------------- Ürünler ---------------- */
  const urunler = await sql<{ id: string; baslik: string }[]>`
    SELECT id, baslik FROM products WHERE baslik LIKE ${URUN_DESENI}
  `;

  const gorseller = urunler.length
    ? await sql<{ storage_path: string }[]>`
        SELECT storage_path FROM product_images
        WHERE urun_id IN ${sql(urunler.map((u) => u.id))}
      `
    : [];

  console.log(`\nÜrünler (${urunler.length})`);
  urunler.forEach((u) => console.log(`  - ${u.baslik}`));
  console.log(`  ${gorseller.length} fotoğraf dosyası`);

  /* ---------------- Siparişler ---------------- */
  const siparisler = await sql<{ id: string; siparis_no: string }[]>`
    SELECT id, siparis_no FROM orders WHERE musteri_adi = ${MUSTERI_ADI}
  `;
  console.log(`\nSiparişler (${siparisler.length})`);
  siparisler.forEach((s) => console.log(`  - ${s.siparis_no}`));

  if (urunler.length === 0 && siparisler.length === 0) {
    console.log("\nTemizlenecek test verisi yok.\n");
    await sql.end();
    return;
  }

  if (KURU) {
    console.log("\nKuru çalıştırma — hiçbir şey silinmedi.");
    console.log("Gerçekten silmek için: npm run temizle\n");
    await sql.end();
    return;
  }

  /* ---------------- Silme ---------------- */
  if (gorseller.length && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const servis = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } },
    );
    const { error } = await servis.storage
      .from("urunler")
      .remove(gorseller.map((g) => g.storage_path));
    console.log(
      error
        ? `\n! Storage dosyaları silinemedi: ${error.message}`
        : `\n✓ ${gorseller.length} fotoğraf depodan silindi`,
    );
  }

  if (siparisler.length) {
    // order_items ve order_events cascade ile birlikte gider.
    await sql`DELETE FROM orders WHERE musteri_adi = ${MUSTERI_ADI}`;
    console.log(`✓ ${siparisler.length} sipariş silindi`);
  }

  if (urunler.length) {
    // product_images ve reviews cascade ile birlikte gider.
    await sql`DELETE FROM products WHERE baslik LIKE ${URUN_DESENI}`;
    console.log(`✓ ${urunler.length} ürün silindi`);
  }

  const [{ u }] = await sql<{ u: number }[]>`
    SELECT count(*)::int AS u FROM products
  `;
  const [{ s }] = await sql<{ s: number }[]>`
    SELECT count(*)::int AS s FROM orders
  `;

  await sql.end();

  console.log("\n" + "=".repeat(46));
  console.log(`Temizlendi. Kalan: ${u} ürün, ${s} sipariş.\n`);
}

main().catch((e) => {
  console.error("\nTemizlik başarısız:", e);
  process.exit(1);
});
