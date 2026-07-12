"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { money, slugify } from "@/lib/format";

type TripRow = {
  id: string;
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

type Draft = {
  title: string;
  location: string;
  date_label: string;
  start_date: string;
  status: "upcoming" | "completed";
  goal_usd: string;
  summary: string;
  body: string;
};

const blankDraft: Draft = {
  title: "",
  location: "Belize",
  date_label: "",
  start_date: "",
  status: "upcoming",
  goal_usd: "",
  summary: "",
  body: "",
};

function toDraft(t: TripRow): Draft {
  return {
    title: t.title ?? "",
    location: t.location ?? "",
    date_label: t.date_label ?? "",
    start_date: t.start_date ?? "",
    status: t.status === "completed" ? "completed" : "upcoming",
    goal_usd: t.goal_usd != null ? String(t.goal_usd) : "",
    summary: t.summary ?? "",
    body: t.body ?? "",
  };
}

const field =
  "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-base focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30";

export default function TripsTab() {
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null); // null = list, "new" = create
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("trips")
      .select(
        "id, slug, title, location, date_label, start_date, status, summary, body, goal_usd, raised_usd",
      )
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) setError("Could not load the trips. Please refresh and try again.");
    setTrips(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setDraft(blankDraft);
    setEditingId("new");
    setNotice("");
    setError("");
  }

  function startEdit(t: TripRow) {
    setDraft(toDraft(t));
    setEditingId(t.id);
    setNotice("");
    setError("");
  }

  async function save() {
    if (!draft.title.trim()) {
      setError("Please give the trip a title.");
      return;
    }
    setSaving(true);
    setError("");
    const row = {
      title: draft.title.trim(),
      location: draft.location.trim() || "Belize",
      date_label: draft.date_label.trim() || null,
      start_date: draft.start_date || null,
      status: draft.status,
      summary: draft.summary.trim() || null,
      body: draft.body.trim() || null,
      goal_usd: draft.goal_usd.trim() ? Number(draft.goal_usd) : null,
    };

    let saveError = null;
    if (editingId && editingId !== "new") {
      const res = await supabase.from("trips").update(row).eq("id", editingId);
      saveError = res.error;
    } else {
      const res = await supabase.from("trips").insert({ ...row, slug: slugify(draft.title) });
      saveError = res.error;
    }
    setSaving(false);
    if (saveError) {
      setError(
        saveError.message.includes("duplicate")
          ? "A trip with a very similar title already exists. Try a slightly different title."
          : "Could not save. Please try again.",
      );
      return;
    }
    setEditingId(null);
    setNotice("Saved. Your changes are live on the website.");
    load();
  }

  if (loading) {
    return <p className="py-12 text-center text-ink/60">Loading the trips…</p>;
  }

  // ---- Editor ----
  if (editingId) {
    const isNew = editingId === "new";
    return (
      <div className="mx-auto max-w-2xl">
        <button onClick={() => setEditingId(null)} className="text-sm font-semibold text-sea hover:underline">
          ← Back to the list
        </button>
        <h2 className="h-display mt-3 text-2xl">{isNew ? "Add a new trip" : "Edit this trip"}</h2>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-1.5 block font-semibold">Trip title</span>
            <input
              className={field}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Belize Medical Mission Trip"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-semibold">Place</span>
            <input
              className={field}
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-semibold">Dates (in words)</span>
              <input
                className={field}
                value={draft.date_label}
                onChange={(e) => setDraft({ ...draft, date_label: e.target.value })}
                placeholder="June 2026"
              />
              <span className="mt-1 block text-sm text-ink/55">
                Shown on the site. E.g. &ldquo;June 2026&rdquo; or &ldquo;Dates announced soon&rdquo;.
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-semibold">Departure date</span>
              <input
                type="date"
                className={field}
                value={draft.start_date}
                onChange={(e) => setDraft({ ...draft, start_date: e.target.value })}
              />
              <span className="mt-1 block text-sm text-ink/55">
                Setting this turns on the countdown on the homepage. Leave blank if unknown.
              </span>
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-semibold">Is this trip…</span>
              <select
                className={field}
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as Draft["status"] })}
              >
                <option value="upcoming">Coming up</option>
                <option value="completed">Already happened</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-semibold">Fundraising goal (dollars)</span>
              <input
                inputMode="numeric"
                className={field}
                value={draft.goal_usd}
                onChange={(e) => setDraft({ ...draft, goal_usd: e.target.value.replace(/[^0-9.]/g, "") })}
                placeholder="Leave blank until you've set one"
              />
              <span className="mt-1 block text-sm text-ink/55">
                When set, a progress bar shows how much has come in.
              </span>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block font-semibold">Short summary</span>
            <textarea
              rows={2}
              className={field}
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              placeholder="One or two sentences describing the trip."
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-semibold">The full story</span>
            <textarea
              rows={7}
              className={field}
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              placeholder="Write as much as you like. Leave a blank line between paragraphs."
            />
          </label>

          {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? "Saving…" : "Save this trip"}
            </button>
            <button onClick={() => setEditingId(null)} className="btn-outline">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- List ----
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="h-display text-2xl">Mission Trips</h2>
          <p className="mt-1 text-ink/60">Add a trip, set the dates, or post a fundraising goal.</p>
        </div>
        <button onClick={startNew} className="btn-primary !px-5 !py-2.5">
          + Add a new trip
        </button>
      </div>

      {notice ? (
        <p className="mt-5 rounded-lg bg-sea/10 px-4 py-3 font-medium text-sea">{notice}</p>
      ) : null}
      {error ? <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}

      <div className="mt-6 space-y-3">
        {trips.length === 0 ? (
          <p className="rounded-xl bg-sand-dark p-6 text-ink/70">
            No trips yet. Click &ldquo;Add a new trip&rdquo; to create the first one.
          </p>
        ) : (
          trips.map((t) => {
            const goal = t.goal_usd != null ? Number(t.goal_usd) : null;
            const raised = Number(t.raised_usd) || 0;
            return (
              <div
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    {t.status === "completed" ? "Already happened" : "Coming up"} ·{" "}
                    {t.date_label || "no dates yet"}
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-bold">{t.title}</h3>
                  <p className="mt-0.5 text-sm text-ink/60">
                    {goal ? `${money(raised)} raised of ${money(goal)}` : `${money(raised)} raised · no goal set`}
                  </p>
                </div>
                <button onClick={() => startEdit(t)} className="btn-outline !px-4 !py-2.5">
                  Edit
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
