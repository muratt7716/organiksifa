"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { urunSil, urunArsivle } from "@/actions/products";

/**
 * Tehlikeli işlem bölgesi.
 *
 * İki seçenek sunulur çünkü çoğu durumda istenen şey silmek değil,
 * ürünü siteden kaldırmaktır. Kalıcı silme iki adımlı onay ister —
 * teknik olmayan bir kullanıcının yanlışlıkla veri kaybetmesini önler.
 */
export function UrunSil({ id, baslik }: { id: string; baslik: string }) {
  const [onayAcik, setOnayAcik] = useState(false);
  const [hata, setHata] = useState<string>();
  const [bekliyor, basla] = useTransition();
  const router = useRouter();

  return (
    <section className="bg-notr-0 rounded-panel p-4 md:p-5 border border-notr-200 space-y-4">
      <h2 className="text-lg text-hata">Ürünü kaldır</h2>

      <div className="space-y-3">
        <div>
          <button
            type="button"
            disabled={bekliyor}
            onClick={() =>
              basla(async () => {
                await urunArsivle(id);
                router.push("/panel/urunler");
                router.refresh();
              })
            }
            className="w-full sm:w-auto min-h-[48px] px-5 rounded-kontrol border
                       border-notr-200 bg-notr-0 cursor-pointer
                       hover:border-yesil-400 transition-colors"
          >
            Yayından kaldır
          </button>
          <p className="text-sm text-notr-600 mt-1.5">
            Ürün sitede görünmez ama silinmez. İstediğin zaman geri açabilirsin.
            <strong className="text-notr-900"> Önerilen seçenek budur.</strong>
          </p>
        </div>

        {!onayAcik ? (
          <div>
            <button
              type="button"
              onClick={() => setOnayAcik(true)}
              className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-kontrol
                         border border-hata/30 text-hata bg-notr-0 cursor-pointer
                         hover:bg-hata-zemin transition-colors"
            >
              <Trash2 size={17} aria-hidden="true" />
              Kalıcı olarak sil
            </button>
            <p className="text-sm text-notr-600 mt-1.5">
              Ürün ve fotoğrafları tamamen silinir. Bu işlem geri alınamaz.
            </p>
          </div>
        ) : (
          <div className="bg-hata-zemin border border-hata/30 rounded-panel p-4 space-y-3">
            <p className="flex items-start gap-2 text-hata">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>{baslik}</strong> kalıcı olarak silinecek. Ürün ve
                fotoğrafları tamamen kaldırılır, geri getirilemez.
              </span>
            </p>
            <p className="text-sm text-notr-600">
              Geçmiş siparişler etkilenmez — o siparişlerde ürünün adı, fiyatı ve
              fotoğrafı kayıtlı kalır.
            </p>

            {hata && (
              <p role="alert" className="text-sm text-hata">
                {hata}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={bekliyor}
                onClick={() =>
                  basla(async () => {
                    const s = await urunSil(id);
                    if (s.hata) {
                      setHata(s.hata);
                      return;
                    }
                    router.push("/panel/urunler");
                    router.refresh();
                  })
                }
                className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-kontrol
                           bg-hata text-notr-0 font-medium cursor-pointer
                           disabled:opacity-50"
              >
                <Trash2 size={17} aria-hidden="true" />
                {bekliyor ? "Siliniyor…" : "Evet, kalıcı olarak sil"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOnayAcik(false);
                  setHata(undefined);
                }}
                className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-kontrol
                           border border-notr-200 bg-notr-0 cursor-pointer"
              >
                <X size={17} aria-hidden="true" />
                Vazgeç
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
