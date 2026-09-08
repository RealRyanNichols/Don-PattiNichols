import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import ProfilePage from "@/components/ProfilePage";

export const metadata: Metadata = createPageMetadata({
  path: "/don",
  title: "Don Nichols — Preacher & Mission Team Member",
  description:
    "Don Nichols preaches the Word of God and serves on medical mission teams bringing free clinics, Bibles, and the Gospel of Jesus Christ to rural villages in Belize.",
});

export const revalidate = 60;

export default function DonPage() {
  return <ProfilePage who="don" />;
}
