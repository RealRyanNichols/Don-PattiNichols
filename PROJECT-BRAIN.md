# DONANDPATTI.COM — PROJECT BRAIN
_Last full update: July 28, 2026. This is the master record. The older CLAUDE-CODE-PROMPT.md is partially stale; where they disagree, THIS file wins._

## What this is
The online home, giving engine, photo archive, and legacy record of Don & Patti Nichols — Ryan Nichols' parents. Don is a preacher and mission-team member; Patti serves alongside him and runs her own Money Ministry (canning salsa to fund mission work). Site headline, written by Don: **"Medical Care for the Body. Hope for the Soul."**

Thirteen years of mission work: **Malawi, Mozambique, Zambia (2013–2019), Dominican Republic (2017, 2021–2023), Belize (June 8–13, 2026)** — the Belize trip was the return after Don's open-heart surgery (no trips 2024–2025; no trips 2020 for COVID). Source of record: Don's own "Mission Trip Timeline" document, transcribed verbatim into `content/history.ts`.

## Non-negotiable guardrails
- Don's published words are VERBATIM — never paraphrased. Budget figures are his: $1,200/missionary ($800 airfare + $400 lodging), Bibles $2.50, hygiene kits $3, glasses $0.60, sunglasses $1, tracts $60/bundle, pastor gift sets $100, trunks $25, baggage $200, customs share $25. Supply-drive goal $3,940.
- Never invent trip facts, dates, names, captions, or numbers. `[NEEDED from Don]` markers stay until he supplies the words.
- PRIVACY: trunk-label photos show the home address (20236 FM 450 N, Diana, TX 75640) and dnichols3270@yahoo.com. 14 such photos were excluded from the Belize album; similar exclusions in Malawi/DR/Widows albums (documents, ledgers, an ID card). Never republish without review. Donor privacy: first names only on the public Thank You page; never amounts/addresses/emails.
- No tax-deductible language until 501(c)(3) details arrive (`lib/site.ts → giving.org501c3`).
- No fake numbers anywhere — the live-visitors pill hides below 2 real visitors; the admin Giving tab admits PayPal isn't wired rather than showing $0.

## Live infrastructure
- **Domain:** donandpatti.com (GoDaddy; apex 308 → www). SSL via Vercel.
- **Hosting:** Vercel project `don-patti-nichols`, team `team_2a0TrkWvu7Mv1IIMToSYyhER` (Ryan's RealRyanNichols account). ~59 static pages. Vercel Analytics + Speed Insights active.
- **Database/Auth/Realtime:** Supabase project ref `rxjsykcbedtyxfvyfyhl` (Ryan's org). Publishable key is intentionally public in `lib/supabase.ts`; all safety is RLS.
- **Payments:** PayPal (Don's decision), Personal account, merchant ID `EZLD2X3NN5JGL`. Dynamic unhosted donate URLs via `lib/paypal.ts → paypalDonateUrl(itemName, amount?)` — supports any amount + monthly. NOT yet webhook-connected, so gifts don't appear in the DB.
- **Photos:** Google Drive folder `Don&PattiNichols/Pictures` (id `1FpUEca_PSQmEzjzQMDpAdEI2C79dPgaA`, must stay "anyone with link"), served via `lh3.googleusercontent.com/d/<id>=w<px>`. 13 album subfolders (ids in CLAUDE-CODE-PROMPT.md). 544 files scanned; 523 published after privacy triage (then Belize re-triage removed 14 more → 509 live).
- **GitHub:** repo `RealRyanNichols/Don-PattiNichols` exists but EMPTY — source of truth is the local folder; deploys go through the archive method (below). Pushing to GitHub + connecting Vercel is still the right endgame.
- **Stack:** Next.js 14 App Router, TypeScript, Tailwind 3, @supabase/supabase-js, zero UI libraries. Brand: deep teal #0a3d40, sea #0e6b70, sand #faf6ef, gold #c9962e; Lora + Inter (self-hosted via next/font — never revert to a Google Fonts <link>; it cost 4.6s of LCP).

## Site map (public)
`/` home · `/mission` · `/belize` · `/behind-the-mission` · `/sponsor` (Fill the Trunks store) · `/sponsor/[id]` ×10 sales pages · `/trips` (Don's full timeline) · `/trips/belize-2026|dominican-republic|malawi` · `/albums` + `/albums/[slug]` ×12 · `/blog` timeline + posts · `/give` (GivePicker slider + funds) · `/give/thank-you` · `/thank-you` (donor gratitude page) · `/don` `/patti` `/our-story` · `/members` · `/store` (coming soon) · `/contact` · `/privacy` `/terms` · `/welcome` (onboarding tour) · `/admin` (private). SEO: sitemap, robots, canonicals, OG cards, JSON-LD (Org/Person/Product/ItemList/ImageGallery/Article/Breadcrumb).

## The admin (Don & Patti's side)
- **/welcome?for=don|patti** — personalized 4-slide tour → "This is me" → access REQUEST (not access).
- **Approval:** Ryan's dashboard shows "Someone's at the door"; Approve as Don / as Patti / as team / dismiss. Approval inserts into `site_authors` — the ONLY path to posting rights. Ryan (theflashflash24@gmail.com) is `role='admin'`; only admins can mint authors.
- **Sign-in:** magic link email (branded, gold button, signed "the website Ryan built you") + 6-digit OTP fallback typed on the page. Supabase Site URL fixed to https://www.donandpatti.com (was localhost — that bug would have broken all logins). Redirect allow-list: both domains /**.
- **Dashboard (Home):** greets by first name; cards Messages / Comments / Followers / Given; reply-by-email + mark-done; comment approve/hide/delete (comments are held for approval); posts publish/hide; Add-to-Home-Screen coaching (gold cross apple-icon).
- **Write:** Don-or-Patti byline, title, story, camera-roll photo uploads (Supabase storage `mission-photos`), tap-tags, album assignment, optional Give/Buy button, draft vs publish.
- **Photos:** create album / add to album. **Thanks:** posts to the public /thank-you page.

## Data model (Supabase, all RLS)
`site_authors` (allow-list; admin-only insert) · `access_requests` (public insert, admin approves) · `site_posts` · `site_albums` + `album_photos` · `thank_you_notes` · `post_comments` (public insert unapproved; public read approved only) · `messages` (contact form; author read + handled flag) · `subscribers` (name/phone/email) · `donations` (service-role write, awaiting PayPal webhooks) · storage bucket `mission-photos` (public read, author write). Live visitors: Supabase Realtime presence channel `presence:site-visitors` (no table).

## Deploy runbook (proven ~10 times)
1. `npx tsc --noEmit` must exit 0.
2. tar the source EXCLUDING node_modules/.next/.git/.drive-parts/_manifest_parts/drive-manifest.json/*.log/BLUEPRINT.md/CLAUDE-CODE-PROMPT.md/supabase — INCLUDE app components content lib package.json package-lock.json next.config.* tsconfig.json tailwind.config.ts postcss.config.mjs (no public/ dir).
3. Upload to litterbox.catbox.moe API (or uguu.se); verify SHA-256 round-trip byte-for-byte.
4. `deploy_to_vercel` name `don-patti-nichols`, team `team_2a0TrkWvu7Mv1IIMToSYyhER`, target production, buildCommand: `curl -sSL --retry 3 --fail -o s.tgz <url> && echo "<sha> s.tgz" | sha256sum -c - && tar -xzf s.tgz && rm -f s.tgz && npm run build`. The checksum guard is the safety property — a truncated payload once blanked production.
5. Verify READY, ~59 pages, spot-check live URLs. NEVER deploy an inline file tree from chat (truncation risk).

## OG / share cards
`lib/og.ts` maps route → Drive file id. /sponsor card exists (1200×675, id `1rAKkeiy2Ofh1iRpsfI2kPr-ma5AG_kpU`). Item pages use their own photo ONLY if source ≥600px (`photoPx` measured per item); otherwise fall back to the designed card — Facebook downgrades small images to thumbnail cards. KNOWN ISSUE: most archive photos are 300–480px iCloud exports; only ~4 of 58 sampled exceed 900px. Fix: Dad re-exports originals (Photos → Export Unmodified Original) into the same Drive folders.

## Open items (priority order)
1. Don & Patti walk /welcome → Ryan approves → first posts. (Everything is ready; this is human-side.)
2. Don's recaps in his words: Belize June 2026 (patients, baptisms), Malawi stories (wells, widows' sewing enterprise, Sam Banda, translators, witch doctors), DR trips. `[NEEDED]` markers show exactly where.
3. 501(c)(3): legal name, address, memo instructions → lib/site.ts; then tax language + PayPal charity rates.
4. PayPal Developer app + webhooks → `donations` table → live Given card, live progress bars on store + goal meters.
5. Next trip announcement → new `upcoming` entry in content/trips.ts (countdown + goal thermometer auto-activate).
6. Hi-res photo re-export from Dad (fixes share cards + Google rich results).
7. More OG cards from Ryan: /, /give, /albums, /trips, /thank-you (add one line each in lib/og.ts).
8. Don's sermons section; Don's book sales page; Patti's salsa in /store (photos already live in her album).
9. Push repo to GitHub + connect Vercel (kills the archive-deploy dance); move photos off Drive into Supabase storage eventually.
10. Google Search Console verify + submit sitemap; church-partner backlinks.
11. Admin phase 2: edit existing posts, sermon uploads, live-visitor stat card in dashboard.

## Analytics snapshot (July 2026)
~66 visitors/126 pageviews per week and climbing; top referrer Facebook; 55% mobile; mobile RES 100, desktop fixed from 67 by self-hosting fonts + SVG watermark cross. Live-presence pill verified with real concurrent visitors.

## Addendum — July 28, 2026 (evening): Transparency & conversion layer
- **/transparency "Open Book"** (in nav + footer + sitemap): live raised/deployed/"$0 kept as pay" totals from `ledger_entries` (public-read, author-write; `ledger_totals()` RPC), running entry feed, per-item funding bars against Don's budget, evidence section linking wells/Bibles/widows albums, newsletter capture. Honest empty state until first entry.
- **Admin "Money" tab**: Don/Patti/Ryan record "We received a gift" / "We spent money" (amount, category, note — no donor full names). Entries appear publicly within 60s.
- **ShareButton** (native share sheet / copy-link) on blog posts (static+db), sponsor items, transparency hero.
- Blog bridge live: admin posts → public /blog within 60s, separate Don/Patti bylines, comments (moderated) on db posts. Don (dnichols3270@yahoo.com) and Patti (nichols3270@yahoo.com) registered as authors; footer "Don & Patti Sign In" button.
- Page-view counter (`page_views`, counts-only public) + live presence pill feed real numbers site-wide.
- NOTE: Notion brain pages predate this addendum — re-sync when convenient.

## Addendum — July 28, 2026 (late): Photographs, passwords, the app, and the list

### Passwords (Ryan's decision — no email link)
- **Both accounts sign in with email + password.** Shared starter password: `Nichols1!`
  - Don `dnichols3270@yahoo.com` · Patti `nichols3270@yahoo.com`
  - Both verified against the live auth endpoint — each returns a session.
- **They change it themselves.** Admin header → "Your account" → new password twice → save.
  Sets `user_metadata.password_set = true`, which retires the gold "Pick your own password"
  banner **per person** (Don changing his does not silence Patti's).
- Magic link / 6-digit OTP survives only as the forgot-password fallback. Resend SMTP still
  matters for that path and for activity notifications, but it no longer gates login.

### Photographs — the site now leads with their own work
Ryan's note: *"the graphics [must] be on another level than this."* Fixed by replacing flat
cards with archive photographs, all verified by eye and measured for resolution first
(most archive files are 300–480px iCloud exports; these are the genuine 2000px originals):
- **Hero** — `1p64gHV_x_TstBKJXK3QCQaCPQ2RAII60` (2000×1500, Patti fitting a man for glasses)
  full-bleed at 45% under a 105° teal scrim, `fetchPriority="high"`.
- **Journey** — 8-step photographic zigzag timeline, gold centre line, oversized numerals.
- **Impact** — three tall photo cards with gold price pills linking straight to the sales page:
  `1CXDEsZFj1QaEBvcqNg2LH_8h5QqTigYN` · `1ZwwAFnLVQHPshkFvBI35ksl0vbAUMgKx` · `1Q_EcBiYkUEopoM8dsGtO6S8J6DIu8ISP`
- **Why Belize** — 4:5 portrait `1fpRWkrIGlztXxtCaS3DPwbFc27ubSrQr` (2000×3556) with offset gold rule.
- **/give/thank-you** — rebuilt with the same photograph as a hero.
- Technique for finding these: contact-sheet triage in the browser (`javascript_tool` replaces
  the document with a CSS grid of `lh3` thumbnails labelled with `naturalWidth×naturalHeight`,
  then screenshot). Fastest way to review hundreds of photos and reject the low-res ones.

### Navigation
Top nav was ten long labels; it wrapped to two lines between 1024–1300px and crushed the
wordmark. Now eight short ones (`site.nav`); the full map lives in the new `site.footerNav`,
so no page lost its link.

### The app on their phones
- `app/manifest.ts` → `standalone`, `start_url: "/admin"`, theme `#0a3d40`, portrait,
  long-press shortcuts to Write and Thanks.
- `app/pwa-icon/[size]/route.tsx` generates real 192/512 PNGs (Android will not offer
  "Install app" without them). A Route Handler **must not** export `contentType` — that field
  is only for Next's image-convention files and fails the build.
- `appleWebApp` metadata + `viewport.viewportFit: "cover"` (iOS ignores the manifest's display mode).
- `globals.css`: safe-area insets, 16px minimum input font (stops iOS zoom-on-focus),
  `overscroll-behavior: none` in standalone, fade between admin tabs.
- Admin tab bar is now 3×2 instead of 6-across — six targets in one row clip at 390px.

### The list (Ryan: "collect emails, names, phone numbers, purchase information")
- `subscribers` gained `interest`, `city_state`, `wants_texts`, `notes`.
- **`join_list(...)` SECURITY DEFINER RPC** is the only public write path. One row per person;
  detail is merged, never blanked, so a footer form cannot wipe what the post-gift form
  collected. A first attempt used a public UPDATE policy with `USING(true)` — that would have
  let anyone rewrite anyone's row, and was withdrawn in the next migration. Do not reintroduce it.
  - Gotcha: a unique index named `subscribers_email_key` already existed on plain `(email)`,
    so `CREATE INDEX IF NOT EXISTS ... ON (lower(email))` was skipped by name and
    `ON CONFLICT (lower(email))` matched nothing. Function lowercases before insert and
    targets `(email)`.
- `components/JoinForm.tsx` — one form, dialled per context (`askName`/`askPhone`/`askPlace`/
  `offerTexts`), plus a honeypot + 2s minimum fill time. No CAPTCHA, ever. Live on the
  homepage, /transparency, /members, /give/thank-you. `NewsletterForm` remains only on
  /store and profile pages.
- **`gift_intents`** — logged via `navigator.sendBeacon` as someone leaves for PayPal
  (item, qty, amount, monthly). **INTENT, NOT REVENUE.** PayPal still does not report back.
  Every screen showing it says so. The Money tab stays the only place a dollar is claimed.
- **Admin "People" tab** — the list with search, tap-to-call / tap-to-email, and
  "Save the list to my phone" (CSV, quoted fields, UTF-8 BOM for Excel). Plus a
  "what people are choosing" panel over `gift_intents`, explicitly labelled as not money.

### Deploy note
The build cache carried a stale `svelte` tree that broke `npm install` with ERESOLVE.
The project's install command is now `npm install --legacy-peer-deps`. Keep it.

### Still open
- Resend DNS at GoDaddy (domain `send.donandpatti.com`, id `46d588be-7c2d-4449-b41d-e331208c7705`)
  → then Supabase custom SMTP → then activity-notification emails.
- One bot signup is sitting in `subscribers` (`w.ivo.v.ulu.ne85.8@gmail.com`, random-string
  name). Left in place — it is Ryan's data to delete. The honeypot should stop the next one.
- Post / thank-you / ledger editing in admin; Team screen; roles generalisation.
- GitHub + Vercel git integration to retire the archive deploy.

## Addendum — July 29, 2026: Don's first post, and the audit it triggered

**Don published his first story** — "Number 1 Priority: Giving Bibles to People", 3,373
words in his own voice (Malawi 2014, the mustard seed, $135 in his wallet, 12 Bibles).
56 photos. It is live and it is the best thing on the site.

Two things he asked for by name, both now built:
- **Reopenable drafts.** He saved a draft, the form cleared, and there was no way back
  to it — he phoned Ryan to ask where it went. The Write screen now lists drafts, saving
  keeps him in place, work parks to the phone as he types, and a recovery banner offers
  back anything left mid-sentence.
- **Per-photo captions.** `site_posts.photo_captions text[]`, matched to `photo_urls` by
  position. The caption is BOTH the visible line and the alt text.

### AUTOMATIC POST ENRICHMENT (`lib/postEnrich.ts` + `components/PostEnrichment.tsx`)
Every published post is built out with no work from Don or Patti:
pull-quote from their own words → matched supply item with a 3-preset give box →
follow form → share prompt → related album. Matching is tag-first, then keyword-scored
with a floor, so it shows a general ask rather than guessing.
**Hard rules, do not relax:** nothing interrupts the story (the pull-quote is the only
thing inside the text, and it is their own sentence); one ask, not five; the card says
"Goes to the next trip, not the one in this story"; no urgency, no fake numbers.

### Audit findings fixed the same day
1. **11 MB page.** 56 phone photos served at full camera resolution — on a site that is
   55% mobile. `lib/storageImage.ts` rewrites Supabase URLs to `/render/image/public/`
   at the width actually displayed. First screenful is now ~460 KB. Originals untouched.
2. **Photo grid capped at 12** (`components/PostPhotos.tsx`) with "Show all N photographs".
   55 photos put nine screens between his last sentence and the giving card.
3. **Db posts were missing from the sitemap** — everything they write was invisible to
   Google's discovery. `app/sitemap.ts` is now async and includes `fetchDbPosts()`.
4. **Twitter/X card showed the site default title**, not the post title. Added per-post
   `twitter` metadata + canonical + `publishedTime`/`authors`.
5. **Article JSON-LD had no `image`** — Google will not render an Article rich result
   without one.
6. **`site.url` was the apex**, which 308-redirects to www. Every canonical, OG url and
   sitemap entry pointed at a redirect. Now `https://www.donandpatti.com`.
7. Paragraph spacing broke when the pull-quote wrapper was a `<div>` —
   `.prose-mission > p` is a direct-child selector. Use a Fragment.
8. "Put a bible in someone's hands" → per-item headlines with correct capitalisation.

### Passwords
Don changed his own on July 29 (14:57 UTC) via the "Pick your own password" flow —
`Nichols1!` no longer works for him. Patti had not yet as of that evening.

## Addendum — July 29, 2026 (late): The article template

Ryan's note: the enrichment under the story was good, the *reading* of it was still
"plain jane." The article template is now its own thing.

**`components/ArticleBody.tsx` + `.article-*` rules in globals.css**
- Photo hero header: the post's own lead photograph behind the title under a teal
  gradient, with tag / byline / date / reading time / read count. Falls back to the
  plain deep band when a post has no photo.
- 20px body on a 40rem measure at 1.78 line-height. Long lines are the main reason
  people abandon long stories on desktop.
- Drop cap + larger lede paragraph.
- Automatic first-mention internal links (place → album, item → sponsor page, money
  talk → /transparency). Max one use per target, stingy by design.
- Gold cross ornament at ~62% for pieces of 9+ paragraphs.
- `components/ReadingProgress.tsx` — gold hairline across the top.
- `components/StickyGive.tsx` — slim bar appears at 55% read, dismissible, never modal.

**Scripture styling — read this before touching it.**
The first version matched a scripture phrase *anywhere* in a paragraph and caught Don's
own narration ("And this is how God works! She was sitting in the exact same location…
He opened it and starting reading, 'In the beginning, God created….'"), presenting his
storytelling as though it were the Bible. On a preacher's site that is a category
error, not a cosmetic one. The rule now requires the paragraph to be ≤220 chars AND to
*open* with the verse. Mixed story-and-quotation paragraphs stay plain prose. When in
doubt, do nothing.

**Also fixed:** byline separators are CSS-generated (`.byline > * + *::before`) because a
hand-placed "·" before the read counter left an orphan bullet on every post with fewer
than 5 reads.

**Standing rule reaffirmed:** not one word Don writes is ever altered. Everything in the
article template is presentation only.

## Addendum — Share cards build themselves from what Don submits

`app/blog/[slug]/opengraph-image.tsx` composes a 1200×630 card per post. No design
step, no manual export — it reads the post and adapts on four axes:

1. **Photo shape** (`lib/imageSize.ts` parses JPEG SOF / PNG IHDR from a 64KB Range
   request). Ratio ≥ 1.4 → the photo becomes the whole card with a bottom scrim and the
   title over it. Squarer than that → a side panel sized to the photo's OWN proportions.
   Don's lead photo is 960×913 (ratio 1.05); forcing it into a wide crop decapitated him
   and Patti, which is exactly what Facebook does to a raw square.
2. **Subject + place** in the eyebrow, from `enrichPost()` — "BIBLES · MALAWI". Card and
   article always agree because they read the same logic.
3. **Photo count** — "· 56 photographs" when he attaches more than three. A reason to click.
4. **Title length** — type steps 68 → 58 → 50.

Every branch degrades: no dimensions → panel layout; no photo → typographic card with the
gold cross; no font → fallback face. **A worse card always beats a broken one.**

Two traps already paid for:
- Do NOT set `openGraph.images` in `generateMetadata` — it overrides the generated card.
- Do NOT use `next: { revalidate }` on the font fetch; it fails silently on Vercel and the
  card renders in the wrong typeface. Google Fonts also needs an OLD User-Agent to return
  .ttf instead of unparseable woff2.

## Full site scan — July 29, 2026 (end of day)

**Clean.** 24 routes + 10 sponsor pages + 12 albums all 200; /nonsense → 404.
All 18 public tables have RLS with policies. Probed 15 tables as an anonymous
visitor: only `site_posts` (published), `thank_you_notes`, and `trips` return rows.
Subscribers, donations, messages, authors, admin_users, access_requests,
gift_intents, ledger_entries, unapproved comments, page_views — all zero.
Privacy sweep across 20 public pages: no home address, no personal emails, no donor
identity. Zero empty `alt` attributes anywhere. Fonts self-hosted, no googleapis link.
TTFB 130–190ms. Heaviest page pulls 356 KB of images (was ~11 MB).

**Fixed in this pass:** 15 of 17 pages had NO canonical tag. All 22 checked pages now
declare a correct, distinct one. Homepage needed its own `metadata` export — a canonical
in layout.tsx would have been inherited, making every album claim to be the homepage.

**Known and deliberately not fixed:** homepage hero is a 443 KB Drive-hosted JPEG
(0.23s). Drive has no quality parameter, so the only fix is re-exporting the source.
Acceptable.

**The real blockers are not code:**
1. Google has never been told the site exists. No Search Console verification; 47
   sitemap URLs never submitted. Highest-value action available; needs Ryan, ~10 min.
2. One post exists. 509 photographs still described as "photograph 47."
3. Zero subscribers, no email ever sent; Resend DNS still pending at GoDaddy.

---

## DEPLOY RUNBOOK — corrected 29 Jul 2026

Three failures burned about ten minutes and four dead deployments. All three
are avoidable and all three are written down here so they never repeat.

**1. There are TWO Vercel projects. Only one of them owns the domain.**

| project | id | owns |
|---|---|---|
| `don-patti-nichols` | `prj_DwuEAPBypXsjh1MOW9hYPBakZzPb` | **www.donandpatti.com + donandpatti.com** |
| `don-and-patti-nichols` | `prj_nEf1MBobbwfeBFfu7RaTKXOQF2JB` | nothing — created by accident 29 Jul |

Deploying under the wrong name silently succeeds, reports READY, and changes
nothing the public can see. **The project name is `don-patti-nichols`.** No
hyphen between "don" and "patti"... there is no "and". Get it wrong and the
deploy goes into the void.

The stray `don-and-patti-nichols` project should be deleted in the Vercel
dashboard. Left alone it is a trap: a future deploy will land in it, look
healthy, and nobody will understand why the site did not change.

**2. `buildCommand` is capped at 256 characters.**

The old inline fetch-verify-extract-build one-liner no longer fits. Put it in
`boot.sh`, ship that file alongside a stub `package.json`, and set
`buildCommand: "bash boot.sh"`.

**3. `npm install` inside the build skips devDependencies.**

Vercel sets `NODE_ENV=production`, so npm omits devDependencies — and
tailwindcss, postcss and typescript all live there. The build fails with
`Cannot find module 'tailwindcss'` and then a cascade of unresolved `@/`
imports, because Next needs typescript present to read path aliases out of
tsconfig.json. The second error looks like missing source files and is not.
**Use `npm install --legacy-peer-deps --include=dev`.**

Also: the stub `package.json` must list `next` in dependencies or Vercel
rejects the deploy with `NEXT_NO_VERSION` before `buildCommand` ever runs.
Setting `installCommand: "echo skip"` triggers the same failure.

### The working recipe

```
name:            don-patti-nichols
framework:       nextjs
installCommand:  npm install --legacy-peer-deps
buildCommand:    bash boot.sh
files:           package.json (real dependency list, verbatim) + boot.sh
```

`boot.sh` curls the tarball, verifies sha256 (`sha256sum -c -`, which aborts
under `set -euo pipefail` on mismatch so a swapped or truncated download can
never build), extracts, removes itself, then installs with `--include=dev` and
builds.

**Verify against `https://www.donandpatti.com`, never the deployment URL.** A
`*.vercel.app` preview URL 302s on protected routes and will not tell you
whether the domain actually moved. Confirm `www.donandpatti.com` appears in the
deployment's alias list before believing it shipped.

### Long-term fix — DONE, same day

The repo `RealRyanNichols/Don-PattiNichols` was ALREADY connected to the
`don-patti-nichols` Vercel project (since Jul 9) — the archive deploys were
never necessary. The repo was just stale.

**THE DEPLOY PATH IS NOW GIT. Archive deploys are retired.**

- Local clone: `~/Projects/Don-PattiNichols` on Ryan's Mac (gh authenticated
  as RealRyanNichols). Default branch: `main`.
- Workflow: edit in the session working copy → rsync into the clone
  (exclude .git/node_modules/.next) → commit → `git push origin main` →
  Vercel builds and promotes automatically (~90s).
- ALWAYS `npm run build` locally before pushing. The first git push failed
  in production because the OG font was fetched from Google Fonts during
  build-time prerender and the fetch flaked. Fonts now live in the repo
  (assets/fonts/Lora-Bold.ttf via lib/ogFont.ts + outputFileTracingIncludes)
  — never reintroduce network fetches into OG routes.
- The tarball/boot.sh/litterbox flow above is HISTORY. Do not use it again.

---

## GOOGLE SEARCH CONSOLE — VERIFIED 29 Jul 2026

Property: `https://www.donandpatti.com/` (URL-prefix), Ryan's Google account.
Method: HTML meta tag, token `b6S0ay4_gt-KoUCUiHVdfi6GcrRPVGS8m2rRWGsn3Wc`,
hardcoded as the default in `app/layout.tsx` (env var overrides). Google
re-checks the tag periodically — REMOVING IT UN-VERIFIES THE SITE.

Sitemap `/sitemap.xml` submitted same day. Status showed "Couldn't fetch"
immediately after submission — this is a known GSC quirk for brand-new
properties, not an error; it flips to Success after the first real crawl.
If it still says Couldn't fetch after ~3 days, investigate then, not before.

IndexNow: key `448094894f88e5d128eceaafa798b4e9` hosted at
`public/448094894f88e5d128eceaafa798b4e9.txt` (world-readable BY DESIGN — do
not clean it up). All 49 URLs pushed 29 Jul, accepted 202. `lib/indexnow.ts`
has `pingIndexNow()` for future publishes.

Stray Vercel project `don-and-patti-nichols`: deletion dialog was opened but
the final type-to-confirm step needs a human. If still present, delete from
its Settings page — type the project name, then "delete my project".
