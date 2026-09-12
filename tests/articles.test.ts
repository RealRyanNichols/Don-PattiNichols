import assert from "node:assert/strict";
import test from "node:test";
import { articles } from "../content/articles";
import { charts, tripsByYear, tripsByCountry, unitsPer, monthlyInBibles } from "../content/charts";
import { captions } from "../content/captions";
import { supplyDrive } from "../content/supplies";
import { suppliesBudget, logisticsBudget, missionaryCost } from "../content/support";
import { missionTimeline, countriesServed } from "../content/history";
import { behind } from "../content/behind";
import { albums } from "../content/albums";
import { QUESTIONS } from "../components/interactive/MissionQuiz";
import { articleOutline } from "../components/ArticleBlocks";

const item = (id: string) => supplyDrive.items.find((i) => i.id === id);

test("every article has a unique slug, a captioned hero, FAQs, and a way to act", () => {
  assert.equal(new Set(articles.map((a) => a.slug)).size, articles.length);
  for (const a of articles) {
    assert(captions[a.hero], `article ${a.slug} hero ${a.hero} needs a verified caption`);
    assert(a.faqs.length >= 3, `article ${a.slug} needs at least three FAQs`);
    assert(a.keywords.length >= 4, `article ${a.slug} needs keywords`);
    assert(a.shareText.length > 20 && a.shareText.length <= 220, `article ${a.slug} share text length`);
    assert.match(a.datePublished, /^\d{4}-\d{2}-\d{2}$/);
    // The point of the pieces: something to look at, then something to do.
    const kinds = new Set(a.blocks.map((b) => b.kind));
    assert(kinds.has("chart") || kinds.has("interactive"), `article ${a.slug} needs a chart or an interactive`);
    assert(kinds.has("join") || kinds.has("give"), `article ${a.slug} needs a join or give block`);
    assert(kinds.has("links"), `article ${a.slug} needs next-click links`);
    assert(a.blocks.some((b) => b.kind === "p"), `article ${a.slug} needs a lede paragraph`);
  }
});

test("every chart, photo, supply item and link an article points at exists", () => {
  const published = new Set([
    ...albums.flatMap((al) => al.photos),
    ...supplyDrive.items.map((i) => i.photo),
  ]);
  for (const a of articles) {
    for (const b of a.blocks) {
      if (b.kind === "chart") assert(charts[b.id], `article ${a.slug} chart ${b.id} missing`);
      if (b.kind === "photo") {
        assert(published.has(b.id), `article ${a.slug} photo ${b.id} is not a published photograph`);
        assert(captions[b.id], `article ${a.slug} photo ${b.id} needs a verified caption`);
      }
      if (b.kind === "give" && b.itemId) assert(item(b.itemId), `article ${a.slug} give item ${b.itemId} missing`);
      if (b.kind === "links") for (const l of b.items) assert(l.href.startsWith("/"), `article ${a.slug} link ${l.href}`);
      if (b.kind === "join") assert(b.source && b.interest, `article ${a.slug} join block needs source and interest`);
    }
    const ids = articleOutline(a.blocks).map((h) => h.id);
    assert.equal(new Set(ids).size, ids.length, `article ${a.slug} has duplicate heading ids`);
    for (const id of ids) assert.match(id, /^[a-z0-9-]+$/);
  }
});

test("chart data is derived from Don's budget and timeline, never typed in", () => {
  const split = charts["budget-split"];
  assert.equal(split.type, "stacked");
  if (split.type === "stacked") {
    assert.equal(split.segments.reduce((s, x) => s + x.value, 0), supplyDrive.goalUsd);
    assert.equal(split.segments[0].value, suppliesBudget.total);
    assert.equal(split.segments[1].value, logisticsBudget.total);
  }
  const lines = charts["supply-lines"];
  if (lines.type === "bars") {
    assert.equal(lines.data.reduce((s, d) => s + d.value, 0), suppliesBudget.total);
  }
  const logistics = charts["logistics-lines"];
  if (logistics.type === "bars") {
    assert.equal(logistics.data.reduce((s, d) => s + d.value, 0), logisticsBudget.total);
    assert.equal(logistics.data.filter((d) => d.emphasis).length, 1);
  }
  const split2 = charts["missionary-split"];
  if (split2.type === "stacked") {
    assert.equal(split2.segments.reduce((s, x) => s + x.value, 0), missionaryCost.total);
  }
  const years = tripsByYear();
  assert.equal(years.length, 2026 - 2013 + 1);
  assert.equal(years.filter((y) => y.gap).map((y) => y.label).join(","), "2020,2024,2025");
  assert.equal(
    years.reduce((s, y) => s + y.value, 0),
    missionTimeline.filter((t) => !t.gap).length,
  );
  const byCountry = tripsByCountry();
  assert.equal(byCountry.length, countriesServed.length);
  assert.equal(byCountry[0].label, "Malawi");
  for (const c of byCountry) assert(c.value >= 1, `${c.label} should have at least one trip`);

  // $25 buys 41 pairs of reading glasses at $0.60 — the article's headline number.
  const glasses = item("reading-glasses")!;
  assert.equal(unitsPer(25).find((d) => d.label.includes("lasses"))?.value, Math.floor(25 / glasses.unitCost));
  assert.equal(monthlyInBibles(25), Math.floor(300 / item("bible")!.unitCost));

  const archive = charts["archive-by-album"];
  if (archive.type === "bars") {
    assert.equal(archive.data.reduce((s, d) => s + d.value, 0), albums.reduce((n, a) => n + a.photos.length, 0));
  }
  for (const c of Object.values(charts)) {
    assert(c.source.length > 10, `chart ${c.id} needs a source line`);
    assert(c.headline.value && c.headline.label, `chart ${c.id} needs a headline`);
  }
});

test("every quiz answer matches what Don has published", () => {
  assert.equal(QUESTIONS.length, 10);
  for (const q of QUESTIONS) {
    assert(q.options.length === 4, `quiz "${q.q}" needs four options`);
    assert(q.answer >= 0 && q.answer < 4, `quiz "${q.q}" answer index`);
    assert(q.why.length > 20, `quiz "${q.q}" needs an explanation`);
  }
  const pick = (needle: string) => QUESTIONS.find((q) => q.q.includes(needle))!;
  const usd = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`;

  assert.equal(pick("one Bible cost").options[pick("one Bible cost").answer], usd(item("bible")!.unitCost));
  const cheapest = [...supplyDrive.items].sort((a, b) => a.unitCost - b.unitCost)[0];
  assert.equal(cheapest.id, "reading-glasses");
  assert.match(pick("cheapest item").options[pick("cheapest item").answer], /reading glasses/i);
  assert.equal(pick("fly one trunk").options[pick("fly one trunk").answer], usd(item("baggage")!.unitCost));
  assert.match(JSON.stringify(behind), /nine trunks/i);
  assert.match(JSON.stringify(behind), /50 pounds|fifty pounds/i);
  assert.equal(pick("first mission trip").options[pick("first mission trip").answer], "July 2013, Malawi");
  assert.equal(missionTimeline[0].when, "July 2013");
  assert.equal(missionTimeline[0].location, "Malawi");
  const notServed = pick("NOT a country");
  assert(!countriesServed.includes(notServed.options[notServed.answer]));
  for (const o of notServed.options.filter((_, i) => i !== notServed.answer)) assert(countriesServed.includes(o));
  const kit = pick("hygiene kit");
  for (const o of kit.options.filter((_, i) => i !== kit.answer)) {
    assert(behind.hygieneKit.paragraphs[0].toLowerCase().includes(o.replace(/^A /, "").toLowerCase()), `kit contains ${o}`);
  }
  assert(!behind.hygieneKit.paragraphs[0].toLowerCase().includes("flashlight"));
  const y2024 = missionTimeline.find((t) => t.year === 2024 && t.gap)!;
  assert.match(y2024.focus, /surgery/i);
  const y2020 = missionTimeline.find((t) => t.year === 2020 && t.gap)!;
  assert.match(y2020.focus, /covid/i);
});
