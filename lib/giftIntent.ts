"use client";

/**
 * GIFT INTENT — a record of the moment someone leaves for PayPal.
 *
 * PayPal webhooks are not connected yet, so a completed gift never comes back
 * to this site. That leaves Don and Patti blind to the most important question
 * they have: what are people actually choosing to fund?
 *
 * This records the choice, not the payment: which item, how many, what total,
 * one-time or monthly. It is INTENT — some of these people will abandon the
 * PayPal page — and every screen that shows this data has to say so. It is
 * never presented as money raised. The transparency ledger stays the only
 * place a dollar figure is claimed, and that is typed in by hand from a real
 * bank statement.
 *
 * No name, no email, no identifier of any kind. Just the shape of the choice.
 */
export function recordGiftIntent(input: {
  itemId?: string;
  itemName?: string;
  quantity?: number;
  amountUsd?: number;
  monthly?: boolean;
}) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    itemId: input.itemId ?? null,
    itemName: input.itemName ?? null,
    quantity: input.quantity ?? 1,
    amountUsd: input.amountUsd ?? null,
    monthly: input.monthly === true,
    sourcePath: window.location.pathname,
  });

  // The click is navigating away to PayPal in the same instant. sendBeacon is
  // the only method the browser guarantees will survive that; a normal fetch
  // gets cancelled mid-flight often enough to lose real data.
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/gift-intent",
        new Blob([body], { type: "application/json" }),
      );
      return;
    }
  } catch {
    // fall through
  }
  try {
    void fetch("/api/gift-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Never let bookkeeping stand between a person and giving.
  }
}
