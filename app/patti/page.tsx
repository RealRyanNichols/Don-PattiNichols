import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import ProfilePage from "@/components/ProfilePage";

export const metadata: Metadata = createPageMetadata({
  path: "/patti",
  title: "Patti Nichols — Mission Team Member",
  description:
    "Patti Nichols serves alongside Don in mission work in Belize and in their local community — meeting practical needs and sharing the love of Christ.",
});

export const revalidate = 60;

export default function PattiPage() {
  return <ProfilePage who="patti" />;
}
