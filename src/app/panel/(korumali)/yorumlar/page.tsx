import Link from "next/link";
import { MessageSquareOff } from "lucide-react";
import { yorumlariGetir } from "@/actions/reviews";
import { YorumSatiri } from "@/components/panel/YorumSatiri";
import { cn } from "@/lib/utils";

export const metadata = { title: "Yorumlar" };

const FILTRELER = [
  ["bekliyor", "Onay bekleyen"],
  ["onayli", "Yayında"],
  ["reddedildi", "Reddedilen"],
  ["hepsi", "Hepsi"],
] as const;

export default async function YorumlarSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const { durum = "bekliyor" } = await searchParams;
  const yorumlar = await yorumlariGetir(durum);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl text-yesil-700">Yorumlar</h1>
        <p className="text-sm text-notr-600 mt-1 olcu">
          Yorumlar onaylanmadan sitede görünmez. Spam gelse bile yayına çıkmaz —
          buradan silmen yeterli.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTRELER.map(([deger, etiket]) => (
          <Link
            key={deger}
            href={`/panel/yorumlar?durum=${deger}`}
            className={cn(
              "shrink-0 min-h-[44px] px-4 grid place-items-center rounded-kontrol text-sm border",
              durum === deger
                ? "bg-yesil-700 text-notr-0 border-yesil-700"
                : "bg-notr-0 text-notr-600 border-notr-200",
            )}
          >
            {etiket}
          </Link>
        ))}
      </div>

      {yorumlar.length === 0 ? (
        <div className="bg-notr-0 rounded-panel p-10 text-center space-y-2 border border-notr-200">
          <MessageSquareOff
            size={40}
            className="mx-auto text-notr-400"
            aria-hidden="true"
          />
          <p className="text-notr-600">Bu listede yorum yok.</p>
        </div>
      ) : (
        <ul className="bg-notr-0 rounded-panel px-4 border border-notr-200">
          {yorumlar.map((y) => (
            <YorumSatiri key={y.id} yorum={y} />
          ))}
        </ul>
      )}
    </div>
  );
}
