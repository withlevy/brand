# Archived — previous `brand` repo (The Levy Network site)

This directory preserves the **entire previous contents of the `brand`
repository** exactly as they were before this repo was synced to mirror
[`withlevy/Levy-Website`](https://github.com/withlevy/Levy-Website).

It was the full **Astro** site for *The Levy Network* — the membership
network site, including its component library, page routes, member
dashboards, Outseta auth/billing integration, and Helvetica Neue brand
fonts.

Nothing was deleted during the sync: the current brand content was moved
here (with git history intact) so it remains recoverable. The repo root now
mirrors the content of `Levy-Website`.

> Note: this is distinct from the root-level [`../archive`](../archive)
> directory, which is `Levy-Website`'s own archive of *its* previous Astro
> site.

## Bringing this site back

The app is self-contained under this directory. To run it, copy this
folder's contents to a fresh checkout root and use its own tooling:

```bash
npm install
npm run dev      # or: npm run build
```

See `astro.config.mjs`, `package.json`, and `wrangler.toml` in this folder
for the exact build/deploy configuration.
