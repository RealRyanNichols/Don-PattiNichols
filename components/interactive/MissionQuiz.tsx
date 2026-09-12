"use client";

import { useState } from "react";
import ShareButton from "@/components/ShareButton";
import JoinForm from "@/components/JoinForm";
import { track } from "@/lib/track";

/**
 * THE MEDICAL MISSIONS QUIZ — ten questions, every answer a fact Don has
 * published on this site (his budget, his timeline, his description of the
 * trunks and kits). Each answer shows where it came from, so the quiz teaches
 * the thing it tests. Results are shareable; the follow box offers the next one.
 */

type Q = { q: string; options: string[]; answer: number; why: string };

/** Exported so the tests can check every answer against Don's content files. */
export const QUESTIONS: Q[] = [
  {
    q: "What does one Bible cost on Don's Belize budget?",
    options: ["$0.60", "$2.50", "$10", "$25"],
    answer: 1,
    why: "$2.50 in Belize. The same Bible cost $10 in Malawi in 2014 — country and language change the price more than anything else.",
  },
  {
    q: "What is the cheapest item on the whole budget?",
    options: ["A hygiene kit", "A Gospel tract", "A pair of reading glasses", "A pair of sunglasses"],
    answer: 2,
    why: "Reading glasses, about sixty cents a pair — and often the gift that changes a person's day the most.",
  },
  {
    q: "How much does a packed mission trunk weigh?",
    options: ["About 25 lb", "About 50 lb", "About 75 lb", "About 100 lb"],
    answer: 1,
    why: "Around fifty pounds each. Packed by hand to a written inventory sheet.",
  },
  {
    q: "How many trunks did the team travel with on the most recent trip?",
    options: ["Three", "Six", "Nine", "Twelve"],
    answer: 2,
    why: "Nine trunks — nearly 450 pounds of ministry supplies through airports and Belize customs.",
  },
  {
    q: "What does it cost to fly one trunk to Belize as checked baggage?",
    options: ["$25", "$75", "$200", "$800"],
    answer: 2,
    why: "$200 per trunk. The trunk itself is $25; the airline is where the money goes.",
  },
  {
    q: "When and where was Don's first mission trip?",
    options: ["July 2013, Malawi", "June 2017, Dominican Republic", "June 2019, Belize", "March 2010, Honduras"],
    answer: 0,
    why: "July 2013, Malawi — evangelism. He went back almost every year through 2019.",
  },
  {
    q: "Which of these is NOT a country the Nichols have served in?",
    options: ["Mozambique", "Belize", "Honduras", "Zambia"],
    answer: 2,
    why: "Five countries: Belize, the Dominican Republic, Malawi, Mozambique and Zambia. Never Honduras.",
  },
  {
    q: "What does a patient pay at the clinic?",
    options: ["A small registration fee", "Whatever they can afford", "Nothing at all", "Only for medication"],
    answer: 2,
    why: "Nothing. In Don's words, \"the love of Christ should never have a price tag.\"",
  },
  {
    q: "Which item is NOT in the hygiene kit Don describes?",
    options: ["A towel", "A sewing kit", "A hair tie", "A flashlight"],
    answer: 3,
    why: "A towel, a sewing kit, toothpaste and a toothbrush, a hair tie, lip balm and a Gospel booklet. No flashlight.",
  },
  {
    q: "Why were there no trips in 2024?",
    options: ["COVID travel restrictions", "Don's open-heart surgery and recovery", "No funding", "Belize customs delays"],
    answer: 1,
    why: "Don's open-heart surgery and recovery. COVID was 2020. Belize in June 2026 was the road back.",
  },
];

function tier(score: number) {
  if (score >= 9) return { name: "Trunk packer", line: "You could write the inventory sheet yourself." };
  if (score >= 6) return { name: "Team member", line: "You know how this works. Time to come along." };
  if (score >= 3) return { name: "First-timer", line: "Every answer is on this site. Now you have them." };
  return { name: "Just landed", line: "Welcome. Read one guide and take it again." };
}

export default function MissionQuiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[i];
  const pick = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
    if (n === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 >= QUESTIONS.length) {
      setDone(true);
      track("quiz_done", { score: score });
      return;
    }
    setI(i + 1);
    setPicked(null);
  };
  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const t = tier(score);
    return (
      <div className="my-10 rounded-2xl bg-deep p-6 text-white shadow-lg sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Your result</p>
        <p className="mt-2 font-serif text-5xl font-bold">
          {score} <span className="text-2xl text-white/60">/ {QUESTIONS.length}</span>
        </p>
        <p className="mt-2 font-serif text-2xl font-bold text-gold">{t.name}</p>
        <p className="mt-1 text-white/80">{t.line}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <ShareButton
            title="Medical missions quiz"
            text={`I scored ${score}/${QUESTIONS.length} on the medical missions quiz (${t.name}). Every answer is a real number from Don Nichols' mission budget. Try it:`}
            path="/articles/medical-missions-quiz"
            dark
          />
          <button type="button" onClick={restart} className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep">
            Take it again
          </button>
        </div>
        <div className="mt-6 rounded-2xl bg-white p-5 text-ink">
          <p className="font-serif text-lg font-bold">Get the next quiz, and the stories behind the answers.</p>
          <p className="mt-1 text-sm text-ink/70">Name, phone and email. Don and Patti write every word themselves.</p>
          <div className="mt-3">
            <JoinForm source="quiz" interest="quiz" askName askPhone submitLabel="Send me the next one" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 sm:p-7">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-sea">
        <span>Question {i + 1} of {QUESTIONS.length}</span>
        <span>Score {score}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-dark">
        <div className="h-full rounded-full bg-sea transition-[width]" style={{ width: `${((i + (picked !== null ? 1 : 0)) / QUESTIONS.length) * 100}%` }} />
      </div>
      <p className="mt-5 font-serif text-xl font-bold text-ink sm:text-2xl">{q.q}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {q.options.map((o, n) => {
          const state =
            picked === null ? "idle" : n === q.answer ? "right" : n === picked ? "wrong" : "dim";
          return (
            <button
              key={o}
              type="button"
              onClick={() => pick(n)}
              disabled={picked !== null}
              className={`rounded-xl px-4 py-3 text-left text-[15px] font-semibold ring-1 transition ${
                state === "idle"
                  ? "bg-sand text-ink ring-ink/10 hover:ring-sea"
                  : state === "right"
                    ? "bg-sea text-white ring-sea"
                    : state === "wrong"
                      ? "bg-red-50 text-red-800 ring-red-200"
                      : "bg-sand text-ink/40 ring-ink/5"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 rounded-xl border-l-4 border-gold bg-sand-dark p-4">
          <p className="text-sm font-bold text-ink">{picked === q.answer ? "Right." : "Not quite."}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink/80">{q.why}</p>
          <button type="button" onClick={next} className="btn-primary mt-4">
            {i + 1 >= QUESTIONS.length ? "See my result" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
