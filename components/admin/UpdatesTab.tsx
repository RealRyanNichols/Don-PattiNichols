"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { slugify } from "@/lib/format";

type DbPost = {
  id: string;
  slug: string;
  title: string;
  author: "don" | "patti" | "both";
  category: string;
  excerpt: string | null;
  body: string;
  published: boolean;
  published_at: string | null;
};

const authors = [
  { id: "don", label: "Don" },
  { id: "patti", label: "Patti" },
  { id: "both", label: "Both of us" },
] as const;

const categories = ["Mission Updates", "Belize", "Family & Faith"];

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
      <p className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sea font-serif font-bold text-white">
          {n}
        </span>
        <span className="text-lg font-semibold">{title}</span>
      </p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Editor({
  existing,
  onDone,
}: {
  existing: DbPost | null;
  onDone: (saved: boolean) => void;
}) {
  const [author, setAuthor] = useState<(typeof authors)[number]["id"]>(
    existing?.author ?? "don",
  );
  const [category, setCategory] = useState(existing?.category ?? "Mission Updates");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  async function save(publish: boolean) {
    if (!title.trim()) {
      setError("Give your update a title first (Step 3).");
      return;
    }
    if (paragraphs.length === 0) {
      setError("Type your update first (Step 4).");
      return;
    }
    setBusy(true);
    setError("");

    const row = {
      title: title.trim(),
      author,
      category,
      excerpt: paragraphs[0].slice(0, 280),
      body: paragraphs.join("\n\n"),
      published: publish,
      published_at: publish ? new Date().toISOString() : null,
    };

    let saveError = null;
    if (existing) {
      const { error } = await supabase.from("posts").update(row).eq("id", existing.id);
      saveError = error;
    } else {
      let slug = slugify(title) || `update-${Date.now()}`;
      for (let attempt = 0; attempt < 3; attempt++) {
        const { error } = await supabase.from("posts").insert({ ...row, slug });
        if (!error) {
          saveError = null;
          break;
        }
        if (error.code === "23505") {
          slug = `${slugify(title)}-${attempt + 2}`;
          saveError = error;
          continue;
        }
        saveError = error;
        break;
      }
    }

    setBusy(false);
    if (saveError) {
      setError("Something went wrong saving your update. Try again, or ask Ryan.");
      return;
    }
    onDone(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="h-display text-2xl">
          {existing ? "Edit your update" : "Write a new update"}
        </h2>
        <button onClick={() => onDone(false)} className="text-sm font-semibold text-sea hover:underline">
          ← Back to the list
        </button>
      </div>

      <Step n={1} title="Who is writing this?">
        <div className="flex flex-wrap gap-2">
          {authors.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAuthor(a.id)}
              className={`rounded-full px-5 py-3 text-base font-semibold transition-colors ${
                author === a.id
                  ? "bg-sea text-white"
                  : "bg-white text-ink/70 ring-1 ring-ink/15 hover:ring-sea"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </Step>

      <Step n={2} title="What is it about?">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-5 py-3 text-base font-semibold transition-colors ${
                category === c
                  ? "bg-sea text-white"
                  : "bg-white text-ink/70 ring-1 ring-ink/15 hover:ring-sea"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Step>

      <Step n={3} title="Give it a title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="For example: What God Did in the Villages This Week"
          aria-label="Update title"
          className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3.5 text-lg focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30"
        />
      </Step>

      <Step n={4} title="Type your update">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          aria-label="Update text"
          placeholder="Write just like you'd tell it to a friend. Press Enter twice to start a new paragraph."
          className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3.5 text-lg leading-relaxed focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30"
        />
        <p className="mt-2 text-sm text-ink/55">
          Tip: press Enter twice to start a new paragraph.
        </p>
      </Step>

      {paragraphs.length > 0 && title.trim() ? (
        <Step n={5} title="Here's how it will look">
          <div className="rounded-xl bg-sand p-6">
            <p className="eyebrow">{category}</p>
            <h3 className="mt-2 font-serif text-2xl font-bold">{title}</h3>
            <p className="mt-1 text-sm text-ink/60">
              By {authors.find((a) => a.id === author)?.label}
            </p>
            <div className="prose-mission mt-4">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
        </Step>
      ) : null}

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => save(true)}
          disabled={busy}
          className="btn-give !py-4 !text-base disabled:opacity-60"
        >
          {busy ? "Publishing…" : "Publish to the Website"}
        </button>
        <button
          onClick={() => save(false)}
          disabled={busy}
          className="btn-outline !py-4 !text-base disabled:opacity-60"
        >
          Save for Later (don't publish yet)
        </button>
      </div>
      <p className="text-sm text-ink/55">
        Published updates appear on the website's Timeline within a few minutes.
      </p>
    </div>
  );
}

export default function UpdatesTab() {
  const [posts, setPosts] = useState<DbPost[] | null>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"list" | "editor">("list");
  const [editing, setEditing] = useState<DbPost | null>(null);
  const [savedNote, setSavedNote] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("posts")
      .select("id, slug, title, author, category, excerpt, body, published, published_at")
      .order("created_at", { ascending: false });
    if (error) setError("Couldn't load your updates. Try refreshing the page.");
    else setPosts(data as DbPost[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublished(post: DbPost) {
    const publish = !post.published;
    const { error } = await supabase
      .from("posts")
      .update({
        published: publish,
        published_at: publish ? post.published_at ?? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    if (!error) load();
  }

  async function remove(post: DbPost) {
    const sure = window.confirm(
      `Delete "${post.title}" for good? This can't be undone.`,
    );
    if (!sure) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (!error) load();
  }

  if (mode === "editor") {
    return (
      <Editor
        existing={editing}
        onDone={(saved) => {
          setMode("list");
          setEditing(null);
          setSavedNote(saved);
          if (saved) load();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="h-display text-2xl">Your Updates</h2>
          <p className="mt-2 text-lg text-ink/70">
            These are the posts on the website's Timeline. Write a new one any time — it takes
            five easy steps.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setMode("editor");
            setSavedNote(false);
          }}
          className="btn-give !py-4 !text-base"
        >
          ✎ Write a New Update
        </button>
      </div>

      {savedNote ? (
        <p className="mt-5 rounded-lg bg-sea/10 px-4 py-3 text-lg font-medium text-sea">
          Saved. Published updates appear on the website within a few minutes.
        </p>
      ) : null}
      {error ? <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}
      {posts === null && !error ? <p className="mt-8 text-lg text-ink/60">Loading…</p> : null}
      {posts !== null && posts.length === 0 ? (
        <p className="mt-8 rounded-xl bg-sand-dark p-6 text-lg text-ink/70">
          You haven't written any updates from this dashboard yet. The first four posts on the
          website were set up with it — new ones you write here will join them on the Timeline.
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {(posts ?? []).map((post) => (
          <div
            key={post.id}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-ink/10 bg-white p-5 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold">{post.title}</p>
              <p className="text-sm text-ink/60">
                {post.category} · by {authors.find((a) => a.id === post.author)?.label}
                {post.published && post.published_at
                  ? ` · published ${new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  : ""}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                post.published ? "bg-sea/10 text-sea" : "bg-sand-dark text-ink/60"
              }`}
            >
              {post.published ? "On the website" : "Not published"}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(post);
                  setMode("editor");
                  setSavedNote(false);
                }}
                className="text-sm font-semibold text-sea hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => togglePublished(post)}
                className="text-sm font-semibold text-sea hover:underline"
              >
                {post.published ? "Hide" : "Publish"}
              </button>
              <button
                onClick={() => remove(post)}
                className="text-sm font-semibold text-red-700 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
