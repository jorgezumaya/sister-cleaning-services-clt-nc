import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ContactButtons from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "Contact & Free Quote",
  description:
    "Get a free house or office cleaning quote from Sisters Cleaning Service — call, text, " +
    "WhatsApp, email, or fill out our quote form.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-950 sm:text-4xl">Get a Free Quote</h1>
      <p className="mt-3 max-w-2xl text-base text-foreground/70">
        Tell us a bit about the space and how often you&apos;d like it cleaned — we&apos;ll follow up
        with a quote. Prefer to talk right away? Use the buttons below.
      </p>

      <div className="mt-8">
        <ContactButtons />
      </div>

      <div className="mt-10 max-w-2xl rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
        <ContactForm />
      </div>
    </div>
  );
}
