import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No ISR/on-demand revalidation on this site (all pages are static or
// request-time dynamic), so no incrementalCache override — and no R2 bucket
// to provision — is needed. See https://opennext.js.org/cloudflare/caching.
export default defineCloudflareConfig();
