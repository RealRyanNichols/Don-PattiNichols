"use client";

import { useEffect, useState } from "react";
import { supabaseConfig, supabaseInsert } from "@/lib/supabase";

/**
 * COMMENTS — readers can leave a word; Don and Patti decide what appears.
 *
 * Nothing posts straight to the site. Every comment lands unapproved and waits
 * in their dashboard, so the page under their name can never be hijacked. Email
 * is collected so they can write back, and is never rendered publicly.
 */

type Comment = { id: string; author_name: string; body: string; created_at: string };

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const url = `${supabaseConfig.url}/rest/v1/post_comments?post_id=eq.${postId}&approved=eq.true&select=id,author_name,body,created_at&order=created_at.asc`;
    fetch(url, {
      headers: {
        apikey: supabaseConfig.key,
        Authorization: `Bearer ${supabaseConfig.key}`,
      },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setComments(Array.isArray(d) ? d : []))
      .catch(() => setComments([]));
  }, [postId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setState("sending");
    const ok = await supabaseInsert("post_comments", {
      post_id: postId,
      author_name: name.trim(),
      author_email: email.trim() || null,
      body: body.trim(),
      approved: false,
    });
    setState(ok ? "sent" : "error");
    if (ok) {
      setName("");
      setEmail("");
      setBody("");
    }
  }

  return (
    <section className="mt-12 border-t border-ink/10 pt-10">
      <h2 className="h-display text-2xl">
        {comments.length > 0 ? "What people said" : "Leave a word"}
      </h2>

      {comments.length > 0 && (
        <ul className="mt-6 space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="rounded-2xl bg-sand-dark p-5">
              <p className="font-serif font-bold text-ink">{c.author_name}</p>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-ink/80">
                {c.body}
              </p>
              <p className="mt-2 text-xs text-ink/45">
                {new Date(c.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}

      {state === "sent" ? (
        <div className="mt-6 rounded-2xl bg-sea/10 p-6">
          <p className="font-serif text-lg text-sea-dark">
            Thank you — Don and Patti will see it.
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Comments appear once they&rsquo;ve had a chance to read them.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-ink" htmlFor="c-name">
                Your name
              </label>
              <input
                id="c-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/25"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink" htmlFor="c-email">
                Email <span className="font-normal text-ink/50">(optional)</span>
              </label>
              <input
                id="c-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/25"
              />
              <p className="mt-1 text-xs text-ink/50">
                Only so they can write back. Never shown on the site.
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-ink" htmlFor="c-body">
              Your message
            </label>
            <textarea
              id="c-body"
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 leading-relaxed focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/25"
            />
          </div>
          {state === "error" && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              That didn&rsquo;t send. Please try once more.
            </p>
          )}
          <button
            type="submit"
            disabled={state === "sending"}
            className="btn-primary"
          >
            {state === "sending" ? "Sending…" : "Send it"}
          </button>
        </form>
      )}
    </section>
  );
}
