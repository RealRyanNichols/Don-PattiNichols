import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAllocation,
  fetchDonationTotals,
  fetchItemFunding,
  type DonationTotals,
} from "../lib/donations";

const totals: DonationTotals = {
  totalUsd: 72.5,
  giftCount: 2,
  donorCount: 2,
  monthlyCount: 0,
  lastGiftAt: null,
};

test("a failed or malformed totals response stays unavailable instead of reporting zero gifts", async (t) => {
  const mock = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 503 }),
  );
  assert.equal(await fetchDonationTotals(), null);
  for (const body of [
    [],
    {},
    [
      {
        total_usd: "not-a-number",
        gift_count: 0,
        donor_count: 0,
        monthly_count: 0,
      },
    ],
  ]) {
    mock.mock.mockImplementation(async () => Response.json(body));
    assert.equal(await fetchDonationTotals(), null);
  }
  assert.equal(buildAllocation(null, new Map()).status, "unavailable");
});

test("a real zero aggregate remains distinguishable from a failed database request", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json([
      {
        total_usd: "0",
        gift_count: 0,
        donor_count: 0,
        monthly_count: 0,
        last_gift_at: null,
      },
    ]),
  );
  const recorded = await fetchDonationTotals();
  assert(recorded);
  const allocation = buildAllocation(recorded, new Map());
  assert.equal(allocation.status, "available");
  if (allocation.status === "available") {
    assert.equal(allocation.giftless, true);
    assert.equal(allocation.raisedUsd, 0);
  }
});

test("designation data cannot inflate the giving total or spread undesignated gifts into item bars", () => {
  const allocation = buildAllocation(
    totals,
    new Map([
      ["bible", { itemId: "bible", totalUsd: 12.5, units: 5, giftCount: 1 }],
    ]),
  );
  assert.equal(allocation.status, "available");
  if (allocation.status !== "available") return;
  assert.equal(allocation.raisedUsd, 72.5);
  assert.equal(allocation.undesignatedUsd, 60);
  assert.equal(
    allocation.items.find((item) => item.id === "bible")?.unitsFunded,
    5,
  );
  assert.equal(
    allocation.items
      .filter((item) => item.id !== "bible")
      .reduce((sum, item) => sum + item.fundedUsd, 0),
    0,
  );
  assert.equal(allocation.stillNeededUsd, allocation.goalUsd - 72.5);
});

test("an item breakdown outage preserves the known total without claiming empty item records", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 503 }),
  );
  assert.equal(await fetchItemFunding(), null);
  const allocation = buildAllocation(totals, null);
  assert.equal(allocation.status, "available");
  if (allocation.status === "available") {
    assert.equal(allocation.raisedUsd, totals.totalUsd);
    assert.equal(allocation.itemsAvailable, false);
    assert.deepEqual(allocation.items, []);
  }
});

test("general gifts and omitted quantities do not erase a valid item breakdown", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json([
      { item_id: null, total_usd: 60, units: null, gift_count: 1 },
      { item_id: "bible", total_usd: "12.50", units: null, gift_count: 1 },
    ]),
  );
  const byItem = await fetchItemFunding();
  assert(byItem);
  assert.equal(byItem.get("bible")?.totalUsd, 12.5);
  assert.equal(byItem.get("bible")?.units, 0);
  const allocation = buildAllocation(totals, byItem);
  assert.equal(allocation.status, "available");
  if (allocation.status === "available") {
    assert.equal(
      allocation.items.find((item) => item.id === "bible")?.unitsFunded,
      5,
    );
    assert.equal(allocation.undesignatedUsd, 60);
  }
});
