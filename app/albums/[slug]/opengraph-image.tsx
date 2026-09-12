import { albumBySlug } from "@/content/albums";
import { ogCard, photoDataUrl, OG_SIZE } from "@/lib/ogCard";

/**
 * The share card for a photo album: its own cover photograph, its title, and
 * how many pictures are inside. Rendered on first request and cached — never
 * at build time, so a slow photo fetch can never fail a deploy.
 */
export const runtime = "nodejs";
export const alt = "A photo album from Don & Patti Nichols' mission archive";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = albumBySlug(slug);
  const cover = await photoDataUrl(album?.cover);
  return ogCard({
    eyebrow: album ? `Photo album · ${album.era}` : "Photo archive",
    title: album?.title ?? "The Archive",
    line: album?.blurb,
    meta: album ? `${album.photos.length} photographs` : undefined,
    photo: cover,
  });
}
