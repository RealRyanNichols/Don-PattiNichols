import Link from "next/link";
import { Fragment } from "react";
import { PullQuote } from "./PostEnrichment";

/**
 * THE READING EXPERIENCE.
 *
 * Don types plain paragraphs into a box on his phone. This turns them into
 * something people actually want to read to the end:
 *
 *   • a drop cap and a larger opening paragraph, the way a magazine opens
 *   • generous type on a measure narrow enough to track easily
 *   • his own line pulled out large at the turning point of the story
 *   • quoted speech set apart so dialogue reads as dialogue
 *   • scripture given its own weight
 *   • the first mention of a place or a supply item quietly linked
 *   • a small gold cross where the story changes chapter
 *
 * NOT ONE WORD IS CHANGED. Everything here is presentation: the same sentences
 * he wrote, in the same order, made easier and more pleasant to move through.
 * If any rule here would require rewriting him, it does not belong in this file.
 */

export type LinkTarget = { phrase: string; href: string; title: string };

/**
 * Words that mean a paragraph IS scripture — not a paragraph that mentions it.
 *
 * The first version of this matched anywhere in the paragraph, and it caught
 * Don's line "And this is how God works! She was sitting in the exact same
 * location as yesterday… He opened it and starting reading. 'In the beginning,
 * God created….'" — styling his own narration as though it were the Bible.
 * On a preacher's site that is not a cosmetic error, it is a category error.
 *
 * So the bar is high: the paragraph must be SHORT and must OPEN with the
 * verse. A mixed paragraph of story and quotation stays plain prose, which is
 * the right answer when we cannot be certain.
 */
const SCRIPTURE_HINT =
  /^["“']?\s*(In the beginning|Thus saith|For God so loved|It is written|Go therefore|Inasmuch as)\b/i;

const MAX_SCRIPTURE_LEN = 220;

/**
 * Wrap the first occurrence of each target phrase in a link.
 *
 * First mention only, and each target used once per article. Auto-linking is
 * genuinely useful — it gives the reader somewhere to go and gives Google a
 * path between pages — but a paragraph speckled with links reads like spam,
 * so this is deliberately stingy.
 */
function linkify(
  text: string,
  targets: LinkTarget[],
  used: Set<string>,
): React.ReactNode {
  const target = targets.find(
    (t) => !used.has(t.href) && new RegExp(`\\b${escapeRe(t.phrase)}\\b`, "i").test(text),
  );
  if (!target) return text;

  const re = new RegExp(`\\b(${escapeRe(target.phrase)})\\b`, "i");
  const m = text.match(re);
  if (!m || m.index === undefined) return text;

  used.add(target.href);
  const before = text.slice(0, m.index);
  const hit = text.slice(m.index, m.index + m[0].length);
  const after = text.slice(m.index + m[0].length);

  return (
    <>
      {before}
      <Link
        href={target.href}
        title={target.title}
        className="text-sea underline decoration-gold/50 decoration-2 underline-offset-4 transition hover:decoration-gold"
      >
        {hit}
      </Link>
      {/* Keep scanning the rest of the paragraph for other targets. */}
      {linkify(after, targets, used)}
    </>
  );
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default function ArticleBody({
  paragraphs,
  pullQuote,
  pullQuoteAfter,
  links,
}: {
  paragraphs: string[];
  pullQuote: string | null;
  pullQuoteAfter: number;
  links: LinkTarget[];
}) {
  const used = new Set<string>();
  // One ornament, roughly two thirds through, where a long story turns. Only
  // for pieces long enough to earn a chapter break.
  const ornamentAt =
    paragraphs.length >= 9 ? Math.floor(paragraphs.length * 0.62) : -1;

  return (
    <div className="article-body">
      {paragraphs.map((para, i) => {
        const isLede = i === 0;
        const isScripture =
          para.length <= MAX_SCRIPTURE_LEN && SCRIPTURE_HINT.test(para.trim());

        return (
          <Fragment key={para.slice(0, 40) + i}>
            {isScripture ? (
              <p className="article-scripture">{para}</p>
            ) : (
              <p className={isLede ? "article-lede" : undefined}>
                {linkify(para, links, used)}
              </p>
            )}

            {pullQuote && i === pullQuoteAfter && <PullQuote text={pullQuote} />}

            {i === ornamentAt && i !== pullQuoteAfter && (
              <div aria-hidden className="article-ornament">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
                </svg>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
