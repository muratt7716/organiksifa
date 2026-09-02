/**
 * Kullanıcının yazdığı fiyat metnini sayıya çevirir.
 * Ablanın "1.250,00" da "1250.50" da yazabilmesi için iki biçimi de kabul eder.
 * Geçersizse null döner — çağıran taraf Türkçe hata mesajı gösterir.
 */
export function fiyatAyristir(input: string): number | null {
  const s = input.trim().replace(/\s|₺/g, "").replace(/TL/gi, "");
  if (!s) return null;
  if (!/^[\d.,]+$/.test(s)) return null;

  const sonVirgul = s.lastIndexOf(",");
  const sonNokta = s.lastIndexOf(".");
  let normalized: string;

  if (sonVirgul >= 0 && sonNokta >= 0) {
    // Hangisi sondaysa ondalık ayracıdır.
    normalized =
      sonVirgul > sonNokta
        ? s.replace(/\./g, "").replace(",", ".")
        : s.replace(/,/g, "");
  } else if (sonVirgul >= 0) {
    normalized = s.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    // 1.250 / 12.500 → binlik ayracı
    normalized = s.replace(/\./g, "");
  } else {
    normalized = s;
  }

  const n = Number(normalized);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

const BICIM = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function fiyatBicimle(tutar: number): string {
  return `${BICIM.format(tutar)} ₺`;
}

/** numeric sütunundan gelen string'i güvenle sayıya çevirir. */
export function sayi(deger: string | number | null | undefined): number {
  if (deger === null || deger === undefined) return 0;
  const n = typeof deger === "number" ? deger : Number(deger);
  return Number.isFinite(n) ? n : 0;
}

/** İndirim yüzdesi — eski fiyat varsa. */
export function indirimYuzdesi(fiyat: number, eskiFiyat: number | null): number | null {
  if (!eskiFiyat || eskiFiyat <= fiyat) return null;
  return Math.round(((eskiFiyat - fiyat) / eskiFiyat) * 100);
}
