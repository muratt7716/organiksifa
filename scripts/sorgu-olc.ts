/**
 * Panel sayfalarının attığı sorguları tek tek ölçer — `npx tsx scripts/sorgu-olc.ts`
 *
 * Amaç: "sayfa 1.3 sn sürüyor" bilgisini "hangi sorgu kaç ms" seviyesine indirmek.
 * Havuza giden her tur ayrı ölçülür; toplam, sıralı çalıştırmanın gerçek maliyetidir.
 */
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
  });

  const olc = async (ad: string, calistir: () => Promise<unknown>) => {
    const t0 = performance.now();
    await calistir();
    const ms = Math.round(performance.now() - t0);
    console.log(`${String(ms).padStart(5)} ms  ${ad}`);
    return ms;
  };

  console.log("\nİLK BAĞLANTI (TCP + TLS + auth dahil)");
  console.log("=".repeat(50));
  await olc("ilk sorgu (bağlantı kurulumu dahil)", () => sql`SELECT 1`);

  console.log("\nBAĞLANTI SICAKKEN — panel sorguları");
  console.log("=".repeat(50));
  const sureler: number[] = [];
  sureler.push(await olc("SELECT 1 (saf gidiş-dönüş)", () => sql`SELECT 1`));
  sureler.push(
    await olc("ayarlar (her sayfada okunur)", () => sql`
      SELECT * FROM settings WHERE id = 1`),
  );
  sureler.push(
    await olc("bekleyen sayılar (yerleşimde)", () => sql`
      SELECT
        (SELECT count(*) FROM orders WHERE durum = 'yeni')        AS siparis,
        (SELECT count(*) FROM reviews WHERE durum = 'bekliyor')   AS yorum`),
  );
  sureler.push(
    await olc("ürün listesi + kapak görselleri", () => sql`
      SELECT p.*, i.url
      FROM products p
      LEFT JOIN product_images i ON i.urun_id = p.id AND i.sira = 0
      ORDER BY p.baslik`),
  );
  sureler.push(
    await olc("kategoriler", () => sql`
      SELECT * FROM categories ORDER BY sira`),
  );
  sureler.push(
    await olc("siparişler (son 50)", () => sql`
      SELECT * FROM orders ORDER BY olusturuldu_at DESC LIMIT 50`),
  );

  const toplam = sureler.reduce((a, b) => a + b, 0);
  const ortalama = Math.round(toplam / sureler.length);

  console.log("=".repeat(50));
  console.log(`toplam ${toplam} ms · sorgu başına ortalama ${ortalama} ms`);
  console.log(
    `\nBir panel sayfası 2-3 sorgu atıyor. Sıralı çalışırsa ` +
      `${ortalama * 3} ms civarı bekleniyor.`,
  );

  console.log("\nPARALEL vs SIRALI (aynı 3 sorgu)");
  console.log("=".repeat(50));
  const t1 = performance.now();
  await sql`SELECT * FROM settings WHERE id = 1`;
  await sql`SELECT * FROM categories ORDER BY sira`;
  await sql`SELECT count(*) FROM orders`;
  console.log(`${String(Math.round(performance.now() - t1)).padStart(5)} ms  sıralı`);

  const t2 = performance.now();
  await Promise.all([
    sql`SELECT * FROM settings WHERE id = 1`,
    sql`SELECT * FROM categories ORDER BY sira`,
    sql`SELECT count(*) FROM orders`,
  ]);
  console.log(`${String(Math.round(performance.now() - t2)).padStart(5)} ms  paralel`);

  await sql.end();
}

main();
