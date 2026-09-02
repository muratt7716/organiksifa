"use client";

import { useState, useTransition } from "react";
import { Check, ExternalLink, Send } from "lucide-react";
import { ayarlariKaydet, bildirimTestEt, type AyarGirdisi } from "@/actions/settings";
import { telefonNormalize, telefonGoster } from "@/lib/phone";
import { waLink } from "@/lib/whatsapp";

export function AyarFormu({ baslangic }: { baslangic: AyarGirdisi }) {
  const [d, setD] = useState(baslangic);
  const [hata, setHata] = useState<string>();
  const [bilgi, setBilgi] = useState<string>();
  const [bekliyor, basla] = useTransition();

  const waNormal = d.whatsappNumarasi
    ? telefonNormalize(d.whatsappNumarasi)
    : null;

  function guncelle(yama: Partial<AyarGirdisi>) {
    setD((eski) => ({ ...eski, ...yama }));
  }

  const alan =
    "w-full min-h-[48px] px-3 py-2.5 rounded-kontrol border border-notr-200 bg-notr-0";
  const etiket = "block text-sm font-medium mb-1.5";
  const kart = "bg-notr-0 rounded-panel p-4 md:p-5 space-y-4 border border-notr-200";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setHata(undefined);
        setBilgi(undefined);
        basla(async () => {
          const s = await ayarlariKaydet(d);
          if (s.hata) setHata(s.hata);
          else setBilgi("Ayarlar kaydedildi.");
        });
      }}
      className="space-y-6 pb-40 md:pb-6"
    >
      <section className={kart}>
        <h2 className="text-lg text-yesil-700">Site</h2>
        <div>
          <label htmlFor="siteAdi" className={etiket}>
            Site adı
          </label>
          <input
            id="siteAdi"
            className={alan}
            value={d.siteAdi}
            onChange={(e) => guncelle({ siteAdi: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="slogan" className={etiket}>
            Slogan
          </label>
          <input
            id="slogan"
            className={alan}
            value={d.siteSlogan ?? ""}
            onChange={(e) => guncelle({ siteSlogan: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="duyuru" className={etiket}>
            Üst şerit duyurusu
          </label>
          <input
            id="duyuru"
            className={alan}
            maxLength={160}
            placeholder="750 ₺ üzeri kargo bedava"
            value={d.duyuruMetni ?? ""}
            onChange={(e) => guncelle({ duyuruMetni: e.target.value })}
          />
          <label className="flex items-center gap-2 mt-2 min-h-[44px] cursor-pointer">
            <input
              type="checkbox"
              className="size-5 accent-yesil-700"
              checked={d.duyuruAcik}
              onChange={(e) => guncelle({ duyuruAcik: e.target.checked })}
            />
            <span className="text-sm">Duyuruyu sitede göster</span>
          </label>
        </div>
      </section>

      <section className={kart}>
        <h2 className="text-lg text-yesil-700">WhatsApp</h2>
        <div>
          <label htmlFor="wa" className={etiket}>
            Sipariş WhatsApp numarası
          </label>
          <input
            id="wa"
            inputMode="tel"
            className={`${alan} rakam`}
            placeholder="0532 111 22 33"
            value={d.whatsappNumarasi ?? ""}
            onChange={(e) => guncelle({ whatsappNumarasi: e.target.value })}
          />
          {d.whatsappNumarasi && (
            <p
              className={`text-sm mt-1.5 ${waNormal ? "text-yesil-700" : "text-hata"}`}
              aria-live="polite"
            >
              {waNormal
                ? `Kullanılacak numara: ${telefonGoster(waNormal)}`
                : "Bu numarayı anlayamadım — 10 haneli olmalı."}
            </p>
          )}
          {waNormal && (
            <a
              href={waLink(waNormal, "Organik Şifa test mesajı")}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 mt-2 min-h-[44px] px-4
                         rounded-kontrol border border-notr-200 text-sm"
            >
              WhatsApp bağlantısını test et
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
          <p className="text-xs text-notr-400 mt-2">
            Bu numara yanlışsa sitedeki tüm sipariş butonları çalışmaz ve hiçbir
            hata görünmez. Kaydettikten sonra mutlaka test et.
          </p>
        </div>
      </section>

      <section className={kart}>
        <h2 className="text-lg text-yesil-700">Kargo</h2>
        <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
          <input
            type="checkbox"
            className="size-5 accent-yesil-700"
            checked={d.kargoBedavaAcik}
            onChange={(e) => guncelle({ kargoBedavaAcik: e.target.checked })}
          />
          <span>Belirli tutarın üzerinde kargo bedava olsun</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="limit" className={etiket}>
              Bedava kargo limiti (₺)
            </label>
            <input
              id="limit"
              inputMode="decimal"
              className={`${alan} rakam`}
              placeholder="750"
              disabled={!d.kargoBedavaAcik}
              value={d.kargoBedavaLimitMetni ?? ""}
              onChange={(e) => guncelle({ kargoBedavaLimitMetni: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="ucret" className={etiket}>
              Kargo ücreti (₺)
            </label>
            <input
              id="ucret"
              inputMode="decimal"
              className={`${alan} rakam`}
              placeholder="99"
              value={d.kargoUcretiMetni ?? ""}
              onChange={(e) => guncelle({ kargoUcretiMetni: e.target.value })}
            />
          </div>
        </div>
        <p className="text-xs text-notr-400">
          Kargo ücretini 0 yazarsan tüm siparişlerde kargo ücretsiz olur.
        </p>
      </section>

      <section className={kart}>
        <h2 className="text-lg text-yesil-700">Bildirimler</h2>
        <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
          <input
            type="checkbox"
            className="size-5 accent-yesil-700"
            checked={d.telegramAcik}
            onChange={(e) => guncelle({ telegramAcik: e.target.checked })}
          />
          <span>Telegram bildirimi</span>
        </label>
        <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
          <input
            type="checkbox"
            className="size-5 accent-yesil-700"
            checked={d.epostaAcik}
            onChange={(e) => guncelle({ epostaAcik: e.target.checked })}
          />
          <span>
            E-posta bildirimi{" "}
            <span className="text-notr-400 text-sm">(alan adı gerektirir)</span>
          </span>
        </label>
        <button
          type="button"
          disabled={bekliyor}
          onClick={() =>
            basla(async () => {
              const s = await bildirimTestEt();
              setBilgi(s.mesaj);
            })
          }
          className="inline-flex items-center gap-2 min-h-[48px] px-4 rounded-kontrol
                     border border-notr-200 bg-notr-0 cursor-pointer"
        >
          <Send size={16} aria-hidden="true" /> Test bildirimi gönder
        </button>
      </section>

      <section className={kart}>
        <h2 className="text-lg text-yesil-700">İletişim</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="tel" className={etiket}>
              Telefon
            </label>
            <input
              id="tel"
              className={`${alan} rakam`}
              value={d.iletisimTelefon ?? ""}
              onChange={(e) => guncelle({ iletisimTelefon: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="eposta" className={etiket}>
              E-posta
            </label>
            <input
              id="eposta"
              type="email"
              className={alan}
              value={d.iletisimEmail ?? ""}
              onChange={(e) => guncelle({ iletisimEmail: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label htmlFor="ig" className={etiket}>
            Instagram adresi
          </label>
          <input
            id="ig"
            className={alan}
            placeholder="https://instagram.com/..."
            value={d.instagramUrl ?? ""}
            onChange={(e) => guncelle({ instagramUrl: e.target.value })}
          />
        </div>
      </section>

      <section className={kart}>
        <h2 className="text-lg text-yesil-700">Firma bilgileri</h2>
        <p className="text-sm text-notr-600 olcu">
          Yasal sayfalara (mesafeli satış sözleşmesi, KVKK, iade koşulları)
          otomatik işlenir. Site yayına çıkmadan önce doldurulması gerekiyor.
        </p>
        {(
          [
            ["ticaretUnvani", "Ticaret unvanı"],
            ["adres", "Adres"],
            ["mersisNo", "MERSİS no"],
            ["vergiDairesi", "Vergi dairesi"],
            ["vergiNo", "Vergi no"],
            ["etbisDogrulamaUrl", "ETBİS doğrulama adresi"],
          ] as const
        ).map(([anahtar, baslik]) => (
          <div key={anahtar}>
            <label htmlFor={anahtar} className={etiket}>
              {baslik}
            </label>
            <input
              id={anahtar}
              className={alan}
              value={(d[anahtar] as string) ?? ""}
              onChange={(e) => guncelle({ [anahtar]: e.target.value })}
            />
          </div>
        ))}
      </section>

      {hata && (
        <p role="alert" className="text-sm text-hata bg-hata-zemin rounded-kontrol p-3">
          {hata}
        </p>
      )}
      {bilgi && (
        <p
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-yesil-700 bg-yesil-50 rounded-kontrol p-3"
        >
          <Check size={16} aria-hidden="true" /> {bilgi}
        </p>
      )}

      <div
        className="fixed bottom-[58px] inset-x-0 md:static p-3 md:p-0 bg-notr-0 md:bg-transparent
                   border-t border-notr-200 md:border-0 z-30"
      >
        <button
          type="submit"
          disabled={bekliyor}
          className="w-full h-12 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                     disabled:opacity-50 cursor-pointer hover:bg-yesil-800 transition-colors"
        >
          {bekliyor ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
