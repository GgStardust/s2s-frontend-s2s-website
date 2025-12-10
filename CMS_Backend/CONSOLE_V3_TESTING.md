# Console V3 Endpoint Testing Guide

## Prerequisites

### 1. Database Migration

The Console V3 tables must be created before testing. Run the migration:

**Option A: Via Supabase Dashboard (Recommended)**
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250126_console_v3_diagnostic_system.sql`
4. Execute the SQL

**Option B: Check Migration Status**
```bash
cd CMS_Backend
tsx scripts/run-console-v3-migration.ts
```

This will:
- Check which tables exist
- Display the migration SQL if needed
- Provide instructions for manual migration

### 2. Start Backend Server

```bash
cd CMS_Backend
npm run dev
```

Server should start on `http://localhost:4000`

### 3. Verify Environment Variables

Ensure `.env.local` has:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Testing Endpoints

### Automated Test Script

```bash
cd CMS_Backend
./test-console-v3-endpoints.sh
```

### Manual Testing

#### 1. GET /api/console/v3/questions

Fetch all diagnostic questions:

```bash
curl http://localhost:4000/api/console/v3/questions
```

**Expected Response:**
```json
{
  "questions": [
    {
      "id": "...",
      "slug": "...",
      "text": "...",
      "response_type": "scale",
      "question_order": 1,
      ...
    }
  ]
}
```

#### 2. POST /api/console/v3/sessions

Start a new diagnostic session:

```bash
curl -X POST http://localhost:4000/api/console/v3/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Expected Response:**
```json
{
  "session_id": "uuid-here",
  "questions": [...]
}
```

#### 3. POST /api/console/v3/sessions/[id]/responses

Submit a response to a question:

```bash
curl -X POST http://localhost:4000/api/console/v3/sessions/SESSION_ID/responses \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": "QUESTION_ID",
    "answer": "3"
  }'
```

**Expected Response:**
```json
{
  "response_id": "uuid-here",
  "next_question": {...},
  "is_complete": false
}
```

#### 4. POST /api/console/v3/sessions/[id]/complete

Complete the diagnostic and compute results:

```bash
curl -X POST http://localhost:4000/api/console/v3/sessions/SESSION_ID/complete
```

**Expected Response:**
```json
{
  "session": {...},
  "result": {
    "sfi": {
      "score": 75.5,
      "state": "aligned_momentum",
      "orb_profile": {...},
      "undercurrent_profile": {...}
    },
    "readiness": {
      "foundational_readiness": 0.8,
      "functional_readiness": 0.6,
      "advanced_readiness": 0.4,
      "practice_readiness_profile": {...}
    },
    "pathway_match": {...}
  },
  "pathway": {...}
}
```

## Troubleshooting

### Error: "table does not exist"

**Solution:** Run the database migration (see Prerequisites #1)

### Error: "column does not exist"

**Solution:** The migration may not have run completely. Check that all tables were created.

### Error: "Connection refused"

**Solution:** 
1. Ensure backend server is running: `cd CMS_Backend && npm run dev`
2. Check server is on port 4000: `lsof -ti:4000`

### Error: "Missing environment variables"

**Solution:** 
1. Create `.env.local` in `CMS_Backend/` directory
2. Add required Supabase credentials

## Next Steps

After successful testing:
1. Create sample diagnostic questions in the database
2. Create pathway templates
3. Test full diagnostic flow end-to-end
4. Build Console frontend to consume these APIs

