"use client";

/**
 * GIFT INTENT — a record of the moment someone leaves for PayPal.
 *
 * This records a choice, not a payment: item, quantity, amount if known, and
 * interest in monthly giving. PayPal controls the actual payment frequency.
 * These records must never be presented as money raised or used as receipts.
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

  // A queued beacon can survive navigation. Queue acceptance is not proof of
  // server persistence; if the browser refuses it, try a keepalive request.
  try {
    if (navigator.sendBeacon) {
      const queued = navigator.sendBeacon(
        "/api/gift-intent",
        new Blob([body], { type: "application/json" }),
      );
      if (queued) return;
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
    }).catch(() => {
      // A rejected asynchronous request must not become an unhandled error.
    });
  } catch {
    // Never let bookkeeping stand between a person and giving.
  }
}
