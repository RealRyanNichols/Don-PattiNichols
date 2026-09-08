import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Keep search and shared links attached to the page the visitor selected. */
export function createPageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
