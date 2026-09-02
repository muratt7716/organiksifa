"use client";

import { useState, useTransition } from "react";
import { MessageCircle, Check } from "lucide-react";
import { durumGuncelle, odemeGuncelle, kargoGuncelle } from "@/actions/orders";
import { musteriyeMesaj, waLink } from "@/lib/whatsapp";
import { fiyatAyristir } from "@/lib/price";
import {
  SIPARIS_DURUMLARI,
  ODEME_DURUMLARI,
  DURUM_ETIKET,
  ODEME_ETIKET,
  type SiparisDurumu,
  type OdemeDurumu,
} from "@/db/schema";
import { cn } from "@/lib/utils";

const KARGO_FIRMALARI = ["Yurtiçi", "Aras", "MNG", "PTT", "Sürat", "UPS", "Diğer"];

export function SiparisIslemleri({
  id,
  siparisNo,
  musteriAdi,
  telefonE164,
  durum,
  odemeDurumu,
  odenenTutar,
  kargoFirmasi,
  kargoTakipNo,
  toplam,
}: {
  id: string;
  siparisNo: string;
  musteriAdi: string;
  telefonE164: string;
  durum: SiparisDurumu;
  odemeDurumu: OdemeDurumu;
  odenenTutar: string | null;
  kargoFirmasi: string | null;
  kargoTakipNo: string | null;
  toplam: number;
}) {
  const [d, setD] = useState(durum);
  const [od, setOd] = useState(odemeDurumu);
  const [tutar, setTutar] = useState(odenenTutar ?? String(toplam));
  const [firma, setFirma] = useState(kargoFirmasi ?? "");
  const [takip, setTakip] = useState(kargoTakipNo ?? "");
  const [kayitli, setKayitli] = useState<string>();
  const [bekliyor, basla] = useTransition();

  function bildir(ne: string) {
    setKayitli(ne);
    setTimeout(() => setKayitli(undefined), 2500);
  }

  const alan =
    "w-full min-h-[48px] px-3 rounded-kontrol border border-notr-200 bg-notr-0";
  const kart = "bg-notr-0 rounded-panel p-4 space-y-3 border border-notr-200";

  const mesajTipi = d === "kargoda" ? "kargo" : d === "teslim" ? "teslim" : "onay";

  return (
    <div className="space-y-4">
      {/* Müşteriye WhatsApp — panelin en sık kullanılan butonu */}
      <a
        href={waLink(
          telefonE164,
          musteriyeMesaj(mesajTipi, {
            siparisNo,
            musteriAdi,
            kargoFirmasi: firma,
            takipNo: takip,
          }),
        )}
        target="_blank"
        rel="noopener"
        className="flex items-center justify-center gap-2 w-full h-12 rounded-kontrol
                   bg-yesil-700 text-notr-0 font-medium hover:bg-yesil-800 transition-colors"
      >
        <MessageCircle size={18} aria-hidden="true" />
        Müşteriye WhatsApp&apos;tan yaz
      </a>

      <div className={kart}>
        <h3 className="font-medium">Sipariş durumu</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SIPARIS_DURUMLARI.map((durumDeger) => (
            <button
              key={durumDeger}
              type="button"
              disabled={bekliyor}
              onClick={() => {
                setD(durumDeger);
                basla(async () => {
                  await durumGuncelle(id, durumDeger);
                  bildir("Durum güncellendi");
                });
              }}
              className={cn(
                "min-h-[48px] px-2 rounded-kontrol text-sm border cursor-pointer transition-colors",
                d === durumDeger
                  ? "bg-yesil-700 text-notr-0 border-yesil-700"
                  : "bg-notr-0 border-notr-200 hover:border-yesil-400",
                durumDeger === "iptal" && d !== durumDeger && "text-hata",
              )}
            >
              {DURUM_ETIKET[durumDeger]}
            </button>
          ))}
        </div>
      </div>

      <div className={kart}>
        <h3 className="font-medium">Ödeme</h3>
        <div className="grid grid-cols-2 gap-2">
          {ODEME_DURUMLARI.map((o) => (
            <button
              key={o}
              type="button"
              disabled={bekliyor}
              onClick={() => {
                setOd(o);
                basla(async () => {
                  await odemeGuncelle(
                    id,
                    o,
                    o === "bekliyor" ? undefined : (fiyatAyristir(tutar) ?? undefined),
                  );
                  bildir("Ödeme durumu güncellendi");
                });
              }}
              className={cn(
                "min-h-[48px] px-2 rounded-kontrol text-sm border cursor-pointer transition-colors",
                od === o
                  ? "bg-yesil-700 text-notr-0 border-yesil-700"
                  : "bg-notr-0 border-notr-200 hover:border-yesil-400",
              )}
            >
              {ODEME_ETIKET[o]}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="tutar" className="block text-sm text-notr-600 mb-1">
            Alınan tutar (₺)
          </label>
          <input
            id="tutar"
            inputMode="decimal"
            className={`${alan} rakam`}
            value={tutar}
            onChange={(e) => setTutar(e.target.value)}
          />
        </div>
      </div>

      <div className={kart}>
        <h3 className="font-medium">Kargo</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="firma" className="block text-sm text-notr-600 mb-1">
              Firma
            </label>
            <select
              id="firma"
              className={alan}
              value={firma}
              onChange={(e) => setFirma(e.target.value)}
            >
              <option value="">Seç…</option>
              {KARGO_FIRMALARI.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="takip" className="block text-sm text-notr-600 mb-1">
              Takip no
            </label>
            <input
              id="takip"
              className={`${alan} rakam`}
              value={takip}
              onChange={(e) => setTakip(e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          disabled={bekliyor}
          onClick={() =>
            basla(async () => {
              await kargoGuncelle(id, firma, takip);
              bildir("Kargo bilgisi kaydedildi");
            })
          }
          className="w-full min-h-[48px] rounded-kontrol border border-notr-200 bg-notr-0
                     cursor-pointer hover:border-yesil-400 transition-colors"
        >
          Kargo bilgisini kaydet
        </button>
      </div>

      {kayitli && (
        <p
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-yesil-700 bg-yesil-50
                     rounded-kontrol p-3"
        >
          <Check size={16} aria-hidden="true" /> {kayitli}
        </p>
      )}
    </div>
  );
}
