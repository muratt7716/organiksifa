import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { mevcutAdmin, cikisYap } from "@/actions/auth";
import { BASLIK_KULLANICI_ID } from "@/lib/supabase/middleware";
import { PanelNav } from "@/components/panel/PanelNav";
import { db } from "@/db";
import { sureliVeyaYedek } from "@/lib/db-sure";

export const dynamic = "force-dynamic";

/**
 * Menü rozetleri için iki sayaç TEK sorguda alınır.
 * Ayrı ayrı sorgulamak Frankfurt'taki veritabanına iki gidiş-dönüş demekti
 * ve bu her panel sayfası açılışında tekrarlanıyordu.
 */
async function bekleyenSayilar() {
  return sureliVeyaYedek(
    async () => {
      const sonuc = (await db.execute(sql`
        SELECT
          (SELECT count(*)::int FROM orders  WHERE durum = 'yeni')      AS siparis,
          (SELECT count(*)::int FROM reviews WHERE durum = 'bekliyor')  AS yorum
      `)) as unknown as { siparis: number; yorum: number }[];
      const satir = Array.isArray(sonuc) ? sonuc[0] : undefined;
      return { siparis: satir?.siparis ?? 0, yorum: satir?.yorum ?? 0 };
    },
    { siparis: 0, yorum: 0 },
  );
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * ÖLÇÜM: aşağıdaki damga yanıt HTML'ine gizli bir yorum olarak yazılıyor.
   * Yerleşim yanıt başlığı yazamıyor; süreyi başka türlü göremiyorduk.
   * Proxy tarafı Server-Timing başlığıyla ölçülüyor — ikisi birlikte
   * "sayfa neden 1.8 sn sürüyor" sorusunu tam olarak cevaplıyor.
   */
  const t0 = Date.now();
  // İkisi paralel: sayaç sorgusu kimlik doğrulamayı beklemesin.
  const [admin, sayilar, basliklar] = await Promise.all([
    mevcutAdmin(),
    bekleyenSayilar(),
    headers(),
  ]);
  const yerlesimSuresi = Date.now() - t0;
  if (!admin) redirect("/panel/giris");

  /**
   * Proxy doğruladığı kullanıcıyı başlıkla geçiriyor mu? Geçirmiyorsa
   * mevcutAdmin() yavaş yola düşüp Supabase'e İKİNCİ bir tur atıyor demektir.
   */
  const hizliYol = basliklar.get(BASLIK_KULLANICI_ID) ? "evet" : "hayir";

  return (
    <div className="min-h-dvh md:flex bg-notr-100">
      <span
        hidden
        data-os-olcum={`yerlesim=${yerlesimSuresi} hizliyol=${hizliYol}`}
      />
      <PanelNav bekleyenSiparis={sayilar.siparis} bekleyenYorum={sayilar.yorum} />
      <div className="flex-1 min-w-0 pb-24 md:pb-0">
        <header
          className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 h-14
                     bg-notr-0/95 backdrop-blur border-b border-notr-200"
        >
          <span className="text-sm text-notr-600 truncate">
            Merhaba, {admin.ad}
          </span>
          <form action={cikisYap}>
            <button
              type="submit"
              className="min-h-[44px] px-3 text-sm text-notr-600 cursor-pointer
                         hover:text-notr-900 transition-colors"
            >
              Çıkış
            </button>
          </form>
        </header>
        <main className="p-4 md:p-6 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
