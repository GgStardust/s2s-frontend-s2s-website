-- Create scrollstreams table for social media content management
-- Created: 2025-01-24
-- Purpose: Support scrollstream functionality for S2S platform

CREATE TABLE IF NOT EXISTS scrollstreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  orb_associations INTEGER[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'published', 'archived')),
  schedule_date TIMESTAMP WITH TIME ZONE,
  social_platforms TEXT[] DEFAULT '{}',
  resonance_score DECIMAL(3,2) CHECK (resonance_score >= 0 AND resonance_score <= 10),
  scrollstream_type VARCHAR(20) DEFAULT 'pulse' CHECK (scrollstream_type IN ('pulse', 'transmission', 'field_note', 'orb_communication')),
  author TEXT,
  source_location TEXT,
  source_type TEXT DEFAULT 'Direct Transmission',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_scrollstreams_status ON scrollstreams(status);
CREATE INDEX IF NOT EXISTS idx_scrollstreams_created_at ON scrollstreams(created_at);
CREATE INDEX IF NOT EXISTS idx_scrollstreams_orb_associations ON scrollstreams USING GIN(orb_associations);
CREATE INDEX IF NOT EXISTS idx_scrollstreams_tags ON scrollstreams USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_scrollstreams_schedule_date ON scrollstreams(schedule_date) WHERE schedule_date IS NOT NULL;

-- Add comments
COMMENT ON TABLE scrollstreams IS 'Social media content and consciousness transmissions';
COMMENT ON COLUMN scrollstreams.content IS 'The main content/transmission text';
COMMENT ON COLUMN scrollstreams.orb_associations IS 'Array of Orb IDs (1-13) associated with this transmission';
COMMENT ON COLUMN scrollstreams.tags IS 'Content tags for categorization and search';
COMMENT ON COLUMN scrollstreams.status IS 'Publication status of the scrollstream';
COMMENT ON COLUMN scrollstreams.schedule_date IS 'When this scrollstream should be published (null = publish immediately)';
COMMENT ON COLUMN scrollstreams.social_platforms IS 'Platforms where this content should be shared';
COMMENT ON COLUMN scrollstreams.resonance_score IS 'Resonance rating from 0-10';
COMMENT ON COLUMN scrollstreams.scrollstream_type IS 'Type of consciousness transmission';
COMMENT ON COLUMN scrollstreams.author IS 'Author of the transmission';
COMMENT ON COLUMN scrollstreams.source_location IS 'Geographic location where transmission originated';
COMMENT ON COLUMN scrollstreams.source_type IS 'Type of source (Direct Transmission, Field Node, etc.)';





