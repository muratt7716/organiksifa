import { Header } from "@/components/magaza/Header";
import { Footer } from "@/components/magaza/Footer";
import { ayarlariGetir } from "@/lib/settings";
import { aktifKategoriler } from "@/lib/catalog";

export default async function MagazaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ayar, kategoriler] = await Promise.all([
    ayarlariGetir(),
    aktifKategoriler(),
  ]);

  const menu = kategoriler.map((k) => ({ ad: k.ad, slug: k.slug }));

  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2
                   focus:bg-notr-0 focus:px-4 focus:py-2 focus:rounded-kontrol"
      >
        İçeriğe geç
      </a>

      <Header
        siteAdi={ayar.siteAdi}
        kategoriler={menu}
        duyuru={ayar.duyuruAcik ? ayar.duyuruMetni : null}
      />

      <main id="icerik" className="flex-1">
        {children}
      </main>

      <Footer ayar={ayar} kategoriler={menu} />
    </>
  );
}
