export const BUSINESS_NAME = "Sisters Cleaning Service";
export const BUSINESS_TAGLINE = "A Clean Home, A Happy Home";
export const BUSINESS_CITY = "Marshville, NC";

// TODO: swap for a dedicated business inbox before launch so a personal
// address is never the one printed on the site (matches the AvilaContracting
// pattern of a business-only email, kept out of client-exposed constants —
// the real destination lives server-side in CONTACT_TO_EMAIL, see api/contact/route.ts).
export const BUSINESS_EMAIL_DISPLAY = "info@sisterscleaningservicenc.com";

export const BUSINESS_PHONE_DISPLAY = "(704) 261-5942";
export const BUSINESS_PHONE_TEL = "tel:+17042615942";
export const BUSINESS_PHONE_SMS = "sms:+17042615942";
export const BUSINESS_WHATSAPP = "https://wa.me/17042615942";

export const SERVICE_TYPES = [
  { name: "Residential Cleaning", description: "Homes, apartments, and condos — kept spotless on your schedule." },
  { name: "Commercial Cleaning", description: "Offices and small businesses that need a reliably clean space." },
  { name: "Deep Cleaning", description: "A top-to-bottom detailed clean for move-ins, move-outs, or a fresh start." },
  { name: "Partial Cleaning", description: "Focused cleaning for the specific rooms or areas that need it most." },
] as const;

export const FREQUENCIES = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "One Time"] as const;

export const SERVICE_AREAS = [
  "Marshville",
  "Monroe",
  "Waxhaw",
  "Indian Trail",
  "Wingate",
  "Matthews",
  "Charlotte",
] as const;

export const MESSAGE_MIN_LENGTH = 30;
export const MESSAGE_MAX_LENGTH = 500;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/contact", label: "Contact" },
] as const;
