# Local Server Testing Guide

**Date:** 2025-01-26  
**Server:** http://localhost:4000

---

## Quick Test Results

✅ **All Major Endpoints Working:**
- GET /api/console/v3/questions - Returns 22 diagnostic questions
- POST /api/console/v3/questions - Creates questions successfully
- POST /api/console/v3/inquiry - Creates inquiry sessions
- GET /api/console/v3/inquiry - Returns inquiry questions
- GET /api/console/v3/inquiry?common=true - Works correctly

---

## Manual Testing Commands

### 1. Test Diagnostic Questions

**Get all questions:**
```bash
curl http://localhost:4000/api/console/v3/questions | jq '.questions | length'
# Should return: 22
```

**Get specific question:**
```bash
curl http://localhost:4000/api/console/v3/questions/1 | jq '.question.question_text'
```

**Create new question:**
```bash
curl -X POST http://localhost:4000/api/console/v3/questions \
  -H "Content-Type: application/json" \
  -d '{
    "question_text": "Test question",
    "response_type": "single_choice",
    "answer_options": ["Option 1", "Option 2"],
    "orb_weights": {"1": 0.5},
    "order_index": 999,
    "question_set": "beta"
  }'
```

### 2. Test Inquiry System

**Submit an inquiry:**
```bash
curl -X POST http://localhost:4000/api/console/v3/inquiry \
  -H "Content-Type: application/json" \
  -d '{"question": "What does sovereignty mean?"}'
```

**Get inquiry questions:**
```bash
curl http://localhost:4000/api/console/v3/inquiry | jq '.questions | length'
# Should return: 50 (limited by endpoint)
```

**Get common questions:**
```bash
curl "http://localhost:4000/api/console/v3/inquiry?common=true"
```

### 3. Test Diagnostic Flow

**Start a session:**
```bash
curl -X POST http://localhost:4000/api/console/v3/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Submit a response:**
```bash
# Replace SESSION_ID and QUESTION_ID with actual values
curl -X POST http://localhost:4000/api/console/v3/sessions/SESSION_ID/responses \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": 1,
    "answer": "tone / atmosphere"
  }'
```

---

## Automated Test Script

Run the comprehensive test script:
```bash
cd CMS_Backend
./scripts/test-phase-2-5-8-endpoints.sh
```

---

## Expected Results

- ✅ 22 diagnostic questions available
- ✅ 53 inquiry questions in database
- ✅ All API endpoints responding
- ✅ CORS headers included
- ✅ Error handling working

---

## Next Steps for Full Testing

1. **Test diagnostic flow end-to-end:**
   - Start session → Answer questions → Get SFI results → Get pathway

2. **Test inquiry matching:**
   - Submit inquiry → Check if it matches existing inquiry questions
   - Verify inquiry logging

3. **Test question management:**
   - Create → Read → Update → Delete questions via API

4. **Frontend integration:**
   - Connect Console UI to these endpoints
   - Test in browser with actual UI

---

## Server Status

**Current:** Running on http://localhost:4000  
**Status:** ✅ All endpoints operational



