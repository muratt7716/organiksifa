import { kategorileriGetir } from "@/actions/categories";
import {
  KategoriEkleFormu,
  KategoriSatiri,
} from "@/components/panel/KategoriYonetimi";

export const metadata = { title: "Kategoriler" };

export default async function KategorilerSayfasi() {
  const kategoriler = await kategorileriGetir();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl text-yesil-700">Kategoriler</h1>
        <p className="text-notr-600 text-sm mt-1 olcu">
          Ürünleri gruplamak için kullanılır. Görünürlüğü kapatılan kategori sitede
          çıkmaz ama içindeki ürünler silinmez.
        </p>
      </div>

      <KategoriEkleFormu />

      {kategoriler.length === 0 ? (
        <p className="bg-notr-0 rounded-panel p-8 text-center text-notr-600 border border-notr-200">
          Henüz kategori yok. Yukarıdan ekleyebilirsin.
        </p>
      ) : (
        <ul className="bg-notr-0 rounded-panel px-4 border border-notr-200">
          {kategoriler.map((k) => (
            <KategoriSatiri key={k.id} kategori={k} />
          ))}
        </ul>
      )}
    </div>
  );
}
