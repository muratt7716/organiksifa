import type { Metadata } from "next";
import { OdemeFormu } from "@/components/magaza/OdemeFormu";

export const metadata: Metadata = {
  title: "Siparişi tamamla",
  robots: { index: false, follow: false },
};

export default function OdemeSayfasi() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="font-baslik text-[clamp(1.75rem,1rem+2.4vw,2.75rem)] mb-2">
        Siparişi tamamla
      </h1>
      <p className="text-notr-600 mb-8 olcu">
        Bilgilerini gir, siparişini oluşturalım. Ardından WhatsApp&apos;tan tek
        mesajla onaylayacaksın.
      </p>
      <OdemeFormu />
    </div>
  );
}
