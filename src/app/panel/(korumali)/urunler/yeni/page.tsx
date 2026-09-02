import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { kategorileriGetir } from "@/actions/categories";
import { UrunFormu } from "@/components/panel/UrunFormu";

export const metadata = { title: "Yeni ürün" };

export default async function YeniUrunSayfasi() {
  const kategoriler = await kategorileriGetir();

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
        <h1 className="text-2xl text-yesil-700">Yeni ürün</h1>
      </div>

      {kategoriler.length === 0 && (
        <p className="text-sm bg-amber-100 text-amber-700 rounded-kontrol p-3">
          Önce en az bir kategori eklemen gerekiyor.{" "}
          <Link href="/panel/kategoriler" className="underline">
            Kategoriler
          </Link>
        </p>
      )}

      <UrunFormu kategoriler={kategoriler} />
    </div>
  );
}
