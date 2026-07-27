import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GoalMeter from "@/components/GoalMeter";
import ProgressRing from "@/components/ProgressRing";
import SponsorPurchase from "@/components/SponsorPurchase";
import SupplyIcon from "@/components/SupplyIcon";
import { supplyDetails } from "@/content/supply-details";
import { getSupply, mergeLiveFunding, sponsorLabel, supplies } from "@/content/supplies";
import { fetchFundTotals } from "@/lib/donations";
import { money } from "@/lib/format";
import { socialMetadata } from "@/lib/seo";

/** Refresh live donation totals every 5 minutes. */
export const revalidate = 300;

type Props = { params: { id: string } };

export function generateStaticParams() {
  return supplies.map((item) => ({ id: item.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const item = getSupply(params.id);
  if (!item) return {};
  const image = item.icon === "trunk" ? "/images/trunks-packed.jpg" : item.icon === "plane" ? "/images/flight-to-belize.jpg" : "/images/clinic-supplies-staged.jpg";
  return socialMetadata({
    title: `${sponsorLabel(item.name)} — ${money(item.unitCost)}`,
    description: `${item.blurb} Part of the Fill the Trunks supply drive for the Belize medical mission — every item given completely free.`,
    path: `/sponsor/${item.id}`,
    eyebrow: "Fill the Trunks · Belize Medical Mission",
    image,
  });
}

export default async function SupplyItemPage({ params }: Props) {
  const { items, raised } = mergeLiveFunding(await fetchFundTotals());
  const item = items.find((s) => s.id === params.id);
  if (!item) notFound();

  const detail = supplyDetails[item.id];
  const pct =
    item.needed === null ? 0 : Math.min(100, Math.round((item.funded / item.needed) * 100));
  const remaining = item.needed === null ? null : item.needed - item.funded;
  const targetUsd = item.needed === null ? null : item.needed * item.unitCost;
  const raisedUsd = item.funded * item.unitCost;
  const related = (() => {
    const i = items.findIndex((s) => s.id === item.id);
    return [1, 2, 3].map((step) => items[(i + step) % items.length]);
  })();

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
            <span className="text-white/90">{item.name}</span>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/15">
                  <SupplyIcon kind={item.icon} className="h-9 w-9" />
                </span>
                <span className="rounded-full bg-gold px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-ink">
                  {money(item.unitCost)} each
                </span>
                {item.topPriority ? (
                  <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-gold ring-1 ring-gold/60">
                    Top Priority
                  </span>
                ) : null}
              </div>
              <h1 className="h-display mt-5 text-4xl !text-white sm:text-5xl">{item.name}</h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">{item.blurb}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#sponsor" className="btn-give text-lg">
                  {sponsorLabel(item.name)}
                </a>
                <Link
                  href="/sponsor"
                  className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
                >
                  All Supplies
                </Link>
              </div>
            </div>

            <div className="justify-self-center rounded-2xl bg-white p-6 text-center shadow-md sm:p-8">
              {item.needed !== null ? (
                <>
                  <ProgressRing
                    percent={pct}
                    ariaLabel={`${item.funded} of ${item.needed} ${item.name} sponsored`}
                  />
                  <p className="mt-3 text-sm font-semibold text-ink/70">
                    {item.funded} of {item.needed} sponsored
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink/55">
                    {item.funded === 0
                      ? "Be the first to sponsor one."
                      : remaining && remaining > 0
                        ? `${remaining} still needed — help finish this one.`
                        : "Fully sponsored — praise God!"}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-serif text-5xl font-bold text-sea">{money(item.unitCost)}</p>
                  <p className="mt-2 max-w-[16rem] text-sm text-ink/70">
                    Every missionary serves unpaid and raises {money(item.unitCost)} to go.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-content py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            {item.needed !== null ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-ink/10 bg-white p-5 text-center shadow-sm">
                  <p className="font-serif text-3xl font-bold text-sea tabular-nums">
                    {item.funded}
                  </p>
                  <p className="mt-1 text-sm text-ink/70">sponsored so far</p>
                </div>
                <div className="rounded-xl border border-ink/10 bg-white p-5 text-center shadow-sm">
                  <p className="font-serif text-3xl font-bold text-sea tabular-nums">
                    {remaining}
                  </p>
                  <p className="mt-1 text-sm text-ink/70">still needed</p>
                </div>
                <div className="rounded-xl border border-ink/10 bg-white p-5 text-center shadow-sm">
                  <p className="font-serif text-3xl font-bold text-sea tabular-nums">
                    {money(raisedUsd)}
                  </p>
                  <p className="mt-1 text-sm text-ink/70">
                    raised of {targetUsd !== null ? money(targetUsd) : ""}
                  </p>
                </div>
              </div>
            ) : null}

            {detail ? (
              <>
                <blockquote className="mt-8 rounded-2xl border border-ink/10 border-l-4 border-l-gold bg-white p-7 shadow-sm">
                  {detail.quote.paragraphs.map((text) => (
                    <p
                      key={text.slice(0, 32)}
                      className="mb-4 font-serif text-lg italic leading-relaxed text-ink/85 last:mb-0"
                    >
                      {text}
                    </p>
                  ))}
                  <cite className="mt-4 block text-sm not-italic text-ink/60">
                    — from{" "}
                    <Link
                      href={detail.quote.href}
                      className="font-semibold text-sea hover:underline"
                    >
                      {detail.quote.source}
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
                    {detail.budget.map((line) => (
                      <li
                        key={line.label}
                        className="flex justify-between gap-2 border-b border-ink/5 pb-2 last:border-b-0"
                      >
                        <span>{line.label}</span>
                        <span className="font-semibold">{line.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>

          <div id="sponsor" className="lg:sticky lg:top-24 lg:self-start">
            <SponsorPurchase item={item} />
          </div>
        </div>
      </section>

      <section className="bg-sand-dark py-12 sm:py-14">
        <div className="container-content">
          <GoalMeter raised={raised} />

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-display text-2xl sm:text-3xl">Keep filling the trunks</h2>
            <Link href="/sponsor" className="font-semibold text-sea hover:underline">
              All supplies →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/sponsor/${rel.id}`}
                className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sea/10 text-sea">
                    <SupplyIcon kind={rel.icon} className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-sand-dark px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink/70">
                    {money(rel.unitCost)} each
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold group-hover:text-sea">
                  {rel.name}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/70">{rel.blurb}</p>
                <p className="mt-3 text-sm font-semibold text-sea group-hover:underline">
                  Sponsor this →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
