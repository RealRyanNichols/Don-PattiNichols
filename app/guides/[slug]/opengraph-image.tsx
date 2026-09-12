import { guideBySlug } from "@/content/guides";
import { ogCard, photoDataUrl, OG_SIZE } from "@/lib/ogCard";

export const runtime = "nodejs";
export const alt = "A guide from Don & Patti Nichols";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  const hero = await photoDataUrl(guide?.hero);
  return ogCard({
    eyebrow: guide?.eyebrow ?? "Guide",
    title: guide?.title ?? "Guides",
    line: guide?.description,
    meta: "Free guide",
    photo: hero,
  });
}
