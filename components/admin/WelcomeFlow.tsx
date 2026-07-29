"use client";

import { useState } from "react";
import { supabaseInsert } from "@/lib/supabase";
import { photo, albumBySlug } from "@/content/albums";

/**
 * THE WELCOME TOUR — the first thing Don or Patti ever see of "their" side of
 * the website. Four slides in plain language, then a hand-raise form that
 * requests access. Ryan approves each request by name from his dashboard, so
 * identity is confirmed by the one person who cannot be fooled about who his
 * parents are.
 */

const TOUR = [
  {
    title: "This website is yours.",
    body: "donandpatti.com tells the story of your mission work — every trip since 2013, five countries, and 500 of your own photographs. People are already visiting it, reading it, and giving through it. This page shows you how to hold the pen.",
    image: () => photo(albumBySlug("malawi")!.cover, 900),
    caption: "You and a pastor in Malawi — already on the site.",
  },
  {
    title: "You can post, like Facebook — but it's yours.",
    body: "Write what happened, add photos straight from your camera roll, and tap Publish. It goes on your website under your own name, where nobody can take it down but you. Nothing posts until you say so, and you can take anything back down with one tap.",
    image: () => photo(albumBySlug("belize")!.cover, 900),
    caption: "The June trip to Belize — waiting for your words.",
  },
  {
    title: "You can thank the people who gave.",
    body: "There's a page on the site just for gratitude. You write a note — 'To Miss Ruth, thank you for the forty Bibles' — and it appears on the Thank You page for everyone to see. First names only; the site protects people's privacy automatically.",
    image: () => photo(albumBySlug("bible-ministry")!.cover, 900),
    caption: "Bibles your supporters paid for.",
  },
  {
    title: "And you can see who's reaching out.",
    body: "When somebody sends a prayer request, follows the mission, or leaves a comment on one of your posts, it shows up on your Home screen with a big Reply button. Comments wait for your approval before anyone else sees them.",
    image: () => photo(albumBySlug("dominican-republic")!.cover, 900),
    caption: "The people you serve — and the people who help you serve them.",
  },
];

const FIELD =
  "w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-4 text-lg text-ink placeholder:text-ink/35 focus:border-sea focus:outline-none focus:ring-4 focus:ring-sea/20";

export default function WelcomeFlow({ who }: { who: "don" | "patti" | null }) {
  const [step, setStep] = useState(0);
  const firstName = who === "don" ? "Dad" : who === "patti" ? "Mom" : null;
  const properName = who === "don" ? "Don" : who === "patti" ? "Patti" : null;

  const [name, setName] = useState(properName ? `${properName} Nichols` : "");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const atForm = step >= TOUR.length;

  async function requestAccess(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setState("sending");
    const ok = await supabaseInsert("access_requests", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      claims_to_be: who ?? "other",
      approved: false,
    });
    setState(ok ? "sent" : "error");
  }

  return (
    <div className="min-h-screen bg-deep">
      {/* Header */}
      <div className="px-5 pt-12 text-center">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mx-auto h-10 w-10 text-gold"
        >
          <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
        </svg>
        <h1 className="h-display mx-auto mt-4 max-w-xl text-3xl !text-white sm:text-4xl">
          {firstName
            ? `${firstName}, welcome to your website.`
            : "Welcome to Don & Patti's website."}
        </h1>
        {firstName && (
          <p className="mt-2 text-lg text-white/70">Ryan built this for you.</p>
        )}
      </div>

      <div className="mx-auto max-w-xl px-5 py-8">
        {!atForm ? (
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TOUR[step].image()}
              alt=""
              width={900}
              height={675}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="p-6 sm:p-8">
              <p className="text-sm italic text-ink/50">{TOUR[step].caption}</p>
              <h2 className="h-display mt-3 text-2xl sm:text-3xl">
                {TOUR[step].title}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-ink/80">
                {TOUR[step].body}
              </p>

              <div className="mt-7 flex items-center justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="text-base font-semibold text-ink/50 underline"
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-1.5" aria-hidden>
                  {TOUR.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i === step ? "w-6 bg-gold" : "w-2 bg-ink/20"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="rounded-xl bg-sea px-6 py-3.5 text-lg font-bold text-white transition hover:bg-sea-dark"
                >
                  {step === TOUR.length - 1 ? "Get started" : "Next"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            {state === "sent" ? (
              <div className="text-center">
                <p className="text-4xl" aria-hidden>
                  🙌
                </p>
                <h2 className="h-display mt-3 text-2xl">You&rsquo;re almost in.</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink/75">
                  Ryan just got your request. As soon as he approves it —
                  usually minutes — you can sign in at{" "}
                  <strong>donandpatti.com/admin</strong> with this same email.
                </p>
                <p className="mt-4 rounded-xl bg-sand-dark p-4 text-base text-ink/70">
                  Give him a call and tell him you tapped the button. He&rsquo;s
                  been waiting for this.
                </p>
              </div>
            ) : (
              <>
                <h2 className="h-display text-2xl">
                  {firstName ? `Is this you, ${firstName}?` : "Tell Ryan who you are"}
                </h2>
                <p className="mt-2 text-lg leading-relaxed text-ink/70">
                  Ryan approves every person by hand — that&rsquo;s how the
                  website stays yours and only yours. Put in your name and the
                  email you use, and he&rsquo;ll open the door.
                </p>
                <form onSubmit={requestAccess} className="mt-6 space-y-5">
                  <div>
                    <label className="block text-lg font-bold text-ink" htmlFor="w-name">
                      Your name
                    </label>
                    <input
                      id="w-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${FIELD} mt-2`}
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-ink" htmlFor="w-email">
                      The email address you use
                    </label>
                    <input
                      id="w-email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      autoCapitalize="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${FIELD} mt-2`}
                      placeholder="you@example.com"
                    />
                    <p className="mt-1.5 text-base text-ink/60">
                      This becomes your key — it&rsquo;s how you&rsquo;ll sign
                      in, with no password.
                    </p>
                  </div>
                  {state === "error" && (
                    <p className="rounded-xl bg-red-50 p-4 text-base text-red-700">
                      That didn&rsquo;t go through. Try once more, or just call
                      Ryan.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="w-full rounded-xl bg-gold px-6 py-4 text-lg font-bold text-ink transition hover:bg-gold-dark hover:text-white disabled:opacity-60"
                  >
                    {state === "sending" ? "Sending…" : "This is me — let Ryan know"}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="mt-5 w-full text-center text-base font-semibold text-sea underline"
                >
                  See the tour again
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="pb-10 text-center text-sm text-white/40">
        &ldquo;Medical Care for the Body. Hope for the Soul.&rdquo;
      </p>
    </div>
  );
}
