# Phase 2.5: Order Index Constraint Issue

**Date:** 2025-01-26  
**Status:** Blocking Question Loading  
**Priority:** High

---

## Problem Summary

When attempting to load early reader questions into the `diagnostic_questions` table, all insertions fail with:

```
new row for relation "diagnostic_questions" violates check constraint "diagnostic_questions_order_index_check"
```

---

## What We've Tried

1. **Sequential values** (6, 7, 8, ...) - ❌ Failed
2. **High values** (100, 1000) - ❌ Failed  
3. **NULL** - ❌ Failed (NOT NULL constraint)
4. **0** - ❌ Failed (check constraint)
5. **Removing order_index** - ❌ Failed (NOT NULL constraint)
6. **Using API endpoint** - ❌ Same constraint error

---

## Current State

### Existing Questions
- 8 questions in database
- `order_index` values: 1, 2, 3, 4, 5 (and possibly more)
- All existing questions have `question_set: 'beta'`

### Constraint Details
- **Constraint Name:** `diagnostic_questions_order_index_check`
- **Column:** `order_index` (INTEGER, NOT NULL)
- **Unknown:** The actual check constraint definition

### What We Don't Know
1. What does the check constraint actually validate?
   - Is it a range? (e.g., `order_index BETWEEN 1 AND 100`)
   - Is it uniqueness per question_set?
   - Is it some other business logic?
2. Where is the constraint defined?
   - Not in the migrations we've seen
   - Must be in the original table definition (which we don't have)

---

## Root Cause

The `diagnostic_questions` table was created before our migrations. The migration file notes:
```sql
-- NOTE: This table already exists with INTEGER id. We're not recreating it.
-- The existing table has: id (INTEGER), question_text, order_index, etc.
```

This means:
- The table structure and constraints existed before our work
- We don't have the original CREATE TABLE statement
- The `order_index_check` constraint is from the original table definition

---

## Impact

**Blocking:**
- Cannot load early reader questions (24 questions provided)
- Phase 2.5 completion is blocked
- Question management system cannot be fully tested

**Not Blocking:**
- Migration for Phase 2.5 metadata fields ✅ (already run)
- Admin API endpoints ✅ (created and working)
- Question service logic ✅ (implemented)
- Follow-up question integration ✅ (implemented)

---

## Solutions

### Option 1: Query the Constraint Definition (Recommended First Step)
```sql
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'diagnostic_questions'::regclass 
  AND conname = 'diagnostic_questions_order_index_check';
```

This will tell us exactly what the constraint checks.

### Option 2: Modify the Constraint
Create a migration to:
1. Drop the existing constraint
2. Add a new, more permissive constraint (e.g., `order_index >= 1`)

**Migration file created:** `20250126_fix_order_index_constraint.sql`

### Option 3: Use Existing order_index Values
If the constraint requires uniqueness or a specific range:
- Reuse existing order_index values for different question_sets
- Or update existing questions to free up order_index values

### Option 4: Use API Endpoint with order_index = 0
The API endpoint sets `order_index: body.order_index || 0` as default.
- If 0 is allowed by the constraint, this could work
- But we've tried 0 and it failed

---

## Next Steps

1. **Query the constraint definition** to understand what it actually checks
2. **Decide on approach:**
   - If constraint is too restrictive → Modify it (Option 2)
   - If constraint has specific rules → Follow those rules (Option 3)
   - If constraint allows certain values → Use those values
3. **Load the questions** once the constraint issue is resolved

---

## Questions for User

1. Do you have access to the original `diagnostic_questions` table definition?
2. Do you know what the `order_index_check` constraint validates?
3. Should we modify the constraint to be more permissive, or work within its current rules?
4. Are there any business rules about `order_index` values we should know about?

---

## Files Created

- ✅ `CMS_Backend/data/early-reader-questions.json` - 24 questions formatted and ready
- ✅ `CMS_Backend/scripts/load-early-reader-questions.ts` - Loader script (blocked by constraint)
- ✅ `CMS_Backend/supabase/migrations/20250126_fix_order_index_constraint.sql` - Migration to fix constraint (not run yet)

---

**Status:** Waiting for constraint definition or decision on how to proceed.

