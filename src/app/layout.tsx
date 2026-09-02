import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

// latin-ext alt kümesi Türkçe karakterler (ğ ı ş İ ç ö ü) için ZORUNLUDUR.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Organik Şifa — Doğal Takviye, Bitkisel Yağ ve Cilt Bakımı",
    template: "%s · Organik Şifa",
  },
  description:
    "Doğal içerikli takviye edici gıdalar, bitkisel yağ karışımları ve el yapımı cilt bakım ürünleri. Küçük partiler hâlinde hazırlanır. WhatsApp'tan sipariş ver.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Organik Şifa",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${newsreader.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
