import type { Metadata } from "next";
import Link from "next/link";
import { toolBySlug } from "@/content/tools";
import { prayerDays } from "@/content/prayer";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import ToolShell from "@/components/tools/ToolShell";
import PrintButton from "@/components/PrintButton";

const tool = toolBySlug("prayer-cards")!;

export const metadata: Metadata = createPageMetadata({
  path: tool.href,
  title: `${tool.title} — Printable Prayer Guide for a Mission Team`,
  description: tool.blurb,
  keywords: keywords(tool.keywords, "prayer"),
  image: ogCardImage({
    eyebrow: "Printable",
    title: "Seven days of prayer for a mission team",
    line: "A verse and prayer points for each stage of a trip, on one sheet.",
    photo: tool.photo,
  }),
});

export default function Page() {
  return (
    <ToolShell
      slug={tool.slug}
      eyebrow="Printable"
      intro="One sheet, seven days: preparation, the journey, the clinic, the vision table, the pastors, the Gospel, coming home. Print it, cut it, hand it out the Sunday before a team leaves."
      guide={{ label: "How to pray for a mission team", href: "/guides/how-to-pray-for-a-mission-team" }}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
        <PrintButton label="Print the cards" what="prayer_cards" />
        <Link href="/tools/wallpapers" className="btn-outline">
          Phone wallpapers for each day
        </Link>
      </div>

      <div className="print-sheet grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 print:gap-3">
        {prayerDays.map((d) => (
          <article
            key={d.day}
            className="print-card flex flex-col rounded-2xl border-t-4 border-t-gold bg-white p-5 shadow-sm ring-1 ring-ink/10"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-sea">
              Day {d.day}
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold text-ink">{d.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{d.focus}</p>
            <p className="mt-3 border-l-4 border-sea/30 pl-3 font-serif text-[15px] italic leading-relaxed text-deep">
              &ldquo;{d.verse.text}&rdquo;
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-sea">
              {d.verse.ref}
            </p>
            <ul className="mt-3 flex-1 space-y-1.5 text-sm leading-relaxed text-ink/80">
              {d.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-ink/10 pt-2 text-[11px] text-ink/45">
              Don &amp; Patti Nichols · donandpatti.com
            </p>
          </article>
        ))}
        <article className="print-card flex flex-col justify-center rounded-2xl bg-deep p-5 text-white print:bg-white print:text-black">
          <p className="text-xs font-bold uppercase tracking-widest text-gold">
            Why these four things
          </p>
          <p className="mt-2 font-serif text-[15px] italic leading-relaxed">
            &ldquo;We ask you to pray for the safety of our team, for wisdom as medical decisions are made, for strength and encouragement for the pastors who faithfully serve their communities throughout the year, and most importantly, that every person we meet will experience the love of Christ and respond to the truth of the Gospel.&rdquo;
          </p>
          <p className="mt-2 text-xs text-white/70 print:text-black/60">— Don Nichols</p>
        </article>
      </div>
    </ToolShell>
  );
}
