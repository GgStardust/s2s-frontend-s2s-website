# Quick Start Guide - S2S Console Not Loading

## Problem Diagnosis

If the Console is not loading content, check these in order:

### 1. **CMS_Backend Not Running** (Most Common)

**Check:**
```bash
curl http://localhost:4000/api/health-check
```

**If it fails, start CMS_Backend:**
```bash
cd CMS_Backend
pnpm dev
```

**Expected output:**
- Server should start on `http://localhost:4000`
- You should see: `✓ Ready in X.Xs`

---

### 2. **Environment Variables Not Set**

**Check CMS_Backend/.env.local:**
```bash
cat CMS_Backend/.env.local | grep -E "^(NEXT_PUBLIC_SUPABASE_URL|OPENAI_API_KEY)="
```

**Required variables:**
- `NEXT_PUBLIC_SUPABASE_URL` ✅ (should be set)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ (should be set)
- `SUPABASE_SERVICE_ROLE_KEY` ✅ (should be set)
- `OPENAI_API_KEY` ✅ (should be set)

**Check S2S_Console/.env.local:**
```bash
cat S2S_Console/.env.local
```

**Required:**
- `NEXT_PUBLIC_CMS_BACKEND_URL=http://localhost:4000` ✅ (should be set)

---

### 3. **Supabase Database Empty**

**The Console queries `content_files` table with `status = 'active'`**

**Check if database has content:**
- Go to Supabase Dashboard
- Check `content_files` table
- Verify there are rows with `status = 'active'`

**If empty, import content:**
```bash
cd CMS_Backend
# Check scripts/ directory for import scripts
ls scripts/import*.ts
```

---

### 4. **Browser Console Errors**

**Open browser DevTools (F12) → Console tab**

**Look for:**
- `Failed to fetch` → CMS_Backend not running or wrong URL
- `CORS error` → CORS not configured in CMS_Backend
- `404` → API endpoint missing
- `[codexLoader] Error loading Codex content:` → API call failed

**Network Tab:**
- Check if requests to `http://localhost:4000/api/console/content` are failing
- Check response status codes (should be 200)

---

## Step-by-Step Fix

### Step 1: Start CMS_Backend
```bash
cd /Users/gigi/Projects/S2S_RBI_System/CMS_Backend
pnpm dev
```

**Wait for:**
```
✓ Ready in 2.3s
○ Local:        http://localhost:4000
```

### Step 2: Verify CMS_Backend is Working
```bash
# In a new terminal
curl http://localhost:4000/api/console/content
```

**Expected:** JSON response with `{ success: true, data: [...] }`

**If empty array `[]`:** Database has no content (see Step 3)

### Step 3: Check Database Content
```bash
# Test the API endpoint
curl http://localhost:4000/api/console/content | jq '.metadata.count'
```

**If count is 0:** You need to import content to Supabase

### Step 4: Start S2S_Console
```bash
# In a new terminal
cd /Users/gigi/Projects/S2S_RBI_System/S2S_Console
pnpm dev
```

**Wait for:**
```
✓ Ready in 1.2s
○ Local:        http://localhost:5001
```

### Step 5: Open Browser
1. Go to `http://localhost:5001` (or port shown in console)
2. Open DevTools (F12) → Console tab
3. Look for errors
4. Check Network tab for API calls

---

## Common Issues & Solutions

### Issue: "Failed to fetch"
**Solution:** CMS_Backend not running. Start it first.

### Issue: "CORS error"
**Solution:** Check `CMS_Backend/lib/cors.ts` allows `http://localhost:5001`

### Issue: Empty content array
**Solution:** Database is empty. Import content using import scripts.

### Issue: "Connection refused"
**Solution:** 
- Check CMS_Backend is running on port 4000
- Check `NEXT_PUBLIC_CMS_BACKEND_URL` in S2S_Console/.env.local

### Issue: Port already in use
**Solution:**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

---

## Verification Checklist

- [ ] CMS_Backend running on port 4000
- [ ] `curl http://localhost:4000/api/console/content` returns JSON
- [ ] S2S_Console running on port 5001 (or configured port)
- [ ] `NEXT_PUBLIC_CMS_BACKEND_URL=http://localhost:4000` in S2S_Console/.env.local
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls to port 4000
- [ ] Supabase `content_files` table has rows with `status = 'active'`

---

## Quick Test Commands

```bash
# Test CMS_Backend health
curl http://localhost:4000/api/health-check

# Test console content endpoint
curl http://localhost:4000/api/console/content

# Test orbital personalities
curl http://localhost:4000/api/orbital/personalities

# Check what's running on ports
lsof -i :4000 -i :5001
```

---

**Last Updated:** 2025-01-XX  
**Port Configuration:** CMS_Backend: 4000, S2S_Console: 5001














