import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { paypalDonateUrl } from "@/lib/paypal";
import {
  joinUs,
  supportIntro,
  givingLevels,
  missionaryCost,
  suppliesBudget,
  logisticsBudget,
  supportClose,
} from "@/content/support";
import GiveLink from "@/components/GiveLink";
import GivePicker from "@/components/GivePicker";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/give` },
  title: "Give to the Mission",
  description:
    "Partner with Don & Patti Nichols to bring free medical care, Bibles, and the hope of Jesus Christ to the villages of Belize. $2.50 places a Bible in someone's hands. $1,200 sends a missionary.",
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function GivePage() {
  const { funds, paypalUrl, org501c3 } = site.giving;

  return (
    <>
      {/* HERO */}
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Partner With the Mission
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">{joinUs.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            {joinUs.paragraphs[0]}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#give-now" className="btn-give text-lg">
              Give Now
            </a>
            <Link
              href="/sponsor"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Fill the Trunks
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PICKER */}
      <section id="give-now" className="container-content -mt-8 max-w-2xl sm:-mt-10">
        <div className="relative z-10">
          <GivePicker />
        </div>
      </section>

      {/* GIVING LEVELS */}
      <section className="container-content py-14 sm:py-16">
        <p className="eyebrow">What a Gift Does</p>
        <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
          Every gift, large or small, becomes part of something much greater
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {givingLevels.map((g) => {
            const dollars = Number(g.amount.replace(/[^0-9.]/g, ""));
            const href = paypalDonateUrl(
              `${g.amount} Gift — Belize Mission (Don & Patti Nichols)`,
              dollars
            );
            return (
              <a
                key={g.amount}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-ink/10 border-t-2 border-t-gold bg-white p-6 shadow-sm transition-[transform,box-shadow,background-color,color] duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-serif text-3xl font-bold text-sea">{g.amount}</p>
                <p className="mt-2 flex-1 text-ink/75">{g.does}</p>
                <span className="mt-4 text-sm font-semibold text-gold-dark group-hover:underline">
                  Give {g.amount} with PayPal →
                </span>
              </a>
            );
          })}
        </div>
        <p className="mt-6 rounded-xl bg-sand-dark p-4 text-center text-ink/75">
          Want to pick the exact supplies and watch the trip fill up, item by item?{" "}
          <Link href="/sponsor" className="font-bold text-sea hover:underline">
            Fill the Trunks →
          </Link>
        </p>
      </section>

      {/* DESIGNATED FUNDS */}
      <section className="bg-sand-dark py-14 sm:py-16">
        <div className="container-content">
          <p className="eyebrow">You Choose Where It Goes</p>
          <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
            Designate your gift
          </h2>
          <p className="mt-3 max-w-2xl text-ink/75">
            Pick the part of the mission God has put on your heart. Every fund is used exactly
            as designated.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {funds.map((fund) => (
              <div
                key={fund.id}
                className="flex flex-col rounded-xl border border-ink/10 bg-white p-6 shadow-sm"
              >
                <h3 className="font-serif text-xl font-bold">{fund.label}</h3>
                <p className="mt-2 flex-1 text-sm text-ink/70">{fund.blurb}</p>
                <div className="mt-4">
                  <GiveLink
                    href={fund.paypalUrl || "#ways-to-give"}
                    location="fund_card"
                    fund={fund.id}
                    className="btn-give w-full !px-4 !py-2.5"
                  >
                    Give to This Fund
                  </GiveLink>
                  <p className="mt-2 text-center text-xs text-ink/55">
                    One-time or monthly — you choose at checkout
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MONTHLY */}
      <section id="monthly" className="container-content py-14 sm:py-16">
        <div className="rounded-2xl bg-deep p-8 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            The Monthly Mission Team
          </p>
          <h2 className="h-display mt-2 max-w-2xl text-3xl !text-white sm:text-4xl">
            The most powerful way to give is monthly
          </h2>
          <p className="mt-4 max-w-2xl text-white/85">
            Recurring gifts let the team plan trips, buy supplies in bulk, and say yes to needs
            the moment they appear — instead of waiting for the next fundraising season. Even
            $10 a month stocks hygiene kits and Bibles all year long.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-white/70">
            Choose any fund above and select &ldquo;monthly&rdquo; at PayPal checkout — that&rsquo;s
            it. Cancel anytime from your PayPal account.
          </p>
          <GiveLink location="monthly_section" href="#give-now" className="btn-give mt-6">
            Become a Monthly Partner
          </GiveLink>
        </div>
      </section>

      {/* TRANSPARENCY / BUDGET */}
      <section className="bg-sand-dark py-14 sm:py-16">
        <div className="container-content max-w-4xl">
          <p className="eyebrow">Where the Money Goes</p>
          <h2 className="h-display mt-2 text-3xl sm:text-4xl">Full transparency</h2>
          <div className="prose-mission mt-6">
            {supportIntro.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>

          <p className="mt-5 text-[0.95rem] text-ink/75">
            <Link
              href="/what-a-mission-trip-costs"
              className="font-semibold text-sea underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
            >
              See the full price list
            </Link>{" "}
            — a Bible, a hygiene kit, a pair of reading glasses, a plane ticket.
            Every number is what Don actually pays.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold">One Missionary</h3>
              <p className="mt-1 font-serif text-3xl font-bold text-sea">
                {fmt(missionaryCost.total)}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                {missionaryCost.breakdown.map((b) => (
                  <li key={b.label} className="flex justify-between gap-2">
                    <span>{b.label}</span>
                    <span className="font-semibold">{fmt(b.amount)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink/60">{missionaryCost.note}</p>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold">{suppliesBudget.title}</h3>
              <p className="mt-1 font-serif text-3xl font-bold text-sea">
                ~{fmt(suppliesBudget.total)}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                {suppliesBudget.items.map((b) => (
                  <li key={b.label} className="flex justify-between gap-2">
                    <span>{b.label}</span>
                    <span className="font-semibold">{fmt(b.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold">{logisticsBudget.title}</h3>
              <p className="mt-1 font-serif text-3xl font-bold text-sea">
                ~{fmt(logisticsBudget.total)}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                {logisticsBudget.items.map((b) => (
                  <li key={b.label} className="flex justify-between gap-2">
                    <span>{b.label}</span>
                    <span className="font-semibold">{fmt(b.amount)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink/60">{logisticsBudget.intro}</p>
            </div>
          </div>

          <p className="prose-mission mt-8">
            <span className="font-semibold">{supportClose}</span>
          </p>
        </div>
      </section>

      {/* WAYS TO GIVE */}
      <section id="ways-to-give" className="container-content max-w-4xl py-14 sm:py-16">
        <p className="eyebrow">Ways to Give</p>
        <h2 className="h-display mt-2 text-3xl sm:text-4xl">Give the way that works for you</h2>

        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-ink/10 border-t-2 border-t-gold bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold">
              PayPal — Card, Bank, or PayPal Balance
            </h3>
            {funds.some((f) => f.paypalUrl) || paypalUrl ? (
              <div className="mt-2 space-y-3 text-ink/75">
                <p>
                  Our giving runs through PayPal — give with a card, your bank, or your PayPal
                  balance, no account required. Use the &ldquo;Give to This Fund&rdquo; button on
                  any fund above, and choose one-time or monthly at checkout.
                </p>
                {paypalUrl ? (
                  <GiveLink href={paypalUrl} location="paypal_general" className="btn-give">
                    Give Now with PayPal
                  </GiveLink>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-ink/75">
                PayPal giving is being connected right now and will be live here very soon. The
                options below work today — or{" "}
                <Link href="/#newsletter" className="font-semibold text-sea hover:underline">
                  join the email list
                </Link>{" "}
                and we&rsquo;ll tell you the moment online giving opens.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold">Tax-Deductible Giving</h3>
            {org501c3.name ? (
              <div className="mt-2 space-y-2 text-ink/75">
                <p>
                  Tax-deductible gifts can be made through{" "}
                  <span className="font-semibold">{org501c3.name}</span>.
                </p>
                {org501c3.instructions ? <p>{org501c3.instructions}</p> : null}
                {org501c3.address ? (
                  <p className="whitespace-pre-line rounded-lg bg-sand-dark p-4 font-medium">
                    {org501c3.address}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-ink/75">
                Details for tax-deductible giving through the mission&rsquo;s sponsoring
                organization are being finalized and will be posted here.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold">By Check</h3>
            {org501c3.address ? (
              <p className="mt-2 whitespace-pre-line text-ink/75">{org501c3.address}</p>
            ) : (
              <p className="mt-2 text-ink/75">
                Mailing instructions will be posted here.{" "}
                <Link href="/contact" className="font-semibold text-sea hover:underline">
                  Contact us
                </Link>{" "}
                and we&rsquo;ll send them to you directly.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* JOIN US — Don's full appeal */}
      <section className="bg-sand-dark py-14 sm:py-16">
        <div className="container-content max-w-3xl">
          <p className="eyebrow">A Word From the Mission</p>
          <h2 className="h-display mt-2 text-3xl sm:text-4xl">Together, we can change lives for eternity</h2>
          <div className="prose-mission mt-6">
            {joinUs.paragraphs.slice(1).map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#give-now" className="btn-give">
              Give Now
            </a>
            <Link href="/contact" className="btn-outline">
              Commit to Pray
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
