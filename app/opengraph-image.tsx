import { ImageResponse } from "next/og";
import { loraBold, ogFonts } from "@/lib/ogFont";
import { historyStats, countriesServed } from "@/content/history";
import { totalPhotos } from "@/content/albums";

export const runtime = "nodejs";
export const alt =
  "Don & Patti Nichols — Medical Care for the Body. Hope for the Soul.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The site-wide share card. Prerendered at build, so it deliberately makes no
 * network request — the font comes off disk and the art is vector. It carries
 * the three numbers that say who these people are: years, countries, and
 * photographs, all derived from Don's own record.
 */
export default async function OgImage() {
  const lora = await loraBold();
  const font = lora ? "Lora" : "Georgia, serif";
  const stats = [
    { n: `${new Date().getFullYear() - historyStats.firstYear + 1}`, l: "years" },
    { n: `${countriesServed.length}`, l: "countries" },
    { n: `${totalPhotos}`, l: "photographs" },
    { n: "$0", l: "charged to any patient" },
  ];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 64px",
        background: "linear-gradient(135deg, #0a3d40 0%, #0e6b70 100%)",
        color: "white",
        position: "relative",
      }}
    >
      <svg
        width="420"
        height="420"
        viewBox="0 0 24 24"
        fill="rgba(255,255,255,0.06)"
        style={{ position: "absolute", right: -60, top: -80 }}
      >
        <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 22,
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
            display: "flex",
            marginTop: 30,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 1000,
            fontFamily: font,
          }}
        >
          Medical Care for the Body.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#c9962e",
            fontFamily: font,
          }}
        >
          Hope for the Soul.
        </div>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {stats.map((s) => (
          <div
            key={s.l}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "18px 22px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 40,
                fontWeight: 700,
                color: "#c9962e",
                fontFamily: font,
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 19,
                color: "rgba(255,255,255,0.82)",
                marginTop: 4,
              }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>,
    { ...size, fonts: ogFonts(lora) },
  );
}
