# Quick Test Guide for Fixed Endpoints

## Prerequisites

1. **Start CMS_Backend:**
   ```bash
   cd CMS_Backend
   npm run dev
   ```
   Server should start on `http://localhost:3000`

2. **Verify Environment Variables:**
   Check that `.env.local` has:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (required for `/api/ai/conversation`)

3. **Build Dependencies (if needed):**
   ```bash
   # From monorepo root
   cd RBI-Kernel && npm run build && cd ..
   cd Orbital-Brain && npm run build && cd ..
   ```

## Running Tests

### Option 1: Automated Test Script
```bash
cd CMS_Backend
./test-fixed-endpoints.sh
```

### Option 2: Manual Testing

#### Test 1: `/api/console/content`
```bash
curl http://localhost:3000/api/console/content
```

**Expected:** HTTP 200 with JSON response containing `success: true` and `data` array

**With filters:**
```bash
curl "http://localhost:3000/api/console/content?console_view=ScrollStream"
```

#### Test 2: `/api/manuscript/current`
```bash
curl http://localhost:3000/api/manuscript/current
```

**Expected:** HTTP 200 with JSON response containing `chapters` array, OR HTTP 404 if manuscript not found

#### Test 3: `/api/ai/conversation`
```bash
curl -X POST http://localhost:3000/api/ai/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "Why do I feel disconnected?" }
    ],
    "currentContent": "",
    "title": "",
    "orbContext": null
  }'
```

**Expected:** HTTP 200 with JSON response containing:
- `content` - AI response text
- `rbi_output` - RBI analysis data
- `orbital_interpretation` - Orbital Brain interpretation

## Troubleshooting

### `/api/console/content` returns 500
- Check Supabase connection
- Verify `content_files` table exists
- Check CMS_Backend logs for specific error

### `/api/manuscript/current` returns 404
- Verify manuscript file exists at:
  - `CMS_Backend/09_PROCESSED/02g_generated_book_content/STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md`
- OR check if it's in Supabase `content_files` table with `content_type = 'book_output'`

### `/api/ai/conversation` returns 500
- Check `OPENAI_API_KEY` is set in `.env.local`
- Verify RBI-Kernel is built: `cd RBI-Kernel && npm run build`
- Verify Orbital-Brain is built: `cd Orbital-Brain && npm run build`
- Check CMS_Backend logs for specific error message

## Expected Response Formats

### `/api/console/content`
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "...",
      "content": "...",
      "orb_associations": [1, 2],
      ...
    }
  ],
  "metadata": {
    "count": 10,
    "filters": {...}
  }
}
```

### `/api/manuscript/current`
```json
{
  "success": true,
  "source": "file",
  "metadata": {
    "title": "Stardust to Sovereignty",
    "author": "Gigi Stardust",
    ...
  },
  "chapters": [
    {
      "chapter_number": 1,
      "title": "Chapter 1: ...",
      "content": "...",
      "type": "chapter",
      ...
    }
  ],
  "total_chapters": 20
}
```

### `/api/ai/conversation`
```json
{
  "content": "AI response text...",
  "rbi_output": {
    "resonanceVector": { "x": 0.5, "y": 0.3, "z": 0.7, "w": 0.4 },
    "mathematical": {...},
    ...
  },
  "orbital_interpretation": {
    "primary_orb": { "id": 1, "name": "Origin Intelligence", "score": 0.85 },
    "narrative_coherence": 0.92,
    ...
  },
  ...
}
```

