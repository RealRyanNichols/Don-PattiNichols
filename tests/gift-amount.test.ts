import assert from "node:assert/strict";
import test from "node:test";
import { giftAmount, giftExample } from "../lib/giftAmount";

test("checkout amounts preserve cents and reject incomplete, nonfinite, out-of-range values", () => {
  for (const value of [
    "",
    " ",
    "-5",
    "0",
    "0.99",
    "2000.01",
    "NaN",
    "Infinity",
    "2.555",
    "1e2",
  ])
    assert.equal(giftAmount(value), null, value);
  assert.equal(giftAmount("2.50"), 2.5);
  assert.equal(giftAmount("2000"), 2000);
  assert.equal(giftAmount("25"), 25);
});

test("small gifts do not promise complete supplies, and local gifts do not claim Belize purchases", () => {
  assert.match(giftExample(1, "bibles-pastors"), /contributes toward/);
  assert.match(giftExample(1, "medical-supplies"), /contributes toward/);
  assert.match(
    giftExample(25, "bibles-pastors"),
    /published cost of 10 Bibles/,
  );
  assert.doesNotMatch(giftExample(25, "local-outreach"), /Bible|Belize|kit/);
});
