/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    /*
     * Every share-card route reads assets/fonts/Lora-Bold.ttf off disk
     * (lib/ogFont.ts). Vercel's file tracer doesn't reliably follow a
     * process.cwd() read into the serverless bundle, so the font is pinned
     * here explicitly. Without this, cards render in the fallback sans on
     * Vercel even though they look right locally.
     */
    outputFileTracingIncludes: {
      "/blog/[slug]/opengraph-image": ["./assets/fonts/*"],
      "/what-a-mission-trip-costs/opengraph-image": ["./assets/fonts/*"],
    },
  },
};

export default nextConfig;
