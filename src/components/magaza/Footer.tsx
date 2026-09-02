import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import type { Ayarlar } from "@/lib/settings";
import { telefonGoster } from "@/lib/phone";
import { InstagramIkon } from "./Ikonlar";

const YASAL = [
  { href: "/mesafeli-satis-sozlesmesi", etiket: "Mesafeli Satış Sözleşmesi" },
  { href: "/on-bilgilendirme", etiket: "Ön Bilgilendirme Formu" },
  { href: "/iptal-iade", etiket: "İptal ve İade Koşulları" },
  { href: "/teslimat-kargo", etiket: "Teslimat ve Kargo" },
  { href: "/kvkk", etiket: "KVKK Aydınlatma Metni" },
  { href: "/gizlilik-cerez", etiket: "Gizlilik ve Çerez Politikası" },
];

const KURUMSAL = [
  { href: "/hakkimizda", etiket: "Hakkımızda" },
  { href: "/iletisim", etiket: "İletişim" },
  { href: "/urunler", etiket: "Tüm Ürünler" },
];

function Sutun({
  baslik,
  children,
}: {
  baslik: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-baslik text-base text-notr-900 mb-3">{baslik}</h2>
      {children}
    </div>
  );
}

function BaglantiListesi({ ogeler }: { ogeler: { href: string; etiket: string }[] }) {
  return (
    <ul className="space-y-0.5">
      {ogeler.map((o) => (
        <li key={o.href}>
          <Link
            href={o.href}
            className="flex items-center min-h-[44px] text-sm text-notr-600
                       hover:text-yesil-700 transition-colors"
          >
            {o.etiket}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer({
  ayar,
  kategoriler,
}: {
  ayar: Ayarlar;
  kategoriler: { ad: string; slug: string }[];
}) {
  const iletisimVar =
    ayar.iletisimTelefon || ayar.iletisimEmail || ayar.whatsappNumarasi;

  return (
    <footer className="mt-20 bg-notr-100 border-t border-notr-200">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Marka */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center min-h-[44px] -my-1">
              <Image
                src="/marka/logo-yatay.png"
                alt={ayar.siteAdi}
                width={1200}
                height={300}
                className="h-9 w-auto"
              />
            </Link>

            <p className="text-sm text-notr-600 max-w-[34ch] leading-relaxed">
              {ayar.siteSlogan}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {ayar.whatsappNumarasi && (
                <a
                  href={`https://wa.me/${ayar.whatsappNumarasi}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-kontrol
                             bg-yesil-700 text-notr-0 text-sm font-medium
                             hover:bg-yesil-800 transition-colors"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp
                </a>
              )}
              {ayar.instagramUrl && (
                <a
                  href={ayar.instagramUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center size-11 rounded-kontrol
                             border border-notr-200 bg-notr-0 text-notr-600
                             hover:text-yesil-700 hover:border-yesil-400 transition-colors"
                >
                  <InstagramIkon size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Kategoriler — boşsa hiç gösterilmez */}
          {kategoriler.length > 0 && (
            <nav aria-label="Kategoriler" className="lg:col-span-2">
              <Sutun baslik="Kategoriler">
                <BaglantiListesi
                  ogeler={kategoriler.map((k) => ({
                    href: `/kategori/${k.slug}`,
                    etiket: k.ad,
                  }))}
                />
              </Sutun>
            </nav>
          )}

          {/* Kurumsal */}
          <nav aria-label="Kurumsal" className="lg:col-span-2">
            <Sutun baslik="Kurumsal">
              <BaglantiListesi ogeler={KURUMSAL} />
            </Sutun>
          </nav>

          {/* Yasal */}
          <nav aria-label="Yasal bilgiler" className="lg:col-span-4">
            <Sutun baslik="Bilgi ve Güvenlik">
              <BaglantiListesi ogeler={YASAL} />
            </Sutun>
          </nav>
        </div>

        {/* İletişim şeridi */}
        {iletisimVar && (
          <div className="mt-10 pt-8 border-t border-notr-200">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              {ayar.whatsappNumarasi && (
                <div className="flex gap-2.5">
                  <MessageCircle
                    size={17}
                    className="text-yesil-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-notr-900 font-medium">WhatsApp</dt>
                    <dd className="rakam text-notr-600">
                      {telefonGoster(ayar.whatsappNumarasi)}
                    </dd>
                  </div>
                </div>
              )}

              {ayar.iletisimTelefon && (
                <div className="flex gap-2.5">
                  <Phone
                    size={17}
                    className="text-yesil-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-notr-900 font-medium">Telefon</dt>
                    <dd>
                      <a
                        href={`tel:${ayar.iletisimTelefon.replace(/\D/g, "")}`}
                        className="rakam text-notr-600 hover:text-yesil-700"
                      >
                        {ayar.iletisimTelefon}
                      </a>
                    </dd>
                  </div>
                </div>
              )}

              {ayar.iletisimEmail && (
                <div className="flex gap-2.5 min-w-0">
                  <Mail
                    size={17}
                    className="text-yesil-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <dt className="text-notr-900 font-medium">E-posta</dt>
                    <dd>
                      <a
                        href={`mailto:${ayar.iletisimEmail}`}
                        className="text-notr-600 hover:text-yesil-700 break-all"
                      >
                        {ayar.iletisimEmail}
                      </a>
                    </dd>
                  </div>
                </div>
              )}

              {ayar.adres && (
                <div className="flex gap-2.5">
                  <MapPin
                    size={17}
                    className="text-yesil-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-notr-900 font-medium">Adres</dt>
                    <dd className="text-notr-600 leading-relaxed">{ayar.adres}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      {/* Alt şerit */}
      <div className="border-t border-notr-200">
        <div className="mx-auto max-w-6xl px-4 py-6 space-y-3">
          {ayar.ticaretUnvani && (
            <p className="text-xs text-notr-600">
              {ayar.ticaretUnvani}
              {ayar.mersisNo && <> · MERSİS: {ayar.mersisNo}</>}
              {ayar.vergiDairesi && <> · {ayar.vergiDairesi} V.D.</>}
              {ayar.vergiNo && <> {ayar.vergiNo}</>}
              {ayar.etbisDogrulamaUrl && (
                <>
                  {" · "}
                  <a
                    href={ayar.etbisDogrulamaUrl}
                    target="_blank"
                    rel="noopener"
                    className="underline hover:text-yesil-700"
                  >
                    ETBİS kayıtlıdır
                  </a>
                </>
              )}
            </p>
          )}

          <p className="text-xs text-notr-400 leading-relaxed max-w-[80ch]">
            Takviye edici gıdalar normal beslenmenin yerine geçmez. Ürünler
            hastalıkları önleme, tedavi etme veya iyileştirme amacı taşımaz.
          </p>

          <p className="text-xs text-notr-400">
            © {new Date().getFullYear()} {ayar.siteAdi}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
