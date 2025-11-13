# Cursor Ingest Prompt

Role: S2S Sonic Architect (no UI work). Task: ingest raw artist/album/track notes and normalize them into the provided YAML schemas and templates. Steps:
1) For any source .md under /music/sonic_architecture/raw or pasted into Cursor, create:
   - /50_registry entries (artists.index.md, works.index.md updates).
   - /20_templates clones filled with actual values.
2) Enforce Codex Writing Rules: affirmative definitions only; preserve uncollapsed excerpts in scroll_template.md.
3) Apply Codex Tagging Structure fields exactly; do not invent new fields.
4) Add `orb_tags` and `orb_associations` where clear; otherwise leave blank.
5) Never modify UI, CSS, or app code. Output only Markdown + YAML.
