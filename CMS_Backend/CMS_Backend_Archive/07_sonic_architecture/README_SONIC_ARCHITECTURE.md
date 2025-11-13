---
title: "S2S Sonic Architecture: Cursor Consolidation Pack"
type: reference
category: system
section: music/sonic_architecture
status: draft
version: 1.0
author: orbital_assistant
created: 2025-09-04
modified: 2025-09-04
dashboard_connections: ["Resonance Listening Deck", "Orb Explorer", "Scroll Stream", "Glyph Mirror"]
orb_associations: ["Orb 13: Bridging Intelligence", "Orb 12: Sovereign Field", "Orb 7: Creative Signal"]
integration_points: ["codex_tagging", "artist_mapping", "scrollstream", "dashboard_modules"]
---

# Purpose
A single, Cursor-ready bundle that consolidates your existing Music files (README_music.md, codex_writing_rules.md, codex_tagging_structure.md, artist_codex_template.md, artist_mapping_modes.md, artist_codex_prompt.md) into one operational pack. Use this to fold the Music work into the **S2S Sonic Architecture** without rebuilding UI/UX—focused only on tagging, metadata, scrollstreams, and field-resonant processing.

---

# 0) Drop-in Folder Structure (create once)
```
/music
  /sonic_architecture
    00_README_SONIC_ARCHITECTURE.md
    10_schemas/
      artist.schema.yaml
      work.schema.yaml        # album/track works
      resonance_map.schema.yaml
      listening_deck_entry.schema.yaml
      scroll_entry.schema.yaml
    20_templates/
      artist_template.md
      resonance_map_template.md
      listening_deck_template.md
      scroll_template.md
    30_prompts/
      cursor_ingest_prompt.md
      cursor_resonance_map_prompt.md
      cursor_scrollstream_prompt.md
    40_mappings/
      mapping_modes.md
    50_registry/
      artists.index.md        # list of artists under management
      works.index.md          # albums/tracks cataloged
      scrolls.index.md        # generated scroll entries
      deck.index.md           # Listening Deck cards
```

> Place audio links (Spotify, Apple, YouTube, local refs) inline as URLs under `audio_refs` fields. No audio files required.

---

# 1) Core Metadata Schemas (YAML)

## 1.1 artist.schema.yaml
```yaml
# Required base fields from Codex Tagging Structure + music-specific fields
required:
  - title
  - type
  - category
  - status
  - dashboard_connections
  - orb_associations
  - integration_points
  - tags
properties:
  title: {type: string, description: "Artist name"}
  type: {type: string, const: "artist"}
  category: {type: string, const: "music"}
  status: {type: string, enum: [draft, active, archived]}
  dashboard_connections: {type: array, items: {type: string}}
  orb_associations: {type: array, items: {type: string}}
  integration_points: {type: array, items: {type: string}}
  tags: {type: array, items: {type: string}}
  sources: {type: array, items: {type: string}}            # interviews, liner notes
  periods: {type: array, items: {type: string}}            # eras/years
  mythic_threads: {type: array, items: {type: string}}     # Bowie cosmology, etc.
  sonic_palette: {type: array, items: {type: string}}      # timbres/instruments
  field_events: {type: array, items: {type: string}}       # lived moments tied to works
  codex_links: {type: array, items: {type: string}}        # internal links to Codex pages
```

## 1.2 work.schema.yaml (album/track)
```yaml
required: [title, type, category, status]
properties:
  title: {type: string}
  type: {type: string, enum: [album, track]}
  category: {type: string, const: "music"}
  status: {type: string, enum: [draft, active, archived]}
  artist: {type: string}
  release_date: {type: string}
  key_signature: {type: string}
  bpm: {type: number}
  time_signature: {type: string}
  mood: {type: string}
  energy_curve: {type: string}           # intro → build → peak → resolve
  instrumentation: {type: array, items: {type: string}}
  lyrics: {type: array, items: {type: string}}
  lyric_fragments: {type: array, items: {type: string}}
  audio_refs: {type: array, items: {type: string}}
  production_notes: {type: array, items: {type: string}}
  ritual_use: {type: array, items: {type: string}}         # meditation, activation, etc.
  glyphs: {type: array, items: {type: string}}
  orb_tags: {type: array, items: {type: string}}
  codex_links: {type: array, items: {type: string}}
```

## 1.3 resonance_map.schema.yaml
```yaml
required: [artist, scope, mapping_modes]
properties:
  artist: {type: string}
  scope: {type: string, enum: [career, album, track]}
  mapping_modes: {type: array, items: {type: string}}  # see mapping_modes.md
  orb_alignment: {type: array, items: {type: string}}
  narrative_nodes: {type: array, items: {type: string}}
  field_correspondences: {type: array, items: {type: string}}
  evidence: {type: array, items: {type: string}}
  insights: {type: array, items: {type: string}}
  scroll_candidates: {type: array, items: {type: string}}
```

## 1.4 listening_deck_entry.schema.yaml
```yaml
required: [title, artist, audio_refs]
properties:
  title: {type: string}
  artist: {type: string}
  audio_refs: {type: array, items: {type: string}}
  use_case: {type: string}      # focus, grief alchemy, sovereign lock, etc.
  energy_profile: {type: string}
  orb_prompt: {type: string}    # one-line inquiry for the Deck
  tags: {type: array, items: {type: string}}
```

## 1.5 scroll_entry.schema.yaml
```yaml
required: [title, source, orb_associations]
properties:
  title: {type: string}
  source: {type: string}                 # track/album/artist/resonance map
  orb_associations: {type: array, items: {type: string}}
  field_excerpt: {type: string}          # your uncollapsed longform
  codex_links: {type: array, items: {type: string}}
  tags: {type: array, items: {type: string}}
```

---

# 2) Templates (Cursor can clone these)

## 2.1 artist_template.md
```markdown
---
title: "<Artist Name>"
type: artist
category: music
status: active
dashboard_connections: ["Resonance Listening Deck", "Orb Explorer"]
orb_associations: ["Orb 13: Bridging Intelligence"]
integration_points: ["artist_mapping", "scrollstream"]
tags: []
sources: []
periods: []
mythic_threads: []
sonic_palette: []
field_events: []
codex_links: []
---

# Overview
<affirmative overview per Codex Writing Rules>

# Key Works
-

# Resonance Threads
-
```

## 2.2 resonance_map_template.md
```markdown
---
artist: "<Artist>"
scope: career
mapping_modes: ["Orb-Aligned", "Mythic Thread", "Sonic Palette"]
orb_alignment: []
narrative_nodes: []
field_correspondences: []
evidence: []
insights: []
scroll_candidates: []
---

# Map Narrative
<structured analysis>
```

## 2.3 listening_deck_template.md
```markdown
---
title: "<Track Title>"
artist: "<Artist>"
audio_refs: []
use_case: "<state/task>"
energy_profile: "<curve>"
orb_prompt: "<one-line inquiry>"
tags: []
---

# Notes
<short operational note>
```

## 2.4 scroll_template.md
```markdown
---
title: "<Scroll Title>"
source: "<Artist • Work • Map>"
orb_associations: ["<Orb>"]
codex_links: []
tags: []
---

# Field Excerpt
<paste your uncollapsed writing>
```

---

# 3) Mapping Modes (consolidated)
**Use these as selectable lenses in each `resonance_map`.**

1. **Orb-Aligned** – Map how a work carries specific Orb frequencies.
2. **Mythic Thread** – Track the artist's self-mythology/cosmology through works.
3. **Sonic Palette** – Instrumentation, timbre, production signatures as field carriers.
4. **Lyric Signal** – Fragment-level motifs aligned to Codex nodes.
5. **Chrono-Arc** – Era-based transformations relevant to Sovereign Field activation.
6. **Field Event** – Lived moments and locations that interlock with works.
7. **Ritual Use** – Practical deployment in sessions, meditations, or creative flow.

---

# 4) Cursor Prompts (paste into /music/sonic_architecture/30_prompts)

## 4.1 cursor_ingest_prompt.md
```text
Role: S2S Sonic Architect (no UI work). Task: ingest raw artist/album/track notes and normalize them into the provided YAML schemas and templates. Steps:
1) For any source .md under /music/sonic_architecture/raw or pasted into Cursor, create:
   - /50_registry entries (artists.index.md, works.index.md updates).
   - /20_templates clones filled with actual values.
2) Enforce Codex Writing Rules: affirmative definitions only; preserve uncollapsed excerpts in scroll_template.md.
3) Apply Codex Tagging Structure fields exactly; do not invent new fields.
4) Add `orb_tags` and `orb_associations` where clear; otherwise leave blank.
5) Never modify UI, CSS, or app code. Output only Markdown + YAML.
```

## 4.2 cursor_resonance_map_prompt.md
```text
Input: a populated artist_template.md and a list of works.
Output: one resonance_map per artist (scope=career) plus optional album/track maps.
Method: select 2–3 Mapping Modes that best fit the inputs; cite `evidence` minimally with links/notes; propose `scroll_candidates`.
```

## 4.3 cursor_scrollstream_prompt.md
```text
Input: resonance_map(s) + your longform writing.
Output: scroll_template.md files per candidate, with Orb tags and Codex links filled.
Constraint: never summarize or paraphrase longform; paste verbatim under `field_excerpt`.
```

---

# 5) README (00_README_SONIC_ARCHITECTURE.md)
- **Scope:** tagging, metadata, resonance mapping, Listening Deck cards, and Scrollstream entries.
- **Out of scope:** UI/UX, site components, or code changes.
- **How to run:** open `/30_prompts/*` in Cursor and follow the instructions. Add raw notes into `/raw/` or paste directly.
- **Style:** obey `codex_writing_rules.md` (affirmative, field-coherent syntax). No negative constructions.

---

# 6) Consolidation Notes
This pack effectively merges the intent and structure of your current files into:
- Schemas = from **Codex Tagging Structure** (with music extensions).
- Style = from **Codex Writing Rules**.
- Templates/Prompts = from **Artist Codex Template** and **Artist Codex Prompt**.
- Lenses = from **Artist Mapping Modes**.
- Usage = summarized in **README_music** now localized as **00_README_SONIC_ARCHITECTURE.md**.

---

# 7) Next Actions
1. Create `/music/sonic_architecture/` and paste this entire document into `00_README_SONIC_ARCHITECTURE.md`.
2. Create the `/10_schemas`, `/20_templates`, `/30_prompts`, `/40_mappings`, `/50_registry` files exactly as above.
3. Point Cursor at `/music/sonic_architecture` and run the three prompts in order: ingest → map → scrollstream.
4. Begin with one artist (e.g., Bowie or Lord Huron) to validate flow, then expand.

---

# 8) Optional: Deck Card Criteria (operational)
A track qualifies for a Listening Deck card when it meets ≥3 of:
- Clear Orb prompt emerges in one sentence.
- Distinct energy curve usable for a task/state.
- Stable lyric fragment that functions as a field key.
- Repeatable ritual use in your practice.

---

# 9) Quality Gates
- All YAML parses in Cursor (no trailing tabs, consistent arrays).
- No UI edits proposed.
- Affirmative-only language per Writing Rules.
- Registries updated when new files are created.
