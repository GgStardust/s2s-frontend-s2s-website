# Deployment Guide

## Vercel Deployment (Recommended)

Vercel is the best option because it supports:
- ✅ Node.js/Express serverless functions
- ✅ Static file serving (your UI)
- ✅ API routes
- ✅ Environment variables
- ✅ Free tier with generous limits

### Prerequisites

1. **RBI-Kernel Dependency**: The service depends on `rbi-kernel` which is a local file dependency. You have two options:

   **Option A: Publish RBI-Kernel to npm** (Recommended for production)
   ```bash
   cd ../RBI-Kernel
   npm publish
   ```
   Then update `package.json`:
   ```json
   "rbi-kernel": "^1.0.0"
   ```

   **Option B: Bundle RBI-Kernel** (For quick deployment)
   - Copy RBI-Kernel source into this project
   - Or use a monorepo setup

2. **GitHub Repository**: Push your code to GitHub

### Deployment Steps

1. **Install Vercel CLI** (optional, can use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from CLI**:
   ```bash
   cd RBI-Architecture-Service
   vercel
   ```
   
   Or use the web interface:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Set Environment Variables** (in Vercel dashboard):
   - `RBI_API_KEY` (optional, for production auth)
   - `RATE_LIMIT_MAX_REQUESTS` (optional, default: 100)
   - `RATE_LIMIT_WINDOW_MS` (optional, default: 60000)

4. **Your service will be live at**: `https://your-project.vercel.app`

### Vercel Configuration

The `vercel.json` file is already configured to:
- Build the TypeScript code
- Serve static files from `/public`
- Route all requests to the Express app
- Handle API endpoints

---

## GitHub Pages (Static UI Only)

**Note**: GitHub Pages only serves static files. Your API endpoints won't work.

If you only want to host the demo UI:

1. **Build static version** (if needed)
2. **Push to GitHub**
3. **Enable GitHub Pages** in repository settings
4. **Point to `/public` directory**

**Limitation**: API calls will fail because there's no server. You'd need to point the UI to a hosted API.

---

## Alternative: Railway or Render

Both Railway and Render support Node.js apps and are good alternatives:

### Railway
- Free tier available
- Easy deployment from GitHub
- Supports environment variables
- Good for Node.js apps

### Render
- Free tier available
- Auto-deploy from GitHub
- Supports background workers (for temporal loop)
- Good for Express apps

---

## Quick Deploy Checklist

- [ ] Push code to GitHub
- [ ] Resolve RBI-Kernel dependency (publish to npm or bundle)
- [ ] Set up Vercel account
- [ ] Import repository to Vercel
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test endpoints
- [ ] Update API URLs in UI if needed

---

## Post-Deployment

After deployment, your service will be available at:
- **UI**: `https://your-project.vercel.app/` or `https://your-project.vercel.app/demo.html`
- **API**: `https://your-project.vercel.app/field/score`
- **Health**: `https://your-project.vercel.app/health`

Update any hardcoded `localhost:3001` URLs in your UI to use the Vercel URL.

