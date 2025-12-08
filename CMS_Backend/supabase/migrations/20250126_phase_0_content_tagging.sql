-- Phase 0: Content Organization & Tagging
-- Purpose: Add Console-specific metadata fields to content_files table
-- Created: 2025-01-26
-- Part of: Console V3 Build Plan - Phase 0

-- Add Console-specific fields to content_files table
ALTER TABLE content_files
  -- Console readiness flag
  ADD COLUMN IF NOT EXISTS console_ready BOOLEAN DEFAULT false,
  
  -- Visibility control
  ADD COLUMN IF NOT EXISTS visibility VARCHAR(50) DEFAULT 'internal' 
    CHECK (visibility IN ('internal', 'codex', 'public')),
  
  -- Codex category (for Codex entries)
  ADD COLUMN IF NOT EXISTS codex_category VARCHAR(50) 
    CHECK (codex_category IN ('essay', 'scroll', 'interlude', 'field_report', 'exercise', NULL)),
  
  -- Console tags (for pathway/practice/orb associations)
  ADD COLUMN IF NOT EXISTS console_tags TEXT[] DEFAULT '{}',
  
  -- Practice associations (1-12, derived from Orbs via practice_orb_mappings)
  ADD COLUMN IF NOT EXISTS practice_associations INTEGER[] DEFAULT '{}',
  
  -- Exercise-specific metadata (for exercises collection)
  ADD COLUMN IF NOT EXISTS exercise_type VARCHAR(50) 
    CHECK (exercise_type IN ('field_experiment', 'daily_practice', 'weekly_practice', 'monthly_practice', 'advanced_protocol', 'operational_instruction', NULL)),
  
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
  
  -- Content status (enhanced from existing status field)
  ADD COLUMN IF NOT EXISTS content_status VARCHAR(50) DEFAULT 'draft' 
    CHECK (content_status IN ('draft', 'review', 'published', 'archived'));

-- Create indexes for Console queries
CREATE INDEX IF NOT EXISTS idx_content_files_console_ready ON content_files(console_ready) WHERE console_ready = true;
CREATE INDEX IF NOT EXISTS idx_content_files_visibility ON content_files(visibility);
CREATE INDEX IF NOT EXISTS idx_content_files_codex_category ON content_files(codex_category);
CREATE INDEX IF NOT EXISTS idx_content_files_console_tags ON content_files USING GIN(console_tags);
CREATE INDEX IF NOT EXISTS idx_content_files_practice_associations ON content_files USING GIN(practice_associations);
CREATE INDEX IF NOT EXISTS idx_content_files_exercise_type ON content_files(exercise_type);

-- Update existing content to have default values
UPDATE content_files
SET 
  console_ready = false,
  visibility = CASE 
    WHEN status = 'canonical' THEN 'codex'
    WHEN status = 'active' THEN 'internal'
    ELSE 'internal'
  END,
  content_status = CASE
    WHEN status = 'canonical' THEN 'published'
    WHEN status = 'active' THEN 'review'
    WHEN status = 'draft' THEN 'draft'
    ELSE 'draft'
  END
WHERE console_ready IS NULL OR visibility IS NULL OR content_status IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN content_files.console_ready IS 'Explicit flag for Console consumption. Only content with console_ready=true is available via Codex API.';
COMMENT ON COLUMN content_files.visibility IS 'Content visibility: internal (CMS workspace only), codex (Console-ready), public (website/public)';
COMMENT ON COLUMN content_files.codex_category IS 'Category for Codex entries: essay, scroll, interlude, field_report, exercise';
COMMENT ON COLUMN content_files.console_tags IS 'Tags for Console associations: pathway steps, practices, orbs, etc.';
COMMENT ON COLUMN content_files.practice_associations IS 'Array of practice IDs (1-12) this content supports, derived from orb_associations via practice_orb_mappings';
COMMENT ON COLUMN content_files.exercise_type IS 'Type of exercise: field_experiment, daily_practice, weekly_practice, monthly_practice, advanced_protocol, operational_instruction';
COMMENT ON COLUMN content_files.duration_minutes IS 'Estimated duration in minutes for exercises/practices';

