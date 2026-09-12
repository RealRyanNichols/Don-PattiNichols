import { ImageResponse } from "next/og";
import { loraBold, ogFonts } from "@/lib/ogFont";
import { photoDataUrl } from "@/lib/ogCard";
import { supplyDrive } from "@/content/supplies";

/**
 * "I GAVE" SHARE CARD — a 1080×1080 square for Facebook and Instagram that
 * says what somebody sent: "I sent 10 Bibles to Belize."
 *
 *   /api/share-card?item=bible&qty=10&name=Ryan
 *
 * Nearly everyone who supports this mission came because a friend shared
 * something. This is the something. No fake numbers: the price line is Don's
 * published unit cost times the quantity the person chose, and the name is
 * optional and never stored.
 */
export const runtime = "nodejs";

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

/** How a quantity of an item reads in a sentence. */
function phrase(itemId: string, qty: number): string {
  const one = qty === 1;
  switch (itemId) {
    case "bible":
      return one ? "a Bible" : `${qty} Bibles`;
    case "hygiene-kit":
      return one ? "a hygiene kit" : `${qty} hygiene kits`;
    case "reading-glasses":
      return one ? "a pair of reading glasses" : `${qty} pairs of reading glasses`;
    case "sunglasses":
      return one ? "a pair of sunglasses" : `${qty} pairs of sunglasses`;
    case "tracts":
      return one ? "the Gospel tracts for a whole trip" : `${qty} bundles of Gospel tracts`;
    case "pastor-gift":
      return one ? "a gift set for a village pastor and his wife" : `${qty} pastor gift sets`;
    case "trunk":
      return one ? "a ministry trunk" : `${qty} ministry trunks`;
    case "baggage":
      return one ? "a trunk of supplies onto the plane" : `${qty} trunks of supplies onto the plane`;
    case "customs":
      return one ? "a share of the customs fund" : `${qty} shares of the customs fund`;
    case "missionary":
      return one ? "a missionary" : `${qty} missionaries`;
    default:
      return `${qty} items`;
  }
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const item =
    supplyDrive.items.find((i) => i.id === q.get("item")) ??
    supplyDrive.items[0];
  const qty = Math.min(999, Math.max(1, Math.round(Number(q.get("qty")) || 1)));
  const name = (q.get("name") ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
  const verb = item.id === "baggage" ? "flew" : item.id === "missionary" ? "sent" : "sent";
  const total = Math.round(qty * item.unitCost * 100) / 100;

  const [lora, photo] = await Promise.all([
    loraBold(),
    photoDataUrl(item.photo, 1100),
  ]);
  const font = lora ? "Lora" : undefined;
  const headline = `${name ? name : "I"} ${verb} ${phrase(item.id, qty)} to Belize.`;
  const headSize = headline.length > 60 ? 58 : headline.length > 40 ? 68 : 80;

  const res = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
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
            "linear-gradient(to top, rgba(10,61,64,0.98) 0%, rgba(10,61,64,0.86) 45%, rgba(10,61,64,0.25) 80%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            letterSpacing: 5,
            color: "#c9962e",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#c9962e">
            <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
          </svg>
          Fill the Trunks
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: headSize,
            lineHeight: 1.1,
            color: "#fff",
            fontWeight: 700,
            fontFamily: font,
            letterSpacing: -1.5,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 30,
            lineHeight: 1.35,
            color: "rgba(255,255,255,0.86)",
          }}
        >
          {fmt(item.unitCost)} each · {fmt(total)} total · given away free
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 54,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Don &amp; Patti Nichols · Belize medical mission
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              color: "rgba(255,255,255,0.5)",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            donandpatti.com/sponsor
          </div>
        </div>
      </div>
    </div>,
    { width: 1080, height: 1080, fonts: ogFonts(lora) },
  );
  res.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.headers.set(
    "Content-Disposition",
    `inline; filename="i-gave-${item.id}-${qty}.png"`,
  );
  return res;
}
