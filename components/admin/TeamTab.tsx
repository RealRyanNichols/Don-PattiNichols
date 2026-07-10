"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Admin = { email: string; added_at: string };

export default function TeamTab({ selfEmail }: { selfEmail: string }) {
  const [team, setTeam] = useState<Admin[] | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("admin_users")
      .select("email, added_at")
      .order("added_at");
    if (error) setError("Couldn't load the team list. Try refreshing the page.");
    else setTeam(data as Admin[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNote("");
    const email = newEmail.trim().toLowerCase();
    if (!email.includes("@")) {
      setError("That doesn't look like an email address.");
      return;
    }
    const { error } = await supabase.from("admin_users").insert({ email });
    if (error) {
      setError(
        error.code === "23505"
          ? "That email is already on the team."
          : "Couldn't add that email. Try again, or ask Ryan.",
      );
      return;
    }
    setNewEmail("");
    setNote(
      `${email} is on the team list. Remember: they also need a login (Ryan sets that up in Supabase).`,
    );
    load();
  }

  async function remove(email: string) {
    if (email.toLowerCase() === selfEmail.toLowerCase()) {
      const sure = window.confirm(
        "That's YOUR email — removing it locks you out of this dashboard. Are you sure?",
      );
      if (!sure) return;
    } else {
      const sure = window.confirm(`Remove ${email} from the team? They'll lose dashboard access.`);
      if (!sure) return;
    }
    const { error } = await supabase.from("admin_users").delete().eq("email", email);
    if (!error) load();
  }

  return (
    <div>
      <h2 className="h-display text-2xl">Team</h2>
      <p className="mt-2 text-lg text-ink/70">
        These people can open this dashboard. Two things are needed for each person: their email
        on this list, and a login that Ryan creates for them.
      </p>

      {error ? <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}
      {note ? <p className="mt-6 rounded-lg bg-sea/10 px-4 py-3 text-sea">{note}</p> : null}

      <div className="mt-6 space-y-3">
        {(team ?? []).map((admin) => (
          <div
            key={admin.email}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white p-5 shadow-sm"
          >
            <p className="text-lg font-semibold">
              {admin.email}
              {admin.email.toLowerCase() === selfEmail.toLowerCase() ? (
                <span className="ml-2 rounded-full bg-sea/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-sea">
                  You
                </span>
              ) : null}
            </p>
            <button
              onClick={() => remove(admin.email)}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={add} className="mt-8 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
        <p className="text-lg font-semibold">Add someone to the team</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="their-email@example.com"
            aria-label="Email to add"
            className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-lg focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30"
          />
          <button type="submit" className="btn-primary shrink-0">
            Add to Team
          </button>
        </div>
      </form>
    </div>
  );
}
