import assert from "node:assert/strict";
import test from "node:test";
import {
  checkAuthorAccess,
  requestSignIn,
  signInErrorMessage,
} from "../lib/adminAuth";

test("a paused or unavailable auth service does not accuse the parent of using a wrong password", async () => {
  for (const error of [
    { status: 503, message: "Project unavailable" },
    { status: 502 },
    { name: "AuthRetryableFetchError", status: 0 },
    new TypeError("Failed to fetch"),
    { name: "TimeoutError" },
  ]) {
    const message = await requestSignIn(async () => ({ error }), "password");
    assert.match(message!, /service is unavailable/);
    assert.doesNotMatch(message!, /didn't match/);
  }
});

test("only a confirmed invalid-credentials response gives the password mismatch message", () => {
  assert.match(
    signInErrorMessage(
      { status: 400, code: "invalid_credentials" },
      "password",
    ),
    /email and password didn't match/,
  );
  assert.match(
    signInErrorMessage(
      { status: 400, message: "Invalid login credentials" },
      "password",
    ),
    /email and password didn't match/,
  );
  for (const error of [
    { status: 401 },
    { status: 400 },
    { code: "unexpected_failure" },
  ]) {
    assert.doesNotMatch(signInErrorMessage(error, "password"), /didn't match/);
  }
});

test("a rejected or synchronously thrown request resolves with a retry message so the form can stop waiting", async () => {
  for (const request of [
    () => Promise.reject(new TypeError("Private backend diagnostic")),
    () => {
      throw new Error("Private backend diagnostic");
    },
  ]) {
    const message = await requestSignIn(request, "password");
    assert.match(message!, /try again/i);
    assert.doesNotMatch(message!, /Private backend diagnostic/);
  }
});

test("a successful authentication is acknowledged only after the provider succeeds", async () => {
  let complete!: (result: { error: null }) => void;
  const provider = new Promise<{ error: null }>((resolve) => {
    complete = resolve;
  });
  let finished = false;
  const pending = requestSignIn(() => provider, "password").then((result) => {
    finished = true;
    return result;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(finished, false);
  complete({ error: null });
  assert.equal(await pending, null);
});

test("rate limits and expired codes give recovery steps without exposing provider details", () => {
  assert.match(
    signInErrorMessage({ status: 429 }, "password"),
    /wait a few minutes/,
  );
  assert.match(
    signInErrorMessage({ code: "over_email_send_rate_limit" }, "email"),
    /wait a few minutes/,
  );
  assert.match(
    signInErrorMessage({ code: "otp_expired" }, "code"),
    /Request a fresh one/,
  );
  assert.match(
    signInErrorMessage({ code: "email_not_confirmed" }, "password"),
    /needs to be confirmed/,
  );
  for (const method of ["password", "email", "code", "session"] as const) {
    const message = signInErrorMessage(
      { message: "private@example.invalid token=secret" },
      method,
    );
    assert.doesNotMatch(message, /private@|token=|secret/);
  }
});

test("an allow-list outage does not report that an existing author lost access", async () => {
  assert.equal(
    await checkAuthorAccess(async () => ({
      data: null,
      error: { status: 503 },
    })),
    "unavailable",
  );
  assert.equal(
    await checkAuthorAccess(async () => {
      throw new TypeError("Failed to fetch");
    }),
    "unavailable",
  );
  assert.equal(
    await checkAuthorAccess(async () => ({
      data: [{ handle: "don" }],
      error: { status: 500 },
    })),
    "unavailable",
  );
});

test("posting access remains denied unless a successful allow-list lookup finds the user", async () => {
  for (const data of [null, []]) {
    assert.equal(
      await checkAuthorAccess(async () => ({ data, error: null })),
      "denied",
    );
  }
  assert.equal(
    await checkAuthorAccess(async () => ({
      data: [{ handle: "patti" }],
      error: null,
    })),
    "allowed",
  );
});
