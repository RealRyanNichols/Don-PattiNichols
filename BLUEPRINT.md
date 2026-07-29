# Don & Patti Nichols — Mission Platform Blueprint

**The online home of Don & Patti Nichols: their mission work, their preaching, their giving engine, and their legacy.**

Built July 2026. Owner: Ryan Nichols. Content: Don & Patti Nichols.

---

## 1. What This Is

This is not a brochure site. It is four things at once:

1. **A giving engine.** People hear Don & Patti speak at a church, search their names, land here, and give — one-time, recurring, or designated to a specific trip or need. No more "raise money only when we can be there in person."
2. **A mission hub.** The upcoming Belize medical mission trip front and center: countdown, fundraising goal, what the money buys (medications, reading glasses, hygiene kits, Bibles), team info, and updates.
3. **A pulpit and a pen.** Don posts as Don. Patti posts as Patti. Sermons, devotionals, trip reports, teaching on the Christian faith. Every post is theirs, under their byline, building an audience they own.
4. **A legacy archive.** Photos, videos, stories, and testimony — a permanent record of who Don and Patti Nichols are, what they believed, and how they lived. For their grandchildren and their grandchildren's children.

## 2. The Mission (Don's words — Section 1)

Medical missions to Belize: free medical clinics, pharmacy services, vision care, and personal evangelism. Teams of physicians, nurse practitioners, physician assistants, nurses, pharmacists, pharmacy technicians, and volunteers with experience across South America, the Caribbean, Africa, and Europe. An evangelism team shares Christ, prays with families, distributes Bibles, and encourages local pastors. Everything free to every patient: evaluations, medications, reading glasses, hygiene kits, Bibles, Gospel literature, prayer. Goal: glorify God by caring for people physically while introducing them to the eternal hope found only in Jesus Christ.

This mission statement is the site's backbone. It appears on the homepage and the Mission page verbatim.

## 3. Site Map

```
/                     Home — hero (upcoming Belize trip + give CTA), mission, why Belize,
                      latest posts, newsletter, secondary give CTA
/mission              Our Mission (Don's Section 1, full)
/belize               Why Belize + current trip: countdown, goal progress, what gifts buy
/trips                Past + upcoming trips archive (each trip gets its own page)
/trips/[slug]         Individual trip page — recap, photos, testimonies, totals
/give                 The giving page — one-time / monthly / designated funds,
                      Stripe + PayPal + check + 501(c)(3) info
/blog                 All posts, filterable by author and category
/blog/[slug]          Individual post
/don                  Don's profile + his posts (preaching, teaching)
/patti                Patti's profile + her posts
/our-story            The Nichols family story — who they are, faith, family, legacy
/store                Products/materials (phase 2 — structure ships now)
/contact              Contact + prayer requests + invite Don to speak
/privacy  /terms      Required for Meta + Google ads compliance
```

Mobile-first navigation: sticky header, GIVE button always visible, hamburger menu on mobile, large tap targets. Desktop: full nav bar with GIVE as the highlighted action.

## 4. Donation Architecture

Ryan's requirement: Stripe, PayPal, their 501(c)(3), "any way someone wants to give."

**The Give page offers every path:**

| Path | How it works | Status |
|------|-------------|--------|
| **Stripe** | Payment Links (create in Stripe dashboard, paste URLs into `lib/site.ts` — zero code changes). Supports one-time + monthly recurring + Apple/Google Pay. One link per designated fund. | Placeholder URLs ship now; paste real links when Stripe account ready |
| **PayPal** | PayPal donate button/link for donors who trust PayPal | Placeholder; paste real link |
| **501(c)(3) / church** | For tax-deductible gifts: instructions to give through the sponsoring organization, memo line designation | Needs org name, address, EIN language from Don |
| **Check by mail** | Mailing address + memo instructions | Needs address |

**Designated funds (donor chooses where it goes):**
- Belize Mission Trip (current trip)
- Medical & Pharmacy Supplies
- Bibles & Pastor Support
- Local Community Outreach
- Where Needed Most

**Impact framing on the Give page** (from Don's content): what a gift buys — reading glasses that let someone read, sew, study God's Word, or keep earning a living; medications; hygiene kits; study Bibles for village pastors.

**Funnel:** Every page → GIVE button → designated fund choice → one-time or monthly → payment → thank-you page (`/give/thank-you`) with share buttons and newsletter signup. Recurring giving is pushed as the highest-value ask ("Join the monthly mission team").

**Important (not legal advice):** whether gifts are tax-deductible depends on the receiving entity. If gifts run through a 501(c)(3), the site can say so and receipts come from that org. Direct personal gifts to Don & Patti are NOT tax-deductible and the site must not claim they are. Confirm the exact entity with Don before turning on donation language about deductibility.

## 5. Content System

- v1: posts and trips live as typed content files in `content/` — simple for Ryan to edit, zero database needed, deploys in seconds.
- Phase 2: move to Supabase (schema ships now in `supabase/schema.sql`) with an admin page so Don & Patti can post without touching code.
- Authors: `don` and `patti` — every post carries a byline, photo, and links back to their profile page. Followers subscribe via newsletter (email capture ships now; wire to a provider like Mailchimp/Buttondown in phase 2).

## 6. SEO Plan

**Target queries:** "Don Nichols mission trip", "Patti Nichols", "Belize medical mission trip", "medical missions Belize", "donate Belize mission", "mission trip [their town/church]", plus every church/venue name where they speak.

**Shipping in v1:**
- Per-page titles + meta descriptions, canonical URLs, OpenGraph + Twitter cards
- JSON-LD structured data: `Person` (Don, Patti), `Organization`, `Article` on posts, `DonateAction` on Give, `Event` on trips
- `sitemap.xml` + `robots.txt` auto-generated
- Semantic HTML, fast static pages (Vercel edge), mobile-first — Core Web Vitals green by default
- OG share image so links look right on Facebook/X/iMessage

**After launch (checklist for Ryan):**
1. Google Search Console: verify site, submit sitemap
2. Bing Webmaster Tools: same
3. Backlinks: every church where they speak links to the site; mission org partners; local news; church bulletins with QR code (make in Bitly)
4. Google Business Profile if there's a physical ministry presence
5. Consistent posting — Google ranks sites that publish; every trip update is an SEO asset
6. If 501(c)(3): apply for **Google Ad Grants** — up to $10,000/month in FREE Google search ads for nonprofits. This is the single biggest free traffic lever available.

## 7. Analytics & Ads Readiness

- **Vercel Analytics** ships enabled (page views, referrers, devices, countries)
- **Click tracking**: every CTA carries a `data-track` attribute + `track()` helper — when GA4/Meta Pixel are added, every give-button click, nav click, and form submit reports where, what, and from which page
- **GA4 + Meta Pixel**: placeholder slots in `lib/site.ts`; paste IDs to activate
- **Meta/Google ads compliance shipped:** privacy policy, terms, clear identity/contact info, honest donation language, no unverifiable claims. Landing pages (Give, Belize) are ad-ready.

## 8. Tech Stack

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS** — static-fast, SEO-strong
- **Vercel** hosting — deploys now to `*.vercel.app`, custom domain attaches later with zero rework
- **GitHub** — repo holds all code + content history (Ryan pushes after this session)
- **Supabase** — phase 2 database (schema ready in repo)
- **Stripe / PayPal** — payment links, no card data ever touches the site
- Minimal dependencies = nothing to break

## 9. Roadmap

**Phase 1 (this session):** Blueprint + full working site + deployed Vercel preview. Real mission content from Don, placeholders clearly marked `[NEEDED]` where facts are missing.

**Phase 2 (next):** Real Stripe/PayPal links live. Photos/videos from Google Drive & iCloud into trip galleries. Domain purchase + attach. Google Search Console. Newsletter provider. Don's remaining sections dropped in.

**Phase 3:** Supabase wired (posts, prayer requests, subscribers stored). Simple admin page so Don & Patti publish without Ryan. Store goes live (books, materials). Email/SMS updates to supporter list.

**Phase 4:** Trip fundraising thermometers tied to real Stripe totals. Video sermon archive. Google Ad Grants campaigns. Facebook/Instagram ad funnels to /belize and /give.

## 10. What I Still Need From Don & Patti

1. Remaining site sections Don is sending (trip dates, team info, fundraising goal amount, budget breakdown)
2. The 501(c)(3)/church entity name for donation language + mailing address for checks
3. Stripe + PayPal account access (or Ryan creates them) → paste payment links
4. Photos: headshots of Don & Patti, Belize trip photos, clinic/team photos (Google Drive or iCloud share)
5. Bios: Don's preaching background, Patti's story, how they met, family, faith journey (for /our-story, /don, /patti)
6. Past trips list: where, when, what happened (for /trips)
7. Any existing ministry name, logo, or verse they consider "theirs"
