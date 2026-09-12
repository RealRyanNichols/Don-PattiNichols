"use client";

import { useState } from "react";
import type { LifeStory } from "@/content/life-stories";
import LifeStoryCard from "@/components/LifeStoryCard";

const topics = [
  "All stories",
  "Marriage & Family",
  "Faith & Ministry",
  "Family Memories",
] as const;

export default function LifeStoriesExplorer({
  stories,
}: {
  stories: LifeStory[];
}) {
  const [topic, setTopic] = useState<(typeof topics)[number]>("All stories");
  const visible = stories.filter(
    (story) => topic === "All stories" || story.category === topic,
  );
  return (
    <div>
      <div
        role="group"
        aria-label="Filter stories by topic"
        className="flex flex-wrap gap-2"
      >
        {topics.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={topic === item}
            aria-controls="life-story-results"
            onClick={() => setTopic(item)}
            className={`min-h-11 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea ${topic === item ? "border-deep bg-deep text-white" : "border-sea/25 bg-transparent text-sea hover:border-sea hover:bg-white"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <p role="status" className="mb-3 mt-5 text-sm text-ink/60">
        {visible.length} {visible.length === 1 ? "story" : "stories"}
        {topic !== "All stories" && ` · ${topic}`}
      </p>
      <div
        id="life-story-results"
        className="grid gap-x-8 md:grid-cols-2 lg:gap-x-14"
      >
        {visible.map((story) => (
          <LifeStoryCard
            key={story.slug}
            story={story}
            index={stories.findIndex((item) => item.slug === story.slug)}
          />
        ))}
      </div>
    </div>
  );
}
