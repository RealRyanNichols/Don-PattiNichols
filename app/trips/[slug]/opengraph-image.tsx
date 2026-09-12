import { getTrip, tripCountFor } from "@/content/trips";
import { albumBySlug } from "@/content/albums";
import { ogCard, photoDataUrl, OG_SIZE } from "@/lib/ogCard";

export const runtime = "nodejs";
export const alt = "A mission trip from Don & Patti Nichols' record";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTrip(slug);
  const album = trip?.albumSlug ? albumBySlug(trip.albumSlug) : undefined;
  const cover = await photoDataUrl(album?.cover);
  const n = trip ? tripCountFor(trip) : 0;
  return ogCard({
    eyebrow: trip ? `${trip.dateLabel} · ${trip.location}` : "Mission trips",
    title: trip?.title ?? "Mission Trips",
    line: trip?.summary,
    meta: n > 1 ? `${n} trips to this field` : undefined,
    photo: cover,
  });
}
