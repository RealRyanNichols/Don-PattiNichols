-- Seed the two Belize trips into the trips table. Idempotent: ON CONFLICT on
-- the unique slug does nothing, so re-running never clobbers admin edits.
-- Unknown real-world facts are left as TODO placeholders (dates, goal) — never
-- invented. The self-hosted photo gallery still comes from the TS seed by slug.
-- Applied to the hosted project via migration `seed_belize_trips`.

insert into public.trips (slug, title, location, date_label, start_date, status, summary, body, goal_usd, raised_usd)
values
  (
    'belize-upcoming',
    'Belize Medical Mission Trip',
    'Belize',
    'Dates announced soon',            -- TODO: real trip dates from Don
    null,                              -- TODO: start_date (activates countdown)
    'upcoming',
    'Free medical clinics, pharmacy services, vision care, and personal evangelism in rural Belizean villages — every service and every item completely free to every patient.',
    E'Our team is preparing to return to Belize to serve rural villages with free medical clinics, pharmacy services, vision care, and personal evangelism.\n\nEvery patient who visits our clinic receives compassionate medical care, medications when appropriate, reading glasses, hygiene supplies, and the opportunity to receive a Bible and hear the hope found in Jesus Christ — all completely free of charge.\n\nWe also come alongside village pastors: encouraging them, praying with them, and providing quality study Bibles and practical gifts to strengthen the local church.',
    null,                              -- TODO: fundraising goal_usd from Don
    0
  ),
  (
    'belize-2026',
    'Belize Medical Mission',
    'Belize',
    'June 2026',
    null,
    'completed',
    'Our team served rural Belizean communities with free medical care, medications, reading glasses, hygiene kits, and the Gospel of Jesus Christ.',
    'Scenes from the field are below. The full recap, patient numbers, and testimonies from this trip are coming soon.',  -- TODO: full recap + numbers from Don
    null,
    0
  )
on conflict (slug) do nothing;
