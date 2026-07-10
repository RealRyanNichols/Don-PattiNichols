import type { Metadata } from "next";
import Link from "next/link";
import ProgressRing from "@/components/ProgressRing";
import SponsorPurchase from "@/components/SponsorPurchase";
import SupplyIcon from "@/components/SupplyIcon";
import {
  KIT_AND_BIBLE,
  mergeLiveFunding,
  type SupplyItem,
} from "@/content/supplies";
import { fetchFundTotals } from "@/lib/donations";
import { money } from "@/lib/format";

/** Refresh live donation totals every 5 minutes. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sponsor a Kit & Bible — $5.50",
  description:
    "$5.50 provides both a hygiene kit and a Bible for one person. Part of the Fill the Trunks supply drive for the Belize medical mission — every item given completely free.",
};

// SponsorPurchase works on a SupplyItem shape; the combo is a virtual one.
const comboItem: SupplyItem = {
  id: KIT_AND_BIBLE.id,
  name: KIT_AND_BIBLE.name,
  unitCost: KIT_AND_BIBLE.unitCost,
  needed: null,
  funded: 0,
  blurb: "provides both a hygiene kit and a Bible for one person.",
  icon: "kit",
  startQty: 1,
};

export default async function KitAndBiblePage() {
  const { items } = mergeLiveFunding(await fetchFundTotals());
  const pair = KIT_AND_BIBLE.itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is SupplyItem => Boolean(item));

  return (
    <>
      <section className="relative overflow-hidden bg-deep py-14 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 80% -10%, rgba(201,150,46,0.25), transparent 60%)",
          }}
        />
        <div className="container-content relative">
          <nav aria-label="Breadcrumb" className="text-sm font-semibold text-white/70">
            <Link href="/sponsor" className="hover:text-gold">
              Fill the Trunks
            </Link>{" "}
            <span aria-hidden="true">/</span>{" "}
            <span className="text-white/90">A Kit &amp; Bible</span>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/15">
                  <SupplyIcon kind="kit" className="h-9 w-9" />
                </span>
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/15">
                  <SupplyIcon kind="bible" className="h-9 w-9" />
                </span>
                <span className="rounded-full bg-gold px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-ink">
                  {money(KIT_AND_BIBLE.unitCost)} for one person
                </span>
              </div>
              <h1 className="h-display mt-5 text-4xl !text-white sm:text-5xl">
                A Hygiene Kit + A Bible
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">
                {money(KIT_AND_BIBLE.unitCost)} provides both a hygiene kit and a Bible for one
                person.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#sponsor" className="btn-give text-lg">
                  Sponsor a Kit &amp; Bible
                </a>
                <Link
                  href="/sponsor"
                  className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
                >
                  All Supplies
                </Link>
              </div>
            </div>

            <div className="justify-self-center rounded-2xl bg-white p-6 shadow-md sm:p-8">
              <div className="flex items-start gap-6">
                {pair.map((item) => (
                  <div key={item.id} className="text-center">
                    <ProgressRing
                      size={120}
                      strokeWidth={11}
                      percent={
                        item.needed === null
                          ? 0
                          : Math.min(100, Math.round((item.funded / item.needed) * 100))
                      }
                      ariaLabel={`${item.funded} of ${item.needed} ${item.name} sponsored`}
                    />
                    <p className="mt-2 text-sm font-semibold text-ink/70">{item.name}</p>
                    <p className="text-xs text-ink/55">
                      {item.funded} of {item.needed}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-content py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <blockquote className="rounded-2xl border border-ink/10 border-l-4 border-l-gold bg-white p-7 shadow-sm">
              <p className="mb-4 font-serif text-lg italic leading-relaxed text-ink/85">
                A towel. A sewing kit. Toothpaste and a toothbrush. A hair tie. Lip balm. A Gospel
                booklet.
              </p>
              <p className="font-serif text-lg italic leading-relaxed text-ink/85">
                It isn't expensive. But to a family with limited access to these everyday items, it
                is a meaningful gift — a practical reminder that someone they have never met cared
                enough to help, and an open door to conversation, prayer, and the love of Christ.
              </p>
              <cite className="mt-4 block text-sm not-italic text-ink/60">
                — from{" "}
                <Link href="/behind-the-mission" className="font-semibold text-sea hover:underline">
                  Behind the Mission
                </Link>
              </cite>
            </blockquote>

            <div className="mt-8 rounded-2xl bg-sand-dark p-7">
              <h2 className="font-serif text-2xl font-bold">Straight from the trip budget</h2>
              <p className="mt-2 text-sm text-ink/70">
                Every figure below is from the published budget on the{" "}
                <Link href="/give" className="font-semibold text-sea hover:underline">
                  Give page
                </Link>
                .
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                <li className="flex justify-between gap-2 border-b border-ink/5 pb-2">
                  <span>300 hygiene kits</span>
                  <span className="font-semibold">$900</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>250 Bibles</span>
                  <span className="font-semibold">$625</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sponsor/hygiene-kit" className="btn-outline">
                Just the Hygiene Kit
              </Link>
              <Link href="/sponsor/bible" className="btn-outline">
                Just the Bible
              </Link>
            </div>
          </div>

          <div id="sponsor" className="lg:sticky lg:top-24 lg:self-start">
            <SponsorPurchase item={comboItem} />
            <p className="mt-3 text-center text-xs text-ink/55">
              Each one sponsors a hygiene kit and a Bible for the same person.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
