import assert from "node:assert/strict";
import test from "node:test";
import { track } from "../lib/track";

test("checkout analytics reaches existing Vercel tracking without sending form data or URL tokens", (t) => {
  const va = t.mock.fn();
  const meta = t.mock.fn();
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      va,
      fbq: meta,
      gtag: () => {
        throw new Error("Blocked provider");
      },
    },
  });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  });
  assert.doesNotThrow(() =>
    track("give_click", {
      location: "give_picker",
      amount: 25,
      target:
        "https://www.paypal.com/donate/?email=private@example.invalid#private-token",
      email: "private@example.invalid",
      phone: "555-010-0123",
      name: "Private Person",
      message: "Private prayer request",
    }),
  );
  assert.equal(va.mock.callCount(), 1);
  assert.equal(meta.mock.callCount(), 1);
  assert.deepEqual(va.mock.calls[0].arguments[1], {
    name: "give_click",
    data: {
      location: "give_picker",
      amount: 25,
      target: "https://www.paypal.com/donate/",
    },
    options: undefined,
  });
  const sent = JSON.stringify([va.mock.calls, meta.mock.calls]);
  assert(!sent.includes("private"));
  assert(!sent.includes("Private"));
  assert(!sent.includes("555-010-0123"));
});
