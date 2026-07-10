import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Family Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="container-content max-w-4xl py-12 sm:py-16">
      <AdminApp />
    </section>
  );
}
