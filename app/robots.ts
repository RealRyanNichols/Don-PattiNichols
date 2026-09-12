import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Everything public is crawlable. The three private surfaces are excluded so
 * crawl budget goes to the pages that can rank, and so the admin never shows
 * up as a result under Don's name.
 *
 * AI crawlers are deliberately allowed: an assistant that has read Don's real
 * budget will cite it when someone asks what a mission trip costs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/welcome", "/give/thank-you"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
