/** Approved public Ore City films, recorded September 15, 2026.
 * Source: existing public media manifest; originals stay outside the app. */
export type MissionVideo = {
  id: string;
  title: string;
  description: string;
  seconds: number;
  poster: string;
  playback: string;
  captions: string;
};
export const videoMediaBase =
  "https://www.donandpatti.com/videos/ore-city-ministry";
export const missionVideos: MissionVideo[] = [
  {
    id: "don-ministry-extended-story",
    title: "Serving Here, Serving Beyond",
    description:
      "Local service in Ore City and Don\u2019s recollections of wider ministry work.",
    seconds: 304,
    poster: "don-ministry-extended-story.poster-v2.webp",
    playback: "don-ministry-extended-story-web.mp4",
    captions: "don-ministry-extended-story.vtt",
  },
  {
    id: "don-food-run-full-story",
    title: "A Morning Serving Ore City",
    description:
      "The grocery pickup, loading, and Don\u2019s explanation of local ministry.",
    seconds: 185,
    poster: "don-food-run-full-story.poster-v2.webp",
    playback: "don-food-run-full-story-web.mp4",
    captions: "don-food-run-full-story.vtt",
  },
  {
    id: "don-faith-in-action-3min",
    title: "Faith in Action",
    description:
      "A longer ministry reel with Don\u2019s faith and practical service message.",
    seconds: 173,
    poster: "don-faith-in-action-3min.poster-v2.webp",
    playback: "don-faith-in-action-3min-web.mp4",
    captions: "don-faith-in-action-3min.vtt",
  },
  {
    id: "don-neighbors-2min",
    title: "Helping Our Neighbors",
    description:
      "Supporting a local grocery store, preparing food, and helping our neighbors.",
    seconds: 120,
    poster: "don-neighbors-2min.poster-v2.webp",
    playback: "don-neighbors-2min-web.mp4",
    captions: "don-neighbors-2min.vtt",
  },
  {
    id: "don-food-and-service-90s",
    title: "Food, Time & Service",
    description:
      "The ingredient plan, local mission and different ways to serve.",
    seconds: 91,
    poster: "don-food-and-service-90s.poster-v2.webp",
    playback: "don-food-and-service-90s-web.mp4",
    captions: "don-food-and-service-90s.vtt",
  },
  {
    id: "don-local-service-60s",
    title: "Serve Right Here",
    description: "A practical one-minute invitation to help locally.",
    seconds: 60,
    poster: "don-local-service-60s.poster-v2.webp",
    playback: "don-local-service-60s-web.mp4",
    captions: "don-local-service-60s.vtt",
  },
  {
    id: "don-why-dessert-30s",
    title: "Why Dessert Matters",
    description: "Don explains the ingredient plan and the dessert gap.",
    seconds: 30,
    poster: "don-why-dessert-30s.poster-v2.webp",
    playback: "don-why-dessert-30s-web.mp4",
    captions: "don-why-dessert-30s.vtt",
  },
  {
    id: "don-mission-outside-the-doors",
    title: "Right Outside Those Doors",
    description:
      "A short message about faith and serving outside the church doors.",
    seconds: 15,
    poster: "don-mission-outside-the-doors.poster-v2.webp",
    playback: "don-mission-outside-the-doors-web.mp4",
    captions: "don-mission-outside-the-doors.vtt",
  },
  {
    id: "don-dessert-ingredients-hook",
    title: "Something Extra for Families",
    description: "Don prepares dessert ingredients for 60 families.",
    seconds: 13,
    poster: "don-dessert-ingredients-hook.poster-v2.webp",
    playback: "don-dessert-ingredients-hook-web.mp4",
    captions: "don-dessert-ingredients-hook.vtt",
  },
  {
    id: "don-give-your-time-hook",
    title: "Give Your Time",
    description:
      "Don invites people to serve with their time and helping hands.",
    seconds: 13,
    poster: "don-give-your-time-hook.poster-v2.webp",
    playback: "don-give-your-time-hook-web.mp4",
    captions: "don-give-your-time-hook.vtt",
  },
  {
    id: "don-local-mission-hook",
    title: "Mission Work Starts Here",
    description:
      "Don explains why mission work can start in your own community.",
    seconds: 12,
    poster: "don-local-mission-hook.poster-v2.webp",
    playback: "don-local-mission-hook-web.mp4",
    captions: "don-local-mission-hook.vtt",
  },
];
export const featuredVideo = missionVideos.find(
  (video) => video.id === "don-food-and-service-90s",
)!;
export function findVideo(id: string) {
  return missionVideos.find((video) => video.id === id);
}
export function videoDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
