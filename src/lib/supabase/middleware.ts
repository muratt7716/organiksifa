import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_MODU } from "@/lib/demo";

export async function oturumYenile(request: NextRequest) {
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

  return response;
}
