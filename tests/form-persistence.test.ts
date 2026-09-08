import assert from "node:assert/strict";
import test from "node:test";
import { POST as contact } from "../app/api/contact/route";
import { POST as subscribe } from "../app/api/subscribe/route";

const message = {
  topic: "prayer",
  name: "Private Test Name",
  email: "private-test@example.invalid",
  message: "Private prayer request with confidential details.",
};
const signup = {
  email: "private-test@example.invalid",
  name: "Private Test Name",
  phone: "555-010-0123",
  cityState: "Private Test City",
  wantsTexts: true,
  source: "test",
};
const request = (path: string, body: unknown) =>
  new Request(`https://example.invalid${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

for (const [name, handler, body, endpoint] of [
  ["contact", contact, message, "/rest/v1/messages"],
  ["subscribe", subscribe, signup, "/rest/v1/rpc/join_list"],
] as const) {
  test(`${name}: storage failure returns a retryable error, never success or private log contents`, async (t) => {
    const logs = ["error", "log", "warn"].map((method) =>
      t.mock.method(console, method as "error", () => {}),
    );
    t.mock.method(
      globalThis,
      "fetch",
      async () =>
        new Response("Database error containing private data", { status: 500 }),
    );
    const response = await handler(request(`/api/${name}`, body));
    assert.equal(response.status, 503);
    assert.equal((await response.json()).ok, false);
    const logged = JSON.stringify(
      logs.flatMap((log) => log.mock.calls.map((call) => call.arguments)),
    );
    for (const secret of [
      body.name,
      body.email,
      message.message,
      signup.phone,
      signup.cityState,
      "Database error containing private data",
    ]) {
      assert(
        !logged.includes(secret),
        `Log contained ${name} submission contents`,
      );
    }
  });

  test(`${name}: a thrown database failure is not acknowledged or logged with submission contents`, async (t) => {
    const log = t.mock.method(console, "error", () => {});
    t.mock.method(globalThis, "fetch", async () => {
      throw new Error(body.email);
    });
    const response = await handler(request(`/api/${name}`, body));
    assert.equal(response.status, 500);
    assert.equal((await response.json()).ok, false);
    assert.equal(log.mock.callCount(), 0);
  });

  test(`${name}: success is returned only after the existing storage endpoint accepts the submission`, async (t) => {
    let persist!: () => void;
    const accepted = new Promise<void>((resolve) => {
      persist = resolve;
    });
    t.mock.method(
      globalThis,
      "fetch",
      async (url: string | URL | Request, options?: RequestInit) => {
        assert.equal(new URL(String(url)).pathname, endpoint);
        assert.equal(options?.method, "POST");
        await accepted;
        return new Response(null, { status: 201 });
      },
    );
    let responded = false;
    const pending = handler(request(`/api/${name}`, body)).then((response) => {
      responded = true;
      return response;
    });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(responded, false);
    persist();
    const response = await pending;
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
  });

  test(`${name}: invalid input never reaches storage`, async (t) => {
    const fetchMock = t.mock.method(globalThis, "fetch", async () => {
      throw new Error("Storage must not be called");
    });
    const response = await handler(
      request(`/api/${name}`, { ...body, email: "not-an-email" }),
    );
    assert.equal(response.status, 400);
    assert.equal(fetchMock.mock.callCount(), 0);
  });
}
