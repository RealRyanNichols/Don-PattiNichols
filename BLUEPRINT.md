# BLUEPRINT — Don & Patti Nichols Mission Platform

The plan of record for the platform. (Rewritten from the project handoff after the source
was recovered from the live deployment; the original BLUEPRINT.md predates this repo.)

## What's built (don't rebuild)

16 routes, all live:

- **Home** — hero with rotating KJV verses, mission intro, trip card (countdown-ready),
  8-step journey, latest posts, newsletter, giving CTAs
- **/mission** — Don's mission statement
- **/belize** — Why Belize (Anchor Mission sign photo, stats, trip card)
- **/behind-the-mission** — logistics gallery, "GIVEN FREE OF CHARGE" quote, trunk
  inventory story
- **/sponsor** — "Fill the Trunks" interactive supply drive: 10 items from Don's real
  budget, progress bars, qty steppers, $3,940 goal thermometer (`funded` counts
  hand-updated in `content/supplies.ts`)
- **/sponsor/[id]** — a full sales page for each of the 10 supply items: animated
  progress ring, sponsored/needed/raised stats, quantity picker with live total,
  the item's lines from the published trip budget, a quote from Don's own writing
  (`content/supply-details.ts` — existing wording only), related items, and the
  goal thermometer. Linked from the supply-drive cards and the /give giving levels.
- **/trips** + **/trips/[slug]** — upcoming + belize-2026 (9-photo gallery)
- **/give** — PayPal-first, giving levels, designated funds, full budget transparency,
  ways-to-give · **/give/thank-you**
- **/blog** timeline (shared Don+Patti feed with avatars) + **/blog/[slug]** (Article
  JSON-LD) — 4 published posts (Don's real writing)
- **/don** · **/patti** · **/our-story** (bios pending real content)
- **/store** (coming-soon) · **/contact** (prayer/speaking/giving topics) ·
  **/members** "Mission Partners Hub" · **/privacy** · **/terms**

- **/admin** — the Family Dashboard (unlisted, noindex): Supabase Auth email+password
  login gated by the `admin_users` allowlist; tabs for Messages (read + mark handled +
  mailto reply), Followers, Donations, Updates (step-by-step post wizard that publishes
  to the live Timeline), Team (manage the allowlist), and a plain-English Help guide.
  Real security is RLS: `is_admin()` policies on messages/subscribers/donations/posts.

Plus: sitemap, robots, OG image, favicon, org/person JSON-LD, Vercel Analytics, GA4/Meta
Pixel slots (`lib/site.ts → analytics`), click tracking (`lib/track.ts`), live donation
totals (`fund_totals` view → progress meters, 5-min revalidate), and Timeline posts
served from the `posts` table merged with the TS seed content.

## Infrastructure state

- **Hosting:** live production currently sits on the `team-kjr` Vercel account
  (deployed via an archive hack). This repo exists so Ryan can import it into **his own**
  Vercel project (`realryannichols/don-patti-nichols`, framework: Next.js, no custom
  build command) — every push then auto-deploys to his account. After verifying all 16
  routes on the new deployment, update `site.url` in `lib/site.ts` and abandon the
  team-kjr project.
- **Supabase:** project `Don&PattiNichols` (`rxjsykcbedtyxfvyfyhl`) — schema applied,
  forms live. Set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
  project settings; the hardcoded fallbacks in `lib/supabase.ts` can be removed once
  envs are live.
- **Photos:** to be self-hosted under `public/images/` (converted from the Drive
  originals) so the Drive folder no longer needs public sharing. `lib/photos.ts` is the
  single source of photo paths.

## Backlog — priority order

1. **PayPal activation** (when Don sends Donate-button links): paste into
   `lib/site.ts → giving.funds[].paypalUrl` + `giving.paypalUrl`. Then build PayPal
   webhooks (IPN/Webhooks → a Next.js route or Supabase Edge Function) writing to the
   `donations` table. DONE: the progress meters already read live totals from Supabase
   (`fund_totals` view, `lib/donations.ts`) and merge them with the hand-updated
   `content/supplies.ts` counts — the webhook writer is the only missing piece.
2. **Email notifications:** Supabase Database Webhook or Edge Function → email Don &
   Patti (Resend free tier) on new `messages` and `subscribers` rows. Prayer requests
   should not sit unseen.
3. **Trip config from Don:** dates (`startDate` activates the homepage countdown
   automatically), fundraising goal, team size, past-trips history.
4. **Supabase-driven content + admin:** MOSTLY DONE — /admin ships with Supabase Auth,
   the admin allowlist, and a post wizard writing to the `posts` table; the site merges
   those with the TS seed posts (kept as fallback). Remaining: move trips to the `trips`
   table the same way. One-time setup for Ryan: create Don's & Patti's logins in the
   Supabase dashboard (Authentication → Users → Add user, auto-confirm) and add their
   emails on the dashboard's Team tab.
5. **Partner accounts:** Supabase Auth (magic link) for /members; show each partner
   their own giving history from `donations`. Promised on the page as "coming."
6. **Bios & Our Story:** real content from the family + headshots
   (`public/images/don.jpg`, `patti.jpg`; `content/people.ts`).
7. **Store:** products in `products` table + PayPal checkout; sponsor-a-kit packs tie
   into the supply drive.
8. **Polish:** $1,200 missionary card as full-width feature on /give; photo-based OG
   image; blurred/cropped trunk-label photo for Behind the Mission; lightbox for
   galleries; a real favicon.
9. **SEO ops (Ryan, not code):** Google Search Console + Bing verify & submit sitemap;
   partner churches backlink; Google Ad Grants if 501(c)(3) confirmed.
10. **Custom domain** when purchased: add in Vercel, update `site.url`, 301s handled by
    Vercel.

## Data Ryan still owes the project

PayPal Donate links (Don) · 501(c)(3) legal name + mailing address + memo instructions ·
upcoming trip dates + goal · bios/testimonies · contact email + socials · GA4/Meta Pixel
IDs when ads start.

## Working agreement

Verify before deploying (`npx tsc --noEmit` + `npm run build`). Small commits, clear
messages. When in doubt about content: mark `[NEEDED]`, ask Ryan, never invent. This
site is a family's testimony and a real fundraising engine — treat every word and every
dollar figure as load-bearing.

---

## Work log — SEO & discoverability, pass 1

### Photo captions (the "509 doors" work, at this repo's real scale)

The brief for this pass described a 509-photo archive across five countries
(`content/albums.ts`, `components/PhotoWall.tsx`, `content/captions.ts` keyed by
Drive file id). **That archive does not exist in this repo.** What exists is 14
self-hosted JPEGs in `public/images/`, and the pathology the brief describes is
real but smaller: all nine Belize 2026 photographs were emitted with the single
identical alt string `"Belize Medical Mission photo"` (`content/trips.ts`).

Fixed for all nine:

- New `content/captions.ts` — per-photo `alt` + `caption`, written by opening each
  JPEG and describing what is visibly in the frame. The file header carries the
  rules for writing more (describe only what is visible; never assert a name,
  village, date, diagnosis, or outcome not already in `content/trips.ts`).
- `content/trips.ts` now reads from it. The generated-string fallback is gone —
  a missing caption is a type error, not a silent `"…photo"`.
- `components/GalleryLightbox.tsx` renders captions as `<figcaption>` under each
  thumbnail and in the lightbox. Captions are page content, not just alt text.
  Falls back to `alt` for the Behind the Mission gallery, which has alt but no
  captions yet.
- `app/trips/[slug]/page.tsx` emits `ImageGallery` + per-photo `ImageObject`
  JSON-LD carrying the captions, so they reach Google Images.

**Not verified, needs Don:** the captions describe what is visible and nothing
more. No village names, no patient details, no counts. If Don can name the
village or the occasion, those captions get better — but they are honest as-is.

### Fonts — a live LCP regression, now fixed

`app/layout.tsx` was loading Inter and Lora via a render-blocking
`<link>` to `fonts.googleapis.com`, the exact thing the working agreement forbids.
Replaced with `next/font/google`, which downloads both at build time and serves
them from our own origin with matching fallback metrics. Verified in the build
output: page HTML now preloads self-hosted `.woff2` and contains no `googleapis`
reference. (The remaining `googleapis` strings in `.next/server/app/opengraph-image`
are inside Next's own OG-image helper — runtime social-card generation, not a
page render path.)

`app/globals.css` no longer redeclares `--font-sans` / `--font-serif`; next/font
owns them. Tailwind's `fontFamily` config was already pointed at those variables
and needed no change.

### Indexability

- `app/sitemap.ts` — added `/privacy` and `/terms`, the two public routes that
  were missing. `/admin` and `/give/thank-you` are deliberately excluded.
- `app/give/thank-you/page.tsx` — now `robots: { index: false }`.
- `lib/site.ts → verification` — new slot for Google Search Console and Bing
  tokens, wired into layout metadata and rendered only when set. **This is the
  one that matters and it is still blocked on Ryan:** the site has never been
  verified with either, so `/sitemap.xml` has never been handed to anyone.
  Step-by-step instructions are in the comment on that field.

Titles and descriptions were audited across all routes — they are genuinely
distinct, including the ten `/sponsor/[id]` pages. No duplicate-suppression
problem found.

### Deliberately not done in this pass

Phases 3–6 of the brief (cost/trunk/Belize-recap pages, OG image generation per
album, related-content links, `/start-here`, the Resend welcome + broadcast
email) are untouched, pending Ryan's read of the caption voice. Several of them
also assume files this repo does not have (`lib/og.ts`, `components/ShareButton.tsx`,
`components/JoinForm.tsx`, `CLAUDE-CODE-ADMIN-PORTAL.md`).
