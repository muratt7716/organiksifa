import Link from "next/link";
import { ArrowRight, Leaf, MessageCircle, Truck } from "lucide-react";
import { yayindakiUrunler, aktifKategoriler, urunFotografiMi } from "@/lib/catalog";
import { ayarlariGetir } from "@/lib/settings";
import { UrunKarti } from "@/components/magaza/UrunKarti";
import { HeroVitrin } from "@/components/magaza/HeroVitrin";
import { ZeytinDali, Adacayi, Papatya, Damla } from "@/components/magaza/Botanik";
import { fiyatBicimle, sayi } from "@/lib/price";
import { organizationLd, websiteLd, itemListLd, jsonLd } from "@/lib/seo";

/** Kelime kelime aydınlanan başlık — her kelime kendi görünme aralığında. */
function AydinlananBaslik({ metin }: { metin: string }) {
  return (
    <span className="kelime-aydinlan">
      {metin.split(" ").map((kelime, i) => (
        <span key={i} style={{ animationDelay: `${i * 40}ms` }}>
          {kelime}{" "}
        </span>
      ))}
    </span>
  );
}

export default async function AnaSayfa() {
  const [oneCikanlar, yeniler, kategoriler, ayar] = await Promise.all([
    yayindakiUrunler({ oneCikan: true, limit: 8 }),
    yayindakiUrunler({ limit: 8 }),
    aktifKategoriler(),
    ayarlariGetir(),
  ]);

  const vitrin = oneCikanlar.length > 0 ? oneCikanlar : yeniler;
  const kargoLimit = ayar.kargoBedavaLimit ? sayi(ayar.kargoBedavaLimit) : null;

  // Hero vitrini yalnızca ürün fotoğrafı biçimindeki kapakları alır.
  const vitrinUrunleri = [...oneCikanlar, ...yeniler]
    .filter(urunFotografiMi)
    .filter((u, i, dizi) => dizi.findIndex((x) => x.id === u.id) === i)
    .slice(0, 5);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            organizationLd(ayar),
            websiteLd(ayar),
            ...(vitrin.length
              ? [itemListLd(vitrin, "Öne çıkan ürünler")]
              : []),
          ),
        }}
      />

      {/* ---------------------------------------------------------------
          HERO — katmanlı giriş. Ürün PNG'sine bağımlı değil:
          tipografi, renk alanları ve inline botanik çizgilerden kurulu.
          --------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-notr-100">
        <div
          className="absolute inset-0 -z-10 opacity-[0.13] text-yesil-700 derinlik-yavas"
          aria-hidden="true"
        >
          <ZeytinDali className="absolute -left-16 top-8 w-[340px] sm:w-[520px]" />
          <Adacayi className="absolute right-4 sm:right-16 top-0 w-[120px] sm:w-[180px]" />
        </div>
        <div
          className="absolute inset-0 -z-10 opacity-[0.09] text-amber-600 derinlik-hizli"
          aria-hidden="true"
        >
          <Papatya className="absolute right-[12%] bottom-6 w-[110px] sm:w-[150px] suzulen" />
          <Damla className="absolute left-[8%] bottom-16 w-[60px] sm:w-[80px]" />
        </div>

        {/* 1024px'te iki kolon: metin solda, vitrin sağda.
            Altında tek kolona düşer, vitrin metnin altına geçer. */}
        <div
          className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24 xl:py-28
                     grid gap-12 lg:gap-10 xl:gap-16
                     lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_420px]
                     lg:items-center"
        >
          <div>
          <p className="text-sm text-yesil-700 mb-4">{ayar.siteSlogan}</p>

          <h1 className="font-baslik leading-[1.05] max-w-[16ch] text-[clamp(2.1rem,1rem+4vw,3.9rem)]">
            <AydinlananBaslik metin="Doğanın kendi eczanesinden, sofrana." />
          </h1>

          <p className="mt-6 text-lg text-notr-600 olcu">
            Bitkisel yağlar, doğal takviyeler ve el yapımı cilt bakım ürünleri.
            Sipariş ver, WhatsApp&apos;tan tek mesajla onayla.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 h-13 min-h-[52px] px-6 rounded-kontrol
                         bg-yesil-700 text-notr-0 font-medium hover:bg-yesil-800 transition-colors"
            >
              Ürünleri gör
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            {ayar.whatsappNumarasi && (
              <a
                href={`https://wa.me/${ayar.whatsappNumarasi}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 min-h-[52px] px-6 rounded-kontrol
                           border border-yesil-700 text-yesil-700 font-medium
                           hover:bg-yesil-50 transition-colors"
              >
                <MessageCircle size={18} aria-hidden="true" />
                WhatsApp&apos;tan sor
              </a>
            )}
          </div>

            {/* Niyet bazlı giriş kapıları — müşteri "ne için" diye arar. */}
            {kategoriler.length > 0 && (
              <nav aria-label="Kategoriler" className="mt-10">
                <ul className="flex flex-wrap gap-2">
                  {kategoriler.map((k) => (
                    <li key={k.slug}>
                      <Link
                        href={`/kategori/${k.slug}`}
                        className="inline-flex items-center min-h-[44px] px-4 rounded-full
                                   bg-notr-0 border border-notr-200 text-sm
                                   hover:border-yesil-400 hover:text-yesil-700 transition-colors"
                      >
                        {k.ad}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          {/* Vitrin — yalnızca ürün fotoğrafı biçimindeki kapaklar.
              Dikey infografikler burada afiş gibi duruyor; onların yeri
              katalog. Uygun görsel yoksa hero tek kolona düşer. */}
          {vitrinUrunleri.length > 0 && <HeroVitrin urunler={vitrinUrunleri} />}
        </div>
      </section>

      {/* --------------------------- GÜVEN ŞERİDİ --------------------------- */}
      <section className="border-b border-notr-200">
        <ul className="mx-auto max-w-6xl px-4 py-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              Ikon: Leaf,
              baslik: "Doğal içerik",
              metin: "Bitkisel yağlar ve geleneksel tariflerle hazırlanır.",
            },
            {
              Ikon: MessageCircle,
              baslik: "WhatsApp'tan sipariş",
              metin: "Üyelik yok, kart bilgisi yok. Tek mesajla onayla.",
            },
            {
              Ikon: Truck,
              baslik: kargoLimit
                ? `${fiyatBicimle(kargoLimit)} üzeri kargo bedava`
                : "Hızlı kargo",
              metin: "Siparişler 1-2 iş günü içinde hazırlanır.",
            },
          ].map(({ Ikon, baslik, metin }) => (
            <li key={baslik} className="flex gap-3">
              <Ikon
                size={22}
                className="text-yesil-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-medium">{baslik}</h2>
                <p className="text-sm text-notr-600">{metin}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* --------------------------- VİTRİN RAFI --------------------------- */}
      {vitrin.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20 sahne-belir">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-baslik text-[clamp(1.6rem,1rem+2vw,2.5rem)]">
              {oneCikanlar.length > 0 ? "Öne çıkanlar" : "Ürünlerimiz"}
            </h2>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm text-yesil-700
                         hover:gap-2.5 transition-all"
            >
              Tümü <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {vitrin.map((u, i) => (
              <UrunKarti key={u.id} urun={u} oncelik={i < 4} />
            ))}
          </div>
        </section>
      )}

      {vitrin.length === 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="font-baslik text-2xl text-yesil-700">
            Ürünler çok yakında
          </h2>
          <p className="mt-2 text-notr-600">
            Katalog hazırlanıyor. Bu arada bize WhatsApp&apos;tan yazabilirsin.
          </p>
        </section>
      )}

      {/* --------------------------- MARKA HİKÂYESİ ---------------------------
          Yapışkan sahne: metin akarken görsel katman sabit kalır.
          ---------------------------------------------------------------------- */}
      <section className="bg-yesil-700 text-notr-0 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div
            className="relative aspect-[4/3] sahne-perde rounded-panel bg-yesil-800
                       grid place-items-center overflow-hidden"
          >
            <ZeytinDali
              className="absolute -left-8 bottom-0 w-[300px] text-yesil-300 opacity-40"
            />
            <Adacayi className="absolute right-6 top-2 w-[130px] text-yesil-300 opacity-40" />
            <Papatya className="w-24 text-amber-300 opacity-70 suzulen" />
          </div>

          <div className="space-y-5">
            <h2 className="font-baslik text-[clamp(1.75rem,1rem+2.6vw,3rem)] leading-tight">
              Her ürünün arkasında bir tarif var
            </h2>
            <p className="text-yesil-100 olcu">
              Ürünlerimiz büyük fabrikalarda değil, küçük partiler hâlinde
              hazırlanıyor. İçindekiler listesi kısa; ne koyduğumuzu biliyoruz,
              siz de bilin istiyoruz.
            </p>
            <p className="text-yesil-100 olcu">
              Sipariş verdiğinizde WhatsApp&apos;tan bizzat ulaşıyoruz. Hangi ürünün
              size uygun olduğunu birlikte konuşuyoruz — bu yüzden sepette kart
              bilgisi istemiyoruz.
            </p>
            <Link
              href="/hakkimizda"
              className="inline-flex items-center gap-2 min-h-[52px] px-6 rounded-kontrol
                         bg-notr-0 text-yesil-700 font-medium hover:bg-yesil-50 transition-colors"
            >
              Hakkımızda
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------- YENİ ÜRÜNLER --------------------------- */}
      {oneCikanlar.length > 0 && yeniler.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20 sahne-belir">
          <h2 className="font-baslik text-[clamp(1.6rem,1rem+2vw,2.5rem)] mb-8">
            Katalogdan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {yeniler.slice(0, 4).map((u) => (
              <UrunKarti key={u.id} urun={u} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
