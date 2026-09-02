import { fiyatBicimle } from "./price";

export type WaSiparisSatiri = {
  baslik: string;
  adet: number;
  satirToplam: number;
};

export type WaSiparis = {
  siparisNo: string;
  musteriAdi: string;
  satirlar: WaSiparisSatiri[];
  araToplam: number;
  kargoUcreti: number;
  toplam: number;
  siteUrl?: string;
};

/**
 * wa.me bağlantısı üretir.
 *
 * encodeURI DEĞİL encodeURIComponent kullanılır: encodeURI, `&` ve `#`
 * karakterlerini kaçırmaz ve mesaj o noktada kesilir.
 */
export function waLink(numaraE164: string, mesaj: string): string {
  const numara = numaraE164.replace(/\D/g, "");
  return `https://wa.me/${numara}?text=${encodeURIComponent(mesaj)}`;
}

/**
 * Sipariş mesajı.
 *
 * Sipariş numarası EN BAŞTADIR: WhatsApp uzun mesajları arayüzde kırpabiliyor;
 * kırpılsa bile siparişin kimliği görünür kalmalı. Tam liste zaten veritabanında.
 */
export function siparisMesaji(s: WaSiparis): string {
  const satirlar = s.satirlar
    .map((x) => `• ${x.baslik} x${x.adet} — ${fiyatBicimle(x.satirToplam)}`)
    .join("\n");

  const kargo =
    s.kargoUcreti > 0 ? `Kargo: ${fiyatBicimle(s.kargoUcreti)}` : "Kargo: Ücretsiz";

  return [
    `Sipariş No: ${s.siparisNo}`,
    `Ad Soyad: ${s.musteriAdi}`,
    "",
    satirlar,
    "",
    `Ara toplam: ${fiyatBicimle(s.araToplam)}`,
    kargo,
    `TOPLAM: ${fiyatBicimle(s.toplam)}`,
    "",
    "Siparişimi onaylıyorum, ödeme ve teslimat için bilgi verir misiniz?",
  ].join("\n");
}

/** Panelden müşteriye yazarken kullanılan hazır şablonlar. */
export function musteriyeMesaj(
  tip: "onay" | "kargo" | "teslim",
  veri: { siparisNo: string; musteriAdi: string; kargoFirmasi?: string; takipNo?: string },
): string {
  const ad = veri.musteriAdi.split(" ")[0];
  switch (tip) {
    case "onay":
      return `Merhaba ${ad}, ${veri.siparisNo} numaralı siparişiniz alındı. Ödeme bilgilerini paylaşabilir miyiz?`;
    case "kargo":
      return `Merhaba ${ad}, ${veri.siparisNo} numaralı siparişiniz kargoya verildi.${
        veri.kargoFirmasi ? ` Firma: ${veri.kargoFirmasi}.` : ""
      }${veri.takipNo ? ` Takip no: ${veri.takipNo}` : ""}`;
    case "teslim":
      return `Merhaba ${ad}, ${veri.siparisNo} numaralı siparişiniz teslim edildi. Memnun kaldıysanız değerlendirmenizi bekleriz!`;
  }
}
