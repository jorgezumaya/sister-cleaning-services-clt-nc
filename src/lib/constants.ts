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
export const BUSINESS_FACEBOOK = "https://www.facebook.com/share/1FAUqvC3sZ/?mibextid=wwXIfr";

// Display text for these lives in src/i18n/{en,es}.json (serviceTypes.<key>,
// frequencies.<key>) — these arrays are just the stable identifiers used to
// look translations up, plus the English fallback used in server-only
// metadata (JSON-LD, OG description) where translation doesn't apply.
export const SERVICE_TYPES = [
  { key: "residential", name: "Residential Cleaning", description: "Homes, apartments, and condos — kept spotless on your schedule." },
  { key: "commercial", name: "Commercial Cleaning", description: "Offices and small businesses that need a reliably clean space." },
  { key: "deep", name: "Deep Cleaning", description: "A top-to-bottom detailed clean for move-ins, move-outs, or a fresh start." },
  { key: "partial", name: "Partial Cleaning", description: "Focused cleaning for the specific rooms or areas that need it most." },
] as const;

export const FREQUENCIES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "biWeekly", label: "Bi-Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "oneTime", label: "One Time" },
] as const;

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
export const NAME_MAX_LENGTH = 100;
export const PHONE_MAX_LENGTH = 30;
export const ADDRESS_MAX_LENGTH = 200;

// Anti-spam: reject a submission that arrives faster than a human could
// plausibly have filled out every field. The form records its own render
// time in a hidden field — see ContactForm.tsx and api/contact/route.ts.
export const MIN_SUBMIT_SECONDS = 3;

export const NAV_LINKS = [
  { href: "/", key: "home", label: "Home" },
  { href: "/services", key: "services", label: "Services" },
  { href: "/gallery", key: "gallery", label: "Gallery" },
  { href: "/about", key: "about", label: "About" },
  { href: "/service-areas", key: "serviceAreas", label: "Service Areas" },
  { href: "/contact", key: "contact", label: "Contact" },
] as const;
