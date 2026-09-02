"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingBag,
  Tags,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

// kisa: dar telefonlarda 6 öğe yan yana sığsın diye (375px'te öğe başına ~62px)
const BAGLANTILAR = [
  { href: "/panel", etiket: "Özet", kisa: "Özet", Ikon: Home },
  { href: "/panel/urunler", etiket: "Ürünler", kisa: "Ürün", Ikon: Package },
  { href: "/panel/siparisler", etiket: "Siparişler", kisa: "Sipariş", Ikon: ShoppingBag },
  { href: "/panel/kategoriler", etiket: "Kategoriler", kisa: "Kategori", Ikon: Tags },
  { href: "/panel/yorumlar", etiket: "Yorumlar", kisa: "Yorum", Ikon: MessageSquare },
  { href: "/panel/ayarlar", etiket: "Ayarlar", kisa: "Ayar", Ikon: Settings },
] as const;

export function PanelNav({
  bekleyenSiparis = 0,
  bekleyenYorum = 0,
}: {
  bekleyenSiparis?: number;
  bekleyenYorum?: number;
}) {
  const yol = usePathname();

  function rozet(href: string) {
    if (href === "/panel/siparisler" && bekleyenSiparis > 0) return bekleyenSiparis;
    if (href === "/panel/yorumlar" && bekleyenYorum > 0) return bekleyenYorum;
    return null;
  }

  return (
    <nav
      aria-label="Panel menüsü"
      className="fixed bottom-0 inset-x-0 z-40 bg-notr-0 border-t border-notr-200
                 md:static md:border-t-0 md:border-r md:h-dvh md:w-56 md:shrink-0 md:sticky md:top-0"
    >
      <div className="hidden md:block px-4 py-4 border-b border-notr-200">
        <span className="font-baslik text-lg text-yesil-700">Organik Şifa</span>
      </div>
      <ul className="flex md:flex-col md:p-2 md:gap-0.5">
        {BAGLANTILAR.map(({ href, etiket, kisa, Ikon }) => {
          const aktif = href === "/panel" ? yol === href : yol.startsWith(href);
          const sayi = rozet(href);
          return (
            <li key={href} className="flex-1 md:flex-none">
              <Link
                href={href}
                aria-current={aktif ? "page" : undefined}
                className={cn(
                  "relative flex flex-col md:flex-row items-center gap-1 md:gap-3",
                  "min-h-[58px] md:min-h-[44px] px-0.5 md:px-3 justify-center md:justify-start",
                  "rounded-kontrol text-[10px] md:text-sm leading-tight transition-colors",
                  aktif
                    ? "bg-yesil-100 text-yesil-800 font-medium"
                    : "text-notr-600 hover:bg-notr-50",
                )}
              >
                <span className="relative">
                  <Ikon size={20} aria-hidden="true" />
                  {sayi !== null && (
                    <span
                      className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1
                                 rounded-full bg-amber-600 text-notr-0 text-[10px]
                                 grid place-items-center rakam"
                    >
                      {sayi > 99 ? "99+" : sayi}
                    </span>
                  )}
                </span>
                <span className="md:hidden">{kisa}</span>
                <span className="hidden md:inline">{etiket}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
