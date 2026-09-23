/**
 * PRINT-READY MERCH DESIGNS for the Printify shop.
 *
 *   npx tsx scripts/merch-designs.tsx
 *
 * Writes transparent PNGs to merch/designs/ at 4500×5400 — Printify's
 * recommended size for a full-front T-shirt print (15×18 in at 300 DPI).
 * Each design comes in two colourways: `-dark` (white and gold ink, for navy,
 * teal, black or heather-dark shirts) and `-light` (deep-teal and gold ink,
 * for white, sand or natural shirts).
 *
 * Rendered with the same Satori engine and the same Lora face as every share
 * card on the site, so the shirts match the website. Nothing is fetched from
 * the network; a design is text and simple shapes only.
 *
 * WORDING RULES — same as the site:
 *   • "Medical Care for the Body. Hope for the Soul." is Don's own headline.
 *   • Scripture is quoted from the verse the site already carries
 *     (Matthew 28:19) or cited by reference only.
 *   • No design claims where the profit goes. That is set once, on the
 *     /store page, after Don decides it (see docs/PRINTIFY-SETUP.md).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { loraBold, ogFonts } from "../lib/ogFont";

const W = 4500;
const H = 5400;
const DEEP = "#0a3d40";
const GOLD = "#c9962e";

type Ink = { main: string; accent: string; soft: string };
const INKS: Record<"dark" | "light", Ink> = {
  // For dark shirts: white type, gold accents.
  dark: { main: "#ffffff", accent: GOLD, soft: "rgba(255,255,255,0.78)" },
  // For light shirts: deep teal type, and the darker gold the site's charts
  // use — brand gold #c9962e falls under 3:1 contrast on a white shirt.
  light: { main: DEEP, accent: "#a8741a", soft: "rgba(10,61,64,0.78)" },
};

/** The gold cross from the site's icon, as a plain two-bar shape. */
function Cross({ size, color }: { size: number; color: string }) {
  const bar = size * 0.2;
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: size * 0.66,
        height: size,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: (size * 0.66 - bar) / 2,
          top: 0,
          width: bar,
          height: size,
          background: color,
          borderRadius: bar * 0.12,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: size * 0.26,
          width: size * 0.66,
          height: bar,
          background: color,
          borderRadius: bar * 0.12,
        }}
      />
    </div>
  );
}

/** A simple footlocker, drawn with boxes — the "Fill the Trunks" mark. */
function Trunk({ w, ink }: { w: number; ink: Ink }) {
  const h = w * 0.62;
  const line = w * 0.035;
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: w,
        height: h,
        border: `${line}px solid ${ink.main}`,
        borderRadius: w * 0.05,
      }}
    >
      {/* lid seam */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: h * 0.3,
          height: line,
          background: ink.main,
        }}
      />
      {/* latch */}
      <div
        style={{
          position: "absolute",
          left: w / 2 - w * 0.07,
          top: h * 0.3 - w * 0.05,
          width: w * 0.14,
          height: w * 0.14,
          background: ink.accent,
          borderRadius: w * 0.02,
        }}
      />
      {/* corner guards */}
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: h * 0.3 + line,
            bottom: 0,
            [i ? "right" : "left"]: w * 0.12,
            width: line,
            background: ink.main,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Satori lays out fragment children as a row no matter what the parent says,
 * so every stack is a real flex column.
 */
const COLUMN = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
} as const;

const wrap = (children: React.ReactNode) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 240,
    }}
  >
    {children}
  </div>
);

const designs: Record<
  string,
  { note: string; render: (ink: Ink, font?: string) => React.ReactNode }
> = {
  tagline: {
    note: "Don's headline. Full front. Pairs with a small cross on the sleeve.",
    render: (ink, font) =>
      wrap(
        <div style={COLUMN}>
          <Cross size={900} color={ink.accent} />
          <div
            style={{
              display: "flex",
              marginTop: 260,
              fontSize: 380,
              lineHeight: 1.05,
              color: ink.main,
              fontFamily: font,
              textAlign: "center",
              letterSpacing: -6,
            }}
          >
            Medical Care
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 380,
              lineHeight: 1.05,
              color: ink.main,
              fontFamily: font,
              letterSpacing: -6,
            }}
          >
            for the Body.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 90,
              fontSize: 380,
              lineHeight: 1.05,
              color: ink.accent,
              fontFamily: font,
              letterSpacing: -6,
            }}
          >
            Hope for the Soul.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 300,
              fontSize: 150,
              letterSpacing: 30,
              color: ink.soft,
              textTransform: "uppercase",
            }}
          >
            Don &amp; Patti Nichols
          </div>
        </div>,
      ),
  },
  "fill-the-trunks": {
    note: "The supply-drive mark. Works front or back.",
    render: (ink, font) =>
      wrap(
        <div style={COLUMN}>
          <div
            style={{
              display: "flex",
              fontSize: 520,
              lineHeight: 1,
              color: ink.main,
              fontFamily: font,
              letterSpacing: -8,
            }}
          >
            Fill the
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 700,
              lineHeight: 1,
              color: ink.accent,
              fontFamily: font,
              letterSpacing: -10,
            }}
          >
            Trunks
          </div>
          <div style={{ display: "flex", marginTop: 280 }}>
            <Trunk w={2200} ink={ink} />
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 300,
              fontSize: 170,
              letterSpacing: 16,
              color: ink.main,
              textTransform: "uppercase",
            }}
          >
            Bibles · Glasses · Hygiene Kits
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 60,
              fontSize: 150,
              letterSpacing: 24,
              color: ink.soft,
              textTransform: "uppercase",
            }}
          >
            Medical Missions
          </div>
        </div>,
      ),
  },
  "go-therefore": {
    note: "Matthew 28:19, the verse the site carries in every footer.",
    render: (ink, font) =>
      wrap(
        <div style={COLUMN}>
          <div
            style={{
              display: "flex",
              fontSize: 640,
              lineHeight: 1,
              color: ink.accent,
              fontFamily: font,
              letterSpacing: -10,
            }}
          >
            Go
          </div>
          {["therefore and make", "disciples of", "all nations."].map((l) => (
            <div
              key={l}
              style={{
                display: "flex",
                marginTop: 40,
                fontSize: 330,
                lineHeight: 1.08,
                color: ink.main,
                fontFamily: font,
                letterSpacing: -5,
              }}
            >
              {l}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              width: 900,
              height: 28,
              background: ink.accent,
              marginTop: 260,
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 200,
              fontSize: 170,
              letterSpacing: 30,
              color: ink.soft,
              textTransform: "uppercase",
            }}
          >
            Matthew 28:19
          </div>
        </div>,
      ),
  },
  "malawi-well": {
    note: "For the Malawi water well campaign. Cites John 4:14 by reference only.",
    render: (ink, font) =>
      wrap(
        <div style={COLUMN}>
          {/* A drop, drawn as a rotated rounded square. */}
          <div
            style={{
              display: "flex",
              width: 820,
              height: 820,
              background: ink.accent,
              borderRadius: "0 50% 50% 50%",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 360,
              fontSize: 420,
              lineHeight: 1.04,
              color: ink.main,
              fontFamily: font,
              letterSpacing: -6,
            }}
          >
            Clean Water.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 420,
              lineHeight: 1.04,
              color: ink.accent,
              fontFamily: font,
              letterSpacing: -6,
            }}
          >
            Living Water.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 300,
              fontSize: 160,
              letterSpacing: 26,
              color: ink.main,
              textTransform: "uppercase",
            }}
          >
            Malawi Water Well
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 60,
              fontSize: 140,
              letterSpacing: 24,
              color: ink.soft,
              textTransform: "uppercase",
            }}
          >
            John 4:14
          </div>
        </div>,
      ),
  },
};

async function main() {
  const out = path.join(process.cwd(), "merch", "designs");
  await mkdir(out, { recursive: true });
  const lora = await loraBold();
  const font = lora ? "Lora" : undefined;
  const only = process.argv[2];

  for (const [name, d] of Object.entries(designs)) {
    if (only && only !== name) continue;
    for (const tone of ["dark", "light"] as const) {
      const res = new ImageResponse(
        d.render(INKS[tone], font) as React.ReactElement,
        {
          width: W,
          height: H,
          fonts: ogFonts(lora),
        },
      );
      const file = path.join(out, `${name}-${tone}.png`);
      // Trim the empty canvas so Printify places the artwork at full size,
      // then give it a small transparent margin so nothing touches the edge.
      const png = await sharp(Buffer.from(await res.arrayBuffer()))
        .trim()
        .extend({
          top: 120,
          bottom: 120,
          left: 120,
          right: 120,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({ compressionLevel: 9 })
        .toBuffer();
      await writeFile(file, png);
      const meta = await sharp(png).metadata();
      console.log(`${file}  ${meta.width}×${meta.height}  — ${d.note}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
