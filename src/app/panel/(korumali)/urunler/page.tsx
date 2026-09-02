import Link from "next/link";
import { Plus, PackageOpen } from "lucide-react";
import { urunleriGetir } from "@/actions/products";
import { UrunSatiri } from "@/components/panel/UrunSatiri";

export const metadata = { title: "Ürünler" };

export default async function UrunlerSayfasi() {
  const urunler = await urunleriGetir();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl text-yesil-700">Ürünler</h1>
          {urunler.length > 0 && (
            <p className="text-sm text-notr-600 mt-0.5">
              {urunler.length} ürün · {urunler.filter((u) => u.yayinda).length} yayında
            </p>
          )}
        </div>
        <Link
          href="/panel/urunler/yeni"
          className="inline-flex items-center gap-2 h-12 px-4 rounded-kontrol
                     bg-yesil-700 text-notr-0 font-medium shrink-0 hover:bg-yesil-800
                     transition-colors"
        >
          <Plus size={18} aria-hidden="true" />
          <span className="hidden sm:inline">Yeni ürün</span>
          <span className="sm:hidden">Yeni</span>
        </Link>
      </div>

      {urunler.length === 0 ? (
        <div className="bg-notr-0 rounded-panel p-10 text-center space-y-3 border border-notr-200">
          <PackageOpen size={40} className="mx-auto text-notr-400" aria-hidden="true" />
          <p className="text-notr-600">Henüz ürün yok.</p>
          <Link
            href="/panel/urunler/yeni"
            className="inline-block text-yesil-700 underline underline-offset-4"
          >
            İlk ürününü ekle
          </Link>
        </div>
      ) : (
        <ul className="bg-notr-0 rounded-panel px-4 border border-notr-200">
          {urunler.map((u) => (
            <UrunSatiri key={u.id} urun={u} />
          ))}
        </ul>
      )}
    </div>
  );
}
