import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n";
import {
  BUSINESS_NAME,
  BUSINESS_CITY,
  BUSINESS_TAGLINE,
  BUSINESS_PHONE_TEL,
  BUSINESS_FACEBOOK,
  SERVICE_AREAS,
} from "@/lib/constants";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  `${BUSINESS_TAGLINE}. Affordable residential and commercial house cleaning services in ` +
  `${BUSINESS_CITY} and the greater Charlotte, NC area, including ${SERVICE_AREAS.slice(1).join(", ")}. ` +
  `Daily, weekly, bi-weekly, monthly, or one-time cleanings — get a free quote today.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS_NAME} | House Cleaning in ${BUSINESS_CITY}`,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "house cleaning Marshville NC",
    "cleaning service Charlotte NC",
    "residential cleaning Monroe NC",
    "commercial cleaning Waxhaw NC",
    "deep cleaning service",
    "maid service greater Charlotte",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: BUSINESS_NAME,
    title: `${BUSINESS_NAME} | House Cleaning in ${BUSINESS_CITY}`,
    description: DESCRIPTION,
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: BUSINESS_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_NAME} | House Cleaning in ${BUSINESS_CITY}`,
    description: DESCRIPTION,
    images: ["/images/og-image.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BUSINESS_NAME,
  description: DESCRIPTION,
  telephone: BUSINESS_PHONE_TEL.replace("tel:", ""),
  url: SITE_URL,
  image: `${SITE_URL}/images/og-image.png`,
  sameAs: [BUSINESS_FACEBOOK],
  areaServed: SERVICE_AREAS.map(area => ({ "@type": "City", name: `${area}, NC` })),
  address: {
    "@type": "PostalAddress",
    addressLocality: BUSINESS_CITY.split(",")[0],
    addressRegion: "NC",
    addressCountry: "US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
