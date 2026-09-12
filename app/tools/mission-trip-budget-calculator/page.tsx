import type { Metadata } from "next";
import { toolBySlug } from "@/content/tools";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import ToolShell from "@/components/tools/ToolShell";
import BudgetCalculator from "@/components/tools/BudgetCalculator";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

const tool = toolBySlug("mission-trip-budget-calculator")!;

export const metadata: Metadata = createPageMetadata({
  path: tool.href,
  title: `${tool.title} — Real Costs, Not Estimates`,
  description: tool.blurb,
  keywords: keywords(tool.keywords, "costs"),
  image: ogCardImage({
    eyebrow: "Free tool",
    title: tool.title,
    line: "Every unit price is Don Nichols' published figure. Download the sheet.",
    photo: tool.photo,
  }),
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.title,
          url: `${site.url}${tool.href}`,
          description: tool.blurb,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@type": "Organization", name: site.name, url: site.url },
        }}
      />
      <ToolShell
        slug={tool.slug}
        eyebrow="Calculator"
        intro="Start from Don's actual Belize plan and change any line. Every unit price is his. The one number first-time teams never budget for — flying the trunks — is called out on its own."
        guide={{ label: "What to pack for a medical mission trip", href: "/guides/what-to-pack-for-a-medical-mission-trip" }}
      >
        <BudgetCalculator />
      </ToolShell>
    </>
  );
}
