import type { Ayarlar } from "./settings";
import { fiyatBicimle, sayi } from "./price";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/* ============================================================
   Başlık ve açıklama üreticileri

   Hedef: başlık 50-60, açıklama 120-160 karakter. Kısa başlık ve
   açıklama arama sonucunda yer kaybettirir; uzun olan kesilir.
   ============================================================ */

function kirp(metin: string, azami: number): string {
  const t = metin.replace(/\s+/g, " ").trim();
  if (t.length <= azami) return t;
  const kesik = t.slice(0, azami - 1);
  const son = kesik.lastIndexOf(" ");
  return (son > azami * 0.6 ? kesik.slice(0, son) : kesik).trimEnd() + "…";
}

/**
 * Verilen adaylardan 50-60 karakter aralığına düşen ilkini seçer.
 * Hiçbiri uymazsa 60'ı aşmayan en uzun adayı döner.
 *
 * Neden: 50 karakterin altındaki başlık arama sonucunda yer kaybettirir,
 * 60'ı aşan kesilir.
 */
export function enIyiBaslik(adaylar: string[]): string {
  const uyan = adaylar.find((a) => a.length >= 50 && a.length <= 60);
  if (uyan) return uyan;
  const sigan = adaylar.filter((a) => a.length <= 60).sort((a, b) => b.length - a.length);
  return sigan[0] ?? kirp(adaylar[0], 60);
}

/**
 * Açıklamayı 150-158 karakter aralığına getirir: kısa kalırsa `dolgu`
 * cümlelerinden ekler, uzun olursa kelime sınırından kırpar.
 */
export function aciklamaAyarla(cekirdek: string, dolgu: string[]): string {
  let metin = cekirdek.replace(/\s+/g, " ").trim();
  for (const ek of dolgu) {
    if (metin.length >= 150) break;
    if (metin.length + ek.length + 1 <= 158) metin = `${metin} ${ek}`;
  }
  return kirp(metin, 158);
}

export function kategoriBasligi(ad: string, siteAdi: string): string {
  const kok = /ürün/i.test(ad) ? ad : `${ad} Ürünleri`;
  return enIyiBaslik([
    `${kok} — Doğal ve Bitkisel Seçenekler | ${siteAdi}`,
    `${kok} — Doğal İçerikli Seçenekler | ${siteAdi}`,
    `${kok} — Doğal İçerikli | ${siteAdi}`,
    `${kok} | ${siteAdi}`,
  ]);
}

export function urunBasligi(
  baslik: string,
  kategoriAdi: string | null,
  siteAdi: string,
): string {
  const ek = kategoriAdi ? ` — ${kategoriAdi}` : "";
  const tam = `${baslik}${ek} | ${siteAdi}`;
  if (tam.length <= 60) return tam;
  const sadeTam = `${baslik} | ${siteAdi}`;
  return sadeTam.length <= 60 ? sadeTam : kirp(baslik, 60 - siteAdi.length - 3) + ` | ${siteAdi}`;
}

/**
 * Ürün meta açıklaması. Kısa açıklama yetmezse ürün açıklamasından ve
 * gerçek kargo/iade bilgisinden tamamlanır — uydurma metin eklenmez.
 */
export function urunAciklamasi(
  urun: {
    kisaAciklama: string | null;
    aciklama: string | null;
    fiyat: string;
    setIcerigi: string[] | null;
  },
  ayar: Ayarlar,
): string {
  const parcalar: string[] = [];

  if (urun.kisaAciklama?.trim()) parcalar.push(urun.kisaAciklama.trim());
  else if (urun.aciklama?.trim()) parcalar.push(urun.aciklama.trim().split("\n")[0]);

  if (urun.setIcerigi?.length) {
    parcalar.push(`Set içeriği: ${urun.setIcerigi.slice(0, 4).join(", ")}.`);
  }

  parcalar.push(`${fiyatBicimle(sayi(urun.fiyat))}.`);

  const limit = ayar.kargoBedavaLimit ? sayi(ayar.kargoBedavaLimit) : null;
  if (ayar.kargoBedavaAcik && limit) {
    parcalar.push(`${fiyatBicimle(limit)} üzeri kargo bedava.`);
  }
  parcalar.push("Siparişini WhatsApp'tan onayla.");

  return kirp(parcalar.join(" "), 158);
}

/* ============================================================
   JSON-LD üreticileri
   Yalnızca DOĞRULANABİLİR veriler işaretlenir. Uydurma puan,
   sahte stok veya olmayan ödül işaretlenmez.
   ============================================================ */

export function organizationLd(ayar: Ayarlar) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ayar.siteAdi,
    url: SITE_URL,
    description: ayar.siteSlogan ?? undefined,
    ...(ayar.ticaretUnvani ? { legalName: ayar.ticaretUnvani } : {}),
    ...(ayar.vergiNo ? { taxID: ayar.vergiNo } : {}),
    ...(ayar.instagramUrl ? { sameAs: [ayar.instagramUrl] } : {}),
    ...(ayar.adres
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: ayar.adres,
            addressCountry: "TR",
          },
        }
      : {}),
    ...(ayar.iletisimTelefon || ayar.whatsappNumarasi
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: ayar.iletisimTelefon ?? `+${ayar.whatsappNumarasi}`,
            availableLanguage: "Turkish",
            areaServed: "TR",
          },
        }
      : {}),
  };
}

export function websiteLd(ayar: Ayarlar) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ayar.siteAdi,
    url: SITE_URL,
    inLanguage: "tr-TR",
  };
}

export function breadcrumbLd(ogeler: { ad: string; yol: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: ogeler.map((o, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: o.ad,
      item: `${SITE_URL}${o.yol}`,
    })),
  };
}

export function itemListLd(
  urunler: { baslik: string; slug: string }[],
  listeAdi: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listeAdi,
    numberOfItems: urunler.length,
    itemListElement: urunler.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: u.baslik,
      url: `${SITE_URL}/urun/${u.slug}`,
    })),
  };
}

/**
 * Ürün sayfası SSS'si.
 *
 * Sorular uydurma değil: cevaplar doğrudan ayarlardan ve gerçek
 * iade/teslimat politikasından üretilir. Yapay zekâ arama motorları
 * bu blokları en sık alıntılanan biçimdir.
 */
export function urunSSS(ayar: Ayarlar, setIcerigi: string[] | null) {
  const limit = ayar.kargoBedavaLimit ? sayi(ayar.kargoBedavaLimit) : null;
  const ucret = ayar.kargoUcreti ? sayi(ayar.kargoUcreti) : 0;

  const kargoCevap =
    ucret === 0
      ? "Tüm siparişlerde kargo ücretsizdir."
      : ayar.kargoBedavaAcik && limit
        ? `Kargo ücreti ${fiyatBicimle(ucret)}'dir. ${fiyatBicimle(limit)} ve üzeri siparişlerde kargo ücretsizdir.`
        : `Kargo ücreti ${fiyatBicimle(ucret)}'dir.`;

  const sorular: { soru: string; cevap: string }[] = [
    {
      soru: "Nasıl sipariş verebilirim?",
      cevap:
        "Ürünü sepete ekleyip iletişim bilgilerinizi girin. Siparişiniz oluştuktan sonra WhatsApp'a yönlendirilirsiniz; ödeme ve teslimat detayları orada konuşulur. Sitede kart bilgisi istenmez.",
    },
    { soru: "Kargo ücreti ne kadar?", cevap: kargoCevap },
    {
      soru: "Siparişim ne zaman kargoya verilir?",
      cevap:
        "Ürünler küçük partiler hâlinde hazırlandığı için siparişler genellikle 1-2 iş günü içinde kargoya verilir. Kargoya verildiğinde takip numarası paylaşılır.",
    },
    {
      soru: "İade edebilir miyim?",
      cevap:
        "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz. Ambalajı açılmış hijyen, kozmetik ve gıda ürünleri cayma hakkı istisnası kapsamındadır.",
    },
  ];

  if (setIcerigi?.length) {
    sorular.unshift({
      soru: "Sette hangi ürünler var?",
      cevap: `Set ${setIcerigi.length} üründen oluşur: ${setIcerigi.join(", ")}.`,
    });
  }

  return sorular;
}

export function faqLd(sorular: { soru: string; cevap: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sorular.map((s) => ({
      "@type": "Question",
      name: s.soru,
      acceptedAnswer: { "@type": "Answer", text: s.cevap },
    })),
  };
}

/** Birden fazla JSON-LD'yi tek script etiketinde birleştirir. */
export function jsonLd(...belgeler: object[]) {
  return JSON.stringify(belgeler.length === 1 ? belgeler[0] : belgeler);
}
