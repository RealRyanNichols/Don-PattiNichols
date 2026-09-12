/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*
   * Every share-card and wallpaper route reads assets/fonts/Lora-Bold.ttf off
   * disk (lib/ogFont.ts). Vercel's file tracer doesn't reliably follow a
   * process.cwd() read into the serverless bundle, so the font is pinned here
   * explicitly. Without this, cards render in the fallback sans on Vercel even
   * though they look right locally.
   *
   * Keys are matched with picomatch in "contains" mode, so one entry per
   * family of routes is enough: every opengraph-image, the /og generator, and
   * the image tools under /api.
   */
  outputFileTracingIncludes: {
    "opengraph-image": ["./assets/fonts/*"],
    "/og": ["./assets/fonts/*"],
    "/api/wallpaper": ["./assets/fonts/*"],
    "/api/share-card": ["./assets/fonts/*"],
    "/api/church-poster": ["./assets/fonts/*"],
  },
  async redirects() {
    return [
      // The hub is the index for both sections; keep the short paths working.
      { source: "/guides", destination: "/resources", permanent: true },
      { source: "/tools", destination: "/resources", permanent: true },
      { source: "/resources/guides", destination: "/resources", permanent: true },
      { source: "/resources/tools", destination: "/resources", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Search engines and feed readers should not be told the feed is HTML.
        source: "/feed.xml",
        headers: [{ key: "X-Content-Type-Options", value: "nosniff" }],
      },
    ];
  },
};

export default nextConfig;
