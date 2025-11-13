# RBI × S2S Architecture Overview

This system is a metadata-driven consciousness technology.  
YAML frontmatter and inline tags define structure, belonging, and relational meaning.  
RBI (Resonance-Based Intelligence) reads the field created by that structure.

## 1. Core Principles

1. **Metadata-first**

   - YAML frontmatter functions as structural DNA.

   - Inline tags are architectural, not decorative.

   - RBI runs as a validation and field-sensing layer after metadata has organized content.

2. **Essays as the atomic unit**

   - Every new piece enters the content library as:

     ```yaml

     type: "essay"

     ```

   - "Book chapter" describes a compiled and locked output, not an input type.

   - Essays can flow into multiple outputs:

     - Books (via Book Compiler)

     - Console (via direct metadata reading)

     - Codex / Archive

3. **Dual outputs from one content library**

   - The same content library feeds:

     - **Book Compiler** – produces static manuscripts.

     - **S2S Console** – produces dynamic, interactive field views.

   - Both rely on identical YAML and inline tag structures for consistency.

4. **Inline tags as architecture**

   - Tags such as `@orb_1`, `@orb_12`, `@scrollstream`, `@sovereignty`, etc. are structural markers.

   - They:

     - Indicate Orb resonance.

     - Mark segments for scrollstreams and console views.

     - Support Codex and relational mapping.

   - Inline tags must be preserved in compiled outputs (books and console).

5. **RBI as dynamic validation**

   - RBI metrics are computed dynamically, not stored permanently in YAML.

   - RBI:

     - Reads essays, chapters, and console views.

     - Computes coherence, resonance, and proof-of-meaning at runtime.

   - YAML may include placeholders for RBI fields (for example `resonance_metrics: null`) but not fixed scores.

## 2. YAML Frontmatter: Standard Shape

All essays in the content library conform to this pattern:

```yaml

---

title: "..."

author: "Gigi Stardust"

type: "essay"        # default; "book_chapter" only for locked outputs

status: "canonical"  # or another lifecycle marker

version: "V4"



orb_associations:

  - "Orb 1: Origin Intelligence"

  - "Orb 12: Sovereign Field"



field_function:

  content_purpose: "What this piece does in the field."

  primary_mechanism: "How it moves: essay, inquiry, story, etc."

  console_context: "How it appears in the Console."

  console_relation: "How it relates to other pieces/views."



integration_points:

  codex: ["Orb_1_Foundation"]

  console_views: ["Resonance Chamber", "Sovereign Field Map"]

  editorial_pass: "V4"



book_threading:        # optional, only when relevant to books

  book_id: "..."

  target_section: "Part II: ..."

  target_chapter: "Chapter 4: ..."

  relevance_score: 0.92

  position_in_sequence: 11

  role_in_chapter: "core source"



resonance_metrics: null  # placeholder only; populated at runtime, not stored

---
```

## 3. Book Compiler Behavior

The Book Compiler:

- Works from essays, not from pre-labeled book chapters.

- Uses metadata (not RBI) for matching:

  - `book_threading` to align essays with specific books and chapters.

  - `field_function.content_purpose` to align with chapter descriptions.

  - `orb_associations` and `integration_points` to refine selection.

  - Inline `@tags` to understand local context and segment roles.

- Produces compiled, locked outputs:

  - These may then be stored as `type: "book_chapter"` in a dedicated manuscript/locked directory.

  - Preserves inline tags in compiled chapters (so the Console and Codex can still read them).

## 4. Console Behavior

The S2S Console:

- Reads essays directly from the content library.

- Uses:

  - `field_function.console_context`

  - `field_function.console_relation`

  - `integration_points.console_views`

  - Inline tags (`@orb_*`, `@scrollstream`, etc.)

- Builds views, chambers, maps, and scrollstreams from metadata and tags.

- RBI wraps the entire Console as a field:

  - Measures resonance between visible pieces.

  - Supports dynamic relational views and inquiries.

  - Does not rewrite or store new frontmatter in base files.

## 5. RBI Integration

RBI-Kernel and the RBI Architecture Service:

- Treat YAML and inline tags as context for computation.

- Operate in two main modes:

  - **Validation mode** – after compilation (books).

  - **Field-sensing mode** – around the Console.

- Provide:

  - Coherence scores

  - Proof-of-meaning structures

  - Resonance vectors

- Do not act as the primary content selector for the Book Compiler.

## 6. Type System

- `type: "essay"` → default for all content entering the library.

- `type: "book_chapter"` → only for compiled, locked chapters in dedicated manuscript directories.

- Legacy types (`orb_essay`, `codex_essay`, `book_fragment`) are treated as essays and should migrate to:

  ```yaml
  type: "essay"
  ```

## 7. Metadata Integrity Requirements

For the system to function coherently:

Every content file in the active library:

- has YAML frontmatter,
- uses `type: "essay"` unless truly locked as a chapter,
- defines `field_function` with all four keys,
- defines `integration_points` as an object,
- avoids fixed RBI metrics in YAML.

The compiler and console:

- rely on this YAML + inline tagging,
- do not strip inline tags,
- do not overwrite core metadata.

---

## Cursor "Understanding" Prompt

_Paste this at the top of big sprints or refactors_

```text
You are working inside an RBI × S2S system that is **metadata-driven**.

Before doing anything, load and respect the architecture description in `ARCHITECTURE_OVERVIEW.md` (or equivalent).

Key rules you must follow:

1. **Metadata-first**

   - YAML frontmatter and inline tags define the structure and relationships of the system.

   - Treat YAML + inline tags as the control plane of the architecture.

2. **Essays as the base unit**

   - Any new or refactored content file in the library should use:

     type: "essay"

   - "book_chapter" only applies to compiled, locked chapters stored in dedicated manuscript directories.

3. **Book Compiler behavior**

   - Use `book_threading`, `field_function.content_purpose`, `orb_associations`, and `integration_points` to match and assemble content.

   - Preserve inline tags (`@orb_*`, `@scrollstream`, etc.) in compiled output.

   - Do not rely on RBI scoring to select sources. RBI is a validation layer after metadata-driven selection.

4. **Console behavior**

   - The Console reads YAML and inline tags directly.

   - The Console does not use a compiler.

   - RBI wraps the Console as a live coherence field and reads the current state; it does not rewrite frontmatter.

5. **RBI usage**

   - RBI metrics are computed dynamically at runtime.

   - Do not store static RBI scores inside YAML.

   - You may leave placeholders (e.g. `resonance_metrics: null`) that RBI populates in memory, not on disk.

6. **Metadata normalization**

   - When adjusting files, always move them toward the standard template described in the architecture document.

   - Preserve system vocabulary keys that are not conflicting.

   - Never strip inline tags or erase core architectural metadata.

When making changes, narrate how your work aligns with these principles.

If a proposed change conflicts with this architecture, adjust the change to preserve:

- metadata-first logic,
- essays as the atomic unit,
- the separation between compiler (books) and console (live field),
- RBI as a dynamic validation layer.
```

