import type { Metadata } from "next";
import { toolBySlug } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import ToolShell from "@/components/tools/ToolShell";
import KitPartyPlanner from "@/components/tools/KitPartyPlanner";

const tool = toolBySlug("hygiene-kit-party")!;

export const metadata: Metadata = createPageMetadata({
  path: tool.href,
  title: `${tool.title} — Printable Shopping List`,
  description: tool.blurb,
  keywords: keywords(tool.keywords, "hygiene"),
  image: ogCardImage({
    eyebrow: "Free tool",
    title: "Hygiene kit checklist & party planner",
    line: "Towel, sewing kit, toothbrush, toothpaste, hair tie, lip balm, Gospel booklet. About $3 a kit.",
    photo: tool.photo,
  }),
});

export default function Page() {
  return (
    <ToolShell
      slug={tool.slug}
      eyebrow="Printable"
      intro="Pick a number of kits. The shopping list scales, the cost is Don's published $3, and the checklist prints for the assembly table."
      guide={{ label: "How to make a hygiene kit", href: "/guides/how-to-make-a-hygiene-kit" }}
    >
      <KitPartyPlanner />
    </ToolShell>
  );
}
