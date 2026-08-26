import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact & Free Quote",
  description:
    "Get a free house or office cleaning quote from Sisters Cleaning Service — call, text, " +
    "WhatsApp, email, or fill out our quote form.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
