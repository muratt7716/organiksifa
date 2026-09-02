export const KOVA = "urunler";

/**
 * Kova PUBLIC'tir. Okuma imzalı URL ile yapılsaydı her URL benzersiz olur,
 * CDN önbelleğe alamaz ve Supabase'in 5 GB/ay trafik kotası ~10 kat erken
 * dolardı. İmzalı URL yalnızca YÜKLEME içindir.
 */
export function genelUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${KOVA}/${path}`;
}
