# Content Filtering Fix

**Date:** December 6, 2025  
**Purpose:** Clean up orphaned book chapters and restrict Console content to only the 3 synced folders

---

## Problem

1. **Orphaned Content**: Old book chapters were deleted from the file system but remained in Supabase
2. **Unfiltered Content**: Console was showing content from all folders, not just the 3 synced ones
3. **Inquiry Pulling Wrong Content**: User inquiries were matching content from unexpected sources

---

## Solution

### 1. Cleanup Script

**File:** `CMS_Backend/scripts/cleanup-orphaned-content.ts`

**What it does:**
- Scans all content files in Supabase
- Checks if files exist in the file system
- Identifies files from wrong folders (not in the 3 allowed folders)
- Deletes orphaned and wrong-folder files from database

**Usage:**
```bash
# Preview what will be deleted (dry run)
tsx scripts/cleanup-orphaned-content.ts --dry-run

# Actually delete orphaned files
tsx scripts/cleanup-orphaned-content.ts
```

**Allowed Folders:**
- `02d_Orb_Essays`
- `02f_S2S_codex_essays`
- `02g_generated_book_content`

### 2. API Filtering

**File:** `CMS_Backend/app/api/console/content/route.ts`

**What changed:**
- Added `ALLOWED_FOLDERS` constant
- Added `isFileFromAllowedFolder()` helper function
- Added folder filtering BEFORE other filters (console_context, console_view, etc.)

**Result:**
- `/api/console/content` now ONLY returns content from the 3 synced folders
- All other content is filtered out, regardless of metadata

---

## How It Works

### Cleanup Script Logic

1. Fetches all content files from Supabase
2. For each file:
   - Checks if `file_path` starts with one of the 3 allowed folders
   - Checks if the file actually exists in `09_PROCESSED/`
3. Marks files for deletion if:
   - They're from a wrong folder, OR
   - They don't exist in the file system
4. Deletes marked files from Supabase

### API Filtering Logic

```typescript
// FIRST: Filter to only include files from the 3 synced folders
filteredFiles = filteredFiles.filter((file: any) => {
  const filePath = file?.file_path || '';
  return isFileFromAllowedFolder(filePath);
});

// THEN: Apply other filters (console_context, console_view, orb_id, etc.)
```

This ensures that even if content has correct metadata, it won't appear if it's not from an allowed folder.

---

## Testing

### Test Cleanup Script

```bash
cd CMS_Backend
tsx scripts/cleanup-orphaned-content.ts --dry-run
```

Review the output to see what would be deleted, then run without `--dry-run` to actually delete.

### Test API Filtering

```bash
# Should only return content from 3 allowed folders
curl "http://localhost:4000/api/console/content" | jq '.data[].file_path' | sort | uniq
```

All `file_path` values should start with:
- `02d_Orb_Essays/`
- `02f_S2S_codex_essays/`
- `02g_generated_book_content/`

---

## Impact

### Before
- Console showed content from all folders in database
- Orphaned book chapters remained in database
- Inquiries could match unexpected content

### After
- Console only shows content from 3 synced folders
- Orphaned files can be cleaned up with script
- Inquiries only match content from allowed sources

---

## Next Steps

1. **Run Cleanup Script**: Execute the cleanup script to remove orphaned book chapters
2. **Verify API**: Test that `/api/console/content` only returns content from 3 folders
3. **Test Inquiry**: Submit an inquiry and verify it only matches content from allowed folders
4. **Monitor**: Keep an eye on content library to ensure no unexpected content appears

---

## Notes

- The cleanup script is safe to run multiple times
- Use `--dry-run` first to preview what will be deleted
- The API filtering is automatic - no manual intervention needed
- Both fixes work together to ensure Console only shows intended content

