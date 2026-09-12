import { articleBySlug } from "@/content/articles";
import { ogCard, photoDataUrl, OG_SIZE } from "@/lib/ogCard";

export const runtime = "nodejs";
export const alt = "An article from Don & Patti Nichols";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  const hero = await photoDataUrl(article?.hero);
  return ogCard({
    eyebrow: article?.eyebrow ?? "Article",
    title: article?.title ?? "Articles",
    line: article?.shareText,
    meta: "Charts from Don's real numbers",
    photo: hero,
  });
}
