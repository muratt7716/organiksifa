"use server";

import { sepetUrunleri, type KatalogUrunu } from "@/lib/catalog";
import { ayarlariGetir, kargoAyari } from "@/lib/settings";
import { kargoHesapla, type KargoSonucu } from "@/lib/shipping";
import { sayi } from "@/lib/price";

export type SepetOzeti = {
  satirlar: (KatalogUrunu & { adet: number; satirToplam: number })[];
  araToplam: number;
  kargo: KargoSonucu;
  toplam: number;
  bulunamayanlar: string[];
};

/**
 * Sepet içeriğini SUNUCUDA hesaplar.
 * İstemciden yalnızca [{urunId, adet}] alınır; fiyat ve kargo daima
 * veritabanından ve ayarlardan okunur.
 */
export async function sepetIcerigi(
  kalemler: { urunId: string; adet: number }[],
): Promise<SepetOzeti> {
  const bos: SepetOzeti = {
    satirlar: [],
    araToplam: 0,
    kargo: { ucret: 0, kural: "Sepet boş", bedavayaKalan: null },
    toplam: 0,
    bulunamayanlar: [],
  };
  if (kalemler.length === 0) return bos;

  const urunler = await sepetUrunleri(kalemler.map((k) => k.urunId));
  const harita = new Map(urunler.map((u) => [u.id, u]));

  const satirlar = kalemler
    .filter((k) => harita.has(k.urunId))
    .map((k) => {
      const u = harita.get(k.urunId)!;
      const adet = Math.max(1, Math.min(50, k.adet));
      return {
        ...u,
        adet,
        satirToplam: Math.round(sayi(u.fiyat) * adet * 100) / 100,
      };
    });

  const bulunamayanlar = kalemler
    .filter((k) => !harita.has(k.urunId))
    .map((k) => k.urunId);

  const araToplam =
    Math.round(satirlar.reduce((t, s) => t + s.satirToplam, 0) * 100) / 100;

  const ayar = await ayarlariGetir();
  const kargo = kargoHesapla(
    satirlar.map((s) => ({
      fiyat: sayi(s.fiyat),
      adet: s.adet,
      kargoBedava: s.kargoBedava,
    })),
    kargoAyari(ayar),
  );

  return {
    satirlar,
    araToplam,
    kargo,
    toplam: Math.round((araToplam + kargo.ucret) * 100) / 100,
    bulunamayanlar,
  };
}
