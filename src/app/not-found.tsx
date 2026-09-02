import Link from "next/link";
import { Leaf } from "lucide-react";

export default function BulunamadiSayfasi() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="text-center space-y-5 max-w-md">
        <Leaf size={44} className="mx-auto text-yesil-700" aria-hidden="true" />
        <h1 className="font-baslik text-3xl">Bu sayfayı bulamadık</h1>
        <p className="text-notr-600">
          Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Ürünlere göz
          atmak ister misin?
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center min-h-[52px] px-6 rounded-kontrol
                       bg-yesil-700 text-notr-0 font-medium"
          >
            Ana sayfa
          </Link>
          <Link
            href="/urunler"
            className="inline-flex items-center min-h-[52px] px-6 rounded-kontrol
                       border border-notr-200"
          >
            Ürünler
          </Link>
        </div>
      </div>
    </main>
  );
}
