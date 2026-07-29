"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, storageUrl, slugify } from "@/lib/supabaseClient";
import { storageImage } from "@/lib/storageImage";
import { albums as driveAlbums } from "@/content/albums";
import Dashboard from "./Dashboard";
import People from "./People";
import Donations from "./Donations";

/**
 * ADMIN — built for a phone held in one hand.
 *
 * Don or Patti sign in with a link emailed to them, then:
 *   • Post — a story with photos, tags, an album, and an optional give/buy button
 *   • Albums — create a new album or add to one that already exists
 *   • Thanks — write a thank-you note to someone who gave
 *
 * Nothing publishes until they tap Publish. Everything is theirs to edit.
 */

type Tab = "home" | "post" | "album" | "thanks" | "money" | "people";
type Album = { id: string; slug: string; title: string };

const FIELD =
  "w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-4 text-lg text-ink placeholder:text-ink/35 focus:border-sea focus:outline-none focus:ring-4 focus:ring-sea/20";
const LABEL = "block text-lg font-bold text-ink";
const HELP = "mt-1.5 text-base leading-relaxed text-ink/60";

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAuthor, setIsAuthor] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [showAccount, setShowAccount] = useState(false);

  useEffect(() => {
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Confirm the signed-in email is on the author allow-list.
  useEffect(() => {
    if (!session) {
      setIsAuthor(null);
      return;
    }
    supabase()
      .from("site_authors")
      .select("handle")
      .then(({ data, error }) => setIsAuthor(!error && !!data && data.length > 0));
  }, [session]);

  if (!ready) {
    return <Centered>Loading…</Centered>;
  }

  if (!session) return <SignIn />;

  if (isAuthor === false) {
    return (
      <Centered>
        <p className="font-serif text-xl text-ink">
          That email isn&rsquo;t set up to post yet.
        </p>
        <p className={HELP}>
          Signed in as {session.user.email}. Ask Ryan to add this address.
        </p>
        <button
          type="button"
          onClick={() => supabase().auth.signOut()}
          className="btn-outline mt-6"
        >
          Sign out
        </button>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen bg-sand pb-20">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="container-content flex items-center justify-between py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sea">
              Don &amp; Patti
            </p>
            <p className="font-serif text-xl font-bold text-ink">Your website</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowAccount(true)}
              className="text-base font-semibold text-sea underline"
            >
              Your account
            </button>
            <button
              type="button"
              onClick={() => supabase().auth.signOut()}
              className="text-base font-semibold text-ink/50 underline"
            >
              Sign out
            </button>
          </div>
        </div>
        {/*
          Six tabs on two rows of three rather than six squeezed across one.
          On a 390px phone a single row leaves each target about 55px wide with
          the label clipped; this keeps every one of them big enough to hit
          without looking, which is the whole point.
        */}
        <nav className="container-content grid grid-cols-3 gap-2 pb-3" role="tablist">
          {(
            [
              ["home", "Home"],
              ["post", "Write"],
              ["album", "Photos"],
              ["thanks", "Thanks"],
              ["money", "Money"],
              ["people", "People"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`rounded-lg px-2 py-3.5 text-base font-bold transition ${
                tab === key
                  ? "bg-sea text-white"
                  : "bg-sand-dark text-ink/70 hover:bg-sand-dark/70"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="container-content safe-bottom max-w-3xl py-6">
        {/*
          Don and Patti both start on the same password Ryan texted them. This
          nudge stays on screen until each of them has picked their own — it is
          the one security step that actually matters here, so it is a plain
          sentence and a big button, not a lock icon they would ignore.
        */}
        {!session.user.user_metadata?.password_set && !showAccount && (
          <div className="mb-6 rounded-2xl border-2 border-gold bg-white p-5">
            <p className="font-serif text-xl font-bold text-ink">
              Pick your own password
            </p>
            <p className={HELP}>
              You&rsquo;re still using the password Ryan set up for you. Choose
              one only you know — it takes about ten seconds.
            </p>
            <button
              type="button"
              onClick={() => setShowAccount(true)}
              className="btn-give mt-4 !py-4 !text-base"
            >
              Choose my password
            </button>
          </div>
        )}

        {showAccount && (
          <AccountPanel
            email={session.user.email ?? ""}
            onClose={() => setShowAccount(false)}
          />
        )}

        {/* `key={tab}` remounts on every switch, which is what re-runs the
            fade. Without it React reuses the node and the transition never
            plays. */}
        <div key={tab} className="tab-panel">
          {tab === "home" && <Dashboard onGoto={setTab} />}
          {tab === "post" && <PostComposer email={session.user.email ?? ""} />}
          {tab === "album" && <AlbumManager />}
          {tab === "thanks" && <ThanksComposer />}
          {/* Money = what came in (gifts) and what went out (the ledger). */}
          {tab === "money" && (
            <div className="space-y-8">
              <Donations />
              <LedgerComposer />
            </div>
          )}
          {tab === "people" && <People />}
        </div>
      </main>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-6">
      <div className="w-full max-w-sm text-center">{children}</div>
    </div>
  );
}

/* ------------------------------- SIGN IN ------------------------------- */

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  /**
   * PRIMARY: plain email + password, one button — Ryan's explicit call:
   * "I don't want them to receive a sign in link." No inbox round-trip.
   * The emailed link/code below survives only as the forgot-password fallback.
   */
  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error)
      setError(
        "That email and password didn't match. Check both, or tap the link option below.",
      );
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  /**
   * The email carries BOTH a gold sign-in button and a 6-digit code. The code
   * path exists because the link can misfire for older folks — email opens on
   * the iPad instead of the phone, or a mail app breaks the link. Typing six
   * digits always works, on any device.
   */
  async function checkCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().length < 6) return;
    setBusy(true);
    setError("");
    const { error } = await supabase().auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });
    setBusy(false);
    if (error)
      setError(
        "That code didn't match. Check the newest email, or send yourself a fresh one.",
      );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-deep px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto h-10 w-10 text-gold"
          >
            <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
          </svg>
          <h1 className="h-display mt-5 text-3xl !text-white sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-white/75">
            This is where you post to your website.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          {sent ? (
            <div className="text-center">
              <p className="h-display text-2xl">Check your email</p>
              <p className="mt-3 text-lg leading-relaxed text-ink/75">
                We just sent a link to <strong>{email}</strong>.
              </p>
              <p className="mt-4 rounded-xl bg-sand-dark p-4 text-base leading-relaxed text-ink/70">
                Open your email on this same phone and tap that link. That&rsquo;s
                it — you&rsquo;ll be signed right in. There is no password.
              </p>
              <form onSubmit={checkCode} className="mt-6 border-t border-ink/10 pt-5 text-left">
                <label className="block text-lg font-bold text-ink" htmlFor="otp-code">
                  Or type the 6-digit code from the email
                </label>
                <div className="mt-2.5 flex gap-2">
                  <input
                    id="otp-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-4 text-center font-mono text-2xl tracking-[0.4em] text-ink focus:border-sea focus:outline-none focus:ring-4 focus:ring-sea/20"
                    placeholder="000000"
                  />
                  <button
                    type="submit"
                    disabled={busy || code.length < 6}
                    className="shrink-0 rounded-xl bg-sea px-5 text-base font-bold text-white transition hover:bg-sea-dark disabled:opacity-40"
                  >
                    Go
                  </button>
                </div>
              </form>
              {error && (
                <p className="mt-3 rounded-xl bg-red-50 p-3 text-left text-base text-red-700">
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={() => { setSent(false); setCode(""); setError(""); }}
                className="mt-5 text-base font-semibold text-sea underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={signIn} className="space-y-5">
              <div>
                <label
                  className="block text-lg font-bold text-ink"
                  htmlFor="admin-email"
                >
                  Your email address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2.5 w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-4 text-lg text-ink placeholder:text-ink/35 focus:border-sea focus:outline-none focus:ring-4 focus:ring-sea/20"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  className="block text-lg font-bold text-ink"
                  htmlFor="admin-password"
                >
                  Your password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2.5 w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-4 text-lg text-ink placeholder:text-ink/35 focus:border-sea focus:outline-none focus:ring-4 focus:ring-sea/20"
                  placeholder="Your password"
                />
                <p className="mt-1.5 text-base text-ink/60">
                  Ryan gave you this. Your phone can remember it for you.
                </p>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 p-4 text-base text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-gold px-6 py-4 text-xl font-bold text-ink transition hover:bg-gold-dark hover:text-white disabled:opacity-60"
              >
                {busy ? "Signing in…" : "Sign In"}
              </button>

              <button
                type="button"
                onClick={send}
                disabled={busy || !email.trim()}
                className="w-full text-center text-base font-semibold text-sea underline disabled:opacity-40"
              >
                Forgot your password? Email me a sign-in link instead
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-white/50">
          Trouble signing in? Call Ryan.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ SHARED BITS ----------------------------- */

/**
 * Photo picker: upload from the phone, with live thumbnails and a caption box
 * under each one.
 *
 * Don asked for the captions himself — "can I go under each pic and give a one
 * line description of that pic?" — the day he published his first story. They
 * are not decoration. Without them every photo renders with an empty alt
 * attribute, which means Google Images cannot see it and a blind reader is told
 * nothing at all. One line from the man who was standing there fixes both.
 *
 * Captions are matched to photos by position, so removing a photo has to remove
 * its caption in the same move or every caption after it slides onto the wrong
 * picture.
 */
function PhotoUploader({
  urls,
  setUrls,
  captions,
  setCaptions,
}: {
  urls: string[];
  setUrls: (u: string[]) => void;
  /** Optional: the album manager has nowhere to put captions yet. */
  captions?: string[];
  setCaptions?: (c: string[]) => void;
}) {
  const caps = captions ?? [];
  const applyCaps = setCaptions ?? (() => {});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setError("");
    const added: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase()
        .storage.from("mission-photos")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (error) setError(error.message);
      else added.push(storageUrl(path));
    }
    setUrls([...urls, ...added]);
    // Keep the caption array the same length as the photo array.
    applyCaps([...caps, ...added.map(() => "")]);
    setBusy(false);
    e.target.value = "";
  }

  function removeAt(i: number) {
    setUrls(urls.filter((_, n) => n !== i));
    applyCaps(caps.filter((_, n) => n !== i));
  }

  function captionAt(i: number, value: string) {
    const next = [...caps];
    while (next.length < urls.length) next.push("");
    next[i] = value;
    applyCaps(next);
  }

  return (
    <div>
      <label className={LABEL}>Photos &amp; video stills</label>
      <p className={HELP}>
        Take a picture or pick from your camera roll. You can add several.
      </p>
      <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sea/40 bg-white px-4 py-6 text-sea">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-bold">{busy ? "Uploading…" : "Add photos"}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={onPick}
          disabled={busy}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {urls.length > 0 && (
        <>
          {setCaptions && <p className={`${HELP} mt-4`}>
            Add a line under any picture — where it was, who&rsquo;s in it, what
            was happening. It shows under the photo on the website, and it&rsquo;s
            how people searching find it. Leave any of them blank if you&rsquo;d
            rather.
          </p>}
          <ul className="mt-3 space-y-4">
            {urls.map((u, i) => (
              <li
                key={u}
                className="flex gap-3 rounded-xl bg-white p-3 ring-1 ring-ink/10"
              >
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={storageImage(u, 200)}
                    alt=""
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="absolute -right-2 -top-2 rounded-full bg-black/70 p-1.5 text-white"
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <label className="sr-only" htmlFor={`cap-${i}`}>
                    Description for photo {i + 1}
                  </label>
                  <textarea
                    id={`cap-${i}`}
                    value={caps[i] ?? ""}
                    onChange={(e) => captionAt(i, e.target.value)}
                    rows={3}
                    placeholder="What is this a picture of?"
                    className="w-full rounded-lg border-2 border-ink/15 bg-white px-3 py-2 text-base text-ink placeholder:text-ink/35 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/20"
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Saved({ message, href }: { message: string; href?: string }) {
  return (
    <div className="mb-5 rounded-xl bg-sea/10 p-4 text-sea-dark">
      <p className="font-bold">{message}</p>
      {href && (
        <a href={href} className="mt-1 inline-block text-sm underline">
          View it on the site →
        </a>
      )}
    </div>
  );
}

/* ----------------------------- POST COMPOSER ---------------------------- */

const SUGGESTED_TAGS = [
  "Malawi",
  "Dominican Republic",
  "Belize",
  "Water Wells",
  "Medical Clinic",
  "Preaching",
  "Widows & Orphans",
  "Bibles",
  "Prayer Request",
  "Thank You",
  "Update from Home",
];

/* ------------------------------ WRITE A POST ----------------------------- */

/**
 * THE WRITING SCREEN — rebuilt so nothing Don writes can be lost.
 *
 * What went wrong on July 29, 2026: Don started a post about Bibles, tapped
 * "Save draft" early on purpose (he wanted to go pull photos off Facebook and
 * come back to it), and the screen wiped itself clean. The draft was safe in
 * the database the whole time — but there was no list of drafts and no way to
 * reopen one, so from where he sat it had simply vanished. He phoned Ryan to
 * ask where it went.
 *
 * Three things now stand between him and that happening again:
 *
 *   1. EVERY KEYSTROKE IS KEPT ON HIS PHONE. What he types is written to the
 *      phone's own storage about a second after he stops typing. A phone call,
 *      a closed tab, a flat battery, or a new version of this site going live
 *      mid-sentence cannot take his words.
 *   2. DRAFTS ARE LISTED AND REOPENABLE. Everything unpublished sits at the top
 *      of this screen. One tap puts it back in the box, exactly as he left it.
 *   3. SAVING KEEPS HIM WHERE HE IS. Saving a draft no longer clears anything.
 *      He stays in his post, and once it exists it saves itself again every
 *      twenty seconds while he works.
 *
 * The database always allowed authors to edit their posts (`posts_author_all`).
 * Only the screen was missing. This adds it.
 */

type DraftRow = {
  id: string;
  title: string;
  body: string | null;
  author_handle: string;
  published: boolean;
  tags: string[] | null;
  photo_urls: string[] | null;
  photo_captions: string[] | null;
  album_id: string | null;
  link_url: string | null;
  link_label: string | null;
  updated_at?: string | null;
  created_at: string;
};

/** Where in-progress writing is parked on the phone itself. */
const SCRATCH_KEY = "dp-admin-scratch-v1";

type Scratch = {
  postId: string | null;
  title: string;
  body: string;
  author: "don" | "patti";
  tags: string[];
  photos: string[];
  captions: string[];
  albumId: string;
  linkUrl: string;
  linkLabel: string;
  at: number;
};

function readScratch(): Scratch | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SCRATCH_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Scratch;
    if (!s || (!s.title?.trim() && !s.body?.trim())) return null;
    return s;
  } catch {
    return null;
  }
}

function writeScratch(s: Scratch) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SCRATCH_KEY, JSON.stringify(s));
  } catch {
    // A full or locked storage must never break the ability to type.
  }
}

function clearScratch() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SCRATCH_KEY);
  } catch {
    /* ignore */
  }
}

function whenWords(iso?: string | null) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function PostComposer({ email }: { email: string }) {
  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState<"don" | "patti">("don");
  const [tags, setTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [albumId, setAlbumId] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [autoNote, setAutoNote] = useState("");
  const [recovery, setRecovery] = useState<Scratch | null>(null);

  const loadDrafts = useCallback(async () => {
    const { data } = await supabase()
      .from("site_posts")
      .select(
        "id,title,body,author_handle,published,tags,photo_urls,photo_captions,album_id,link_url,link_label,created_at",
      )
      .eq("published", false)
      .order("created_at", { ascending: false })
      .limit(50);
    setDrafts((data as DraftRow[]) ?? []);
  }, []);

  useEffect(() => {
    supabase()
      .from("site_albums")
      .select("id,slug,title")
      .order("created_at", { ascending: false })
      .then(({ data }) => setAlbums((data as Album[]) ?? []));
    void loadDrafts();
  }, [loadDrafts, saved]);

  // On arrival, offer back anything left mid-sentence last time.
  useEffect(() => {
    const s = readScratch();
    if (s) setRecovery(s);
  }, []);

  const dirty = title.trim().length > 0 || body.trim().length > 0;

  // Park the work on the phone a second after typing stops.
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      writeScratch({
        postId,
        title,
        body,
        author,
        tags,
        photos,
        captions,
        albumId,
        linkUrl,
        linkLabel,
        at: Date.now(),
      });
    }, 900);
    return () => clearTimeout(t);
  }, [dirty, postId, title, body, author, tags, photos, captions, albumId, linkUrl, linkLabel]);

  // Once a draft exists in the database, keep it up to date on its own.
  useEffect(() => {
    if (!postId || !dirty) return;
    const t = setInterval(() => {
      void save(false, true);
    }, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, dirty, title, body, tags, photos, albumId, linkUrl, linkLabel, author]);

  // Last line of defence: if the tab is closing, park it synchronously.
  useEffect(() => {
    function onHide() {
      if (!dirty) return;
      writeScratch({
        postId, title, body, author, tags, photos, captions, albumId, linkUrl, linkLabel,
        at: Date.now(),
      });
    }
    window.addEventListener("pagehide", onHide);
    window.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("visibilitychange", onHide);
    };
  }, [dirty, postId, title, body, author, tags, photos, captions, albumId, linkUrl, linkLabel]);

  const slug = useMemo(() => slugify(title), [title]);

  const toggleTag = useCallback(
    (t: string) =>
      setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])),
    [],
  );

  function openDraft(d: DraftRow) {
    setPostId(d.id);
    setTitle(d.title ?? "");
    setBody(d.body ?? "");
    setAuthor(d.author_handle === "patti" ? "patti" : "don");
    setTags(d.tags ?? []);
    setPhotos(d.photo_urls ?? []);
    setCaptions(d.photo_captions ?? []);
    setAlbumId(d.album_id ?? "");
    setLinkUrl(d.link_url ?? "");
    setLinkLabel(d.link_label ?? "");
    setSaved("");
    setError("");
    setAutoNote("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startFresh() {
    setPostId(null);
    setTitle("");
    setBody("");
    setTags([]);
    setPhotos([]);
    setCaptions([]);
    setAlbumId("");
    setLinkUrl("");
    setLinkLabel("");
    setSaved("");
    setError("");
    setAutoNote("");
    clearScratch();
  }

  /**
   * Save. `quiet` is the every-twenty-seconds autosave, which must never steal
   * focus or shout. Editing an existing post UPDATES it — the old version
   * inserted a brand new row every time, which is how a draft could be saved
   * and still feel missing.
   */
  async function save(publishNow: boolean, quiet = false) {
    if (!title.trim()) {
      if (!quiet) setError("Give it a title first — even a rough one.");
      return;
    }
    if (!quiet) setBusy(true);
    setError("");

    const fields = {
      title: title.trim(),
      body: body,
      excerpt: body.trim().split("\n")[0]?.slice(0, 180) ?? "",
      author_handle: author,
      tags,
      photo_urls: photos,
      photo_captions: captions,
      album_id: albumId || null,
      link_url: linkUrl.trim() || null,
      link_label: linkLabel.trim() || null,
      published: publishNow,
      published_at: publishNow ? new Date().toISOString() : null,
    };

    const sb = supabase();
    let err = null;
    let id = postId;

    if (postId) {
      const { error } = await sb.from("site_posts").update(fields).eq("id", postId);
      err = error;
    } else {
      const { data, error } = await sb
        .from("site_posts")
        .insert({ ...fields, slug: `${slug}-${Date.now().toString(36).slice(-4)}` })
        .select("id")
        .single();
      err = error;
      id = (data as { id: string } | null)?.id ?? null;
      if (!err && id) setPostId(id);
    }

    if (!quiet) setBusy(false);

    if (err) {
      // Keep the scratch copy. Whatever else fails, his words survive.
      if (!quiet) setError(`${err.message} — your writing is still saved on this phone.`);
      else setAutoNote("Couldn't reach the site — your writing is safe on this phone.");
      return;
    }

    if (publishNow) {
      clearScratch();
      setSaved("Posted. It's live on the site.");
      startFresh();
      void loadDrafts();
      return;
    }

    // A saved draft leaves everything on screen. He stays where he is.
    clearScratch();
    setAutoNote(quiet ? `Saved by itself · ${whenWords(new Date().toISOString())}` : "Draft saved.");
    void loadDrafts();
  }

  return (
    <div className="space-y-6">
      {saved && <Saved message={saved} href="/blog" />}

      {/* Anything left mid-sentence last time. */}
      {recovery && (
        <section className="rounded-2xl border-2 border-gold bg-white p-5">
          <p className="font-serif text-xl font-bold text-ink">
            You were in the middle of something
          </p>
          <p className="mt-1.5 text-base leading-relaxed text-ink/65">
            &ldquo;{(recovery.title || recovery.body).slice(0, 80)}
            {(recovery.title || recovery.body).length > 80 ? "…" : ""}&rdquo; —
            from {whenWords(new Date(recovery.at).toISOString())}. Nothing was lost.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="btn-give flex-1 !py-4 !text-base"
              onClick={() => {
                setPostId(recovery.postId);
                setTitle(recovery.title);
                setBody(recovery.body);
                setAuthor(recovery.author);
                setTags(recovery.tags ?? []);
                setPhotos(recovery.photos ?? []);
                setCaptions(recovery.captions ?? []);
                setAlbumId(recovery.albumId ?? "");
                setLinkUrl(recovery.linkUrl ?? "");
                setLinkLabel(recovery.linkLabel ?? "");
                setRecovery(null);
              }}
            >
              Put it back
            </button>
            <button
              type="button"
              className="btn-outline flex-1 !py-4 !text-base"
              onClick={() => {
                clearScratch();
                setRecovery(null);
              }}
            >
              Throw it away
            </button>
          </div>
        </section>
      )}

      {/* Drafts — the thing that was missing. */}
      {drafts.length > 0 && (
        <section className="rounded-2xl border-2 border-sea/25 bg-white p-5">
          <h2 className="font-serif text-xl font-bold text-ink">
            Your drafts
          </h2>
          <p className="mt-1.5 text-base leading-relaxed text-ink/60">
            Started but not posted yet. Tap one to pick it back up.
          </p>
          <ul className="mt-4 divide-y divide-ink/10">
            {drafts.map((d) => (
              <li key={d.id} className="py-3">
                <button
                  type="button"
                  onClick={() => openDraft(d)}
                  className="w-full text-left"
                >
                  <p className="font-serif text-lg font-bold text-sea underline-offset-4 hover:underline">
                    {d.title || "Untitled"}
                    {postId === d.id ? " — open now" : ""}
                  </p>
                  <p className="mt-0.5 text-sm text-ink/50">
                    {d.author_handle === "patti" ? "Patti" : "Don"} ·{" "}
                    {d.body?.trim()
                      ? `${d.body.trim().split(/\s+/).length} words`
                      : "no story written yet"}{" "}
                    · started {whenWords(d.created_at)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(postId || dirty) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-base font-semibold text-ink/70">
            {postId ? "Working on a draft" : "New post"}
          </p>
          <button
            type="button"
            onClick={startFresh}
            className="text-base font-semibold text-sea underline"
          >
            Start a new one instead
          </button>
        </div>
      )}

      <div>
        <label className={LABEL} htmlFor="p-author">
          Who&rsquo;s writing?
        </label>
        <div className="mt-2 flex gap-2">
          {(["don", "patti"] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setAuthor(h)}
              className={`flex-1 rounded-xl px-4 py-4 text-lg font-bold capitalize transition ${
                author === h ? "bg-sea text-white" : "bg-white text-ink ring-1 ring-ink/15"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="p-title">
          Title
        </label>
        <input
          id="p-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${FIELD} mt-1.5`}
          placeholder="A well in the village"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="p-body">
          Tell the story
        </label>
        <textarea
          id="p-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={9}
          className={`${FIELD} mt-1.5 leading-relaxed`}
          placeholder="Write it the way you'd tell it out loud."
        />
        <p className={HELP}>
          Blank lines make new paragraphs. Your writing is kept on this phone as
          you go — you can close this and come back.
        </p>
      </div>

      <PhotoUploader
        urls={photos}
        setUrls={setPhotos}
        captions={captions}
        setCaptions={setCaptions}
      />

      <div>
        <label className={LABEL}>Tags</label>
        <p className={HELP}>Tap any that fit. They help people find this later.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTED_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`rounded-full px-4 py-2.5 text-base font-semibold transition ${
                tags.includes(t)
                  ? "bg-gold text-ink"
                  : "bg-white text-ink/70 ring-1 ring-ink/15"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="p-album">
          Add to an album
        </label>
        <select
          id="p-album"
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className={`${FIELD} mt-1.5`}
        >
          <option value="">Not part of an album</option>
          {albums.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
        {albums.length === 0 && (
          <p className={HELP}>
            No new albums yet — make one on the Albums tab. (The {driveAlbums.length}{" "}
            original albums are already on the site.)
          </p>
        )}
      </div>

      <fieldset className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
        <legend className="px-2 text-sm font-bold text-ink">
          Add a button (optional)
        </legend>
        <p className={HELP}>
          Put a Give or Buy button at the bottom of this post.
        </p>
        <div className="mt-3 space-y-3">
          <input
            value={linkLabel}
            onChange={(e) => setLinkLabel(e.target.value)}
            className={FIELD}
            placeholder="Button text — e.g. Help fund the next well"
          />
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className={FIELD}
            inputMode="url"
            placeholder="Link — e.g. /give or a PayPal link"
          />
        </div>
      </fieldset>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-base text-red-700">{error}</p>
      )}
      {autoNote && !error && (
        <p className="rounded-lg bg-sea/10 p-3 text-base font-semibold text-sea">
          {autoNote}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-ink/10 bg-sand/95 px-4 py-4 backdrop-blur">
        <button
          type="button"
          disabled={busy}
          onClick={() => save(false)}
          className="flex-1 rounded-xl border-2 border-sea px-5 py-4 text-base font-bold text-sea transition hover:bg-sea hover:text-white"
        >
          {postId ? "Save changes" : "Save draft"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => save(true)}
          className="flex-1 rounded-xl bg-sea px-5 py-4 text-base font-bold text-white transition hover:bg-sea-dark disabled:opacity-60"
        >
          {busy ? "Working…" : "Publish"}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- ALBUM MANAGER ---------------------------- */

function AlbumManager() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState("");
  const [era, setEra] = useState("");
  const [blurb, setBlurb] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    supabase()
      .from("site_albums")
      .select("id,slug,title")
      .order("created_at", { ascending: false })
      .then(({ data }) => setAlbums((data as Album[]) ?? []));
  }, []);

  useEffect(load, [load]);

  async function createAlbum() {
    if (!title.trim()) {
      setError("Give the album a name.");
      return;
    }
    setBusy(true);
    setError("");
    const slug = `${slugify(title)}-${Date.now().toString(36).slice(-4)}`;
    const { data, error } = await supabase()
      .from("site_albums")
      .insert({
        slug,
        title: title.trim(),
        era: era.trim(),
        blurb: blurb.trim(),
        cover_url: photos[0] ?? null,
      })
      .select("id")
      .single();

    if (error || !data) {
      setBusy(false);
      setError(error?.message ?? "Could not create the album.");
      return;
    }

    if (photos.length) {
      await supabase()
        .from("album_photos")
        .insert(
          photos.map((url, i) => ({ album_id: data.id, url, sort_order: i })),
        );
    }
    setBusy(false);
    setSaved(`"${title}" created with ${photos.length} photo${photos.length === 1 ? "" : "s"}.`);
    setTitle("");
    setEra("");
    setBlurb("");
    setPhotos([]);
    load();
  }

  async function addToExisting() {
    if (!target || !photos.length) {
      setError("Pick an album and add at least one photo.");
      return;
    }
    setBusy(true);
    setError("");
    const { error } = await supabase()
      .from("album_photos")
      .insert(photos.map((url, i) => ({ album_id: target, url, sort_order: i })));
    setBusy(false);
    if (error) setError(error.message);
    else {
      setSaved(`Added ${photos.length} photo${photos.length === 1 ? "" : "s"}.`);
      setPhotos([]);
    }
  }

  return (
    <div className="space-y-8">
      {saved && <Saved message={saved} href="/albums" />}

      <section className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
        <h2 className="font-serif text-xl font-bold text-ink">
          Add photos to an album
        </h2>
        <div className="mt-4 space-y-4">
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className={FIELD}
          >
            <option value="">Choose an album…</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
          <PhotoUploader urls={photos} setUrls={setPhotos} />
          <button
            type="button"
            onClick={addToExisting}
            disabled={busy}
            className="w-full rounded-xl bg-sea px-6 py-4 text-lg font-bold text-white transition hover:bg-sea-dark disabled:opacity-60"
          >
            {busy ? "Working…" : "Add to album"}
          </button>
        </div>
        {albums.length === 0 && (
          <p className={HELP}>
            No albums here yet — create your first one below.
          </p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
        <h2 className="font-serif text-xl font-bold text-ink">Create a new album</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className={LABEL} htmlFor="a-title">
              Album name
            </label>
            <input
              id="a-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${FIELD} mt-1.5`}
              placeholder="Belize 2026"
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="a-era">
              When / where
            </label>
            <input
              id="a-era"
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className={`${FIELD} mt-1.5`}
              placeholder="June 2026"
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="a-blurb">
              A sentence about it
            </label>
            <textarea
              id="a-blurb"
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              rows={3}
              className={`${FIELD} mt-1.5`}
            />
          </div>
          <PhotoUploader urls={photos} setUrls={setPhotos} />
          <button
            type="button"
            onClick={createAlbum}
            disabled={busy}
            className="w-full rounded-xl bg-sea px-6 py-4 text-lg font-bold text-white transition hover:bg-sea-dark disabled:opacity-60"
          >
            {busy ? "Working…" : "Create album"}
          </button>
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}

/* ---------------------------- THANKS COMPOSER --------------------------- */

function ThanksComposer() {
  const [to, setTo] = useState("");
  const [body, setBody] = useState("");
  const [from, setFrom] = useState("Don & Patti");
  const [forWhat, setForWhat] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function post() {
    if (!to.trim() || !body.trim()) {
      setError("Add who it's to and what you want to say.");
      return;
    }
    setBusy(true);
    setError("");
    const { error } = await supabase().from("thank_you_notes").insert({
      to_name: to.trim(),
      body: body.trim(),
      from_name: from,
      for_what: forWhat.trim() || null,
      published: true,
    });
    setBusy(false);
    if (error) setError(error.message);
    else {
      setSaved("Your thank-you note is on the site.");
      setTo("");
      setBody("");
      setForWhat("");
    }
  }

  return (
    <div className="space-y-6">
      {saved && <Saved message={saved} href="/thank-you" />}

      <div className="rounded-2xl bg-sand-dark p-5">
        <p className="text-ink/75">
          These show up on the Thank You page for everyone to read.
        </p>
        <p className="mt-2 text-sm font-semibold text-ink/60">
          Please use first names only — never post someone&rsquo;s full name,
          address, or the amount they gave.
        </p>
      </div>

      <div>
        <label className={LABEL} htmlFor="t-to">
          Who are you thanking?
        </label>
        <input
          id="t-to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={`${FIELD} mt-1.5`}
          placeholder="Miss Ruth · the Hendersons · our church family"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="t-body">
          What do you want to say?
        </label>
        <textarea
          id="t-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={7}
          className={`${FIELD} mt-1.5 leading-relaxed`}
          placeholder="Say it plain. That's what people remember."
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="t-for">
          What did their gift become? (optional)
        </label>
        <input
          id="t-for"
          value={forWhat}
          onChange={(e) => setForWhat(e.target.value)}
          className={`${FIELD} mt-1.5`}
          placeholder="40 Bibles · a hygiene kit for 12 families"
        />
      </div>

      <div>
        <label className={LABEL}>Signed</label>
        <div className="mt-2 flex gap-2">
          {["Don", "Patti", "Don & Patti"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrom(f)}
              className={`flex-1 rounded-xl px-3 py-4 text-base font-bold transition ${
                from === f ? "bg-sea text-white" : "bg-white text-ink ring-1 ring-ink/15"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="button"
        onClick={post}
        disabled={busy}
        className="w-full rounded-xl bg-sea px-6 py-4 text-lg font-bold text-white transition hover:bg-sea-dark disabled:opacity-60"
      >
        {busy ? "Posting…" : "Post thank-you note"}
      </button>
    </div>
  );
}


/* ---------------------------- LEDGER COMPOSER --------------------------- */

const LEDGER_CATEGORIES = [
  ["where-needed", "Where needed most"],
  ["bible", "Bibles"],
  ["hygiene-kit", "Hygiene kits"],
  ["reading-glasses", "Reading glasses"],
  ["sunglasses", "Sunglasses"],
  ["tracts", "Gospel tracts"],
  ["pastor-gift", "Pastor gifts"],
  ["trunk", "Trunks"],
  ["baggage", "Flying trunks"],
  ["customs", "Customs & contingency"],
  ["missionary", "Missionary sponsorship"],
];

/**
 * The Money tab — how the public /transparency page gets its numbers.
 * "We received…" logs a gift; "We spent…" logs money deployed. Every entry
 * appears on donandpatti.com/transparency within a minute, which is the
 * whole point: the ledger is only as honest as the hands that keep it.
 */
function LedgerComposer() {
  const [kind, setKind] = useState<"gift" | "spent">("gift");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("where-needed");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function post() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Put in the dollar amount.");
      return;
    }
    setBusy(true);
    setError("");
    const { error } = await supabase().from("ledger_entries").insert({
      kind,
      amount_usd: amt,
      category,
      note: note.trim(),
    });
    setBusy(false);
    if (error) setError(error.message);
    else {
      setSaved(
        kind === "gift"
          ? `$${amt} gift recorded — it's on the Open Book page now.`
          : `$${amt} spending recorded — it's on the Open Book page now.`,
      );
      setAmount("");
      setNote("");
    }
  }

  return (
    <div className="space-y-6">
      {saved && <Saved message={saved} href="/transparency" />}

      <div className="rounded-2xl bg-sand-dark p-5">
        <p className="font-serif text-lg font-bold text-ink">The Open Book</p>
        <p className="mt-1 leading-relaxed text-ink/70">
          Everything you record here shows on the public Transparency page —
          that&rsquo;s how supporters watch their gifts move. Record gifts when
          they arrive in PayPal, and spending when you buy supplies.
        </p>
      </div>

      <div>
        <label className={LABEL}>What happened?</label>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setKind("gift")}
            className={`flex-1 rounded-xl px-4 py-4 text-lg font-bold transition ${
              kind === "gift" ? "bg-sea text-white" : "bg-white text-ink ring-1 ring-ink/15"
            }`}
          >
            We received a gift
          </button>
          <button
            type="button"
            onClick={() => setKind("spent")}
            className={`flex-1 rounded-xl px-4 py-4 text-lg font-bold transition ${
              kind === "spent" ? "bg-gold text-ink" : "bg-white text-ink ring-1 ring-ink/15"
            }`}
          >
            We spent money
          </button>
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="l-amount">
          How much?
        </label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-serif text-2xl font-bold text-ink/40">
            $
          </span>
          <input
            id="l-amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            className={`${FIELD} pl-10 font-serif text-2xl font-bold`}
            placeholder="50"
          />
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="l-cat">
          {kind === "gift" ? "What was it given toward?" : "What was it spent on?"}
        </label>
        <select
          id="l-cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${FIELD} mt-2`}
        >
          {LEDGER_CATEGORIES.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={LABEL} htmlFor="l-note">
          A short note <span className="font-normal text-ink/50">(optional)</span>
        </label>
        <input
          id="l-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`${FIELD} mt-2`}
          placeholder={kind === "gift" ? "PayPal gift from a friend in Texas" : "Bought 40 Bibles in Belize City"}
        />
        <p className={HELP}>
          No donor full names or personal details — first names or generalities
          only.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="button"
        onClick={post}
        disabled={busy}
        className="w-full rounded-xl bg-sea px-6 py-4 text-lg font-bold text-white transition hover:bg-sea-dark disabled:opacity-60"
      >
        {busy ? "Recording…" : "Record it in the Open Book"}
      </button>
    </div>
  );
}

/**
 * YOUR ACCOUNT — change your password.
 *
 * Deliberately the whole screen rather than a modal: on a phone a modal with a
 * keyboard open is a trap for anyone who isn't sure where the X went. Two
 * fields, one button, and plain language about what happened.
 *
 * `password_set: true` goes into user metadata so the "pick your own password"
 * nudge on the dashboard disappears for that person and only that person —
 * Don changing his does not silence Patti's.
 */
function AccountPanel({ email, onClose }: { email: string; onClose: () => void }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw.length < 8) {
      setError("Please use at least 8 characters — longer is safer.");
      return;
    }
    if (pw !== pw2) {
      setError("The two passwords don't match. Check them and try again.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase().auth.updateUser({
      password: pw,
      data: { password_set: true },
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setPw("");
    setPw2("");
    setDone(true);
  }

  return (
    <section className="mb-8 rounded-2xl border-2 border-sea/25 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">Your account</h2>
          <p className={HELP}>Signed in as {email}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-base font-semibold text-ink/50 underline"
        >
          Close
        </button>
      </div>

      {done ? (
        <div className="mt-6 rounded-xl bg-sand-dark p-5">
          <p className="font-serif text-xl font-bold text-ink">
            Your password is changed.
          </p>
          <p className={HELP}>
            Use the new one next time you sign in. Nothing else changed, and you
            are still signed in right here.
          </p>
          <button type="button" onClick={onClose} className="btn-primary mt-4 !py-4">
            Back to my website
          </button>
        </div>
      ) : (
        <form onSubmit={save} className="mt-6 space-y-5">
          <div>
            <label htmlFor="pw" className={LABEL}>
              New password
            </label>
            <p className={HELP}>
              Anything you&rsquo;ll remember — at least 8 characters.
            </p>
            <input
              id="pw"
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="new-password"
              className={`${FIELD} mt-2`}
              required
            />
          </div>
          <div>
            <label htmlFor="pw2" className={LABEL}>
              Type it once more
            </label>
            <input
              id="pw2"
              type={show ? "text" : "password"}
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              autoComplete="new-password"
              className={`${FIELD} mt-2`}
              required
            />
          </div>

          <label className="flex items-center gap-3 text-base font-semibold text-ink/70">
            <input
              type="checkbox"
              checked={show}
              onChange={(e) => setShow(e.target.checked)}
              className="h-6 w-6 rounded border-2 border-ink/25"
            />
            Show what I&rsquo;m typing
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-base font-semibold text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-give w-full !py-5 !text-lg">
            {busy ? "Saving…" : "Save my new password"}
          </button>
        </form>
      )}
    </section>
  );
}
