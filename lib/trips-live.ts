import { trips as seedTrips, type Trip } from "@/content/trips";
import { supabaseAnonKey, supabaseUrl } from "./supabase";

/** A trip plus its live fundraising progress from the Supabase `trips` table. */
export type LiveTrip = Trip & { raisedUsd: number };

type DbTripRow = {
  slug: string;
  title: string;
  location: string;
  date_label: string | null;
  start_date: string | null;
  status: string;
  summary: string | null;
  body: string | null;
  goal_usd: number | string | null;
  raised_usd: number | string | null;
};

function toLiveTrip(row: DbTripRow): LiveTrip {
  // Photos and any richer body still come from the matching seed trip (the
  // self-hosted gallery lives in lib/photos); DB fields win for everything else.
  const seed = seedTrips.find((t) => t.slug === row.slug);
  const body = String(row.body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    slug: row.slug,
    title: row.title,
    location: row.location,
    dateLabel: row.date_label || seed?.dateLabel || "Dates announced soon",
    startDate: row.start_date || "",
    status: row.status === "completed" ? "completed" : "upcoming",
    summary: row.summary || seed?.summary || "",
    body: body.length ? body : (seed?.body ?? []),
    goalUsd: row.goal_usd != null ? Number(row.goal_usd) : (seed?.goalUsd ?? null),
    raisedUsd: Number(row.raised_usd) || 0,
    photos: seed?.photos ?? [],
  };
}

const seedAsLive = (t: Trip): LiveTrip => ({ ...t, raisedUsd: 0 });

/** Upcoming first, then completed. */
function orderTrips(list: LiveTrip[]): LiveTrip[] {
  const rank = (t: LiveTrip) => (t.status === "upcoming" ? 0 : 1);
  return [...list].sort((a, b) => rank(a) - rank(b) || b.startDate.localeCompare(a.startDate));
}

/**
 * All trips, read from Supabase (server-side), merged over the seed trips in
 * content/trips.ts. Falls back to the seeds alone if the fetch fails, so the
 * Trips page never goes dark. Revalidates every 5 minutes.
 */
export async function getAllTrips(): Promise<LiveTrip[]> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/trips?select=slug,title,location,date_label,start_date,status,summary,body,goal_usd,raised_usd`,
      {
        headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
        next: { revalidate: 300 },
      },
    );
    if (res.ok) {
      const rows: DbTripRow[] = await res.json();
      const dbTrips = rows.filter((r) => r.slug && r.title).map(toLiveTrip);
      if (dbTrips.length > 0) {
        const seedOnly = seedTrips
          .filter((seed) => !dbTrips.some((db) => db.slug === seed.slug))
          .map(seedAsLive);
        return orderTrips([...dbTrips, ...seedOnly]);
      }
    }
  } catch {
    // fall through to seeds
  }
  return orderTrips(seedTrips.map(seedAsLive));
}

export async function getTripLive(slug: string): Promise<LiveTrip | undefined> {
  const all = await getAllTrips();
  return all.find((t) => t.slug === slug);
}
