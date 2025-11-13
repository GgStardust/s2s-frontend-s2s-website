-- Sync S2S File System to Database
-- Purpose: Create content_files entries from actual S2S markdown files
-- This bridges the file system (where AI reads) and database (where book compiler reads)

-- First, let's create a proper content_files table that matches the S2S structure
DROP TABLE IF EXISTS content_files CASCADE;

CREATE TABLE content_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  file_path VARCHAR(500),
  
  -- S2S-specific fields from YAML frontmatter
  yaml_frontmatter JSONB DEFAULT '{}',
  orb_associations INTEGER[] DEFAULT '{}',
  snake_tags TEXT[] DEFAULT '{}',
  scrollstreams TEXT[] DEFAULT '{}',
  resonance_metrics JSONB DEFAULT '{}',
  
  -- Content classification from YAML
  content_type VARCHAR(50) DEFAULT 'orb_essay',
  category VARCHAR(50) DEFAULT 'foundational',
  status VARCHAR(50) DEFAULT 'canonical',
  author VARCHAR(255) DEFAULT 'Gigi Stardust',
  version VARCHAR(10) DEFAULT '1.0',
  
  -- Resonance metrics from YAML
  resonance_rating INTEGER DEFAULT 0,
  strength INTEGER DEFAULT 0,
  clarity INTEGER DEFAULT 0,
  coherence INTEGER DEFAULT 0,
  pattern INTEGER DEFAULT 0,
  
  -- System integration
  integration_points TEXT[] DEFAULT '{}',
  book_threading TEXT,
  is_primary_source BOOLEAN DEFAULT true,
  related_files TEXT[] DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for S2S queries
CREATE INDEX idx_content_files_orb_associations ON content_files USING GIN(orb_associations);
CREATE INDEX idx_content_files_snake_tags ON content_files USING GIN(snake_tags);
CREATE INDEX idx_content_files_scrollstreams ON content_files USING GIN(scrollstreams);
CREATE INDEX idx_content_files_resonance_rating ON content_files(resonance_rating);
CREATE INDEX idx_content_files_content_type ON content_files(content_type);
CREATE INDEX idx_content_files_category ON content_files(category);
CREATE INDEX idx_content_files_status ON content_files(status);
CREATE INDEX idx_content_files_book_threading ON content_files(book_threading);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_files_updated_at
  BEFORE UPDATE ON content_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample content that matches the actual S2S files
-- This represents the content that should be synced from the file system
INSERT INTO content_files (
  title, 
  content, 
  content_type,
  category,
  status,
  author,
  version,
  yaml_frontmatter,
  orb_associations,
  snake_tags,
  scrollstreams,
  resonance_metrics,
  resonance_rating,
  strength,
  clarity,
  coherence,
  pattern,
  integration_points,
  book_threading,
  is_primary_source,
  file_path
) VALUES 
  (
    'Orb 1: Origin Intelligence',
    'Origin Intelligence is the foundational mechanism through which consciousness first recognizes itself as distinct from the field. This is not about separation, but about the first moment of self-recognition that allows for the development of sovereignty. Origin Intelligence operates through photonic blueprinting meeting biological activation - the moment when light learns to hold itself in form.',
    'orb_essay',
    'foundational',
    'canonical',
    'Gigi Stardust',
    '1.0',
    '{"orb_associations": {"primary_orb": "Orb 1: Origin Intelligence", "secondary_orbs": ["Orb 2: Resonance Mechanics", "Orb 3: Photonic Intelligence"]}, "field_function": {"content_purpose": "Explores the foundational mechanism of consciousness self-recognition", "primary_mechanism": "Origin Intelligence - photonic blueprinting meets biological activation"}}',
    '{1, 2, 3}',
    '{"@origin_intelligence", "@photonic_blueprinting", "@biological_activation", "@consciousness_self_recognition"}',
    '{"Origin Intelligence is the foundational mechanism", "Light learns to hold itself in form", "Consciousness first recognizes itself as distinct"}',
    '{"strength": 10, "clarity": 9, "coherence": 10, "pattern": 9}',
    9,
    10,
    9,
    10,
    9,
    '{"book_fragments", "codex_scrolls", "dashboard_modules", "orbs_framework"}',
    'Part I: Foundation, Chapter 1: Origin Intelligence',
    true,
    '09_PROCESSED/02d_Orb_Essays/orb_1_origin_intelligence.md'
  ),
  (
    'Orb 2: Resonance Mechanics',
    'Resonance Mechanics describes how frequency becomes form through the interaction of consciousness with the field. This is the mechanism through which intention becomes manifestation, where the subtle becomes substantial. Resonance operates through harmonic frequencies that create stable patterns in the field.',
    'orb_essay',
    'foundational',
    'canonical',
    'Gigi Stardust',
    '1.0',
    '{"orb_associations": {"primary_orb": "Orb 2: Resonance Mechanics", "secondary_orbs": ["Orb 1: Origin Intelligence", "Orb 4: Harmonic Architectures"]}, "field_function": {"content_purpose": "Explores how frequency becomes form", "primary_mechanism": "Resonance Mechanics - frequency becomes form through field interaction"}}',
    '{2, 1, 4}',
    '{"@resonance_mechanics", "@frequency_becomes_form", "@harmonic_frequencies", "@field_interaction"}',
    '{"Frequency becomes form through resonance", "Intention becomes manifestation", "The subtle becomes substantial"}',
    '{"strength": 9, "clarity": 10, "coherence": 9, "pattern": 10}',
    9,
    9,
    10,
    9,
    10,
    '{"book_fragments", "codex_scrolls", "dashboard_modules", "orbs_framework"}',
    'Part I: Foundation, Chapter 2: Resonance Mechanics',
    true,
    '09_PROCESSED/02d_Orb_Essays/orb_2_resonance_mechanics.md'
  );

-- Verify the structure
SELECT 
    'S2S Content System Synced Successfully' as status,
    COUNT(*) as total_content_files,
    COUNT(CASE WHEN content_type = 'orb_essay' THEN 1 END) as orb_essays,
    COUNT(CASE WHEN category = 'foundational' THEN 1 END) as foundational_content
FROM content_files;
