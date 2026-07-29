"use client";

import { useEffect, useState } from "react";

/** Rotating Scripture (KJV, public domain). Fades between verses every 8 seconds. */
const VERSES = [
  {
    text: "Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me.",
    ref: "Matthew 25:40",
  },
  {
    text: "Go ye into all the world, and preach the gospel to every creature.",
    ref: "Mark 16:15",
  },
  {
    text: "He that hath pity upon the poor lendeth unto the LORD; and that which he hath given will he pay him again.",
    ref: "Proverbs 19:17",
  },
  {
    text: "Also I heard the voice of the Lord, saying, Whom shall I send, and who will go for us? Then said I, Here am I; send me.",
    ref: "Isaiah 6:8",
  },
  {
    text: "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.",
    ref: "2 Corinthians 9:7",
  },
  {
    text: "Declare his glory among the heathen, his wonders among all people.",
    ref: "Psalm 96:3",
  },
];

export default function VerseRotator({ dark = true }: { dark?: boolean }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setI((n) => (n + 1) % VERSES.length);
        setVisible(true);
      }, 600);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const v = VERSES[i];

  return (
    <p
      className={`font-serif italic transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      } ${dark ? "text-white/80" : "text-ink/75"}`}
    >
      &ldquo;{v.text}&rdquo;{" "}
      <span
        className={`ml-2 text-xs font-bold not-italic uppercase tracking-[0.2em] ${
          dark ? "text-gold" : "text-sea"
        }`}
      >
        {v.ref}
      </span>
    </p>
  );
}
