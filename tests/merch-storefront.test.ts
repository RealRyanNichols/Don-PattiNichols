import assert from "node:assert/strict";
import test from "node:test";
import { merchStorefront } from "../lib/merch";

test("merch checkout stays unavailable until a supported secure storefront is configured", () => {
  for (const value of [
    "",
    "http://family.fourthwall.com",
    "https://fourthwall.com",
    "https://family.fourthwall.com.evil.test",
    "https://evil.test",
    "javascript:alert(1)",
    "https://user:password@family.fourthwall.com",
    "https://family.fourthwall.com?token=private",
    "https://shop.donandpatti.com:444",
  ])
    assert.equal(merchStorefront(value), null, value);
  assert.equal(
    merchStorefront("https://family.fourthwall.com"),
    "https://family.fourthwall.com/",
  );
  assert.equal(
    merchStorefront("https://shop.donandpatti.com/collections/all"),
    "https://shop.donandpatti.com/collections/all",
  );
});
