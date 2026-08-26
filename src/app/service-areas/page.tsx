import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_AREAS, BUSINESS_CITY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Service Areas | Sisters Cleaning Service",
  description: `Cleaning services in ${BUSINESS_CITY} and the surrounding Charlotte, NC metro area.`,
};

export default function ServiceAreasPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-950 sm:text-4xl">Service Areas</h1>
      <p className="mt-3 max-w-2xl text-base text-foreground/70">
        Based in {BUSINESS_CITY}, we serve homes and businesses throughout the greater Charlotte,
        NC metro area. Not sure if we cover your area? Reach out — we&apos;re happy to check.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {SERVICE_AREAS.map(area => (
          <div
            key={area}
            className="cursor-default rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm font-semibold text-brand-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-500/50 hover:bg-brand-50 hover:shadow-sm"
          >
            {area}, NC
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/contact"
          className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-md"
        >
          Check Your Area
        </Link>
      </div>
    </div>
  );
}
