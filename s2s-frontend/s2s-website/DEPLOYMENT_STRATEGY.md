# Deployment Strategy for S2S Website

## Current State

- **Website Location:** `s2s-frontend/s2s-website/`
- **Current Branch:** `feature/diagnostic-8q-clean`
- **Status:** Website is untracked (new directory)
- **Console Integration:** Will connect later via API calls

## Deployment Approach

### Option 1: Separate Vercel Project (Recommended)

**Why:** Clean separation between website and console backend
- Website is static/marketing site (no backend dependencies)
- Console backend is separate (CMS_Backend)
- Easier to manage deployments independently
- Website can deploy without affecting console

**Steps:**
1. Commit website changes to current branch
2. Push to GitHub
3. Create new Vercel project for `s2s-frontend/s2s-website`
4. Configure root directory: `s2s-frontend/s2s-website`
5. Deploy

### Option 2: Monorepo Single Project

**Why:** Everything in one place
- Single Vercel project
- Shared deployment pipeline
- More complex configuration

**Steps:**
1. Commit all changes
2. Configure Vercel to build from `s2s-frontend/s2s-website`
3. Deploy

## Recommended Commit Strategy

### Phase 1: Website Deployment (Now)

```bash
# 1. Stage only website files
git add s2s-frontend/s2s-website/

# 2. Commit with clear message
git commit -m "feat: Add S2S website - preorder MVP ready for deployment

- Complete website with preorder functionality
- Console 'Coming Soon' page
- Legal pages (Privacy, Terms)
- SEO optimization (structured data, sitemap)
- Form validation and error handling
- Responsive design with terminator-border styling
- Book cover integration
- Analytics setup ready
- Author bio (Option 1)"

# 3. Push to current branch
git push origin feature/diagnostic-8q-clean

# 4. Optionally merge to main for production
git checkout main
git merge feature/diagnostic-8q-clean
git push origin main
```

### Phase 2: Console Integration (Later)

When console is ready:
- Website will call console APIs via `NEXT_PUBLIC_CMS_BACKEND_URL`
- No website redeployment needed (just env var update)
- Console deploys separately

## Vercel Configuration

### For Website (s2s-frontend/s2s-website)

**Root Directory:** `s2s-frontend/s2s-website`
**Framework:** Next.js
**Build Command:** `npm run build` (or `pnpm build`)
**Output Directory:** `.next`
**Install Command:** `npm install` (or `pnpm install`)

### Environment Variables Needed

**For Website:**
- `NEXT_PUBLIC_GA_ID` (optional, for analytics)

**For Future Console Integration:**
- `NEXT_PUBLIC_CMS_BACKEND_URL` (when console is ready)

## Pre-Deployment Checklist

- [x] All pages styled consistently
- [x] Legal pages added (Privacy, Terms)
- [x] SEO optimized (structured data, sitemap)
- [x] Forms validated and error-handled
- [x] Console "Coming Soon" page complete
- [x] Book cover image in place
- [x] Author bio added
- [x] Mobile responsive (needs testing)
- [ ] Analytics ID configured (optional)
- [ ] OG image created (optional)

## Post-Deployment

1. **Test on production domain**
2. **Verify all forms work**
3. **Check mobile responsiveness**
4. **Test social sharing (OG tags)**
5. **Monitor Formspree submissions**
6. **Set up analytics (if using)**

## Future Console Integration

When ready to connect:
1. Add `NEXT_PUBLIC_CMS_BACKEND_URL` to Vercel env vars
2. Update website API calls to use console endpoints
3. No website redeployment needed (just env var)

## Branch Strategy

**Current:** `feature/diagnostic-8q-clean`
**Recommendation:** 
- Deploy from this branch first (test)
- Then merge to `main` for production
- Or create `production` branch for website-only deployments
