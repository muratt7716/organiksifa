import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { ayarlariGetir } from "@/lib/settings";
import { telefonGoster } from "@/lib/phone";
import { InstagramIkon } from "@/components/magaza/Ikonlar";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Organik Şifa iletişim bilgileri. Sorularınız için WhatsApp'tan yazabilirsiniz.",
  alternates: { canonical: "/iletisim" },
};

export default async function IletisimSayfasi() {
  const ayar = await ayarlariGetir();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 space-y-10">
      <header>
        <h1 className="font-baslik text-[clamp(1.75rem,1rem+2.4vw,2.75rem)]">
          İletişim
        </h1>
        <p className="mt-2 text-notr-600 olcu">
          Ürünler, siparişin veya iade hakkında her şeyi sorabilirsin. En hızlı
          yanıtı WhatsApp&apos;tan alırsın.
        </p>
      </header>

      {ayar.whatsappNumarasi && (
        <a
          href={`https://wa.me/${ayar.whatsappNumarasi}`}
          target="_blank"
          rel="noopener"
          className="flex items-center justify-center gap-3 w-full min-h-[64px] rounded-panel
                     bg-yesil-700 text-notr-0 text-lg font-medium hover:bg-yesil-800
                     transition-colors"
        >
          <MessageCircle size={24} aria-hidden="true" />
          WhatsApp&apos;tan yaz
        </a>
      )}

      <dl className="grid sm:grid-cols-2 gap-6">
        {ayar.iletisimTelefon && (
          <div className="flex gap-3">
            <Phone size={20} className="text-yesil-700 shrink-0 mt-1" aria-hidden="true" />
            <div>
              <dt className="font-medium">Telefon</dt>
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
          <div className="flex gap-3">
            <Mail size={20} className="text-yesil-700 shrink-0 mt-1" aria-hidden="true" />
            <div className="min-w-0">
              <dt className="font-medium">E-posta</dt>
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

        {ayar.whatsappNumarasi && (
          <div className="flex gap-3">
            <MessageCircle
              size={20}
              className="text-yesil-700 shrink-0 mt-1"
              aria-hidden="true"
            />
            <div>
              <dt className="font-medium">WhatsApp</dt>
              <dd className="rakam text-notr-600">
                {telefonGoster(ayar.whatsappNumarasi)}
              </dd>
            </div>
          </div>
        )}

        {ayar.instagramUrl && (
          <div className="flex gap-3">
            <InstagramIkon size={20} className="text-yesil-700 shrink-0 mt-1" />
            <div className="min-w-0">
              <dt className="font-medium">Instagram</dt>
              <dd>
                <a
                  href={ayar.instagramUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-notr-600 hover:text-yesil-700 break-all"
                >
                  {ayar.instagramUrl.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          </div>
        )}

        {ayar.adres && (
          <div className="flex gap-3 sm:col-span-2">
            <MapPin size={20} className="text-yesil-700 shrink-0 mt-1" aria-hidden="true" />
            <div>
              <dt className="font-medium">Adres</dt>
              <dd className="text-notr-600 olcu">{ayar.adres}</dd>
            </div>
          </div>
        )}
      </dl>

      {ayar.ticaretUnvani && (
        <section className="bg-notr-100 rounded-panel p-5 text-sm text-notr-600 space-y-1">
          <h2 className="font-medium text-notr-900">Firma bilgileri</h2>
          <p>{ayar.ticaretUnvani}</p>
          {ayar.mersisNo && <p>MERSİS No: {ayar.mersisNo}</p>}
          {(ayar.vergiDairesi || ayar.vergiNo) && (
            <p>
              {ayar.vergiDairesi} V.D. {ayar.vergiNo}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
