import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { trips } from "@/content/trips";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/mission`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/belize`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${site.url}/behind-the-mission`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: `${site.url}/sponsor`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/members`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/trips`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/give`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/don`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/patti`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/our-story`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/store`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const tripPages: MetadataRoute.Sitemap = trips.map((trip) => ({
    url: `${site.url}/trips/${trip.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: trip.status === "upcoming" ? 0.9 : 0.6,
  }));

  return [...staticPages, ...postPages, ...tripPages];
}
