"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { useSepet } from "@/store/sepet";

export function SepeteEkle({
  urunId,
  stokta,
}: {
  urunId: string;
  stokta: boolean;
}) {
  const ekle = useSepet((s) => s.ekle);
  const [adet, setAdet] = useState(1);
  const [eklendi, setEklendi] = useState(false);

  if (!stokta) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className="w-full h-14 rounded-kontrol bg-notr-200 text-notr-600 font-medium
                     cursor-not-allowed"
        >
          Şu an tükendi
        </button>
        <p className="text-sm text-notr-600 text-center">
          Ne zaman geleceğini sormak için WhatsApp&apos;tan yazabilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-notr-200 rounded-kontrol">
          <button
            type="button"
            aria-label="Adedi azalt"
            onClick={() => setAdet((a) => Math.max(1, a - 1))}
            className="size-12 grid place-items-center text-notr-600 cursor-pointer
                       hover:text-yesil-700 transition-colors"
          >
            <Minus size={18} aria-hidden="true" />
          </button>
          <span className="w-10 text-center rakam" aria-live="polite">
            {adet}
          </span>
          <button
            type="button"
            aria-label="Adedi artır"
            onClick={() => setAdet((a) => Math.min(50, a + 1))}
            className="size-12 grid place-items-center text-notr-600 cursor-pointer
                       hover:text-yesil-700 transition-colors"
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            ekle(urunId, adet);
            setEklendi(true);
            setTimeout(() => setEklendi(false), 2600);
          }}
          className="flex-1 h-14 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                     inline-flex items-center justify-center gap-2 cursor-pointer
                     hover:bg-yesil-800 transition-colors"
        >
          {eklendi ? (
            <>
              <Check size={19} aria-hidden="true" /> Sepete eklendi
            </>
          ) : (
            <>
              <ShoppingBag size={19} aria-hidden="true" /> Sepete ekle
            </>
          )}
        </button>
      </div>

      {eklendi && (
        <Link
          href="/sepet"
          className="block w-full h-12 rounded-kontrol border border-yesil-700
                     text-yesil-700 font-medium grid place-items-center"
        >
          Sepete git
        </Link>
      )}
    </div>
  );
}
