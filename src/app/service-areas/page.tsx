import type { Metadata } from "next";
import { BUSINESS_CITY } from "@/lib/constants";
import ServiceAreasContent from "./ServiceAreasContent";

export const metadata: Metadata = {
  title: "Service Areas",
  description: `House and office cleaning in ${BUSINESS_CITY}, Monroe, Waxhaw, Indian Trail, Wingate, Matthews, and the greater Charlotte, NC metro area.`,
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreasPage() {
  return <ServiceAreasContent />;
}
