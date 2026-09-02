import { ImageResponse } from "next/og";
import { ayarlariGetir } from "@/lib/settings";

/**
 * WhatsApp, Instagram ve Facebook'ta bağlantı paylaşıldığında görünen kart.
 *
 * Bu görsel olmadan WhatsApp'ta sadece çıplak bir bağlantı görünür —
 * paylaşımdan gelen tıklama oranını doğrudan etkiler.
 *
 * Logo dosyası gelince: bu dosyayı sil, yerine `src/app/opengraph-image.png`
 * koy (1200x630). Next.js kendiliğinden algılar.
 */
export const alt = "Organik Şifa — Doğal takviye ve bitkisel bakım";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const ayar = await ayarlariGetir();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#EDF1E8",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "#1F5138",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "#EDF1E8",
                borderRadius: "0 100% 0 100%",
                transform: "rotate(-45deg)",
              }}
            />
          </div>
          <div style={{ fontSize: 40, color: "#1F5138", letterSpacing: -1 }}>
            {ayar.siteAdi}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 68,
              color: "#17211B",
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Doğanın kendi eczanesinden, sofrana.
          </div>
          <div style={{ fontSize: 30, color: "#5C665C", maxWidth: 820 }}>
            Bitkisel yağlar, doğal takviyeler ve el yapımı cilt bakım ürünleri.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              background: "#1F5138",
              color: "#FFFFFF",
              fontSize: 26,
              padding: "14px 28px",
              borderRadius: 8,
            }}
          >
            WhatsApp&apos;tan sipariş
          </div>
          <div style={{ fontSize: 26, color: "#A8681C" }}>
            Küçük partiler hâlinde hazırlanır
          </div>
        </div>
      </div>
    ),
    size,
  );
}
