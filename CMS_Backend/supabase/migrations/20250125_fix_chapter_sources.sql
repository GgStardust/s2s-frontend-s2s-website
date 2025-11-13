-- Fix chapter sources schema issues
-- Created: 2025-01-25
-- Purpose: Fix database schema mismatches for chapter sources

-- Add missing columns to chapters table
ALTER TABLE chapters 
ADD COLUMN IF NOT EXISTS assigned_files UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS orb_focus VARCHAR(255),
ADD COLUMN IF NOT EXISTS scrollstreams TEXT[] DEFAULT '{}';

-- Update chapter_sources table to match API expectations
-- First, let's check if we need to rename the column
DO $$
BEGIN
    -- Check if source_file_id exists and file_id doesn't
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chapter_sources' AND column_name = 'source_file_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'chapter_sources' AND column_name = 'file_id'
    ) THEN
        -- Rename source_file_id to file_id to match API expectations
        ALTER TABLE chapter_sources RENAME COLUMN source_file_id TO file_id;
    END IF;
END $$;

-- Add missing columns to chapter_sources if they don't exist
ALTER TABLE chapter_sources 
ADD COLUMN IF NOT EXISTS source_type VARCHAR(50) DEFAULT 'essay',
ADD COLUMN IF NOT EXISTS source_content TEXT,
ADD COLUMN IF NOT EXISTS relevance_score DECIMAL(3,2) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS ai_suggested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS user_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS integration_notes TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chapter_sources_file_id ON chapter_sources(file_id);
CREATE INDEX IF NOT EXISTS idx_chapters_assigned_files ON chapters USING GIN(assigned_files);

-- Update existing chapter_sources to have proper source_type
UPDATE chapter_sources 
SET source_type = 'essay' 
WHERE source_type IS NULL;

-- Update existing chapters to have empty arrays for new columns
UPDATE chapters 
SET assigned_files = '{}', scrollstreams = '{}' 
WHERE assigned_files IS NULL OR scrollstreams IS NULL;





