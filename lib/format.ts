/** "2026-07-09" → "July 9, 2026" — locale-stable for SSG. */
export function formatDate(isoDate: string) {
  return new Date(isoDate + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
