"use client";

import { useEffect, useState } from "react";
import PrintButton from "@/components/PrintButton";
import JoinForm from "@/components/JoinForm";
import { track } from "@/lib/track";

/**
 * THE 90-DAY CHECKLIST — tick things off, come back later, print it.
 *
 * Progress lives only in this browser (localStorage); nothing is sent
 * anywhere. Items marked ◆ are how the Nichols team actually does it, from
 * Don's description of the preparation. The rest is general planning
 * guidance from the site.
 */

const KEY = "dp-trip-checklist-v1";

const PHASES: { when: string; items: { text: string; don?: boolean }[] }[] = [
  {
    when: "90 days out",
    items: [
      { text: "Confirm with the host what the clinic actually needs this year" },
      { text: "Set the supply budget and the per-person cost; name both numbers to your team" },
      { text: "Send support letters (the generator on this site writes the first draft)" },
      { text: "Start purchasing supplies in bulk — Bibles, kits, glasses, tracts", don: true },
      { text: "Passports checked: valid six months past the return date" },
    ],
  },
  {
    when: "60 days out",
    items: [
      { text: "Assemble hygiene kits one item at a time; count into boxes of 25", don: true },
      { text: "Sort reading glasses by prescription", don: true },
      { text: "Buy the heavy-duty trunks (about $25 each) and number them", don: true },
      { text: "Begin the inventory sheet for each trunk as you pack, not after", don: true },
      { text: "Book flights; note the checked-bag fee per trunk (about $200)" },
    ],
  },
  {
    when: "30 days out",
    items: [
      { text: "Translate every inventory sheet into Spanish", don: true },
      { text: "Prepare the customs explanation: donated, nothing for sale, given free", don: true },
      { text: "Add owner information to each trunk", don: true },
      { text: "Hand out the seven-day prayer cards to your church" },
      { text: "Confirm in-country transport for people and trunks" },
    ],
  },
  {
    when: "14 days out",
    items: [
      { text: "Pack each trunk to about fifty pounds; weigh every one", don: true },
      { text: "Print two copies of every document: one in the trunk, one in a carry-on" },
      { text: "Team meeting: roles for intake, pharmacy, vision table, evangelism" },
      { text: "Share the giving page so people can still sponsor a line on the budget" },
    ],
  },
  {
    when: "The week of",
    items: [
      { text: "Re-weigh trunks after last additions" },
      { text: "Medications you personally need, in your carry-on" },
      { text: "Tell your list the team is leaving; ask for prayer for safe travel" },
    ],
  },
  {
    when: "On the ground",
    items: [
      { text: "Carry the inventory sheets through customs with the trunks", don: true },
      { text: "Set up intake, pharmacy and the vision table in the village church", don: true },
      { text: "Photograph the work — the record matters as much as the receipts" },
    ],
  },
  {
    when: "After you're home",
    items: [
      { text: "Write to every supporter: what happened, what their gift became" },
      { text: "Record the real costs while they are fresh; publish them if you can" },
      { text: "Thank the pastors you served alongside, by name" },
    ],
  },
];

const ALL = PHASES.flatMap((p, pi) => p.items.map((_, ii) => `${pi}-${ii}`));

export default function TripChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // Storage blocked — the list still works for this visit.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(done));
    } catch {
      // ignore
    }
  }, [done, loaded]);

  const count = ALL.filter((k) => done[k]).length;
  const pct = Math.round((count / ALL.length) * 100);

  return (
    <div className="my-10">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sea">Your checklist</p>
            <p className="mt-1 font-serif text-2xl font-bold text-ink">
              {count} of {ALL.length} done
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <PrintButton label="Print" className="btn-outline !px-4 !py-2 !text-xs" what="trip_checklist" />
            <button
              type="button"
              onClick={() => {
                setDone({});
                track("checklist_reset", {});
              }}
              className="btn-outline !px-4 !py-2 !text-xs"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-sand-dark" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gradient-to-r from-sea to-gold transition-[width]" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-ink/50">
          Saved in this browser only. ◆ marks how the Nichols team does it, from Don&rsquo;s own description.
        </p>
      </div>

      <div className="print-sheet mt-5 grid gap-4 sm:grid-cols-2">
        {PHASES.map((p, pi) => (
          <section key={p.when} className="print-card rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10">
            <h3 className="font-serif text-lg font-bold text-ink">{p.when}</h3>
            <ul className="mt-3 space-y-2">
              {p.items.map((it, ii) => {
                const k = `${pi}-${ii}`;
                return (
                  <li key={k}>
                    <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-snug">
                      <input
                        type="checkbox"
                        checked={!!done[k]}
                        onChange={(e) => setDone((d) => ({ ...d, [k]: e.target.checked }))}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-[#0e6b70]"
                      />
                      <span className={done[k] ? "text-ink/40 line-through" : "text-ink/85"}>
                        {it.don && <span className="mr-1 text-gold" aria-label="How the Nichols team does it">◆</span>}
                        {it.text}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border-2 border-sea/20 bg-white p-5 print:hidden">
        <p className="font-serif text-lg font-bold text-ink">Planning a trip? Don answers questions from other teams.</p>
        <p className="mt-1 text-sm text-ink/70">Leave your name and number and he will send the real numbers as they change.</p>
        <div className="mt-3 max-w-md">
          <JoinForm source="trip_checklist" interest="planning a trip" askName askPhone submitLabel="Send me the numbers" doneTitle="Done." doneText="Don will send the current figures and answer what you want to ask." />
        </div>
      </div>
    </div>
  );
}
