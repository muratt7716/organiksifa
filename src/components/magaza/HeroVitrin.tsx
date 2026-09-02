"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fiyatBicimle, sayi, indirimYuzdesi } from "@/lib/price";
import type { KatalogUrunu } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const SURE_MS = 6000;

/**
 * Hero vitrini — öne çıkan ürünler kemer biçimli bir çerçevede sırayla döner.
 *
 * Çerçeve markanın apotek kemerinden geliyor; ürün logodaki pencerenin
 * içinde duruyor. Görsel kırpılmaz: kendi zemin renginde ortalanır.
 *
 * Erişilebilirlik:
 * - prefers-reduced-motion açıksa otomatik dönme tamamen kapanır
 * - Fareyle üzerine gelince veya klavye odağı girince durur
 * - Sol/sağ ok tuşlarıyla gezilir, noktalar birer düğmedir
 * - Değişen bölge aria-live ile bildirilir
 */
export function HeroVitrin({ urunler }: { urunler: KatalogUrunu[] }) {
  const [aktif, setAktif] = useState(0);
  const [durdu, setDurdu] = useState(false);
  const bolgeRef = useRef<HTMLDivElement>(null);

  const adet = urunler.length;
  const cokMu = adet > 1;

  const git = useCallback(
    (yon: 1 | -1) => setAktif((i) => (i + yon + adet) % adet),
    [adet],
  );

  useEffect(() => {
    if (!cokMu || durdu) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const t = setInterval(() => setAktif((i) => (i + 1) % adet), SURE_MS);
    return () => clearInterval(t);
  }, [adet, cokMu, durdu]);

  if (adet === 0) return null;

  const u = urunler[Math.min(aktif, adet - 1)];
  const fiyat = sayi(u.fiyat);
  const eski = u.eskiFiyat ? sayi(u.eskiFiyat) : null;
  const indirim = indirimYuzdesi(fiyat, eski);

  return (
    <div
      ref={bolgeRef}
      className="w-full max-w-[380px] mx-auto lg:mx-0 lg:max-w-none"
      onMouseEnter={() => setDurdu(true)}
      onMouseLeave={() => setDurdu(false)}
      onFocusCapture={() => setDurdu(true)}
      onBlurCapture={() => setDurdu(false)}
      onKeyDown={(e) => {
        if (!cokMu) return;
        if (e.key === "ArrowLeft") git(-1);
        if (e.key === "ArrowRight") git(1);
      }}
      aria-roledescription="vitrin"
      aria-label="Öne çıkan ürünler"
    >
      <div className="relative">
        {/* Kemer çerçeve — markanın apotek penceresi */}
        <div
          className={cn(
            "relative overflow-hidden bg-notr-0 border border-notr-200",
            "rounded-t-[999px] rounded-b-panel",
            "shadow-[0_18px_50px_-24px_rgba(23,33,27,0.35)]",
          )}
        >
          <Link
            href={`/urun/${u.slug}`}
            className="block group"
            aria-label={`${u.baslik} — ${fiyatBicimle(fiyat)}`}
          >
            {/* Zemin BEYAZ ve görselin etrafında bol boşluk var.
                Görsel çerçeveyi baştan başa doldurursa afiş gibi duruyor;
                boşlukla çerçevelenince ürün fotoğrafı gibi okunuyor. */}
            <div
              key={u.id}
              className="relative aspect-[4/5] bg-notr-0
                         animate-[belir_520ms_var(--ease-giris)_both]"
            >
              {u.kapakUrl && (
                <div className="absolute inset-0 p-7 sm:p-9">
                  <div className="relative w-full h-full">
                    <Image
                      src={u.kapakUrl}
                      alt={u.kapakAlt || u.baslik}
                      fill
                      priority
                      sizes="(max-width: 1024px) 340px, 420px"
                      className="object-contain transition-transform duration-700
                                 group-hover:scale-[1.04]"
                    />
                  </div>
                </div>
              )}

              {/* Rozet kemerin kavisinin ALTINDA durmalı; yukarıda kalırsa
                  yuvarlatılmış üst kenar tarafından kırpılıyor. */}
              {indirim !== null && (
                <span
                  className="absolute top-[34%] left-3 z-10 bg-amber-600 text-notr-0
                             text-xs font-medium px-2.5 py-1 rounded shadow-sm"
                >
                  %{indirim} indirim
                </span>
              )}
            </div>

            {/* Etiket bandı */}
            <div className="bg-notr-0 px-5 py-4 border-t border-notr-200">
              <p
                aria-live="polite"
                className="font-baslik text-lg leading-snug line-clamp-1
                           group-hover:text-yesil-700 transition-colors"
              >
                {u.baslik}
              </p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="rakam text-amber-600 font-medium">
                  {fiyatBicimle(fiyat)}
                </span>
                {eski && (
                  <span className="rakam text-sm text-notr-400 line-through">
                    {fiyatBicimle(eski)}
                  </span>
                )}
              </p>
            </div>
          </Link>
        </div>

        {cokMu && (
          <>
            {/* Oklar çerçevenin İÇİNDE: dışarı taşarsa dar ekranlarda
                viewport kenarından kesiliyor. */}
            <button
              type="button"
              onClick={() => git(-1)}
              aria-label="Önceki ürün"
              className="absolute left-2 top-[46%] -translate-y-1/2 size-11 grid
                         place-items-center rounded-full bg-notr-0/95 border border-notr-200
                         cursor-pointer hover:border-yesil-400 transition-colors
                         shadow-sm backdrop-blur-sm"
            >
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => git(1)}
              aria-label="Sonraki ürün"
              className="absolute right-2 top-[46%] -translate-y-1/2 size-11 grid
                         place-items-center rounded-full bg-notr-0/95 border border-notr-200
                         cursor-pointer hover:border-yesil-400 transition-colors
                         shadow-sm backdrop-blur-sm"
            >
              <ChevronRight size={19} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {cokMu && (
        <div className="flex justify-center gap-2 mt-5">
          {urunler.map((x, i) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setAktif(i)}
              aria-label={`${i + 1}. ürün: ${x.baslik}`}
              aria-current={i === aktif ? "true" : undefined}
              className="h-11 px-1 grid place-items-center cursor-pointer group"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  i === aktif
                    ? "w-7 bg-yesil-700"
                    : "w-1.5 bg-notr-300 group-hover:bg-yesil-400",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
