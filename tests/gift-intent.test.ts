import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import type { ReactElement } from "react";
import { recordGiftIntent } from "../lib/giftIntent";
import { POST } from "../app/api/gift-intent/route";
import GiveLink from "../components/GiveLink";

function browser(
  t: TestContext,
  sendBeacon: (url: string, body: Blob) => boolean,
) {
  for (const [key, value] of Object.entries({
    window: { location: { pathname: "/give" } },
    navigator: { sendBeacon },
  })) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
}

const request = (body: unknown) =>
  new Request("https://example.invalid/api/gift-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

test("accepted intent beacons are not duplicated and unknown amounts stay unknown", async (t) => {
  let sent!: Blob;
  browser(t, (_url, body) => {
    sent = body;
    return true;
  });
  const fetchMock = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ ok: true }),
  );
  recordGiftIntent({ itemId: "general" });
  assert.equal(
    (JSON.parse(await sent.text()) as { amountUsd: unknown }).amountUsd,
    null,
  );
  assert.equal(fetchMock.mock.callCount(), 0);
});

for (const failure of ["refused", "threw"] as const) {
  test(`a ${failure} beacon falls back to keepalive without blocking checkout`, async (t) => {
    browser(t, () => {
      if (failure === "threw") throw new Error("Beacon unavailable");
      return false;
    });
    const fetchMock = t.mock.method(
      globalThis,
      "fetch",
      async (_url: RequestInfo | URL, init?: RequestInit) => {
        assert.equal(init?.keepalive, true);
        assert.equal(JSON.parse(String(init?.body)).amountUsd, 25);
        throw new Error("Network unavailable");
      },
    );
    assert.doesNotThrow(() => recordGiftIntent({ amountUsd: 25 }));
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(fetchMock.mock.callCount(), 1);
  });
}

test("GiveLink records actual PayPal departures, not visits to the giving page", async (t) => {
  const sent: Blob[] = [];
  browser(t, (_url, body) => {
    sent.push(body);
    return true;
  });
  const click = (href: string) => {
    const element = GiveLink({
      href,
      location: "test",
      children: "Give",
    }) as ReactElement<{ onClick: () => void }>;
    assert.doesNotThrow(() => element.props.onClick());
  };
  click("/give");
  click("https://example.invalid/donate");
  assert.equal(sent.length, 0);
  click("https://www.paypal.com/donate/?business=example&currency_code=USD");
  assert.equal(sent.length, 1);
  assert.equal(JSON.parse(await sent[0].text()).amountUsd, null);
});

test("intent persistence preserves a missing amount and strips URL query details", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async (url: RequestInfo | URL, init?: RequestInit) => {
      assert.equal(new URL(String(url)).pathname, "/rest/v1/gift_intents");
      const row = JSON.parse(String(init?.body));
      assert.equal(row.amount_usd, null);
      assert.equal(row.quantity, 1);
      assert.equal(row.source_path, "/give");
      assert.equal(row.email, undefined);
      return new Response(null, { status: 201 });
    },
  );
  const response = await POST(
    request({
      amountUsd: null,
      sourcePath: "/give?email=private@example.invalid#token",
      email: "private@example.invalid",
    }),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test("intent storage failures are not acknowledged as saved and never log contents", async (t) => {
  const logs = t.mock.method(console, "error", () => {});
  const fetchMock = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("Private database row", { status: 500 }),
  );
  for (const fail of [
    async () => new Response("Private database row", { status: 500 }),
    async (): Promise<Response> => {
      throw new Error("Private database row");
    },
  ]) {
    fetchMock.mock.mockImplementation(fail);
    const response = await POST(
      request({ itemName: "Private input", amountUsd: 25 }),
    );
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { ok: false });
  }
  const logged = JSON.stringify(logs.mock.calls.map((call) => call.arguments));
  assert(!logged.includes("Private"));
});

test("intent success waits for storage acceptance", async (t) => {
  let accept!: () => void;
  const pendingWrite = new Promise<void>((resolve) => {
    accept = resolve;
  });
  t.mock.method(globalThis, "fetch", async () => {
    await pendingWrite;
    return new Response(null, { status: 201 });
  });
  let responded = false;
  const pending = POST(request({ amountUsd: 25 })).then((response) => {
    responded = true;
    return response;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(responded, false);
  accept();
  assert.equal((await pending).status, 200);
});

test("malformed intent data cannot manufacture amounts or reach storage", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Must not write");
  });
  for (const body of [
    null,
    [],
    { amountUsd: "25" },
    { amountUsd: false },
    { amountUsd: -25 },
    { amountUsd: 0.001 },
    { quantity: 0 },
    { quantity: 1.5 },
  ]) {
    assert.equal((await POST(request(body))).status, 400);
  }
  assert.equal(fetchMock.mock.callCount(), 0);
});
