import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, MapPin } from "lucide-react";
import { siparisGetirToken } from "@/actions/orders";
import { ayarlariGetir } from "@/lib/settings";
import { fiyatBicimle, sayi } from "@/lib/price";
import { waLink, siparisMesaji } from "@/lib/whatsapp";
import { WhatsappOnay } from "@/components/magaza/WhatsappOnay";
import { DURUM_ETIKET, type SiparisDurumu } from "@/db/schema";

export const metadata: Metadata = {
  title: "Siparişin",
  robots: { index: false, follow: false },
};

export default async function SiparisSayfasi({
  params,
  searchParams,
}: {
  params: Promise<{ no: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const [{ no }, { t }] = await Promise.all([params, searchParams]);
  if (!t) notFound();

  const veri = await siparisGetirToken(no, t);
  if (!veri) notFound();

  const { siparis, kalemler } = veri;
  const ayar = await ayarlariGetir();

  const mesaj = siparisMesaji({
    siparisNo: siparis.siparisNo,
    musteriAdi: siparis.musteriAdi,
    satirlar: kalemler.map((k) => ({
      baslik: k.baslikSnapshot,
      adet: k.adet,
      satirToplam: sayi(k.satirToplam),
    })),
    araToplam: sayi(siparis.araToplam),
    kargoUcreti: sayi(siparis.kargoUcreti),
    toplam: sayi(siparis.toplam),
  });

  const link = ayar.whatsappNumarasi
    ? waLink(ayar.whatsappNumarasi, mesaj)
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14 space-y-8">
      <header className="text-center space-y-3">
        <CheckCircle2
          size={52}
          className="mx-auto text-yesil-700"
          aria-hidden="true"
        />
        <h1 className="font-baslik text-[clamp(1.75rem,1rem+2.4vw,2.5rem)]">
          Siparişin oluşturuldu
        </h1>
        <p className="rakam text-lg text-notr-600">{siparis.siparisNo}</p>
        <p className="text-notr-600 olcu mx-auto">
          Son bir adım kaldı: siparişini WhatsApp&apos;tan onayla. Ödeme ve teslimat
          detaylarını orada konuşacağız.
        </p>
      </header>

      <WhatsappOnay
        siparisNo={siparis.siparisNo}
        numaraE164={ayar.whatsappNumarasi}
        link={link}
      />

      <section className="bg-notr-0 border border-notr-200 rounded-panel">
        <h2 className="font-baslik text-lg px-5 pt-5 pb-2 flex items-center gap-2">
          <Package size={18} className="text-yesil-700" aria-hidden="true" />
          Sipariş özeti
        </h2>

        <ul className="px-5">
          {kalemler.map((k) => (
            <li key={k.id} className="flex items-center gap-3 py-3 raf">
              {k.gorselSnapshot && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={k.gorselSnapshot}
                  alt=""
                  className="size-14 object-contain rounded-gorsel bg-notr-100 shrink-0"
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

        <dl className="px-5 py-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-notr-600">Ara toplam</dt>
            <dd className="rakam">{fiyatBicimle(sayi(siparis.araToplam))}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-notr-600">Kargo</dt>
            <dd className="rakam">
              {sayi(siparis.kargoUcreti) === 0
                ? "Ücretsiz"
                : fiyatBicimle(sayi(siparis.kargoUcreti))}
            </dd>
          </div>
          <div className="flex justify-between pt-3 border-t border-notr-200 text-lg font-medium">
            <dt>Toplam</dt>
            <dd className="rakam text-yesil-700">
              {fiyatBicimle(sayi(siparis.toplam))}
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-notr-100 rounded-panel p-5 space-y-2 text-sm">
        <h2 className="font-medium flex items-center gap-2">
          <MapPin size={16} className="text-yesil-700" aria-hidden="true" />
          Teslimat bilgileri
        </h2>
        <p>{siparis.musteriAdi}</p>
        <p className="rakam">{siparis.telefon}</p>
        <p className="text-notr-600">
          {siparis.adres}
          <br />
          {siparis.ilce} / {siparis.il}
        </p>
        <p className="text-notr-600">
          Durum:{" "}
          <strong>
            {DURUM_ETIKET[siparis.durum as SiparisDurumu] ?? siparis.durum}
          </strong>
        </p>
        {siparis.kargoTakipNo && (
          <p className="text-notr-600">
            Kargo: {siparis.kargoFirmasi} ·{" "}
            <span className="rakam">{siparis.kargoTakipNo}</span>
          </p>
        )}
      </section>

      <p className="text-center text-sm text-notr-600">
        Bu sayfayı kaydedebilirsin — siparişinin durumunu buradan takip
        edebilirsin.
      </p>

      <p className="text-center">
        <Link
          href="/urunler"
          className="inline-flex items-center min-h-[48px] px-5 rounded-kontrol
                     border border-notr-200 text-notr-600"
        >
          Alışverişe devam et
        </Link>
      </p>
    </div>
  );
}
