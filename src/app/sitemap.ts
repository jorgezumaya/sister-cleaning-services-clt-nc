import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { NAV_LINKS } from "@/lib/constants";

// Required for the GitHub Pages static export (output: "export") — without
// this, Next treats the route as dynamic and the export build fails.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV_LINKS.map(link => ({
    url: `${SITE_URL}${link.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: link.href === "/" ? 1 : 0.7,
  }));
}
