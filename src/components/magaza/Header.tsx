"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SepetRozeti } from "./SepetRozeti";
import { cn } from "@/lib/utils";

export type MenuKategori = { ad: string; slug: string };

export function Header({
  siteAdi,
  kategoriler,
  duyuru,
}: {
  siteAdi: string;
  kategoriler: MenuKategori[];
  duyuru?: string | null;
}) {
  const [acik, setAcik] = useState(false);
  const yol = usePathname();

  const baglantilar = [
    { href: "/urunler", etiket: "Tüm Ürünler" },
    ...kategoriler.map((k) => ({ href: `/kategori/${k.slug}`, etiket: k.ad })),
    { href: "/hakkimizda", etiket: "Hakkımızda" },
    { href: "/iletisim", etiket: "İletişim" },
  ];

  return (
    <>
      {duyuru && (
        <div className="bg-yesil-700 text-notr-0 text-center text-sm py-2 px-4">
          {duyuru}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-notr-0/95 backdrop-blur border-b border-notr-200">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center shrink-0 min-h-[44px]"
            aria-label={`${siteAdi} ana sayfa`}
          >
            <Image
              src="/marka/logo-yatay.png"
              alt={siteAdi}
              width={645}
              height={219}
              priority
              /* 64px'lik şeritte 40-44px: üstte altta nefes payı kalıyor. */
              className="h-10 w-auto sm:h-11"
            />
          </Link>

          <nav
            aria-label="Ana menü"
            className="hidden lg:flex items-center gap-1 ml-4 flex-1 min-w-0"
          >
            {baglantilar.slice(0, 6).map((b) => (
              <Link
                key={b.href}
                href={b.href}
                aria-current={yol === b.href ? "page" : undefined}
                className={cn(
                  "px-3 min-h-[44px] grid place-items-center rounded-kontrol text-sm transition-colors",
                  yol === b.href
                    ? "text-yesil-700 font-medium"
                    : "text-notr-600 hover:text-yesil-700",
                )}
              >
                {b.etiket}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <SepetRozeti />
            <button
              type="button"
              onClick={() => setAcik((v) => !v)}
              aria-expanded={acik}
              aria-controls="mobil-menu"
              aria-label={acik ? "Menüyü kapat" : "Menüyü aç"}
              className="lg:hidden grid place-items-center size-11 rounded-kontrol
                         hover:bg-yesil-50 transition-colors cursor-pointer"
            >
              {acik ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {acik && (
          <nav
            id="mobil-menu"
            aria-label="Mobil menü"
            className="lg:hidden border-t border-notr-200 bg-notr-0"
          >
            <ul className="mx-auto max-w-6xl px-4 py-2">
              {baglantilar.map((b) => (
                <li key={b.href} className="raf last:border-0">
                  <Link
                    href={b.href}
                    onClick={() => setAcik(false)}
                    className="flex items-center min-h-[52px] text-notr-900"
                  >
                    {b.etiket}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
