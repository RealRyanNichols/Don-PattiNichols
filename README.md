# Don & Patti Nichols — Mission Platform

The online home of Don & Patti Nichols: Belize medical missions, preaching, the giving
engine, the blog timeline, and the family legacy archive. Built by their son Ryan Nichols.

> **"Medical Care for the Body. Hope for the Soul."** — Don Nichols

- **Live site:** https://don-and-patti-nichols.vercel.app
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · Supabase · Vercel
- **No UI libraries.** Dependencies: `next`, `react`, `react-dom`, `@vercel/analytics`.

## Editing content (no code knowledge needed beyond copy/paste)

All content lives in typed TypeScript files. Edit, commit, push — Vercel redeploys
automatically.

| What | Where |
| --- | --- |
| Site name, URL, nav, next-trip dates/goal, PayPal links, GA/Pixel IDs | `lib/site.ts` |
| Blog posts (the Timeline) | `content/posts.ts` |
| Trips (upcoming + history) | `content/trips.ts` |
| Fill-the-Trunks supply items & hand-updated funded counts | `content/supplies.ts` |
| Per-item sales pages: budget lines + quotes from Don's writing | `content/supply-details.ts` |
| Mission statement paragraphs | `content/mission.ts` |
| Why Belize paragraphs | `content/belize.ts` |
| The 8-step "Story of a Mission" | `content/journey.ts` |
| Don & Patti names/roles/initials | `content/people.ts` |
| Photo sources | `lib/photos.ts` |

### Content rules (non-negotiable)

- Everything marked as **Don's exact wording** is his published writing. Never paraphrase,
  never "improve" it. Same for the budget figures ($1,200/missionary, $2.50 Bibles, the
  $3,940 supply goal, …) — they are Don's published numbers.
- `[NEEDED]` comments mark facts we don't have yet. **Never invent** facts, dates, team
  sizes, or trip results. Placeholder honesty over fabricated detail.
- Tax-deductibility language stays **off** the site until the 501(c)(3) details arrive
  (`lib/site.ts → giving.org501c3`).
- Scripture is KJV (public domain).

### Activating things

- **Trip countdown:** set `site.trip.startDate` (YYYY-MM-DD) in `lib/site.ts` — the
  homepage/belize/trip-page countdowns activate automatically. Set `dateLabel` too
  (e.g. "June 2027").
- **PayPal giving:** paste Don's PayPal Donate links into `lib/site.ts →
  giving.paypalUrl` and each `giving.funds[].paypalUrl`. Give buttons switch from
  `#ways-to-give` anchors to real checkout automatically.
- **Supply drive progress:** update `funded` counts in `content/supplies.ts` after
  gifts come in (until live Supabase totals are wired up).

## Forms & data (live)

Forms write to Supabase project `rxjsykcbedtyxfvyfyhl`:

- Newsletter/partner signups → `subscribers` (email, name, phone) via `POST /api/subscribe`
- Contact/prayer/speaking → `messages` via `POST /api/contact`

Tables are public-INSERT-only under RLS. The publishable key is intentionally hardcoded
as a fallback in `lib/supabase.ts`; set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel to override.

## Design language

Deep teal `#0a3d40` · sea `#0e6b70` · warm sand `#faf6ef` · gold `#c9962e` ·
Lora (serif) + Inter (sans). Tone: humble, reverent, direct. Christian but never cheesy.

## Photo privacy

Drive photos IMG_1861/1862/1864/1865/1866 show Don's home address, phone, and personal
email on trunk labels — **never publish** without cropping/blurring. Prefer
group/logistics/scenery shots; avoid identifiable patients in clinical situations.

## Development

```bash
npm install
npm run dev          # local dev server
npx tsc --noEmit     # typecheck
npm run build        # production build — run before every push
```

See `BLUEPRINT.md` for the roadmap and current state.
