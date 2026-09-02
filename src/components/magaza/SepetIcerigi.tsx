"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react";
import { useSepet } from "@/store/sepet";
import { useSepetHidrasyonu } from "@/store/hidrasyon";
import { sepetIcerigi, type SepetOzeti } from "@/actions/catalog";
import { fiyatBicimle, sayi } from "@/lib/price";

export function SepetIcerigi() {
  const kalemler = useSepet((s) => s.kalemler);
  const adetAyarla = useSepet((s) => s.adetAyarla);
  const cikar = useSepet((s) => s.cikar);
  const hidre = useSepetHidrasyonu();

  const [ozet, setOzet] = useState<SepetOzeti | null>(null);
  const [, basla] = useTransition();

  useEffect(() => {
    if (!hidre) return;
    basla(async () => {
      const o = await sepetIcerigi(kalemler);
      setOzet(o);
      // Artık satışta olmayan ürünleri sepetten sessizce düşür.
      o.bulunamayanlar.forEach((id) => cikar(id));
    });
  }, [kalemler, cikar, hidre]);

  if (!hidre) {
    return <div className="py-20 text-center text-notr-600">Sepet yükleniyor…</div>;
  }

  if (kalemler.length === 0 || (ozet && ozet.satirlar.length === 0)) {
    return (
      <div className="py-20 text-center space-y-4">
        <ShoppingBag size={44} className="mx-auto text-notr-300" aria-hidden="true" />
        <p className="text-notr-600">Sepetin şu an boş.</p>
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

  if (!ozet) {
    return <div className="py-20 text-center text-notr-600">Hesaplanıyor…</div>;
  }

  const kalan = ozet.kargo.bedavayaKalan;

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <ul>
        {ozet.satirlar.map((s) => (
          <li key={s.id} className="flex gap-4 py-5 raf">
            <Link
              href={`/urun/${s.slug}`}
              className="relative size-24 shrink-0 rounded-gorsel overflow-hidden"
              style={{ backgroundColor: s.zeminRengi || "#EDF1E8" }}
            >
              {s.kapakUrl && (
                <Image
                  src={s.kapakUrl}
                  alt={s.kapakAlt || s.baslik}
                  fill
                  sizes="96px"
                  className="object-contain p-1"
                />
              )}
            </Link>

            <div className="flex-1 min-w-0 space-y-2">
              <Link
                href={`/urun/${s.slug}`}
                className="font-baslik text-lg leading-snug hover:text-yesil-700 transition-colors"
              >
                {s.baslik}
              </Link>
              <p className="rakam text-notr-600">{fiyatBicimle(sayi(s.fiyat))}</p>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-notr-200 rounded-kontrol">
                  <button
                    type="button"
                    aria-label={`${s.baslik} adedini azalt`}
                    onClick={() => adetAyarla(s.id, s.adet - 1)}
                    className="size-11 grid place-items-center text-notr-600 cursor-pointer"
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <span className="w-9 text-center rakam">{s.adet}</span>
                  <button
                    type="button"
                    aria-label={`${s.baslik} adedini artır`}
                    onClick={() => adetAyarla(s.id, s.adet + 1)}
                    className="size-11 grid place-items-center text-notr-600 cursor-pointer"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label={`${s.baslik} ürününü sepetten çıkar`}
                  onClick={() => cikar(s.id)}
                  className="size-11 grid place-items-center text-notr-400 cursor-pointer
                             hover:text-hata transition-colors"
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            </div>

            <p className="rakam font-medium shrink-0">
              {fiyatBicimle(s.satirToplam)}
            </p>
          </li>
        ))}
      </ul>

      <aside className="lg:sticky lg:top-24 bg-notr-100 rounded-panel p-5 space-y-4">
        <h2 className="font-baslik text-xl">Sipariş özeti</h2>

        {kalan !== null && kalan > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-yesil-700">
              <Truck size={16} aria-hidden="true" />
              Bedava kargoya <strong className="rakam">{fiyatBicimle(kalan)}</strong>{" "}
              kaldı
            </p>
            <div className="h-2 bg-notr-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yesil-700 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (ozet.araToplam / (ozet.araToplam + kalan)) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <dl className="space-y-2 text-sm">
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
            <dd className="rakam text-yesil-700">{fiyatBicimle(ozet.toplam)}</dd>
          </div>
        </dl>

        <Link
          href="/odeme"
          className="w-full h-14 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                     grid place-items-center hover:bg-yesil-800 transition-colors"
        >
          Siparişi tamamla
        </Link>

        <p className="text-xs text-notr-600 text-center">
          Sitede kart bilgisi istemiyoruz. Ödeme ve teslimat WhatsApp&apos;tan
          konuşulur.
        </p>
      </aside>
    </div>
  );
}
