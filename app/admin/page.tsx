import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";
import { socialMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...socialMetadata({
    title: "Family Dashboard",
    description: "Private family dashboard for managing the Don & Patti Nichols mission website.",
    path: "/admin",
    eyebrow: "Don & Patti Nichols",
    image: "/images/team.jpg",
  }),
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="container-content max-w-4xl py-12 sm:py-16">
      <AdminApp />
    </section>
  );
}
