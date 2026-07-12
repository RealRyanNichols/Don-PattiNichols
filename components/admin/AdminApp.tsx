"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-browser";
import DonationsTab from "./DonationsTab";
import FollowersTab from "./FollowersTab";
import HelpTab from "./HelpTab";
import HomeTab from "./HomeTab";
import MessagesTab from "./MessagesTab";
import TeamTab from "./TeamTab";
import TripsTab from "./TripsTab";
import UpdatesTab from "./UpdatesTab";

export type TabId =
  | "home"
  | "messages"
  | "followers"
  | "donations"
  | "updates"
  | "trips"
  | "team"
  | "help";

const tabs: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "messages", label: "Messages" },
  { id: "followers", label: "Followers" },
  { id: "donations", label: "Donations" },
  { id: "updates", label: "Updates" },
  { id: "trips", label: "Trips" },
  { id: "team", label: "Team" },
  { id: "help", label: "Help" },
];

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      setError(
        "That email and password didn't match. Check for typos and try again — or ask Ryan for help.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
        <p className="eyebrow">Family Dashboard</p>
        <h1 className="h-display mt-2 text-3xl">Sign in</h1>
        <p className="mt-3 text-lg text-ink/70">
          This area is for Don, Patti, and Ryan to manage the website.
        </p>
        <form onSubmit={signIn} className="mt-6 space-y-5">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-lg font-semibold">
              Your email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3.5 text-lg focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-lg font-semibold">
              Your password
            </label>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3.5 text-lg focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="mt-2 text-sm font-semibold text-sea hover:underline"
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>
          {error ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full !py-4 !text-base disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabId>("home");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    let cancelled = false;
    supabase
      .rpc("is_admin")
      .then(({ data, error }) => {
        if (!cancelled) setIsAdmin(error ? false : Boolean(data));
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!ready) {
    return <p className="py-20 text-center text-lg text-ink/60">Opening the dashboard…</p>;
  }

  if (!session) {
    return <LoginCard />;
  }

  if (isAdmin === null) {
    return <p className="py-20 text-center text-lg text-ink/60">Checking your access…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-sm">
        <h1 className="h-display text-2xl">This area is just for the family</h1>
        <p className="mt-3 text-lg text-ink/70">
          You're signed in as {session.user.email}, but that email isn't on the team list yet. Ask
          Ryan to add it.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="btn-outline mt-6">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Family Dashboard</p>
          <h1 className="h-display mt-1 text-3xl sm:text-4xl">Welcome back</h1>
          <p className="mt-1 text-ink/60">Signed in as {session.user.email}</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="btn-outline !px-4 !py-2.5 !text-xs">
          Sign Out
        </button>
      </div>

      <nav
        aria-label="Dashboard sections"
        className="mt-6 flex flex-wrap gap-2 border-b border-ink/10 pb-4"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={`rounded-full px-5 py-2.5 text-base font-semibold transition-colors ${
              tab === t.id
                ? "bg-sea text-white"
                : "bg-white text-ink/70 ring-1 ring-ink/15 hover:ring-sea"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "home" ? <HomeTab onNavigate={setTab} /> : null}
        {tab === "messages" ? <MessagesTab /> : null}
        {tab === "followers" ? <FollowersTab /> : null}
        {tab === "donations" ? <DonationsTab /> : null}
        {tab === "updates" ? <UpdatesTab /> : null}
        {tab === "trips" ? <TripsTab /> : null}
        {tab === "team" ? <TeamTab selfEmail={session.user.email ?? ""} /> : null}
        {tab === "help" ? <HelpTab /> : null}
      </div>
    </div>
  );
}
