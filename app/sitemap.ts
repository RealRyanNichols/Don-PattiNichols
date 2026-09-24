import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { posts } from "@/content/posts";
import { trips } from "@/content/trips";
import { albums, photo } from "@/content/albums";
import { supplyDrive } from "@/content/supplies";
import { guides } from "@/content/guides";
import { tools } from "@/content/tools";
import { fetchDbPosts } from "@/lib/postsDb";
import { lifeStories } from "@/content/life-stories";
import { articles } from "@/content/articles";
import { socialPosts } from "@/content/social-kit";
import { malawiCampaign } from "@/content/campaigns";

/**
 * The sitemap is how Google finds pages it hasn't been linked to.
 *
 * It used to list only the hand-written posts in content/posts.ts — so
 * everything Don and Patti publish from their phones was missing from it.
 * Don's first story went up and Google had no route to it. Anything they write
 * from here on is included the moment it publishes.
 *
 * Album entries now carry every photograph as an image entry. That is the
 * difference between Google Images knowing about one cover per album and
 * knowing about all five hundred pictures from five countries.
 */
// Metadata routes are cached by default. The deployed sitemap kept serving its
// prerendered post list while /blog was current, despite revalidate = 60. Build
// this discovery document at request time so newly published posts are included
// without depending on stale route or fetch caches. The query remains limited
// to public, published posts; drafts and parent accounts are never exposed.
export const dynamic = "force-dynamic";

/** The day the guides, tools and hub pages first went live. */
const RESOURCES_LAUNCH = new Date("2026-09-12T12:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Without a recorded content-change date, omit lastModified. A sitemap
  // refresh must not tell crawlers that every page was just edited.
  const staticPages = [
    "",
    "/mission",
    "/belize",
    "/behind-the-mission",
    "/sponsor",
    "/members",
    "/trips",
    "/albums",
    "/thank-you",
    "/transparency",
    "/what-a-mission-trip-costs",
    "/give",
    "/blog",
    "/don",
    "/patti",
    "/our-story",
    "/store",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${site.url}${path}`,
    ...(["", "/our-story", "/don", "/patti", "/blog"].includes(path)
      ? { lastModified: new Date("2026-09-12T21:00:00Z") }
      : {}),
    changeFrequency: "weekly" as const,
    priority:
      path === ""
        ? 1
        : // The cost page is the strongest organic-search asset on the site:
          // it answers a real query with numbers nobody else publishes.
          path === "/what-a-mission-trip-costs"
          ? 0.95
          : path === "/give" || path === "/belize"
            ? 0.9
            : path === "/privacy" || path === "/terms"
              ? 0.2
              : 0.7,
  }));

  const hubPages = ["/resources", "/faq", "/churches"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: RESOURCES_LAUNCH,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const sharePage = {
    url: `${site.url}/share`,
    lastModified: new Date("2026-09-21T12:00:00Z"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    images: socialPosts.map((post) => `${site.url}${post.image}`),
  };

  // The data pieces: charts, a quiz, calculators. Each answers a query
  // ("where does my donation go", "what does $25 buy") with Don's numbers.
  const articleHub = [
    {
      url: `${site.url}/articles`,
      lastModified: new Date("2026-09-12T12:00:00Z"),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
  ];
  const articlePages = articles.map((a) => ({
    url: `${site.url}/articles/${a.slug}`,
    lastModified: new Date(a.datePublished + "T12:00:00Z"),
    changeFrequency: "monthly" as const,
    priority: 0.9,
    images: [photo(a.hero, 1600)],
  }));

  // Don's live campaign. Priority matches the cost page: it is the page he
  // is sending people to, and it answers "how much does a well cost".
  const campaignPages = malawiCampaign.active
    ? [
        {
          url: `${site.url}${malawiCampaign.path}`,
          lastModified: new Date(`${malawiCampaign.updated}T12:00:00Z`),
          changeFrequency: "weekly" as const,
          priority: 0.95,
          images: [photo(malawiCampaign.photos.hero, 1600)],
        },
      ]
    : [];

  const guidePages = guides.map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    lastModified: new Date(g.datePublished + "T12:00:00Z"),
    changeFrequency: "monthly" as const,
    // Each guide answers a query people type before they know Don's name.
    priority: 0.9,
    images: [photo(g.hero, 1600)],
  }));

  const toolPages = tools.map((t) => ({
    url: `${site.url}${t.href}`,
    lastModified: RESOURCES_LAUNCH,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const postPages = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Posts Don and Patti wrote themselves. Never throws — a database outage
  // returns an empty list rather than breaking the whole sitemap.
  const dbPosts = await fetchDbPosts();
  const foundingSlugs = new Set(posts.map((p) => p.slug));
  const livePostPages = dbPosts
    .filter((p) => !foundingSlugs.has(p.slug))
    .map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.published_at ?? p.created_at,
      changeFrequency: "monthly" as const,
      // Their own words are the most valuable thing on this site.
      priority: 0.8,
    }));

  const lifeStoryPages = lifeStories.map((story) => ({
    url: `${site.url}/our-story/${story.slug}`,
    // Recording dates describe the source, not when the article was published.
    lastModified: new Date(`${story.publishedOn}T12:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tripPages = trips.map((t) => ({
    url: `${site.url}/trips/${t.slug}`,
    changeFrequency: "weekly" as const,
    priority: t.status === "upcoming" ? 0.9 : 0.6,
  }));

  const albumPages = albums.map((a) => ({
    url: `${site.url}/albums/${a.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    // Every photograph in the album, at a size Google Images can index.
    images: a.photos.map((id) => photo(id, 1600)),
  }));

  const sponsorPages = supplyDrive.items.map((i) => ({
    url: `${site.url}/sponsor/${i.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: [photo(i.photo, Math.min(i.photoPx, 1600))],
  }));

  return [
    ...staticPages,
    ...campaignPages,
    ...hubPages,
    sharePage,
    ...articleHub,
    ...articlePages,
    ...guidePages,
    ...toolPages,
    ...postPages,
    ...livePostPages,
    ...lifeStoryPages,
    ...tripPages,
    ...albumPages,
    ...sponsorPages,
  ];
}
