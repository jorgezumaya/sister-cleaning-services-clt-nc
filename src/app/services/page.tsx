import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
  title: "Cleaning Services",
  description:
    "Residential, commercial, deep, and partial cleaning in Marshville, Monroe, Waxhaw, Indian Trail, " +
    "and the greater Charlotte, NC area — daily, weekly, bi-weekly, monthly, or one-time.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
