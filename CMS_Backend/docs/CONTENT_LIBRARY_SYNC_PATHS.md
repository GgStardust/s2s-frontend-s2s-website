# Content Library Sync Functionality

## Overview

The content library sync functionality connects the file system to the Supabase database, enabling the Book Compiler and other systems to access content files from both locations.

## File System Paths

### Source Directory
- **Base Path**: `CLEANED_SYSTEM/09_PROCESSED/`
- **Target Directories**:
  - `02d_Orb_Essays/` - Orb essays
  - `02f_S2S_codex_essays/` - Codex essays  
  - `02g_generated_book_content/` - Generated book chapters and content ✅ **CONNECTED**

### Database Storage
- **Table**: `content_files`
- **Key Field**: `file_path` (unique constraint)
- **Storage**: All content stored in Supabase `content_files` table

## Sync Mechanisms

### 1. Manual Script Import
**Location**: `scripts/import-clean-content.ts`

**Usage**:
```bash
cd CLEANED_SYSTEM
npx tsx scripts/import-clean-content.ts
```

**Features**:
- Scans `09_PROCESSED/` directory
- Processes only `TARGET_DIRECTORIES`
- Uses `.upsert()` to handle updates and duplicates
- Extracts scrollstreams
- Extracts orb associations from YAML frontmatter
- Imports scrollstreams to `scrollstreams` table

### 2. API Endpoint Sync
**Location**: `app/api/content-files/sync/route.ts`

**Endpoint**: `POST /api/content-files/sync`

**Features**:
- Re-scans the entire file system
- Updates existing files in database
- Adds new files
- Returns sync statistics

**Response**:
```json
{
  "success": true,
  "message": "Content library sync completed",
  "stats": {
    "total": 123,
    "imported": 120,
    "errors": 3,
    "scrollstreamsExtracted": 456
  }
}
```

### 3. UI Refresh Button
**Location**: `app/creator/library/page.tsx`

**Buttons**:
- **🔄 Refresh DB**: Reloads content from database (does NOT re-scan file system)
- **🔁 Sync FS**: Re-scans file system and syncs to database (NEW)

## Content File Path Structure

Files stored with `file_path` as:
- `02d_Orb_Essays/filename.md`
- `02f_S2S_codex_essays/filename.md`
- `02g_generated_book_content/CHAPTER_01_THE_STARDUST_WITHIN.md`

## Data Flow

```
File System (09_PROCESSED/)
    ↓ (scan)
import-clean-content.ts / sync API
    ↓ (parse YAML + markdown)
Supabase content_files table
    ↓ (read via API)
Content Library UI (/creator/library)
    ↓ (query)
Book Compiler (/creator/book-compiler)
```

## Verification Checklist

✅ `02g_generated_book_content/` is in `TARGET_DIRECTORIES`  
✅ Import script uses `.upsert()` (handles updates)  
✅ Sync API endpoint exists at `/api/content-files/sync`  
✅ UI has "Sync FS" button for re-scanning  
✅ File paths stored correctly with relative paths  

## Testing

1. **Test Sync Function**:
   ```bash
   curl -X POST http://localhost:3000/api/content-files/sync
   ```

2. **Check Content Library**:
   - Visit `http://localhost:3000/creator/library`
   - Click "🔁 Sync FS" button
   - Verify files appear in the library

3. **Verify File Paths**:
   - Check database: `SELECT file_path FROM content_files WHERE file_path LIKE '02g_generated_book_content%';`
   - Should see all chapter files

## Issues Fixed

1. ✅ Changed `.insert()` to `.upsert()` in import script - now handles updates
2. ✅ Created `/api/content-files/sync` endpoint - enables programmatic sync
3. ✅ Added "Sync FS" button to UI - enables one-click file system re-scan
4. ✅ Verified `02g_generated_book_content` is in TARGET_DIRECTORIES

## Next Steps

- Consider adding file watcher for automatic sync (optional enhancement)
- Add sync status indicator in UI
- Add progress bar for large sync operations






