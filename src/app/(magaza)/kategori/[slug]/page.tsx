import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { yayindakiUrunler, aktifKategoriler } from "@/lib/catalog";
import { UrunKarti } from "@/components/magaza/UrunKarti";
import {
  breadcrumbLd,
  itemListLd,
  jsonLd,
  kategoriBasligi,
  aciklamaAyarla,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [kategoriler, urunler] = await Promise.all([
    aktifKategoriler(),
    yayindakiUrunler({ kategoriSlug: slug }),
  ]);
  const k = kategoriler.find((x) => x.slug === slug);
  if (!k) return { title: "Kategori" };

  const ornekler = urunler
    .slice(0, 2)
    .map((u) => u.baslik)
    .join(", ");

  const aciklama = aciklamaAyarla(
    k.aciklama ?? `${k.ad} kategorisindeki doğal içerikli ürünler.`,
    [
      ornekler ? `${ornekler} ve daha fazlası.` : "",
      "Küçük partiler hâlinde hazırlanır.",
      "Siparişini WhatsApp'tan onayla, 1-2 iş günü içinde kargoya verilsin.",
      "Sitede kart bilgisi istenmez.",
    ].filter(Boolean),
  );

  const baslik = kategoriBasligi(k.ad, "Organik Şifa");

  return {
    title: { absolute: baslik },
    description: aciklama,
    alternates: { canonical: `/kategori/${k.slug}` },
    openGraph: { title: k.ad, description: aciklama, locale: "tr_TR" },
  };
}

export default async function KategoriSayfasi({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kategoriler = await aktifKategoriler();
  const kategori = kategoriler.find((k) => k.slug === slug);
  if (!kategori) notFound();

  const urunler = await yayindakiUrunler({ kategoriSlug: slug });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbLd([
              { ad: "Ana sayfa", yol: "/" },
              { ad: "Ürünler", yol: "/urunler" },
              { ad: kategori.ad, yol: `/kategori/${kategori.slug}` },
            ]),
            itemListLd(urunler, kategori.ad),
          ),
        }}
      />
      <nav aria-label="Konum" className="text-sm text-notr-600 mb-4">
        <Link href="/" className="hover:text-yesil-700">
          Ana sayfa
        </Link>
        <span className="mx-2 text-notr-300">/</span>
        <Link href="/urunler" className="hover:text-yesil-700">
          Ürünler
        </Link>
        <span className="mx-2 text-notr-300">/</span>
        <span className="text-notr-900">{kategori.ad}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-baslik text-[clamp(1.75rem,1rem+2.4vw,2.75rem)]">
          {kategori.ad}
        </h1>
        {kategori.aciklama && (
          <p className="text-notr-600 mt-2 olcu">{kategori.aciklama}</p>
        )}
      </header>

      <nav aria-label="Kategori filtresi" className="mb-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/urunler"
              className="inline-flex items-center min-h-[44px] px-4 rounded-full
                         bg-notr-0 border border-notr-200 text-sm hover:border-yesil-400"
            >
              Tümü
            </Link>
          </li>
          {kategoriler.map((k) => (
            <li key={k.slug}>
              <Link
                href={`/kategori/${k.slug}`}
                aria-current={k.slug === slug ? "page" : undefined}
                className={cn(
                  "inline-flex items-center min-h-[44px] px-4 rounded-full text-sm border transition-colors",
                  k.slug === slug
                    ? "bg-yesil-700 text-notr-0 border-yesil-700"
                    : "bg-notr-0 border-notr-200 hover:border-yesil-400 hover:text-yesil-700",
                )}
              >
                {k.ad}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {urunler.length === 0 ? (
        <p className="py-20 text-center text-notr-600">
          Bu kategoride henüz ürün yok.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {urunler.map((u, i) => (
            <UrunKarti key={u.id} urun={u} oncelik={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
