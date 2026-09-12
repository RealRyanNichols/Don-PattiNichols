import Link from "next/link";
import type { Block } from "@/content/articles";
import { chartById } from "@/content/charts";
import { supplyDrive } from "@/content/supplies";
import { photo, photoSrcSet } from "@/content/albums";
import { photoAlt, photoCaption } from "@/content/captions";
import ChartFigure from "@/components/charts/ChartFigure";
import JoinForm from "@/components/JoinForm";
import SponsorInline from "@/components/SponsorInline";
import GiveLink from "@/components/GiveLink";
import TrunkBuilder from "@/components/interactive/TrunkBuilder";
import MissionQuiz from "@/components/interactive/MissionQuiz";
import TripChecklist from "@/components/interactive/TripChecklist";
import FundraiserCalculator from "@/components/interactive/FundraiserCalculator";
import MonthlyGivingSlider from "@/components/interactive/MonthlyGivingSlider";

/**
 * ARTICLE BLOCKS — the renderer for content/articles.ts.
 *
 * Prose blocks (paragraphs, headings, quotes, lists, the "general guidance"
 * box) are grouped into `.guide-body` runs so they pick up the reading
 * typography. Everything else — charts, interactives, the capture form, the
 * give box, photographs, stat tiles, tables, link grids — sits between those
 * runs with its own spacing, so a form's fine print is never restyled as a
 * lede and a chart never inherits a bullet.
 *
 * The order of blocks in the content file is the argument: a chart lands
 * right after the paragraph that sets it up, and the ask lands right after
 * the reader has been given a reason to say yes.
 */

export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Prose = Extract<Block, { kind: "p" | "h2" | "quote" | "list" | "general" }>;
const isProse = (b: Block): b is Prose =>
  b.kind === "p" || b.kind === "h2" || b.kind === "quote" || b.kind === "list" || b.kind === "general";

function ProseRun({ blocks, ledeIndex }: { blocks: { block: Prose; index: number }[]; ledeIndex: number }) {
  return (
    <div className="guide-body">
      {blocks.map(({ block, index }) => {
        switch (block.kind) {
          case "p":
            return (
              <p key={index} className={index === ledeIndex ? "article-lede dropcap" : undefined}>
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2 key={index} id={headingId(block.text)} className="scroll-mt-24">
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <figure key={index} className="mt-6 border-l-4 border-gold pl-6">
                <blockquote className="font-serif text-xl font-bold italic leading-snug text-deep sm:text-2xl">
                  &ldquo;{block.text}&rdquo;
                </blockquote>
                <figcaption className="mt-2 text-sm text-ink/55">— {block.from}</figcaption>
              </figure>
            );
          case "list":
            return (
              <ul key={index}>
                {block.items.map((li) => (
                  <li key={li}>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            );
          case "general":
            return (
              <aside key={index} className="mt-6 rounded-2xl border border-sea/25 bg-sea/[0.06] p-5">
                <p className="!mt-0 text-xs font-bold uppercase tracking-widest text-sea">
                  General guidance — not Don&rsquo;s words
                </p>
                {block.paragraphs.map((g, i) => (
                  <p key={i} className="!mt-3 !text-base">
                    {g}
                  </p>
                ))}
              </aside>
            );
        }
      })}
    </div>
  );
}

function Interactive({ name }: { name: Extract<Block, { kind: "interactive" }>["name"] }) {
  switch (name) {
    case "trunk-builder":
      return <TrunkBuilder />;
    case "quiz":
      return <MissionQuiz />;
    case "checklist":
      return <TripChecklist />;
    case "fundraiser":
      return <FundraiserCalculator />;
    case "monthly":
      return <MonthlyGivingSlider />;
  }
}

function Widget({ block, path, index }: { block: Exclude<Block, Prose>; path: string; index: number }) {
  switch (block.kind) {
    case "chart": {
      const spec = chartById(block.id);
      if (!spec) return null;
      return <ChartFigure spec={spec} sharePath={path} />;
    }

    case "interactive":
      return (
        <div className="my-10">
          <Interactive name={block.name} />
        </div>
      );

    case "stats":
      return (
        <div className="my-10 grid gap-4 sm:grid-cols-3">
          {block.items.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10">
              <div className="font-serif text-3xl font-bold tabular-nums text-deep sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm font-semibold text-ink">{s.label}</div>
              {s.note && <div className="mt-1 text-xs leading-relaxed text-ink/55">{s.note}</div>}
            </div>
          ))}
        </div>
      );

    case "photo":
      return (
        <figure className="reveal my-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo(block.id, 1200)}
            srcSet={photoSrcSet(block.id, [800, 1200, 1600, 2000])}
            sizes="(min-width: 768px) 48rem, 100vw"
            alt={photoAlt(block.id, "Mission photograph", index)}
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className="w-full rounded-2xl bg-sand-dark object-cover shadow-lg ring-1 ring-ink/10"
          />
          {photoCaption(block.id) && (
            <figcaption className="mt-3 text-center text-sm italic text-ink/55">{photoCaption(block.id)}</figcaption>
          )}
        </figure>
      );

    case "table":
      return (
        <div className="my-10 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-ink/10">
          <table className="w-full text-left text-sm">
            <caption className="px-5 pt-4 text-left font-serif text-lg font-bold text-ink">{block.caption}</caption>
            <thead>
              <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/55">
                {block.head.map((h, i) => (
                  <th key={h} className={`px-5 py-2 ${i > 0 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, ri) => (
                <tr key={ri} className="border-b border-ink/5 last:border-0">
                  {r.map((c, ci) => (
                    <td key={ci} className={`px-5 py-2 ${ci > 0 ? "text-right tabular-nums" : "text-ink"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "links":
      return (
        <div className="my-10">
          <p className="eyebrow">{block.heading}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {block.items.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex flex-col rounded-2xl border-2 border-sea/20 bg-white p-5 transition hover:-translate-y-0.5 hover:border-sea/50 hover:shadow-md"
              >
                <span className="font-serif text-lg font-bold leading-snug text-ink group-hover:text-sea">{l.label}</span>
                {l.blurb && <span className="mt-1.5 flex-1 text-[15px] leading-relaxed text-ink/70">{l.blurb}</span>}
                <span className="mt-3 text-xs font-bold uppercase tracking-widest text-gold-dark">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      );

    case "join":
      return (
        <div className="my-10 rounded-2xl border-2 border-sea/20 bg-white p-6 sm:p-8">
          <p className="eyebrow">Stay close to the work</p>
          <h2 className="h-display mt-2 text-2xl sm:text-3xl">{block.heading}</h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/70">{block.text}</p>
          <div className="mt-5 max-w-lg">
            <JoinForm
              source={block.source}
              interest={block.interest}
              askName
              askPhone
              offerTexts
              submitLabel="Keep me posted"
            />
          </div>
        </div>
      );

    case "give": {
      const item = block.itemId ? supplyDrive.items.find((i) => i.id === block.itemId) : undefined;
      return (
        <div className="my-10 overflow-hidden rounded-2xl bg-deep text-white shadow-lg">
          <div className={item ? "grid md:grid-cols-[1fr_1.1fr]" : ""}>
            {item && (
              <div className="relative min-h-[220px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo(item.photo, 900)}
                  srcSet={photoSrcSet(item.photo, [600, 900, 1200])}
                  sizes="(min-width: 768px) 24rem, 100vw"
                  alt={photoAlt(item.photo, item.name, 0)}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-widest text-deep shadow">
                  {item.unitCost.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: item.unitCost % 1 ? 2 : 0,
                  })}{" "}
                  each
                </span>
              </div>
            )}
            <div className="p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold">Make it real</p>
              <h2 className="h-display mt-2 text-2xl !text-white sm:text-3xl">{block.heading}</h2>
              <p className="mt-3 text-white/80">{block.text}</p>
              <div className="mt-6">
                {item ? (
                  <SponsorInline item={item} />
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <GiveLink location={`article_${path.split("/").pop()}`} href="/sponsor" className="btn-give">
                      Fill the Trunks
                    </GiveLink>
                    <GiveLink
                      location={`article_${path.split("/").pop()}_give`}
                      className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
                    >
                      Give any amount
                    </GiveLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

/** Render an article's blocks. `path` is the article's own path (for share links and analytics). */
export default function ArticleBlocks({ blocks, path }: { blocks: Block[]; path: string }) {
  const ledeIndex = blocks.findIndex((b) => b.kind === "p");
  const out: React.ReactNode[] = [];
  let run: { block: Prose; index: number }[] = [];
  const flush = () => {
    if (!run.length) return;
    out.push(<ProseRun key={`run-${run[0].index}`} blocks={run} ledeIndex={ledeIndex} />);
    run = [];
  };
  blocks.forEach((block, index) => {
    if (isProse(block)) {
      run.push({ block, index });
    } else {
      flush();
      out.push(<Widget key={index} block={block} path={path} index={index} />);
    }
  });
  flush();
  return <>{out}</>;
}

/** The h2 headings of an article, for a jump list. */
export function articleOutline(blocks: Block[]): { id: string; text: string }[] {
  return blocks
    .filter((b): b is Extract<Block, { kind: "h2" }> => b.kind === "h2")
    .map((b) => ({ id: headingId(b.text), text: b.text }));
}
