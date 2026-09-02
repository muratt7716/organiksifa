/**
 * Kurulum doğrulama — `npm run dogrula`
 *
 * Supabase kurulduktan sonra çalıştır. Her adımı gerçekten dener; tahmin etmez.
 * Eksik olan her şey için ne yapman gerektiğini yazar.
 */
import "dotenv/config";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

type Sonuc = { ad: string; durum: "ok" | "hata" | "uyari"; not: string };
const sonuclar: Sonuc[] = [];

function ekle(ad: string, durum: Sonuc["durum"], not = "") {
  sonuclar.push({ ad, durum, not });
  const simge = durum === "ok" ? "✓" : durum === "uyari" ? "!" : "✗";
  console.log(`${simge} ${ad}${not ? ` — ${not}` : ""}`);
}

const GEREKLI_TABLOLAR = [
  "settings",
  "categories",
  "brands",
  "products",
  "product_images",
  "orders",
  "order_items",
  "order_events",
  "reviews",
  "rate_limits",
  "admin_profiles",
];

async function main() {
  console.log("\nOrganik Şifa — kurulum doğrulaması\n" + "=".repeat(40) + "\n");

  /* ---------------- 1. Ortam değişkenleri ---------------- */
  const gerekli = [
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  const eksik = gerekli.filter((k) => !process.env[k]);
  if (eksik.length) {
    ekle("Ortam değişkenleri", "hata", `eksik: ${eksik.join(", ")}`);
    console.log("\n.env.example dosyasını .env.local olarak kopyalayıp doldur.\n");
    process.exit(1);
  }
  ekle("Ortam değişkenleri", "ok", `${gerekli.length} değişken tanımlı`);

  if (!process.env.DATABASE_URL!.includes(":6543")) {
    ekle(
      "DATABASE_URL portu",
      "uyari",
      "6543 (transaction pooler) bekleniyordu — serverless'te bağlantı tükenebilir",
    );
  } else {
    ekle("DATABASE_URL portu", "ok", "6543 transaction pooler");
  }

  /* ---------------- 2. Veritabanı bağlantısı ---------------- */
  const sql = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 1,
    idle_timeout: 5,
  });

  try {
    const [{ sürüm }] = await sql<{ sürüm: string }[]>`SELECT version() AS "sürüm"`;
    ekle("Veritabanı bağlantısı", "ok", sürüm.split(",")[0]);
  } catch (e) {
    ekle("Veritabanı bağlantısı", "hata", (e as Error).message);
    await sql.end();
    process.exit(1);
  }

  /* ---------------- 3. Tablolar ---------------- */
  const tablolar = await sql<{ table_name: string }[]>`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
  `;
  const mevcut = new Set(tablolar.map((t) => t.table_name));
  const eksikTablo = GEREKLI_TABLOLAR.filter((t) => !mevcut.has(t));

  if (eksikTablo.length) {
    ekle("Tablolar", "hata", `eksik: ${eksikTablo.join(", ")} → npm run db:migrate`);
  } else {
    ekle("Tablolar", "ok", `${GEREKLI_TABLOLAR.length} tablo hazır`);
  }

  /* ---------------- 4. Sipariş numarası üreteci ---------------- */
  try {
    const [{ no }] = await sql<{ no: string }[]>`SELECT yeni_siparis_no() AS no`;
    if (/^ORD-\d{6}$/.test(no)) {
      ekle("Sipariş numarası üreteci", "ok", `örnek: ${no}`);
    } else {
      ekle("Sipariş numarası üreteci", "uyari", `beklenmedik biçim: ${no}`);
    }
  } catch {
    ekle(
      "Sipariş numarası üreteci",
      "hata",
      "yeni_siparis_no() yok → drizzle/9999_siparis_no_sequence.sql dosyasını Supabase SQL Editor'da çalıştır",
    );
  }

  /* ---------------- 5. Başlangıç verisi ---------------- */
  if (mevcut.has("settings")) {
    const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM settings`;
    if (n > 0) ekle("Ayar satırı", "ok");
    else ekle("Ayar satırı", "hata", "yok → npm run db:seed");
  }

  if (mevcut.has("categories")) {
    const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM categories`;
    if (n > 0) ekle("Kategoriler", "ok", `${n} kategori`);
    else ekle("Kategoriler", "hata", "yok → npm run db:seed");
  }

  /* ---------------- 6. WhatsApp numarası ---------------- */
  if (mevcut.has("settings")) {
    const [ayar] = await sql<{ whatsapp_numarasi: string | null }[]>`
      SELECT whatsapp_numarasi FROM settings WHERE id = 1
    `;
    const wa = ayar?.whatsapp_numarasi;
    if (!wa) {
      ekle(
        "WhatsApp numarası",
        "uyari",
        "girilmemiş → Panel > Ayarlar'dan gir, yoksa sipariş butonları çalışmaz",
      );
    } else if (/^90\d{10}$/.test(wa)) {
      ekle("WhatsApp numarası", "ok", `+${wa}`);
    } else {
      ekle("WhatsApp numarası", "hata", `geçersiz biçim: ${wa}`);
    }
  }

  /* ---------------- 7. Ürün durumu ---------------- */
  if (mevcut.has("products")) {
    const [{ toplam, yayinda }] = await sql<{ toplam: number; yayinda: number }[]>`
      SELECT count(*)::int AS toplam,
             count(*) FILTER (WHERE products.yayinda)::int AS yayinda
      FROM products
    `;
    ekle(
      "Ürünler",
      toplam > 0 ? "ok" : "uyari",
      `${toplam} ürün, ${yayinda} yayında`,
    );
  }

  await sql.end();

  /* ---------------- 8. Supabase Storage ---------------- */
  const servis = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const { data: kovalar, error: kovaHata } = await servis.storage.listBuckets();
  if (kovaHata) {
    ekle("Storage erişimi", "hata", kovaHata.message);
  } else {
    const kova = kovalar?.find((k) => k.name === "urunler");
    if (!kova) {
      ekle(
        "Storage kovası",
        "hata",
        "'urunler' yok → Supabase > Storage > New bucket, PUBLIC olarak aç",
      );
    } else if (!kova.public) {
      ekle(
        "Storage kovası",
        "hata",
        "'urunler' public DEĞİL → görseller görünmez ve trafik kotası erken dolar",
      );
    } else {
      ekle("Storage kovası", "ok", "'urunler' public");
    }
  }

  /* ---------------- 9. Yükleme denemesi (gerçek) ---------------- */
  try {
    const yol = `dogrulama/${crypto.randomUUID()}.txt`;
    const { error: yukHata } = await servis.storage
      .from("urunler")
      .upload(yol, new Blob(["dogrulama"]), { contentType: "text/plain" });
    if (yukHata) throw yukHata;
    await servis.storage.from("urunler").remove([yol]);
    ekle("Storage yazma testi", "ok", "dosya yüklendi ve silindi");
  } catch (e) {
    ekle("Storage yazma testi", "hata", (e as Error).message);
  }

  /* ---------------- 10. Yönetici hesapları ---------------- */
  try {
    const { data, error } = await servis.auth.admin.listUsers();
    if (error) throw error;
    const n = data.users.length;
    if (n === 0) {
      ekle(
        "Yönetici hesabı",
        "hata",
        "yok → Supabase > Authentication > Users > Add user (Auto Confirm işaretle)",
      );
    } else {
      ekle("Yönetici hesabı", "ok", `${n} kullanıcı`);
    }
  } catch (e) {
    ekle("Yönetici hesabı", "hata", (e as Error).message);
  }

  /* ---------------- 11. Bildirim ---------------- */
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const r = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`,
      );
      ekle(
        "Telegram botu",
        r.ok ? "ok" : "hata",
        r.ok ? "bot erişilebilir" : `HTTP ${r.status}`,
      );
    } catch (e) {
      ekle("Telegram botu", "hata", (e as Error).message);
    }
  } else {
    ekle("Telegram botu", "uyari", "ayarlanmamış — sipariş bildirimi gelmez");
  }

  /* ---------------- Özet ---------------- */
  const hata = sonuclar.filter((s) => s.durum === "hata").length;
  const uyari = sonuclar.filter((s) => s.durum === "uyari").length;

  console.log("\n" + "=".repeat(40));
  if (hata === 0) {
    console.log(`HAZIR. ${uyari} uyarı var, ${sonuclar.length - uyari} kontrol geçti.`);
    console.log("Şimdi çalıştır: npm run test:panel");
  } else {
    console.log(`${hata} HATA, ${uyari} uyarı. Yukarıdaki adımları tamamla.`);
  }
  console.log("");

  process.exit(hata === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("\nDoğrulama çöktü:", e);
  process.exit(1);
});
