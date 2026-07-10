"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Message = {
  id: string;
  topic: "prayer" | "speaking" | "giving" | "general";
  name: string;
  email: string;
  message: string;
  handled: boolean;
  created_at: string;
};

const topicLabels: Record<Message["topic"], string> = {
  prayer: "Prayer Request",
  speaking: "Speaking Invitation",
  giving: "Question About Giving",
  general: "General Message",
};

const filters = [
  { id: "new", label: "New" },
  { id: "all", label: "All" },
  { id: "prayer", label: "Prayer" },
  { id: "speaking", label: "Speaking" },
  { id: "handled", label: "Handled" },
] as const;

function formatWhen(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function MessagesTab() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("new");
  const [error, setError] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("messages")
      .select("id, topic, name, email, message, handled, created_at")
      .order("created_at", { ascending: false });
    if (error) setError("Couldn't load messages. Try refreshing the page.");
    else setMessages(data as Message[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function setHandled(id: string, handled: boolean) {
    setMessages((all) => (all ?? []).map((m) => (m.id === id ? { ...m, handled } : m)));
    const { error } = await supabase.from("messages").update({ handled }).eq("id", id);
    if (error) load();
  }

  const visible = (messages ?? []).filter((m) => {
    if (filter === "new") return !m.handled;
    if (filter === "handled") return m.handled;
    if (filter === "prayer" || filter === "speaking") return m.topic === filter;
    return true;
  });

  return (
    <div>
      <h2 className="h-display text-2xl">Messages &amp; Prayer Requests</h2>
      <p className="mt-2 text-lg text-ink/70">
        Everything sent through the website's contact page lands here. When you've read one and
        followed up, tap <span className="font-semibold">"Mark as handled"</span> so you always
        know what's new.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === f.id
                ? "bg-sea text-white"
                : "bg-white text-ink/70 ring-1 ring-ink/15 hover:ring-sea"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}
      {messages === null && !error ? (
        <p className="mt-8 text-lg text-ink/60">Loading messages…</p>
      ) : null}
      {messages !== null && visible.length === 0 ? (
        <p className="mt-8 rounded-xl bg-sand-dark p-6 text-lg text-ink/70">
          {filter === "new"
            ? "Nothing new — you're all caught up."
            : "No messages here yet."}
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        {visible.map((m) => (
          <article
            key={m.id}
            className={`rounded-2xl border bg-white p-6 shadow-sm ${
              m.handled ? "border-ink/10" : "border-gold/50 ring-1 ring-gold/30"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  m.topic === "prayer" ? "bg-sea/10 text-sea" : "bg-sand-dark text-ink/70"
                }`}
              >
                {topicLabels[m.topic]}
              </span>
              {!m.handled ? (
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                  New
                </span>
              ) : null}
              <span className="ml-auto text-sm text-ink/55">{formatWhen(m.created_at)}</span>
            </div>
            <p className="mt-3 text-lg font-semibold">
              {m.name} <span className="font-normal text-ink/55">· {m.email}</span>
            </p>
            <p className="mt-2 whitespace-pre-line text-lg leading-relaxed text-ink/85">
              {m.message}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent(
                  "Re: your message to Don & Patti Nichols",
                )}`}
                className="btn-primary !px-4 !py-2.5 !text-xs"
              >
                Reply by Email
              </a>
              <button
                onClick={() => setHandled(m.id, !m.handled)}
                className="btn-outline !px-4 !py-2.5 !text-xs"
              >
                {m.handled ? "Mark as New" : "Mark as Handled"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
