import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { keywords, ogCardImage } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/contact",
  title: "Contact Don & Patti — Prayer Requests & Speaking Invitations",
  description:
    "Send Don & Patti Nichols a message, share a prayer request, or invite Don to speak at your church about the Belize medical mission.",
  keywords: keywords("churches", ["contact Don Nichols", "prayer request", "invite Don Nichols to speak"]),
  image: ogCardImage({
    eyebrow: "Contact",
    title: "Send a prayer request. Invite Don to speak. Say hello.",
    line: "Every message is read personally.",
    photo: "1H_UUg6nB7UHwtS5SsUzz5kpiSOfIpfYI",
  }),
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            We&rsquo;d Love to Hear From You
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">
            Contact
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Send a prayer request, invite Don to speak at your church, or just
            say hello. Every message is read personally.
          </p>
        </div>
      </section>

      <section className="container-content max-w-2xl py-14">
        <ContactForm />
      </section>
    </>
  );
}
