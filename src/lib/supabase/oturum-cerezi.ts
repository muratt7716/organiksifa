/**
 * Tarayıcıda Supabase oturum çerezi duruyor mu?
 *
 * Neden gerekli: Supabase erişim jetonunu yenilerken yenileme jetonu tek
 * kullanımlıktır ve her kullanımda döner. Aynı anda giden isteklerden biri
 * yarışı kaybedince `getUser()` geçici olarak "oturum yok" der. Bunu doğrudan
 * "çıkış yaptı" saymak kullanıcıyı paneiden atar.
 *
 * Bu yüzden hem proxy hem de Server Action tarafı, çerez duruyorsa isteği
 * hemen reddetmek yerine bir şans daha veriyor.
 *
 * TEK KAYNAK: desen iki yerde kopyalanırsa Supabase çerez adını değiştirdiği
 * gün biri güncellenip diğeri unutulur ve hata sessizce geri gelir.
 */
const OTURUM_CEREZI = /^sb-.*-auth-token/;

export function oturumCereziVarMi(
  cerezler: readonly { name: string }[],
): boolean {
  return cerezler.some((c) => OTURUM_CEREZI.test(c.name));
}
