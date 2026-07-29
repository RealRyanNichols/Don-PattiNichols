# CLAUDE CODE HANDOFF — Don & Patti Nichols Mission Platform

Copy everything below this line into Claude Code, run from the project folder.

---

You are taking over an ACTIVE, LIVE production website. Read this entire brief before touching anything.

## What this is

The online home of Don & Patti Nichols — Belize medical missions, preaching, giving engine, blog timeline, and family legacy archive. Built by their son Ryan Nichols (RealRyanNichols). The heartbeat line, written by Don, is the site's headline: **"Medical Care for the Body. Hope for the Soul."**

- **LIVE:** https://don-and-patti-nichols.vercel.app
- **Local source of truth:** this folder (the complete, current, type-checked source)
- **GitHub (empty, waiting):** https://github.com/RealRyanNichols/Don-PattiNichols
- **Ryan's own Vercel project (empty, waiting):** vercel.com/realryannichols/don-patti-nichols
- **Supabase (LIVE, schema applied):** project `Don&PattiNichols`, ref `rxjsykcbedtyxfvyfyhl`, https://rxjsykcbedtyxfvyfyhl.supabase.co

## Stack

Next.js 14 App Router + TypeScript + Tailwind CSS 3. Zero UI libraries. Deps: next, react, react-dom, @vercel/analytics. Content lives in typed TS files under `content/`. Config in `lib/site.ts`. Read `BLUEPRINT.md` and `README.md` in this folder for the full plan and editing guide.

## CRITICAL current-state facts

1. **Hosting is on the WRONG Vercel account.** The live deployment sits on team `team-kjr` (a connector account), NOT Ryan's `realryannichols` account. It works, but Ryan must own his platform.
2. **The current production deployment is a hack.** The last deploy shipped the source as a compressed archive (`src.txz`) with a modified build command that extracts it before `npm run build` (chat message-size limits forced this). It builds and serves correctly, but it is not a clean setup.
3. **Photos are hotlinked from Google Drive.** `lib/photos.ts` serves images via `lh3.googleusercontent.com/d/<fileId>` from a publicly-shared Drive folder (`Don&PattiNichols/Pictures`, folder id `1FpUEca_PSQmEzjzQMDpAdEI2C79dPgaA`). If that folder's sharing turns off, images go dark.
4. **Forms are LIVE against Supabase.** Newsletter/partner signups → `subscribers` (email, name, phone); contact/prayer/speaking → `messages`. Tables are public-INSERT-only under RLS; `donations` table is service-role only. The publishable key is intentionally hardcoded in `lib/supabase.ts` (env vars override when set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. **PayPal is the chosen payment processor** (Don's decision). The Give page and Fill the Trunks are built PayPal-first, but NO payment links exist yet — every give button currently routes to `/give#ways-to-give`. Don has not yet created his PayPal Donate buttons.

## FIRST SESSION — do these in order

1. `git init`, commit everything (`.gitignore` already correct), push to `RealRyanNichols/Don-PattiNichols` (main branch).
2. In Ryan's Vercel account: import that GitHub repo into the `don-patti-nichols` project (framework: Next.js, no custom build command — the archive hack dies here). Every push now auto-deploys to Ryan's own account.
3. Verify the new deployment fully (all 16 routes), then treat `<new-project>.vercel.app` as production. Update `site.url` in `lib/site.ts` to the new URL. The old team-kjr project can be abandoned/deleted afterward.
4. **Self-host the photos:** download originals from the Drive folder (Drive API/manual), convert HEIC → web JPEG/WebP (~1600px wide), save under `public/images/`, and rewrite `lib/photos.ts` to local paths. THEN the Drive folder no longer needs public sharing. Photo file-id map with descriptions is in `lib/photos.ts` comments.
5. Set Supabase env vars in Vercel project settings; remove the hardcoded fallbacks in `lib/supabase.ts` once envs are live.

## Voice & content guardrails (NON-NEGOTIABLE)

- Everything under `content/` marked as written by Don Nichols is his EXACT wording. Never paraphrase, never "improve" it. Same for budget numbers ($1,200/missionary, $2.50 Bibles, etc.) — they are Don's published figures.
- `[NEEDED]` comments mark facts we don't have yet. NEVER invent facts, dates, team sizes, or trip results. Placeholder honesty over fabricated detail.
- PRIVACY: Drive photos IMG_1861/1862/1864/1865/1866 show Don's home address, phone, and personal email on trunk labels — EXCLUDED from the site. Never publish without cropping/blurring. Prefer group/logistics/scenery shots; avoid identifiable patients in clinical situations.
- Tax-deductibility language stays OFF until the 501(c)(3) entity details arrive (fields in `lib/site.ts → giving.org501c3`).
- Tone: humble, reverent, direct. Christian but never cheesy. Scripture is KJV (public domain). The design language: deep teal (#0a3d40), sea (#0e6b70), warm sand (#faf6ef), gold (#c9962e); Lora serif + Inter.

## What's already built (don't rebuild)

16 routes: Home (photo, rotating verses, journey, countdown-ready trip card) · /mission · /belize (Anchor Mission sign photo) · /behind-the-mission (logistics gallery, "GIVEN FREE OF CHARGE" quote) · /sponsor "Fill the Trunks" (interactive supply drive: 10 items from Don's real budget, progress bars, qty steppers, $3,940 goal thermometer; `funded` counts hand-updated in `content/supplies.ts`) · /trips + /trips/[slug] (9-photo gallery on belize-2026) · /give (PayPal-first, giving levels, designated funds, full budget transparency, ways-to-give) · /give/thank-you · /blog timeline (shared Don+Patti feed with avatars) + /blog/[slug] (Article JSON-LD) · /don · /patti · /our-story · /store (coming-soon) · /contact (prayer/speaking/giving topics) · /members "Mission Partners Hub" · /privacy · /terms. Plus: sitemap, robots, OG image, favicon, org/person JSON-LD, Vercel Analytics, GA4/Meta Pixel slots, click-tracking (`lib/track.ts`), 4 published posts (Don's real writing).

## BACKLOG — in priority order

1. **PayPal activation** (when Don sends Donate-button links): paste into `lib/site.ts → giving.funds[].paypalUrl` + `giving.paypalUrl`. Then build PayPal webhooks (IPN/Webhooks → a Next.js route or Supabase Edge Function) writing to the `donations` table, and make `content/supplies.ts` funded counts + GoalMeter read LIVE totals from Supabase.
2. **Email notifications:** Supabase Database Webhook or Edge Function → email Don & Patti (Resend free tier) on new `messages` and `subscribers` rows. Prayer requests should not sit unseen.
3. **Trip config from Don:** dates (`startDate` activates the homepage countdown automatically), fundraising goal, team size, past-trips history.
4. **Supabase-driven content + admin:** move posts/trips from TS files to the existing `posts`/`trips` tables; simple password-protected /admin (Supabase Auth, Don & Patti only) so they publish without code. Keep the TS files as seed/fallback.
5. **Partner accounts:** Supabase Auth (magic link) for /members; show each partner their own giving history from `donations`. Promised on the page as "coming."
6. **Bios & Our Story:** real content from the family + headshots (`public/images/don.jpg`, `patti.jpg`; `content/people.ts`).
7. **Store:** products in `products` table + PayPal checkout; sponsor-a-kit packs tie into supply drive.
8. **Polish:** $1,200 missionary card as full-width feature on /give; photo-based OG image; blurred/cropped trunk-label photo for Behind the Mission; lightbox for galleries; a real favicon.
9. **SEO ops (Ryan, not code):** Google Search Console + Bing verify & submit sitemap; partner churches backlink; Google Ad Grants if 501(c)(3) confirmed.
10. **Custom domain** when purchased: add in Vercel, update `site.url`, 301s handled by Vercel.

## THE PHOTO ARCHIVE (added July 18, 2026) — the next big buildout

Don uploaded his 10-15 year mission archive into Drive folder `Don&PattiNichols/Pictures`
(id `1FpUEca_PSQmEzjzQMDpAdEI2C79dPgaA`, owner theflashflash24@gmail.com, shared anyone-with-link).
Thirteen subfolders, each = a trip or story deserving its own page. Folder name → Drive folder id:

- Malawi → 1JkxUWSz1Po5UYpRY180EWFPQdBx9il2J
- Dominican Republic → 1nBdpJITzincHnbilzV0mzIUzALlImzvV
- Sam Banda The Painter With No Hands → 12M4spskrqbct8QXK192AOeU0qJ7vM_tN
- Malawi Translators → 1KF--x3OCaM-1vMq61vGhYAFw-hPbf70-
- Ross & Sherry Collier → 14nZrqR2ui85AtAhz6pCOilAZw0YVyC6p
- Malawi Ministry Items → 1RWtdmHegYST7dalLzzN7l1jlPhr5zyTa
- Malawi Water Wells Donated → 1hsk1hIHLslzdTbyB5EZltqNz3zxsGekg
- Bible Ministry → 1LRM41I8nurF2dAm9nojgMYoQxCHPFZvb
- Malawi Witch Doctors → 1Ltmdj51zfGEH0e7ilu_sg6JLgPeACmU_
- Widows And Orphans → 1XFXPBaESuGK4AWkuZL97fvpUyhZS9Tgr
- Patti's Money Ministry → 1FoDQ_Oytm5_-Onx8lZEl5U7O3pKAc3hr
- Belize (First Batch) → 1CwqIyvJXueBmTE53QWxS2Rd8WpUzIing
- Mission History → 1nrhobCDn78pd0ICBOq2DwKWEpcd7mdl1

More folders/photos WILL keep arriving — re-list the parent before each ingestion pass.

INGESTION PROCEDURE (one folder at a time, per Ryan): list files via Drive connector →
view each image (lh3.googleusercontent.com/d/<fileId>=w1600 renders publicly) → screen for
privacy (addresses/phones/docs; dignity of people photographed) → pick the strong ones →
build the trip/story page (extend content/trips.ts, or a new content/stories.ts for
people-stories like Sam Banda) → captions ONLY from what's visible + what Don writes;
NEVER invent trip facts, dates, or names → deploy. Ask Don for each trip's story text —
his voice, verbatim, same as the Belize sections. Facts revealed by folder names alone
(Malawi, Dominican Republic, water wells donated, Patti's ministry) may be referenced as
subjects, but details need Don's words. This unlocks: Malawi + DR trip pages, a Stories
section (Sam Banda, the Colliers), Patti's ministry on /patti, and Mission History for
/our-story. The upcoming trip should note Don's team history spans South America, the
Caribbean, Africa, and Europe (his own published words already on /mission).

## Data Ryan still owes the project

PayPal Donate links (Don) · 501(c)(3) legal name + mailing address + memo instructions · upcoming trip dates + goal · bios/testimonies · contact email + socials · GA4/Meta Pixel IDs when ads start.

## Working agreement

Verify before deploying (`npx tsc --noEmit` + `npm run build`). Small commits, clear messages. When in doubt about content: mark `[NEEDED]`, ask Ryan, never invent. This site is a family's testimony and a real fundraising engine — treat every word and every dollar figure as load-bearing.
