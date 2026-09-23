import assert from "node:assert/strict";
import test from "node:test";
import { merchStorefront, merchProductUrl } from "../lib/merch";

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
    "https://printify.me",
    "http://nichols.printify.me",
    "https://nichols.printify.me.evil.test",
    "https://nichols.printify.me/?ref=x",
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

test("a Printify Pop-Up Store is accepted as the storefront", () => {
  assert.equal(
    merchStorefront("https://donandpatti.printify.me"),
    "https://donandpatti.printify.me/",
  );
  assert.equal(
    merchStorefront("https://don-and-patti.printify.me/products"),
    "https://don-and-patti.printify.me/products",
  );
});

test("featured product links must live on the configured storefront", () => {
  const shop = merchStorefront("https://donandpatti.printify.me");
  assert.equal(
    merchProductUrl("https://donandpatti.printify.me/product/123/tee", shop),
    "https://donandpatti.printify.me/product/123/tee",
  );
  for (const value of [
    "https://someone-else.printify.me/product/123",
    "https://evil.test/product/123",
    "http://donandpatti.printify.me/product/123",
  ])
    assert.equal(merchProductUrl(value, shop), null, value);
  // No storefront configured, no product buttons.
  assert.equal(
    merchProductUrl("https://donandpatti.printify.me/product/123", null),
    null,
  );
});
