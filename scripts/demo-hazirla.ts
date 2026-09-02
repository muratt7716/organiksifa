/**
 * Demo verisini yükler — `npm run demo:hazirla`
 *
 * Önce `npm run demo:db` çalışıyor olmalı.
 *
 * Şemayı kurar, kategorileri ekler ve gerçek ürün görselleriyle
 * 4 ürün oluşturur. Görseller `scripts/demo-gorsel-hazirla.py` ile
 * tarayıcıdakiyle AYNI algoritmadan geçirilmiştir.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

const URL = process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:5433/postgres";

type Gorsel = {
  url: string;
  storagePath: string;
  genislik: number;
  yukseklik: number;
  zeminRengi: string;
};

const KOK = path.join(import.meta.dirname, "..");

const URUNLER = [
  {
    anahtar: "d-vitamini",
    baslik: "D Vitamini Altın Yağ Karışımı",
    slug: "d-vitamini-altin-yag-karisimi",
    kategori: "bitkisel-yaglar",
    fiyat: "890.00",
    eskiFiyat: "1090.00",
    kisa: "Altı bitkisel yağın damlalıklı şişede birleştiği günlük destek karışımı.",
    aciklama: `İçindekiler: İnci Çekirdeği Yağı, Çörekotu Yağı, Avokado Yağı, Susam Yağı, Üzüm Çekirdeği Yağı, Uçkindi Yağı.

Bitkisel yağların bir arada sunulduğu, damlalıklı 50 ml cam şişede karışım. Günlük rutine kolayca eklenebilir.

Kullanım: Günde bir kez, tercihen sabah aç karnına birkaç damla.

Saklama: Serin ve kuru yerde, doğrudan güneş ışığından uzakta saklayınız. Ambalajı açıldıktan sonra ağzı kapalı tutunuz.

Takviye edici gıdadır. Normal beslenmenin yerine geçmez. Hamilelik, emzirme döneminde veya düzenli ilaç kullanıyorsanız hekiminize danışınız.`,
    set: null as string[] | null,
    oneCikan: true,
  },
  {
    anahtar: "merhem",
    baslik: "Hücre Yenileyici Merhem",
    slug: "hucre-yenileyici-merhem",
    kategori: "cilt-bakimi",
    fiyat: "640.00",
    eskiFiyat: null as string | null,
    kisa: "Aloe vera, centella asiatica ve jojoba yağıyla zenginleştirilmiş bakım merhemi.",
    aciklama: `Doğal içerikler: Aloe Vera Özü, Centella Asiatica (Asya Pençesi) Özü, Jojoba Yağı, Üzüm Çekirdeği Yağı, E Vitamini, Lavanta Özü, Sarı Kantaron Özü.

Bitkisel özlerle hazırlanmış, günlük kullanıma uygun bakım merhemi. Amber cam kavanozda sunulur.

Kullanım alanları: Yüz ve boyun bakımı, kuru ve tahriş olmuş cilt, vücut bakımı.

Kullanım şekli: Temiz ve kuru cilde, ihtiyaç duyulan bölgeye ince bir tabaka hâlinde uygulayınız. Sabah ve akşam düzenli kullanım önerilir.

Paraben içermez. Koruyucu içermez. Tüm cilt tipleri için uygundur. İlk kullanımdan önce küçük bir alanda deneyiniz.`,
    set: null,
    oneCikan: true,
  },
  {
    anahtar: "uyuz-seti",
    baslik: "Doğal Bakım Seti — Krem, Solüsyon, Katran Sabunu, Kabak Lifi",
    slug: "dogal-bakim-seti",
    kategori: "setler",
    fiyat: "1250.00",
    eskiFiyat: "1490.00",
    kisa: "Dört ürünün bir arada sunulduğu, adım adım kullanılan doğal cilt bakım seti.",
    aciklama: `Set içeriği dört üründen oluşur ve sırayla kullanılmak üzere hazırlanmıştır.

1. Adım — Solüsyonu ilgili bölgeye püskürtün ve kurumasını bekleyin.
2. Adım — Katran sabunu ile cildinizi nazikçe temizleyin, ılık su ile durulayın.
3. Adım — Kremi temiz cilde ince bir tabaka hâlinde uygulayın.
4. Adım — Kabak lifi ile cildi nazikçe ovun.

Doğal içerikler kullanılmıştır. Cilt dostu formüller. Düzenli kullanımda daha iyi sonuç alınır.

Not: Bu ürünler kozmetik ürünlerdir; hastalıkları önleme, tedavi etme veya iyileştirme amacı taşımaz.`,
    set: ["Bakım kremi", "Bakım solüsyonu", "Katran sabunu", "Kabak lifi"],
    oneCikan: true,
  },
  {
    anahtar: "detox-seti",
    baslik: "Zayıflama ve Detoks Seti",
    slug: "zayiflama-ve-detoks-seti",
    kategori: "cay-detoks",
    fiyat: "980.00",
    eskiFiyat: null,
    kisa: "Bitki çayı ve konsantre içeceğin birlikte kullanıldığı günlük destek seti.",
    aciklama: `Set içeriği:

• Sundetox Bitki Çayı — 100 g (50 × 2 g süzen poşet). İçeriğinde cascara sagrada, yeşil çay, oolong ve zencefil bulunur.
• Sandetox Konsantre İçecek — 330 ml. Yaban mersinli, ananas sirkeli konsantre.

Kullanım şekli: Sabah ve akşam aç karnına 1 bardak bitki çayı tüketilir. Çayın ardından konsantre içecekten 2 tatlı kaşığı alınır. Çay aç, konsantre tok olarak kullanılır.

Doğal içeriklerle günlük destek. Takviye edici gıdadır, normal beslenmenin yerine geçmez.`,
    set: ["Sundetox Bitki Çayı 100 g", "Sandetox Konsantre İçecek 330 ml"],
    oneCikan: false,
  },
];

async function main() {
  const gorselYolu = path.join(KOK, "public", "demo", "gorseller.json");
  if (!fs.existsSync(gorselYolu)) {
    console.error(
      "public/demo/gorseller.json yok. Önce: python scripts/demo-gorsel-hazirla.py",
    );
    process.exit(1);
  }
  const gorseller: Record<string, Gorsel> = JSON.parse(
    fs.readFileSync(gorselYolu, "utf-8"),
  );

  const sql = postgres(URL, { prepare: false, max: 1 });

  console.log("Şema kuruluyor…");
  const migrationDir = path.join(KOK, "drizzle");
  const dosyalar = fs
    .readdirSync(migrationDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const dosya of dosyalar) {
    const icerik = fs.readFileSync(path.join(migrationDir, dosya), "utf-8");
    // drizzle-kit ifadeleri --> statement-breakpoint ile ayırır
    const ifadeler = icerik
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const ifade of ifadeler) {
      try {
        await sql.unsafe(ifade);
      } catch (e) {
        const mesaj = (e as Error).message;
        if (!/already exists|zaten/i.test(mesaj)) {
          console.error(`  ! ${dosya}: ${mesaj}`);
        }
      }
    }
    console.log(`  ✓ ${dosya}`);
  }

  console.log("\nAyarlar…");
  await sql`
    INSERT INTO settings (id, site_adi, whatsapp_numarasi, kargo_bedava_acik,
                          kargo_bedava_limit, kargo_ucreti, duyuru_metni, duyuru_acik,
                          iletisim_telefon, iletisim_email)
    VALUES (1, 'Organik Şifa', '905321112233', true, 750.00, 99.00,
            '750 ₺ üzeri kargo bedava · Siparişler 1-2 iş günü içinde hazırlanır',
            true, '0532 111 22 33', 'iletisim@organiksifa.com')
    ON CONFLICT (id) DO UPDATE SET
      whatsapp_numarasi = EXCLUDED.whatsapp_numarasi,
      duyuru_metni = EXCLUDED.duyuru_metni,
      duyuru_acik = EXCLUDED.duyuru_acik,
      iletisim_telefon = EXCLUDED.iletisim_telefon,
      iletisim_email = EXCLUDED.iletisim_email
  `;

  const KATEGORILER = [
    ["Setler", "setler", "Birlikte kullanılmak üzere hazırlanmış ürün setleri.", 10],
    ["Takviye Ürünler", "takviye-urunler", "Günlük destek için doğal takviye edici gıdalar.", 20],
    ["Cilt Bakımı", "cilt-bakimi", "Bitkisel özlerle hazırlanan krem ve merhemler.", 30],
    ["Bitkisel Yağlar", "bitkisel-yaglar", "Soğuk sıkım ve karışım bitkisel yağlar.", 40],
    ["Çay & Detoks", "cay-detoks", "Bitki çayları ve detoks destek ürünleri.", 50],
    ["Sabun & Temizlik", "sabun-temizlik", "El yapımı sabunlar ve doğal temizlik ürünleri.", 60],
  ] as const;

  console.log("Kategoriler…");
  for (const [ad, slug, aciklama, sira] of KATEGORILER) {
    await sql`
      INSERT INTO categories (ad, slug, aciklama, sira, aktif)
      VALUES (${ad}, ${slug}, ${aciklama}, ${sira}, true)
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  console.log("Ürünler…");
  for (const u of URUNLER) {
    const g = gorseller[u.anahtar];
    if (!g) {
      console.log(`  ! ${u.baslik} — görsel yok, atlandı`);
      continue;
    }

    const [kat] = await sql<{ id: string }[]>`
      SELECT id FROM categories WHERE slug = ${u.kategori}
    `;

    const [urun] = await sql<{ id: string }[]>`
      INSERT INTO products (baslik, slug, kisa_aciklama, aciklama, fiyat, eski_fiyat,
                            kategori_id, set_icerigi, stokta, yayinda, one_cikan, sira)
      VALUES (${u.baslik}, ${u.slug}, ${u.kisa}, ${u.aciklama}, ${u.fiyat},
              ${u.eskiFiyat}, ${kat?.id ?? null},
              ${u.set ? sql.array(u.set) : null},
              true, true, ${u.oneCikan}, 0)
      ON CONFLICT (slug) DO UPDATE SET
        fiyat = EXCLUDED.fiyat, aciklama = EXCLUDED.aciklama
      RETURNING id
    `;

    await sql`DELETE FROM product_images WHERE urun_id = ${urun.id}`;
    await sql`
      INSERT INTO product_images (urun_id, url, storage_path, alt, genislik, yukseklik,
                                  zemin_rengi, tur, yayinda, sira)
      VALUES (${urun.id}, ${g.url}, ${g.storagePath}, ${u.baslik},
              ${g.genislik}, ${g.yukseklik}, ${g.zeminRengi}, 'kapak', true, 0)
    `;

    console.log(`  ✓ ${u.baslik}  (zemin ${g.zeminRengi})`);
  }

  console.log("\nÖrnek yorumlar…");
  const [ilkUrun] = await sql<{ id: string }[]>`
    SELECT id FROM products WHERE slug = 'hucre-yenileyici-merhem'
  `;
  if (ilkUrun) {
    await sql`DELETE FROM reviews WHERE urun_id = ${ilkUrun.id}`;
    await sql`
      INSERT INTO reviews (urun_id, ad, puan, yorum, durum, dogrulanmis_alici, onay_at)
      VALUES
        (${ilkUrun.id}, 'Ayşe K.', 5,
         'Kokusu çok hoş, cildimde ağırlık bırakmıyor. İkinci kavanozu aldım.',
         'onayli', true, now()),
        (${ilkUrun.id}, 'Meltem D.', 4,
         'Kavanoz küçük geldi ama içeriği gerçekten doğal. Memnunum.',
         'onayli', false, now()),
        (${ilkUrun.id}, 'Zeynep A.', 5,
         'Kargo hızlıydı, paketleme özenliydi. Teşekkürler.',
         'bekliyor', false, null)
    `;
    await sql`
      UPDATE products SET ortalama_puan = 4.5, yorum_sayisi = 2 WHERE id = ${ilkUrun.id}
    `;
    console.log("  ✓ 2 onaylı + 1 onay bekleyen yorum");
  }

  const [{ n: urunSayisi }] = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM products
  `;

  await sql.end();

  console.log("\n" + "=".repeat(46));
  console.log(`Demo hazır — ${urunSayisi} ürün yüklendi.`);
  console.log("  Mağaza : http://localhost:3000");
  console.log("  Panel  : http://localhost:3000/panel");
  console.log("=".repeat(46) + "\n");
}

main().catch((e) => {
  console.error("\nDemo hazırlanamadı:", e);
  process.exit(1);
});
