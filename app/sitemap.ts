import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { posts } from "@/content/posts";
import { trips } from "@/content/trips";
import { albums } from "@/content/albums";
import { supplyDrive } from "@/content/supplies";
import { fetchDbPosts } from "@/lib/postsDb";

/**
 * The sitemap is how Google finds pages it hasn't been linked to.
 *
 * It used to list only the hand-written posts in content/posts.ts — so
 * everything Don and Patti publish from their phones was missing from it.
 * Don's first story went up and Google had no route to it. Anything they write
 * from here on is included the moment it publishes.
 */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
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
            : 0.7,
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
  const livePostPages = dbPosts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.published_at ?? p.created_at ?? Date.now()),
    changeFrequency: "monthly" as const,
    // Their own words are the most valuable thing on this site.
    priority: 0.8,
  }));

  const tripPages = trips.map((t) => ({
    url: `${site.url}/trips/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: t.status === "upcoming" ? 0.9 : 0.6,
  }));

  const albumPages = albums.map((a) => ({
    url: `${site.url}/albums/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const sponsorPages = supplyDrive.items.map((i) => ({
    url: `${site.url}/sponsor/${i.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...postPages,
    ...livePostPages,
    ...tripPages,
    ...albumPages,
    ...sponsorPages,
  ];
}
