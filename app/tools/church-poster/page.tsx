import type { Metadata } from "next";
import { toolBySlug } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import ToolShell from "@/components/tools/ToolShell";
import ChurchPosterMaker from "@/components/tools/ChurchPosterMaker";

const tool = toolBySlug("church-poster")!;

export const metadata: Metadata = createPageMetadata({
  path: tool.href,
  title: `${tool.title} — Print-Ready With a QR Code`,
  description: tool.blurb,
  keywords: keywords(tool.keywords, "churches"),
  image: ogCardImage({
    eyebrow: "For churches",
    title: "A poster for the Sunday Don speaks at your church",
    line: "Your church's name, the date, and a QR code to the mission. Print at 8½ × 11.",
    photo: tool.photo,
  }),
});

export default function Page() {
  return (
    <ToolShell
      slug={tool.slug}
      eyebrow="For churches"
      intro="Type your church's name, the date and the time. The poster renders with a photograph from the field and a QR code that scans straight to the mission. Download it and print."
      guide={{ label: "For churches", href: "/churches" }}
    >
      <ChurchPosterMaker />
    </ToolShell>
  );
}
