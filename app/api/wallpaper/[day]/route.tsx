import { ImageResponse } from "next/og";
import { loraBold, ogFonts } from "@/lib/ogFont";
import { photoDataUrl } from "@/lib/ogCard";
import { prayerDays } from "@/content/prayer";

/**
 * SCRIPTURE WALLPAPERS — a 1080×1920 lock screen for each day of the prayer
 * guide: the day's verse over one of Don and Patti's own photographs.
 *
 * Something a supporter can set on their phone the week a team is on the
 * ground and see thirty times a day. Rendered on request; the photograph is
 * fetched with a timeout and the card degrades to the deep-teal gradient if it
 * cannot be reached.
 */
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ day: string }> },
) {
  const n = Number((await params).day);
  const day = prayerDays.find((d) => d.day === n) ?? prayerDays[0];
  const [lora, photo] = await Promise.all([
    loraBold(),
    photoDataUrl(day.photo, 1200),
  ]);
  const font = lora ? "Lora" : undefined;
  const verseSize = day.verse.text.length > 150 ? 46 : 54;

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
            "linear-gradient(to top, rgba(10,61,64,0.98) 0%, rgba(10,61,64,0.90) 38%, rgba(10,61,64,0.55) 62%, rgba(10,61,64,0.35) 100%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          padding: "0 84px 220px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            color: "#c9962e",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Day {day.day} · {day.title}
        </div>
        <div
          style={{
            display: "flex",
            width: 110,
            height: 6,
            background: "#c9962e",
            marginTop: 26,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: verseSize,
            lineHeight: 1.32,
            color: "#fff",
            fontWeight: 700,
            fontFamily: font,
            letterSpacing: -0.5,
          }}
        >
          “{day.verse.text}”
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 30,
            letterSpacing: 5,
            color: "rgba(255,255,255,0.85)",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {day.verse.ref}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 70,
            fontSize: 22,
            letterSpacing: 4,
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          donandpatti.com
        </div>
      </div>
    </div>,
    { width: 1080, height: 1920, fonts: ogFonts(lora) },
  );
  res.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
  );
  res.headers.set(
    "Content-Disposition",
    `inline; filename="prayer-wallpaper-day-${day.day}.png"`,
  );
  return res;
}
