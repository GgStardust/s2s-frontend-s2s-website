# Testing Instructions

**Date:** 2025-01-XX  
**Purpose:** Verify monorepo setup and AI API centralization

---

## ✅ Step 1: Verify Monorepo Setup

```bash
cd /Users/gigi/Projects/S2S_RBI_System

# Check pnpm version
pnpm --version
# Should show: 8.15.0

# Verify all packages are linked
pnpm list --depth=0
# Should show all workspace packages
```

---

## ✅ Step 2: Test AI API Centralization

### Test 1: Verify Orbital-Brain Builds

```bash
cd Orbital-Brain
pnpm build
# Should compile without errors
```

### Test 2: Verify CMS_Backend Can Import

```bash
cd CMS_Backend
pnpm build
# Should compile without errors
# Check for any import errors related to orbital-brain
```

### Test 3: Test Conversation API (Manual)

1. **Start CMS_Backend:**
   ```bash
   cd CMS_Backend
   pnpm dev
   # Server should start on http://localhost:3000
   ```

2. **Test API endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/ai/conversation \
     -H "Content-Type: application/json" \
     -d '{
       "messages": [
         {"role": "user", "content": "What is resonance?"}
       ]
     }'
   ```

3. **Expected:** Should return JSON with:
   - `content` (AI response)
   - `metadata`
   - `rbi_output`
   - `orbital_interpretation`

### Test 4: Test Content Analysis

```bash
curl -X POST http://localhost:3000/api/ai/process-content \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test content about sovereignty and resonance.",
    "title": "Test Content"
  }'
```

### Test 5: Test Semantic Search

```bash
curl "http://localhost:3000/api/search/semantic?q=resonance&limit=5"
```

---

## ✅ Step 3: Test Console Connection

1. **Start CMS_Backend** (if not already running):
   ```bash
   cd CMS_Backend
   pnpm dev
   ```

2. **Start S2S_Console:**
   ```bash
   cd S2S_Console
   pnpm dev
   # Server should start on http://localhost:5001
   ```

3. **Test in Browser:**
   - Open http://localhost:5001
   - Try the Inquiry Interface
   - Submit a question
   - Verify it calls CMS_Backend API (check Network tab)
   - Verify response is displayed

4. **Check Console Logs:**
   - Should see API calls to `http://localhost:3000/api/ai/conversation`
   - Should NOT see any direct RBI imports or errors

---

## ✅ Step 4: Verify Environment Variables

**Check CMS_Backend has .env file:**
```bash
cd CMS_Backend
cat .env.local | grep OPENAI_API_KEY
# Should show your API key (or check .env)
```

**If missing:**
```bash
# Create .env.local if it doesn't exist
echo "OPENAI_API_KEY=your-key-here" >> .env.local
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'orbital-brain'"
**Solution:** 
```bash
cd /Users/gigi/Projects/S2S_RBI_System
pnpm install
cd Orbital-Brain
pnpm build
```

### Error: "OPENAI_API_KEY is not set"
**Solution:** 
- Check `.env.local` or `.env` in CMS_Backend
- Make sure file exists and has `OPENAI_API_KEY=...`

### Error: "Module not found" in Console
**Solution:**
- Console should NOT import RBI-Kernel directly
- If you see this, check for any remaining `import 'rbi-kernel'` statements

### API Returns 500 Error
**Solution:**
- Check CMS_Backend logs for error details
- Verify OpenAI API key is valid
- Check that Orbital-Brain built successfully

---

## ✅ Success Criteria

**All tests pass when:**
- ✅ pnpm install works without errors
- ✅ Orbital-Brain builds successfully
- ✅ CMS_Backend builds successfully
- ✅ Conversation API returns valid response
- ✅ Console can call CMS_Backend API
- ✅ No direct RBI imports in Console
- ✅ OpenAI API key is read correctly

---

**Next:** After testing, continue with Sandbox metadata parsers implementation.

