"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SepetKalemi = {
  urunId: string;
  adet: number;
};

type SepetDurumu = {
  kalemler: SepetKalemi[];
  ekle: (urunId: string, adet?: number) => void;
  adetAyarla: (urunId: string, adet: number) => void;
  cikar: (urunId: string) => void;
  temizle: () => void;
  toplamAdet: () => number;
};

/**
 * Sepet yalnızca ürün id'si ve adet tutar.
 * Fiyat ve başlık BİLEREK saklanmaz — sunucu her zaman güncel değeri
 * veritabanından okur. localStorage'a yazılan bir fiyata güvenilemez.
 */
export const useSepet = create<SepetDurumu>()(
  persist(
    (set, get) => ({
      kalemler: [],

      ekle: (urunId, adet = 1) =>
        set((s) => {
          const mevcut = s.kalemler.find((k) => k.urunId === urunId);
          if (mevcut) {
            return {
              kalemler: s.kalemler.map((k) =>
                k.urunId === urunId
                  ? { ...k, adet: Math.min(50, k.adet + adet) }
                  : k,
              ),
            };
          }
          return { kalemler: [...s.kalemler, { urunId, adet }] };
        }),

      adetAyarla: (urunId, adet) =>
        set((s) => ({
          kalemler:
            adet <= 0
              ? s.kalemler.filter((k) => k.urunId !== urunId)
              : s.kalemler.map((k) =>
                  k.urunId === urunId ? { ...k, adet: Math.min(50, adet) } : k,
                ),
        })),

      cikar: (urunId) =>
        set((s) => ({ kalemler: s.kalemler.filter((k) => k.urunId !== urunId) })),

      temizle: () => set({ kalemler: [] }),

      toplamAdet: () => get().kalemler.reduce((t, k) => t + k.adet, 0),
    }),
    { name: "organiksifa-sepet", version: 1 },
  ),
);
