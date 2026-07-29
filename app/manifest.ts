import type { MetadataRoute } from "next";

/**
 * WEB APP MANIFEST — this is what turns donandpatti.com into an app icon on
 * Don and Patti's phones.
 *
 * Ryan installs the site to their home screens so they never have to find a
 * browser, type a URL, or sign in again. Three things make that work:
 *   - `display: "standalone"` launches with no address bar, so it looks and
 *     feels like an app rather than a web page.
 *   - `start_url: "/admin"` means tapping the icon lands them on their own
 *     dashboard, not the public homepage. Their session persists, so they are
 *     simply already signed in.
 *   - the 192 and 512 icons are what Android requires before it will offer
 *     "Install app" at all.
 *
 * `shortcuts` give them a long-press menu straight to the two things they
 * actually do: write a post and thank a donor.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Don & Patti Nichols — Mission Work & Ministry",
    short_name: "Don & Patti",
    description:
      "Post stories, share photographs, thank the people who give, and keep the record of the mission.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf6ef",
    theme_color: "#0a3d40",
    categories: ["lifestyle", "social"],
    icons: [
      {
        src: "/pwa-icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Write a post",
        short_name: "Write",
        url: "/admin?tab=post",
      },
      {
        name: "Thank someone",
        short_name: "Thanks",
        url: "/admin?tab=thanks",
      },
    ],
  };
}
