import { ImageResponse } from "next/og";
import { loraBold, ogFonts } from "@/lib/ogFont";
import { supplyDrive } from "@/content/supplies";

/**
 * THE SHARE CARD FOR THE COST PAGE.
 *
 * This page exists to win a search — "how much does a medical mission trip
 * cost" — but the moment somebody finds it, the next thing they do is paste
 * the link into a group chat or a church Facebook page. That share is worth
 * more than the search ranking, and a link with no card is a link nobody
 * clicks.
 *
 * The card leads with the numbers, because the numbers ARE the story. Every
 * other organisation answers this question with a range. This one answers it
 * with a price list, so the card shows actual line items pulled live from
 * content/supplies.ts — if Don changes what a Bible costs, the card changes.
 */

export const runtime = "nodejs";
export const alt =
  "What a medical mission trip actually costs — the real line items";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DEEP = "#0a3d40";
const GOLD = "#c9962e";


const money = (n: number) =>
  n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;

export default async function Image() {
  const lora = await loraBold();
  const font = lora ? "Lora" : undefined;

  // Four real items, cheapest first — the cheap ones are the persuasive ones.
  const picks = [...supplyDrive.items]
    .filter((i) => i.unitCost > 0)
    .sort((a, b) => a.unitCost - b.unitCost)
    .slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: DEEP,
          padding: "56px 60px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(65% 75% at 90% 4%, rgba(201,150,46,0.26), transparent 60%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 4,
              color: GOLD,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            No ranges · No estimates · Real receipts
          </div>
          <div
            style={{ display: "flex", width: 92, height: 5, background: GOLD, marginTop: 18, marginBottom: 22 }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 62,
              lineHeight: 1.08,
              color: "#fff",
              fontWeight: 700,
              letterSpacing: -1.4,
              maxWidth: 900,
              fontFamily: font,
            }}
          >
            What a medical mission trip actually costs
          </div>
        </div>

        {/* The price list. This is the whole argument in four rows. */}
        <div style={{ display: "flex", gap: 14 }}>
          {picks.map((i) => (
            <div
              key={i.id}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: "20px 22px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 40,
                  fontWeight: 700,
                  color: GOLD,
                  fontFamily: font,
                }}
              >
                {money(i.unitCost)}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 19,
                  color: "rgba(255,255,255,0.82)",
                  marginTop: 6,
                }}
              >
                {i.name}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 23, color: "rgba(255,255,255,0.82)" }}>
            Don &amp; Patti Nichols · Belize medical mission
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            donandpatti.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: ogFonts(lora),
    },
  );
}
