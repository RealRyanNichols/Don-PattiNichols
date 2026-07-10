"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** 0–100 */
  percent: number;
  size?: number;
  strokeWidth?: number;
  /** Large center text; defaults to the animated percent. */
  centerLabel?: string;
  subLabel?: string;
  ariaLabel: string;
};

/**
 * Animated donut progress ring — pure SVG + CSS transitions.
 * Reveals when scrolled into view, counts the center number up in sync,
 * and respects prefers-reduced-motion.
 */
export default function ProgressRing({
  percent,
  size = 180,
  strokeWidth = 14,
  centerLabel,
  subLabel = "sponsored",
  ariaLabel,
}: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setInView(true);
      setShown(clamped);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [clamped]);

  useEffect(() => {
    if (!inView || shown === clamped) return;
    const start = performance.now();
    const duration = 1200;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(eased * clamped));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, clamped]);

  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = inView ? c * (1 - clamped / 100) : c;

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={ariaLabel}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id="ring-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c9962e" />
            <stop offset="100%" stopColor="#a87b1f" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-ink/10"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-gold)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl font-bold tabular-nums text-ink">
          {centerLabel ?? `${shown}%`}
        </span>
        <span className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-ink/55">
          {subLabel}
        </span>
      </div>
    </div>
  );
}
