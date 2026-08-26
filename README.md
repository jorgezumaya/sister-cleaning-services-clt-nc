# Sisters Cleaning Service

This repo is for the website owned by Sisters Cleaning Service, located in the greater
Charlotte, NC (CLT) area — Marshville, Monroe, Waxhaw, Indian Trail, and nearby towns.

Next.js (App Router) + Tailwind CSS, deployed to Cloudflare Workers.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values described below
npm run dev
```

## Pages

- `/` — Home
- `/services` — Services offered + frequency options
- `/gallery` — Recent-work photo carousel
- `/about` — About the business
- `/service-areas` — Cities served
- `/contact` — Quote request form + call/text/WhatsApp/email buttons

## Contact form (email delivery)

The quote form on `/contact` posts to `src/app/api/contact/route.ts`, which sends the
message via [Resend](https://resend.com). The destination inbox is a **server-only**
env var (`CONTACT_TO_EMAIL`) — it's never present in client-side code, so it isn't
exposed to visitors or scrapers the way a `mailto:` link would be.

Required env vars (see `.env.example`):

- `RESEND_API_KEY` — from your Resend account
- `CONTACT_TO_EMAIL` — where quote requests land (use a dedicated business inbox,
  not a personal address)
- `CONTACT_FROM_EMAIL` — the verified sending address/domain in Resend

The route uses the standard Node.js runtime; deploying to Cloudflare with
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) (the current recommended
adapter — successor to `@cloudflare/next-on-pages`) supports this without edge-only code.

## Photo gallery (Firebase Storage)

`src/components/PhotoGallery.tsx` lists whatever's in the `gallery/` folder of a
Firebase Storage bucket — no database, no redeploy needed. Upload a photo from the
Firebase console (or Google Cloud Storage) and it appears on the site on next load.

Required env vars (all safe to expose to the browser — access is controlled by
Storage security rules, not by hiding these values):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

Set Storage rules to public read / no public write, e.g.:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{fileName} {
      allow read: if true;
      allow write: if false; // upload via the Firebase console instead
    }
  }
}
```

Until these are configured, the gallery shows a "photos coming soon" placeholder
instead of erroring.

## Brand assets

`public/images/hero-illustration.png` is an AI-generated flat-vector cartoon of the
two owners (styled after "Dumb Ways to Die") used on the home and about pages — swap
it for a commissioned illustration or real photography whenever one's ready. The
header currently uses a text + icon wordmark rather than the circular Facebook logo,
since that logo only exists as a phone screenshot — drop in a clean logo file when
available. `src/app/icon.svg` is the browser-tab favicon (a simple sparkle mark in
the brand colors); replace it the same way if a proper logo mark is designed.

## Deploying (Cloudflare)

Deployed as a Cloudflare Worker via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
(config in `wrangler.jsonc` / `open-next.config.ts`):

```bash
npx wrangler login   # one-time, per machine
npm run deploy        # opennextjs-cloudflare build && opennextjs-cloudflare deploy
```

Set the env vars above as secrets/variables on the Worker (dashboard → Worker →
Settings → Variables, or `npx wrangler secret put <NAME>`), and attach the custom
domain under Worker → Settings → Domains & Routes.

`npm run preview` builds and runs the Worker locally against Cloudflare's runtime
(requires Node ≥22 for `wrangler`/`miniflare`).

## CI/CD

`.github/workflows/ci.yml` runs on every push/PR to `main`:

- **`quality` job** — `npm ci`, lint, typecheck, test, build. Runs for every push and PR.
- **`deploy-preview` job** — only on a push to `main` once `quality` passes. Publishes a
  free **GitHub Pages** preview at `https://<owner>.github.io/<repo>/` as a placeholder
  until the real Cloudflare domain is picked.

One-time setup: in the repo's Settings → Pages, set **Source** to **GitHub Actions**
(the workflow handles the rest).

Because GitHub Pages only serves static files, that job builds a **static export**
(`npm run build:pages`, `output: "export"` in `next.config.ts`) with `src/app/api`
removed from the CI checkout first — Next.js static export can't include server API
routes. `ContactForm` detects this at build time (`NEXT_PUBLIC_STATIC_EXPORT`) and
shows a "call or text us" message instead of trying to POST to a route that doesn't
exist there. None of this affects the real `npm run build` used for Cloudflare, which
keeps the working `/api/contact` route.

## SEO

- Per-page `<title>`/description via the App Router `metadata` export, with a shared
  title template (`%s | Sisters Cleaning Service`) in `src/app/layout.tsx`
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `sitemap.xml` / `robots.txt`
- Open Graph + Twitter card metadata, backed by `public/images/og-image.png`
- `LocalBusiness` JSON-LD structured data (name, phone, service areas, Facebook link)
  in the root layout, for richer Google search results
- `NEXT_PUBLIC_SITE_URL` (see `.env.example`) drives all of the above — set it to the
  real domain once it's live; the GitHub Pages workflow sets its own value automatically
