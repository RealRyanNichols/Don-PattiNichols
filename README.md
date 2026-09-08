# Don & Patti Nichols — Mission Platform

**Medical Care for the Body. Hope for the Soul.**

The online home of Don & Patti Nichols: Belize medical missions, preaching, giving, blog, and family legacy. See `BLUEPRINT.md` for the full plan and roadmap.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Vercel · Supabase (existing production project)

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Where things live

| What                                                                  | Where                 |
| --------------------------------------------------------------------- | --------------------- |
| Site settings, payment links, analytics IDs, nav                      | `lib/site.ts`         |
| Blog posts                                                            | `content/posts.ts`    |
| Trips (dates, goals, recaps)                                          | `content/trips.ts`    |
| Mission / Why Belize / Support & budget / Behind-the-mission text     | `content/*.ts`        |
| Don & Patti profiles                                                  | `content/people.ts`   |
| Supply drive items + funded counts (update `funded` as gifts come in) | `content/supplies.ts` |
| Pages                                                                 | `app/**/page.tsx`     |
| Phase-2 database schema                                               | `supabase/schema.sql` |

## Common edits

**Set the trip date:** `content/trips.ts` → set `startDate: "2026-10-12"` and `dateLabel` — the homepage countdown turns on automatically.

**Set the fundraising goal:** same file → `goalUsd: 25000`. Update `raisedUsd` by hand for now (Stripe-automated in a later phase).

**Turn on online giving (PAYPAL — primary processor):** in Don's PayPal account go to Pay & Get Paid → Donate button. Create one Donate button per fund (each supports one-time AND monthly in the same checkout). Paste each hosted button URL into `lib/site.ts` → `giving.funds[].paypalUrl`, plus one general link in `giving.paypalUrl`. If the ministry gets PayPal confirmed-charity status (501c3), fees drop to nonprofit rates. Stripe fields remain available as an optional second processor later.

**Publish a post:** Don and Patti sign in at `/admin` with their existing accounts. Write, add photos, save a draft or publish. Founding articles remain in `content/posts.ts`; new stories stay in the existing Supabase `site_posts` table.

**Photos:** drop files in `public/images/` (headshots: `don.jpg`, `patti.jpg`; trip photos: `public/images/trips/<slug>/`) and list trip photos in `content/trips.ts`.

**Analytics:** paste GA4 + Meta Pixel IDs into `lib/site.ts` → `analytics`.

**Custom domain:** buy domain → add to Vercel project → update `url` in `lib/site.ts`.

## Form submissions — LIVE in Supabase

Newsletter signups → `subscribers` table. Contact/prayer/speaking messages → `messages` table.
Project: Don&PattiNichols (`rxjsykcbedtyxfvyfyhl`, https://rxjsykcbedtyxfvyfyhl.supabase.co).
View them: Supabase dashboard → Table Editor. Tables are write-only to the public
(RLS enforced); donations table is service-role only. If the database is unreachable, the visitor receives a retry message.
Private form entries are never copied into application logs.
Next step: email notification to Don & Patti on new messages (Supabase webhook or Edge Function).

## After launch checklist (SEO)

1. Google Search Console → verify → submit `/sitemap.xml`
2. Bing Webmaster Tools → same
3. Ask every partner church to link to the site
4. Post regularly — every trip update is an SEO asset
5. If giving runs through a 501(c)(3): apply for Google Ad Grants ($10k/mo free ads)

## Upgrade checks

`npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
Use Node.js 24 LTS (the configured Vercel runtime). ESLint 9 is pinned because the current Next ESLint React plugin is not compatible with ESLint 10.

Do not apply `supabase/schema.sql` as an upgrade: it is an early reference schema.
This release makes no database, storage, author allowlist, or authentication changes.
PayPal checkout and settlement reporting are separate: the existing webhook needs production credentials before automatic reporting is available.
