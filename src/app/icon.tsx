import { ImageResponse } from "next/og";

/**
 * Tarayıcı sekmesi ve yer imi simgesi.
 *
 * Logo dosyası gelene kadar markadan türetilen geçici simge.
 * Değiştirmek için: bu dosyayı sil, yerine `src/app/icon.png` koy
 * (512x512, şeffaf arka plan). Next.js kendiliğinden algılar.
 */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1F5138",
          borderRadius: 14,
        }}
      >
        {/* Yaprak: bir köşesi sivri, karşı köşesi yuvarlak kare */}
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
    ),
    size,
  );
}
