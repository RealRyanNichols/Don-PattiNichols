import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Don & Patti Nichols — Medical Care for the Body. Hope for the Soul.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // The team photo, bundled with the edge function at build time.
  const teamPhoto = await fetch(new URL("../public/images/team.jpg", import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a3d40",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          // @ts-expect-error — satori accepts ArrayBuffer image sources
          src={teamPhoto}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 620,
            height: 630,
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(100deg, #0a3d40 0%, #0a3d40 50%, rgba(10,61,64,0.6) 68%, rgba(10,61,64,0.15) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 40px 72px 72px",
            width: 660,
            color: "#faf6ef",
          }}
        >
          <div
            style={{
              display: "flex",
              textTransform: "uppercase",
              letterSpacing: 5,
              fontSize: 24,
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
              marginTop: 32,
              fontSize: 58,
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
              marginTop: 40,
              fontSize: 26,
              color: "rgba(250,246,239,0.85)",
            }}
          >
            Free medical clinics, Bibles, and the hope of Jesus Christ.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
