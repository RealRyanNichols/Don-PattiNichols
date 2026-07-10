import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Don & Patti Nichols — Medical Care for the Body. Hope for the Soul.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background:
            "linear-gradient(135deg, #0a3d40 0%, #0e6b70 100%)",
          color: "#faf6ef",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            textTransform: "uppercase",
            letterSpacing: 6,
            fontSize: 26,
            color: "#c9962e",
            fontWeight: 700,
          }}
        >
          Don &amp; Patti Nichols · Belize Medical Missions
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          <span>Medical Care for the Body.</span>
          <span style={{ color: "#c9962e", fontStyle: "italic" }}>Hope for the Soul.</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 28,
            color: "rgba(250,246,239,0.85)",
          }}
        >
          Free medical clinics, Bibles, and the hope of Jesus Christ in the villages of Belize.
        </div>
      </div>
    ),
    { ...size },
  );
}
