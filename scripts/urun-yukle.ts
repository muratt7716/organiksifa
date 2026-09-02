/**
 * Hazırlanmış ürün görsellerini Supabase Storage'a yükler ve ürünü
 * veritabanına ekler — `npm run urun:yukle [klasor]`
 *
 * Önce görselleri hazırla:
 *   python scripts/urun-gorsel-hazirla.py test-urun
 *
 * Klasör adı aşağıdaki URUNLER listesindeki bir anahtarla eşleşmeli.
 * Aynı slug ile tekrar çalıştırılırsa ürün güncellenir, kopyası oluşmaz.
 */
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

const KOK = path.join(import.meta.dirname, "..");
const KOVA = "urunler";

type HazirGorsel = {
  dosya: string;
  genislik: number;
  yukseklik: number;
  zeminRengi: string;
  tur: string;
  sira: number;
};

type UrunTanimi = {
  klasor: string;
  baslik: string;
  slug: string;
  kategoriSlug: string;
  fiyat: string;
  eskiFiyat: string | null;
  kisa: string;
  aciklama: string;
  setIcerigi: string[] | null;
  oneCikan: boolean;
};

const URUNLER: UrunTanimi[] = [
  {
    klasor: "test-urun",
    baslik: "Zeytin Yaprağı & Adaçayı Bitki Çayı",
    slug: "zeytin-yapragi-adacayi-bitki-cayi",
    kategoriSlug: "cay-detoks",
    fiyat: "240.00",
    eskiFiyat: "290.00",
    kisa:
      "Ege'den toplanan zeytin yaprağı ve adaçayının süzen poşette buluştuğu " +
      "günlük bitki çayı. 20 poşet.",
    aciklama: `İçindekiler: Zeytin yaprağı, adaçayı, ıhlamur, biberiye.

Ege bölgesinden toplanan bitkilerle hazırlanan, günlük tüketime uygun bitki çayı. Süzen poşet formunda, 20 adet. Aroma, koruyucu ve renklendirici içermez.

Hazırlanışı: Bir poşeti bir bardak kaynar suya koyun, 4-5 dakika demleyin. Poşeti çıkarın. Günde 1-2 bardak tüketilebilir.

Net miktar: 40 g (20 × 2 g)
Saklama: Serin, kuru ve ışık almayan yerde, ağzı kapalı olarak saklayınız.

Takviye edici gıdadır. Normal beslenmenin yerine geçmez. Hamilelik ve emzirme döneminde veya düzenli ilaç kullanıyorsanız hekiminize danışınız.`,
    setIcerigi: null,
    oneCikan: true,
  },
  {
    klasor: "urun-lavanta",
    baslik: "Lavanta & Papatya Rahatlatıcı Yağ",
    slug: "lavanta-papatya-rahatlatici-yag",
    kategoriSlug: "bitkisel-yaglar",
    fiyat: "420.00",
    eskiFiyat: null,
    kisa:
      "Lavanta ve papatya özleriyle hazırlanan, damlalıklı şişede masaj ve " +
      "cilt bakım yağı. 50 ml.",
    aciklama: `İçindekiler: Tatlı badem yağı, lavanta özü, papatya özü, jojoba yağı, E vitamini.

Soğuk sıkım taşıyıcı yağların lavanta ve papatya özleriyle birleştiği karışım. Amber cam damlalıklı şişede, 50 ml.

Kullanım: Temiz cilde birkaç damla damlatıp nazikçe masaj yapınız. Akşam kullanımı için uygundur.

Net miktar: 50 ml
Saklama: Serin ve kuru yerde, doğrudan güneş ışığından uzakta saklayınız.

Kozmetik üründür. Hastalıkları önleme, tedavi etme veya iyileştirme amacı taşımaz. İlk kullanımdan önce küçük bir alanda deneyiniz.`,
    setIcerigi: null,
    oneCikan: true,
  },
  {
    klasor: "urun-sabun",
    baslik: "Zeytinyağlı Kekik Sabunu",
    slug: "zeytinyagli-kekik-sabunu",
    kategoriSlug: "sabun-temizlik",
    fiyat: "160.00",
    eskiFiyat: "195.00",
    kisa:
      "Soğuk yöntemle üretilen, zeytinyağı ve kekik özlü el yapımı sabun. " +
      "120 g kalıp.",
    aciklama: `İçindekiler: Zeytinyağı, hindistan cevizi yağı, kekik özü, su, sodyum hidroksit (sabunlaşmada tamamı tükenir).

Soğuk yöntemle üretilip dört hafta dinlendirilen el yapımı sabun. Her kalıp elle kesildiği için ölçüleri birbirinden az da olsa farklı olabilir.

Kullanım: Yüz ve vücutta günlük temizlik için kullanılabilir. Kullanım sonrası kuru bir yerde bekletiniz; suda bırakılırsa çabuk erir.

Net miktar: 120 g (± 10 g)
Palm yağı içermez. Sentetik koku ve renklendirici içermez.

Kozmetik üründür. Gözle temasından kaçınınız.`,
    setIcerigi: null,
    oneCikan: true,
  },
  {
    klasor: "urun-d-vitamini",
    baslik: "D Vitamini Altın Yağ Karışımı",
    slug: "d-vitamini-altin-yag-karisimi",
    kategoriSlug: "bitkisel-yaglar",
    fiyat: "890.00",
    eskiFiyat: "1090.00",
    kisa: "Altı bitkisel yağın damlalıklı şişede birleştiği günlük destek karışımı.",
    aciklama: `İçindekiler: İnci Çekirdeği Yağı, Çörekotu Yağı, Avokado Yağı, Susam Yağı, Üzüm Çekirdeği Yağı, Uçukindi Yağı.

Bitkisel yağların bir arada sunulduğu, damlalıklı 50 ml cam şişede karışım. Günlük rutine kolayca eklenebilir.

Kullanım: Günde bir kez, tercihen sabah aç karnına birkaç damla.

Saklama: Serin ve kuru yerde, doğrudan güneş ışığından uzakta saklayınız. Ambalajı açıldıktan sonra ağzı kapalı tutunuz.

Takviye edici gıdadır. Normal beslenmenin yerine geçmez. Hamilelik, emzirme döneminde veya düzenli ilaç kullanıyorsanız hekiminize danışınız.`,
    setIcerigi: null,
    oneCikan: true,
  },
  {
    klasor: "urun-merhem",
    baslik: "Hücre Yenileyici Merhem",
    slug: "hucre-yenileyici-merhem",
    kategoriSlug: "cilt-bakimi",
    fiyat: "640.00",
    eskiFiyat: null,
    kisa: "Aloe vera, centella asiatica ve jojoba yağıyla zenginleştirilmiş bakım merhemi.",
    aciklama: `Doğal içerikler: Aloe Vera Özü, Centella Asiatica (Asya Pençesi) Özü, Jojoba Yağı, Üzüm Çekirdeği Yağı, E Vitamini, Lavanta Özü, Sarı Kantaron Özü.

Bitkisel özlerle hazırlanmış, günlük kullanıma uygun bakım merhemi. Koyu amber cam kavanozda sunulur.

Kullanım alanları: Yüz ve boyun bakımı, kuru ve tahriş olmuş cilt, vücut bakımı.

Kullanım şekli: Temiz ve kuru cilde, ihtiyaç duyulan bölgeye ince bir tabaka hâlinde uygulayınız. Sabah ve akşam düzenli kullanım önerilir.

Paraben içermez. Koruyucu içermez. Tüm cilt tipleri için uygundur. İlk kullanımdan önce küçük bir alanda deneyiniz.`,
    setIcerigi: null,
    oneCikan: true,
  },
  {
    klasor: "urun-bakim-seti",
    baslik: "Doğal Bakım Seti — Krem, Solüsyon, Katran Sabunu, Kabak Lifi",
    slug: "dogal-bakim-seti",
    kategoriSlug: "setler",
    fiyat: "1250.00",
    eskiFiyat: "1490.00",
    kisa: "Dört ürünün bir arada sunulduğu, adım adım kullanılan doğal cilt bakım seti.",
    aciklama: `Set içeriği dört üründen oluşur ve sırayla kullanılmak üzere hazırlanmıştır:

1. Adım — Solüsyonu ilgili bölgeye püskürtün ve kurumasını bekleyin.
2. Adım — Katran sabunu ile cildinizi nazikçe temizleyin, ılık su ile durulayın.
3. Adım — Kremi temiz cilde ince bir tabaka hâlinde uygulayın.
4. Adım — Kabak lifi ile cildi nazikçe ovun.

Doğal içerikler kullanılmıştır. Cilt dostu formüller. Düzenli kullanımda daha iyi sonuç alınır.

Not: Bu ürünler kozmetik ürünlerdir; hastalıkları önleme, tedavi etme veya iyileştirme amacı taşımaz.`,
    setIcerigi: ["Bakım kremi", "Bakım solüsyonu", "Katran sabunu", "Kabak lifi"],
    oneCikan: true,
  },
  {
    klasor: "urun-detoks-seti",
    baslik: "Zayıflama ve Detoks Seti",
    slug: "zayiflama-ve-detoks-seti",
    kategoriSlug: "cay-detoks",
    fiyat: "980.00",
    eskiFiyat: null,
    kisa: "Bitki çayı ve konsantre içeceğin birlikte kullanıldığı günlük destek seti.",
    aciklama: `Set içeriği:

• Sundetox Bitki Çayı — 100 g (50 × 2 g süzen poşet). İçeriğinde cascara sagrada, yeşil çay, oolong ve zencefil bulunur.
• Sandetox Konsantre İçecek — 330 ml. Yaban mersinli, ananas sirkeli konsantre.

Kullanım şekli: Sabah ve akşam aç karnına 1 bardak bitki çayı tüketilir. Çayın ardından konsantre içecekten 2 tatlı kaşığı alınır. Çay aç, konsantre tok olarak kullanılır.

Doğal içeriklerle günlük destek. Takviye edici gıdadır, normal beslenmenin yerine geçmez.`,
    setIcerigi: ["Sundetox Bitki Çayı 100 g", "Sandetox Konsantre İçecek 330 ml"],
    oneCikan: false,
  },
  {
    klasor: "urun-kan-yapici-set",
    baslik: "Kan Yapıcı Set — Çelik Suyu, Macun, D Vitamini, Mumiyo",
    slug: "kan-yapici-set",
    kategoriSlug: "setler",
    fiyat: "1350.00",
    eskiFiyat: "1600.00",
    kisa: "Çelik suyu, bitkisel macun, damlalıklı D vitamini ve mumiyo içeren takviye seti.",
    aciklama: `Set içeriği:

1. Çelik Suyu — Şişede özel bitkisel solüsyon.
2. Kan Yapıcı Macun — Koyu cam kavanozda bitkisel macun.
3. D Vitamini — Amber cam şişede damlalık.
4. Mumiyo — Tablet formunda gümüş blister ambalajda doğal takviye.

Kullanım:
• Çelik suyu: Sabah-akşam aç karnına bir yemek kaşığı içilir.
• Kan yapıcı macun: Sabah-akşam aç karnına bir tatlı kaşığı yenilir.
• D vitamini: Sabah-akşam aç karnına büyükler bir çay kaşığı, küçükler yarım çay kaşığı.
• Mumiyo: Sabah-akşam aç karnına bir tane alınır.

Takviye edici gıdadır. Normal beslenmenin yerine geçmez.`,
    setIcerigi: ["Çelik Suyu", "Kan Yapıcı Macun", "D Vitamini", "Mumiyo Tablet"],
    oneCikan: true,
  },
];

async function main() {
  const istenen = process.argv[2];
  const hedefler = istenen
    ? URUNLER.filter((u) => u.klasor === istenen)
    : URUNLER;

  if (hedefler.length === 0) {
    console.error(`Tanımlı ürün yok: ${istenen}`);
    console.error("Tanımlılar: " + URUNLER.map((u) => u.klasor).join(", "));
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!dbUrl || !sbUrl || !sbKey) {
    console.error("DATABASE_URL / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY eksik.");
    process.exit(1);
  }

  const sql = postgres(dbUrl, { prepare: false, max: 1 });
  const depo = createClient(sbUrl, sbKey, { auth: { persistSession: false } });

  for (const u of hedefler) {
    const hazirDizin = path.join(KOK, u.klasor, "hazir");
    const jsonYolu = path.join(hazirDizin, "gorseller.json");

    if (!fs.existsSync(jsonYolu)) {
      console.log(
        `\n[atlandı] ${u.baslik}\n  ${u.klasor}/hazir/ yok. Önce:\n` +
          `  python scripts/urun-gorsel-hazirla.py ${u.klasor}`,
      );
      continue;
    }

    console.log(`\n${u.baslik}`);
    const gorseller: HazirGorsel[] = JSON.parse(fs.readFileSync(jsonYolu, "utf-8"));

    // --- Görselleri depoya yükle ---
    const yuklenen: (HazirGorsel & { url: string; storagePath: string })[] = [];
    for (const g of gorseller) {
      const yol = `urunler/${u.slug}/${g.dosya}`;
      const veri = fs.readFileSync(path.join(hazirDizin, g.dosya));

      const { error } = await depo.storage
        .from(KOVA)
        .upload(yol, veri, { contentType: "image/webp", upsert: true });

      if (error) {
        console.error(`  ! ${g.dosya} yüklenemedi: ${error.message}`);
        continue;
      }
      yuklenen.push({
        ...g,
        storagePath: yol,
        url: `${sbUrl}/storage/v1/object/public/${KOVA}/${yol}`,
      });
      console.log(`  ✓ ${g.dosya} yüklendi (${g.genislik}x${g.yukseklik})`);
    }

    if (yuklenen.length === 0) {
      console.error("  ! Hiç görsel yüklenemedi, ürün eklenmedi.");
      continue;
    }

    // --- Ürünü ekle / güncelle ---
    const [kat] = await sql<{ id: string }[]>`
      SELECT id FROM categories WHERE slug = ${u.kategoriSlug}
    `;

    const [urun] = await sql<{ id: string }[]>`
      INSERT INTO products (baslik, slug, kisa_aciklama, aciklama, fiyat, eski_fiyat,
                            kategori_id, set_icerigi, stokta, yayinda, one_cikan, sira)
      VALUES (${u.baslik}, ${u.slug}, ${u.kisa}, ${u.aciklama}, ${u.fiyat},
              ${u.eskiFiyat}, ${kat?.id ?? null},
              ${u.setIcerigi ? sql.array(u.setIcerigi) : null},
              true, true, ${u.oneCikan}, 0)
      ON CONFLICT (slug) DO UPDATE SET
        baslik = EXCLUDED.baslik,
        kisa_aciklama = EXCLUDED.kisa_aciklama,
        aciklama = EXCLUDED.aciklama,
        fiyat = EXCLUDED.fiyat,
        eski_fiyat = EXCLUDED.eski_fiyat,
        kategori_id = EXCLUDED.kategori_id,
        one_cikan = EXCLUDED.one_cikan,
        updated_at = now()
      RETURNING id
    `;

    await sql`DELETE FROM product_images WHERE urun_id = ${urun.id}`;
    for (const g of yuklenen) {
      await sql`
        INSERT INTO product_images (urun_id, url, storage_path, alt, genislik,
                                    yukseklik, zemin_rengi, tur, yayinda, sira)
        VALUES (${urun.id}, ${g.url}, ${g.storagePath}, ${u.baslik},
                ${g.genislik}, ${g.yukseklik}, ${g.zeminRengi}, ${g.tur}, true, ${g.sira})
      `;
    }

    const kapak = yuklenen[0];
    const oran = kapak.genislik / kapak.yukseklik;
    const heroUygun = oran >= 0.75 && oran <= 1.35;
    console.log(
      `  → ${yuklenen.length} görsel, kapak ${kapak.genislik}x${kapak.yukseklik} ` +
        `(${heroUygun ? "hero'da gösterilir" : "hero'ya uygun DEĞİL — kapak kare olmalı"})`,
    );
  }

  const [{ n }] = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM products WHERE yayinda
  `;
  await sql.end();

  console.log(`\n${"=".repeat(46)}\nToplam ${n} yayında ürün.\n`);
}

main().catch((e) => {
  console.error("\nYükleme başarısız:", e);
  process.exit(1);
});
