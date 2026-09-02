"use client";

import { useRef, useState } from "react";
import { Crop, Square, RectangleVertical, Scan } from "lucide-react";
import type { Kutu } from "@/lib/image-analysis";
import { cn } from "@/lib/utils";

type Oran = { ad: string; deger: number | null; Ikon: typeof Square };

const ORANLAR: Oran[] = [
  { ad: "Serbest", deger: null, Ikon: Crop },
  { ad: "Kare", deger: 1, Ikon: Square },
  { ad: "Dikey", deger: 4 / 5, Ikon: RectangleVertical },
];

/** Görselin ortasına, verilen orana uyan en büyük kutuyu yerleştirir. */
function ortalanmisKutu(g: number, y: number, oran: number): Kutu {
  let w = g;
  let h = w / oran;
  if (h > y) {
    h = y;
    w = h * oran;
  }
  return {
    x: Math.round((g - w) / 2),
    y: Math.round((y - h) / 2),
    w: Math.round(w),
    h: Math.round(h),
  };
}

/**
 * Kırpma ekranı. Atlanabilir.
 *
 * Koordinatlar GÖRSELİN kendi ölçüsünden okunur, kabın değil. Görsel kabın
 * içinde ortalanıp küçüldüğü için kabın ölçüsü kullanılırsa seçilen alan
 * kayar ve yanlış bölge kırpılır.
 */
export function ImageCropper({
  src,
  genislik,
  yukseklik,
  onTamam,
  onAtla,
}: {
  src: string;
  genislik: number;
  yukseklik: number;
  onTamam: (kutu: Kutu) => void;
  onAtla: () => void;
}) {
  const [oran, setOran] = useState<number | null>(null);
  const [kutu, setKutu] = useState<Kutu>({ x: 0, y: 0, w: 0, h: 0 });
  const [surukle, setSurukle] = useState<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const secili = kutu.w > 16 && kutu.h > 16;

  /** Ekran koordinatını görselin piksel koordinatına çevirir. */
  function konum(e: React.PointerEvent) {
    const el = imgRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(
        0,
        Math.min(genislik, Math.round(((e.clientX - r.left) / r.width) * genislik)),
      ),
      y: Math.max(
        0,
        Math.min(yukseklik, Math.round(((e.clientY - r.top) / r.height) * yukseklik)),
      ),
    };
  }

  function oranSec(yeni: number | null) {
    setOran(yeni);
    setKutu(
      yeni === null
        ? { x: 0, y: 0, w: 0, h: 0 }
        : ortalanmisKutu(genislik, yukseklik, yeni),
    );
  }

  function surukleGuncelle(p: { x: number; y: number }) {
    if (!surukle) return;

    const x = Math.min(surukle.x, p.x);
    const y = Math.min(surukle.y, p.y);
    let w = Math.abs(p.x - surukle.x);
    let h = Math.abs(p.y - surukle.y);

    if (oran !== null) {
      // Oran kilidi: uzun kenara göre kısa kenarı yeniden hesapla
      if (w / oran > h) h = w / oran;
      else w = h * oran;
    }

    setKutu({
      x,
      y,
      w: Math.min(w, genislik - x),
      h: Math.min(h, yukseklik - y),
    });
  }

  const yuzde = (deger: number, tam: number) => `${(deger / tam) * 100}%`;

  return (
    <div className="space-y-3">
      <p className="text-sm text-notr-600">
        Fotoğrafın üzerinde sürükleyerek kullanmak istediğin alanı seç. Ürün
        kartında en düzgün duran <strong className="text-notr-900">Kare</strong>{" "}
        seçenektir. Gerekmiyorsa atlayabilirsin.
      </p>

      <div className="flex flex-wrap gap-2">
        {ORANLAR.map(({ ad, deger, Ikon }) => (
          <button
            key={ad}
            type="button"
            onClick={() => oranSec(deger)}
            aria-pressed={oran === deger}
            className={cn(
              "inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-kontrol",
              "text-sm border cursor-pointer transition-colors",
              oran === deger
                ? "bg-yesil-700 text-notr-0 border-yesil-700"
                : "bg-notr-0 border-notr-200 hover:border-yesil-400",
            )}
          >
            <Ikon size={16} aria-hidden="true" />
            {ad}
          </button>
        ))}
        {oran !== null && (
          <button
            type="button"
            onClick={() => oranSec(oran)}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-kontrol
                       text-sm border border-notr-200 bg-notr-0 cursor-pointer
                       hover:border-yesil-400 transition-colors"
          >
            <Scan size={16} aria-hidden="true" />
            Ortala
          </button>
        )}
      </div>

      {/* Kap yalnızca hizalama yapar; ölçüm her zaman <img> üzerinden. */}
      <div className="grid place-items-center bg-notr-100 rounded-gorsel overflow-hidden">
        <div
          className="relative select-none touch-none cursor-crosshair"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const p = konum(e);
            setSurukle(p);
            setKutu({ x: p.x, y: p.y, w: 0, h: 0 });
          }}
          onPointerMove={(e) => surukleGuncelle(konum(e))}
          onPointerUp={() => setSurukle(null)}
          onPointerCancel={() => setSurukle(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            className="block max-h-[55vh] w-auto max-w-full"
            draggable={false}
          />

          {secili && (
            <div
              className="absolute border-2 border-yesil-700 pointer-events-none
                         shadow-[0_0_0_9999px_rgba(23,33,27,0.55)]"
              style={{
                left: yuzde(kutu.x, genislik),
                top: yuzde(kutu.y, yukseklik),
                width: yuzde(kutu.w, genislik),
                height: yuzde(kutu.h, yukseklik),
              }}
            />
          )}
        </div>
      </div>

      {secili && (
        <p className="text-xs text-notr-400 rakam" aria-live="polite">
          Seçilen alan: {Math.round(kutu.w)} × {Math.round(kutu.h)} piksel
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onAtla}
          className="flex-1 min-h-[48px] rounded-kontrol border border-notr-200
                     bg-notr-0 cursor-pointer"
        >
          Kırpmadan devam et
        </button>
        <button
          type="button"
          disabled={!secili}
          onClick={() => onTamam(kutu)}
          className="flex-1 min-h-[48px] rounded-kontrol bg-yesil-700 text-notr-0
                     font-medium disabled:opacity-40 cursor-pointer"
        >
          Kırp ve kullan
        </button>
      </div>
    </div>
  );
}
