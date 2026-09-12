import type { Metadata } from "next";
import { toolBySlug } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import ToolShell from "@/components/tools/ToolShell";
import SupportLetterGenerator from "@/components/tools/SupportLetterGenerator";

const tool = toolBySlug("support-letter")!;

export const metadata: Metadata = createPageMetadata({
  path: tool.href,
  title: `${tool.title} — Free Mission Trip Fundraising Letter`,
  description: tool.blurb,
  keywords: keywords(tool.keywords, "support"),
  image: ogCardImage({
    eyebrow: "Free tool",
    title: "Write your mission trip support letter in five minutes",
    line: "Eight questions, one page, a specific ask. Copy it or download it.",
    photo: tool.photo,
  }),
});

export default function Page() {
  return (
    <ToolShell
      slug={tool.slug}
      eyebrow="Generator"
      intro="Answer the questions on the left; the letter writes itself on the right. It names a place, a date, a job, a number and a way to give — the five things a support letter needs to get answered."
      guide={{ label: "How to write a mission trip support letter", href: "/guides/mission-trip-support-letter" }}
    >
      <SupportLetterGenerator />
    </ToolShell>
  );
}
