import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Required for the GitHub Pages static export (output: "export") — without
// this, Next treats the route as dynamic and the export build fails.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
