import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { loraBold, ogFonts } from "@/lib/ogFont";
import { photoDataUrl } from "@/lib/ogCard";
import { site } from "@/lib/site";

/**
 * CHURCH POSTER — a printable 8.5×11 (1275×1650 at 150 dpi) sheet for the
 * lobby, the bulletin board, or the bulletin itself, with the church's name,
 * the date Don is speaking, and a QR code straight to the mission.
 *
 *   /api/church-poster?church=First+Baptist&when=Sunday,+Oct+4&time=10:30+AM
 *
 * Every field is optional and clipped. The QR code always points at
 * donandpatti.com/churches?from=poster so a scan lands on the page that
 * explains how a church partners, and the poster works even if nothing is
 * filled in.
 */
export const runtime = "nodejs";

const clip = (v: string | null, max: number) =>
  (v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const church = clip(q.get("church"), 48);
  const when = clip(q.get("when"), 40);
  const time = clip(q.get("time"), 24);
  const target = `${site.url}/churches?from=poster`;

  const [lora, photo, qr] = await Promise.all([
    loraBold(),
    photoDataUrl("1p64gHV_x_TstBKJXK3QCQaCPQ2RAII60", 1300),
    QRCode.toDataURL(target, {
      margin: 1,
      width: 420,
      color: { dark: "#0a3d40", light: "#ffffff" },
    }).catch(() => null),
  ]);
  const font = lora ? "Lora" : undefined;

  const res = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#faf6ef",
        position: "relative",
      }}
    >
      {/* Photograph band */}
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: 760,
          background: "#0a3d40",
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(to top, rgba(10,61,64,0.97) 0%, rgba(10,61,64,0.55) 50%, rgba(10,61,64,0.25) 100%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            height: "100%",
            padding: "0 80px 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 6,
              color: "#c9962e",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Don &amp; Patti Nichols · Belize Medical Missions
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 78,
              lineHeight: 1.05,
              color: "#fff",
              fontWeight: 700,
              fontFamily: font,
              letterSpacing: -1.5,
            }}
          >
            Medical Care for the Body.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              lineHeight: 1.05,
              color: "#c9962e",
              fontWeight: 700,
              fontFamily: font,
              letterSpacing: -1.5,
            }}
          >
            Hope for the Soul.
          </div>
        </div>
      </div>

      {/* Details */}
      <div
        style={{
          display: "flex",
          flex: 1,
          padding: "56px 80px 64px",
          gap: 48,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 5,
              color: "#0e6b70",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {church ? "Speaking at" : "Free medical clinics, Bibles & the Gospel"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: church.length > 28 ? 48 : 60,
              lineHeight: 1.1,
              color: "#1c2a33",
              fontWeight: 700,
              fontFamily: font,
            }}
          >
            {church || "Hear the story. See the receipts."}
          </div>
          {(when || time) && (
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 34,
                color: "#0a3d40",
                fontWeight: 700,
              }}
            >
              {[when, time].filter(Boolean).join(" · ")}
            </div>
          )}
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 26,
              lineHeight: 1.45,
              color: "rgba(28,42,51,0.8)",
              maxWidth: 640,
            }}
          >
            Thirteen years of mission work in Malawi, the Dominican Republic and
            Belize. Every patient served free. A Bible is $2.50. Reading glasses
            are 60¢. A missionary is $1,200. Every number is published.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              fontSize: 26,
              letterSpacing: 4,
              color: "#c9962e",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            donandpatti.com
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 400,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 16,
              background: "#fff",
              borderRadius: 24,
              border: "3px solid #0a3d40",
            }}
          >
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt="" width={340} height={340} />
            ) : (
              <div style={{ display: "flex", width: 340, height: 340 }} />
            )}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 22,
              color: "#0a3d40",
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Scan to give or follow
          </div>
        </div>
      </div>
    </div>,
    { width: 1275, height: 1650, fonts: ogFonts(lora) },
  );
  res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.headers.set(
    "Content-Disposition",
    `inline; filename="don-and-patti-church-poster.png"`,
  );
  return res;
}
