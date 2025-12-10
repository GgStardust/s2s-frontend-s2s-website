# Vercel Deployment Fix

## Current Error
```
The specified Root Directory "frontend" does not exist.
```

## Problem
Your Vercel project is:
1. Connected to the wrong repository: `GgStardust/s2s-cms` (should be `GgStardust/s2s-frontend-s2s-website`)
2. Has Root Directory set to `frontend` (should be empty `/`)

## Solution

### Step 1: Update Vercel Project Settings

1. Go to **Vercel Dashboard** → Your project
2. Click **Settings** → **General**
3. **Update Repository:**
   - Click "..." next to the repository name
   - Select "Disconnect"
   - Click "Connect Git Repository"
   - Search for and select: `GgStardust/s2s-frontend-s2s-website`
   - Click "Connect"

4. **Update Root Directory:**
   - Find "Root Directory" setting
   - **Clear it completely** (leave it empty)
   - Or set it to: `/` (just a forward slash)
   - Click "Save"

5. **Verify Framework:**
   - Framework should auto-detect as "Next.js"
   - If not, select "Next.js"

6. **Build Settings** (should auto-detect, but verify):
   - Build Command: `npm run build` (or leave default)
   - Output Directory: `.next` (or leave default)
   - Install Command: `npm install` (or leave default)

### Step 2: Redeploy

After saving settings:
- Go to **Deployments** tab
- Click "Redeploy" on the latest deployment, OR
- Make a small commit and push to trigger a new deployment

## Alternative: Create New Project

If updating the existing project is problematic:

1. **Create New Project** in Vercel
2. **Import:** `GgStardust/s2s-frontend-s2s-website`
3. **Root Directory:** Leave empty (or `/`)
4. **Framework:** Next.js (auto-detected)
5. **Deploy**

Then update your domain to point to the new project.

## Verification

After fixing, the build should:
- ✅ Clone from `s2s-frontend-s2s-website` repository
- ✅ Use root directory `/` (no subdirectory)
- ✅ Build successfully
- ✅ Deploy to `stardusttosovereignty.com`
