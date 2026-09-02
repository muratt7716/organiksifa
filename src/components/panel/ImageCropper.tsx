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
 * Neden gerekli: yüklenen görsellerin bir kısmı telefon ekran görüntüsü
 * (saat, pil, WhatsApp çubuğu) veya çok uzun infografik oluyor. Kare kırpma
 * seçeneği, ürün kartında en düzgün duran görseli tek dokunuşla veriyor.
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
  const ref = useRef<HTMLDivElement>(null);

  const secili = kutu.w > 16 && kutu.h > 16;

  function konum(e: React.PointerEvent) {
    const r = ref.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(genislik, Math.round(((e.clientX - r.left) / r.width) * genislik))),
      y: Math.max(0, Math.min(yukseklik, Math.round(((e.clientY - r.top) / r.height) * yukseklik))),
    };
  }

  function oranSec(yeni: number | null) {
    setOran(yeni);
    if (yeni === null) {
      setKutu({ x: 0, y: 0, w: 0, h: 0 });
    } else {
      setKutu(ortalanmisKutu(genislik, yukseklik, yeni));
    }
  }

  function surukleGuncelle(p: { x: number; y: number }) {
    if (!surukle) return;
    let w = Math.abs(p.x - surukle.x);
    let h = Math.abs(p.y - surukle.y);

    if (oran !== null) {
      // Oran kilidi: kısa kenarı uzun kenara göre yeniden hesapla
      if (w / oran > h) h = w / oran;
      else w = h * oran;
    }

    const x = Math.max(0, Math.min(surukle.x, p.x));
    const y = Math.max(0, Math.min(surukle.y, p.y));

    setKutu({
      x,
      y,
      w: Math.min(w, genislik - x),
      h: Math.min(h, yukseklik - y),
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-notr-600">
        Gereksiz kısımları (telefon çubuğu, boşluk) çıkarmak için fotoğrafın
        üzerinde sürükle. Ürün kartında en düzgün duran{" "}
        <strong className="text-notr-900">Kare</strong> seçenektir.
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
        <button
          type="button"
          onClick={() => oranSec(oran ?? 1)}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-kontrol
                     text-sm border border-notr-200 bg-notr-0 cursor-pointer
                     hover:border-yesil-400 transition-colors"
        >
          <Scan size={16} aria-hidden="true" />
          Ortala
        </button>
      </div>

      <div
        ref={ref}
        className="relative select-none touch-none rounded-gorsel overflow-hidden
                   bg-notr-100 cursor-crosshair max-h-[55vh] grid place-items-center"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          const p = konum(e);
          setSurukle(p);
          setKutu({ x: p.x, y: p.y, w: 0, h: 0 });
        }}
        onPointerMove={(e) => surukleGuncelle(konum(e))}
        onPointerUp={() => setSurukle(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="w-full h-auto max-h-[55vh] object-contain block"
          draggable={false}
        />

        {secili && (
          <div
            className="absolute border-2 border-yesil-700 pointer-events-none
                       shadow-[0_0_0_9999px_rgba(23,33,27,0.55)]"
            style={{
              left: `${(kutu.x / genislik) * 100}%`,
              top: `${(kutu.y / yukseklik) * 100}%`,
              width: `${(kutu.w / genislik) * 100}%`,
              height: `${(kutu.h / yukseklik) * 100}%`,
            }}
          />
        )}
      </div>

      {secili && (
        <p className="text-xs text-notr-400 rakam" aria-live="polite">
          Seçilen alan: {kutu.w} × {kutu.h} piksel
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
