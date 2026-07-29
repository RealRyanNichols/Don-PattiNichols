/** Fundraising progress bar. Shows a "goal coming soon" state until a goal is set. */
export default function GoalMeter({
  goalUsd,
  raisedUsd = 0,
  dark = false,
}: {
  goalUsd?: number;
  raisedUsd?: number;
  dark?: boolean;
}) {
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  if (!goalUsd) {
    return (
      <p className={`text-sm ${dark ? "text-white/75" : "text-ink/70"}`}>
        Trip fundraising goal will be posted soon. Every gift given now goes straight to the
        mission.
      </p>
    );
  }

  const pct = Math.min(100, Math.round((raisedUsd / goalUsd) * 100));

  return (
    <div>
      <div className={`flex items-end justify-between text-sm font-semibold ${dark ? "text-white" : "text-ink"}`}>
        <span>
          {fmt(raisedUsd)} raised
        </span>
        <span className={dark ? "text-white/75" : "text-ink/60"}>Goal: {fmt(goalUsd)}</span>
      </div>
      <div className={`mt-2 h-3 w-full overflow-hidden rounded-full ${dark ? "bg-white/15" : "bg-ink/10"}`}>
        <div
          className="h-full rounded-full bg-gold transition-[transform,box-shadow,background-color,color] duration-200"
          style={{ width: `${Math.max(pct, 2)}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className={`mt-1.5 text-xs ${dark ? "text-white/70" : "text-ink/60"}`}>{pct}% of the way there</p>
    </div>
  );
}
