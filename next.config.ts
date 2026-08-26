import type { NextConfig } from "next";

// Set by the GitHub Pages workflow only — the default `next build` (used for
// the real Cloudflare deploy) stays a normal server build with working API
// routes. GitHub Pages can only serve static files, so that build instead
// produces a static export with no /api/contact route (see README).
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const repoName = "sister-cleaning-services-clt-nc";

const nextConfig: NextConfig = {
  ...(isGithubPagesBuild && {
    output: "export",
    basePath: `/${repoName}`,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
