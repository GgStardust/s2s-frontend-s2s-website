-- FIX CMS BACKEND DATABASE ISSUES
-- Purpose: Fix all the database schema issues preventing the CMS from working
-- Created: 2025-01-25

-- Step 1: Fix orb_threads table - add missing auto_saved column
ALTER TABLE orb_threads 
ADD COLUMN IF NOT EXISTS auto_saved BOOLEAN DEFAULT FALSE;

-- Step 2: Create missing reflection_logs table for Field Console
CREATE TABLE IF NOT EXISTS reflection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_files(id) ON DELETE CASCADE,
  reflection_type VARCHAR(50) DEFAULT 'field_insight' CHECK (reflection_type IN (
    'field_insight', 'resonance_observation', 'coherence_note', 'sovereignty_moment'
  )),
  content TEXT NOT NULL,
  orb_associations INTEGER[] DEFAULT '{}',
  resonance_score DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Fix content_files table constraints
-- First, clean up any bad data
UPDATE content_files 
SET status = 'active' 
WHERE status IS NULL OR status NOT IN ('active', 'archived', 'draft');

UPDATE content_files 
SET content_type = 'essay' 
WHERE content_type IS NULL OR content_type NOT IN (
  'essay', 'scroll', 'anecdote', 'observation', 'codex_fragment', 
  'orb_essay', 's2s_codex', 'field_experience', 'research_note'
);

-- Step 4: Add missing columns to content_files if they don't exist
ALTER TABLE content_files 
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS file_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS resonance_score DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS coherence_score DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS sovereignty_score DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS energetic_profile JSONB DEFAULT '{}';

-- Step 5: Create content_embeddings table for research functionality
CREATE TABLE IF NOT EXISTS content_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_files(id) ON DELETE CASCADE,
  embedding VECTOR(1536), -- OpenAI embedding dimension
  similarity DECIMAL(5,4) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orb_threads_updated_at ON orb_threads(updated_at);
CREATE INDEX IF NOT EXISTS idx_orb_messages_thread_id ON orb_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_content_files_orb_associations ON content_files USING GIN(orb_associations);
CREATE INDEX IF NOT EXISTS idx_content_files_content_type ON content_files(content_type);
CREATE INDEX IF NOT EXISTS idx_reflection_logs_content_id ON reflection_logs(content_id);

-- Step 7: Insert default tenant if it doesn't exist
INSERT INTO tenants (id, name, slug, type, description, settings)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Gigi Stardust',
  'gigi-stardust',
  'individual',
  'Primary S2S system tenant',
  '{"resonance_analysis": true, "orb_tracking": true}'
) ON CONFLICT (slug) DO NOTHING;

-- Step 8: Add tenant_id to content_files if it doesn't exist
ALTER TABLE content_files 
ADD COLUMN IF NOT EXISTS tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000000' REFERENCES tenants(id);

-- Step 9: Update existing content_files to have tenant_id
UPDATE content_files 
SET tenant_id = '00000000-0000-0000-0000-000000000000' 
WHERE tenant_id IS NULL;

-- Step 10: Create a simple function to get content by tenant
CREATE OR REPLACE FUNCTION get_content_by_tenant(tenant_uuid UUID)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  content TEXT,
  content_type VARCHAR,
  orb_associations INTEGER[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cf.id,
    cf.title,
    cf.content,
    cf.content_type,
    cf.orb_associations,
    cf.tags,
    cf.created_at
  FROM content_files cf
  WHERE cf.tenant_id = tenant_uuid
  ORDER BY cf.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create a simple function to search content
CREATE OR REPLACE FUNCTION search_content(
  search_query TEXT,
  tenant_uuid UUID DEFAULT '00000000-0000-0000-0000-000000000000',
  content_type_filter VARCHAR DEFAULT NULL,
  orb_filter INTEGER DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  content TEXT,
  content_type VARCHAR,
  orb_associations INTEGER[],
  tags TEXT[],
  relevance_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cf.id,
    cf.title,
    cf.content,
    cf.content_type,
    cf.orb_associations,
    cf.tags,
    CASE 
      WHEN cf.title ILIKE '%' || search_query || '%' THEN 1.0
      WHEN cf.content ILIKE '%' || search_query || '%' THEN 0.8
      ELSE 0.5
    END as relevance_score
  FROM content_files cf
  WHERE cf.tenant_id = tenant_uuid
    AND (search_query IS NULL OR cf.title ILIKE '%' || search_query || '%' OR cf.content ILIKE '%' || search_query || '%')
    AND (content_type_filter IS NULL OR cf.content_type = content_type_filter)
    AND (orb_filter IS NULL OR orb_filter = ANY(cf.orb_associations))
  ORDER BY relevance_score DESC, cf.created_at DESC;
END;
$$ LANGUAGE plpgsql;

