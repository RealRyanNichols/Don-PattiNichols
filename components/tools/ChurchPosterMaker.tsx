"use client";

import { useState } from "react";
import { track } from "@/lib/track";

/**
 * CHURCH POSTER MAKER — three fields, a live preview from
 * /api/church-poster, and a print-ready download. The QR code on the poster
 * always points at donandpatti.com/churches.
 */
export default function ChurchPosterMaker() {
  const [church, setChurch] = useState("");
  const [when, setWhen] = useState("");
  const [time, setTime] = useState("");
  const q = new URLSearchParams();
  if (church.trim()) q.set("church", church.trim().slice(0, 48));
  if (when.trim()) q.set("when", when.trim().slice(0, 40));
  if (time.trim()) q.set("time", time.trim().slice(0, 24));
  const src = `/api/church-poster${q.size ? `?${q.toString()}` : ""}`;
  const field =
    "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <form
        className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Church name</span>
          <input value={church} onChange={(e) => setChurch(e.target.value)} maxLength={48} placeholder="First Baptist Church" className={field} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Date</span>
            <input value={when} onChange={(e) => setWhen(e.target.value)} maxLength={40} placeholder="Sunday, October 4" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Time</span>
            <input value={time} onChange={(e) => setTime(e.target.value)} maxLength={24} placeholder="10:30 AM" className={field} />
          </label>
        </div>
        <p className="rounded-xl bg-sand-dark p-4 text-sm leading-relaxed text-ink/70">
          Leave the fields blank for a general poster. The QR code scans to the
          For Churches page, where a visitor can give, pray, or follow the
          mission. Print at 8½ × 11.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={src}
            download="don-and-patti-church-poster.png"
            onClick={() => track("tool_download", { tool: "church_poster" })}
            className="btn-give"
          >
            Download the poster
          </a>
          <a href={src} target="_blank" rel="noopener noreferrer" className="btn-outline">
            Open full size
          </a>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl bg-sand-dark shadow-lg ring-1 ring-ink/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={`Poster preview${church ? ` for ${church}` : ""}`}
          width={1275}
          height={1650}
          className="aspect-[1275/1650] w-full"
        />
      </div>
    </div>
  );
}
