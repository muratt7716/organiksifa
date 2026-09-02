const TR_HARF: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

/** NFD ayrıştırmasından kalan birleşik aksan işaretleri (U+0300–U+036F). */
const AKSAN = new RegExp("[\\u0300-\\u036f]", "g");

/** Başlığı URL'de kullanılabilir hale getirir. Türkçe karakterleri ASCII'ye çevirir. */
export function slugify(input: string): string {
  return input
    .split("")
    .map((ch) => TR_HARF[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFD")
    .replace(AKSAN, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Mevcut slug'larla çakışmayan bir slug üretir: merhem → merhem-2 → merhem-3 */
export function benzersizSlug(taban: string, mevcutlar: string[]): string {
  const kok = slugify(taban) || "urun";
  if (!mevcutlar.includes(kok)) return kok;
  let n = 2;
  while (mevcutlar.includes(`${kok}-${n}`)) n++;
  return `${kok}-${n}`;
}
