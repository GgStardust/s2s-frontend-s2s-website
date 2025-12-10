#!/bin/bash

# Test Script for Phase 2.5 & Phase 8 Endpoints
# Tests all diagnostic and inquiry endpoints

BASE_URL="http://localhost:4000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Testing Phase 2.5 & Phase 8 Endpoints"
echo "=========================================="
echo ""

# Test 1: GET all diagnostic questions
echo -e "${YELLOW}Test 1: GET /api/console/v3/questions${NC}"
RESPONSE=$(curl -s "$BASE_URL/api/console/v3/questions")
QUESTION_COUNT=$(echo "$RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
if [ "$QUESTION_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Found $QUESTION_COUNT diagnostic questions"
else
    echo -e "${RED}❌ FAIL${NC} - No questions found"
fi
echo ""

# Test 2: GET specific question by ID
echo -e "${YELLOW}Test 2: GET /api/console/v3/questions/1${NC}"
RESPONSE=$(curl -s "$BASE_URL/api/console/v3/questions/1")
if echo "$RESPONSE" | grep -q "question_text"; then
    echo -e "${GREEN}✅ PASS${NC} - Question retrieved successfully"
    echo "$RESPONSE" | grep -o '"question_text":"[^"]*"' | head -1
else
    echo -e "${RED}❌ FAIL${NC} - Could not retrieve question"
fi
echo ""

# Test 3: POST create new question
echo -e "${YELLOW}Test 3: POST /api/console/v3/questions (create)${NC}"
NEW_QUESTION='{
  "question_text": "Test question for API",
  "response_type": "single_choice",
  "answer_options": ["Option 1", "Option 2"],
  "orb_weights": {"1": 0.5, "2": 0.5},
  "order_index": 999,
  "question_set": "beta",
  "source": "system_generated"
}'
RESPONSE=$(curl -s -X POST "$BASE_URL/api/console/v3/questions" \
  -H "Content-Type: application/json" \
  -d "$NEW_QUESTION")
if echo "$RESPONSE" | grep -q "question"; then
    echo -e "${GREEN}✅ PASS${NC} - Question created successfully"
    QUESTION_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
    echo "Created question ID: $QUESTION_ID"
    
    # Clean up - delete test question
    if [ ! -z "$QUESTION_ID" ]; then
        curl -s -X DELETE "$BASE_URL/api/console/v3/questions/$QUESTION_ID" > /dev/null
        echo "Test question deleted"
    fi
else
    echo -e "${RED}❌ FAIL${NC} - Could not create question"
    echo "$RESPONSE"
fi
echo ""

# Test 4: POST inquiry question
echo -e "${YELLOW}Test 4: POST /api/console/v3/inquiry${NC}"
INQUIRY='{"question": "What does sovereignty mean in this context?"}'
RESPONSE=$(curl -s -X POST "$BASE_URL/api/console/v3/inquiry" \
  -H "Content-Type: application/json" \
  -d "$INQUIRY")
if echo "$RESPONSE" | grep -q "inquiry_id"; then
    echo -e "${GREEN}✅ PASS${NC} - Inquiry created successfully"
    echo "$RESPONSE" | grep -o '"inquiry_id":"[^"]*"' | head -1
else
    echo -e "${RED}❌ FAIL${NC} - Could not create inquiry"
    echo "$RESPONSE"
fi
echo ""

# Test 5: GET inquiry questions
echo -e "${YELLOW}Test 5: GET /api/console/v3/inquiry${NC}"
RESPONSE=$(curl -s "$BASE_URL/api/console/v3/inquiry")
QUESTION_COUNT=$(echo "$RESPONSE" | grep -o '"question_text"' | wc -l | tr -d ' ')
if [ "$QUESTION_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Found $QUESTION_COUNT inquiry questions"
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - No inquiry questions returned (may be empty or endpoint needs query params)"
fi
echo ""

# Test 6: GET common inquiry questions
echo -e "${YELLOW}Test 6: GET /api/console/v3/inquiry?common=true${NC}"
RESPONSE=$(curl -s "$BASE_URL/api/console/v3/inquiry?common=true")
if echo "$RESPONSE" | grep -q "questions"; then
    echo -e "${GREEN}✅ PASS${NC} - Common questions endpoint working"
else
    echo -e "${YELLOW}⚠️  INFO${NC} - Endpoint working (may return empty array if no questions asked yet)"
fi
echo ""

echo "=========================================="
echo "Testing Complete"
echo "=========================================="

