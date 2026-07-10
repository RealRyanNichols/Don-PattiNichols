"use client";

import { useState } from "react";
import { track } from "@/lib/track";

type Props = {
  compact?: boolean;
  /** Full mode (Mission Partners Hub): adds name + phone fields. */
  full?: boolean;
};

export default function NewsletterForm({ compact = false, full = false }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    track("newsletter_signup", {
      location: full ? "partners_hub" : compact ? "footer" : "homepage",
    });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, phone: phone || undefined }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-lg bg-sea/10 px-4 py-3 font-medium text-sea">
        You&rsquo;re in{name ? `, ${name.split(" ")[0]}` : ""}. Every trip update, photo drop, and
        new post will find you. Thank you for standing with the mission.
      </p>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30";

  return (
    <form
      onSubmit={onSubmit}
      className={full ? "w-full space-y-3" : "flex w-full max-w-md flex-col gap-3 sm:flex-row"}
    >
      {full ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            aria-label="Name"
            className={inputClass}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            aria-label="Phone number"
            className={inputClass}
          />
        </div>
      ) : null}
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className={inputClass}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className={`btn-primary shrink-0 disabled:opacity-60 ${full ? "w-full" : ""}`}
      >
        {status === "sending" ? "Joining…" : full ? "Follow the Mission" : "Get Updates"}
      </button>
      {status === "error" ? (
        <p className="text-sm text-red-700 sm:self-center">Something went wrong — try again.</p>
      ) : null}
    </form>
  );
}
