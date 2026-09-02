"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { urunAnahtarDegistir, type UrunSatirVerisi } from "@/actions/products";
import { fiyatBicimle, sayi } from "@/lib/price";
import { cn } from "@/lib/utils";

function Anahtar({
  etiket,
  acik,
  bekliyor,
  onDegis,
}: {
  etiket: string;
  acik: boolean;
  bekliyor: boolean;
  onDegis: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 min-h-[26px] cursor-pointer text-sm select-none",
        bekliyor && "opacity-60",
      )}
    >
      <input
        type="checkbox"
        className="size-5 accent-yesil-700"
        checked={acik}
        onChange={(e) => onDegis(e.target.checked)}
      />
      <span className="w-[52px] text-notr-600">{etiket}</span>
    </label>
  );
}

export function UrunSatiri({ urun }: { urun: UrunSatirVerisi }) {
  const [stokta, setStokta] = useState(urun.stokta);
  const [yayinda, setYayinda] = useState(urun.yayinda);
  const [bekliyor, basla] = useTransition();

  function degistir(alan: "stokta" | "yayinda", deger: boolean) {
    if (alan === "stokta") setStokta(deger);
    else setYayinda(deger);
    basla(async () => {
      await urunAnahtarDegistir(urun.id, alan, deger);
    });
  }

  return (
    <li className="flex items-center gap-3 py-3 raf last:border-0">
      <Link
        href={`/panel/urunler/${urun.id}`}
        className="flex items-center gap-3 flex-1 min-w-0 group"
      >
        <span
          className="size-14 shrink-0 rounded-gorsel overflow-hidden grid place-items-center border border-notr-200"
          style={{ backgroundColor: urun.zeminRengi ?? "#EDF1E8" }}
        >
          {urun.kapakUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={urun.kapakUrl}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-[10px] text-notr-400">foto yok</span>
          )}
        </span>
        <span className="min-w-0">
          <span
            className={cn(
              "block truncate font-medium group-hover:text-yesil-700 transition-colors",
              !yayinda && "text-notr-400",
            )}
          >
            {urun.baslik}
          </span>
          <span className="block text-sm text-notr-600">
            <span className="rakam">{fiyatBicimle(sayi(urun.fiyat))}</span>
            {urun.kategoriAdi && <span> · {urun.kategoriAdi}</span>}
          </span>
        </span>
      </Link>

      <div className="flex flex-col gap-1 shrink-0">
        <Anahtar
          etiket="Stokta"
          acik={stokta}
          bekliyor={bekliyor}
          onDegis={(v) => degistir("stokta", v)}
        />
        <Anahtar
          etiket="Yayında"
          acik={yayinda}
          bekliyor={bekliyor}
          onDegis={(v) => degistir("yayinda", v)}
        />
      </div>
    </li>
  );
}
