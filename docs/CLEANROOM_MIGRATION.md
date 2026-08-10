# Cleanroom → Publish Repo Migration

## Strategy
Use `s2s-frontend-s2s-website` (Next.js + Vercel) as the deploy vessel.
Replace the public front end with the cleanroom editorial site.
Preserve Stripe Authors Edition checkout and webhooks.

## Done in this pass
- Copied cleanroom assets into `public/assets/`
- Ported cleanroom CSS to `styles/cleanroom.css`
- Added cleanroom shell: `SiteHeader`, `SiteFooter`, `SiteInteractions`
- Public routes live:
  - `/` home
  - `/book-one`
  - `/s2s`
  - `/inquiry`
  - `/orbs`
  - `/gigi`
- Book One purchase links to `/order/direct` (Stripe) + Amazon
- Redirects from old public routes (`/books`, `/about-gigi`, etc.)
- Kept `/api/checkout`, `/api/webhooks/stripe`, `/order/*`, privacy/terms

## Still steward / ops
- Set Vercel env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_FORM_ACTION`
- Confirm Stripe webhook endpoint still points at production `/api/webhooks/stripe`
- Restyle `/order` and `/order/direct` into cleanroom visual language (currently still Tailwind commerce UI)
- Decide whether old page files under `/about`, `/books`, `/source-field`, etc. should be deleted now that redirects exist
- Push to `main` when ready for Vercel production deploy

## Note
Direct checkout is **Stripe**, not Square.
