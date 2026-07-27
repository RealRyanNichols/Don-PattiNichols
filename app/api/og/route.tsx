import { ImageResponse } from "next/og";

export const runtime = "edge";

const allowedImages = new Set([
  "/images/team.jpg",
  "/images/anchor-mission-sign.jpg",
  "/images/trunks-packed.jpg",
  "/images/clinic-supplies-staged.jpg",
  "/images/flight-to-belize.jpg",
  "/images/clinic-setup.jpg",
  "/images/belize-2026-01.jpg",
  "/images/belize-2026-03.jpg",
  "/images/belize-2026-06.jpg",
  "/images/belize-2026-09.jpg",
]);

function clean(value: string | null, fallback: string, max: number) {
  return (value || fallback).replace(/\s+/g, " ").trim().slice(0, max);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const title = clean(searchParams.get("title"), "Don & Patti Nichols", 110);
  const description = clean(
    searchParams.get("description"),
    "Medical care for the body. Hope for the soul.",
    190,
  );
  const eyebrow = clean(searchParams.get("eyebrow"), "Mission Work & Ministry", 70);
  const requestedImage = searchParams.get("image") || "/images/team.jpg";
  const image = allowedImages.has(requestedImage) ? requestedImage : "/images/team.jpg";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#0a3d40",
          color: "#faf6ef",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={new URL(image, origin).toString()}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(5,39,42,0.98) 0%, rgba(5,39,42,0.94) 48%, rgba(5,39,42,0.58) 72%, rgba(5,39,42,0.25) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "790px",
            padding: "58px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#e1b34f",
            }}
          >
            {eyebrow}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: title.length > 64 ? 48 : 58,
                fontWeight: 700,
                lineHeight: 1.06,
                textShadow: "0 3px 22px rgba(0,0,0,0.3)",
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                maxWidth: "720px",
                fontFamily: "Arial, sans-serif",
                fontSize: 23,
                lineHeight: 1.35,
                color: "rgba(250,246,239,0.88)",
              }}
            >
              {description}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Arial, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            <span style={{ color: "#e1b34f", marginRight: 12 }}>✦</span>
            DONANDPATTI.COM
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable",
      },
    },
  );
}
