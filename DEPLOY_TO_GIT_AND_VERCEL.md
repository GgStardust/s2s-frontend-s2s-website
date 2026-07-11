# Pushing the Website to Git and Vercel

The live site is **not** on the main monorepo remote. It deploys from:

- **Repo:** [GgStardust/s2s-frontend-s2s-website](https://github.com/GgStardust/s2s-frontend-s2s-website)
- **Remote name (in this repo):** `s2s-website`
- **Branch Vercel uses:** `main`

This repo is website-only (app at root). Our code lives in the monorepo under `s2s-frontend/s2s-website/`, so we push only that folder using **subtree push**.

## When you’ve updated the website locally

From the **monorepo root** (`S2S_RBI_System/`):

1. Commit your website changes (if any).
2. Run:
   ```bash
   git subtree push --prefix=s2s-frontend/s2s-website s2s-website main
   ```
3. That updates `main` on GgStardust/s2s-frontend-s2s-website; Vercel will deploy from there.

## Remotes (for reference)

- `origin` → s2s-cms-backend-clean (monorepo; CMS, console, etc.)
- `s2s-website` → s2s-frontend-s2s-website (website-only; used for Vercel)

Do **not** push the whole branch to `s2s-website` — that would put the monorepo in the website repo. Always use the subtree command above.
