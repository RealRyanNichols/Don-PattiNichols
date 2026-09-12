import type { Metadata } from "next";
import { site } from "@/lib/site";

export type PageImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

/**
 * Keep search and shared links attached to the page the visitor selected.
 *
 * Every public page declares: a distinct title, a distinct description, a
 * canonical URL, Open Graph + Twitter tags, and the keyword phrases it can
 * genuinely answer. Pages that ship their own `opengraph-image.tsx` should NOT
 * pass `image` — Next wires the generated card automatically and a manual
 * image would override it.
 */
export function createPageMetadata({
  path,
  title,
  description,
  keywords,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: PageImage;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${site.url}${path}`;
  const images = image
    ? [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: image.alt ?? title,
        },
      ]
    : undefined;
  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
      types: { "application/rss+xml": `${site.url}/feed.xml` },
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      locale: site.locale,
      siteName: site.name,
      url,
      title,
      description,
      ...(images ? { images } : {}),
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
            authors: authors ?? ["Don Nichols", "Patti Nichols"],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
