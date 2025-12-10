# Setup Instructions for Standalone Website Repository

## Repository is Ready Locally ✅

The website has been initialized as a standalone git repository with:
- All website files committed
- Remote configured for: `https://github.com/GgStardust/s2s-frontend-s2s-website.git`
- Branch set to `main`

## Next Steps

### 1. Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to https://github.com/new
2. Repository name: `s2s-frontend-s2s-website`
3. Owner: `GgStardust`
4. Description: "Stardust to Sovereignty website - preorder MVP"
5. Set to **Public** or **Private** (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

**Option B: Via GitHub CLI** (if installed)
```bash
gh repo create s2s-frontend-s2s-website --public --description "Stardust to Sovereignty website - preorder MVP"
```

### 2. Push to GitHub

Once the repository is created on GitHub, run:

```bash
cd /Users/gigi/Projects/S2S_RBI_System/s2s-frontend/s2s-website
git push -u origin main
```

### 3. Connect to Vercel

1. Go to Vercel Dashboard
2. **Add New Project** (or update existing `s2s-frontend` project)
3. **Import Git Repository**: `GgStardust/s2s-frontend-s2s-website`
4. **Configure Project:**
   - Root Directory: `/` (leave empty, it's the root)
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
5. **Environment Variables** (optional):
   - `NEXT_PUBLIC_GA_ID` - Add when you have your Google Analytics ID
6. **Deploy**

### 4. Verify Deployment

After deployment:
- ✅ Check build logs for any errors
- ✅ Visit `stardusttosovereignty.com` to verify site is live
- ✅ Test preorder form
- ✅ Test all navigation links
- ✅ Verify mobile responsiveness

## Repository Structure

```
s2s-frontend-s2s-website/
├── app/              # Next.js pages
├── components/        # React components
├── public/           # Static assets
├── package.json      # Dependencies
├── vercel.json       # Vercel configuration
└── README.md         # Project documentation
```

## Future Updates

To update the website:
```bash
cd /Users/gigi/Projects/S2S_RBI_System/s2s-frontend/s2s-website
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically deploy on push to `main` branch.

