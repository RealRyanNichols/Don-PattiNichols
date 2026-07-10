/** 2.5 → "$2.50", 1200 → "$1,200" — whole dollars drop the cents. */
export function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/** "2026-07-09" → "July 9, 2026" — locale-stable for SSG. */
export function formatDate(isoDate: string) {
  return new Date(isoDate + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
