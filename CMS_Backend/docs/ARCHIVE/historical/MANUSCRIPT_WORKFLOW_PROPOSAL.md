# Manuscript Workflow Proposal
## Dynamic Connection Between Manuscript and Content Library

**Date:** November 12, 2025  
**Purpose:** Clarify workflow for manuscript updates and content library integration

---

## Current State

### What Exists:
- ✅ Book Compiler in CMS_Backend
- ✅ Content Library (09_PROCESSED/)
- ✅ Chapters stored in content library
- ✅ Previous manuscript version in book compiler (locked)

### Current Issue:
- Manuscript updates require manual pasting into book compiler
- No clear workflow for editorial revisions
- Manuscript not dynamically connected to content library
- Version management unclear

---

## Proposed Workflow

### Phase 1: Manuscript Development (Current - Book 1)

**For Stardust to Sovereignty (Book 1):**

1. **Manuscript Versions in S2S_Manuscript/**
   - All versions filed with clear versioning
   - Format: `STARDUST_TO_SOVEREIGNTY_V{version}.md`
   - Dates and version identification clear
   - V5 = baseline/comparison
   - V6 = selective integration (developmental)

2. **Content Library as Source of Truth**
   - Essays remain in content library (09_PROCESSED/)
   - Chapters can be stored as `type: "book_chapter"` when locked
   - Metadata (`book_threading`) links essays to chapters

3. **Dynamic Connection (Not Full Compilation)**
   - Console reads manuscript structure from S2S_Manuscript/
   - Console dynamically pulls related content from library
   - No need to compile full manuscript into content library yet
   - Book compiler used for final compilation when ready

**Rationale:** Book 1 is still in development. Dynamic connection allows flexibility.

---

### Phase 2: Future Books (Book 2, Book 3)

**When Writing New Books:**

1. **Book Compiler Workflow:**
   - Use book compiler to assemble chapters from content library
   - Essays with `book_threading` metadata automatically match
   - Compiler creates locked chapters
   - Chapters stored as `type: "book_chapter"` in content library

2. **Manuscript Management:**
   - Compiled manuscript stored in S2S_Manuscript/
   - Version control maintained
   - Clear version identification

3. **Console Integration:**
   - Console reads locked chapters from content library
   - Dynamic expansion pulls related essays
   - Manuscript reader shows compiled structure

**Rationale:** For new books, use full compiler workflow from start.

---

## Recommended Workflow for Book 1

### Option A: Keep Dynamic (Recommended for Now)

**Current Approach:**
- Manuscript in S2S_Manuscript/ (V5, V6, etc.)
- Content library has essays
- Console dynamically connects them
- Book compiler used when ready to lock

**Pros:**
- Flexible for editorial revisions
- No need to recompile constantly
- Console can show dynamic expansion

**Cons:**
- Manual version management
- No automatic sync

### Option B: Compile When Locked

**When V5/V6 is finalized:**
- Use book compiler to create locked chapters
- Store chapters in content library as `type: "book_chapter"`
- Console reads from content library
- Manuscript in S2S_Manuscript/ for reference

**Pros:**
- Clear locked state
- Chapters in content library
- Console can read directly

**Cons:**
- Requires compilation step
- Less flexible for ongoing edits

---

## Implementation Plan

### Immediate (Book 1):

1. **Organize Manuscript Versions:**
   - File all versions in S2S_Manuscript/
   - Clear naming: `STARDUST_TO_SOVEREIGNTY_V{version}.md`
   - Include dates and version notes

2. **Build V6:**
   - Selective integration script
   - Keep V5 as baseline
   - File in S2S_Manuscript/

3. **Console Development:**
   - Manuscript reader (reads from S2S_Manuscript/)
   - Dynamic expansion (pulls from content library)
   - Toggle: Print View / Dynamic View

4. **Content Library:**
   - Keep essays as source of truth
   - Ensure metadata (`book_threading`) is accurate
   - Chapters can be added when locked

### Future (Book 2+):

1. **Use Book Compiler:**
   - Assemble from content library
   - Create locked chapters
   - Store in content library

2. **Console Integration:**
   - Read locked chapters from library
   - Dynamic expansion from essays
   - Full workflow established

---

## File Organization

### S2S_Manuscript/ Structure:

```
S2S_Manuscript/
├── STARDUST_TO_SOVEREIGNTY_V5.md (baseline)
├── STARDUST_TO_SOVEREIGNTY_V6.md (selective integration)
├── archive/
│   └── [previous versions]
└── current/
    └── STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md (most recent)
```

### Content Library Structure:

```
09_PROCESSED/
├── 02d_Orb_Essays/ (source essays)
├── 02f_S2S_codex_essays/ (source essays)
└── 02g_generated_book_content/ (locked chapters when ready)
    └── [chapters as type: "book_chapter"]
```

---

## Console Integration

### Manuscript Reader:
- Reads from S2S_Manuscript/current/ (most recent confirmed)
- Shows sequential chapters
- Navigation: TOC, Next/Previous

### Dynamic Expansion:
- Queries content library for related content
- Uses `book_threading.target_chapter` metadata
- Shows expandable sections
- Toggle: Print View (clean) / Dynamic View (with expansions)

---

## Conclusion

**For Book 1 (Current):**
- Keep dynamic connection
- Manuscript in S2S_Manuscript/
- Console reads manuscript + dynamically expands from library
- Book compiler used when ready to lock

**For Future Books:**
- Use book compiler workflow
- Compile chapters into content library
- Console reads from library
- Full workflow established

---

**Workflow Proposal Complete**

