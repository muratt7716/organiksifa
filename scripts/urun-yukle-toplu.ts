/**
 * `urun-gorselleri/` klasöründeki showroom görselleriyle ürünleri toplu ekler.
 *   npx tsx scripts/urun-yukle-toplu.ts
 *
 * Her ürün İKİ görselle girer:
 *   1. kapak   — urun-gorselleri/NN-slug.jpg  (AI showroom, katalog kartında)
 *   2. detay   — urunler-ham/<infografik>     (ablamın gönderdiği bilgi görseli)
 *
 * Görsel bulunamayan ürün sessizce atlanır — kota bitince kalanlar
 * eklendiğinde betik yeniden çalıştırılabilir, mevcut ürünler güncellenir.
 *
 * Fiyatlar geçicidir; panelden düzeltilecek.
 */
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

const KOK = path.join(import.meta.dirname, "..");
const KOVA = "urunler";

type Urun = {
  no: string;
  slug: string;
  baslik: string;
  kategoriSlug: string;
  fiyat: string;
  kisa: string;
  aciklama: string;
  setIcerigi?: string[];
  /** urunler-ham/ içindeki infografik dosyası (ikinci görsel). */
  infografik?: string;
};

const H = "WhatsApp Image 2026-09-03 at";

const URUNLER: Urun[] = [
  {
    no: "01",
    slug: "ayvalik-zeytinyagi-soguk-sikim-5l",
    baslik: "Ayvalık Zeytinyağı — Soğuk Sıkım 5 L",
    kategoriSlug: "bitkisel-yaglar",
    fiyat: "2450.00",
    kisa: "Balıkesir Ayvalık, erken hasat, soğuk sıkım. Asit oranı %0,3.",
    aciklama: `Balıkesir Ayvalık bölgesinden erken hasat zeytinlerin soğuk sıkım yöntemiyle elde edildiği sızma zeytinyağı. Asit oranı %0,3.

Soğuk sıkımda zeytin ısıya maruz kalmadığı için doğal aroması ve polifenol içeriği korunur.

Kullanım: Salata, kahvaltı, zeytinyağlı yemekler, makarna ve soslar, sebze ve fırın yemekleri, et-tavuk-balık marinasyonu.

Kışın doğal olarak yoğunlaşıp bulanıklaşabilir veya donabilir. Bu saflığın göstergesidir; oda sıcaklığında kısa sürede eski hâline döner.

Hacim: 5 litre. Serin ve ışık almayan yerde saklayın.`,
    infografik: `${H} 02.05.25 (1).jpeg`,
  },
  {
    no: "02",
    slug: "uzum-pekmezi",
    baslik: "Üzüm Pekmezi",
    kategoriSlug: "takviye-urunler",
    fiyat: "320.00",
    kisa: "Geleneksel yöntemle kaynatılmış, katkısız üzüm pekmezi.",
    aciklama: `Siyah üzümün geleneksel yöntemle kaynatılarak koyulaştırılmasıyla elde edilir. Şeker, koruyucu veya katkı maddesi içermez.

Doğal karbonhidrat ve mineral kaynağıdır.

Kullanım: Kahvaltıda tahin ile karıştırarak, sütle, veya tatlılarda kullanılabilir.

Cam kavanoz. Serin ve kuru yerde saklayın, açtıktan sonra buzdolabında tutun.`,
    infografik: `${H} 02.05.27.jpeg`,
  },
  {
    no: "03",
    slug: "propolis-damla-50ml",
    baslik: "Propolis Damla 50 ml — Alkolsüz",
    kategoriSlug: "takviye-urunler",
    fiyat: "480.00",
    kisa: "Alkol içermeyen propolis özütü, damlalıklı amber şişe.",
    aciklama: `Arıların kovan girişini korumak için ürettiği reçinemsi maddeden elde edilen özüt.

Alkol içermeyen formülü sayesinde her gün kullanıma uygundur.

Damlalıklı 50 ml amber cam şişe. Amber cam içeriği ışıktan korur.

Serin ve ışık almayan yerde saklayın. Takviye edici gıdadır, ilaç değildir.`,
    infografik: `${H} 02.05.27 (1).jpeg`,
  },
  {
    no: "04",
    slug: "kombu-cayi-kombucha-500ml",
    baslik: "Kombu Çayı (Kombucha) 500 ml",
    kategoriSlug: "cay-detoks",
    fiyat: "180.00",
    kisa: "Doğal fermente çay. Rafine şeker ve koruyucu içermez.",
    aciklama: `Özenle fermente edilen kombu çayı; doğal probiyotikler, enzimler ve organik asitler içerir.

Rafine şeker, koruyucu ve katkı maddesi içermez. Vegan.

Kullanım: Günde 1 şişe, soğuk olarak tüketilmesi önerilir.

Hacim: 500 ml. Açıldıktan sonra buzdolabında saklayın.`,
    infografik: `${H} 02.08.46.jpeg`,
  },
  {
    no: "05",
    slug: "probiyotik-konsantre-icecek-500ml",
    baslik: "Probiyotik Konsantre İçecek 500 ml",
    kategoriSlug: "cay-detoks",
    fiyat: "640.00",
    kisa: "Canlı kültür içeren konsantre içecek.",
    aciklama: `Canlı kültür içeren konsantre içecek. Günlük beslenmesine probiyotik desteği eklemek isteyenler için.

Hacim: 500 ml.

Kullanım: Kullanmadan önce çalkalayın. Açıldıktan sonra buzdolabında saklayın.

Takviye edici gıdadır, ilaç değildir.`,
    infografik: `${H} 02.08.47 (4).jpeg`,
  },
  {
    no: "06",
    slug: "guzellik-kremi",
    baslik: "Güzellik Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "590.00",
    kisa: "Argan, aloe vera ve E vitamini içeren günlük yüz kremi.",
    aciklama: `İçindekiler: Argan yağı, aloe vera, hindistan cevizi yağı, kuşburnu yağı, papatya özü, E vitamini.

Kullanım alanları: Yüz, boyun ve dekolte, eller, vücut.

Kullanım: Temiz cilde sabah ve akşam nazikçe masaj yaparak uygulayın.

Paraben, sülfat ve alkol içermez. Tüm cilt tipleri için uygundur. Dermatolojik olarak test edilmiştir.`,
    infografik: `${H} 02.08.49 (1).jpeg`,
  },
  {
    no: "07",
    slug: "yogun-nemlendirici-el-yuz-kremi",
    baslik: "Yoğun Nemlendirici El & Yüz Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "420.00",
    kisa: "Aloe vera ve shea yağı ile yoğun nem, yağlı his bırakmaz.",
    aciklama: `İçindekiler: Aloe vera, shea yağı, jojoba yağı, E vitamini, papatya özü, hindistan cevizi yağı.

Kullanım alanları: Yüz, eller, dirsek, diz ve boyun gibi kuru bölgeler.

Kullanım: Temiz cilde yeterli miktarda alıp nazikçe masaj yaparak uygulayın. Gün içinde ihtiyaç duydukça tekrarlayın.

Hafif dokusu sayesinde hızla emilir, yağlı his bırakmaz. Paraben, sülfat ve renklendirici içermez.`,
    infografik: `${H} 02.08.49 (4).jpeg`,
  },
  {
    no: "08",
    slug: "hindistan-cevizi-yagli-krem",
    baslik: "Hindistan Cevizi Yağlı Krem",
    kategoriSlug: "cilt-bakimi",
    fiyat: "380.00",
    kisa: "Hindistan cevizi yağı ile yoğun nem ve bakım.",
    aciklama: `Hindistan cevizi yağı ile hazırlanmış nemlendirici krem.

Kullanım alanları: Yüz, eller, vücut, bacaklar, ayaklar.

Kullanım: Temiz cilde nazikçe masaj yaparak uygulayın. Günlük kullanıma uygundur.

Paraben, silikon, renklendirici ve hayvansal içerik içermez. Tüm cilt tipleri için uygundur.`,
    infografik: `${H} 02.08.49 (9).jpeg`,
  },
];

/** Görseli WebP'ye çevirir, ölçüsünü ve kenar zemin rengini döndürür. */
async function hazirla(dosyaYolu: string, enBoy: number) {
  const girdi = sharp(dosyaYolu).rotate();
  const ust = await girdi.metadata();

  const olcekli = girdi.resize({
    width: Math.min(ust.width ?? enBoy, enBoy),
    height: Math.min(ust.height ?? enBoy, enBoy),
    fit: "inside",
    withoutEnlargement: true,
  });

  const veri = await olcekli.webp({ quality: 82 }).toBuffer();
  const son = await sharp(veri).metadata();

  // Zemin rengi: sol üst köşeden 1 piksel. Görselin etrafına konan dolgu
  // bu renkle boyanıyor, böylece beyaz zeminli ürün fotoğrafı kesintisiz durur.
  const kose = await sharp(veri)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .raw()
    .toBuffer();
  const zemin =
    "#" +
    [kose[0], kose[1], kose[2]]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("");

  return {
    veri,
    genislik: son.width ?? 0,
    yukseklik: son.height ?? 0,
    zeminRengi: zemin.toUpperCase(),
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

  const sql = postgres(dbUrl, { prepare: false, max: 1 });
  const depo = createClient(sbUrl, sbKey, { auth: { persistSession: false } });

  let eklenen = 0;

  for (const u of URUNLER) {
    const kapakYolu = path.join(KOK, "urun-gorselleri", `${u.no}-${u.slug}.jpg`);
    const alternatif = fs
      .readdirSync(path.join(KOK, "urun-gorselleri"))
      .find((f) => f.startsWith(`${u.no}-`));
    const kapak = fs.existsSync(kapakYolu)
      ? kapakYolu
      : alternatif
        ? path.join(KOK, "urun-gorselleri", alternatif)
        : null;

    if (!kapak) {
      console.log(`[atlandı] ${u.no} ${u.baslik} — kapak görseli yok`);
      continue;
    }

    console.log(`\n${u.no} · ${u.baslik}`);

    type Yuklenecek = { kaynak: string; enBoy: number; tur: string; sira: number };
    const liste: Yuklenecek[] = [
      { kaynak: kapak, enBoy: 1400, tur: "kapak", sira: 0 },
    ];

    if (u.infografik) {
      const infoYolu = path.join(KOK, "urunler-ham", u.infografik);
      if (fs.existsSync(infoYolu)) {
        liste.push({ kaynak: infoYolu, enBoy: 1600, tur: "detay", sira: 1 });
      } else {
        console.log(`  ! infografik bulunamadı: ${u.infografik}`);
      }
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

    for (const g of liste) {
      const hazir = await hazirla(g.kaynak, g.enBoy);
      const yol = `urunler/${u.slug}/${g.sira === 0 ? "kapak" : "detay"}.webp`;

      const { error } = await depo.storage
        .from(KOVA)
        .upload(yol, hazir.veri, { contentType: "image/webp", upsert: true });

      if (error) {
        console.error(`  ! yüklenemedi: ${error.message}`);
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

      const kb = Math.round(hazir.veri.length / 1024);
      console.log(
        `  ✓ ${g.tur} ${hazir.genislik}x${hazir.yukseklik} · ${kb} KB · ${hazir.zeminRengi}`,
      );
    }

    if (yuklenen.length === 0) {
      console.error("  ! hiç görsel yüklenemedi, ürün eklenmedi");
      continue;
    }

    const [kat] = await sql<{ id: string }[]>`
      SELECT id FROM categories WHERE slug = ${u.kategoriSlug}`;
    if (!kat) console.log(`  ! kategori bulunamadı: ${u.kategoriSlug}`);

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

    const k = yuklenen[0];
    const oran = k.genislik / k.yukseklik;
    console.log(
      `  → ${yuklenen.length} görsel · kapak oranı ${oran.toFixed(2)} ` +
        `(${oran >= 0.75 && oran <= 1.35 ? "hero'ya uygun" : "hero'ya uygun DEĞİL"})`,
    );
    eklenen++;
  }

  const [{ n }] = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM products WHERE yayinda`;
  await sql.end();

  console.log(`\n${"=".repeat(50)}`);
  console.log(`${eklenen} ürün eklendi/güncellendi · toplam ${n} yayında ürün`);
  console.log("Fiyatlar geçicidir — panelden düzeltilecek.\n");
}

main().catch((e) => {
  console.error("\nYükleme başarısız:", e);
  process.exit(1);
});
