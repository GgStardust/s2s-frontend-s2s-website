#!/bin/bash

# Test script for Console V3 Diagnostic Endpoints
# Usage: ./test-console-v3-endpoints.sh
#
# Prerequisites:
# 1. Run database migration: See CMS_Backend/supabase/migrations/20250126_console_v3_diagnostic_system.sql
# 2. Start backend server: cd CMS_Backend && npm run dev

BASE_URL="http://localhost:4000"
API_BASE="${BASE_URL}/api/console/v3"

echo "=========================================="
echo "Testing Console V3 Diagnostic Endpoints"
echo "=========================================="
echo ""
echo "⚠️  Note: Database migration must be run first!"
echo "   See: CMS_Backend/supabase/migrations/20250126_console_v3_diagnostic_system.sql"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: GET /api/console/v3/questions
echo -e "${YELLOW}Test 1: GET /api/console/v3/questions${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/questions")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $HTTP_CODE)"
    echo "Response preview:"
    echo "$BODY" | jq '.questions | length' 2>/dev/null || echo "$BODY" | head -c 200
    echo ""
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    echo ""
fi

# Test 2: POST /api/console/v3/sessions (Start session)
echo -e "${YELLOW}Test 2: POST /api/console/v3/sessions${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/sessions" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $HTTP_CODE)"
    SESSION_ID=$(echo "$BODY" | jq -r '.session_id' 2>/dev/null)
    echo "Session ID: $SESSION_ID"
    echo "Questions count: $(echo "$BODY" | jq '.questions | length' 2>/dev/null)"
    echo ""
    
    # Test 3: POST /api/console/v3/sessions/[id]/responses (Submit response)
    if [ -n "$SESSION_ID" ] && [ "$SESSION_ID" != "null" ]; then
        echo -e "${YELLOW}Test 3: POST /api/console/v3/sessions/$SESSION_ID/responses${NC}"
        
        # Get first question ID
        QUESTION_ID=$(echo "$BODY" | jq -r '.questions[0].id' 2>/dev/null)
        
        if [ -n "$QUESTION_ID" ] && [ "$QUESTION_ID" != "null" ]; then
            RESPONSE2=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/sessions/${SESSION_ID}/responses" \
              -H "Content-Type: application/json" \
              -d "{\"question_id\": \"$QUESTION_ID\", \"answer\": \"3\"}")
            HTTP_CODE2=$(echo "$RESPONSE2" | tail -n1)
            BODY2=$(echo "$RESPONSE2" | sed '$d')
            
            if [ "$HTTP_CODE2" = "200" ]; then
                echo -e "${GREEN}✓ PASS${NC} (HTTP $HTTP_CODE2)"
                echo "Response ID: $(echo "$BODY2" | jq -r '.response_id' 2>/dev/null)"
                echo "Is complete: $(echo "$BODY2" | jq -r '.is_complete' 2>/dev/null)"
                echo ""
                
                # Test 4: POST /api/console/v3/sessions/[id]/complete
                echo -e "${YELLOW}Test 4: POST /api/console/v3/sessions/$SESSION_ID/complete${NC}"
                RESPONSE3=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/sessions/${SESSION_ID}/complete")
                HTTP_CODE3=$(echo "$RESPONSE3" | tail -n1)
                BODY3=$(echo "$RESPONSE3" | sed '$d')
                
                if [ "$HTTP_CODE3" = "200" ]; then
                    echo -e "${GREEN}✓ PASS${NC} (HTTP $HTTP_CODE3)"
                    echo "SFI Score: $(echo "$BODY3" | jq -r '.result.sfi.score' 2>/dev/null)"
                    echo "SFI State: $(echo "$BODY3" | jq -r '.result.sfi.state' 2>/dev/null)"
                    echo "Foundational Readiness: $(echo "$BODY3" | jq -r '.result.readiness.foundational_readiness' 2>/dev/null)"
                    echo ""
                else
                    echo -e "${RED}✗ FAIL${NC} (HTTP $HTTP_CODE3)"
                    echo "Response: $BODY3"
                    echo ""
                fi
            else
                echo -e "${RED}✗ FAIL${NC} (HTTP $HTTP_CODE2)"
                echo "Response: $BODY2"
                echo ""
            fi
        else
            echo -e "${YELLOW}⚠ SKIP${NC} (No questions available)"
            echo ""
        fi
    else
        echo -e "${YELLOW}⚠ SKIP${NC} (No session ID returned)"
        echo ""
    fi
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    echo ""
fi

echo "=========================================="
echo "Testing Complete"
echo "=========================================="

