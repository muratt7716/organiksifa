/**
 * Türkiye numarasını WhatsApp'ın beklediği biçime çevirir: 905321112233
 * Başında + yok, başında 0 yok, boşluk yok.
 *
 * Ablan ayarlara "0532 111 22 33" yazarsa ve bu normalize edilmezse
 * sitedeki TÜM WhatsApp bağlantıları sessizce çalışmaz hale gelir —
 * hiçbir hata görünmez, sadece sipariş gelmez.
 */
export function telefonNormalize(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (!d) return null;

  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("90") && d.length === 12) d = d.slice(2);
  if (d.startsWith("0") && d.length === 11) d = d.slice(1);

  if (d.length !== 10) return null;
  return `90${d}`;
}

/** 905321112233 → +90 532 111 22 33 */
export function telefonGoster(e164: string): string {
  const d = e164.replace(/\D/g, "");
  if (d.length !== 12 || !d.startsWith("90")) return e164;
  const n = d.slice(2);
  return `+90 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8, 10)}`;
}
