"use client";

import { useState, useTransition } from "react";
import { BadgeCheck, Check, Star } from "lucide-react";
import { yorumEkle } from "@/actions/reviews";
import { cn } from "@/lib/utils";

export type GosterilenYorum = {
  id: string;
  ad: string;
  puan: number;
  yorum: string;
  dogrulanmisAlici: boolean;
  saticiYaniti: string | null;
  onayAt: Date | null;
};

function Yildizlar({ puan, boyut = 15 }: { puan: number; boyut?: number }) {
  return (
    <span
      className="inline-flex gap-0.5"
      aria-label={`5 üzerinden ${puan} puan`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={boyut}
          aria-hidden="true"
          className={
            n <= puan ? "fill-amber-500 text-amber-500" : "text-notr-200"
          }
        />
      ))}
    </span>
  );
}

export function Yorumlar({
  urunId,
  yorumlar,
  ortalama,
  siparisNo,
  siparisToken,
}: {
  urunId: string;
  yorumlar: GosterilenYorum[];
  ortalama: number | null;
  siparisNo?: string;
  siparisToken?: string;
}) {
  const [ad, setAd] = useState("");
  const [puan, setPuan] = useState(5);
  const [metin, setMetin] = useState("");
  const [website, setWebsite] = useState("");
  const [hata, setHata] = useState<string>();
  const [gonderildi, setGonderildi] = useState(false);
  const [formAcik, setFormAcik] = useState(false);
  const [bekliyor, basla] = useTransition();

  const dagilim = [5, 4, 3, 2, 1].map((p) => ({
    puan: p,
    sayi: yorumlar.filter((y) => y.puan === p).length,
  }));

  return (
    <section className="space-y-8" aria-labelledby="yorumlar-baslik">
      <h2
        id="yorumlar-baslik"
        className="font-baslik text-[clamp(1.4rem,1rem+1.4vw,2rem)]"
      >
        Değerlendirmeler
      </h2>

      {yorumlar.length > 0 && (
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <p className="rakam text-4xl text-yesil-700">
              {(ortalama ?? 0).toLocaleString("tr-TR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </p>
            <Yildizlar puan={Math.round(ortalama ?? 0)} boyut={17} />
            <p className="text-sm text-notr-600 mt-1">
              {yorumlar.length} değerlendirme
            </p>
          </div>

          <ul className="flex-1 min-w-[200px] max-w-sm space-y-1">
            {dagilim.map((d) => (
              <li key={d.puan} className="flex items-center gap-2 text-sm">
                <span className="rakam w-3 text-notr-600">{d.puan}</span>
                <Star size={12} className="fill-amber-500 text-amber-500" aria-hidden="true" />
                <span className="flex-1 h-2 bg-notr-100 rounded-full overflow-hidden">
                  <span
                    className="block h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${yorumlar.length ? (d.sayi / yorumlar.length) * 100 : 0}%`,
                    }}
                  />
                </span>
                <span className="rakam w-6 text-right text-notr-400">{d.sayi}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {yorumlar.length > 0 ? (
        <ul className="space-y-6">
          {yorumlar.map((y) => (
            <li key={y.id} className="raf pb-6 last:border-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{y.ad}</span>
                {y.dogrulanmisAlici && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-yesil-700 bg-yesil-100 px-2 py-0.5 rounded-full">
                    <BadgeCheck size={11} aria-hidden="true" /> Doğrulanmış alıcı
                  </span>
                )}
                <Yildizlar puan={y.puan} />
              </div>
              <p className="mt-2 olcu">{y.yorum}</p>
              {y.saticiYaniti && (
                <div className="mt-3 pl-4 border-l-2 border-yesil-200">
                  <p className="text-sm font-medium text-yesil-700">Satıcı yanıtı</p>
                  <p className="text-sm text-notr-600 olcu">{y.saticiYaniti}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-notr-600">
          Bu ürün için henüz değerlendirme yok. İlk yorumu sen yazabilirsin.
        </p>
      )}

      {gonderildi ? (
        <p className="flex items-center gap-2 text-yesil-700 bg-yesil-50 rounded-kontrol p-4">
          <Check size={18} aria-hidden="true" />
          Değerlendirmen alındı. Kontrol edildikten sonra yayınlanacak — teşekkürler!
        </p>
      ) : formAcik ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setHata(undefined);
            basla(async () => {
              const s = await yorumEkle({
                urunId,
                ad,
                puan,
                yorum: metin,
                siparisNo,
                siparisToken,
                website,
              });
              if (s.hata) setHata(s.hata);
              else setGonderildi(true);
            });
          }}
          className="space-y-4 bg-notr-100 rounded-panel p-5"
        >
          <h3 className="font-medium">Değerlendirme yaz</h3>

          <div>
            <span className="block text-sm font-medium mb-1.5">Puanın</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} yıldız`}
                  aria-pressed={puan === n}
                  onClick={() => setPuan(n)}
                  className="size-11 grid place-items-center cursor-pointer"
                >
                  <Star
                    size={26}
                    aria-hidden="true"
                    className={cn(
                      n <= puan ? "fill-amber-500 text-amber-500" : "text-notr-300",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="yorum-ad" className="block text-sm font-medium mb-1.5">
              Adın
            </label>
            <input
              id="yorum-ad"
              required
              value={ad}
              onChange={(e) => setAd(e.target.value)}
              placeholder="Ayşe K."
              className="w-full min-h-[48px] px-3 rounded-kontrol border border-notr-200 bg-notr-0"
            />
          </div>

          <div>
            <label htmlFor="yorum-metin" className="block text-sm font-medium mb-1.5">
              Yorumun
            </label>
            <textarea
              id="yorum-metin"
              required
              rows={4}
              value={metin}
              onChange={(e) => setMetin(e.target.value)}
              className="w-full px-3 py-2.5 rounded-kontrol border border-notr-200 bg-notr-0"
            />
          </div>

          {/* Bot tuzağı — ekran okuyucudan ve gözden gizli */}
          <div aria-hidden="true" className="hidden">
            <label htmlFor="website">Web sitesi</label>
            <input
              id="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {hata && (
            <p role="alert" className="text-sm text-hata">
              {hata}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={bekliyor}
              className="min-h-[48px] px-5 rounded-kontrol bg-yesil-700 text-notr-0
                         font-medium disabled:opacity-50 cursor-pointer"
            >
              {bekliyor ? "Gönderiliyor…" : "Gönder"}
            </button>
            <button
              type="button"
              onClick={() => setFormAcik(false)}
              className="min-h-[48px] px-5 rounded-kontrol border border-notr-200
                         bg-notr-0 cursor-pointer"
            >
              Vazgeç
            </button>
          </div>

          <p className="text-xs text-notr-400">
            Yorumlar kontrol edildikten sonra yayınlanır.
          </p>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setFormAcik(true)}
          className="min-h-[48px] px-5 rounded-kontrol border border-yesil-700
                     text-yesil-700 font-medium cursor-pointer hover:bg-yesil-50
                     transition-colors"
        >
          Değerlendirme yaz
        </button>
      )}
    </section>
  );
}
