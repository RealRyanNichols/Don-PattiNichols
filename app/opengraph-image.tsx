import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Don & Patti Nichols — Medical Care for the Body. Hope for the Soul.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share image (Facebook, X, iMessage). Swap for a real photo version in phase 2. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a3d40 0%, #0e6b70 100%)",
          color: "white",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#c9962e",
            fontWeight: 700,
          }}
        >
          Don &amp; Patti Nichols · Belize Medical Missions
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 74,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          Medical Care for the Body.
        </div>
        <div
          style={{
            fontSize: 74,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#c9962e",
          }}
        >
          Hope for the Soul.
        </div>
        <div style={{ marginTop: 36, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>
          Free clinics · Bibles · Prayer — every patient served free of charge
        </div>
      </div>
    ),
    { ...size }
  );
}
