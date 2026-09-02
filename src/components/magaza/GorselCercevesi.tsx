import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Herhangi bir orandaki görseli sabit oranlı bir çerçeveye,
 * KIRPMADAN ve boş bar bırakmadan yerleştirir.
 *
 * Nasıl: aynı görselin büyütülüp bulanıklaştırılmış hâli arka plana serilir,
 * net hâli önde `object-contain` ile ortalanır. Böylece 1:2 oranındaki bir
 * infografik de kare bir kartta kasıtlı ve premium görünür — dikey görselin
 * yanındaki boşluk, görselin kendi renklerinden oluşmuş yumuşak bir alan olur.
 *
 * Aynı `src` iki kez kullanıldığı için tarayıcı tek istek yapar.
 */
export function GorselCercevesi({
  url,
  alt,
  zeminRengi,
  oran = "1 / 1",
  sizes,
  oncelik = false,
  className,
  icClassName,
}: {
  url: string | null;
  alt: string;
  zeminRengi?: string | null;
  oran?: string;
  sizes: string;
  oncelik?: boolean;
  className?: string;
  icClassName?: string;
}) {
  if (!url) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-gorsel grid place-items-center",
          className,
        )}
        style={{ aspectRatio: oran, backgroundColor: zeminRengi ?? "#EDF1E8" }}
      >
        <span className="text-notr-400 text-sm">Fotoğraf yok</span>
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-gorsel", className)}
      style={{ aspectRatio: oran, backgroundColor: zeminRengi ?? "#EDF1E8" }}
    >
      <Image
        src={url}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="object-cover scale-125 blur-2xl opacity-70 select-none"
      />
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={oncelik}
        className={cn("relative object-contain", icClassName)}
      />
    </div>
  );
}
