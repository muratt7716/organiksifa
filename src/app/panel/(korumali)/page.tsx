import Link from "next/link";
import { ShoppingBag, Wallet, Clock, Plus } from "lucide-react";
import { panelOzeti, siparisleriGetir } from "@/actions/orders";
import { fiyatBicimle, sayi } from "@/lib/price";
import { DURUM_ETIKET, type SiparisDurumu } from "@/db/schema";

export const metadata = { title: "Özet" };

function Kart({
  Ikon,
  etiket,
  deger,
  vurgu,
}: {
  Ikon: typeof ShoppingBag;
  etiket: string;
  deger: string;
  vurgu?: boolean;
}) {
  return (
    <div className="bg-notr-0 rounded-panel p-4 border border-notr-200">
      <div className="flex items-center gap-2 text-notr-600 text-sm">
        <Ikon size={16} aria-hidden="true" />
        {etiket}
      </div>
      <p
        className={`mt-1.5 text-2xl rakam ${vurgu ? "text-amber-600" : "text-yesil-700"}`}
      >
        {deger}
      </p>
    </div>
  );
}

export default async function PanelOzetSayfasi() {
  const [ozet, sonSiparisler] = await Promise.all([
    panelOzeti(),
    siparisleriGetir(),
  ]);

  const bekleyenler = sonSiparisler.filter((s) => s.durum === "yeni").slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl text-yesil-700">Özet</h1>
        <Link
          href="/panel/urunler/yeni"
          className="inline-flex items-center gap-2 h-12 px-4 rounded-kontrol
                     bg-yesil-700 text-notr-0 font-medium shrink-0"
        >
          <Plus size={18} aria-hidden="true" /> Ürün ekle
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kart
          Ikon={ShoppingBag}
          etiket="Bugünkü sipariş"
          deger={String(ozet.bugunSiparis)}
        />
        <Kart Ikon={Wallet} etiket="Bugünkü ciro" deger={fiyatBicimle(ozet.bugunCiro)} />
        <Kart
          Ikon={Clock}
          etiket="Bekleyen sipariş"
          deger={String(ozet.bekleyen)}
          vurgu={ozet.bekleyen > 0}
        />
        <Kart
          Ikon={Wallet}
          etiket="Ödeme bekleyen"
          deger={String(ozet.odemeBekleyen)}
          vurgu={ozet.odemeBekleyen > 0}
        />
      </div>

      <section className="bg-notr-0 rounded-panel border border-notr-200">
        <div className="flex items-center justify-between px-4 py-3 raf">
          <h2 className="text-lg text-yesil-700">Bekleyen siparişler</h2>
          <Link href="/panel/siparisler" className="text-sm text-notr-600 underline">
            Tümü
          </Link>
        </div>

        {bekleyenler.length === 0 ? (
          <p className="p-8 text-center text-notr-600">
            Şu an bekleyen sipariş yok.
          </p>
        ) : (
          <ul className="px-4">
            {bekleyenler.map((s) => (
              <li key={s.id} className="raf last:border-0">
                <Link
                  href={`/panel/siparisler/${s.id}`}
                  className="flex items-center gap-3 py-3 min-h-[56px] group"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium truncate group-hover:text-yesil-700 transition-colors">
                      {s.musteriAdi}
                    </span>
                    <span className="block text-sm text-notr-600 rakam">
                      {s.siparisNo} · {s.il}
                    </span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className="block rakam font-medium">
                      {fiyatBicimle(sayi(s.toplam))}
                    </span>
                    <span className="block text-xs text-amber-600">
                      {DURUM_ETIKET[s.durum as SiparisDurumu] ?? s.durum}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
