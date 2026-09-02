import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ayarlariGetir } from "@/lib/settings";
import { yasalBelge, YASAL_SLUGLAR } from "@/lib/yasal-metinler";

export function generateStaticParams() {
  return YASAL_SLUGLAR.map((belge) => ({ belge }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ belge: string }>;
}): Promise<Metadata> {
  const { belge } = await params;
  const ayar = await ayarlariGetir();
  const d = yasalBelge(belge, ayar);
  if (!d) return { title: "Sayfa bulunamadı" };
  return {
    title: d.baslik,
    description: d.ozet,
    alternates: { canonical: `/${d.slug}` },
  };
}

export default async function YasalSayfa({
  params,
}: {
  params: Promise<{ belge: string }>;
}) {
  const { belge } = await params;
  const ayar = await ayarlariGetir();
  const d = yasalBelge(belge, ayar);
  if (!d) notFound();

  const eksikFirma = !ayar.ticaretUnvani;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="font-baslik text-[clamp(1.75rem,1rem+2.4vw,2.75rem)]">
        {d.baslik}
      </h1>
      <p className="mt-2 text-notr-600 olcu">{d.ozet}</p>

      {eksikFirma && (
        <p className="mt-6 text-sm bg-amber-100 text-amber-700 rounded-kontrol p-3">
          Firma bilgileri henüz girilmemiş. Site yayına çıkmadan önce panelden
          Ayarlar → Firma bilgileri bölümü doldurulmalıdır.
        </p>
      )}

      <div className="mt-10 space-y-10">
        {d.bolumler.map((b) => (
          <section key={b.baslik} className="space-y-3">
            <h2 className="font-baslik text-xl text-yesil-700">{b.baslik}</h2>
            {b.paragraflar.map((p, i) => (
              <p key={i} className="text-notr-600 whitespace-pre-line olcu">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-12 text-xs text-notr-400">
        Son güncelleme:{" "}
        {new Date(ayar.guncellendiAt).toLocaleDateString("tr-TR")}
      </p>
    </article>
  );
}
