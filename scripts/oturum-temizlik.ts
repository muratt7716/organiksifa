/**
 * Bu oturumdaki panel testinin bıraktığı kayıtları siler ve ayarları geri alır.
 *
 * `npm run temizle` yalnızca "Test Ürünü %" ürünlerini ve "Otomatik Test"
 * siparişlerini hedefler; elle yapılan panel testi başka adlar kullandığı için
 * bu betik onları tamamlıyor. Hedefler adlarıyla sınırlıdır — gerçek veriye
 * dokunmaz.
 *
 *   npx tsx scripts/oturum-temizlik.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL tanımlı değil.");
    process.exit(1);
  }

  const sql = postgres(url, { prepare: false, max: 1 });

  const yorum = await sql`
    DELETE FROM reviews WHERE ad = 'Test Yorumcu' RETURNING id`;
  console.log(`yorum silindi:    ${yorum.length}`);

  const siparis = await sql`
    DELETE FROM orders WHERE musteri_adi = 'Test Müşteri' RETURNING siparis_no`;
  console.log(
    `sipariş silindi:  ${siparis.length} ${siparis.map((r) => r.siparis_no).join(", ")}`,
  );

  const kategori = await sql`
    DELETE FROM categories WHERE ad = 'Test Kategori Yeni Ad' RETURNING ad`;
  console.log(`kategori silindi: ${kategori.length}`);

  // Ayarları test öncesi hâline döndür.
  await sql`
    UPDATE settings SET
      whatsapp_numarasi  = '',
      duyuru_metni       = '',
      duyuru_acik        = false,
      kargo_bedava_limit = 750`;
  console.log("ayarlar geri alındı (whatsapp boş, duyuru kapalı, limit 750)");

  const [kalan] = await sql`
    SELECT
      (SELECT count(*) FROM products)               AS urun,
      (SELECT count(*) FROM products WHERE yayinda) AS yayinda,
      (SELECT count(*) FROM orders)                 AS siparis,
      (SELECT count(*) FROM reviews)                AS yorum,
      (SELECT count(*) FROM categories)             AS kategori`;
  console.log("\nkalan:", kalan);

  await sql.end();
}

main();
