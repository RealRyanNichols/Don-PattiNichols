import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import ProfilePage from "@/components/ProfilePage";
import { keywords, ogCardImage } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/patti",
  title: "Patti Nichols — Mission Team Member & the Money Ministry",
  description:
    "Patti Nichols serves alongside Don in mission work in Belize and in their local community — meeting practical needs and sharing the love of Christ.",
  keywords: keywords(["Patti Nichols", "Patti Nichols missionary", "Patti's Money Ministry", "Patti Nichols salsa", "Patti Nichols East Texas"]),
  image: ogCardImage({
    eyebrow: "Mission team member",
    title: "Patti Nichols",
    line: "Fitting reading glasses one face at a time in Belize, and canning salsa at home to fund the field.",
    photo: "1p64gHV_x_TstBKJXK3QCQaCPQ2RAII60",
  }),
});

export const revalidate = 60;

export default function PattiPage() {
  return <ProfilePage who="patti" />;
}
