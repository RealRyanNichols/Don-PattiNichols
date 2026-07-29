-- ============================================================
-- Don & Patti Nichols — Mission Platform
-- Supabase schema for PHASE 2 (apply when wiring the database)
-- ============================================================

-- POSTS: replaces content/posts.ts so Don & Patti can publish from an admin page
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  author text not null check (author in ('don', 'patti', 'both')),
  category text not null,
  excerpt text not null,
  body text not null,               -- markdown
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- TRIPS: replaces content/trips.ts; raised_usd can be updated from Stripe webhooks
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  location text not null,
  date_label text not null,
  start_date date,
  end_date date,
  status text not null check (status in ('upcoming', 'completed')),
  summary text not null,
  body text,                        -- markdown
  goal_usd numeric(10,2),
  raised_usd numeric(10,2) default 0,
  created_at timestamptz not null default now()
);

-- TRIP PHOTOS: gallery images per trip (files in Supabase Storage bucket 'trip-photos')
create table if not exists trip_photos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  storage_path text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- DONATIONS: recorded from Stripe webhooks (metadata carries fund + trip)
create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  amount_usd numeric(10,2) not null,
  currency text not null default 'usd',
  fund text,                        -- e.g. 'belize-trip', 'medical-supplies'
  trip_id uuid references trips(id),
  recurring boolean not null default false,
  donor_name text,
  donor_email text,
  created_at timestamptz not null default now()
);

-- SUBSCRIBERS: newsletter signups
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,                      -- 'homepage', 'thank_you', 'store', ...
  created_at timestamptz not null default now()
);

-- MESSAGES: contact form, prayer requests, speaking invitations
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  topic text not null check (topic in ('prayer', 'speaking', 'giving', 'general')),
  name text not null,
  email text not null,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- PRODUCTS: the store (phase 3)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_usd numeric(10,2) not null,
  image_path text,
  stripe_payment_link text,
  active boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Row Level Security: public may READ published content only.
-- Writes happen through server-side service role (API routes).
-- ------------------------------------------------------------
alter table posts enable row level security;
alter table trips enable row level security;
alter table trip_photos enable row level security;
alter table donations enable row level security;
alter table subscribers enable row level security;
alter table messages enable row level security;
alter table products enable row level security;

create policy "public read published posts" on posts
  for select using (published = true);

create policy "public read trips" on trips
  for select using (true);

create policy "public read trip photos" on trip_photos
  for select using (true);

create policy "public read active products" on products
  for select using (active = true);

-- donations, subscribers, messages: NO public policies — service role only.

-- Helpful indexes
create index if not exists idx_posts_published on posts (published, published_at desc);
create index if not exists idx_donations_fund on donations (fund);
create index if not exists idx_messages_handled on messages (handled, created_at desc);
