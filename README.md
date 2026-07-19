# Levy

A minimal, single-page site. The entire site is one self-contained file:
[`index.html`](./index.html) (all CSS inline; typefaces from Google Fonts).

## Develop

Open `index.html` directly in a browser — there is no build step for editing.

## Deploy (Cloudflare)

Deployment matches the previous host (Cloudflare Workers, `wrangler`), but the
site is now **static** — there is no SSR worker. The build simply stages the
single HTML file into `dist/`, which Cloudflare serves as static assets.

```bash
npm install       # installs wrangler
npm run deploy    # builds dist/ and runs `wrangler deploy`
```

- `npm run build` → copies `index.html` into `dist/`
- `wrangler.jsonc` → serves `dist/` as static assets (no `main` worker)

## The previous site (archived — nothing was deleted)

The prior site was a full **Astro SSR app** (multi-page, Outseta auth,
member area). It could not be frozen into a static subpath without breaking its
dynamic/auth features, so it is preserved as a complete, independently
deployable app in two places:

1. **Branch `archive/full-astro-site`** — the previous site at repo root,
   exactly as it was, ready to `npm install && npm run build && wrangler deploy`.
2. **[`/archive`](./archive) directory** — the same app on this branch, so
   nothing is lost in the working tree. See [`archive/README.md`](./archive/README.md).

To bring the old version back online, deploy either copy (optionally to a
subdomain such as `legacy.withlevy.com` or a preview URL) — see
`archive/README.md` for exact commands.
