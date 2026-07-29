"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * THE DASHBOARD — the first thing Don and Patti see after they sign in.
 *
 * Written for two people in their sixties reading a phone screen. Big numbers,
 * plain words, no jargon, no dashboards-within-dashboards. Four cards at the
 * top answer "what happened while I was away", and everything below is either
 * something to read or something to tap.
 */

type Message = {
  id: string;
  topic: string;
  name: string;
  email: string;
  message: string;
  handled: boolean;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string | null;
  author_name: string;
  body: string;
  approved: boolean;
  created_at: string;
};

type Subscriber = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
};

type Donation = {
  id: string;
  amount_usd: number | null;
  fund: string | null;
  donor_name: string | null;
  recurring: boolean | null;
  created_at: string;
};

type AccessRequest = {
  id: string;
  name: string;
  email: string;
  claims_to_be: string;
  approved: boolean;
  created_at: string;
};

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  author_handle: string;
  created_at: string;
};

function when(iso: string) {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function Dashboard({
  onGoto,
}: {
  onGoto: (tab: "post" | "album" | "thanks") => void;
}) {
  const [displayName, setDisplayName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [gifts, setGifts] = useState<Donation[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"inbox" | "comments" | "people" | "giving" | "posts">(
    "inbox",
  );

  const load = useCallback(async () => {
    const sb = supabase();
    const [m, c, s, d, p] = await Promise.all([
      sb.from("messages").select("*").order("created_at", { ascending: false }).limit(50),
      sb
        .from("post_comments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      sb.from("subscribers").select("*").order("created_at", { ascending: false }).limit(50),
      sb.from("donations").select("*").order("created_at", { ascending: false }).limit(50),
      sb
        .from("site_posts")
        .select("id,title,slug,published,author_handle,created_at")
        .order("created_at", { ascending: false })
        .limit(30),
    ]);
    setMessages((m.data as Message[]) ?? []);
    setComments((c.data as Comment[]) ?? []);
    setSubs((s.data as Subscriber[]) ?? []);
    setGifts((d.data as Donation[]) ?? []);
    setPosts((p.data as Post[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    /*
     * Greet whoever signed in, and work out whether THEY are an admin.
     *
     * This used to select the whole allow-list and read row [0], which is
     * always Ryan — so Don signed in and the page called him Ryan, and worse,
     * it handed him `role === "admin"`, which reveals the access-request
     * approval queue. Filter by the signed-in email. RLS lets an author read
     * the roster, so the row must be picked here, not assumed.
     */
    void (async () => {
      const sb = supabase();
      const {
        data: { user },
      } = await sb.auth.getUser();
      const email = user?.email;
      if (!email) return;

      const { data } = await sb
        .from("site_authors")
        .select("display_name,role")
        .eq("email", email.toLowerCase())
        .limit(1);

      const me = data?.[0] as { display_name?: string; role?: string } | undefined;
      const name = me?.display_name?.split(" ")[0];
      if (name) setDisplayName(name);
      setIsAdmin(me?.role === "admin");
    })();
    supabase()
      .from("access_requests")
      .select("*")
      .eq("approved", false)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRequests((data as AccessRequest[]) ?? []));
  }, [load]);

  const hour = new Date().getHours();
  const daypart = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const unread = messages.filter((m) => !m.handled).length;
  const pending = comments.filter((c) => !c.approved).length;
  const givenTotal = gifts.reduce((sum, g) => sum + Number(g.amount_usd ?? 0), 0);

  async function markHandled(id: string, handled: boolean) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, handled } : m)));
    await supabase().from("messages").update({ handled }).eq("id", id);
  }

  async function setApproved(id: string, approved: boolean) {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, approved } : c)));
    await supabase().from("post_comments").update({ approved }).eq("id", id);
  }

  async function deleteComment(id: string) {
    setComments((prev) => prev.filter((c) => c.id !== id));
    await supabase().from("post_comments").delete().eq("id", id);
  }

  /**
   * Ryan-only: turn a knock at the door into a real author. The handle decides
   * the public byline (don/patti). Approval inserts into the allow-list —
   * the ONLY way anyone gains posting rights.
   */
  async function approveRequest(req: AccessRequest, handle: string) {
    const sb = supabase();
    const { error } = await sb.from("site_authors").insert({
      email: req.email,
      display_name: req.name,
      handle,
      role: "author",
    });
    if (error) {
      alert(`Couldn't approve: ${error.message}`);
      return;
    }
    await sb.from("access_requests").update({ approved: true }).eq("id", req.id);
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  }

  async function dismissRequest(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    await supabase().from("access_requests").delete().eq("id", id);
  }

  async function togglePublished(id: string, published: boolean) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, published } : p)));
    await supabase()
      .from("site_posts")
      .update({
        published,
        published_at: published ? new Date().toISOString() : null,
      })
      .eq("id", id);
  }

  if (loading) {
    return (
      <p className="py-16 text-center text-lg text-ink/50">Getting your things…</p>
    );
  }

  const cards = [
    {
      key: "inbox" as const,
      label: "Messages",
      value: messages.length,
      badge: unread ? `${unread} new` : null,
    },
    {
      key: "comments" as const,
      label: "Comments",
      value: comments.length,
      badge: pending ? `${pending} to approve` : null,
    },
    { key: "people" as const, label: "Followers", value: subs.length, badge: null },
    {
      key: "giving" as const,
      label: "Given",
      value: gifts.length ? money(givenTotal) : "—",
      badge: null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Access requests — Ryan is the lock on the door */}
      {isAdmin && requests.length > 0 && (
        <section className="rounded-2xl border-2 border-gold bg-gold/10 p-5">
          <h2 className="font-serif text-xl font-bold text-ink">
            Someone&rsquo;s at the door
          </h2>
          <p className="mt-1 text-base text-ink/70">
            Approve only people you know. Approval is what grants posting access.
          </p>
          <div className="mt-4 space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="rounded-xl bg-white p-4 ring-1 ring-ink/10">
                <p className="font-bold text-ink">{r.name}</p>
                <p className="text-sm text-ink/60">
                  {r.email} · says they&rsquo;re{" "}
                  {r.claims_to_be === "other" ? "a team member" : r.claims_to_be} ·{" "}
                  {when(r.created_at)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => approveRequest(r, "don")}
                    className="rounded-lg bg-sea px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Approve as Don
                  </button>
                  <button
                    type="button"
                    onClick={() => approveRequest(r, "patti")}
                    className="rounded-lg bg-sea px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Approve as Patti
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      approveRequest(r, r.email.split("@")[0].replace(/[^a-z0-9]/gi, "").slice(0, 20) || "team")
                    }
                    className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-ink ring-1 ring-ink/20"
                  >
                    Approve as team
                  </button>
                  <button
                    type="button"
                    onClick={() => dismissRequest(r.id)}
                    className="rounded-lg px-4 py-2.5 text-sm font-bold text-red-700 ring-1 ring-red-200"
                  >
                    Not them — dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* What to do right now */}
      <section>
        <h2 className="font-serif text-3xl font-bold text-ink">
          {daypart}{displayName ? `, ${displayName}` : ""}.
        </h2>
        <p className="mt-1 text-lg text-ink/60">What would you like to do?</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onGoto("post")}
            className="rounded-2xl bg-sea px-5 py-6 text-left text-white transition hover:bg-sea-dark"
          >
            <p className="text-xl font-bold">Write a post</p>
            <p className="mt-1 text-sm text-white/75">
              A story, with photos
            </p>
          </button>
          <button
            type="button"
            onClick={() => onGoto("thanks")}
            className="rounded-2xl bg-gold px-5 py-6 text-left text-ink transition hover:bg-gold-dark hover:text-white"
          >
            <p className="text-xl font-bold">Thank someone</p>
            <p className="mt-1 text-sm opacity-75">Goes on the Thank You page</p>
          </button>
          <button
            type="button"
            onClick={() => onGoto("album")}
            className="rounded-2xl bg-white px-5 py-6 text-left text-ink ring-1 ring-ink/15 transition hover:bg-sand-dark"
          >
            <p className="text-xl font-bold">Add photos</p>
            <p className="mt-1 text-sm text-ink/60">To a new or existing album</p>
          </button>
        </div>
      </section>

      {/* Numbers */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cards.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setView(c.key)}
              className={`rounded-2xl p-4 text-left transition ${
                view === c.key
                  ? "bg-deep text-white"
                  : "bg-white text-ink ring-1 ring-ink/10 hover:ring-sea/40"
              }`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-widest ${
                  view === c.key ? "text-gold" : "text-sea"
                }`}
              >
                {c.label}
              </p>
              <p className="mt-1 font-serif text-3xl font-bold">{c.value}</p>
              {c.badge && (
                <p
                  className={`mt-1 text-xs font-bold ${
                    view === c.key ? "text-gold" : "text-gold-dark"
                  }`}
                >
                  {c.badge}
                </p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Detail */}
      <section>
        {view === "inbox" && (
          <List
            title="Messages people sent you"
            empty="No one has written yet. When somebody uses the contact form on your site, their message shows up here."
            items={messages}
            render={(m) => (
              <div key={m.id} className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-serif text-lg font-bold text-ink">{m.name}</p>
                  <p className="text-sm text-ink/50">{when(m.created_at)}</p>
                </div>
                <p className="mt-0.5 text-sm font-semibold uppercase tracking-wider text-sea">
                  {m.topic}
                </p>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink/85">
                  {m.message}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${m.email}?subject=Re: your message to Don & Patti`}
                    className="rounded-lg bg-sea px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Reply by email
                  </a>
                  <button
                    type="button"
                    onClick={() => markHandled(m.id, !m.handled)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold ${
                      m.handled
                        ? "bg-sand-dark text-ink/60"
                        : "bg-white text-ink ring-1 ring-ink/20"
                    }`}
                  >
                    {m.handled ? "Done ✓" : "Mark done"}
                  </button>
                </div>
              </div>
            )}
          />
        )}

        {view === "comments" && (
          <List
            title="Comments on your posts"
            empty="No comments yet. When someone comments on a post, it waits here for you to approve before anyone else can see it."
            items={comments}
            render={(c) => (
              <div key={c.id} className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-serif text-lg font-bold text-ink">
                    {c.author_name}
                  </p>
                  <p className="text-sm text-ink/50">{when(c.created_at)}</p>
                </div>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink/85">
                  {c.body}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!c.approved ? (
                    <button
                      type="button"
                      onClick={() => setApproved(c.id, true)}
                      className="rounded-lg bg-sea px-4 py-2.5 text-sm font-bold text-white"
                    >
                      Show it on the site
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setApproved(c.id, false)}
                      className="rounded-lg bg-sand-dark px-4 py-2.5 text-sm font-bold text-ink/70"
                    >
                      Hide it again
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteComment(c.id)}
                    className="rounded-lg px-4 py-2.5 text-sm font-bold text-red-700 ring-1 ring-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          />
        )}

        {view === "people" && (
          <List
            title="People following the mission"
            empty="Nobody has signed up yet. When someone follows on your site, their name shows up here."
            items={subs}
            render={(s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-ink/10"
              >
                <div>
                  <p className="font-semibold text-ink">{s.name || s.email}</p>
                  <p className="text-sm text-ink/55">
                    {s.email}
                    {s.phone ? ` · ${s.phone}` : ""}
                  </p>
                </div>
                <p className="text-sm text-ink/45">{when(s.created_at)}</p>
              </div>
            )}
          />
        )}

        {view === "giving" && (
          <>
            {gifts.length > 0 && (
              <div className="mb-4 rounded-2xl bg-deep p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Given through the site
                </p>
                <p className="h-display mt-1 text-4xl !text-white">
                  {money(givenTotal)}
                </p>
              </div>
            )}
            <List
              title="Gifts"
              empty="No gifts recorded here yet. Money given through PayPal goes straight to your bank account — this list fills in once we connect PayPal to the website so it can report each gift automatically. Until then, check your PayPal app for the real total."
              items={gifts}
              render={(g) => (
                <div
                  key={g.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-ink/10"
                >
                  <div>
                    <p className="font-semibold text-ink">
                      {g.donor_name || "A friend of the mission"}
                    </p>
                    <p className="text-sm text-ink/55">
                      {g.fund || "Where needed most"}
                      {g.recurring ? " · monthly" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl font-bold text-sea">
                      {money(Number(g.amount_usd ?? 0))}
                    </p>
                    <p className="text-sm text-ink/45">{when(g.created_at)}</p>
                  </div>
                </div>
              )}
            />
          </>
        )}

        {view === "posts" && (
          <List
            title="Your posts"
            empty="You haven't written a post from here yet. Tap 'Write a post' up top to start."
            items={posts}
            render={(p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-ink/10"
              >
                <div>
                  <p className="font-serif font-bold text-ink">{p.title}</p>
                  <p className="text-sm text-ink/55">
                    {p.author_handle === "patti" ? "Patti" : "Don"} ·{" "}
                    {when(p.created_at)} ·{" "}
                    {p.published ? "Live on the site" : "Draft — not showing"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePublished(p.id, !p.published)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-bold ${
                    p.published
                      ? "bg-sand-dark text-ink/70"
                      : "bg-sea text-white"
                  }`}
                >
                  {p.published ? "Hide" : "Publish"}
                </button>
              </div>
            )}
          />
        )}
      </section>

      {/* One-time tip: make this a one-tap app on their phone */}
      <section className="rounded-2xl border-2 border-gold/40 bg-gold/10 p-5">
        <p className="font-serif text-lg font-bold text-ink">
          Make this a button on your phone
        </p>
        <p className="mt-2 leading-relaxed text-ink/75">
          In Safari, tap the share button (the square with the arrow), scroll
          down, and tap <strong>&ldquo;Add to Home Screen.&rdquo;</strong> A
          gold cross icon will appear on your phone like an app — one tap and
          you&rsquo;re right back here, already signed in.
        </p>
      </section>

      {/* Always available */}
      <section className="rounded-2xl bg-sand-dark p-5">
        <p className="font-serif text-lg font-bold text-ink">Your website</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ["See the site", "/"],
            ["Your timeline", "/blog"],
            ["Photo albums", "/albums"],
            ["Thank You page", "/thank-you"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-sea ring-1 ring-sea/20"
            >
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function List<T>({
  title,
  empty,
  items,
  render,
}: {
  title: string;
  empty: string;
  items: T[];
  render: (item: T) => React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-serif text-xl font-bold text-ink">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 rounded-2xl border-2 border-dashed border-ink/15 bg-white/60 p-6 leading-relaxed text-ink/60">
          {empty}
        </p>
      ) : (
        <div className="mt-4 space-y-3">{items.map(render)}</div>
      )}
    </div>
  );
}
