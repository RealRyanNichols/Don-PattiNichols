"use client";

import { useEffect, useState } from "react";

/**
 * A hairline of gold across the top of the window showing how far through the
 * story you are.
 *
 * Small thing, real effect: on a long piece it tells the reader "this ends,
 * and you're most of the way there" — which is exactly the moment people
 * decide whether to keep going or bail.
 */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const h = document.documentElement;
        const scrollable = h.scrollHeight - h.clientHeight;
        setPct(scrollable > 0 ? Math.min(100, (h.scrollTop / scrollable) * 100) : 0);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (pct <= 0.5) return null;
  return <div className="read-progress" style={{ width: `${pct}%` }} aria-hidden />;
}
