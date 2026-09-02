import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ayarlariGetir } from "@/lib/settings";
import { ZeytinDali, Adacayi, Papatya } from "@/components/magaza/Botanik";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Organik Şifa; doğal içerikli takviye, bitkisel yağ ve el yapımı cilt bakım ürünleri sunar. Küçük partiler hâlinde, kısa içindekiler listesiyle.",
  alternates: { canonical: "/hakkimizda" },
};

export default async function HakkimizdaSayfasi() {
  const ayar = await ayarlariGetir();

  return (
    <>
      <section className="relative overflow-hidden bg-notr-100">
        <div
          className="absolute inset-0 -z-10 opacity-[0.12] text-yesil-700"
          aria-hidden="true"
        >
          <ZeytinDali className="absolute -left-12 bottom-0 w-[380px]" />
          <Adacayi className="absolute right-8 top-2 w-[150px]" />
          <Papatya className="absolute right-[30%] bottom-4 w-[90px] suzulen" />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
          <h1 className="font-baslik text-[clamp(2rem,1rem+3.2vw,3.25rem)] leading-tight">
            Küçük partiler, kısa içindekiler listesi
          </h1>
          <p className="mt-5 text-lg text-notr-600 olcu">{ayar.siteSlogan}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-14 space-y-10">
        <section className="space-y-3">
          <h2 className="font-baslik text-2xl text-yesil-700">Nasıl başladı</h2>
          <p className="text-notr-600 olcu">
            {ayar.siteAdi}, doğal içeriklerle hazırlanmış ürünleri arayan
            insanların sorularıyla başladı. Önce çevremize, sonra çevremizin
            tanıdıklarına ulaştık. Bugün aynı işi yapıyoruz — sadece daha düzenli.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-baslik text-2xl text-yesil-700">
            Neden sitede kart bilgisi istemiyoruz
          </h2>
          <p className="text-notr-600 olcu">
            Sattığımız ürünlerin çoğu kişiye göre değişiyor. Hangi ürünün size
            uygun olduğunu bir formun anlaması zor; bir insanın anlaması kolay.
          </p>
          <p className="text-notr-600 olcu">
            Bu yüzden siparişinizi sitede oluşturuyor, ardından WhatsApp&apos;tan
            konuşuyoruz. Ödeme ve teslimat detaylarını orada netleştiriyoruz.
            Böylece hem yanlış ürün gitmiyor hem de sorularınızı sorabiliyorsunuz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-baslik text-2xl text-yesil-700">Nasıl hazırlanıyor</h2>
          <p className="text-notr-600 olcu">
            Ürünlerimiz büyük fabrikalarda üretilmiyor. Küçük partiler hâlinde
            hazırlandığı için stok her zaman sınırlı; sipariş üzerine hazırlanan
            ürünler 1-2 iş günü içinde yola çıkıyor.
          </p>
          <p className="text-notr-600 olcu">
            İçindekiler listesi kısa tutuluyor. Ne koyduğumuzu biliyoruz, siz de
            bilin istiyoruz — bu yüzden her ürünün içeriğini sayfasında
            paylaşıyoruz.
          </p>
        </section>

        <section className="bg-notr-100 rounded-panel p-6 space-y-3">
          <h2 className="font-baslik text-xl">Önemli bilgilendirme</h2>
          <p className="text-sm text-notr-600 olcu">
            Sattığımız takviye edici gıdalar normal beslenmenin yerine geçmez.
            Ürünlerimiz hastalıkları önleme, tedavi etme veya iyileştirme amacı
            taşımaz. Düzenli kullandığınız bir ilaç varsa veya hamile/emzirme
            döneminde iseniz, kullanmadan önce hekiminize danışın.
          </p>
        </section>

        <Link
          href="/urunler"
          className="inline-flex items-center gap-2 min-h-[52px] px-6 rounded-kontrol
                     bg-yesil-700 text-notr-0 font-medium hover:bg-yesil-800 transition-colors"
        >
          Ürünlere göz at
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </article>
    </>
  );
}
