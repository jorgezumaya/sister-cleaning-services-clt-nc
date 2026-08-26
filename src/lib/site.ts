// Central source of truth for the deployed site's base URL, used by
// metadataBase, sitemap.ts, robots.ts, and JSON-LD structured data.
//
// - Local dev / default: http://localhost:3000
// - Cloudflare production: set NEXT_PUBLIC_SITE_URL once the domain is picked
// - GitHub Pages preview: set by the deploy workflow to the pages.dev-style URL
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

// Derived from SITE_URL rather than a separate env var, so it always agrees
// with `basePath` in next.config.ts: "" for Cloudflare/local (root domain),
// "/repo-name" for the GitHub Pages project-site preview. next/image's
// `unoptimized` mode (required for static export) doesn't auto-prefix local
// image `src`s with basePath the way next/link and the metadata-file routes
// do, so components reference local /public images through withBasePath().
export const BASE_PATH = (() => {
  try {
    return new URL(SITE_URL).pathname.replace(/\/$/, "");
  } catch {
    return "";
  }
})();

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
