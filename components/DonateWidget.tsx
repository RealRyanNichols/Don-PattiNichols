"use client";

import { useState } from "react";
import { track } from "@/lib/track";

type Fund = { key: string; name: string };
const PRESETS = [25, 50, 100, 250];

/**
 * Stripe-backed giving widget: amount (presets or custom), one-time vs monthly,
 * and a designated fund. Posts to /api/checkout and redirects to hosted Stripe
 * Checkout. If giving isn't configured yet, it shows a friendly notice instead
 * of failing.
 */
export default function DonateWidget({
  funds,
  defaultFund = "where-needed",
}: {
  funds: Fund[];
  defaultFund?: string;
}) {
  const [preset, setPreset] = useState<number>(50);
  const [custom, setCustom] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [fund, setFund] = useState(defaultFund);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "unavailable">("idle");
  const [message, setMessage] = useState("");

  const amount = custom.trim() ? Number(custom) : preset;

  async function give() {
    if (!Number.isFinite(amount) || amount < 1) {
      setStatus("error");
      setMessage("Please enter an amount of at least $1.");
      return;
    }
    setStatus("loading");
    setMessage("");
    track("give_click", {
      location: "donate_widget",
      fund,
      target: recurring ? "monthly" : "one_time",
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, fund, recurring }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      if (res.status === 503) {
        setStatus("unavailable");
        setMessage(data.error || "Online giving is being set up and will be live here soon.");
        return;
      }
      setStatus("error");
      setMessage(data.error || "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const pill =
    "rounded-lg px-4 py-3 text-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sea/30";

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-7">
      {/* One-time vs monthly */}
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-sand-dark p-1">
        <button
          type="button"
          onClick={() => setRecurring(false)}
          className={`${pill} ${recurring ? "text-ink/60" : "bg-white text-deep shadow-sm"}`}
        >
          One-time
        </button>
        <button
          type="button"
          onClick={() => setRecurring(true)}
          className={`${pill} ${recurring ? "bg-white text-deep shadow-sm" : "text-ink/60"}`}
        >
          Monthly
        </button>
      </div>

      {/* Amount presets */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {PRESETS.map((v) => {
          const active = !custom.trim() && preset === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => {
                setPreset(v);
                setCustom("");
              }}
              className={`${pill} ${active ? "bg-sea text-white" : "bg-white text-ink ring-1 ring-ink/15 hover:ring-sea"}`}
            >
              ${v}
            </button>
          );
        })}
      </div>

      {/* Custom amount */}
      <div className="mt-3">
        <label htmlFor="give-amount" className="sr-only">
          Custom amount in US dollars
        </label>
        <div className="flex items-center rounded-lg border border-ink/15 bg-white px-4 focus-within:border-sea focus-within:ring-2 focus-within:ring-sea/30">
          <span className="text-lg font-semibold text-ink/50">$</span>
          <input
            id="give-amount"
            inputMode="decimal"
            placeholder="Other amount"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full bg-transparent px-2 py-3 text-lg focus:outline-none"
          />
          {recurring ? <span className="text-sm font-medium text-ink/50">/ month</span> : null}
        </div>
      </div>

      {/* Fund designation */}
      <div className="mt-4">
        <label htmlFor="give-fund" className="mb-1.5 block text-sm font-semibold">
          Send my gift to
        </label>
        <select
          id="give-fund"
          value={fund}
          onChange={(e) => setFund(e.target.value)}
          className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30"
        >
          {funds.map((f) => (
            <option key={f.key} value={f.key}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={give}
        disabled={status === "loading"}
        className="btn-give mt-5 w-full text-lg disabled:opacity-60"
      >
        {status === "loading"
          ? "Taking you to checkout…"
          : recurring
            ? `Give $${Number.isFinite(amount) ? amount : 0} monthly`
            : `Give $${Number.isFinite(amount) ? amount : 0}`}
      </button>

      {status === "unavailable" ? (
        <p className="mt-3 rounded-lg bg-sand p-3 text-center text-sm text-ink/75">{message}</p>
      ) : null}
      {status === "error" ? (
        <p className="mt-3 text-center text-sm text-red-700">{message}</p>
      ) : null}

      <p className="mt-3 text-center text-xs text-ink/55">
        Secure checkout by Stripe. Cards, Apple Pay, and Google Pay accepted.
      </p>
    </div>
  );
}
