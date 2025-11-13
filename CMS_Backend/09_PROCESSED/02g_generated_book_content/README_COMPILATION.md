---
title: README COMPILATION
author: Gigi Stardust
type: book_output
status: compiled
version: "1.0"
source_type: book_compiler
linked_book: Stardust to Sovereignty
linked_version: V2
console_context: compiled_chapter
console_relation: reflection_of_field
field_function:
  content_purpose: Compiled chapter text for reference in Console.
  primary_mechanism: book_output
  console_context: general
  console_relation: standalone
integration_points:
  codex: []
  console_views: []
  editorial_pass: V2
book_threading:
  book_id: b00cf52b-65cb-4f00-b7d9-293cde462c3a
  part_number: null
  chapter_number: null
  role_in_chapter: final_text
resonance_metrics: null
orb_associations: []
---

# Manuscript Compilation Guide

## How to Compile the Manuscript

To compile all manuscript files from the `02g_generated_book_content` folder into a single document:

```bash
npm run compile-manuscript
```

This will:
1. Read all content files in order based on the Table of Contents
2. Strip YAML frontmatter from each file
3. Combine them into a single markdown document
4. Output to: `09_PROCESSED/STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md`

## Options

**Include YAML frontmatter:**
```bash
npm run compile-manuscript -- --include-yaml
```

## Output

The compiled manuscript includes:
- Front Matter (Series Note, Prologue, Introduction)
- All 15 Chapters
- All 14 Interludes
- Back Matter (Conclusion, Afterword, Epilogue)
- All 9 Appendices (A through I)

## File Structure

The compiler reads files in this order:
1. Front Matter → Chapters → Interludes → Back Matter → Appendices
2. Ordering matches the Table of Contents exactly

## Manual Alternative

If you prefer to manually combine files, the order is:
1. SERIES_NOTE.md
2. PROLOGUE.md
3. INTRODUCTION.md
4. CHAPTER_01 through CHAPTER_15 (with interludes between)
5. CONCLUSION.md
6. AFTERWORD_LIVING_SYSTEM_INTERFACE.md
7. EPILOGUE.md
8. appendices/APPENDIX_A through APPENDIX_I