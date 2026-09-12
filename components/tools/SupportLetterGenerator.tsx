"use client";

import { useMemo, useState } from "react";
import { missionaryCost } from "@/content/support";
import { usd } from "@/lib/budget";
import CopyButton from "@/components/CopyButton";
import { track } from "@/lib/track";

/**
 * SUPPORT LETTER GENERATOR.
 *
 * Eight answers become a one-page letter. The structure follows the guide:
 * who / where and when / the work / a specific ask / how to give / prayer /
 * thanks. The default amount is the real per-missionary figure from Don's
 * budget, because a named number is what gets a support letter answered.
 *
 * Nothing leaves the browser. The download is a plain .txt so it opens in
 * anything.
 */

const WORK = [
  "medical clinic",
  "pharmacy",
  "vision table and reading glasses",
  "hygiene kit distribution",
  "evangelism and prayer with families",
  "logistics and trunks",
  "children's ministry",
  "construction",
];

const PRAYERS = [
  "safe travel",
  "wisdom for the medical team",
  "the local pastors we will serve alongside",
  "open hearts to the Gospel",
  "our families while we are away",
  "the supplies to arrive in full",
];

export default function SupportLetterGenerator() {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("Belize");
  const [dates, setDates] = useState("");
  const [team, setTeam] = useState("");
  const [work, setWork] = useState<string[]>([WORK[0], WORK[4]]);
  const [amount, setAmount] = useState(missionaryCost.total);
  const [deadline, setDeadline] = useState("");
  const [howToGive, setHowToGive] = useState("");
  const [prayers, setPrayers] = useState<string[]>([PRAYERS[0], PRAYERS[1], PRAYERS[3]]);

  const toggle = (list: string[], v: string, setList: (l: string[]) => void) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const letter = useMemo(() => {
    const you = name.trim() || "[Your name]";
    const where = place.trim() || "[destination]";
    const when = dates.trim() || "[dates]";
    const withTeam = team.trim() ? ` with ${team.trim()}` : "";
    const workList =
      work.length === 0
        ? "serving wherever the team needs me"
        : work.length === 1
          ? work[0]
          : `${work.slice(0, -1).join(", ")} and ${work[work.length - 1]}`;
    const money = usd(Math.max(0, Math.round(amount)));
    const due = deadline.trim() ? ` by ${deadline.trim()}` : "";
    const give =
      howToGive.trim() ||
      "[how to give — a link, a mailing address, or who to make a check out to]";
    const prayerList =
      prayers.length === 0
        ? "the trip"
        : prayers.length === 1
          ? prayers[0]
          : `${prayers.slice(0, -1).join(", ")}, and ${prayers[prayers.length - 1]}`;
    const airfare = usd(missionaryCost.breakdown[0].amount);
    const lodging = usd(missionaryCost.breakdown[1].amount);
    const breakdown =
      Math.round(amount) === missionaryCost.total
        ? ` About ${airfare} of that is airfare and ${lodging} covers lodging, meals and ground transportation for the week. Nobody on the team is paid; every one of us is a volunteer raising our own way.`
        : "";

    return `Dear friend,

I am writing to ask you to be part of something I am about to do. ${when}, I will be going to ${where}${withTeam} on a medical mission trip. I will be helping with ${workList}.

Here is what a week like this actually looks like. The team sets up a free clinic in a village church. Providers see whoever comes through the door, a pharmacy dispenses medications, and people are fitted for reading glasses at a table laid out with hundreds of pairs. Every patient is served completely free of charge, and every person is offered a Bible and a chance to talk and pray. The supplies we hand out are packed into fifty-pound trunks before we leave and carried through customs by the team.

I need to raise ${money}${due} to go.${breakdown} If you can give any part of that, it will go directly toward getting me to the field. Here is how to give: ${give}

Just as important as the money is your prayer. Would you pray for ${prayerList}? I will write to you when I am home and tell you what happened.

Thank you for reading this, and thank you for whatever part you are able to play. It means more than you know.

With gratitude,
${you}`;
  }, [name, place, dates, team, work, amount, deadline, howToGive, prayers]);

  function download() {
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mission-trip-support-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
    track("tool_download", { tool: "support_letter" });
  }

  const field =
    "w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30";
  const chip = (on: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
      on ? "bg-sea text-white" : "bg-white text-ink/70 ring-1 ring-ink/15 hover:ring-sea"
    }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
      <form
        className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Where you are going</span>
            <input value={place} onChange={(e) => setPlace(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Dates</span>
            <input value={dates} onChange={(e) => setDates(e.target.value)} placeholder="June 8–13" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Team or church (optional)</span>
            <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="a team from First Baptist" className={field} />
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">What will you do?</legend>
          <div className="flex flex-wrap gap-2">
            {WORK.map((w) => (
              <button key={w} type="button" onClick={() => toggle(work, w, setWork)} className={chip(work.includes(w))} aria-pressed={work.includes(w)}>
                {w}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Amount to raise (USD)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className={field}
            />
            <span className="mt-1 block text-xs text-ink/55">
              {usd(missionaryCost.total)} is the real per-person figure on the Nichols team.
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Deadline (optional)</span>
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="May 1" className={field} />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">How should people give?</span>
          <input
            value={howToGive}
            onChange={(e) => setHowToGive(e.target.value)}
            placeholder="a link, a mailing address, or who to make a check out to"
            className={field}
          />
        </label>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Ask them to pray for…</legend>
          <div className="flex flex-wrap gap-2">
            {PRAYERS.map((p) => (
              <button key={p} type="button" onClick={() => toggle(prayers, p, setPrayers)} className={chip(prayers.includes(p))} aria-pressed={prayers.includes(p)}>
                {p}
              </button>
            ))}
          </div>
        </fieldset>
      </form>

      <div>
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink/10 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-sea">Your draft</p>
            <div className="flex gap-2">
              <CopyButton text={letter} label="Copy" what="support_letter" />
              <button type="button" onClick={download} className="btn-give !px-4 !py-2 !text-xs">
                Download .txt
              </button>
            </div>
          </div>
          <pre className="mt-4 whitespace-pre-wrap font-serif text-[17px] leading-relaxed text-ink/90">
            {letter}
          </pre>
        </div>
        <p className="mt-3 text-sm text-ink/55">
          Read it aloud once. Cut anything you would not say to the person&rsquo;s face. Mail it if you can.
        </p>
      </div>
    </div>
  );
}
