"use client";

import { useState } from "react";
import { supplyDrive } from "@/content/supplies";
import { usd } from "@/lib/budget";
import { paypalDonateUrl } from "@/lib/paypal";
import { track } from "@/lib/track";

/**
 * "I GAVE" SHARE CARD MAKER — pick the item, the quantity, and (optionally)
 * your first name; the picture renders live from /api/share-card and the
 * button saves it. The give link underneath is the same PayPal link the
 * sponsor page uses, so a person can make the card AND make it true.
 */
export default function ShareCardMaker() {
  const [item, setItem] = useState("bible");
  const [qty, setQty] = useState(10);
  const [name, setName] = useState("");
  const it = supplyDrive.items.find((i) => i.id === item) ?? supplyDrive.items[0];
  const n = Math.max(1, Math.min(999, Math.floor(qty) || 1));
  const total = Math.round(n * it.unitCost * 100) / 100;
  const q = new URLSearchParams({ item, qty: String(n) });
  if (name.trim()) q.set("name", name.trim().slice(0, 40));
  const src = `/api/share-card?${q.toString()}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">What did you send?</legend>
          <div className="grid grid-cols-2 gap-2">
            {supplyDrive.items.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => {
                  setItem(i.id);
                  setQty(i.startQty);
                }}
                aria-pressed={item === i.id}
                className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  item === i.id
                    ? "bg-deep text-white"
                    : "bg-sand text-ink/75 ring-1 ring-ink/10 hover:ring-sea"
                }`}
              >
                {i.name}
                <span className={`block text-xs font-normal ${item === i.id ? "text-gold" : "text-ink/50"}`}>
                  {usd(i.unitCost)} each
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">How many</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={999}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 font-serif text-xl font-bold"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Your first name (optional)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="Leave blank for “I”"
              className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3"
            />
          </label>
        </div>
        <p className="rounded-xl bg-sand-dark p-4 text-sm leading-relaxed text-ink/70">
          The card says <strong>{usd(total)}</strong> — {n} × {usd(it.unitCost)}. Make it true first, then post it:
        </p>
        <a
          href={paypalDonateUrl(`${n === 1 ? it.name : `${n} × ${it.name}`} — Belize Mission`, total)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("give_click", { location: "share_card_tool", fund: it.id, qty: n, amount: total })}
          className="btn-give w-full"
        >
          Give {usd(total)} with PayPal
        </a>
      </div>

      <div>
        <div className="overflow-hidden rounded-2xl bg-deep shadow-lg ring-1 ring-ink/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            src={src}
            alt={`Share card: ${name.trim() || "I"} sent ${n} ${it.name} to Belize`}
            width={1080}
            height={1080}
            className="aspect-square w-full"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={src}
            download={`i-gave-${item}-${n}.png`}
            onClick={() => track("tool_download", { tool: "share_card", item, qty: n })}
            className="btn-primary"
          >
            Save the picture
          </a>
          <a href={src} target="_blank" rel="noopener noreferrer" className="btn-outline">
            Open full size
          </a>
        </div>
        <p className="mt-3 text-sm text-ink/55">
          Square, 1080×1080 — the size Facebook and Instagram want. Post it with a link to donandpatti.com/sponsor.
        </p>
      </div>
    </div>
  );
}
