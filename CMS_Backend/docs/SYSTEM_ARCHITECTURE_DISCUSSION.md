# System Architecture Discussion

## Key Clarifications & Questions

### 1. ✅ **Scrollstreams - No Database Extraction**

**Clarification Received:**
- Scrollstreams do NOT need to be extracted to database
- System is **resonance nodal** - searches via **YAML and inline snake tags**
- `@scrollstream` tags are part of the resonance kernel, not separate database entries

**Current Implementation Issue:**
- Sync script (`app/api/content-files/sync/route.ts`) extracts scrollstreams to `scrollstreams` table
- This may be unnecessary based on resonance-based architecture

**Question:** Should we:
- A) Remove scrollstream extraction from sync script?
- B) Keep it for frontend dashboard display but not use for search?
- C) Use it only for specific scrollstream views, not for content discovery?

---

### 2. 📚 **Book 1 (Non-Fiction) Status: COMPLETE**

**Current State:**
- S2S Book 1 is **written and complete** (15 chapters + 11 interludes)
- Located in: `02g_generated_book_content/`
- Status: High quality, ready for publisher manuscript

**Architecture Question:**

**Option A: Load Book 1 as Completed Manuscript in Book Compiler**
- Import all 15 chapters + 11 interludes into `books` and `chapters` tables
- Preserve as-is (locked/read-only mode)
- Mark status: `complete` or `locked`
- Show in Book Compiler UI as completed book
- Allow viewing but not re-compilation

**Option B: Preserve + Continue Adding**
- Load Book 1 into database
- Mark chapters as `complete` / `locked`
- Allow adding NEW essays/content that reference Book 1
- Essays marked "not integrated into Book 1"
- Use for future Book 2/3 compilation

**Option C: Hybrid - Two Views**
- **Published View**: Book 1 as complete manuscript (read-only)
- **Working View**: Can add essays that reference/map to Book 1 chapters
- Essays can link to Book 1 chapters via resonance but aren't part of it

**Recommendation:** Option B or C - Load it, preserve it, but allow resonance linking for new essays

---

### 3. 🆕 **New Essays Workflow**

**Requirements:**
- New essays feed the **frontend dashboard** (resonance-based, non-linear)
- Essays should be marked: **"not integrated into S2S Book 1"**
- YAML field needed: `book_assignment: "none"` or `book_threading: "not_book_1"`
- Future: Will feed Book 2, Book 3 (trilogy)

**YAML Field Options:**
```yaml
book_threading: "not_book_1"  # or "book_2" or "book_3" when ready
book_assignment: "none"
is_book_integrated: false
```

---

### 4. 📖 **Book Compiler - Multi-Book Support**

**Current State:**
- UI shows 2 fixed cards (1 fiction, 1 non-fiction)
- Hardcoded static fallback data
- Limited to single book per type

**Future Needs:**
- **Trilogy Support**: Book 1, Book 2, Book 3 (both fiction and non-fiction)
- Multiple books visible in UI
- Create new book functionality

**Architecture Options:**

**Option A: Dynamic Book List**
- Query all books from database
- Display all books in grid/list view
- Filter by type (fiction/non-fiction)
- "Create New Book" button

**Option B: Series Organization**
- Books grouped by series (S2S Non-Fiction Trilogy, S2S Fiction Trilogy)
- Each series shows all books
- Can expand/collapse series

**Option C: Book Library View**
- Books as cards in a library
- Search/filter
- Multiple books per type visible

**Recommendation:** Option A - Simple dynamic list with filter

**Implementation Needed:**
- Update `/app/creator/book-compiler/page.tsx` to:
  - Remove static book fallback
  - Query all books dynamically
  - Display all books (not just 2)
  - Add "Create New Book" button
  - Filter by type (optional)

---

### 5. 🌐 **Frontend Dashboard - Resonance-Based Access**

**Requirements:**
- **Non-linear** content access
- Resonance-based discovery (not chronological or hierarchical)
- All content library material accessible via:
  - YAML metadata (orb associations, tags, categories)
  - Inline snake tags (`@orb1`, `@resonance`, etc.)
  - Resonance kernel matching

**Current Architecture:**
- Content Library (`/creator/library`) is linear list
- Needs resonance-based browsing

**Questions:**
1. Is frontend dashboard separate from `/creator/library`?
2. Should `/creator/library` be transformed to resonance-based?
3. Where is the public-facing dashboard? (mentioned but needs clarification)

**Resonance Search Implementation:**
- Search by Orb associations
- Search by tags
- Search by concepts (via YAML field_function)
- Search by resonance metrics
- Visual resonance mapping (future?)

---

## Implementation Priorities

### Phase 1: Book Compiler Multi-Book Support (High Priority)
1. ✅ Remove static book fallback
2. ✅ Make book list dynamic (query all books)
3. ✅ Display all books (not limited to 2)
4. ✅ Add "Create New Book" button
5. ✅ Support multiple books per type

### Phase 2: Book 1 Loading (High Priority)
1. ✅ Create script to import Book 1 chapters/interludes into database
2. ✅ Mark chapters as `status: "complete"` / `locked: true`
3. ✅ Update Book Compiler UI to show Book 1 as complete
4. ✅ Add "View Complete Book" mode (read-only)

### Phase 3: New Essay Workflow (Medium Priority)
1. ✅ Add YAML fields: `book_threading: "not_book_1"`
2. ✅ Update sync script to respect book assignment
3. ✅ Add filter in Content Library: "Not in Book 1"
4. ✅ Tag new essays appropriately

### Phase 4: Resonance-Based Frontend (Lower Priority)
1. ✅ Design resonance search interface
2. ✅ Implement Orb-based filtering
3. ✅ Implement tag-based discovery
4. ✅ Add visual resonance mapping

### Phase 5: Scrollstream Clarification (Low Priority)
1. ✅ Discuss scrollstream extraction decision
2. ✅ Remove if unnecessary, or document purpose

---

## Questions for Discussion

### 1. Book 1 Loading Strategy
**Which approach do you prefer?**
- A) Load and lock (read-only)
- B) Load and allow resonance linking
- C) Hybrid (published view + working view)

### 2. New Essay Book Assignment
**What YAML field should we use?**
```yaml
book_threading: "not_book_1"  # or
book_assignment: "none"       # or  
is_book_integrated: false     # or
future_book: "book_2"         # or
```

### 3. Scrollstream Extraction
**Should we:**
- Remove from sync script entirely?
- Keep for display purposes only?
- Use differently?

### 4. Frontend Dashboard Location
**Where is the public-facing dashboard?**
- Separate Next.js app (port 4000)?
- Part of main backend CMS?
- Needs clarification on routing

---

## Next Steps

1. **Port 3000 Issue** - Diagnose and fix server startup
2. **Book Compiler** - Add multi-book support
3. **Book 1 Import** - Create import script after strategy decision
4. **YAML Fields** - Standardize new essay tagging
5. **Resonance Search** - Plan frontend dashboard architecture

**Ready for your input on the questions above before proceeding!**

