import type { Metadata } from "next";
import { SepetIcerigi } from "@/components/magaza/SepetIcerigi";

export const metadata: Metadata = {
  title: "Sepetim",
  robots: { index: false, follow: false },
};

export default function SepetSayfasi() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="font-baslik text-[clamp(1.75rem,1rem+2.4vw,2.75rem)] mb-8">
        Sepetim
      </h1>
      <SepetIcerigi />
    </div>
  );
}
