"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { urunKaydet } from "@/actions/products";
import { ImageUploader, type GorselKaydi } from "./ImageUploader";
import type { Kategori } from "@/actions/categories";

export type UrunFormVerisi = {
  id?: string;
  baslik: string;
  fiyatMetni: string;
  eskiFiyatMetni: string;
  kategoriId: string;
  kisaAciklama: string;
  aciklama: string;
  setIcerigi: string;
  stokta: boolean;
  yayinda: boolean;
  oneCikan: boolean;
  kargoBedava: boolean;
  gorseller: GorselKaydi[];
};

export const BOS_URUN: UrunFormVerisi = {
  baslik: "",
  fiyatMetni: "",
  eskiFiyatMetni: "",
  kategoriId: "",
  kisaAciklama: "",
  aciklama: "",
  setIcerigi: "",
  stokta: true,
  yayinda: true,
  oneCikan: false,
  kargoBedava: false,
  gorseller: [],
};

const ANAHTARLAR = [
  ["yayinda", "Yayında", "Kapatırsan ürün sitede hiç görünmez"],
  ["stokta", "Stokta var", "Kapatırsan 'Tükendi' yazar, sepete eklenemez"],
  ["oneCikan", "Öne çıkar", "Ana sayfada gösterilir"],
  ["kargoBedava", "Bu üründe kargo bedava", "Sepet tutarına bakılmaz"],
] as const;

export function UrunFormu({
  kategoriler,
  baslangic = BOS_URUN,
}: {
  kategoriler: Kategori[];
  baslangic?: UrunFormVerisi;
}) {
  const [d, setD] = useState(baslangic);
  const [hata, setHata] = useState<string>();
  const [kirli, setKirli] = useState(false);
  const [bekliyor, basla] = useTransition();
  const router = useRouter();

  // Kaydedilmemiş değişiklikle sayfadan çıkışta uyar.
  useEffect(() => {
    if (!kirli) return;
    const uyar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", uyar);
    return () => window.removeEventListener("beforeunload", uyar);
  }, [kirli]);

  function guncelle(yama: Partial<UrunFormVerisi>) {
    setKirli(true);
    setD((eski) => ({ ...eski, ...yama }));
  }

  function kaydet() {
    setHata(undefined);
    basla(async () => {
      const sonuc = await urunKaydet({
        id: d.id,
        baslik: d.baslik,
        fiyatMetni: d.fiyatMetni,
        eskiFiyatMetni: d.eskiFiyatMetni,
        kategoriId: d.kategoriId,
        kisaAciklama: d.kisaAciklama,
        aciklama: d.aciklama,
        setIcerigi: d.setIcerigi
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        stokta: d.stokta,
        yayinda: d.yayinda,
        oneCikan: d.oneCikan,
        kargoBedava: d.kargoBedava,
        gorseller: d.gorseller,
      });

      if (sonuc.hata) {
        setHata(sonuc.hata);
        return;
      }
      setKirli(false);
      router.push("/panel/urunler");
      router.refresh();
    });
  }

  const alan =
    "w-full min-h-[48px] px-3 py-2.5 rounded-kontrol border border-notr-200 bg-notr-0 " +
    "focus-visible:border-yesil-700";
  const etiket = "block text-sm font-medium mb-1.5";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        kaydet();
      }}
      className="space-y-6 pb-40 md:pb-6"
    >
      <section className="bg-notr-0 rounded-panel p-4 md:p-5 space-y-4 border border-notr-200">
        <h2 className="text-lg text-yesil-700">Fotoğraflar</h2>
        <ImageUploader
          value={d.gorseller}
          onChange={(g) => guncelle({ gorseller: g })}
        />
      </section>

      <section className="bg-notr-0 rounded-panel p-4 md:p-5 space-y-4 border border-notr-200">
        <h2 className="text-lg text-yesil-700">Ürün bilgisi</h2>

        <div>
          <label htmlFor="baslik" className={etiket}>
            Ürün adı
          </label>
          <input
            id="baslik"
            className={alan}
            value={d.baslik}
            required
            onChange={(e) => guncelle({ baslik: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="fiyat" className={etiket}>
              Fiyat (₺)
            </label>
            <input
              id="fiyat"
              inputMode="decimal"
              className={`${alan} rakam`}
              required
              placeholder="450"
              value={d.fiyatMetni}
              onChange={(e) => guncelle({ fiyatMetni: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="eski" className={etiket}>
              Eski fiyat{" "}
              <span className="text-notr-400 font-normal">(isteğe bağlı)</span>
            </label>
            <input
              id="eski"
              inputMode="decimal"
              className={`${alan} rakam`}
              placeholder="590"
              value={d.eskiFiyatMetni}
              onChange={(e) => guncelle({ eskiFiyatMetni: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="kategori" className={etiket}>
            Kategori
          </label>
          <select
            id="kategori"
            className={alan}
            required
            value={d.kategoriId}
            onChange={(e) => guncelle({ kategoriId: e.target.value })}
          >
            <option value="">Seç…</option>
            {kategoriler
              .filter((k) => k.aktif)
              .map((k) => (
                <option key={k.id} value={k.id}>
                  {k.ad}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="set" className={etiket}>
            Set içeriği{" "}
            <span className="text-notr-400 font-normal">(her satıra bir ürün)</span>
          </label>
          <textarea
            id="set"
            rows={4}
            className={alan}
            value={d.setIcerigi}
            placeholder={"Uyuz kremi\nUyuz solüsyonu\nKatran sabunu\nKabak lifi"}
            onChange={(e) => guncelle({ setIcerigi: e.target.value })}
          />
          <p className="text-xs text-notr-400 mt-1">
            Tek ürünse boş bırak. Set ise içindekileri yaz — ürün sayfasında liste
            olarak görünür.
          </p>
        </div>

        <div>
          <label htmlFor="kisa" className={etiket}>
            Kısa açıklama{" "}
            <span className="text-notr-400 font-normal">(listede görünür)</span>
          </label>
          <textarea
            id="kisa"
            rows={2}
            maxLength={300}
            className={alan}
            value={d.kisaAciklama}
            onChange={(e) => guncelle({ kisaAciklama: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="uzun" className={etiket}>
            Açıklama
          </label>
          <textarea
            id="uzun"
            rows={9}
            className={alan}
            value={d.aciklama}
            onChange={(e) => guncelle({ aciklama: e.target.value })}
          />
          <p className="text-xs text-notr-400 mt-1">
            Fotoğraftaki yazıları buraya da yaz — Google ve arama motorları görselin
            içindeki metni okuyamaz. Bu alan sitenin bulunabilirliğini doğrudan
            etkiliyor.
          </p>
        </div>
      </section>

      <section className="bg-notr-0 rounded-panel p-4 md:p-5 space-y-2 border border-notr-200">
        <h2 className="text-lg text-yesil-700">Görünürlük</h2>
        {ANAHTARLAR.map(([anahtar, baslik, aciklama]) => (
          <label
            key={anahtar}
            className="flex items-start gap-3 min-h-[48px] py-1 cursor-pointer"
          >
            <input
              type="checkbox"
              className="size-5 mt-1 accent-yesil-700"
              checked={d[anahtar]}
              onChange={(e) => guncelle({ [anahtar]: e.target.checked })}
            />
            <span>
              <span className="block font-medium">{baslik}</span>
              <span className="block text-sm text-notr-600">{aciklama}</span>
            </span>
          </label>
        ))}
      </section>

      {hata && (
        <p
          role="alert"
          className="text-sm text-hata bg-hata-zemin rounded-kontrol p-3 border border-hata/20"
        >
          {hata}
        </p>
      )}

      <div
        className="fixed bottom-[58px] inset-x-0 md:static p-3 md:p-0 bg-notr-0 md:bg-transparent
                   border-t border-notr-200 md:border-0 z-30"
      >
        <button
          type="submit"
          disabled={bekliyor}
          className="w-full h-12 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                     disabled:opacity-50 cursor-pointer hover:bg-yesil-800 transition-colors"
        >
          {bekliyor ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
