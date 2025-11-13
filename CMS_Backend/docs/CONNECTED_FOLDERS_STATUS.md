# Connected Folders Status

## ✅ Currently Connected to Content Library

The following folders are **actively connected** and will be imported when you run the sync function:

### Primary Import Script (`import-clean-content.ts` & `/api/content-files/sync`)
**Location**: Scans `09_PROCESSED/` directory

1. **`02d_Orb_Essays/`** ✅ CONNECTED
   - Orb essays content
   - Files scanned and imported

2. **`02f_S2S_codex_essays/`** ✅ CONNECTED
   - Codex essays content
   - Files scanned and imported

3. **`02g_generated_book_content/`** ✅ CONNECTED
   - Generated book chapters (all 15 chapters + interludes)
   - Files scanned and imported
   - **32 files total** (15 chapters + 11 interludes + other content)

## ❌ NOT Connected (Exist but Not Imported)

The following folders exist in `09_PROCESSED/` but are **NOT** included in the import script:

1. **`02a_System_essays/`** ❌ NOT CONNECTED
2. **`02b_book/`** ❌ NOT CONNECTED
3. **`02c_Supporting material/`** ❌ NOT CONNECTED
4. **`02e_do not publish scrolls/`** ❌ NOT CONNECTED (intentionally excluded)
5. **`ARCHIVE/`** ❌ NOT CONNECTED (intentionally excluded)

## Import Scripts Comparison

### 1. `import-clean-content.ts` (Primary - Currently Active)
- **Connected**: `02d_Orb_Essays`, `02f_S2S_codex_essays`, `02g_generated_book_content`
- **Uses**: `.upsert()` (handles updates)
- **Location**: `scripts/import-clean-content.ts`
- **API**: `POST /api/content-files/sync`

### 2. `update-content-library.js` (Alternative)
- **Connected**: `02d_Orb_Essays`, `02f_S2S_codex_essays` only
- **Missing**: `02g_generated_book_content`
- **Location**: `scripts/update-content-library.js`
- **Status**: ⚠️ Not updated to include `02g_generated_book_content`

### 3. `import-content.ts` (Legacy)
- **Connected**: Scans entire `09_PROCESSED/` recursively
- **Uses**: `.upsert()` (handles updates)
- **Location**: `scripts/import-content.ts`
- **Status**: ⚠️ Less selective (may import unwanted folders)

## Summary

**Total Folders in `09_PROCESSED/`**: 8  
**Connected Folders**: 3  
**Unconnected Folders**: 5  

### Connected Folders Detail:
- ✅ `02d_Orb_Essays/` - Orb essays (15 files)
- ✅ `02f_S2S_codex_essays/` - Codex essays (36 files)
- ✅ `02g_generated_book_content/` - Generated book content (32 files)

### To Add More Folders:

Edit these files to add more directories:
1. `scripts/import-clean-content.ts` (line 51-55)
2. `app/api/content-files/sync/route.ts` (line 14-18)

Add the folder name to `TARGET_DIRECTORIES` array.






