# Phase 6: Access System Integration - Progress

**Date:** 2025-01-26  
**Status:** In Progress

---

## Summary

Implementing access system integration to gate Console routes and enable preorder-based access. Backend infrastructure exists; implementing frontend integration.

---

## Completed Tasks

### ✅ 1. CORS Headers Added to Access Endpoints
**Files Modified:**
- `CMS_Backend/app/api/console/v3/access/check/route.ts`
- `CMS_Backend/app/api/console/v3/access/tokens/claim/route.ts`
- `CMS_Backend/app/api/console/v3/access/tokens/route.ts`

**Changes:**
- Added `getCorsHeaders` import
- Added `OPTIONS` handlers for CORS preflight
- Added CORS headers to all responses

---

### ✅ 2. Access Check Hook Created
**File Created:** `s2s-frontend/s2s-console/lib/useAccessCheck.ts`

**Features:**
- React hook to check console access
- Checks by email (from localStorage) or user_id
- Returns access status, loading state, and error handling
- Can be called manually to refresh access status

---

### ✅ 3. AccessGate Component Created
**File Created:** `s2s-frontend/s2s-console/components/AccessGate.tsx`

**Features:**
- Wraps protected routes
- Checks access on mount
- Redirects to console info page if no access
- Shows loading and error states
- Configurable redirect destination

---

### ✅ 4. Console Routes Protected
**Files Modified:**
- `s2s-frontend/s2s-console/app/pathway/page.tsx` - Wrapped with AccessGate
- `s2s-frontend/s2s-console/app/inquiry/page.tsx` - Wrapped with AccessGate

**Note:** Diagnostic page (`/diagnostic`) is intentionally NOT protected as it's the entry point.

---

## Pending Tasks

### ⏳ 5. Show Access Status in Console UI
**Status:** Not Started

**Tasks:**
- Add access status indicator to ConsoleLayout
- Show active products and expiration dates
- Display access status in navigation or header

**Location:** `s2s-frontend/s2s-console/components/ConsoleLayout.tsx`

---

### ⏳ 6. Token Claim Flow in Website
**Status:** Not Started

**Tasks:**
- Create token claim page/component
- Handle token from URL query parameter
- Claim token and activate access
- Redirect to Console after successful claim

**Location:** `s2s-frontend/s2s-website/app/console/claim/page.tsx` (to be created)

---

### ⏳ 7. Email Invitation Flow
**Status:** Not Started

**Tasks:**
- Create email template for access tokens
- Send email with claim link after preorder
- Handle email delivery (via Formspree webhook or manual process)

**Note:** This may require backend webhook integration or manual token generation.

---

### ⏳ 8. Preorder Integration
**Status:** Not Started

**Tasks:**
- Link preorder form submission to access token creation
- Create access tokens for preorder users
- Map preorder types to product codes:
  - Print → `PREORDER_PRINT` (with Console beta access)
  - Digital → `PREORDER_DIGITAL` (with Console beta access)
  - Bundle → `PREORDER_BUNDLE` (with Console beta access)

**Location:** `s2s-frontend/s2s-website/app/preorder/page.tsx`

**Note:** This requires either:
- Formspree webhook integration to create tokens after preorder
- Manual token generation process
- Or automatic token creation on preorder submission

---

## Architecture

### Access Flow

1. **User Preorders** → Formspree receives submission
2. **Token Created** → Backend creates access token (via webhook or manual)
3. **Email Sent** → User receives email with claim link
4. **Token Claimed** → User clicks link, token is claimed
5. **Access Activated** → User can access Console routes

### Access Check Flow

1. **User Visits Console Route** → AccessGate component checks access
2. **Hook Checks Access** → `useAccessCheck` calls `/api/console/v3/access/check`
3. **Backend Validates** → Checks `user_products` table for active access
4. **Access Granted/Denied** → User sees content or is redirected

---

## Database Schema

### Tables Used:
- `access_tokens` - Stores unclaimed/active tokens
- `user_products` - Links users to products (access records)
- `products` - Product definitions (CONSOLE_BETA, etc.)

### Product Codes:
- `CONSOLE_BETA` - Beta access (from preorder)
- `CONSOLE_ONE_TIME` - One-time purchase
- `CONSOLE_SUBSCRIPTION` - Subscription access

---

## API Endpoints

### ✅ GET /api/console/v3/access/check
- Checks if user has console access
- Query params: `user_id` or `email`
- Returns: `{ has_access: boolean, products: [...] }`
- CORS enabled

### ✅ POST /api/console/v3/access/tokens/claim
- Claims an access token
- Body: `{ token, user_id?, email? }`
- Returns: `{ success: true, product_code, email }`
- CORS enabled

### ✅ POST /api/console/v3/access/tokens
- Creates an access token (admin/backend use)
- Body: `{ email, product_code, metadata? }`
- Returns: `{ token, email, product_code, expires_at, status }`
- CORS enabled

---

## Next Steps

1. **Add Access Status to ConsoleLayout** - Show user their access status
2. **Create Token Claim Page** - Allow users to claim tokens from email links
3. **Integrate Preorder Flow** - Link preorder to token creation
4. **Test End-to-End Flow** - Verify preorder → token → claim → access works

---

## Notes

- Diagnostic page is intentionally NOT protected (entry point)
- Access check uses email from localStorage (set during diagnostic)
- Access tokens can be created manually or via webhook
- Token expiration is handled automatically
- Access status is checked on each protected route visit

---

## Files Created/Modified

### Created:
- `s2s-frontend/s2s-console/lib/useAccessCheck.ts`
- `s2s-frontend/s2s-console/components/AccessGate.tsx`
- `CMS_Backend/docs/PHASE_6_PROGRESS.md`

### Modified:
- `CMS_Backend/app/api/console/v3/access/check/route.ts` (CORS headers)
- `CMS_Backend/app/api/console/v3/access/tokens/claim/route.ts` (CORS headers)
- `CMS_Backend/app/api/console/v3/access/tokens/route.ts` (CORS headers)
- `s2s-frontend/s2s-console/app/pathway/page.tsx` (AccessGate wrapper)
- `s2s-frontend/s2s-console/app/inquiry/page.tsx` (AccessGate wrapper)

---

**Status:** Core access protection implemented. Remaining: UI status display, token claim page, preorder integration.



