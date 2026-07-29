# CLAUDE CODE PROMPT — Admin Portal for donandpatti.com

Copy everything below this line into Claude Code, run from the project folder.

---

You are building out the admin portal for **donandpatti.com** — the live mission website of Don & Patti Nichols (both in their 60s, phone-first users). Read `PROJECT-BRAIN.md` in this folder FIRST; it is the master record of the whole system. Where anything disagrees with it, the brain wins. Then read this brief fully before writing code.

## THE ONE URGENT BUG — fix before anything else (TASK 0)

**Sign-in emails are not arriving.** Don (dnichols3270@yahoo.com) and Patti (nichols3270@yahoo.com) entered their emails at /admin and no magic link or 6-digit code came.

Root cause (verified in the Supabase dashboard): the project uses **Supabase's built-in email service**, which is rate-limited (~2-4 emails/hour) and not for production. Yahoo also filters unauthenticated senders hard. The auth flow itself is correct — Site URL and redirect allow-list were already fixed, the branded template with `{{ .Token }}` (6-digit code) is saved.

Fix:
1. Ryan is ALREADY LOGGED IN to Resend — do not create an account. His Resend account serves his other projects too, so keep this site's resources clearly separated: in the existing account, add the domain `donandpatti.com` (Resend → Domains → Add Domain) and create a DEDICATED API key named `donandpatti-site` scoped to sending only — never reuse a key from his other projects. Verify the domain by adding Resend's DKIM/SPF DNS records at GoDaddy (walk him through them or do it via browser if you have access).
2. In Supabase (project ref `rxjsykcbedtyxfvyfyhl`) → Auth → Emails → **SMTP Settings**: enable custom SMTP with Resend's credentials (`smtp.resend.com`, port 465, username `resend`, password = Resend API key). Sender: `Don & Patti's Website <signin@donandpatti.com>`.
3. Test END-TO-END: trigger a magic link to a test address you can read, confirm delivery < 1 minute, confirm the gold button opens donandpatti.com/admin signed in, and confirm the 6-digit code path (`verifyOtp type:'email'`) works.
4. Keep the existing email template (warm, branded, big gold button + `{{ .Token }}` code). Do not revert it.
5. While in Resend: also wire **activity notifications** (see Notifications below) since the same account powers them.

Both of their emails are ALREADY on the `site_authors` allow-list (don/patti handles). Nothing else blocks them.

## What already exists (do not rebuild, do not regress)

`/admin` is a working phone-first portal (all in `components/admin/`):
- **Auth:** Supabase magic link + 6-digit OTP fallback; allow-list table `site_authors` (roles: `admin` = Ryan/theflashflash24@gmail.com, `author` = Don, Patti). RLS everywhere; publishable key is intentionally public.
- **Home dashboard:** greets by first name; cards for Messages / Comments / Followers / Given; reply-by-email; mark-done; comment moderation (approve/hide/delete); post publish/hide; admin-only "Someone's at the door" queue that approves `access_requests` into `site_authors` (the ONLY path to posting rights — never add self-service registration).
- **Write tab:** byline picker (Don/Patti), title, story, camera-roll uploads to storage bucket `mission-photos`, tap-tags, album assignment, optional Give/Buy link, draft/publish. Published posts appear on the public /blog within 60s (ISR bridge in `lib/postsDb.ts`).
- **Photos tab:** create album / add photos to album (`site_albums`, `album_photos`).
- **Thanks tab:** posts thank-you notes to public /thank-you (first names only — hard rule).
- **Money tab:** transparency ledger (`ledger_entries`, gift/spent, category, note) feeding the public /transparency "Open Book" page live.
- **/welcome** onboarding tour with access-request flow.

## THE BUILD — a real portal, generalized for future roles

Keep the current simplicity for Don and Patti (big type, plain words, thumb targets, nothing nested). Generalize underneath so it scales. Structure:

### 1. Role system (extend, don't replace)
`site_authors.role` currently: `admin`, `author`. Extend to support future `member` (donors/followers with accounts) WITHOUT building member features yet — just make the gates explicit:
- Create a single `lib/roles.ts` with capability checks (`canPost`, `canModerate`, `canApproveAuthors`, `canEditLedger`, `canManageAuthors`) driven by role, used everywhere instead of scattered `role === "admin"` checks.
- Admin-only "Team" screen: list authors, change display name/handle, deactivate (add `active boolean default true` to `site_authors`; is_site_author() must check it), promote/demote roles. Migrations via Supabase MCP `apply_migration`. Only admins mutate `site_authors` (policy already exists for insert; add update policy for admins only).

### 2. Post editing (the biggest missing capability)
Authors can currently create but not edit. Add: tap a post in "Your posts" → edit title/body/photos/tags/album/link → save (updates `updated_at`), unpublish, or delete (confirm dialog, big buttons). Authors edit only their own posts unless admin (enforce in RLS: update policy `author_handle = my handle OR is_site_admin()`; you'll need a helper to map auth email → handle).

### 3. Thank-you and ledger editing
Same pattern: list existing thank-you notes and ledger entries with edit/delete. Ledger deletions by admin only (authors can add and edit their own same-day entries; admins can fix anything). The public /transparency page must always reflect reality.

### 4. Notifications (after TASK 0's Resend setup)
- Supabase Database Webhooks (or pg_net triggers) → a Next.js route handler (`app/api/notify/route.ts`, service-role key in Vercel env vars ONLY — never in the repo) → Resend email to all active authors on: new `messages` row (subject "Someone wrote to you: {topic}"), new unapproved `post_comments` ("New comment waiting for approval"), new `access_requests` (admins only).
- Daily digest is optional phase 2; per-event email is the requirement.
- Emails must be plain, warm, large-type, and deep-link to donandpatti.com/admin.

### 5. Stats screen ("How's the site doing?")
A read-only tab pulling ONLY real numbers: page-view totals (`view_stats` RPC), live visitors (presence channel `presence:site-visitors`), subscriber count, ledger totals, top 5 most-viewed pages (add a `top_pages(n)` security-definer RPC over `page_views`). No fake numbers, no seeded data — that is a site-wide covenant.

### 6. Members scaffolding (future-proofing only)
- Add `role='member'` handling: members who sign in see a friendly "Members area coming soon" screen, NOT the author tools.
- Leave a `members/` component directory with a README describing the intended v2: giving history (once PayPal webhooks land), saved posts, prayer-request tracking.
- Do NOT build member registration UI yet.

## Guardrails (non-negotiable — from PROJECT-BRAIN.md)
- Don's published words are verbatim; never invent trip facts, captions, or numbers. `[NEEDED]` markers stay until he writes.
- Donor privacy: first names only, never amounts/addresses/emails on public pages.
- No fake metrics anywhere. Counters hide rather than lie.
- The design language: deep #0a3d40, sea #0e6b70, sand #faf6ef, gold #c9962e, Lora + Inter (self-hosted next/font — never add a Google Fonts <link>). Admin UI: text-lg minimum, py-4 buttons, plain words ("Show it on the site", not "Approve").
- Never deploy an inline file tree from chat-based tools; use git. FIRST session task after TASK 0: `git init`, commit, push to the existing empty repo `RealRyanNichols/Don-PattiNichols`, connect it to Vercel project `don-patti-nichols` (team `team_2a0TrkWvu7Mv1IIMToSYyhER`) so pushes auto-deploy and the archive-deploy dance in PROJECT-BRAIN.md is retired.
- `npx tsc --noEmit` must pass before every deploy. Verify live URLs after.

## Definition of done
1. Don and Patti sign in with EMAIL + PASSWORD — no email link required (Ryan's explicit decision: "I don't want them to receive a sign in link"). Password sign-in (`signInWithPassword`) is the PRIMARY flow; the magic link/6-digit code stays only as the "Forgot password?" fallback. Verify both can sign in on their phones with their passwords, twice in a row. The Resend/SMTP work still matters — for the fallback and for activity notifications — but it no longer gates login.
2. Each can edit and delete their own post from a phone. THE ADMIN IS AN APP TO THEM: Ryan installs donandpatti.com/admin on their phones via Add-to-Home-Screen, so it must feel native — add a proper web app manifest (name "Don & Patti", standalone display, theme #0a3d40, the gold-cross icon set at 192/512px) so it launches full-screen with no browser chrome; sessions must persist indefinitely (they stay logged in; never force re-auth on app open); every admin screen must be flawless at phone widths FIRST and remain clean on desktop Mac/Windows and Android/iOS alike — consistent aspect ratios, no horizontal scroll, safe-area insets respected, and smooth transitions between tabs (simple fade/slide, no jank).
3. A new `messages` row lands in their Yahoo inboxes as a notification email.
4. Ryan can add/deactivate an author from the Team screen without SQL.
5. Repo on GitHub, auto-deploying, all 60+ routes green.
