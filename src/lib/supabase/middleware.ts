import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_MODU } from "@/lib/demo";

/**
 * Proxy, doğruladığı kullanıcıyı bu başlıklarla aşağı geçirir; panel
 * yerleşimi ikinci bir getUser() ve admin_profiles sorgusu yapmak zorunda
 * kalmaz. İstek başına bir ağ turu ve bir veritabanı sorgusu tasarruf.
 *
 * GÜVENLİK: başlık dışarıdan gönderilebilir. Bu yüzden her istekte ÖNCE
 * siliniyor, sonra yalnızca doğrulanmış kullanıcı varsa yazılıyor.
 */
export const BASLIK_KULLANICI_ID = "x-os-kullanici-id";
export const BASLIK_EPOSTA = "x-os-eposta";

export async function oturumYenile(request: NextRequest) {
  /**
   * GÜVENLİK: bu başlıkları dışarıdan gönderilmiş olabilir diye ÖNCE
   * siliyoruz. Aşağıya yalnızca bizim doğrulayıp yazdığımız değer geçer.
   * Bu satırlar olmadan biri kendi başlığını gönderip yönetici gibi
   * davranabilirdi.
   */
  request.headers.delete(BASLIK_KULLANICI_ID);
  request.headers.delete(BASLIK_EPOSTA);

  let response = NextResponse.next({ request });

  // Yerel demo: giriş kontrolü atlanır (bkz. src/lib/demo.ts).
  if (DEMO_MODU) return response;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anahtar = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const giristeMi = request.nextUrl.pathname === "/panel/giris";

  // Supabase yapılandırılmamışsa panel AÇILMAZ (fail-closed).
  // Ortam değişkeni eksikse yetkiyi doğrulayamayız; o hâlde içeri almayız.
  if (!url || !anahtar) {
    if (giristeMi) return response;
    const hedef = request.nextUrl.clone();
    hedef.pathname = "/panel/giris";
    return NextResponse.redirect(hedef);
  }

  const supabase = createServerClient(
    url,
    anahtar,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  /**
   * Oturum çerezi var mı?
   *
   * Supabase erişim jetonunu yenilerken yenileme jetonu tek kullanımlıktır
   * ve döner. Aynı anda gelen isteklerden biri yarışı kaybedince getUser()
   * geçici olarak "oturum yok" der. Bunu doğrudan girişe yönlendirmeye
   * çevirirsek şu zincir oluşuyor:
   *
   *   /panel/urunler -> /panel/giris -> /panel
   *
   * Üç ayrı serverless çağrısı, ölçülen ~8.2 saniye. Kullanıcı da yanlış
   * sayfada buluyor kendini.
   *
   * Bu yüzden: çerez varsa isteği GEÇİRİYORUZ. Yetki kontrolü zaten panel
   * yerleşiminde de yapılıyor (fail-closed) — orada gerçekten oturum yoksa
   * tek bir yönlendirme olur, zincir oluşmaz.
   */
  const oturumCereziVar = request.cookies
    .getAll()
    .some((c) => /^sb-.*-auth-token/.test(c.name));

  let user = null;
  try {
    const sonuc = await supabase.auth.getUser();
    user = sonuc.data.user;
  } catch {
    user = null;
  }

  if (!giristeMi && !user && !oturumCereziVar) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel/giris";
    return NextResponse.redirect(url);
  }

  if (giristeMi && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel";
    return NextResponse.redirect(url);
  }

  // Doğrulanmış kullanıcıyı aşağı geçir: yerleşim tekrar sormasın.
  if (user) {
    request.headers.set(BASLIK_KULLANICI_ID, user.id);
    if (user.email) request.headers.set(BASLIK_EPOSTA, user.email);
    response = NextResponse.next({ request });
  }

  return response;
}
