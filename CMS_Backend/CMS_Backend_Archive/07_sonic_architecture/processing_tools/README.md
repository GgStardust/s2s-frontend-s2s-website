# S2S Sonic Architecture Processing Tools

## Overview
This directory contains the operational infrastructure for processing any musical work through the S2S consciousness codex system. It provides schemas, templates, prompts, and registry systems for consistent processing and cataloging.

## Directory Structure

### `/schemas/`
YAML schema definitions for:
- `artist.schema.yaml` - Artist metadata structure
- `work.schema.yaml` - Album/track metadata structure  
- `resonance_map.schema.yaml` - Resonance mapping structure
- `listening_deck_entry.schema.yaml` - Listening deck card structure
- `scroll_entry.schema.yaml` - Scrollstream entry structure

### `/templates/`
Markdown templates for:
- `artist_template.md` - Artist analysis template
- `resonance_map_template.md` - Resonance mapping template
- `listening_deck_template.md` - Listening deck card template
- `scroll_template.md` - Scrollstream entry template

### `/prompts/`
Cursor AI prompts for:
- `cursor_ingest_prompt.md` - Raw content ingestion
- `cursor_resonance_map_prompt.md` - Resonance mapping generation
- `cursor_scrollstream_prompt.md` - Scrollstream extraction

### `/mappings/`
- `mapping_modes.md` - Available mapping analysis modes

### `/registry/`
Index files for tracking processed content:
- `artists.index.md` - Processed artists
- `works.index.md` - Processed albums/tracks
- `scrolls.index.md` - Generated scroll entries
- `deck.index.md` - Listening deck cards

## Usage Workflow

1. **Ingest** - Use `cursor_ingest_prompt.md` to process raw artist/album notes
2. **Map** - Use `cursor_resonance_map_prompt.md` to generate resonance mappings
3. **Extract** - Use `cursor_scrollstream_prompt.md` to create scrollstream entries
4. **Register** - Update index files as content is processed

## Integration with S2S Dashboard

Processed content feeds into:
- **Orb Explorer** - Songs mapped to specific Orbs
- **Scrollstream** - Generated scrollstream phrases
- **Listening Deck** - Interactive audio cards
- **Resonance Mapping** - Visual consciousness mapping

## Quality Gates

- All YAML must parse correctly
- Affirmative-only language per Codex Writing Rules
- No UI/UX modifications
- Registry files updated with new content
