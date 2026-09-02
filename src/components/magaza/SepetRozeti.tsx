"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useSepet } from "@/store/sepet";
import { useSepetHidrasyonu } from "@/store/hidrasyon";

export function SepetRozeti() {
  const kalemler = useSepet((s) => s.kalemler);
  const hidre = useSepetHidrasyonu();

  const adet = kalemler.reduce((t, k) => t + k.adet, 0);
  const goster = hidre && adet > 0;

  return (
    <Link
      href="/sepet"
      className="relative grid place-items-center size-11 rounded-kontrol
                 hover:bg-yesil-50 transition-colors"
      aria-label={goster ? `Sepet, ${adet} ürün` : "Sepet"}
    >
      <ShoppingBag size={21} aria-hidden="true" />
      {goster && (
        <span
          className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rakam
                     rounded-full bg-amber-600 text-notr-0 text-[10px] grid place-items-center"
        >
          {adet > 99 ? "99+" : adet}
        </span>
      )}
    </Link>
  );
}
