# Deploy RBI Demo to Vercel (No Local Ports Needed!)

This guide shows you how to deploy everything to Vercel so you can access it via a public URL instead of localhost.

## Option 1: Deploy RBI Architecture Service to Vercel

### Step 1: Install Vercel CLI (if not already installed)

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy RBI Architecture Service

```bash
cd /Users/gigi/Projects/S2S_RBI_System/RBI-Architecture-Service
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name? (press Enter for default or type a name)
- Directory? (press Enter for `./`)
- Override settings? **No**

### Step 4: Get Your Vercel URL

After deployment, Vercel will give you a URL like:
```
https://rbi-architecture-service.vercel.app
```

**Save this URL!** You'll need it for the TPB frontend.

### Step 5: Update TPB Frontend to Use Vercel URL

Edit the RBI service in TPB frontend:

```typescript
// src/services/rbi.service.ts
const RBI_API_URL = process.env.REACT_APP_RBI_API_URL || 'https://your-rbi-service.vercel.app'
```

Or set environment variable:
```bash
REACT_APP_RBI_API_URL=https://your-rbi-service.vercel.app
```

---

## Option 2: Deploy TPB Frontend to Vercel (Full Demo)

### Step 1: Build TPB Frontend for Production

```bash
cd "/Users/gigi/Downloads/TPB Ecomm FE and BE/ThePeakBeyond_eCommerce"
npm run build
```

### Step 2: Create vercel.json for TPB

Create `vercel.json` in TPB frontend directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Step 3: Deploy TPB Frontend

```bash
cd "/Users/gigi/Downloads/TPB Ecomm FE and BE/ThePeakBeyond_eCommerce"
vercel
```

### Step 4: Set Environment Variable

In Vercel dashboard, go to your project → Settings → Environment Variables:

Add:
```
REACT_APP_RBI_API_URL=https://your-rbi-service.vercel.app
```

Redeploy after adding the variable.

---

## Option 3: Use ngrok (Quick Public Tunnel)

If you want to keep using localhost but make it accessible publicly:

### Step 1: Install ngrok

```bash
brew install ngrok
# Or download from https://ngrok.com
```

### Step 2: Start Your Local Services

```bash
# Terminal 1: RBI Service
cd /Users/gigi/Projects/S2S_RBI_System/RBI-Architecture-Service
npm run dev

# Terminal 2: TPB Frontend  
cd "/Users/gigi/Downloads/TPB Ecomm FE and BE/ThePeakBeyond_eCommerce"
npm start
```

### Step 3: Create Public Tunnels

```bash
# Terminal 3: Tunnel for RBI Service (port 3001)
ngrok http 3001

# Terminal 4: Tunnel for TPB Frontend (port 3000)
ngrok http 3000
```

ngrok will give you public URLs like:
```
https://abc123.ngrok.io  → RBI Service
https://xyz789.ngrok.io  → TPB Frontend
```

### Step 4: Update TPB to Use ngrok URL

Edit `src/services/rbi.service.ts`:
```typescript
const RBI_API_URL = 'https://abc123.ngrok.io'
```

---

## Recommended: Full Vercel Deployment

**Best approach:** Deploy both to Vercel

1. **RBI Architecture Service** → `https://rbi-service.vercel.app`
2. **TPB Frontend** → `https://tpb-demo.vercel.app`

Then:
- No local ports needed
- Accessible from anywhere
- Shareable URLs
- No firewall issues
- Free tier available

---

## Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

echo "Deploying RBI Architecture Service..."
cd /Users/gigi/Projects/S2S_RBI_System/RBI-Architecture-Service
vercel --prod

echo "Deploying TPB Frontend..."
cd "/Users/gigi/Downloads/TPB Ecomm FE and BE/ThePeakBeyond_eCommerce"
npm run build
vercel --prod

echo "Done! Check your Vercel dashboard for URLs."
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Troubleshooting

### Vercel Build Fails

**RBI-Kernel dependency issue:**
- Make sure RBI-Kernel is accessible
- Or bundle it into the project

### TPB Can't Connect to RBI Service

**CORS issue:**
- Add CORS headers in RBI service
- Or deploy both to same Vercel account

### Environment Variables Not Working

- Make sure to redeploy after adding variables
- Check variable names match exactly
- Use Vercel dashboard, not `.env` files

---

## Next Steps

1. Deploy RBI Service to Vercel
2. Get the public URL
3. Update TPB frontend to use that URL
4. Deploy TPB frontend to Vercel
5. Share the public URL with anyone!

No more localhost struggles! 🎉

