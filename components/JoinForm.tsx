"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/track";

/**
 * JOIN THE LIST — one capture form, dialled up or down per context.
 *
 * The whole site funnels into this. A footer asks for an email; the page after
 * someone gives asks for a name, a phone number, and a town, because that is
 * the single moment a supporter is most willing to tell you who they are.
 *
 * `interest` is passed by the caller (a fund, a supply item, a trip), so the
 * list records not just who joined but what moved them — which is the
 * difference between a mailing list and a list worth mailing.
 */
export default function JoinForm({
  source,
  interest,
  askName = false,
  askPhone = false,
  askPlace = false,
  offerTexts = false,
  dark = false,
  submitLabel = "Keep me posted",
  doneTitle = "You're on the list.",
  doneText = "Every trip update, photo drop, and new story will find you. Thank you for standing with the mission.",
}: {
  source: string;
  interest?: string;
  askName?: boolean;
  askPhone?: boolean;
  askPlace?: boolean;
  offerTexts?: boolean;
  dark?: boolean;
  submitLabel?: string;
  doneTitle?: string;
  doneText?: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cityState, setCityState] = useState("");
  const [wantsTexts, setWantsTexts] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  /*
   * Two quiet bot filters. The list already picked up a junk signup with a
   * random-string name, and every one of those makes the list less useful to
   * Don and Patti than it was before.
   *   1. a honeypot field a person never sees and never fills in
   *   2. the clock — scripts submit in well under a second
   * Both fail silently and pretend to succeed, so a bot gets no signal about
   * what tripped it. No CAPTCHA: never make a 70-year-old supporter identify
   * traffic lights to follow a mission trip.
   */
  const trap = useRef<HTMLInputElement>(null);
  const openedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    if (trap.current?.value || Date.now() - openedAt.current < 2000) {
      setStatus("done");
      return;
    }
    setStatus("sending");
    track("list_signup", { location: source, interest: interest ?? "" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          phone,
          cityState,
          wantsTexts,
          interest,
          source,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className={`rounded-2xl p-5 ${
          dark ? "bg-white/10 text-white" : "bg-sea/10 text-ink"
        }`}
      >
        <p className="font-serif text-xl font-bold">
          {doneTitle}
          {name ? ` Thank you, ${name.split(" ")[0]}.` : ""}
        </p>
        <p className={`mt-2 text-[15px] leading-relaxed ${dark ? "text-white/80" : "text-ink/70"}`}>
          {doneText}
        </p>
      </div>
    );
  }

  const field = dark
    ? "w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
    : "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30";

  return (
    <form onSubmit={onSubmit} className="relative w-full space-y-3">
      {(askName || askPhone) && (
        <div className={askName && askPhone ? "grid gap-3 sm:grid-cols-2" : ""}>
          {askName && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              autoComplete="name"
              className={field}
            />
          )}
          {askPhone && (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              aria-label="Phone number"
              autoComplete="tel"
              className={field}
            />
          )}
        </div>
      )}

      {askPlace && (
        <input
          value={cityState}
          onChange={(e) => setCityState(e.target.value)}
          placeholder="Town and state (optional)"
          aria-label="Town and state"
          className={field}
        />
      )}

      {/* Honeypot — off-screen, not tabbable, hidden from screen readers. */}
      <input
        ref={trap}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        autoComplete="email"
        className={field}
      />

      {offerTexts && (
        <label
          className={`flex items-start gap-3 text-sm leading-relaxed ${
            dark ? "text-white/80" : "text-ink/70"
          }`}
        >
          <input
            type="checkbox"
            checked={wantsTexts}
            onChange={(e) => setWantsTexts(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-ink/25"
          />
          <span>
            Text me when the team lands and when they get home. Only during a
            trip — a handful of messages a year.
          </span>
        </label>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={`w-full disabled:opacity-60 ${dark ? "btn-give" : "btn-primary"}`}
      >
        {status === "sending" ? "One moment…" : submitLabel}
      </button>

      {status === "error" && (
        <p className={`text-sm ${dark ? "text-gold" : "text-red-700"}`}>
          Something went wrong on our end — please try once more.
        </p>
      )}

      <p className={`text-xs leading-relaxed ${dark ? "text-white/50" : "text-ink/45"}`}>
        Don and Patti keep this list to themselves. No selling, no sharing, and
        one tap unsubscribes.
      </p>
    </form>
  );
}
