export type KargoAyari = {
  kargoBedavaAcik: boolean;
  kargoBedavaLimit: number | null;
  kargoUcreti: number | null;
};

export type KargoSatiri = {
  fiyat: number;
  adet: number;
  kargoBedava: boolean;
};

export type KargoSonucu = {
  ucret: number;
  kural: string;
  /** Bedava kargoya kalan tutar. null → çubuk gösterilmez. */
  bedavayaKalan: number | null;
};

/**
 * Kargo kuralı TEK CÜMLEDİR ve yalnızca burada uygulanır:
 * "Sepette kargo bedava işaretli bir ürün varsa tüm sipariş bedavadır;
 *  yoksa ve bedava kargo açıksa ara toplam limiti geçtiğinde bedavadır;
 *  aksi halde sabit kargo ücreti uygulanır."
 *
 * Sonuç `kargoKuraliSnapshot` olarak siparişe yazılır — böylece
 * "neden bu kadar kargo aldın" tartışmasının cevabı kayıtta durur.
 */
export function kargoHesapla(
  satirlar: KargoSatiri[],
  ayar: KargoAyari,
): KargoSonucu {
  const araToplam = satirlar.reduce((t, s) => t + s.fiyat * s.adet, 0);
  const ucret = ayar.kargoUcreti ?? 0;

  if (satirlar.length === 0) {
    return { ucret: 0, kural: "Sepet boş", bedavayaKalan: null };
  }

  if (satirlar.some((s) => s.kargoBedava)) {
    return {
      ucret: 0,
      kural: "Sepette kargo bedava ürün var",
      bedavayaKalan: null,
    };
  }

  if (ucret <= 0) {
    return { ucret: 0, kural: "Kargo her siparişte ücretsiz", bedavayaKalan: null };
  }

  if (!ayar.kargoBedavaAcik || ayar.kargoBedavaLimit === null) {
    return { ucret, kural: "Sabit kargo ücreti", bedavayaKalan: null };
  }

  if (araToplam >= ayar.kargoBedavaLimit) {
    return {
      ucret: 0,
      kural: `${ayar.kargoBedavaLimit} ₺ üzeri kargo bedava`,
      bedavayaKalan: null,
    };
  }

  return {
    ucret,
    kural: `${ayar.kargoBedavaLimit} ₺ altı — sabit kargo`,
    bedavayaKalan: Math.round((ayar.kargoBedavaLimit - araToplam) * 100) / 100,
  };
}
