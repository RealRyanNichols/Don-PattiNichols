import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { loraBold, ogFonts } from "@/lib/ogFont";
import { site } from "@/lib/site";
import { malawiCampaign, campaignNeed } from "@/content/campaigns";

/**
 * MALAWI WELL POSTER — a printable 8.5×11 sheet (1275×1650 at 150 dpi) for
 * the church lobby, the bulletin board, or the screen before a service.
 *
 * Don said he will ask "at my church and others as well." One sheet with a QR
 * code replaces a slide deck: a scan lands on the campaign page, where the
 * gift is marked for Malawi automatically and the Wings of Promise mailing
 * address is one tap away.
 *
 * Typographic on purpose — no photograph to fail, nothing that could be
 * mistaken for this village. Every line is either Don's figure or a plain
 * statement of who receives the money.
 */
export const runtime = "nodejs";

const DEEP = "#0a3d40";
const GOLD = "#c9962e";
const INK = "#1c2a33";

export async function GET() {
  const well = campaignNeed("well");
  const target = `${site.url}${malawiCampaign.path}?from=poster`;
  const [lora, qr] = await Promise.all([
    loraBold(),
    QRCode.toDataURL(target, {
      margin: 1,
      width: 460,
      color: { dark: DEEP, light: "#ffffff" },
    }).catch(() => null),
  ]);
  const font = lora ? "Lora" : undefined;
  const [addr1, addr2, addr3] = malawiCampaign.recipient.lines;

  const res = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#faf6ef",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: DEEP,
          padding: "90px 90px 70px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            color: GOLD,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Malawi · Asking God publicly
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 92,
            lineHeight: 1.04,
            color: "#fff",
            fontWeight: 700,
            fontFamily: font,
            letterSpacing: -2,
          }}
        >
          A water well for a village
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            lineHeight: 1.04,
            color: GOLD,
            fontWeight: 700,
            fontFamily: font,
            letterSpacing: -2,
          }}
        >
          still drinking muddy water.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 32,
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.85)",
            maxWidth: 1000,
          }}
        >
          And a maize mill that funds a soccer team sharing the Gospel at
          halftime, village to village.
        </div>
      </div>

      <div
        style={{ display: "flex", flex: 1, padding: "70px 90px 80px", gap: 56 }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: 120,
              lineHeight: 1,
              color: DEEP,
              fontWeight: 700,
              fontFamily: font,
            }}
          >
            ${well.costUsd!.toLocaleString("en-US")}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontSize: 30,
              color: "rgba(28,42,51,0.8)",
            }}
          >
            the bore hole, in US dollars, from the bid
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 54,
              fontSize: 24,
              letterSpacing: 5,
              color: "#0e6b70",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Or mail a check to
          </div>
          {[addr1, addr2, addr3].map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                marginTop: i === 0 ? 14 : 4,
                fontSize: i === 0 ? 40 : 34,
                color: INK,
                fontWeight: i === 0 ? 700 : 400,
                // Never pass `fontFamily: undefined` — Satori calls .split()
                // on it and the whole poster fails to render.
                ...(i === 0 && font ? { fontFamily: font } : {}),
              }}
            >
              {line}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 28,
              color: INK,
            }}
          >
            {`Memo: “${well.checkMemo}”`}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "auto",
              fontSize: 26,
              color: "rgba(28,42,51,0.7)",
            }}
          >
            {`Overseen by ${malawiCampaign.overseer.name}, Maplecrest Baptist Church, Vidor, Tx.`}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 26,
              letterSpacing: 4,
              color: GOLD,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Don &amp; Patti Nichols · donandpatti.com
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 440,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 18,
              background: "#fff",
              borderRadius: 26,
              border: `3px solid ${DEEP}`,
            }}
          >
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt="" width={380} height={380} />
            ) : (
              <div style={{ display: "flex", width: 380, height: 380 }} />
            )}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 24,
              color: DEEP,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Scan to give
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 8,
              fontSize: 22,
              color: "rgba(28,42,51,0.7)",
              textAlign: "center",
            }}
          >
            Your gift is marked for Malawi automatically
          </div>
        </div>
      </div>
    </div>,
    { width: 1275, height: 1650, fonts: ogFonts(lora) },
  );
  res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.headers.set(
    "Content-Disposition",
    `inline; filename="malawi-water-well-poster.png"`,
  );
  return res;
}
