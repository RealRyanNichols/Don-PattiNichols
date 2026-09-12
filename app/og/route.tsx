import { albums } from "@/content/albums";
import { supplyDrive } from "@/content/supplies";
import { ogCard, photoDataUrl } from "@/lib/ogCard";

/**
 * ONE SHARE-CARD ROUTE for every static page that has no opengraph-image.tsx
 * of its own — /give, /belize, /faq, /resources, the tools, and so on.
 *
 *   /og?e=Eyebrow&t=Title&l=Support line&m=meta&p=<drive id>
 *
 * Kept OUT of /api on purpose: robots.txt disallows /api/, and a share image a
 * crawler is told not to fetch is a share image that never appears.
 *
 * Only photographs already published in the archive can be requested, and
 * every text field is clipped, so the route cannot be used to put a stranger's
 * words or picture on a card carrying the Nichols name.
 */
export const runtime = "nodejs";

const KNOWN_PHOTOS = new Set<string>([
  ...albums.flatMap((a) => a.photos),
  ...supplyDrive.items.map((i) => i.photo),
]);

const clip = (v: string | null, max: number, fallback = "") =>
  (v ?? fallback).replace(/\s+/g, " ").trim().slice(0, max);

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const photoId = q.get("p");
  const photo =
    photoId && KNOWN_PHOTOS.has(photoId) ? await photoDataUrl(photoId) : null;

  const res = await ogCard({
    eyebrow: clip(q.get("e"), 48, "Don & Patti Nichols"),
    title: clip(q.get("t"), 96, "Medical Care for the Body. Hope for the Soul."),
    line: clip(q.get("l"), 160) || undefined,
    meta: clip(q.get("m"), 40) || undefined,
    photo,
  });
  // Cards change only when the code does; let the CDN keep them for a week.
  res.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
  );
  return res;
}
