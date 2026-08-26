import type { Metadata } from "next";
import Image from "next/image";
import { BUSINESS_NAME, BUSINESS_TAGLINE, BUSINESS_CITY } from "@/lib/constants";
import { withBasePath } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${BUSINESS_NAME}, a family-run house cleaning company based in ${BUSINESS_CITY} serving the greater Charlotte, NC area.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-950 sm:text-4xl">About Us</h1>
          <p className="mt-4 text-base text-foreground/70">
            {BUSINESS_NAME} is a family-run cleaning company based in {BUSINESS_CITY}, proudly
            serving homes and businesses across the greater Charlotte, NC area.
          </p>
          <p className="mt-4 text-base text-foreground/70">
            {BUSINESS_TAGLINE} — that&apos;s the idea behind everything we do. We treat every home
            and office like it&apos;s our own, with the same attention to detail whether it&apos;s a
            quick weekly refresh or a full deep clean.
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
