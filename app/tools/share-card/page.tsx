import type { Metadata } from "next";
import { toolBySlug } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import ToolShell from "@/components/tools/ToolShell";
import ShareCardMaker from "@/components/tools/ShareCardMaker";

const tool = toolBySlug("share-card")!;

export const metadata: Metadata = createPageMetadata({
  path: tool.href,
  title: `${tool.title} — Tell People What You Sent to Belize`,
  description: tool.blurb,
  keywords: keywords(tool.keywords, "giving"),
  image: ogCardImage({
    eyebrow: "Free tool",
    title: "“I sent 10 Bibles to Belize.”",
    line: "Make the picture, post it, and the next person gives too.",
    photo: tool.photo,
  }),
});

export default function Page() {
  return (
    <ToolShell
      slug={tool.slug}
      eyebrow="Download"
      intro="Nearly everyone who supports this mission came because a friend shared something. Pick what you sent, add your name if you like, save the picture, post it."
      guide={{ label: "Reading glasses on the mission field", href: "/guides/reading-glasses-mission-ministry" }}
    >
      <ShareCardMaker />
    </ToolShell>
  );
}
