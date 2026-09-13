import { ImageResponse } from "next/og";
import { loraBold, ogFonts } from "./ogFont";
import { photo } from "@/content/albums";

/**
 * ONE SHARE-CARD FACTORY for every page that is not a blog post.
 *
 * Albums, trips, guides, tools and the hub pages all share a layout: a
 * photograph from the archive under a deep-teal scrim, an eyebrow, a title in
 * Lora, a support line, and the wordmark. When the photograph cannot be
 * fetched — Drive hiccup, timeout, anything — the card renders the typographic
 * version with the gold cross instead. A worse card always beats a broken one,
 * and a broken card is what Facebook shows as a blank grey box.
 *
 * The photograph is fetched HERE, with a timeout, and passed to Satori as a
 * data URL. Letting Satori fetch a remote <img> itself gives it no timeout and
 * no fallback, and a single slow response would hold the whole render.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const DEEP = "#0a3d40";
const GOLD = "#c9962e";

/** Fetch a Drive photograph as a data URL, or null if anything goes wrong. */
export async function photoDataUrl(
  id: string | null | undefined,
  width = 1200,
  timeoutMs = 4500,
): Promise<string | null> {
  if (!id) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(photo(id, width), {
      signal: ctrl.signal,
      // Cards are re-rendered rarely; the picture never changes.
      next: { revalidate: 86400 },
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    if (!type.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) return null;
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export type OgCardOptions = {
  eyebrow: string;
  title: string;
  /** One supporting line under the title. */
  line?: string;
  /** Small print, e.g. "147 photographs". */
  meta?: string;
  /** A data URL from photoDataUrl(), or null for the typographic card. */
  photo?: string | null;
  /**
   * Show the photograph as a framed inset beside the text instead of
   * full-bleed behind it. For the small iCloud exports in the archive
   * (300–480px): stretched across 1200px they blur, but framed at close to
   * their real size they stay crisp and the words stay on the card.
   */
  inset?: boolean;
};

/** Render the card. Always resolves — never throws for a missing font/photo. */
export async function ogCard(opts: OgCardOptions) {
  const lora = await loraBold();
  const font = lora ? "Lora" : undefined;

  if (opts.inset && opts.photo) return insetCard(opts, lora, font);

  const titleSize =
    opts.title.length > 70 ? 46 : opts.title.length > 48 ? 54 : 64;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: DEEP,
      }}
    >
      {opts.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={opts.photo}
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
          background: opts.photo
            ? "linear-gradient(to top, rgba(10,61,64,0.97) 14%, rgba(10,61,64,0.82) 46%, rgba(10,61,64,0.22) 82%)"
            : "radial-gradient(60% 70% at 88% 6%, rgba(201,150,46,0.28), transparent 62%)",
        }}
      />
      {!opts.photo && (
        <svg
          width="380"
          height="380"
          viewBox="0 0 24 24"
          fill="rgba(255,255,255,0.05)"
          style={{ position: "absolute", right: -40, top: -60 }}
        >
          <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
        </svg>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "56px 58px",
          width: "100%",
          height: "100%",
        }}
      >
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
          {opts.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            width: 92,
            height: 5,
            background: GOLD,
            marginTop: 18,
            marginBottom: 22,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            lineHeight: 1.1,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: -1.2,
            maxWidth: 1000,
            fontFamily: font,
          }}
        >
          {opts.title}
        </div>
        {opts.line ? (
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 26,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.86)",
              maxWidth: 980,
            }}
          >
            {opts.line}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            marginTop: 26,
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Don &amp; Patti Nichols
          </div>
          {opts.meta ? (
            <div style={{ display: "flex", fontSize: 20, color: GOLD }}>
              · {opts.meta}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: 17,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              fontWeight: 700,
              marginLeft: "auto",
            }}
          >
            donandpatti.com
          </div>
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: ogFonts(lora) },
  );
}

/**
 * Text on the left, a framed photograph on the right. Used when the picture
 * is too small to fill the card but too good to leave off it.
 */
function insetCard(
  opts: OgCardOptions,
  lora: Awaited<ReturnType<typeof loraBold>>,
  font: string | undefined,
) {
  const titleSize =
    opts.title.length > 40 ? 44 : opts.title.length > 26 ? 52 : 60;
  const PHOTO = 404;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: DEEP,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "radial-gradient(60% 70% at 88% 6%, rgba(201,150,46,0.28), transparent 62%)",
        }}
      />
      {/* Text column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "56px 40px 56px 58px",
          width: 1200 - PHOTO - 58 - 40,
          height: "100%",
        }}
      >
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
          {opts.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            width: 92,
            height: 5,
            background: GOLD,
            marginTop: 18,
            marginBottom: 22,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            lineHeight: 1.1,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: -1,
            fontFamily: font,
          }}
        >
          {opts.title}
        </div>
        {opts.line ? (
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 24,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.86)",
            }}
          >
            {opts.line}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            marginTop: 26,
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Don &amp; Patti Nichols
          </div>
          {opts.meta ? (
            <div style={{ display: "flex", fontSize: 20, color: GOLD }}>
              · {opts.meta}
            </div>
          ) : null}
        </div>
      </div>
      {/* Photo column */}
      <div
        style={{
          position: "absolute",
          right: 58,
          top: 56,
          bottom: 56,
          width: PHOTO,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={opts.photo ?? undefined}
          alt=""
          width={PHOTO}
          height={PHOTO}
          style={{
            width: PHOTO,
            height: PHOTO,
            objectFit: "cover",
            borderRadius: 24,
            border: "6px solid rgba(255,255,255,0.92)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 17,
            letterSpacing: 3,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          donandpatti.com
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: ogFonts(lora) },
  );
}
