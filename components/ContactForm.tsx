"use client";

import { useState } from "react";
import { track } from "@/lib/track";

const topics = [
  { id: "prayer", label: "Prayer Request" },
  { id: "speaking", label: "Invite Don to Speak" },
  { id: "giving", label: "Question About Giving" },
  { id: "general", label: "General Message" },
] as const;

type TopicId = (typeof topics)[number]["id"];

export default function ContactForm() {
  const [topic, setTopic] = useState<TopicId>("prayer");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.currentTarget);
    track("contact_submit", { topic });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-sea/10 p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-sea">Message received.</h2>
        <p className="mt-2 text-ink/75">
          Thank you —{" "}
          {topic === "prayer" ? "we will be praying with you." : "we'll get back to you soon."}
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block font-semibold">What is this about?</label>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopic(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                topic === t.id
                  ? "bg-sea text-white"
                  : "bg-white text-ink/70 ring-1 ring-ink/15 hover:ring-sea"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-semibold">
            Your name
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block font-semibold">
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block font-semibold">
          {topic === "prayer" ? "How can we pray for you?" : "Your message"}
        </label>
        <textarea id="message" name="message" required rows={6} className={inputClass} />
      </div>

      <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
      {status === "error" ? (
        <p className="text-sm text-red-700">Something went wrong — please try again.</p>
      ) : null}
    </form>
  );
}
