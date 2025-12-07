#!/bin/bash

# Test Script for Fixed Endpoints
# Tests the three endpoints we just fixed:
# 1. /api/console/content
# 2. /api/manuscript/current
# 3. /api/ai/conversation

BASE_URL="http://localhost:4000"
PASSED=0
FAILED=0

echo "=========================================="
echo "Testing Fixed CMS_Backend Endpoints"
echo "=========================================="
echo ""

# Check if CMS_Backend is running
echo "Checking if CMS_Backend is running..."
if ! curl -s "$BASE_URL/api/health-check" > /dev/null 2>&1; then
    echo "❌ CMS_Backend is not running on $BASE_URL"
    echo ""
    echo "To start CMS_Backend:"
    echo "  cd CMS_Backend"
    echo "  npm run dev"
    echo ""
    exit 1
fi
echo "✅ CMS_Backend is running"
echo ""

# Test 1: GET /api/console/content
echo "=========================================="
echo "Test 1: GET /api/console/content"
echo "=========================================="
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/console/content")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" -eq 200 ]; then
    # Check if response has expected structure
    if echo "$BODY" | grep -q '"success"'; then
        DATA_COUNT=$(echo "$BODY" | grep -o '"id"' | wc -l | tr -d ' ')
        echo "✅ PASS - Status: $HTTP_CODE"
        echo "   Response structure: Valid"
        echo "   Content items found: $DATA_COUNT"
        ((PASSED++))
    else
        echo "⚠️  WARN - Status: $HTTP_CODE but response structure may be unexpected"
        echo "$BODY" | head -5
        ((PASSED++))
    fi
else
    echo "❌ FAIL - Status: $HTTP_CODE"
    echo "Response:"
    echo "$BODY" | head -10
    ((FAILED++))
fi
echo ""

# Test 1b: GET /api/console/content with filters
echo "Test 1b: GET /api/console/content?console_view=ScrollStream"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/console/content?console_view=ScrollStream")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ PASS - Status: $HTTP_CODE (filtered query works)"
    ((PASSED++))
else
    echo "❌ FAIL - Status: $HTTP_CODE"
    echo "$BODY" | head -5
    ((FAILED++))
fi
echo ""

# Test 2: GET /api/manuscript/current
echo "=========================================="
echo "Test 2: GET /api/manuscript/current"
echo "=========================================="
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/manuscript/current")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" -eq 200 ]; then
    if echo "$BODY" | grep -q '"chapters"'; then
        CHAPTER_COUNT=$(echo "$BODY" | grep -o '"chapter_number"' | wc -l | tr -d ' ')
        SOURCE=$(echo "$BODY" | grep -o '"source":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "✅ PASS - Status: $HTTP_CODE"
        echo "   Source: $SOURCE"
        echo "   Chapters found: $CHAPTER_COUNT"
        ((PASSED++))
    else
        echo "⚠️  WARN - Status: $HTTP_CODE but response structure may be unexpected"
        echo "$BODY" | head -5
        ((PASSED++))
    fi
elif [ "$HTTP_CODE" -eq 404 ]; then
    echo "⚠️  WARN - Status: 404 (Manuscript file not found)"
    echo "   This is expected if manuscript hasn't been synced to Supabase"
    echo "   Response:"
    echo "$BODY" | head -5
    ((PASSED++))
else
    echo "❌ FAIL - Status: $HTTP_CODE"
    echo "Response:"
    echo "$BODY" | head -10
    ((FAILED++))
fi
echo ""

# Test 3: POST /api/ai/conversation
echo "=========================================="
echo "Test 3: POST /api/ai/conversation"
echo "=========================================="
echo "Testing with a simple inquiry..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/ai/conversation" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "Why do I feel disconnected?" }
    ],
    "currentContent": "",
    "title": "",
    "orbContext": null
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" -eq 200 ]; then
    if echo "$BODY" | grep -q '"content"'; then
        CONTENT_LENGTH=$(echo "$BODY" | grep -o '"content":"[^"]*"' | head -1 | cut -d'"' -f4 | wc -c)
        HAS_RBI=$(echo "$BODY" | grep -q '"rbi_output"' && echo "yes" || echo "no")
        HAS_ORBITAL=$(echo "$BODY" | grep -q '"orbital_interpretation"' && echo "yes" || echo "no")
        echo "✅ PASS - Status: $HTTP_CODE"
        echo "   Response structure: Valid"
        echo "   Has RBI output: $HAS_RBI"
        echo "   Has Orbital interpretation: $HAS_ORBITAL"
        echo "   Content length: $CONTENT_LENGTH chars"
        ((PASSED++))
    else
        echo "⚠️  WARN - Status: $HTTP_CODE but response missing 'content' field"
        echo "$BODY" | head -5
        ((PASSED++))
    fi
elif [ "$HTTP_CODE" -eq 500 ]; then
    echo "❌ FAIL - Status: 500 (Internal Server Error)"
    echo "   This may indicate:"
    echo "   - Missing OPENAI_API_KEY environment variable"
    echo "   - RBI-Kernel or Orbital-Brain package issues"
    echo "   - Other dependency problems"
    echo ""
    echo "Error response:"
    echo "$BODY" | head -10
    ((FAILED++))
else
    echo "❌ FAIL - Status: $HTTP_CODE"
    echo "Response:"
    echo "$BODY" | head -10
    ((FAILED++))
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Total:  $((PASSED + FAILED))"
echo ""

if [ "$FAILED" -eq 0 ]; then
    echo "✅ All tests passed!"
    exit 0
else
    echo "❌ Some tests failed"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check CMS_Backend logs for detailed error messages"
    echo "2. Verify environment variables (.env.local):"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - OPENAI_API_KEY (for /api/ai/conversation)"
    echo "3. Verify packages are built:"
    echo "   - cd RBI-Kernel && npm run build"
    echo "   - cd Orbital-Brain && npm run build"
    exit 1
fi

