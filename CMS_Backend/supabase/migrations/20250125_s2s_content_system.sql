-- S2S Content System Database Schema
-- Purpose: Create database structure that matches S2S resonance-based content system
-- This replaces the traditional CMS approach with S2S-specific architecture

-- Drop existing content_files table if it exists (we'll recreate it properly)
DROP TABLE IF EXISTS content_files CASCADE;

-- Create S2S content_files table with proper structure
CREATE TABLE content_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  file_path VARCHAR(500),
  
  -- S2S-specific fields
  yaml_frontmatter JSONB DEFAULT '{}',
  orb_associations INTEGER[] DEFAULT '{}',
  snake_tags TEXT[] DEFAULT '{}',
  scrollstreams TEXT[] DEFAULT '{}',
  resonance_metrics JSONB DEFAULT '{}',
  
  -- Content classification
  content_type VARCHAR(50) DEFAULT 'essay' CHECK (content_type IN (
    'orb_essay', 's2s_codex', 'book_fragment', 'scrollstream_entry', 
    'research_notes', 'field_experience', 'system_architecture'
  )),
  category VARCHAR(50) DEFAULT 'foundational' CHECK (category IN (
    'foundational', 'star_love_module', 'field_contact_module', 
    'galactic_architecture', 'layer_recognition_system'
  )),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('canonical', 'coherent_refined', 'active', 'draft', 'archived')),
  
  -- Resonance metrics
  resonance_rating INTEGER DEFAULT 0 CHECK (resonance_rating >= 0 AND resonance_rating <= 10),
  strength INTEGER DEFAULT 0 CHECK (strength >= 0 AND strength <= 10),
  clarity INTEGER DEFAULT 0 CHECK (clarity >= 0 AND clarity <= 10),
  coherence INTEGER DEFAULT 0 CHECK (coherence >= 0 AND coherence <= 10),
  pattern INTEGER DEFAULT 0 CHECK (pattern >= 0 AND pattern <= 10),
  
  -- System integration
  integration_points TEXT[] DEFAULT '{}',
  book_threading TEXT,
  is_primary_source BOOLEAN DEFAULT false,
  related_files TEXT[] DEFAULT '{}',
  
  -- Metadata
  author VARCHAR(255) DEFAULT 'Gigi Stardust',
  version VARCHAR(10) DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for S2S-specific queries
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

-- Insert sample S2S content with proper YAML frontmatter structure
INSERT INTO content_files (
  title, 
  content, 
  content_type, 
  category,
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
  is_primary_source
) VALUES 
  (
    'Cosmic, Biological & Consciousness Dimensions',
    'This is a comprehensive exploration of the three fundamental dimensions that structure reality: the cosmic, biological, and consciousness dimensions. Each dimension operates according to its own principles while being interconnected through resonance patterns.',
    'orb_essay',
    'foundational',
    '{"orb_associations": {"primary_orb": "Orb 1: Origin Intelligence", "secondary_orbs": ["Orb 2: Resonance Mechanics", "Orb 3: Field Dynamics"]}, "field_function": {"content_purpose": "Explores the three fundamental dimensions of reality", "primary_mechanism": "Origin Intelligence - establishes the foundational structure of dimensional awareness"}}',
    '{1, 2, 3}',
    '{"@origin_intelligence", "@resonance_mechanics", "@field_dynamics", "@dimensional_awareness"}',
    '{"Density becomes light through compression", "Every human body is architecture of layers", "Sovereignty is signal integrity"}',
    '{"strength": 9, "clarity": 8, "coherence": 8, "pattern": 7}',
    8,
    9,
    8,
    8,
    7,
    '{"book_fragments", "codex_scrolls", "dashboard_modules", "orbs_framework"}',
    'Part I: Foundation, Chapter 1: Dimensional Architecture',
    true
  ),
  (
    'The Living Blueprint for Transformation',
    'A detailed examination of how consciousness operates as a living blueprint, constantly evolving and adapting to new information while maintaining coherence across multiple scales.',
    's2s_codex',
    'foundational',
    '{"orb_associations": {"primary_orb": "Orb 4: Transformation Mechanics", "secondary_orbs": ["Orb 5: Coherence Patterns", "Orb 6: Sovereignty Architecture"]}, "field_function": {"content_purpose": "Examines consciousness as living blueprint", "primary_mechanism": "Transformation Mechanics - how consciousness evolves and adapts"}}',
    '{4, 5, 6}',
    '{"@transformation_mechanics", "@coherence_patterns", "@sovereignty_architecture", "@living_blueprint"}',
    '{"Consciousness is a living blueprint", "Transformation happens through resonance", "Sovereignty emerges from coherence"}',
    '{"strength": 8, "clarity": 9, "coherence": 9, "pattern": 8}',
    9,
    8,
    9,
    9,
    8,
    '{"book_fragments", "codex_scrolls", "dashboard_modules", "orbs_framework"}',
    'Part I: Foundation, Chapter 2: Living Architecture',
    true
  );

-- Verify the structure
SELECT 
    'S2S Content System Created Successfully' as status,
    COUNT(*) as total_content_files
FROM content_files;
