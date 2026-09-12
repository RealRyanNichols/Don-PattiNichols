import assert from "node:assert/strict";
import test from "node:test";
import { breadcrumbLd, faqLd, howToLd, keywords, ldJson, ogCardImage } from "../lib/seo";
import { guides } from "../content/guides";
import { allFaqs } from "../content/faq";
import { captions } from "../content/captions";
import { albums } from "../content/albums";
import { supplyDrive } from "../content/supplies";
import { tools } from "../content/tools";

test("breadcrumbs always start at Home and end on the current page", () => {
  const ld = breadcrumbLd([{ name: "Resources", path: "/resources" }, { name: "FAQ", path: "/faq" }]) as {
    itemListElement: { position: number; name: string; item: string }[];
  };
  assert.equal(ld.itemListElement[0].name, "Home");
  assert.equal(ld.itemListElement[0].item, "https://www.donandpatti.com/");
  assert.equal(ld.itemListElement.at(-1)?.name, "FAQ");
  assert.deepEqual(
    ld.itemListElement.map((i) => i.position),
    [1, 2, 3],
  );
});

test("keyword sets merge without duplicates", () => {
  const k = keywords("core", "core", ["Don Nichols", "extra phrase"]);
  assert.equal(k.filter((x) => x === "Don Nichols").length, 1);
  assert(k.includes("extra phrase"));
});

test("structured data never contains an unescaped closing script tag", () => {
  const s = ldJson({ a: "</script><script>alert(1)</script>" });
  assert(!s.includes("</script>"));
});

test("every guide has verified hero captions, FAQs and a matching HowTo when it has steps", () => {
  for (const g of guides) {
    assert(captions[g.hero], `guide ${g.slug} hero ${g.hero} needs a verified caption`);
    assert(g.faqs.length >= 3, `guide ${g.slug} needs FAQs`);
    if (g.steps) {
      const ld = howToLd({ name: g.title, description: g.description, path: `/guides/${g.slug}`, steps: g.steps }) as {
        step: { position: number; url: string }[];
      };
      assert.equal(ld.step.length, g.steps.length);
      assert(ld.step[0].url.endsWith("#step-1"));
    }
    for (const t of g.tools) assert(t.href.startsWith("/"), `guide ${g.slug} tool ${t.href}`);
  }
});

test("the FAQ page's structured data matches the rendered questions one to one", () => {
  const ld = faqLd(allFaqs) as { mainEntity: { name: string }[] };
  assert.equal(ld.mainEntity.length, allFaqs.length);
  assert.deepEqual(
    ld.mainEntity.map((m) => m.name),
    allFaqs.map((f) => f.q),
  );
  // No two questions the same — duplicates suppress each other in search.
  assert.equal(new Set(allFaqs.map((f) => f.q)).size, allFaqs.length);
});

test("every caption id is a photograph that is actually published", () => {
  const published = new Set([
    ...albums.flatMap((a) => a.photos),
    ...supplyDrive.items.map((i) => i.photo),
  ]);
  for (const id of Object.keys(captions)) {
    assert(published.has(id), `caption for unpublished photo ${id}`);
  }
  for (const t of tools) assert(captions[t.photo], `tool ${t.slug} photo needs a caption`);
});

test("share-card URLs for static pages are absolute and carry the size Facebook wants", () => {
  const img = ogCardImage({ eyebrow: "For churches", title: "Invite Don", photo: "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I" });
  assert(img.url.startsWith("https://www.donandpatti.com/og?"));
  assert.equal(img.width, 1200);
  assert.equal(img.height, 630);
  assert(img.url.includes("p=1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I"));
});
