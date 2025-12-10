# Vercel Deployment Fix Guide

## Issue
Vercel deployments are failing. The project appears to be connected to the wrong repository or has incorrect root directory settings.

## Solution

### Option 1: Update Existing Vercel Project (Recommended)

1. **Go to Vercel Dashboard** → Your project (`s2s-frontend`)
2. **Settings** → **General**
3. **Update Repository Connection:**
   - Repository: `GgStardust/s2s-cms-backend-clean`
   - Root Directory: `s2s-frontend/s2s-website`
   - Framework Preset: Next.js
   - Build Command: `npm run build` (or leave default)
   - Output Directory: `.next` (or leave default)
   - Install Command: `npm install` (or leave default)

4. **Environment Variables** (if needed):
   - `NEXT_PUBLIC_GA_ID` (optional, for analytics)

5. **Redeploy** after saving settings

### Option 2: Create New Vercel Project

1. **Import New Project** in Vercel
2. **Connect Repository:** `GgStardust/s2s-cms-backend-clean`
3. **Configure:**
   - Root Directory: `s2s-frontend/s2s-website`
   - Framework: Next.js
4. **Deploy**

## Common Issues & Fixes

### Issue: "Cannot find module" errors
**Fix:** Ensure Root Directory is set to `s2s-frontend/s2s-website`

### Issue: "Build command failed"
**Fix:** 
- Build Command: `npm run build`
- Install Command: `npm install`
- Node.js Version: 18.x or 20.x (in Settings → General)

### Issue: "Repository not found"
**Fix:** 
- Verify repository name: `GgStardust/s2s-cms-backend-clean`
- Ensure Vercel has access to the repository
- Check GitHub integration permissions

### Issue: "Path does not exist"
**Fix:**
- Root Directory must be: `s2s-frontend/s2s-website`
- Not: `s2s-frontend/s2s-website/` (no trailing slash)
- Not: `s2s-website` (missing parent directory)

## Verification

After configuration, the build should:
1. ✅ Install dependencies from `s2s-frontend/s2s-website/package.json`
2. ✅ Run `npm run build` successfully
3. ✅ Deploy to `stardusttosovereignty.com`

## Branch Strategy

- **Production:** Deploy from `main` branch (or `feature/diagnostic-8q-clean` for testing)
- **Preview:** All other branches create preview deployments

## Next Steps

1. Update Vercel project settings
2. Trigger a new deployment
3. Check build logs if it still fails
4. Share error message if issues persist
