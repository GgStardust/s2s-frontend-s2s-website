-- Fix existing content_files data and add missing columns
-- Created: 2025-01-25
-- Purpose: Update existing data to match constraints, then add missing columns

-- First, let's see what content_type values exist and update them
UPDATE content_files 
SET content_type = 'essay' 
WHERE content_type IS NULL OR content_type NOT IN (
    'essay', 'scroll', 'anecdote', 'observation', 'codex_fragment', 
    'orb_essay', 's2s_codex', 'field_experience', 'research_note'
);

-- Add missing columns to content_files table
ALTER TABLE content_files 
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS file_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'essay',
ADD COLUMN IF NOT EXISTS orb_associations INTEGER[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS resonance_score DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS coherence_score DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS sovereignty_score DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS energetic_profile JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Update existing rows to have proper default values
UPDATE content_files 
SET 
    content_type = COALESCE(content_type, 'essay'),
    orb_associations = COALESCE(orb_associations, '{}'),
    tags = COALESCE(tags, '{}'),
    word_count = COALESCE(word_count, 0),
    resonance_score = COALESCE(resonance_score, 0.0),
    coherence_score = COALESCE(coherence_score, 0.0),
    sovereignty_score = COALESCE(sovereignty_score, 0.0),
    energetic_profile = COALESCE(energetic_profile, '{}'),
    status = COALESCE(status, 'active')
WHERE content_type IS NULL 
   OR orb_associations IS NULL 
   OR tags IS NULL 
   OR word_count IS NULL 
   OR resonance_score IS NULL 
   OR coherence_score IS NULL 
   OR sovereignty_score IS NULL 
   OR energetic_profile IS NULL 
   OR status IS NULL;

-- Now add constraints safely
DO $$
BEGIN
    -- Add content_type constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'content_files_content_type_check'
    ) THEN
        ALTER TABLE content_files 
        ADD CONSTRAINT content_files_content_type_check 
        CHECK (content_type IN (
            'essay', 'scroll', 'anecdote', 'observation', 'codex_fragment', 
            'orb_essay', 's2s_codex', 'field_experience', 'research_note'
        ));
    END IF;
    
    -- Add status constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'content_files_status_check'
    ) THEN
        ALTER TABLE content_files 
        ADD CONSTRAINT content_files_status_check 
        CHECK (status IN ('active', 'archived', 'draft'));
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_files_content_type ON content_files(content_type);
CREATE INDEX IF NOT EXISTS idx_content_files_status ON content_files(status);
CREATE INDEX IF NOT EXISTS idx_content_files_orb_associations ON content_files USING GIN(orb_associations);
CREATE INDEX IF NOT EXISTS idx_content_files_tags ON content_files USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_files_resonance ON content_files(resonance_score);

-- Insert sample content files for testing (only if they don't exist)
INSERT INTO content_files (title, content, content_type, orb_associations, tags, word_count)
SELECT 
    'Cosmic, Biological & Consciousness Dimensions',
    'This is a comprehensive exploration of the three fundamental dimensions that structure reality: the cosmic, biological, and consciousness dimensions. Each dimension operates according to its own principles while being interconnected through resonance patterns.',
    'orb_essay',
    '{1, 2, 3}',
    '{"consciousness", "cosmology", "biology", "resonance"}',
    1250
WHERE NOT EXISTS (
    SELECT 1 FROM content_files WHERE title = 'Cosmic, Biological & Consciousness Dimensions'
);

INSERT INTO content_files (title, content, content_type, orb_associations, tags, word_count)
SELECT 
    'The Living Blueprint for Transformation',
    'A detailed examination of how consciousness operates as a living blueprint, constantly evolving and adapting to new information while maintaining coherence across multiple scales.',
    's2s_codex',
    '{4, 5, 6}',
    '{"transformation", "blueprint", "consciousness", "evolution"}',
    980
WHERE NOT EXISTS (
    SELECT 1 FROM content_files WHERE title = 'The Living Blueprint for Transformation'
);
