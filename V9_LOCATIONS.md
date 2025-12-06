# V9 Manuscript Locations - Em-Dash Removal Update List

This document lists all locations where the v9 manuscript exists and needs em-dash removal updates.

## ✅ Already Updated
1. **Primary Source File**
   - `/RBI_Editorial_Tools/S2S_Book1/Manuscripts/S2S_Field_Manual_v9_print.md`
   - Status: ✅ Updated (11 em-dashes removed)

## 🔄 Needs Update

### 1. Content Library Version
   - **Path**: `/CMS_Backend/09_PROCESSED/02g_generated_book_content/STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT_v9_content_library.md`
   - **Em-dashes found**: 4 instances
   - **Lines**: 1740, 1852, 1884, 1928
   - **Content**: Same as primary source (processed version for content library)

### 2. HTML Web Versions (First Readers Repository)
   - **Repository**: `S2S-Field-Manual_Readers` (local: `/RBI_Editorial_Tools/S2S_Book1/Manuscripts/web_version/`)
   
   #### 2a. book.html
   - **Path**: `/RBI_Editorial_Tools/S2S_Book1/Manuscripts/web_version/book.html`
   - **Em-dashes found**: 15 instances
   - **Includes**: Chapter titles, introduction text, appendix titles, main content
   
   #### 2b. index.html
   - **Path**: `/RBI_Editorial_Tools/S2S_Book1/Manuscripts/web_version/index.html`
   - **Em-dashes found**: 31 instances
   - **Includes**: All content from book.html PLUS feedback form section headers
   
   #### 2c. print-version.html
   - **Path**: `/RBI_Editorial_Tools/S2S_Book1/Manuscripts/web_version/print-version.html`
   - **Em-dashes found**: 25 instances
   - **Includes**: All content from book.html PLUS feedback form section headers

## 📋 Update Summary

### Content Library Version (1 file)
- 4 em-dashes to replace
- Same replacements as primary source

### HTML Files (3 files)
- **book.html**: 15 em-dashes
- **index.html**: 31 em-dashes (includes feedback form headers)
- **print-version.html**: 25 em-dashes (includes feedback form headers)

**Note**: The HTML files include additional em-dashes in:
- Feedback form section headers (e.g., "Section 1 — Overall Experience")
- These may need different handling if they're part of form structure

## 🔍 Specific Replacements Needed

### Standard Content Replacements (same as primary source):
1. `Chapter X: The Evolutionary Threshold — The Rise...` → `Chapter X: The Evolutionary Threshold: The Rise...`
2. `What I built later—the language...` → `What I built later, including the language...`
3. `fragmentation—emotional, relational, perceptual` → `fragmentation: emotional, relational, perceptual`
4. `Mainstream structures—education...` → `Mainstream structures, including education...`
5. `that rhythm—the ability to ride...` → `that rhythm, the ability to ride...`
6. `its own texture—dense or spacious...` → `its own texture: dense or spacious...`
7. `becomes fluid—capable of shifting...` → `becomes fluid, capable of shifting...`
8. `Appendix A — The Orb System` → `Appendix A: The Orb System`
9. `Appendix B — Orb Expressions` → `Appendix B: Orb Expressions`
10. `Appendix C — Somatic and Energetic Maps` → `Appendix C: Somatic and Energetic Maps`
11. `Appendix D — Axis Maps` → `Appendix D: Axis Maps`

### HTML-Specific Replacements (feedback form headers):
- `Section 1 — Overall Experience` → `Section 1: Overall Experience`
- `Section 2 — Signal Clarity` → `Section 2: Signal Clarity`
- (and similar for Sections 3-10)

## 📝 Notes

- The HTML files are in the first readers repository (`S2S-Field-Manual_Readers`)
- After updating HTML files, they should be committed and pushed to the repository
- The content library version should be synced to Supabase after update
- All replacements follow the style guide: use periods, semicolons, and colons instead of em-dashes

