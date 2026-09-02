"use client";

import { useState, useTransition } from "react";
import { Check, X, BadgeCheck, Reply } from "lucide-react";
import { yorumOnayla, yorumReddet, saticiYanitiKaydet } from "@/actions/reviews";
import { cn } from "@/lib/utils";

export type YorumVerisi = {
  id: string;
  ad: string;
  puan: number;
  yorum: string;
  durum: string;
  dogrulanmisAlici: boolean;
  saticiYaniti: string | null;
  createdAt: Date;
  urunBaslik: string | null;
};

function Yildizlar({ puan }: { puan: number }) {
  return (
    <span
      className="text-amber-500 tracking-tight"
      aria-label={`5 üzerinden ${puan} puan`}
    >
      {"★".repeat(puan)}
      <span className="text-notr-200">{"★".repeat(5 - puan)}</span>
    </span>
  );
}

export function YorumSatiri({ yorum }: { yorum: YorumVerisi }) {
  const [durum, setDurum] = useState(yorum.durum);
  const [yanit, setYanit] = useState(yorum.saticiYaniti ?? "");
  const [yanitAcik, setYanitAcik] = useState(false);
  const [bekliyor, basla] = useTransition();

  return (
    <li className="py-4 raf last:border-0 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{yorum.ad}</span>
            {yorum.dogrulanmisAlici && (
              <span className="inline-flex items-center gap-1 text-[11px] text-yesil-700 bg-yesil-100 px-1.5 py-0.5 rounded-full">
                <BadgeCheck size={11} aria-hidden="true" /> Doğrulanmış alıcı
              </span>
            )}
          </p>
          <p className="text-sm text-notr-600 truncate">{yorum.urunBaslik}</p>
        </div>
        <Yildizlar puan={yorum.puan} />
      </div>

      <p className="text-notr-900 olcu">{yorum.yorum}</p>

      <p className="text-xs text-notr-400">
        {new Date(yorum.createdAt).toLocaleString("tr-TR")}
      </p>

      {yanitAcik && (
        <div className="space-y-2">
          <label htmlFor={`yanit-${yorum.id}`} className="block text-sm font-medium">
            Satıcı yanıtı
          </label>
          <textarea
            id={`yanit-${yorum.id}`}
            rows={3}
            value={yanit}
            onChange={(e) => setYanit(e.target.value)}
            className="w-full px-3 py-2 rounded-kontrol border border-notr-200 bg-notr-0"
          />
          <button
            type="button"
            disabled={bekliyor}
            onClick={() =>
              basla(async () => {
                await saticiYanitiKaydet(yorum.id, yanit);
                setYanitAcik(false);
              })
            }
            className="min-h-[44px] px-4 rounded-kontrol bg-yesil-700 text-notr-0 text-sm cursor-pointer"
          >
            Yanıtı kaydet
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        {durum !== "onayli" && (
          <button
            type="button"
            disabled={bekliyor}
            onClick={() =>
              basla(async () => {
                setDurum("onayli");
                await yorumOnayla(yorum.id);
              })
            }
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-kontrol
                       bg-yesil-700 text-notr-0 text-sm cursor-pointer"
          >
            <Check size={16} aria-hidden="true" /> Onayla
          </button>
        )}
        {durum !== "reddedildi" && (
          <button
            type="button"
            disabled={bekliyor}
            onClick={() =>
              basla(async () => {
                setDurum("reddedildi");
                await yorumReddet(yorum.id);
              })
            }
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-kontrol
                       border border-notr-200 text-hata text-sm cursor-pointer bg-notr-0"
          >
            <X size={16} aria-hidden="true" /> Reddet
          </button>
        )}
        <button
          type="button"
          onClick={() => setYanitAcik((v) => !v)}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-kontrol
                     border border-notr-200 text-notr-600 text-sm cursor-pointer bg-notr-0"
        >
          <Reply size={16} aria-hidden="true" />
          {yorum.saticiYaniti ? "Yanıtı düzenle" : "Yanıtla"}
        </button>

        <span
          className={cn(
            "ml-auto self-center text-xs px-2 py-1 rounded-full",
            durum === "onayli" && "bg-yesil-100 text-yesil-800",
            durum === "bekliyor" && "bg-amber-100 text-amber-700",
            durum === "reddedildi" && "bg-hata-zemin text-hata",
          )}
        >
          {durum === "onayli"
            ? "Yayında"
            : durum === "bekliyor"
              ? "Onay bekliyor"
              : "Reddedildi"}
        </span>
      </div>
    </li>
  );
}
