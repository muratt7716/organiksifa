import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { mevcutAdmin, cikisYap } from "@/actions/auth";
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
  // İkisi paralel: sayaç sorgusu kimlik doğrulamayı beklemesin.
  const [admin, sayilar] = await Promise.all([mevcutAdmin(), bekleyenSayilar()]);
  if (!admin) redirect("/panel/giris");

  return (
    <div className="min-h-dvh md:flex bg-notr-100">
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
