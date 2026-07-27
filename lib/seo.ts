import type { Metadata } from "next";
import { site } from "@/lib/site";

type SocialMetadata = {
  title: string;
  description: string;
  path: string;
  eyebrow: string;
  image?: string;
};

export function socialMetadata({
  title,
  description,
  path,
  eyebrow,
  image = "/images/team.jpg",
}: SocialMetadata): Metadata {
  const canonicalPath = path === "/" ? "" : path;
  const url = `${site.url}${canonicalPath}`;
  const params = new URLSearchParams({ title, description, eyebrow, image });
  const socialImage = `/api/og?${params.toString()}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}
