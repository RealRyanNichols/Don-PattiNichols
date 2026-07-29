import { ImageResponse } from "next/og";
import { fetchDbPost, dbAuthorName } from "@/lib/postsDb";
import { getPost } from "@/content/posts";
import { storageImage } from "@/lib/storageImage";
import { imageSize } from "@/lib/imageSize";
import { enrichPost } from "@/lib/postEnrich";

/**
 * THE SHARE CARD — built from whatever Don actually submitted.
 *
 * Facebook is this site's biggest source of traffic by a wide margin, so the
 * picture that appears when somebody shares a story is doing more work than
 * almost anything else on the page. Don will never open a design tool. This
 * reads his post — the photograph, its shape, the title, the tag, how many
 * pictures he attached, what the story turned out to be about — and composes
 * a card to match.
 *
 * IT ADAPTS ON FOUR AXES:
 *
 *   1. THE SHAPE OF HIS PHOTO. A wide landscape becomes the whole card with
 *      the title over a scrim. A square or portrait sits in a panel with the
 *      title beside it, at its own proportions. Nothing is ever cropped
 *      through a face to fit a layout that was decided in advance.
 *   2. THE SUBJECT. The eyebrow carries what the story is about and where it
 *      happened — "BIBLES · MALAWI" — worked out by the same enrichment that
 *      builds the rest of the article.
 *   3. HOW MUCH IS INSIDE. If he attached a pile of photographs, the card says
 *      so, because "+55 photographs" is a reason to click.
 *   4. TITLE LENGTH. Type steps down so a long title never overflows.
 *
 * Every branch degrades safely. If the photo's dimensions can't be read, it
 * uses the panel layout. If there's no photo, it's a clean typographic card
 * with the gold cross. If the font won't load, it renders in the fallback.
 * A worse card always beats a broken one.
 */

export const runtime = "nodejs";
export const alt = "A story from Don & Patti Nichols";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DEEP = "#0a3d40";
const GOLD = "#c9962e";
const SAND = "#faf6ef";

/**
 * Lora, the site's headline serif.
 *
 * Plain fetch — no `next: { revalidate }`. That option inside an image route
 * silently failed on Vercel and the card kept rendering in the fallback sans.
 * The old User-Agent matters too: Google Fonts serves woff2 to modern
 * browsers, which the renderer cannot parse. An old UA gets a .ttf.
 */
async function loraBold(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Lora:wght@700&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" } },
    ).then((r) => r.text());
    const url = css.match(/https:\/\/[^)]+\.ttf/)?.[0];
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { slug: string } }) {
  const stat = getPost(params.slug);
  const db = stat ? null : await fetchDbPost(params.slug);

  const title = stat?.title ?? db?.title ?? "Don & Patti Nichols";
  const author = db ? dbAuthorName(db.author_handle) : "Don & Patti Nichols";
  const photoCount = db?.photo_urls?.length ?? 0;
  const rawPhoto = db?.photo_urls?.[0] ?? null;

  // What the story is about and where — from the same logic that builds the
  // article, so the card and the page always agree.
  const enrich = db ? enrichPost(db) : null;
  const parts = [
    db?.tags?.[0] || enrich?.item?.name,
    enrich?.album?.title,
  ].filter(Boolean) as string[];
  const eyebrow = parts.length ? parts.join(" · ") : "A story from the field";

  const [lora, dim] = await Promise.all([
    loraBold(),
    rawPhoto ? imageSize(storageImage(rawPhoto, 400, 70)) : Promise.resolve(null),
  ]);

  // A properly wide photograph earns the whole card. Anything squarer sits in
  // a panel, because cropping a portrait to 1.91:1 decapitates people.
  const wide = !!dim && dim.ratio >= 1.4;
  const photo = rawPhoto
    ? storageImage(rawPhoto, wide ? 1200 : 600, 80)
    : null;

  const font = lora ? "Lora" : undefined;
  const titleSize = title.length > 62 ? 50 : title.length > 44 ? 58 : 68;

  /* ---------------- WIDE PHOTO: it becomes the card ---------------- */
  if (photo && wide) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: DEEP }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              background:
                "linear-gradient(to top, rgba(10,61,64,0.97) 12%, rgba(10,61,64,0.80) 42%, rgba(10,61,64,0.18) 78%)",
            }}
          />
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
            <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: GOLD, fontWeight: 700, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div style={{ display: "flex", width: 92, height: 5, background: GOLD, marginTop: 18, marginBottom: 24 }} />
            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                lineHeight: 1.1,
                color: "#fff",
                fontWeight: 700,
                letterSpacing: -1.2,
                maxWidth: 980,
                fontFamily: font,
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 26, alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.85)" }}>by {author}</div>
              {photoCount > 3 && (
                <div style={{ display: "flex", fontSize: 20, color: GOLD }}>
                  · {photoCount} photographs
                </div>
              )}
            </div>
            <div style={{ display: "flex", fontSize: 18, letterSpacing: 3, color: "rgba(255,255,255,0.5)", marginTop: 10, textTransform: "uppercase", fontWeight: 700 }}>
              donandpatti.com
            </div>
          </div>
        </div>
      ),
      { ...size, fonts: lora ? [{ name: "Lora", data: lora, style: "normal" as const, weight: 700 as const }] : undefined },
    );
  }

  /* -------- SQUARE / PORTRAIT / NO PHOTO: panel beside the words -------- */
  // Give the panel the photo's own proportions instead of forcing a square.
  const panelW = 400;
  const panelH = dim ? Math.round(Math.min(500, Math.max(300, panelW / dim.ratio))) : 400;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: DEEP, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "radial-gradient(60% 70% at 88% 6%, rgba(201,150,46,0.28), transparent 62%)",
          }}
        />

        {/* Without a photograph the cross carries the brand instead. */}
        {!photo && (
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
            justifyContent: "space-between",
            padding: "58px 52px",
            width: photo ? 700 : 1200,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: GOLD, fontWeight: 700, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div style={{ display: "flex", width: 92, height: 5, background: GOLD, marginTop: 20, marginBottom: 28 }} />
            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                lineHeight: 1.12,
                color: "#fff",
                fontWeight: 700,
                letterSpacing: -1.2,
                fontFamily: font,
              }}
            >
              {title}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.82)" }}>by {author}</div>
              {photoCount > 3 && (
                <div style={{ display: "flex", fontSize: 20, color: GOLD }}>· {photoCount} photographs</div>
              )}
            </div>
            <div style={{ display: "flex", fontSize: 18, letterSpacing: 3, color: "rgba(255,255,255,0.45)", marginTop: 12, textTransform: "uppercase", fontWeight: 700 }}>
              donandpatti.com
            </div>
          </div>
        </div>

        {photo && (
          <div style={{ display: "flex", width: 500, height: "100%", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                width: panelW,
                height: panelH,
                borderRadius: 22,
                overflow: "hidden",
                border: `6px solid ${SAND}`,
                boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt=""
                width={panelW}
                height={panelH}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          </div>
        )}
      </div>
    ),
    { ...size, fonts: lora ? [{ name: "Lora", data: lora, style: "normal" as const, weight: 700 as const }] : undefined },
  );
}
