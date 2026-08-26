"use client";

import Image from "next/image";
import { BUSINESS_NAME, BUSINESS_CITY } from "@/lib/constants";
import { withBasePath } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";

export default function AboutContent() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-950 sm:text-4xl">{t("about.title")}</h1>
          <p className="mt-4 text-base text-foreground/70">
            {t("about.paragraph1", { name: BUSINESS_NAME, city: BUSINESS_CITY })}
          </p>
          <p className="mt-4 text-base text-foreground/70">
            {t("about.paragraph2", { tagline: t("hero.tagline") })}
          </p>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl bg-[#8fd3c9] shadow-lg">
          <Image
            src={withBasePath("/images/hero-illustration.png")}
            alt="Illustrated cartoon of the two Sisters Cleaning Service owners holding cleaning supplies"
            fill
            sizes="(min-width: 768px) 384px, 90vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
