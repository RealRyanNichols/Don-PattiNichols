import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Post to the Site",
  robots: { index: false, follow: false },
};

/**
 * /admin — Don and Patti's own door into the website.
 *
 * Deliberately kept off the navigation and out of the search index. They reach
 * it by typing donandpatti.com/admin, or by saving it to their phone's home
 * screen. Access is controlled by the `site_authors` allow-list in Supabase.
 */
export default function AdminPage() {
  return <AdminApp />;
}
