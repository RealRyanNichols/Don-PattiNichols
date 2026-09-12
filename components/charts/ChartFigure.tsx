import type { ChartSpec, BarDatum } from "@/content/charts";
import { ogCardImage } from "@/lib/seo";

/**
 * CHARTS — server-rendered inline SVG, no library, no JavaScript.
 *
 * Built to the data-viz method: the form follows the data's job (bars for
 * magnitude, columns for years, a stacked bar for part-to-whole, a pictogram
 * for "nine of a thing"); one validated hue for a single series with emphasis
 * in the accent; thin marks with a 4px rounded data-end; a hairline baseline;
 * selective labels; a native tooltip on every mark; and a table view under
 * every figure so no value is gated behind a hover or a colour.
 *
 * Every figure ends with the source line, because on this site the source IS
 * the point.
 */

const W = 680;
const LABEL_W = 190;
const BAR_H = 18;
const ROW = 34;
const PAD_R = 76;

const fmt = (unit: "usd" | "count" | "lb", n: number) =>
  unit === "usd"
    ? n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: n % 1 ? 2 : 0,
      })
    : unit === "lb"
      ? `${n.toLocaleString("en-US")} lb`
      : n.toLocaleString("en-US");

/** A bar with a square baseline end and a 4px rounded data end (horizontal). */
function hbar(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2);
  return `M${x},${y} h${w - r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - r} z`;
}
/** A column with a square baseline and a 4px rounded cap (vertical). */
function vbar(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, h / 2);
  return `M${x},${y + h} v-${h - r} a${r},${r} 0 0 1 ${r},-${r} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - r} z`;
}

function Bars({ spec }: { spec: Extract<ChartSpec, { type: "bars" }> }) {
  const max = Math.max(...spec.data.map((d) => d.value), 1);
  const barW = W - LABEL_W - PAD_R;
  const H = spec.data.length * ROW + 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title} className="h-auto w-full">
      {/* baseline */}
      <line x1={LABEL_W} y1={2} x2={LABEL_W} y2={H - 4} stroke="var(--viz-axis)" strokeWidth={1} />
      {spec.data.map((d, i) => {
        const y = i * ROW + 8;
        const w = Math.max(2, (d.value / max) * barW);
        const label = fmt(spec.unit, d.value);
        return (
          <g key={d.label} className="viz-hit" tabIndex={0}>
            <title>{`${d.label}: ${label}${d.note ? ` — ${d.note}` : ""}`}</title>
            <text x={LABEL_W - 10} y={y + BAR_H / 2 + 4} textAnchor="end" fontSize={13} fill="var(--viz-ink-2)">
              {d.label.length > 30 ? d.label.slice(0, 28) + "…" : d.label}
            </text>
            {/* hit area larger than the mark */}
            <rect x={LABEL_W} y={y - 6} width={barW + PAD_R} height={BAR_H + 12} fill="transparent" />
            <path d={hbar(LABEL_W + 1, y, w, BAR_H)} fill={d.emphasis ? "var(--viz-series-2)" : "var(--viz-series-1)"} />
            <text x={LABEL_W + 1 + w + 8} y={y + BAR_H / 2 + 4} fontSize={13} fontWeight={600} fill="var(--viz-ink)">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Columns({ spec }: { spec: Extract<ChartSpec, { type: "columns" }> }) {
  const max = Math.max(...spec.data.map((d) => d.value), 1);
  const H = 220;
  const top = 26;
  const base = H - 36;
  const plotH = base - top;
  const slot = W / spec.data.length;
  const colW = Math.min(24, slot * 0.55);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title} className="h-auto w-full">
      {/* recessive gridlines at each whole count */}
      {Array.from({ length: max }, (_, i) => i + 1).map((v) => (
        <line key={v} x1={0} y1={base - (v / max) * plotH} x2={W} y2={base - (v / max) * plotH} stroke="var(--viz-grid)" strokeWidth={1} />
      ))}
      <line x1={0} y1={base} x2={W} y2={base} stroke="var(--viz-axis)" strokeWidth={1} />
      {spec.data.map((d, i) => {
        const cx = i * slot + slot / 2;
        const h = (d.value / max) * plotH;
        return (
          <g key={d.label} className="viz-hit" tabIndex={0}>
            <title>{`${d.label}: ${d.value} ${d.value === 1 ? "trip" : "trips"}${d.note ? ` — ${d.note}` : ""}`}</title>
            <rect x={cx - slot / 2} y={top - 10} width={slot} height={plotH + 40} fill="transparent" />
            {d.gap ? (
              <g>
                <circle cx={cx} cy={base - 8} r={4} fill="var(--viz-surface)" stroke="var(--viz-muted)" strokeWidth={2} />
              </g>
            ) : (
              <>
                <path d={vbar(cx - colW / 2, base - h, colW, h)} fill={d.emphasis ? "var(--viz-series-2)" : "var(--viz-series-1)"} />
                {d.value > 0 && (
                  <text x={cx} y={base - h - 6} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--viz-ink)">
                    {d.value}
                  </text>
                )}
              </>
            )}
            <text x={cx} y={base + 18} textAnchor="middle" fontSize={11} fill={d.gap ? "var(--viz-ink-3)" : "var(--viz-ink-2)"}>
              {d.label.slice(2)}
            </text>
          </g>
        );
      })}
      <text x={0} y={H - 4} fontSize={11} fill="var(--viz-ink-3)">
        ○ no trips that year
      </text>
    </svg>
  );
}

function Stacked({ spec }: { spec: Extract<ChartSpec, { type: "stacked" }> }) {
  const total = spec.segments.reduce((s, x) => s + x.value, 0);
  const H = 110;
  const barY = 28;
  const barH = 24;
  const gap = 2;
  const colors = ["var(--viz-series-1)", "var(--viz-series-2)", "var(--viz-series-3)"];
  // Each segment starts where the previous ones end — computed up front so
  // nothing is mutated while rendering.
  const starts = spec.segments.reduce<number[]>((acc, s, i) => {
    const prev = i === 0 ? 0 : acc[i - 1] + (spec.segments[i - 1].value / total) * W;
    acc.push(prev);
    return acc;
  }, []);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title} className="h-auto w-full">
      {spec.segments.map((s, i) => {
        const w = (s.value / total) * W - (i < spec.segments.length - 1 ? gap : 0);
        const x0 = starts[i];
        const pct = Math.round((s.value / total) * 100);
        const inside = w > 150;
        return (
          <g key={s.label} className="viz-hit" tabIndex={0}>
            <title>{`${s.label}: ${fmt("usd", s.value)} (${pct}%)${s.note ? ` — ${s.note}` : ""}`}</title>
            <rect x={x0} y={barY} width={w} height={barH} rx={i === 0 || i === spec.segments.length - 1 ? 4 : 0} fill={colors[i % colors.length]} />
            {inside && (
              <text x={x0 + 12} y={barY + barH / 2 + 5} fontSize={13} fontWeight={700} fill="#ffffff">
                {fmt("usd", s.value)} · {pct}%
              </text>
            )}
            {/* legend row below: swatch + label + value, so nothing is colour-alone */}
            <rect x={x0} y={barY + barH + 18} width={12} height={12} rx={2} fill={colors[i % colors.length]} />
            <text x={x0 + 18} y={barY + barH + 28} fontSize={12} fill="var(--viz-ink-2)">
              {s.label}
              {!inside ? ` · ${fmt("usd", s.value)} (${pct}%)` : ""}
            </text>
          </g>
        );
      })}
      <text x={W} y={16} textAnchor="end" fontSize={12} fill="var(--viz-ink-3)">
        {fmt("usd", total)} total
      </text>
    </svg>
  );
}

function Pictogram({ spec }: { spec: Extract<ChartSpec, { type: "pictogram" }> }) {
  const per = 9;
  const cell = W / per;
  const rows = Math.ceil(spec.count / per);
  const H = rows * 78 + 34;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${spec.title}: ${spec.total}`} className="h-auto w-full">
      {Array.from({ length: spec.count }).map((_, i) => {
        const x = (i % per) * cell + cell / 2 - 26;
        const y = Math.floor(i / per) * 78 + 8;
        return (
          <g key={i} className="viz-hit" tabIndex={0}>
            <title>{`Trunk ${i + 1} of ${spec.count}: ${spec.each}`}</title>
            <rect x={x} y={y + 14} width={52} height={40} rx={5} fill="var(--viz-series-1)" />
            <rect x={x} y={y + 14} width={52} height={12} rx={5} fill="var(--viz-series-2)" />
            <rect x={x + 18} y={y + 8} width={16} height={8} rx={2} fill="var(--viz-series-2)" />
            <rect x={x + 22} y={y + 30} width={8} height={10} rx={1} fill="#ffffff" />
            <text x={x + 26} y={y + 70} textAnchor="middle" fontSize={11} fill="var(--viz-ink-2)">
              {spec.each}
            </text>
          </g>
        );
      })}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--viz-ink)">
        {spec.total}
      </text>
    </svg>
  );
}

function TableView({ spec }: { spec: ChartSpec }) {
  const rows: { label: string; value: string; note?: string }[] =
    spec.type === "stacked"
      ? spec.segments.map((s) => ({ label: s.label, value: fmt("usd", s.value), note: s.note }))
      : spec.type === "pictogram"
        ? [{ label: `${spec.count} trunks`, value: spec.total, note: `${spec.each} each` }]
        : spec.data.map((d: BarDatum) => ({
            label: d.label,
            value: d.gap ? "—" : fmt(spec.unit, d.value),
            note: d.note,
          }));
  return (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer font-semibold text-sea">Show as a table</summary>
      <table className="mt-2 w-full text-left">
        <thead>
          <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/55">
            <th className="py-1.5 pr-2">Item</th>
            <th className="py-1.5 pr-2 text-right">Value</th>
            <th className="py-1.5">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-ink/5">
              <td className="py-1.5 pr-2 text-ink">{r.label}</td>
              <td className="py-1.5 pr-2 text-right tabular-nums text-ink">{r.value}</td>
              <td className="py-1.5 text-ink/60">{r.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

/** The figure: title, plot, table view, source, and a share-card link. */
export default function ChartFigure({ spec, sharePath }: { spec: ChartSpec; sharePath?: string }) {
  const card = ogCardImage({
    eyebrow: "By the numbers",
    title: `${spec.headline.value} ${spec.headline.label}`,
    line: spec.title,
    meta: "Don's real budget",
  });
  return (
    <figure id={`chart-${spec.id}`} className="viz my-10 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 sm:p-6">
      <figcaption>
        <p className="font-serif text-xl font-bold text-ink">{spec.title}</p>
        {spec.subtitle && <p className="mt-1 text-sm text-ink/65">{spec.subtitle}</p>}
      </figcaption>
      <div className="mt-4">
        {spec.type === "bars" && <Bars spec={spec} />}
        {spec.type === "columns" && <Columns spec={spec} />}
        {spec.type === "stacked" && <Stacked spec={spec} />}
        {spec.type === "pictogram" && <Pictogram spec={spec} />}
      </div>
      <TableView spec={spec} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 pt-3 text-xs text-ink/50">
        <span>Source: {spec.source}</span>
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sea hover:underline"
          title={sharePath ? `Share card for ${sharePath}` : "Share card"}
        >
          Share this number →
        </a>
      </div>
    </figure>
  );
}
