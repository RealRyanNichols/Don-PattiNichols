import { site } from "@/lib/site";
import { sortedPosts } from "@/content/posts";
import { authorNames } from "@/content/people";
import { guides } from "@/content/guides";
import { fetchDbPosts, dbAuthorName, dbPostParagraphs } from "@/lib/postsDb";
import { storageImage } from "@/lib/storageImage";
import { photo } from "@/content/albums";
import { lifeStories } from "@/content/life-stories";

/**
 * RSS — the feed readers, newsletter tools, and AI crawlers still ask for.
 *
 * Everything Don and Patti publish from their phones lands here within a
 * minute, alongside the founding posts and the guides. A church secretary can
 * paste this into a bulletin tool; a supporter can follow it in any reader;
 * Google and Bing use it as one more discovery path.
 */
export const revalidate = 60;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

type Item = {
  title: string;
  link: string;
  description: string;
  date: Date;
  author: string;
  image?: string;
  category?: string;
};

export async function GET() {
  const db = await fetchDbPosts();
  // Static articles take precedence in /blog/[slug], so the feed must agree.
  const foundingSlugs = new Set(sortedPosts.map((p) => p.slug));

  const items: Item[] = [
    ...db
      .filter((p) => !foundingSlugs.has(p.slug))
      .map((p) => ({
        title: p.title,
        link: `${site.url}/blog/${p.slug}`,
        description: p.excerpt || dbPostParagraphs(p)[0] || "",
        date: new Date(p.published_at ?? p.created_at),
        author: dbAuthorName(p.author_handle),
        image: p.photo_urls[0]
          ? storageImage(p.photo_urls[0], 1200, 80)
          : undefined,
        category: p.tags[0],
      })),
    ...sortedPosts.map((p) => ({
      title: p.title,
      link: `${site.url}/blog/${p.slug}`,
      description: p.excerpt,
      date: new Date(p.date + "T12:00:00Z"),
      author: authorNames(p.author),
      category: p.category,
    })),
    ...guides.map((g) => ({
      title: g.title,
      link: `${site.url}/guides/${g.slug}`,
      description: g.description,
      date: new Date(g.datePublished + "T12:00:00Z"),
      author: site.name,
      image: photo(g.hero, 1200),
      category: "Guides",
    })),
    ...lifeStories.map((story) => ({
      title: story.title,
      link: `${site.url}/our-story/${story.slug}`,
      description: `From ${story.narrator}'s recollections. ${story.excerpt}`,
      date: new Date(`${story.publishedOn}T12:00:00Z`),
      author: story.narrator,
      category: story.category,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${esc(site.name)} — Life, Faith &amp; Ministry</title>
<link>${site.url}</link>
<atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
<description>${esc(site.description)}</description>
<language>en-us</language>
<lastBuildDate>${(items[0]?.date ?? new Date()).toUTCString()}</lastBuildDate>
<image><url>${site.url}/pwa-icon/512</url><title>${esc(site.name)}</title><link>${site.url}</link></image>
${items
  .map(
    (i) => `<item>
<title>${esc(i.title)}</title>
<link>${i.link}</link>
<guid isPermaLink="true">${i.link}</guid>
<pubDate>${i.date.toUTCString()}</pubDate>
<dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${esc(i.author)}</dc:creator>
${i.category ? `<category>${esc(i.category)}</category>` : ""}
<description>${esc(i.description)}</description>
${i.image ? `<media:content url="${esc(i.image)}" medium="image"/>` : ""}
</item>`,
  )
  .join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
    },
  });
}
