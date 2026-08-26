import type { Metadata } from "next";
import { BUSINESS_NAME, BUSINESS_CITY } from "@/lib/constants";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${BUSINESS_NAME}, a family-run house cleaning company based in ${BUSINESS_CITY} serving the greater Charlotte, NC area.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
