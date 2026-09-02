import Link from "next/link";
import { Search, Inbox } from "lucide-react";
import { siparisleriGetir } from "@/actions/orders";
import { fiyatBicimle, sayi } from "@/lib/price";
import {
  DURUM_ETIKET,
  ODEME_ETIKET,
  type SiparisDurumu,
  type OdemeDurumu,
} from "@/db/schema";
import { cn } from "@/lib/utils";

export const metadata = { title: "Siparişler" };

const FILTRELER = [
  ["hepsi", "Hepsi"],
  ["yeni", "Yeni"],
  ["onaylandi", "Onaylandı"],
  ["kargoda", "Kargoda"],
  ["teslim", "Teslim"],
] as const;

const DURUM_RENK: Record<string, string> = {
  yeni: "bg-amber-100 text-amber-700",
  goruseldi: "bg-notr-100 text-notr-600",
  onaylandi: "bg-yesil-100 text-yesil-800",
  kargoda: "bg-yesil-100 text-yesil-800",
  teslim: "bg-yesil-700 text-notr-0",
  iptal: "bg-hata-zemin text-hata",
};

export default async function SiparislerSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; durum?: string }>;
}) {
  const { q, durum } = await searchParams;
  const siparisler = await siparisleriGetir(q, durum);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl text-yesil-700">Siparişler</h1>

      <form className="relative">
        <Search
          size={18}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-notr-400"
        />
        <label htmlFor="q" className="sr-only">
          Sipariş no, ad veya telefon ara
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Sipariş no, ad veya telefon ara…"
          className="w-full h-12 pl-10 pr-3 rounded-kontrol border border-notr-200 bg-notr-0"
        />
        {durum && <input type="hidden" name="durum" value={durum} />}
      </form>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTRELER.map(([deger, etiket]) => {
          const aktif = (durum ?? "hepsi") === deger;
          return (
            <Link
              key={deger}
              href={`/panel/siparisler?durum=${deger}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={cn(
                "shrink-0 min-h-[44px] px-4 grid place-items-center rounded-kontrol text-sm border",
                aktif
                  ? "bg-yesil-700 text-notr-0 border-yesil-700"
                  : "bg-notr-0 text-notr-600 border-notr-200",
              )}
            >
              {etiket}
            </Link>
          );
        })}
      </div>

      {siparisler.length === 0 ? (
        <div className="bg-notr-0 rounded-panel p-10 text-center space-y-2 border border-notr-200">
          <Inbox size={40} className="mx-auto text-notr-400" aria-hidden="true" />
          <p className="text-notr-600">
            {q ? "Aramana uyan sipariş bulunamadı." : "Henüz sipariş yok."}
          </p>
        </div>
      ) : (
        <ul className="bg-notr-0 rounded-panel px-4 border border-notr-200">
          {siparisler.map((s) => (
            <li key={s.id} className="raf last:border-0">
              <Link
                href={`/panel/siparisler/${s.id}`}
                className="flex items-start gap-3 py-3 min-h-[64px] group"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-medium truncate group-hover:text-yesil-700 transition-colors">
                    {s.musteriAdi}
                  </span>
                  <span className="block text-sm text-notr-600 rakam truncate">
                    {s.siparisNo} · {s.telefon}
                  </span>
                  <span className="block text-xs text-notr-400 mt-0.5">
                    {s.il} / {s.ilce} ·{" "}
                    {new Date(s.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>

                <span className="text-right shrink-0 space-y-1">
                  <span className="block rakam font-medium">
                    {fiyatBicimle(sayi(s.toplam))}
                  </span>
                  <span
                    className={cn(
                      "inline-block text-[11px] px-2 py-0.5 rounded-full",
                      DURUM_RENK[s.durum] ?? "bg-notr-100 text-notr-600",
                    )}
                  >
                    {DURUM_ETIKET[s.durum as SiparisDurumu] ?? s.durum}
                  </span>
                  {s.odemeDurumu === "bekliyor" && s.durum !== "iptal" && (
                    <span className="block text-[11px] text-amber-600">
                      {ODEME_ETIKET[s.odemeDurumu as OdemeDurumu]}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
