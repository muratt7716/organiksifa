/**
 * supabase/kurulum.sql dosyasını GERÇEK bir PostgreSQL üzerinde çalıştırıp
 * doğrular — `npm run sql:dogrula`
 *
 * PGlite (WASM'a derlenmiş gerçek PostgreSQL) kullanılır; Docker gerekmez.
 * Amaç: Supabase'e yapıştırmadan önce SQL'in gerçekten çalıştığından emin olmak.
 */
import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

const BEKLENEN_TABLOLAR = [
  "admin_profiles",
  "brands",
  "categories",
  "order_events",
  "order_items",
  "orders",
  "product_images",
  "products",
  "rate_limits",
  "reviews",
  "settings",
];

async function main() {
  const yol = path.join(import.meta.dirname, "..", "supabase", "kurulum.sql");
  const sqlMetni = fs.readFileSync(yol, "utf-8");

  console.log("Temiz bir PostgreSQL açılıyor (bellek içi)…\n");
  const db = new PGlite(); // bellek içi — diskte iz bırakmaz

  // --- 1. Dosyayı olduğu gibi çalıştır ---
  try {
    await db.exec(sqlMetni);
    console.log("✓ kurulum.sql hatasız çalıştı");
  } catch (e) {
    console.error("✗ kurulum.sql HATA verdi:\n");
    console.error((e as Error).message);
    process.exit(1);
  }

  // --- 2. Tablolar ---
  const tablolar = await db.query<{ tablename: string }>(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY 1`,
  );
  const bulunan = tablolar.rows.map((r) => r.tablename);
  const eksik = BEKLENEN_TABLOLAR.filter((t) => !bulunan.includes(t));

  if (eksik.length) {
    console.error(`✗ eksik tablo: ${eksik.join(", ")}`);
    process.exit(1);
  }
  console.log(`✓ ${BEKLENEN_TABLOLAR.length} tablo oluştu`);

  // --- 3. Sipariş numarası üreteci ---
  const no1 = await db.query<{ no: string }>(`SELECT yeni_siparis_no() AS no`);
  const no2 = await db.query<{ no: string }>(`SELECT yeni_siparis_no() AS no`);
  const a = no1.rows[0].no;
  const b = no2.rows[0].no;

  if (a !== "ORD-000001" || b !== "ORD-000002") {
    console.error(`✗ sipariş numarası beklenmedik: ${a}, ${b}`);
    process.exit(1);
  }
  console.log(`✓ sipariş numarası üreteci: ${a} → ${b} (çakışmıyor)`);

  // --- 4. RLS ---
  const rls = await db.query<{ relname: string; relrowsecurity: boolean }>(
    `SELECT c.relname, c.relrowsecurity
     FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public' AND c.relkind = 'r' ORDER BY 1`,
  );
  const rlsKapali = rls.rows.filter((r) => !r.relrowsecurity).map((r) => r.relname);
  if (rlsKapali.length) {
    console.error(`✗ RLS kapalı tablolar: ${rlsKapali.join(", ")}`);
    process.exit(1);
  }
  console.log(`✓ ${rls.rows.length} tabloda RLS açık (müşteri verisi dışarı kapalı)`);

  // --- 5. Başlangıç verisi ---
  const kat = await db.query<{ n: number }>(
    `SELECT count(*)::int AS n FROM categories`,
  );
  const ayar = await db.query<{ n: number }>(`SELECT count(*)::int AS n FROM settings`);
  if (kat.rows[0].n !== 6 || ayar.rows[0].n !== 1) {
    console.error(
      `✗ başlangıç verisi eksik: ${kat.rows[0].n} kategori, ${ayar.rows[0].n} ayar`,
    );
    process.exit(1);
  }
  console.log(`✓ başlangıç verisi: 6 kategori, 1 ayar satırı`);

  // --- 6. Tekrar çalıştırılabilir mi (idempotent) ---
  try {
    await db.exec(sqlMetni);
    const kat2 = await db.query<{ n: number }>(
      `SELECT count(*)::int AS n FROM categories`,
    );
    if (kat2.rows[0].n !== 6) {
      console.error(`✗ ikinci çalıştırmada kategori sayısı bozuldu: ${kat2.rows[0].n}`);
      process.exit(1);
    }
    console.log("✓ ikinci kez çalıştırıldı — veri bozulmadı (güvenle tekrarlanabilir)");
  } catch (e) {
    console.error("✗ ikinci çalıştırmada hata:", (e as Error).message);
    process.exit(1);
  }

  // --- 7. Gerçek bir sipariş yaz/oku ---
  await db.exec(`
    INSERT INTO products (baslik, slug, fiyat) VALUES ('Test', 'test-urun', 100.00);
    INSERT INTO orders (siparis_no, idempotency_key, musteri_adi, telefon,
                        telefon_e164, il, ilce, adres, ara_toplam, toplam)
    VALUES (yeni_siparis_no(), gen_random_uuid(), 'Ayşe Kaya', '0532 111 22 33',
            '905321112233', 'İstanbul', 'Kadıköy', 'Test adres', 100.00, 199.00);
  `);
  const siparis = await db.query<{ siparis_no: string; musteri_adi: string }>(
    `SELECT siparis_no, musteri_adi FROM orders`,
  );
  console.log(
    `✓ örnek sipariş yazıldı ve okundu: ${siparis.rows[0].siparis_no} — ${siparis.rows[0].musteri_adi}`,
  );

  await db.close();

  console.log("\n" + "=".repeat(56));
  console.log("supabase/kurulum.sql GERÇEK PostgreSQL üzerinde doğrulandı.");
  console.log("Supabase SQL Editor'a güvenle yapıştırabilirsin.");
  console.log("=".repeat(56) + "\n");
}

main().catch((e) => {
  console.error("\nDoğrulama çöktü:", e);
  process.exit(1);
});
