"use client";

import { useState } from "react";
import { MessageCircle, Copy, Check, AlertCircle } from "lucide-react";
import { whatsappTiklandi } from "@/actions/orders";
import { telefonGoster } from "@/lib/phone";

/**
 * WhatsApp devir teslim bileşeni. Bilinen tuzakların hepsi burada kapatılır:
 *
 * 1. Düz <a> kullanılır — iOS Safari, async çağrıdan sonra açılan
 *    window.open pencerelerini engelliyor.
 * 2. "GÖNDER'e bas" uyarısı büyük yazılır — wa.me mesajı otomatik göndermez,
 *    Meta bunu kasıtlı engelliyor. Bu tek cümle en büyük sessiz kaybı kapatır.
 * 3. Numara düz metin + kopyala butonu — Instagram/Facebook içi tarayıcı
 *    wa.me bağlantısını uygulamaya taşımıyor; ana trafik kaynağı orası.
 * 4. Sipariş numarası ayrıca kopyalanabilir.
 */
export function WhatsappOnay({
  siparisNo,
  numaraE164,
  link,
}: {
  siparisNo: string;
  numaraE164: string | null;
  link: string | null;
}) {
  const [kopyalanan, setKopyalanan] = useState<string>();

  async function kopyala(deger: string, etiket: string) {
    try {
      await navigator.clipboard.writeText(deger);
      setKopyalanan(etiket);
      setTimeout(() => setKopyalanan(undefined), 2500);
    } catch {
      setKopyalanan(undefined);
    }
  }

  if (!numaraE164 || !link) {
    return (
      <div className="bg-amber-100 text-amber-700 rounded-panel p-5 flex gap-3">
        <AlertCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-medium">Siparişin alındı.</p>
          <p className="text-sm mt-1">
            WhatsApp numarası henüz tanımlı değil. En kısa sürede sizinle iletişime
            geçeceğiz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <a
        href={link}
        target="_blank"
        rel="noopener"
        onClick={() => {
          void whatsappTiklandi(siparisNo);
        }}
        className="flex items-center justify-center gap-3 w-full min-h-[64px] rounded-panel
                   bg-yesil-700 text-notr-0 text-lg font-medium
                   hover:bg-yesil-800 transition-colors"
      >
        <MessageCircle size={24} aria-hidden="true" />
        WhatsApp&apos;tan Onayla
      </a>

      <p className="text-center font-medium text-notr-900">
        Açılan sohbette mesajı <span className="text-amber-600">GÖNDER</span>&apos;e
        basmayı unutma.
      </p>

      <div className="bg-notr-100 rounded-panel p-4 space-y-3">
        <p className="text-sm text-notr-600">
          Buton çalışmadıysa (Instagram içinden geldiysen olabilir) numarayı
          kopyalayıp WhatsApp&apos;tan kendin yazabilirsin:
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => kopyala(`+${numaraE164}`, "numara")}
            className="inline-flex items-center gap-2 min-h-[48px] px-4 rounded-kontrol
                       bg-notr-0 border border-notr-200 text-sm cursor-pointer"
          >
            {kopyalanan === "numara" ? (
              <Check size={16} className="text-yesil-700" aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            <span className="rakam">{telefonGoster(numaraE164)}</span>
          </button>

          <button
            type="button"
            onClick={() => kopyala(siparisNo, "no")}
            className="inline-flex items-center gap-2 min-h-[48px] px-4 rounded-kontrol
                       bg-notr-0 border border-notr-200 text-sm cursor-pointer"
          >
            {kopyalanan === "no" ? (
              <Check size={16} className="text-yesil-700" aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            Sipariş no: <span className="rakam">{siparisNo}</span>
          </button>
        </div>

        {kopyalanan && (
          <p className="text-sm text-yesil-700" aria-live="polite">
            Kopyalandı.
          </p>
        )}
      </div>
    </div>
  );
}
