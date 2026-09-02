import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { kategorileriGetir } from "@/actions/categories";
import { urunGetir } from "@/actions/products";
import { UrunFormu } from "@/components/panel/UrunFormu";
import { UrunSil } from "@/components/panel/UrunSil";

export const metadata = { title: "Ürünü düzenle" };

export default async function UrunDuzenleSayfasi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [kategoriler, veri] = await Promise.all([
    kategorileriGetir(),
    urunGetir(id),
  ]);
  if (!veri) notFound();

  const { urun, gorseller } = veri;

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/panel/urunler"
          className="inline-flex items-center gap-1.5 text-sm text-notr-600 min-h-[44px]
                     hover:text-yesil-700 transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Ürünler
        </Link>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl text-yesil-700">{urun.baslik}</h1>
          <Link
            href={`/urun/${urun.slug}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 text-sm text-notr-600 min-h-[44px]
                       shrink-0 hover:text-yesil-700 transition-colors"
          >
            Sitede gör <ExternalLink size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <UrunFormu
        kategoriler={kategoriler}
        baslangic={{
          id: urun.id,
          baslik: urun.baslik,
          fiyatMetni: String(urun.fiyat).replace(".", ","),
          eskiFiyatMetni: urun.eskiFiyat ? String(urun.eskiFiyat).replace(".", ",") : "",
          kategoriId: urun.kategoriId ?? "",
          kisaAciklama: urun.kisaAciklama ?? "",
          aciklama: urun.aciklama ?? "",
          setIcerigi: (urun.setIcerigi ?? []).join("\n"),
          stokta: urun.stokta,
          yayinda: urun.yayinda,
          oneCikan: urun.oneCikan,
          kargoBedava: urun.kargoBedava,
          gorseller: gorseller.map((g) => ({
            url: g.url,
            storagePath: g.storagePath,
            genislik: g.genislik,
            yukseklik: g.yukseklik,
            zeminRengi: g.zeminRengi,
            alt: g.alt,
          })),
        }}
      />

      <div className="pb-28 md:pb-0">
        <UrunSil id={urun.id} baslik={urun.baslik} />
      </div>
    </div>
  );
}
