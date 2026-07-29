# CLAUDE CODE PROMPT — Make donandpatti.com findable, shareable, and worth staying on

Copy everything below the line into Claude Code, run from the project folder.

---

You are working on **donandpatti.com**, the mission site of Don & Patti Nichols. Read
`PROJECT-BRAIN.md` first — it is the master record and it wins over anything here that
disagrees with it. Then read this whole brief before writing code.

## Start by understanding the real problem

This site is not short on features. It has 26 page routes, a photo archive, a store, a
live transparency ledger, an admin app, presence counters, and structured data. It gets
about 66 visitors a week, almost all from one Facebook post.

**The constraint is that Google and AI assistants have almost nothing to read.**

Three numbers tell the whole story:

- **509 photographs.** Every one is described to search engines as
  `alt="Malawi — photograph 47"`. Thirteen years in five countries, and Google Images
  cannot see a single thing in any of them.
- **6 written blog posts**, none of them by Don, plus 11 `[NEEDED from Don]` markers
  where his words should be.
- **The Belize trip already happened** (June 8–13, 2026) and there is no recap of it
  anywhere on the site.

So: do not begin by adding features. Begin by making what already exists legible to
search engines, to AI assistants, and to a stranger who lands here from Facebook.

## Phase 1 — Turn 509 photographs into 509 doors

This is the single highest-leverage thing available and nobody has done it.

Each photo currently renders with a generated alt string. Replace this with real
descriptions. Work album by album (`content/albums.ts`, rendered by
`components/PhotoWall.tsx`):

1. Add an optional `caption` and `alt` per photo id. Build a `content/captions.ts` keyed
   by Drive file id so `albums.ts` stays generated and re-runnable.
2. For each album, write descriptive alt text that names **what is actually happening,
   where, and when** — "A Malawian pastor receives a study Bible in Blantyre, 2017", not
   "Bible ministry photo". You can see the photographs: fetch them at
   `https://lh3.googleusercontent.com/d/<id>=w800` and look before you write.
3. Show captions under photos in the lightbox and on album pages. A caption is content;
   alt text alone is invisible to human readers.
4. **Do not invent.** If you cannot tell what a photograph shows, write a plain factual
   description of the visible scene and nothing more. Never state a name, a village, a
   date, or an outcome that is not established in `content/history.ts` or the album's own
   metadata. A wrong caption on a ministry site is worse than a dull one.
5. Add `ImageObject` structured data with those captions to album pages.

Do the smallest album first, show Ryan the result, and only then continue. Getting the
voice right on 20 photos matters more than getting 509 done fast.

## Phase 2 — Be findable at all

- **Google Search Console**: add the verification meta tag to `app/layout.tsx` (Ryan will
  supply the token), then submit `/sitemap.xml`. This has never been done. It is free and
  it is the difference between being indexed and not.
- **Bing Webmaster Tools** — same, five minutes, and it feeds AI assistants.
- Audit `app/sitemap.ts`: confirm every album, trip, sponsor item, and post is in it with
  a sensible `lastModified`.
- Check every page has a genuinely distinct `<title>` and meta description. Duplicates
  across the 10 sponsor pages are likely and they suppress each other.

## Phase 3 — Write the pages people are actually searching for

People do not search "Don and Patti Nichols." They search things like *how much does a
medical mission trip cost*, *what to pack for a mission trip*, *medical mission trips to
Belize*, *sponsor a mission trip*, *reading glasses mission ministry*.

Don has genuinely rare first-hand answers to all of these — a real published budget, 13
years of packing lists, actual trunk inventories.

Create a small number of genuinely useful pages built from what he already knows:

- **What a medical mission trip actually costs** — built from Don's real published budget
  in `content/supplies.ts` ($1,200/missionary, Bibles $2.50, glasses $0.60…). Almost
  nobody publishes real numbers. This will outrank vaguer pages because it is concrete.
- **What goes in a mission trunk** — his actual inventory, photographed.
- **Belize June 2026 — what happened** — the trip recap that does not exist yet. Mark
  every factual claim `[NEEDED from Don]` and leave the photographs doing the work until
  he fills it in.

Each of these is a real answer to a real question. None of them is filler. If you find
yourself writing a page nobody would want to read, stop — that is the wrong page.

## Phase 4 — Make one visitor bring another

Facebook is the only meaningful traffic source, so the share path deserves real work.

- Every album, trip, and post needs its own OG image. Right now `lib/og.ts` falls back to
  a designed card because most archive photos are under 600px. Build an **OG image
  generation route** (`next/og` `ImageResponse`, like `app/pwa-icon/[size]/route.tsx`)
  that composes: the album's best photograph + the title + the Nichols wordmark, at
  1200×630. This makes every one of the 12 albums shareable with a real image instead of
  a generic card.
- Add a "share this album" and "share this photograph" action to the archive.
- Check `components/ShareButton.tsx` is on every shareable page. It is currently missing
  from album pages.

## Phase 5 — Give a first-time visitor somewhere to go

Someone lands from Facebook on one photo album and leaves. Fix the dead ends:

- Related albums at the bottom of every album (by country and era).
- "Next / previous photograph" inside the lightbox.
- On every blog post: two more posts, chosen by shared tag.
- A genuine **/start-here** page for the stranger: who these two people are, in about 200
  words and five photographs, with one clear next step.

## Phase 6 — Say thank you automatically

The list-building is built (`components/JoinForm.tsx`, `subscribers`, the People tab) but
**not one email has ever been sent**. A list nobody writes to is not an asset.

- Finish the Resend setup (see `CLAUDE-CODE-ADMIN-PORTAL.md` — DNS records for
  `send.donandpatti.com` are pending at GoDaddy).
- Build a **"Write to my people"** screen in the admin: Don types once, it goes to
  everyone on the list, in the same plain-language style as the rest of the admin. Show
  him the count before he sends and require an explicit confirm.
- Auto-send one warm welcome email when someone joins the list.
- Never send without an unsubscribe link. Never buy or import a list.

## Guardrails — read these twice

The failure mode for this task is adding growth tactics that would cheapen a ministry
site. **Do not build any of the following**, even though they "increase engagement":

- Exit-intent popups, entry popups, or anything modal that interrupts reading
- Countdown timers on anything that does not have a real deadline
- "N people are looking at this right now" on a sponsor item
- Fake or seeded numbers of any kind. The live counter already hides itself rather than
  lie, and the giving totals show real dollars only. **Preserve that behaviour exactly.**
- Anything that makes giving feel like checkout urgency

Also non-negotiable, from `PROJECT-BRAIN.md`:

- **Don's published words are verbatim.** Never paraphrase, never invent a trip fact, a
  date, a name, or an outcome. `[NEEDED from Don]` markers stay until he writes.
- **Donor privacy**: public pages show totals and what money went toward — never a donor
  name, never an individual amount. That is enforced in the database
  (`donation_totals()`, `donation_by_item()`); do not add a public path around it.
- **Privacy**: some archive photos show the home address and a personal email. 14 were
  removed from the Belize album already. If you surface new photos, check them.
- **Design language**: deep `#0a3d40`, sea `#0e6b70`, sand `#faf6ef`, gold `#c9962e`,
  Lora + Inter self-hosted via `next/font`. Never add a Google Fonts `<link>` — it cost
  4.6 seconds of LCP last time.
- **Performance is a feature.** Mobile is 55% of traffic. Any image you add must be
  sized, lazy-loaded below the fold, and must not regress LCP. Measure before and after.

## How to work

- `npx tsc --noEmit` must exit 0 before any deploy.
- Deploy per the runbook in `PROJECT-BRAIN.md`. Never paste an inline file tree.
- **Work in small, shippable pieces and show Ryan after each one.** Phase 1 alone is
  weeks of judgment calls about someone's family history — do one album, get it approved,
  then scale.
- After each phase, write what you did into `PROJECT-BRAIN.md`.

## What success looks like

Not "more features." In ninety days:

- The site is indexed, and Google Images has 509 described photographs from five
  countries it did not have before.
- Someone searching what a mission trip actually costs finds Don's real budget.
- A Facebook share of any album shows that album's own photograph.
- Don has written at least one thing in his own words, and the people on his list heard
  from him.

Start with Phase 1, one album, and come back to Ryan before going further.
