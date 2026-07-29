import Link from "next/link";
import { photo } from "@/content/albums";
import { paypalDonateUrl } from "@/lib/paypal";
import type { Enrichment } from "@/lib/postEnrich";
import JoinForm from "./JoinForm";
import ShareButton from "./ShareButton";
import SponsorInline from "./SponsorInline";

/**
 * WHAT GETS BUILT AROUND A STORY.
 *
 * Everything here sits AFTER the last line Don wrote. The only thing that ever
 * appears inside his text is a pull-quote, and that is his own sentence set
 * larger — not a box, not an ask, nothing that breaks the read.
 *
 * Order matters and is deliberate: the reader has just finished a story, so
 * first give them the one thing that story pointed at, then the chance to keep
 * hearing from him, then a way to pass it on, then somewhere else to go.
 */

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

/** His own sentence, set large, inside the flow of the article. */
export function PullQuote({ text }: { text: string }) {
  return (
    <figure className="my-8 border-l-4 border-gold pl-6 sm:my-10 sm:pl-8">
      <blockquote className="font-serif text-2xl font-bold italic leading-snug text-deep sm:text-3xl">
        {text}
      </blockquote>
    </figure>
  );
}

export default function PostEnrichment({
  e,
  title,
  path,
  authorName,
}: {
  e: Enrichment;
  title: string;
  path: string;
  authorName: string;
}) {
  const item = e.item;

  return (
    <div className="mt-12 space-y-10">
      {/* 1 — The ask, matched to what the story was about. */}
      {item ? (
        <section className="overflow-hidden rounded-2xl bg-deep text-white shadow-lg">
          <div className="grid sm:grid-cols-[minmax(0,1fr)_1.15fr]">
            <div className="relative min-h-[190px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo(item.photo, Math.min(item.photoPx, 900))}
                alt={`${item.name} — ${item.photoFrom}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-gold">
                {fmt(item.unitCost)} each
              </p>
              <h2 className="h-display mt-2 text-2xl !text-white sm:text-3xl">
                {e.askHeadline}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/80">
                {item.blurb}
              </p>
              <div className="mt-6">
                <SponsorInline item={item} />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/50">
                Goes to the next trip, not the one in this story. Every item is
                handed to someone free of charge.{" "}
                <Link href="/transparency" className="text-gold underline">
                  See where the money goes
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl bg-deep p-7 text-white shadow-lg sm:p-8">
          <h2 className="h-display text-2xl !text-white">{e.askHeadline}</h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/80">
            Everything Don and Patti carry into a village was given by somebody
            back home. If this story meant something to you, that is how you
            stand in it.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/sponsor" className="btn-give">
              Fill the trunks
            </Link>
            <Link
              href="/transparency"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              See where it goes
            </Link>
          </div>
        </section>
      )}

      {/* 2 — Keep hearing from them. */}
      <section className="rounded-2xl border-2 border-sea/20 bg-white p-6 sm:p-7">
        <h2 className="h-display text-2xl">
          More where this came from
        </h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/70">
          {authorName.split(" ")[0]} writes these himself, from the field and
          from home. Leave your name and you&rsquo;ll get the next one.
        </p>
        <div className="mt-5 max-w-md">
          <JoinForm
            source="blog_post"
            interest={e.followInterest}
            askName
            askPhone
            submitLabel="Send me the next story"
            doneTitle="You'll get the next one."
            doneText="Don and Patti write every word themselves. Nothing else will come from this list."
          />
        </div>
      </section>

      {/* 3 — Pass it on. */}
      <section className="rounded-2xl border-l-4 border-gold bg-sand-dark p-6">
        <p className="font-serif text-lg font-bold text-ink">
          Somebody needs to read this today.
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
          Nearly everyone who supports this mission came because a friend sent
          them something. It costs nothing to be that friend.
        </p>
        <div className="mt-4">
          <ShareButton title={title} text={`A story from ${authorName}.`} path={path} />
        </div>
      </section>

      {/* 4 — Somewhere else to go. */}
      {e.album && (
        <section>
          <Link
            href={`/albums/${e.album.slug}`}
            className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 transition hover:shadow-md"
          >
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-sea">
                Photographs
              </p>
              <p className="mt-1 font-serif text-xl font-bold text-ink">
                See the {e.album.title} album
              </p>
            </div>
            <span
              aria-hidden
              className="shrink-0 text-2xl text-gold transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </section>
      )}
    </div>
  );
}
