import { site } from "@/lib/site";
import type { Metadata } from "next";
import ProfilePage from "@/components/ProfilePage";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/patti` },
  title: "Patti Nichols — Mission Team Member",
  description:
    "Patti Nichols serves alongside Don in mission work in Belize and in their local community — meeting practical needs and sharing the love of Christ.",
};

export default function PattiPage() {
  return <ProfilePage who="patti" />;
}
