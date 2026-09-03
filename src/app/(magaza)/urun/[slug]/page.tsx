import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Truck, ShieldCheck } from "lucide-react";
import { UrunGaleri } from "@/components/magaza/UrunGaleri";
import { urunDetay, benzerUrunler, yayindakiUrunler } from "@/lib/catalog";
import { urunYorumlari } from "@/actions/reviews";
import { ayarlariGetir } from "@/lib/settings";
import { fiyatBicimle, sayi, indirimYuzdesi } from "@/lib/price";
import {
  SITE_URL,
  urunBasligi,
  urunAciklamasi,
  breadcrumbLd,
  urunSSS,
  faqLd,
  jsonLd,
} from "@/lib/seo";
import { SepeteEkle } from "@/components/magaza/SepeteEkle";
import { Yorumlar } from "@/components/magaza/Yorumlar";
import { UrunKarti } from "@/components/magaza/UrunKarti";

/**
 * Ürün sayfaları derleme sırasında üretilir ve önbellekten servis edilir.
 *
 * Ölçüm (canlı): önbelleklenen /urunler 466 ms, önbelleklenmeyen ürün sayfası
 * 2753 ms. Fark tamamen boşa gidiyordu — ürün sayfası her ziyarette sıfırdan
 * üretiliyordu, oysa içeriği ancak ablam panelden değiştirince değişiyor.
 *
 * Panelde bir ürün kaydedildiğinde revalidatePath zaten çağrılıyor, yani
 * değişiklik anında yansır. Aşağıdaki süre yalnızca emniyet kemeri.
 *
 * Listede olmayan bir slug istenirse (yeni eklenmiş ürün) sayfa o an üretilir
 * ve sonrası için önbelleğe alınır — dynamicParams varsayılan olarak açık.
 */
export const revalidate = 3600;

export async function generateStaticParams() {
  const urunler = await yayindakiUrunler();
  return urunler.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [veri, ayar] = await Promise.all([urunDetay(slug), ayarlariGetir()]);
  if (!veri) return { title: "Ürün bulunamadı" };

  const { urun, gorseller, kategori } = veri;

  // Başlık 50-60, açıklama 120-160 karakter hedefiyle üretilir.
  const baslik =
    urun.seoBaslik ?? urunBasligi(urun.baslik, kategori?.ad ?? null, ayar.siteAdi);
  const aciklama = urun.seoAciklama ?? urunAciklamasi(urun, ayar);

  return {
    title: { absolute: baslik },
    description: aciklama,
    alternates: { canonical: `/urun/${urun.slug}` },
    openGraph: {
      title: urun.baslik,
      description: aciklama,
      url: `${SITE_URL}/urun/${urun.slug}`,
      siteName: ayar.siteAdi,
      locale: "tr_TR",
      images: gorseller[0]
        ? [
            {
              url: gorseller[0].url,
              width: gorseller[0].genislik,
              height: gorseller[0].yukseklik,
              alt: gorseller[0].alt || urun.baslik,
            },
          ]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: urun.baslik,
      description: aciklama,
      images: gorseller[0] ? [gorseller[0].url] : undefined,
    },
  };
}

export default async function UrunSayfasi({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const veri = await urunDetay(slug);
  if (!veri) notFound();

  const { urun, gorseller, kategori } = veri;
  const [yorumlar, benzer, ayar] = await Promise.all([
    urunYorumlari(urun.id),
    benzerUrunler(urun.kategoriId, urun.id),
    ayarlariGetir(),
  ]);

  const fiyat = sayi(urun.fiyat);
  const eski = urun.eskiFiyat ? sayi(urun.eskiFiyat) : null;
  const indirim = indirimYuzdesi(fiyat, eski);
  const site = SITE_URL;
  const sss = urunSSS(ayar, urun.setIcerigi);

  const kirintiLd = breadcrumbLd([
    { ad: "Ana sayfa", yol: "/" },
    ...(kategori ? [{ ad: kategori.ad, yol: `/kategori/${kategori.slug}` }] : []),
    { ad: urun.baslik, yol: `/urun/${urun.slug}` },
  ]);

  const urunLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: urun.baslik,
    description: urun.kisaAciklama ?? urun.aciklama ?? urun.baslik,
    image: gorseller.map((g) => g.url),
    sku: urun.slug,
    ...(urun.ortalamaPuan && urun.yorumSayisi > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(urun.ortalamaPuan),
            reviewCount: urun.yorumSayisi,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: fiyat.toFixed(2),
      priceCurrency: "TRY",
      availability: urun.stokta
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${site}/urun/${urun.slug}`,
      ...(ayar.kargoUcreti
        ? {
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: {
                "@type": "MonetaryAmount",
                value: urun.kargoBedava ? "0" : sayi(ayar.kargoUcreti).toFixed(2),
                currency: "TRY",
              },
              shippingDestination: {
                "@type": "DefinedRegion",
                addressCountry: "TR",
              },
            },
          }
        : {}),
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "TR",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnShippingFees",
      },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(urunLd, kirintiLd, faqLd(sss)),
        }}
      />

      <nav aria-label="Konum" className="text-sm text-notr-600 mb-6">
        <Link href="/" className="hover:text-yesil-700">
          Ana sayfa
        </Link>
        <span className="mx-2 text-notr-300">/</span>
        {kategori ? (
          <>
            <Link
              href={`/kategori/${kategori.slug}`}
              className="hover:text-yesil-700"
            >
              {kategori.ad}
            </Link>
            <span className="mx-2 text-notr-300">/</span>
          </>
        ) : null}
        <span className="text-notr-900">{urun.baslik}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
        {/* --------- Görsel galerisi ---------
            Uzun infografikler 4:5 çerçevede gösterilir; tamamı "Tamamını gör"
            ile tam ekranda okunur. Böylece sağdaki etiket paneli ekrandan
            kaybolmuyor. --------------------------------------------------- */}
        <div className="relative">
          <UrunGaleri
            baslik={urun.baslik}
            gorseller={gorseller.map((g) => ({
              id: g.id,
              url: g.url,
              alt: g.alt,
              genislik: g.genislik,
              yukseklik: g.yukseklik,
              zeminRengi: g.zeminRengi,
            }))}
          />
          {indirim !== null && (
            <span className="absolute top-3 left-3 z-10 bg-amber-600 text-notr-0 text-sm px-2.5 py-1 rounded">
              %{indirim} indirim
            </span>
          )}
        </div>

        {/* --------- Etiket paneli: yapışkan, ürün etiketi gibi okunur --------- */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div>
            <h1 className="font-baslik text-[clamp(1.6rem,1rem+2vw,2.4rem)] leading-tight">
              {urun.baslik}
            </h1>
            {urun.kisaAciklama && (
              <p className="mt-2 text-notr-600 olcu">{urun.kisaAciklama}</p>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="rakam text-3xl text-amber-600 font-medium">
              {fiyatBicimle(fiyat)}
            </span>
            {eski && (
              <span className="rakam text-lg text-notr-400 line-through">
                {fiyatBicimle(eski)}
              </span>
            )}
          </div>

          <p className="flex items-center gap-2 text-sm">
            <span
              className={`size-2 rounded-full ${urun.stokta ? "bg-yesil-500" : "bg-notr-300"}`}
              aria-hidden="true"
            />
            {urun.stokta
              ? "Sipariş üzerine hazırlanır · 1-2 iş günü"
              : "Şu an tükendi"}
          </p>

          <SepeteEkle urunId={urun.id} stokta={urun.stokta} />

          <ul className="space-y-2 text-sm text-notr-600">
            <li className="flex items-center gap-2">
              <Truck size={16} className="text-yesil-700" aria-hidden="true" />
              {urun.kargoBedava
                ? "Bu üründe kargo bedava"
                : ayar.kargoBedavaAcik && ayar.kargoBedavaLimit
                  ? `${fiyatBicimle(sayi(ayar.kargoBedavaLimit))} üzeri kargo bedava`
                  : "Kargo ücreti sepette hesaplanır"}
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-yesil-700" aria-hidden="true" />
              Ödeme WhatsApp&apos;tan — sitede kart bilgisi istenmez
            </li>
          </ul>

          {urun.setIcerigi && urun.setIcerigi.length > 0 && (
            <section className="border-t border-notr-200 pt-5">
              <h2 className="font-baslik text-lg mb-3">Set içeriği</h2>
              <ul className="space-y-2">
                {urun.setIcerigi.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <Check
                      size={16}
                      className="text-yesil-700 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {urun.aciklama && (
            <section className="border-t border-notr-200 pt-5">
              <h2 className="font-baslik text-lg mb-3">Ürün hakkında</h2>
              <div className="text-sm text-notr-600 space-y-3 whitespace-pre-line olcu">
                {urun.aciklama}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="mt-16 border-t border-notr-200 pt-12">
        <Yorumlar
          urunId={urun.id}
          ortalama={urun.ortalamaPuan ? Number(urun.ortalamaPuan) : null}
          yorumlar={yorumlar.map((y) => ({
            id: y.id,
            ad: y.ad,
            puan: y.puan,
            yorum: y.yorum,
            dogrulanmisAlici: y.dogrulanmisAlici,
            saticiYaniti: y.saticiYaniti,
            onayAt: y.onayAt,
          }))}
        />
      </div>

      {/* SSS — cevaplar ayarlardan ve gerçek iade politikasından üretilir.
          Hem müşteri sorularını kapatır hem FAQPage şeması olarak işaretlenir. */}
      <section
        className="mt-16 border-t border-notr-200 pt-12"
        aria-labelledby="sss-baslik"
      >
        <h2
          id="sss-baslik"
          className="font-baslik text-[clamp(1.4rem,1rem+1.4vw,2rem)] mb-6"
        >
          Sık sorulan sorular
        </h2>
        <dl className="divide-y divide-notr-200 border-y border-notr-200">
          {sss.map((s) => (
            <div key={s.soru} className="py-5">
              <dt className="font-medium text-notr-900">{s.soru}</dt>
              <dd className="mt-1.5 text-notr-600 olcu">{s.cevap}</dd>
            </div>
          ))}
        </dl>
      </section>

      {benzer.length > 0 && (
        <section className="mt-16 border-t border-notr-200 pt-12">
          <h2 className="font-baslik text-[clamp(1.4rem,1rem+1.4vw,2rem)] mb-8">
            Bunlar da ilgini çekebilir
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {benzer.map((u) => (
              <UrunKarti key={u.id} urun={u} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
