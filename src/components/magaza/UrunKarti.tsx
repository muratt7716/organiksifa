import Link from "next/link";
import { fiyatBicimle, sayi, indirimYuzdesi } from "@/lib/price";
import type { KatalogUrunu } from "@/lib/catalog";
import { GorselCercevesi } from "./GorselCercevesi";
import { cn } from "@/lib/utils";

/**
 * "Aktar rafı" kartı: kutu ve gölge yok, altında ince bir raf çizgisi var.
 *
 * Görsel kırpılmaz; kare çerçeveye bulanık arka plan tekniğiyle yerleşir
 * (bkz. GorselCercevesi). Böylece dikey infografik de kare fotoğraf da
 * aynı ızgarada düzgün durur.
 */
export function UrunKarti({
  urun,
  oncelik = false,
}: {
  urun: KatalogUrunu;
  oncelik?: boolean;
}) {
  const fiyat = sayi(urun.fiyat);
  const eski = urun.eskiFiyat ? sayi(urun.eskiFiyat) : null;
  const indirim = indirimYuzdesi(fiyat, eski);
  const puan = urun.ortalamaPuan ? Number(urun.ortalamaPuan) : null;

  return (
    <article className="group flex flex-col">
      <Link href={`/urun/${urun.slug}`} className="flex flex-col flex-1">
        <div className="relative">
          <GorselCercevesi
            url={urun.kapakUrl}
            alt={urun.kapakAlt || urun.baslik}
            zeminRengi={urun.zeminRengi}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            oncelik={oncelik}
            icClassName="p-3 transition-transform duration-500 group-hover:scale-[1.04]"
          />

          {indirim !== null && (
            <span className="absolute top-2 left-2 z-10 bg-amber-600 text-notr-0 text-xs font-medium px-2 py-1 rounded">
              %{indirim} indirim
            </span>
          )}
          {!urun.stokta && (
            <span className="absolute inset-0 z-10 bg-notr-0/75 grid place-items-center rounded-gorsel">
              <span className="bg-notr-900 text-notr-0 text-sm px-3 py-1.5 rounded">
                Tükendi
              </span>
            </span>
          )}
          {urun.kargoBedava && urun.stokta && (
            <span className="absolute bottom-2 left-2 z-10 bg-notr-0/90 text-yesil-800 text-[11px] px-2 py-0.5 rounded">
              Kargo bedava
            </span>
          )}
        </div>

        {/* Raf çizgisi — kartın yapısal işareti. Gölge yok. */}
        <div className="h-px bg-notr-200 mt-3" />

        <div className="pt-3 space-y-1 flex-1 flex flex-col">
          {/* Sabit yükseklik: başlıklar 1 veya 2 satır olsa da fiyatlar hizalı kalır */}
          <h3
            className={cn(
              "font-baslik text-[17px] leading-snug transition-colors line-clamp-2",
              "min-h-[2.6em] group-hover:text-yesil-700",
            )}
          >
            {urun.baslik}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="rakam text-amber-600 font-medium">
              {fiyatBicimle(fiyat)}
            </span>
            {eski && (
              <span className="rakam text-sm text-notr-400 line-through">
                {fiyatBicimle(eski)}
              </span>
            )}
          </div>

          {puan !== null && urun.yorumSayisi > 0 ? (
            <p className="text-sm text-notr-600">
              <span className="text-amber-500" aria-hidden="true">
                ★
              </span>{" "}
              <span className="rakam">{puan.toLocaleString("tr-TR")}</span>
              <span className="text-notr-400"> ({urun.yorumSayisi})</span>
            </p>
          ) : (
            <p className="text-sm text-notr-400">Sipariş üzerine hazırlanır</p>
          )}
        </div>
      </Link>
    </article>
  );
}
