import { redirect } from "next/navigation";
import { eq, count } from "drizzle-orm";
import { mevcutAdmin, cikisYap } from "@/actions/auth";
import { PanelNav } from "@/components/panel/PanelNav";
import { db } from "@/db";
import { orders, reviews } from "@/db/schema";

export const dynamic = "force-dynamic";

async function bekleyenSayilar() {
  try {
    const [[s], [y]] = await Promise.all([
      db.select({ n: count() }).from(orders).where(eq(orders.durum, "yeni")),
      db.select({ n: count() }).from(reviews).where(eq(reviews.durum, "bekliyor")),
    ]);
    return { siparis: s?.n ?? 0, yorum: y?.n ?? 0 };
  } catch {
    // Veritabanı henüz kurulmadıysa panel yine de açılsın.
    return { siparis: 0, yorum: 0 };
  }
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await mevcutAdmin();
  if (!admin) redirect("/panel/giris");

  const sayilar = await bekleyenSayilar();

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
