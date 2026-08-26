"use client";

import ContactForm from "@/components/ContactForm";
import ContactButtons from "@/components/ContactButtons";
import { useLanguage } from "@/lib/i18n";

export default function ContactPageContent() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-950 sm:text-4xl">{t("contact.title")}</h1>
      <p className="mt-3 max-w-2xl text-base text-foreground/70">{t("contact.description")}</p>

      <div className="mt-8">
        <ContactButtons />
      </div>

      <div className="mt-10 max-w-2xl rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
        <ContactForm />
      </div>
    </div>
  );
}
