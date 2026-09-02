"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Check, Pencil, X } from "lucide-react";
import {
  kategoriEkle,
  kategoriGuncelle,
  kategoriAktiflikDegistir,
  type Kategori,
} from "@/actions/categories";

export function KategoriEkleFormu() {
  const [durum, action, bekliyor] = useActionState(kategoriEkle, {} as { hata?: string });
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!bekliyor && !durum.hata) ref.current?.reset();
  }, [bekliyor, durum.hata]);

  return (
    <form ref={ref} action={action} className="flex gap-2 items-start">
      <div className="flex-1">
        <label htmlFor="ad" className="sr-only">
          Yeni kategori adı
        </label>
        <input
          id="ad"
          name="ad"
          required
          placeholder="Yeni kategori adı"
          className="w-full h-12 px-3 rounded-kontrol border border-notr-200 bg-notr-0"
        />
        {durum.hata && (
          <p role="alert" className="text-sm text-hata mt-1">
            {durum.hata}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={bekliyor}
        className="h-12 px-5 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                   disabled:opacity-50 cursor-pointer shrink-0 hover:bg-yesil-800 transition-colors"
      >
        Ekle
      </button>
    </form>
  );
}

export function KategoriSatiri({ kategori }: { kategori: Kategori }) {
  const [duzenle, setDuzenle] = useState(false);
  const [ad, setAd] = useState(kategori.ad);
  const [aktif, setAktif] = useState(kategori.aktif);
  const [hata, setHata] = useState<string>();
  const [bekliyor, basla] = useTransition();

  function kaydet() {
    basla(async () => {
      const sonuc = await kategoriGuncelle(kategori.id, ad);
      if (sonuc?.hata) {
        setHata(sonuc.hata);
        return;
      }
      setHata(undefined);
      setDuzenle(false);
    });
  }

  return (
    <li className="flex flex-wrap items-center gap-3 py-2 raf last:border-0">
      {duzenle ? (
        <>
          <input
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            autoFocus
            className="flex-1 min-w-[140px] h-11 px-3 rounded-kontrol border border-notr-200"
          />
          <button
            onClick={kaydet}
            disabled={bekliyor}
            aria-label="Kaydet"
            className="size-11 grid place-items-center text-yesil-700 cursor-pointer"
          >
            <Check size={20} aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              setDuzenle(false);
              setAd(kategori.ad);
            }}
            aria-label="Vazgeç"
            className="size-11 grid place-items-center text-notr-600 cursor-pointer"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 min-w-[100px] truncate">{ad}</span>
          <label className="flex items-center gap-2 text-sm text-notr-600 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={aktif}
              className="size-5 accent-yesil-700"
              onChange={(e) => {
                setAktif(e.target.checked);
                basla(async () => {
                  await kategoriAktiflikDegistir(kategori.id, e.target.checked);
                });
              }}
            />
            Görünür
          </label>
          <button
            onClick={() => setDuzenle(true)}
            aria-label={`${kategori.ad} adını değiştir`}
            className="size-11 grid place-items-center text-notr-600 cursor-pointer
                       hover:text-yesil-700 transition-colors"
          >
            <Pencil size={18} aria-hidden="true" />
          </button>
        </>
      )}
      {hata && (
        <p role="alert" className="text-sm text-hata w-full">
          {hata}
        </p>
      )}
    </li>
  );
}
