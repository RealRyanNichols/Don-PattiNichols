import Link from "next/link";
import type { Allocation } from "@/lib/donations";
import { usd } from "@/lib/donations";

/**
 * Aggregate website records, not a statement of PayPal settlement or spending.
 * No donor names or individual gifts appear in this component.
 */
export default function GivingProgress({
  a,
  dark = false,
  showItems = true,
  heading = "Giving recorded so far",
}: {
  a: Allocation;
  dark?: boolean;
  showItems?: boolean;
  heading?: string;
}) {
  const text = dark ? "text-white" : "text-ink";
  const muted = dark ? "text-white/70" : "text-ink/65";
  const faint = dark ? "text-white/50" : "text-ink/45";
  const track = dark ? "bg-white/15" : "bg-ink/10";
  const panel = dark ? "bg-white/5 ring-white/15" : "bg-white ring-ink/10";

  return (
    <div>
      <h2 className={`h-display text-3xl ${dark ? "!text-white" : ""}`}>
        {heading}
      </h2>

      {a.status === "unavailable" ? (
        <p className={`mt-4 text-lg leading-relaxed ${muted}`}>
          The giving records are temporarily unavailable. Please check again
          later. This does not mean no gifts have been received.
        </p>
      ) : a.giftless ? (
        <p className={`mt-4 text-lg leading-relaxed ${muted}`}>
          No gifts are recorded in the website totals yet. Gifts sent through
          PayPal or another way may not appear here until the records are
          updated.
        </p>
      ) : (
        <>
          {/* The headline number */}
          <div className={`mt-6 rounded-2xl p-6 ring-1 sm:p-7 ${panel}`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p
                  className={`text-sm font-bold uppercase tracking-widest ${dark ? "text-gold" : "text-sea"}`}
                >
                  Recorded gifts
                </p>
                <p className={`font-serif text-5xl font-bold ${text}`}>
                  {usd(a.raisedUsd)}
                </p>
                <p className={`mt-1 text-[15px] ${muted}`}>
                  {a.giftCount} {a.giftCount === 1 ? "gift" : "gifts"}
                  {a.monthlyCount > 0
                    ? ` · ${a.monthlyCount} marked monthly`
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold uppercase tracking-widest ${faint}`}
                >
                  Budget remaining
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
              aria-label={`Recorded gifts equal ${a.pctOfGoal}% of the trip budget`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-sea to-gold transition-[width] duration-700"
                style={{ width: `${a.pctOfGoal}%` }}
              />
            </div>
            <p className={`mt-2 text-sm ${faint}`}>
              {a.pctOfGoal}% of Don&rsquo;s published trip budget.
            </p>
          </div>

          {/* Where it went */}
          {showItems && !a.itemsAvailable && (
            <p className={`mt-6 ${muted}`}>
              Gifts by item are temporarily unavailable. The total above is
              still available.
            </p>
          )}
          {showItems && a.itemsAvailable && (
            <div className="mt-8">
              <h3 className={`font-serif text-xl font-bold ${text}`}>
                Recorded gifts by item
              </h3>
              <p className={`mt-1 text-[15px] leading-relaxed ${muted}`}>
                Each line compares designated gifts with Don&rsquo;s published
                budget. It shows funding recorded, not supplies purchased or
                delivered.
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
                              {usd(i.fundedUsd)} recorded
                              {i.unitsFunded > 0
                                ? ` · ${i.unitsFunded} units budgeted`
                                : ""}
                              {i.stillNeededUsd !== null && i.stillNeededUsd > 0
                                ? ` · ${usd(i.stillNeededUsd)} to go`
                                : i.stillNeededUsd === 0
                                  ? " · budget covered in records"
                                  : ""}
                            </>
                          ) : (
                            <span className={faint}>
                              No designated gifts recorded
                            </span>
                          )}
                        </span>
                      </div>
                      <div
                        className={`mt-1.5 h-2 w-full overflow-hidden rounded-full ${track}`}
                      >
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
                <p
                  className={`mt-5 rounded-xl px-4 py-3 text-[15px] leading-relaxed ${
                    dark
                      ? "bg-white/5 text-white/75"
                      : "bg-sand-dark text-ink/70"
                  }`}
                >
                  <strong>{usd(a.undesignatedUsd)}</strong> in recorded gifts is
                  not assigned to the items shown here. It counts in the total
                  above and is left out of the item bars.
                </p>
              )}
            </div>
          )}
        </>
      )}

      <p className={`mt-6 text-xs leading-relaxed ${faint}`}>
        These are aggregate website records. PayPal gifts are not currently
        synchronized automatically, so these figures may be incomplete. They do
        not verify payment settlement or supplies delivered. Donor names and
        individual gifts are not displayed here.
      </p>
    </div>
  );
}
