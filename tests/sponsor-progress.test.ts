import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import SponsorPage from "../app/sponsor/page";
import SponsorItemPage from "../app/sponsor/[id]/page";
import SponsorCheckout, { SponsorCard } from "../components/SponsorCheckout";
import { supplyDrive } from "../content/supplies";
import { PAYPAL_MERCHANT_ID } from "../lib/paypal";

const bible = supplyDrive.items.find((item) => item.id === "bible")!;

function card(funding: { fundedUsd: number; pct: number } | null) {
  return renderToStaticMarkup(
    createElement(SponsorCard, {
      item: bible,
      index: 0,
      photoUrl: "/test-bible.jpg",
      funding,
    }),
  );
}

test("sponsor grid, checkout and related cards agree with the aggregate gift records", async (t) => {
  t.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
    if (String(input).endsWith("/donation_totals")) {
      return Response.json([
        { total_usd: 352, gift_count: 7, donor_count: 3, monthly_count: 0 },
      ]);
    }
    assert(String(input).endsWith("/donation_by_item"));
    return Response.json([
      { item_id: "bible", total_usd: 76, units: null, gift_count: 2 },
      {
        item_id: "reading-glasses",
        total_usd: 250,
        units: null,
        gift_count: 2,
      },
    ]);
  });

  const grid = renderToStaticMarkup(await SponsorPage());
  const detail = renderToStaticMarkup(
    await SponsorItemPage({ params: Promise.resolve({ id: "bible" }) }),
  );
  for (const html of [grid, detail]) {
    assert.match(html, /\$76 recorded of \$625 budget/);
    assert.match(html, /\$250 recorded of \$180 budget/);
    assert.match(html, /aria-valuenow="100"/);
    assert.doesNotMatch(html, /0 of 250 sponsored|Be the first/);
  }
});

test("missing item records never display a false zero or a progress bar", async (t) => {
  t.mock.method(globalThis, "fetch", async (input: string | URL | Request) =>
    String(input).endsWith("/donation_totals")
      ? Response.json([
          { total_usd: 352, gift_count: 7, donor_count: 3, monthly_count: 0 },
        ])
      : new Response(null, { status: 503 }),
  );
  const page = renderToStaticMarkup(await SponsorPage());
  assert.match(page, /\$352/);
  assert.equal(
    page.match(/Giving records are temporarily unavailable\./g)?.length,
    supplyDrive.items.length,
  );

  const unavailable = card(null);
  assert.match(unavailable, /Giving records are temporarily unavailable/);
  assert.doesNotMatch(unavailable, /\$0 recorded|role="progressbar"/);
  const zero = card({ fundedUsd: 0, pct: 0 });
  assert.match(zero, /\$0 recorded of \$625 budget/);
  assert.match(zero, /aria-valuenow="0"/);
  assert.match(zero, /style="width:0%"/);
  assert.doesNotMatch(zero, /width:2%|Be the first/);
});

test("checkout explains the PayPal monthly choice and preserves the recipient and amount", () => {
  const html = renderToStaticMarkup(
    createElement(SponsorCheckout, {
      item: bible,
      funding: { fundedUsd: 76, pct: 12 },
    }),
  );
  assert.match(html, /Choose monthly at PayPal/);
  assert.doesNotMatch(html, /type="checkbox"/);
  assert.match(
    html,
    /do not confirm payment settlement or supplies purchased or delivered/,
  );
  const href = html.match(
    /href="(https:\/\/www\.paypal\.com\/donate\/[^\"]+)"/,
  )![1];
  const url = new URL(href.replaceAll("&amp;", "&"));
  assert.equal(url.searchParams.get("business"), PAYPAL_MERCHANT_ID);
  assert.equal(url.searchParams.get("amount"), "10.00");
  assert.equal(url.searchParams.get("no_recurring"), "0");
});
