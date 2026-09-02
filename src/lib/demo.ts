/**
 * DEMO MODU — yalnızca yerel geliştirme.
 *
 * Supabase kurulmadan önce paneli ve mağazayı gerçek verilerle görebilmek için.
 * Veritabanı gerçektir (PGlite = WASM'a derlenmiş PostgreSQL); yalnızca
 * Supabase Auth devre dışı kalır ve sabit bir yönetici varsayılır.
 *
 * ÜRETİMDE ASLA ETKİN OLMAZ:
 *   - DEMO_MODU=1 ortam değişkeni gerekir (Vercel'de tanımlı değildir)
 *   - VE NODE_ENV production olmamalıdır
 *
 * İkinci koşul, biri yanlışlıkla Vercel'e DEMO_MODU=1 eklese bile
 * panelin açılmasını engeller.
 */
export const DEMO_MODU =
  process.env.DEMO_MODU === "1" && process.env.NODE_ENV !== "production";

export const DEMO_ADMIN = {
  id: "00000000-0000-0000-0000-0000000000de",
  ad: "Demo Yönetici",
  rol: "owner",
} as const;
