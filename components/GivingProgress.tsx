import Link from "next/link";
import type { Allocation } from "@/lib/donations";
import { usd } from "@/lib/donations";

/**
 * WHAT GIVING HAS DONE — the total, what it went toward, what is still short.
 *
 * Every number here is a real gift that actually arrived. Nothing is seeded,
 * padded, or projected. Before the first gift it says so plainly rather than
 * showing an empty bar pretending to be a full campaign.
 *
 * No donor names and no individual amounts appear anywhere in this component,
 * and no public code path can reach them.
 */
export default function GivingProgress({
  a,
  dark = false,
  showItems = true,
  heading = "What giving has done so far",
}: {
  a: Allocation;
  dark?: boolean;
  showItems?: boolean;
  heading?: string;
}) {
  const empty = a.giftless;
  const text = dark ? "text-white" : "text-ink";
  const muted = dark ? "text-white/70" : "text-ink/65";
  const faint = dark ? "text-white/50" : "text-ink/45";
  const track = dark ? "bg-white/15" : "bg-ink/10";
  const panel = dark ? "bg-white/5 ring-white/15" : "bg-white ring-ink/10";

  return (
    <div>
      <h2 className={`h-display text-3xl ${dark ? "!text-white" : ""}`}>{heading}</h2>

      {empty ? (
        <p className={`mt-4 text-lg leading-relaxed ${muted}`}>
          No gifts have come in through the website yet. The moment one does,
          this fills in on its own — the total, what it bought, and what is
          still short. Nothing here is ever a placeholder.
        </p>
      ) : (
        <>
          {/* The headline number */}
          <div className={`mt-6 rounded-2xl p-6 ring-1 sm:p-7 ${panel}`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={`text-sm font-bold uppercase tracking-widest ${dark ? "text-gold" : "text-sea"}`}>
                  Given so far
                </p>
                <p className={`font-serif text-5xl font-bold ${text}`}>
                  {usd(a.raisedUsd)}
                </p>
                <p className={`mt-1 text-[15px] ${muted}`}>
                  {a.giftCount} {a.giftCount === 1 ? "gift" : "gifts"}
                  {a.monthlyCount > 0
                    ? ` · ${a.monthlyCount} giving monthly`
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold uppercase tracking-widest ${faint}`}>
                  Still needed
                </p>
                <p className={`font-serif text-3xl font-bold ${text}`}>
                  {usd(a.stillNeededUsd)}
                </p>
                <p className={`mt-1 text-[15px] ${muted}`}>
                  toward {usd(a.goalUsd)}
                </p>
              </div>
            </div>

            <div
              className={`mt-5 h-4 w-full overflow-hidden rounded-full ${track}`}
              role="progressbar"
              aria-valuenow={a.pctOfGoal}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${a.pctOfGoal}% of the trip goal raised`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-sea to-gold transition-[width] duration-700"
                style={{ width: `${Math.max(a.pctOfGoal, 1.5)}%` }}
              />
            </div>
            <p className={`mt-2 text-sm ${faint}`}>
              {a.pctOfGoal}% of Don&rsquo;s published trip budget.
            </p>
          </div>

          {/* Where it went */}
          {showItems && (
            <div className="mt-8">
              <h3 className={`font-serif text-xl font-bold ${text}`}>
                What it went toward
              </h3>
              <p className={`mt-1 text-[15px] leading-relaxed ${muted}`}>
                Each line is a real item on Don&rsquo;s trip budget. Green means
                covered; the rest is what still needs a sponsor.
              </p>

              <ul className="mt-5 space-y-4">
                {a.items
                  .filter((i) => i.fundedUsd > 0)
                  .concat(a.items.filter((i) => i.fundedUsd === 0))
                  .map((i) => (
                    <li key={i.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <Link
                          href={`/sponsor/${i.id}`}
                          className={`font-semibold underline-offset-4 hover:underline ${text}`}
                        >
                          {i.name}
                        </Link>
                        <span className={`text-sm ${muted}`}>
                          {i.fundedUsd > 0 ? (
                            <>
                              {usd(i.fundedUsd)} in
                              {i.unitsFunded > 0 ? ` · ${i.unitsFunded} covered` : ""}
                              {i.stillNeededUsd !== null && i.stillNeededUsd > 0
                                ? ` · ${usd(i.stillNeededUsd)} to go`
                                : i.stillNeededUsd === 0
                                  ? " · fully funded"
                                  : ""}
                            </>
                          ) : (
                            <span className={faint}>
                              Nobody has sponsored this yet
                            </span>
                          )}
                        </span>
                      </div>
                      <div className={`mt-1.5 h-2 w-full overflow-hidden rounded-full ${track}`}>
                        <div
                          className={`h-full rounded-full transition-[width] duration-700 ${
                            i.pct >= 100 ? "bg-sea" : "bg-gold"
                          }`}
                          style={{ width: `${i.pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
              </ul>

              {a.undesignatedUsd > 0 && (
                <p className={`mt-5 rounded-xl px-4 py-3 text-[15px] leading-relaxed ${
                  dark ? "bg-white/5 text-white/75" : "bg-sand-dark text-ink/70"
                }`}>
                  <strong>{usd(a.undesignatedUsd)}</strong> was given without
                  naming an item — it goes wherever the need is greatest. It
                  counts in the total above but is deliberately left out of the
                  bars, because filling a bar with money nobody assigned to it
                  would not be true.
                </p>
              )}
            </div>
          )}
        </>
      )}

      <p className={`mt-6 text-xs leading-relaxed ${faint}`}>
        Every figure comes from gifts that actually arrived. Donor names and
        individual amounts are never shown here — only Don and Patti can see
        those.
      </p>
    </div>
  );
}
