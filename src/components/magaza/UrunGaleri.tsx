"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";
import { GorselCercevesi } from "./GorselCercevesi";
import { cn } from "@/lib/utils";

export type GaleriGorseli = {
  id: string;
  url: string;
  alt: string;
  genislik: number;
  yukseklik: number;
  zeminRengi: string;
};

/**
 * Ürün görsel galerisi.
 *
 * Sorun: infografikler çok uzun (1:2'ye varan oranlar). Sayfaya olduğu gibi
 * konursa 1700 piksel yükseklikte bir şerit oluyor ve sağdaki bilgi paneli
 * ekranda kayboluyor.
 *
 * Çözüm: ana görsel 4:5 sabit çerçevede gösterilir (bulanık arka planla,
 * kırpmadan). Uzun görselin tamamını okumak isteyen "Büyüt"e basıp tam
 * ekranda görür. Alttaki küçük görsellerle diğer fotoğraflara geçilir.
 */
export function UrunGaleri({
  gorseller,
  baslik,
}: {
  gorseller: GaleriGorseli[];
  baslik: string;
}) {
  const [aktif, setAktif] = useState(0);
  const [buyuk, setBuyuk] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (gorseller.length === 0) {
    return (
      <GorselCercevesi
        url={null}
        alt={baslik}
        oran="4 / 5"
        sizes="(max-width: 1024px) 100vw, 55vw"
      />
    );
  }

  const g = gorseller[Math.min(aktif, gorseller.length - 1)];
  const uzunMu = g.yukseklik > g.genislik * 1.35;

  function ac() {
    setBuyuk(true);
    dialogRef.current?.showModal();
  }
  function kapat() {
    setBuyuk(false);
    dialogRef.current?.close();
  }
  function git(yon: 1 | -1) {
    setAktif((i) => (i + yon + gorseller.length) % gorseller.length);
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <GorselCercevesi
          url={g.url}
          alt={g.alt || baslik}
          zeminRengi={g.zeminRengi}
          oran="4 / 5"
          sizes="(max-width: 1024px) 100vw, 55vw"
          oncelik
          icClassName="p-2"
        />

        <button
          type="button"
          onClick={ac}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5
                     min-h-[44px] px-3 rounded-kontrol bg-notr-0/95 text-sm
                     cursor-pointer hover:bg-notr-0 transition-colors shadow-sm"
        >
          <Expand size={16} aria-hidden="true" />
          {uzunMu ? "Tamamını gör" : "Büyüt"}
        </button>

        {gorseller.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Önceki fotoğraf"
              onClick={() => git(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-11 grid
                         place-items-center rounded-full bg-notr-0/90 cursor-pointer
                         hover:bg-notr-0 transition-colors"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Sonraki fotoğraf"
              onClick={() => git(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-11 grid
                         place-items-center rounded-full bg-notr-0/90 cursor-pointer
                         hover:bg-notr-0 transition-colors"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {gorseller.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {gorseller.map((x, i) => (
            <li key={x.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setAktif(i)}
                aria-label={`${i + 1}. fotoğrafı göster`}
                aria-current={i === aktif ? "true" : undefined}
                className={cn(
                  "relative block size-20 rounded-gorsel overflow-hidden cursor-pointer",
                  "border-2 transition-colors",
                  i === aktif ? "border-yesil-700" : "border-transparent",
                )}
                style={{ backgroundColor: x.zeminRengi }}
              >
                <Image
                  src={x.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Tam ekran görüntüleyici — uzun infografikler burada baştan sona okunur */}
      <dialog
        ref={dialogRef}
        onClose={() => setBuyuk(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) kapat();
        }}
        className="backdrop:bg-notr-900/80 bg-transparent p-0 max-w-none max-h-none
                   w-full h-full m-0"
      >
        {buyuk && (
          <div className="min-h-full w-full overflow-y-auto p-4 sm:p-8">
            <div className="sticky top-0 z-10 flex justify-end">
              <button
                type="button"
                onClick={kapat}
                aria-label="Kapat"
                className="size-12 grid place-items-center rounded-full bg-notr-0
                           cursor-pointer shadow-lg"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="mx-auto max-w-2xl -mt-12 pt-14 pb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.url}
                alt={g.alt || baslik}
                width={g.genislik}
                height={g.yukseklik}
                className="w-full h-auto rounded-panel bg-notr-0"
              />
              {gorseller.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {gorseller.map((x, i) => (
                    <button
                      key={x.id}
                      type="button"
                      onClick={() => setAktif(i)}
                      aria-label={`${i + 1}. fotoğraf`}
                      className={cn(
                        "size-3 rounded-full cursor-pointer transition-colors",
                        i === aktif ? "bg-notr-0" : "bg-notr-0/40",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
