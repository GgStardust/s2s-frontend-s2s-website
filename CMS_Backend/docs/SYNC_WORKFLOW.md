# Supabase Sync Workflow

## Overview

This document explains how to keep Supabase in sync with your content files. CMS_Backend has **both automatic and manual sync** capabilities.

## What Gets Synced

Only these three folders in `09_PROCESSED/` are synced to Supabase:

- **`02d_Orb_Essays`** - Orb-specific essays
- **`02f_S2S_codex_essays`** - Codex essays
- **`02g_generated_book_content`** - Book manuscripts (including V9)

All other folders (`02a`, `02b`, `02c`, `02e`, `02h`, `ARCHIVE`) are **NOT** synced.

## Sync Methods

### 1. **Automatic Sync (File Watcher)** ⚡
**Status:** Active in development mode

When CMS_Backend is running in development mode, it automatically watches these folders:
- `02d_Orb_Essays`
- `02f_S2S_codex_essays`
- `02g_generated_book_content`

**How it works:**
- Watches for file changes (create, update, delete)
- Debounces changes (waits 2 seconds to batch multiple edits)
- Automatically syncs to Supabase when files change
- No action needed - it just works!

**To check status:**
```bash
curl http://localhost:4000/api/sync/auto
```

**To start/stop manually:**
```bash
# Start
curl -X POST http://localhost:4000/api/sync/auto -d '{"action":"start"}'

# Stop
curl -X POST http://localhost:4000/api/sync/auto -d '{"action":"stop"}'

# Status
curl -X POST http://localhost:4000/api/sync/auto -d '{"action":"status"}'
```

### 2. **Manual Sync Button** 🔁
**Location:** CMS_Backend UI at `/creator/library`

The library page has two buttons:
- **🔄 Refresh DB** - Reloads content from Supabase (doesn't re-scan files)
- **🔁 Sync FS** - Re-scans file system and syncs to Supabase

**When to use:**
- Auto-sync isn't running
- You want to force a full re-scan
- You've made bulk changes and want immediate sync

### 3. **Command Line Script** 📝
**Location:** `scripts/import-content.ts`

```bash
cd CMS_Backend
pnpm import-content
```

**When to use:**
- One-time bulk import
- Setting up a new environment
- Auto-sync isn't working and you need a full sync

### 4. **API Endpoint** 🔌
**Endpoint:** `POST /api/content-files/sync`

```bash
curl -X POST http://localhost:4000/api/content-files/sync
```

**When to use:**
- Programmatic sync (scripts, CI/CD)
- Same as manual button, but via API

## How to Sync

### Option 1: Command Line Script (Recommended)

From the `CMS_Backend` directory:

```bash
cd /Users/gigi/Projects/S2S_RBI_System/CMS_Backend
pnpm import-content
```

This will:
- Scan only `02d`, `02f`, and `02g` folders
- Parse all markdown files with YAML frontmatter
- Import/update them in Supabase
- Extract any embedded scrollstreams
- Show you a summary of what was imported

### Option 2: API Endpoint

If CMS_Backend is running, you can trigger sync via API:

```bash
curl -X POST http://localhost:4000/api/content-files/sync
```

This does the same thing as the script, but via HTTP.

## What Happens During Sync

1. **Scans** the three target directories recursively
2. **Validates** YAML frontmatter (checks for required fields)
3. **Imports** each file to Supabase `content_files` table
4. **Updates** existing files if they already exist (based on `file_path`)
5. **Extracts** scrollstreams if found (marked with `**@scrollstream**`)

## File Requirements

For a file to sync successfully, it needs:

- ✅ `.md` extension
- ✅ Valid YAML frontmatter with:
  - `title` (required)
  - `type` (must be `"essay"` or `"book_output"`)
  - `orb_associations` (object for essays, array for book content)
- ✅ Located in one of the three target directories

## Troubleshooting

### "Supabase credentials not found"
- Make sure `.env.local` exists in `CMS_Backend/`
- Check that it has `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

### "YAML validation failed"
- Check the file's YAML frontmatter
- Ensure `type` is exactly `"essay"` or `"book_output"`
- For essays: `orb_associations` must be an object
- For book content: `orb_associations` must be an array

### Files not syncing
- Verify the file is in `02d`, `02f`, or `02g`
- Check that it has `.md` extension
- Ensure YAML frontmatter is valid

## Ongoing Workflow

### Default (Recommended)
**Just edit files** - Auto-sync will handle it automatically when CMS_Backend is running in dev mode.

### If Auto-Sync Isn't Running
1. **Quick sync:** Click "🔁 Sync FS" button in `/creator/library`
2. **Full sync:** Run `pnpm import-content` from CMS_Backend directory

### Production Deployment
Before deploying to Vercel:
```bash
cd CMS_Backend
pnpm import-content  # Ensure Supabase is up to date
# Then deploy
```

**Note:** Auto-sync only works in development. In production (Vercel), content must already be in Supabase.

## Local vs Production

- **Local Development:** Console reads from file system (no Supabase needed)
- **Production (Vercel):** Console reads from Supabase (must sync before deploying)

For production, sync before deploying:
```bash
cd CMS_Backend
pnpm import-content
# Then deploy
```

