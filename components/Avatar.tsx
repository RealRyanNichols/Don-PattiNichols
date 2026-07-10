import { people, type AuthorKey } from "@/content/people";

type Props = {
  author: AuthorKey;
  /** gold = on dark hero panels; sea = on light timeline backgrounds. */
  tone?: "gold" | "sea";
};

export default function Avatar({ author, tone = "sea" }: Props) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-base font-bold ${
        tone === "gold" ? "bg-gold text-ink" : "bg-sea text-white"
      }`}
    >
      {people[author].initials}
    </span>
  );
}
