import { site } from "@/lib/site";
import type { Metadata } from "next";
import ProfilePage from "@/components/ProfilePage";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/don` },
  title: "Don Nichols — Preacher & Mission Team Member",
  description:
    "Don Nichols preaches the Word of God and serves on medical mission teams bringing free clinics, Bibles, and the Gospel of Jesus Christ to rural villages in Belize.",
};

export default function DonPage() {
  return <ProfilePage who="don" />;
}
