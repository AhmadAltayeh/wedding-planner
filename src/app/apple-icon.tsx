import { ImageResponse } from "next/og";

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
          background: "linear-gradient(145deg, #3d5c54 0%, #2a423c 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#faf8f4",
            fontFamily: "Georgia, serif",
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 600, letterSpacing: -2 }}>A&N</span>
          <span style={{ fontSize: 18, color: "#e5dcc8", marginTop: 4 }}>Wedding</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
