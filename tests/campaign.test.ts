import assert from "node:assert/strict";
import test from "node:test";
import {
  campaignForPost,
  campaignNeed,
  malawiCampaign,
} from "../content/campaigns";
import { enrichPost } from "../lib/postEnrich";
import { paypalDonateUrl } from "../lib/paypal";
import { giftAmount } from "../lib/giftAmount";
import type { DbPost } from "../lib/postsDb";

const post = (p: Partial<DbPost>): DbPost =>
  ({
    id: "x",
    slug: "x",
    title: "",
    body: "",
    excerpt: "",
    author_handle: "don",
    tags: [],
    photo_urls: [],
    photo_captions: [],
    link_url: null,
    link_label: null,
    published_at: "2026-09-15T00:00:00Z",
    created_at: "2026-09-15T00:00:00Z",
    ...p,
  }) satisfies DbPost;

test("Don's three campaign posts are recognised and lead with the right need", () => {
  assert.deepEqual(
    campaignForPost({
      title: "Water Well Request",
      body: "So we are in the process of collecting financial support for a water well in Malawi, Africa.",
      tags: ["Water Wells", "Malawi"],
    }),
    { need: "well" },
  );
  // Tagged "Dominican Republic" by mistake — the words still decide.
  assert.deepEqual(
    campaignForPost({
      title: "Maize Mill Request",
      body: "He asked the Lord for a water well and a maize mill. The water well is for the village where his grandparents lived.",
      tags: ["Dominican Republic"],
    }),
    { need: "maize-mill" },
  );
  // Names both — the well comes first, as Don lists it.
  assert.deepEqual(
    campaignForPost({
      title: "Bore Hole or Maize Mill in Malawi",
      body: "I will be using @WingsOfPromise",
      tags: [],
    }),
    { need: "well" },
  );
});

test("posts about something else never get the campaign ask", () => {
  for (const p of [
    {
      title: "Baptisms in the Caribbean Sea",
      body: "We baptized them as well, and it went well.",
      tags: ["Belize"],
    },
    {
      title: "Number 1 Priority: Giving Bibles to People",
      body: "Bibles for Malawi pastors. The Bible is well loved.",
      tags: ["Bibles"],
    },
  ])
    assert.equal(campaignForPost(p), null, p.title);
});

test("a campaign post carries one ask: the campaign, not a supply item", () => {
  const e = enrichPost(
    post({
      title: "Water Well Request",
      body: "Skipper Sauls, the Student & Missions pastor from Maplecrest Baptist Church in Vidor, Tx., will be responsible for overseeing the funds and the project.\n\nAll donations can be sent to:\n\nWings of Promise, Inc.",
      tags: ["Water Wells", "Malawi"],
    }),
  );
  assert.equal(e.item, null);
  assert.deepEqual(e.campaign, { need: "well", path: "/malawi-water-well" });
  assert.equal(e.followInterest, "malawi_water_well");
  assert(e.links.some((l) => l.href === "/malawi-water-well"));
  // "pastor" alone must not sneak a pastor-gift ask back in.
  assert.doesNotMatch(e.askHeadline, /pastor/i);
});

test("the designation rides in the PayPal gift itself", () => {
  for (const need of malawiCampaign.needs) {
    // PayPal truncates item_name beyond 127 characters.
    assert(need.paypalItem.length <= 127, need.id);
    assert.match(need.paypalItem, /Malawi/);
    assert.match(need.paypalItem, /Wings of Promise/);
    const url = new URL(paypalDonateUrl(need.paypalItem, 50));
    assert.equal(url.searchParams.get("item_name"), need.paypalItem);
    assert.equal(url.searchParams.get("amount"), "50.00");
  }
  assert.match(campaignNeed("well").paypalItem, /Malawi Water Well/);
});

test("the only published figure matches Don's words, and one donor can fund it all", () => {
  const well = campaignNeed("well");
  assert.equal(well.costUsd, 7630);
  assert.match(malawiCampaign.words.wellCost, /\$7,630\.00/);
  // The mill's price is not transcribed until Don writes it out.
  assert.equal(campaignNeed("maize-mill").costUsd, null);
  assert.equal(giftAmount("7630", 10_000), 7630);
  assert.equal(giftAmount("10000.01", 10_000), null);
  // Everyday giving keeps its $2,000 ceiling.
  assert.equal(giftAmount("7630"), null);
});

test("no progress bar until a real forwarded total exists", () => {
  assert.equal(malawiCampaign.raisedUsd, null);
});
