-- Add JSONB fields for dynamic source management in chapters table
-- This replaces the static source_file_ids array with editable YAML-driven linking

BEGIN;

-- Add new JSONB columns for source management
ALTER TABLE chapters 
ADD COLUMN IF NOT EXISTS linked_sources JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS referenced_files JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS generation_params JSONB DEFAULT '{}';

-- Add indexes for efficient querying of JSONB fields
CREATE INDEX IF NOT EXISTS idx_chapters_linked_sources ON chapters USING GIN (linked_sources);
CREATE INDEX IF NOT EXISTS idx_chapters_referenced_files ON chapters USING GIN (referenced_files);

-- Add constraint to ensure linked_sources and referenced_files are arrays
ALTER TABLE chapters 
ADD CONSTRAINT check_linked_sources_is_array CHECK (jsonb_typeof(linked_sources) = 'array'),
ADD CONSTRAINT check_referenced_files_is_array CHECK (jsonb_typeof(referenced_files) = 'array');

-- Example of the JSONB structure:
-- linked_sources: ["sovereign_field_navigation", "harmonic_architecture_practice"]
-- referenced_files: ["origin_intelligence_pulse.md", "orb_1_origin_intelligence.md"]
-- generation_params: {
--   "max_words": 3000,
--   "include_scrollstreams": true,
--   "include_notes": true,
--   "linked_orbs_only": true
-- }

COMMIT;

