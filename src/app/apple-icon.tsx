import { ImageResponse } from "next/og";

/** iPhone/iPad ana ekran simgesi. Logo gelince `apple-icon.png` ile değiştir. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <div
          style={{
            width: 92,
            height: 92,
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
