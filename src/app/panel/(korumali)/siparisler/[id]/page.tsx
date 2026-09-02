import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone, StickyNote } from "lucide-react";
import { siparisDetay } from "@/actions/orders";
import { fiyatBicimle, sayi } from "@/lib/price";
import { telefonGoster } from "@/lib/phone";
import { SiparisIslemleri } from "@/components/panel/SiparisIslemleri";
import type { SiparisDurumu, OdemeDurumu } from "@/db/schema";

export const metadata = { title: "Sipariş detayı" };

export default async function SiparisDetaySayfasi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const veri = await siparisDetay(id);
  if (!veri) notFound();

  const { siparis, kalemler, olaylar, gecmis } = veri;

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/panel/siparisler"
          className="inline-flex items-center gap-1.5 text-sm text-notr-600 min-h-[44px]
                     hover:text-yesil-700 transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Siparişler
        </Link>
        <h1 className="text-2xl text-yesil-700 rakam">{siparis.siparisNo}</h1>
        <p className="text-sm text-notr-400">
          {new Date(siparis.createdAt).toLocaleString("tr-TR")}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="space-y-4">
          <section className="bg-notr-0 rounded-panel p-4 space-y-3 border border-notr-200">
            <h2 className="text-lg text-yesil-700">Müşteri</h2>
            <p className="font-medium">{siparis.musteriAdi}</p>
            <p className="flex items-center gap-2 text-notr-600">
              <Phone size={15} aria-hidden="true" />
              <span className="rakam">{telefonGoster(siparis.telefonE164)}</span>
            </p>
            <p className="flex items-start gap-2 text-notr-600">
              <MapPin size={15} className="mt-1 shrink-0" aria-hidden="true" />
              <span>
                {siparis.adres}
                <br />
                {siparis.ilce} / {siparis.il}
              </span>
            </p>
            {siparis.not && (
              <p className="flex items-start gap-2 text-notr-600 bg-notr-100 rounded-kontrol p-2.5">
                <StickyNote size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{siparis.not}</span>
              </p>
            )}
            {gecmis.length > 0 && (
              <p className="text-sm text-notr-400">
                Bu telefondan {gecmis.length} önceki sipariş var.
              </p>
            )}
          </section>

          <section className="bg-notr-0 rounded-panel border border-notr-200">
            <h2 className="text-lg text-yesil-700 px-4 pt-4 pb-2">Ürünler</h2>
            <ul className="px-4">
              {kalemler.map((k) => (
                <li key={k.id} className="flex items-center gap-3 py-3 raf">
                  {k.gorselSnapshot && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={k.gorselSnapshot}
                      alt=""
                      className="size-12 object-contain rounded-gorsel bg-notr-100 shrink-0"
                    />
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="block truncate">{k.baslikSnapshot}</span>
                    <span className="block text-sm text-notr-600 rakam">
                      {fiyatBicimle(sayi(k.birimFiyat))} × {k.adet}
                    </span>
                  </span>
                  <span className="rakam font-medium shrink-0">
                    {fiyatBicimle(sayi(k.satirToplam))}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="px-4 py-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-notr-600">Ara toplam</dt>
                <dd className="rakam">{fiyatBicimle(sayi(siparis.araToplam))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-notr-600">
                  Kargo
                  {siparis.kargoKuraliSnapshot && (
                    <span className="block text-xs text-notr-400">
                      {siparis.kargoKuraliSnapshot}
                    </span>
                  )}
                </dt>
                <dd className="rakam">
                  {sayi(siparis.kargoUcreti) === 0
                    ? "Ücretsiz"
                    : fiyatBicimle(sayi(siparis.kargoUcreti))}
                </dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-notr-200 text-base font-medium">
                <dt>Toplam</dt>
                <dd className="rakam text-yesil-700">
                  {fiyatBicimle(sayi(siparis.toplam))}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-notr-0 rounded-panel p-4 border border-notr-200">
            <h2 className="text-lg text-yesil-700 mb-2">Hareketler</h2>
            <ol className="space-y-2 text-sm">
              {olaylar.map((o) => (
                <li key={o.id} className="flex gap-3">
                  <span className="text-notr-400 rakam shrink-0">
                    {new Date(o.createdAt).toLocaleString("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-notr-600">
                    {o.eskiDeger ? `${o.eskiDeger} → ` : ""}
                    <span className="text-notr-900">{o.yeniDeger}</span>
                    {o.aktorAdi && (
                      <span className="text-notr-400"> · {o.aktorAdi}</span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <SiparisIslemleri
          id={siparis.id}
          siparisNo={siparis.siparisNo}
          musteriAdi={siparis.musteriAdi}
          telefonE164={siparis.telefonE164}
          durum={siparis.durum as SiparisDurumu}
          odemeDurumu={siparis.odemeDurumu as OdemeDurumu}
          odenenTutar={siparis.odenenTutar}
          kargoFirmasi={siparis.kargoFirmasi}
          kargoTakipNo={siparis.kargoTakipNo}
          toplam={sayi(siparis.toplam)}
        />
      </div>
    </div>
  );
}
