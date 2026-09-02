"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useSepet } from "@/store/sepet";
import { useSepetHidrasyonu } from "@/store/hidrasyon";
import { sepetIcerigi, type SepetOzeti } from "@/actions/catalog";
import { siparisOlustur } from "@/actions/orders";
import { fiyatBicimle } from "@/lib/price";
import { TR_ILLER } from "@/lib/tr-iller";

export function OdemeFormu() {
  const kalemler = useSepet((s) => s.kalemler);
  const temizle = useSepet((s) => s.temizle);
  const router = useRouter();

  const hidre = useSepetHidrasyonu();
  const [ozet, setOzet] = useState<SepetOzeti | null>(null);
  const [hata, setHata] = useState<string>();
  const [bekliyor, basla] = useTransition();

  /**
   * Aynı sipariş iki kez oluşmasın (F5, çift tıklama, uygulama geçişi).
   *
   * Anahtar render sırasında DEĞİL, ilk gönderimde üretilir — crypto.randomUUID()
   * saf olmayan bir çağrıdır ve render içinde çalıştırılmamalıdır. Ref'te
   * tutulduğu için tekrar gönderimlerde aynı anahtar kullanılır.
   */
  const anahtarRef = useRef<string>("");
  function idempotencyAnahtari() {
    if (!anahtarRef.current) {
      anahtarRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
    }
    return anahtarRef.current;
  }

  const [f, setF] = useState({
    musteriAdi: "",
    telefon: "",
    email: "",
    il: "",
    ilce: "",
    adres: "",
    not: "",
    sozlesmeOnay: false,
    kvkkOnay: false,
    ticariIletiIzni: false,
    website: "",
  });

  useEffect(() => {
    if (!hidre) return;
    basla(async () => setOzet(await sepetIcerigi(kalemler)));
  }, [kalemler, hidre]);

  if (hidre && kalemler.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-notr-600">Sepetin boş.</p>
        <Link
          href="/urunler"
          className="inline-flex items-center min-h-[52px] px-6 rounded-kontrol
                     bg-yesil-700 text-notr-0 font-medium"
        >
          Ürünlere göz at
        </Link>
      </div>
    );
  }

  const alan =
    "w-full min-h-[52px] px-3 py-2.5 rounded-kontrol border border-notr-200 bg-notr-0 " +
    "focus-visible:border-yesil-700";
  const etiket = "block text-sm font-medium mb-1.5";

  function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata(undefined);
    basla(async () => {
      const sonuc = await siparisOlustur({
        ...f,
        sozlesmeOnay: f.sozlesmeOnay as true,
        kvkkOnay: f.kvkkOnay as true,
        idempotencyKey: idempotencyAnahtari(),
        sepet: kalemler,
      });

      if ("hata" in sonuc) {
        setHata(sonuc.hata);
        return;
      }
      temizle();
      router.push(`/siparis/${sonuc.siparisNo}?t=${sonuc.token}`);
    });
  }

  return (
    <form onSubmit={gonder} className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="space-y-5">
        <section className="space-y-4">
          <h2 className="font-baslik text-xl">İletişim</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ad" className={etiket}>
                Ad soyad
              </label>
              <input
                id="ad"
                required
                autoComplete="name"
                className={alan}
                value={f.musteriAdi}
                onChange={(e) => setF({ ...f, musteriAdi: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="tel" className={etiket}>
                Telefon
              </label>
              <input
                id="tel"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0532 111 22 33"
                className={`${alan} rakam`}
                value={f.telefon}
                onChange={(e) => setF({ ...f, telefon: e.target.value })}
              />
              <p className="text-xs text-notr-400 mt-1">
                Siparişini bu numaradan WhatsApp&apos;la onaylayacağız.
              </p>
            </div>
          </div>
          <div>
            <label htmlFor="eposta" className={etiket}>
              E-posta{" "}
              <span className="text-notr-400 font-normal">(isteğe bağlı)</span>
            </label>
            <input
              id="eposta"
              type="email"
              autoComplete="email"
              className={alan}
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-baslik text-xl">Teslimat adresi</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="il" className={etiket}>
                İl
              </label>
              <select
                id="il"
                required
                className={alan}
                value={f.il}
                onChange={(e) => setF({ ...f, il: e.target.value })}
              >
                <option value="">Seç…</option>
                {TR_ILLER.map((il) => (
                  <option key={il} value={il}>
                    {il}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ilce" className={etiket}>
                İlçe
              </label>
              <input
                id="ilce"
                required
                autoComplete="address-level2"
                className={alan}
                value={f.ilce}
                onChange={(e) => setF({ ...f, ilce: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label htmlFor="adres" className={etiket}>
              Açık adres
            </label>
            <textarea
              id="adres"
              required
              rows={3}
              autoComplete="street-address"
              placeholder="Mahalle, sokak, bina ve daire no"
              className={alan}
              value={f.adres}
              onChange={(e) => setF({ ...f, adres: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="not" className={etiket}>
              Sipariş notu{" "}
              <span className="text-notr-400 font-normal">(isteğe bağlı)</span>
            </label>
            <textarea
              id="not"
              rows={2}
              maxLength={500}
              className={alan}
              value={f.not}
              onChange={(e) => setF({ ...f, not: e.target.value })}
            />
          </div>
        </section>

        <section className="space-y-3">
          {/* İki onay AYRI kutudur — birleşik onay geçersiz sayılabilir. */}
          <label className="flex items-start gap-3 min-h-[48px] cursor-pointer">
            <input
              type="checkbox"
              required
              className="size-5 mt-1 accent-yesil-700"
              checked={f.sozlesmeOnay}
              onChange={(e) => setF({ ...f, sozlesmeOnay: e.target.checked })}
            />
            <span className="text-sm">
              <Link
                href="/on-bilgilendirme"
                target="_blank"
                className="underline text-yesil-700"
              >
                Ön Bilgilendirme Formu
              </Link>{" "}
              ve{" "}
              <Link
                href="/mesafeli-satis-sozlesmesi"
                target="_blank"
                className="underline text-yesil-700"
              >
                Mesafeli Satış Sözleşmesi
              </Link>
              &apos;ni okudum, onaylıyorum.
            </span>
          </label>

          <label className="flex items-start gap-3 min-h-[48px] cursor-pointer">
            <input
              type="checkbox"
              required
              className="size-5 mt-1 accent-yesil-700"
              checked={f.kvkkOnay}
              onChange={(e) => setF({ ...f, kvkkOnay: e.target.checked })}
            />
            <span className="text-sm">
              <Link href="/kvkk" target="_blank" className="underline text-yesil-700">
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni okudum.
            </span>
          </label>

          <label className="flex items-start gap-3 min-h-[48px] cursor-pointer">
            <input
              type="checkbox"
              className="size-5 mt-1 accent-yesil-700"
              checked={f.ticariIletiIzni}
              onChange={(e) => setF({ ...f, ticariIletiIzni: e.target.checked })}
            />
            <span className="text-sm text-notr-600">
              Kampanya ve yeni ürün duyurularını almak istiyorum.{" "}
              <span className="text-notr-400">(isteğe bağlı)</span>
            </span>
          </label>
        </section>

        {/* Bot tuzağı */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="website">Web sitesi</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={f.website}
            onChange={(e) => setF({ ...f, website: e.target.value })}
          />
        </div>

        {hata && (
          <p
            role="alert"
            className="text-sm text-hata bg-hata-zemin rounded-kontrol p-3"
          >
            {hata}
          </p>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 bg-notr-100 rounded-panel p-5 space-y-4">
        <h2 className="font-baslik text-xl">Sipariş özeti</h2>

        {ozet ? (
          <>
            <ul className="space-y-2 text-sm">
              {ozet.satirlar.map((s) => (
                <li key={s.id} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate">
                    {s.baslik} <span className="text-notr-400">×{s.adet}</span>
                  </span>
                  <span className="rakam shrink-0">
                    {fiyatBicimle(s.satirToplam)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 text-sm pt-3 border-t border-notr-200">
              <div className="flex justify-between">
                <dt className="text-notr-600">Ara toplam</dt>
                <dd className="rakam">{fiyatBicimle(ozet.araToplam)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-notr-600">Kargo</dt>
                <dd className="rakam">
                  {ozet.kargo.ucret === 0 ? (
                    <span className="text-yesil-700">Ücretsiz</span>
                  ) : (
                    fiyatBicimle(ozet.kargo.ucret)
                  )}
                </dd>
              </div>
              <div className="flex justify-between pt-3 border-t border-notr-200 text-lg font-medium">
                <dt>Toplam</dt>
                <dd className="rakam text-yesil-700">
                  {fiyatBicimle(ozet.toplam)}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="text-sm text-notr-600">Hesaplanıyor…</p>
        )}

        <button
          type="submit"
          disabled={bekliyor || !ozet}
          className="w-full h-14 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                     disabled:opacity-50 cursor-pointer hover:bg-yesil-800 transition-colors"
        >
          {bekliyor ? "Sipariş oluşturuluyor…" : "Siparişi oluştur"}
        </button>

        <p className="flex items-start gap-2 text-xs text-notr-600">
          <ShieldCheck size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
          Kart bilgisi istemiyoruz. Siparişin oluşunca WhatsApp&apos;a
          yönlendirileceksin; ödeme ve kargo orada konuşulur.
        </p>
      </aside>
    </form>
  );
}
