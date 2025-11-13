# YAML Schema Quick Reference (Active Standard)

This quickref captures the enforced schema used by `/api/content-files/sync`.

## Essays (02d_Orb_Essays, 02f_S2S_codex_essays)

Required:
- `title: string`
- `type: "orb_essay" | "codex_entry" | "orb_definition_persona"`
- `orb_associations: { primary_orb: string, secondary_orbs?: string[], orb_mentions_all?: string[] }`

Recommended:
- `author, category, status, version, created, modified`
- `field_function: { content_purpose, primary_mechanism, secondary_mechanisms[] }`
- `integration_points[], book_threading, is_primary_source, tags[]`

Notes:
- Section headers must be comments (e.g., `# Core System Integration`).
- `orb_associations` must be an object (not an array).

## Book Content (02g_generated_book_content)

Required:
- `title: string`
- `type: "book_chapter" | "book_interlude"`
- `orb_associations: string[]` (flat list)

Recommended:
- `field_function, resonance_metrics, integration_points, book_threading, is_primary_source, tags[]`

Notes:
- No plain section headers in YAML.
- Keep `orb_associations` as an array.

## Invalid Keys (must be comments)
- `Core System Integration`
- `Field Function Analysis`
- `Resonance Metrics`
- `System Integration`
- `Content Tags`

## Validation Summary
- Essays: `orb_associations` must be object
- Book: `orb_associations` must be array
- `title` and `type` required for all






