import type { Metadata } from "next";
import Link from "next/link";
import { yayindakiUrunler, aktifKategoriler } from "@/lib/catalog";
import { UrunKarti } from "@/components/magaza/UrunKarti";
import { breadcrumbLd, itemListLd, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tüm Ürünler — Doğal Takviye ve Bitkisel Bakım",
  description:
    "Doğal içerikli takviye edici gıdalar, bitkisel yağ karışımları ve el yapımı cilt bakım ürünleri. Küçük partiler hâlinde hazırlanır, 1-2 iş gününde kargoda.",
  alternates: { canonical: "/urunler" },
};

export default async function UrunlerSayfasi() {
  const [urunler, kategoriler] = await Promise.all([
    yayindakiUrunler(),
    aktifKategoriler(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbLd([
              { ad: "Ana sayfa", yol: "/" },
              { ad: "Tüm Ürünler", yol: "/urunler" },
            ]),
            itemListLd(urunler, "Tüm ürünler"),
          ),
        }}
      />

      <header className="mb-8">
        <h1 className="font-baslik text-[clamp(1.75rem,1rem+2.4vw,2.75rem)]">
          Tüm Ürünler
        </h1>
        <p className="text-notr-600 mt-1">
          {urunler.length > 0
            ? `${urunler.length} ürün listeleniyor`
            : "Katalog hazırlanıyor"}
        </p>
      </header>

      {kategoriler.length > 0 && (
        <nav aria-label="Kategori filtresi" className="mb-8">
          <ul className="flex flex-wrap gap-2">
            <li>
              <span
                className="inline-flex items-center min-h-[44px] px-4 rounded-full
                           bg-yesil-700 text-notr-0 text-sm"
              >
                Tümü
              </span>
            </li>
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

      {urunler.length === 0 ? (
        <p className="py-20 text-center text-notr-600">
          Henüz ürün eklenmemiş. Çok yakında burada olacaklar.
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
