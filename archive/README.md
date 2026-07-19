# Archived site — Levy (Astro SSR)

This directory is a complete, untouched copy of the **previous** Levy website:
a full [Astro](https://astro.build) app rendered server-side on Cloudflare
Workers, with Outseta authentication, a member area, events, newsroom, and
pricing. It was replaced at the repo root by a minimal one-page site, but
nothing here was deleted.

The identical snapshot also lives on the branch **`archive/full-astro-site`**
(there it sits at the repo root rather than under `archive/`).

## Run it locally

```bash
cd archive
npm install
npm run dev        # http://localhost:4321
```

## Redeploy it (Cloudflare Workers)

The app is SSR, so it needs its own Worker deploy — it cannot be served as a
static subpath of the new site. Deploy it to a subdomain or preview URL:

```bash
cd archive
npm install
npm run build
npx wrangler deploy            # deploys the Worker in wrangler.jsonc
```

To keep it separate from the live one-page site, deploy it under a different
Worker name / route (e.g. `legacy.withlevy.com`): change `name` in
`archive/wrangler.jsonc` before deploying, or pass `--name levy-website-legacy`.
