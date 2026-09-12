import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import ProfilePage from "@/components/ProfilePage";
import { keywords, ogCardImage } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/don",
  title: "Don Nichols — Preacher, Missionary & Mission Team Member",
  description:
    "Don Nichols preaches the Word of God and serves on medical mission teams bringing free clinics, Bibles, and the Gospel of Jesus Christ to rural villages in Belize.",
  keywords: keywords(["Don Nichols", "Donald Nichols", "Don Nichols preacher", "Don Nichols missionary Belize", "Don Nichols East Texas"]),
  image: ogCardImage({
    eyebrow: "Preacher & mission team member",
    title: "Don Nichols",
    line: "Thirteen years of mission work in Malawi, the Dominican Republic and Belize.",
    photo: "1sTAXV2XNx7MwshLmPda_YuvaraGBpdaF",
  }),
});

export const revalidate = 60;

export default function DonPage() {
  return <ProfilePage who="don" />;
}
