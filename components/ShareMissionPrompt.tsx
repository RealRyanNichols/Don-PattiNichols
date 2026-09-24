import Image from "next/image";
import Link from "next/link";

export default function ShareMissionPrompt({
  dark = false,
}: {
  dark?: boolean;
}) {
  return (
    <aside aria-label="Free social media images">
      <Link
        href="/share"
        className={`group flex items-center gap-4 rounded-xl border p-4 transition-colors sm:gap-5 sm:p-5 ${dark ? "border-white/15 bg-white/[0.06] hover:bg-white/10" : "border-sea/15 bg-white hover:bg-sand-dark/60"}`}
      >
        <Image
          src="/images/social/01-love-in-action.png"
          alt=""
          width={1254}
          height={1254}
          sizes="80px"
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-md object-contain sm:h-20 sm:w-20"
        />
        <div>
          <h3
            className={`font-serif text-lg font-bold sm:text-xl ${dark ? "text-white" : "text-deep"}`}
          >
            Share the mission with someone new.
          </h3>
          <p
            className={`mt-1 text-sm leading-relaxed ${dark ? "text-white/75" : "text-ink/70"}`}
          >
            14 free images and matching captions, ready for your next post.
          </p>
          <span
            className={`mt-2 inline-block text-sm font-semibold underline underline-offset-4 ${dark ? "text-gold" : "text-sea"}`}
          >
            Get the social images →
          </span>
        </div>
      </Link>
    </aside>
  );
}
