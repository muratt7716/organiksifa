import type { MetadataRoute } from "next";
import { yayindakiUrunler, aktifKategoriler } from "@/lib/catalog";
import { YASAL_SLUGLAR } from "@/lib/yasal-metinler";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [urunler, kategoriler] = await Promise.all([
    yayindakiUrunler(),
    aktifKategoriler(),
  ]);

  const sabit: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/urunler`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site}/hakkimizda`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site}/iletisim`, changeFrequency: "yearly", priority: 0.5 },
    ...YASAL_SLUGLAR.map((s) => ({
      url: `${site}/${s}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  return [
    ...sabit,
    ...kategoriler.map((k) => ({
      url: `${site}/kategori/${k.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...urunler.map((u) => ({
      url: `${site}/urun/${u.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
