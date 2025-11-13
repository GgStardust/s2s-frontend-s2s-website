-- Migration: Create orbital_context table for caching Orbital Brain analyses
-- This table stores cached Orbital context analyses to reduce API calls and improve performance

BEGIN;

-- Create orbital_context table for caching
CREATE TABLE IF NOT EXISTS orbital_context (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_hash VARCHAR(64) NOT NULL UNIQUE,
    orb_associations INTEGER[] DEFAULT '{}',
    undercurrent_links INTEGER[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    scrollstreams TEXT[] DEFAULT '{}',
    resonance_metrics JSONB DEFAULT '{}',
    codex_path VARCHAR(255) DEFAULT '/codex/',
    dashboard_component VARCHAR(100) DEFAULT 'general',
    source VARCHAR(20) DEFAULT 'api' CHECK (source IN ('api', 'local', 'cache')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orbital_context_content_hash ON orbital_context (content_hash);
CREATE INDEX IF NOT EXISTS idx_orbital_context_expires_at ON orbital_context (expires_at);
CREATE INDEX IF NOT EXISTS idx_orbital_context_source ON orbital_context (source);
CREATE INDEX IF NOT EXISTS idx_orbital_context_created_at ON orbital_context (created_at);

-- Create GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_orbital_context_orb_associations ON orbital_context USING GIN(orb_associations);
CREATE INDEX IF NOT EXISTS idx_orbital_context_undercurrent_links ON orbital_context USING GIN(undercurrent_links);
CREATE INDEX IF NOT EXISTS idx_orbital_context_tags ON orbital_context USING GIN(tags);

-- Add comments for documentation
COMMENT ON TABLE orbital_context IS 'Caches Orbital Brain analyses to reduce API calls and improve performance';
COMMENT ON COLUMN orbital_context.content_hash IS 'SHA-256 hash of content+title for unique identification';
COMMENT ON COLUMN orbital_context.orb_associations IS 'Array of Orb IDs (1-13) associated with the content';
COMMENT ON COLUMN orbital_context.undercurrent_links IS 'Array of Undercurrent IDs (1-12) linked to the content';
COMMENT ON COLUMN orbital_context.tags IS 'Array of canonical snake_case tags from S2S Tag Registry';
COMMENT ON COLUMN orbital_context.scrollstreams IS 'Array of extracted scrollstream pulses';
COMMENT ON COLUMN orbital_context.resonance_metrics IS 'JSON object with strength, clarity, coherence, pattern scores';
COMMENT ON COLUMN orbital_context.source IS 'Source of analysis: api, local, or cache';
COMMENT ON COLUMN orbital_context.expires_at IS 'When this cache entry expires (default 24 hours)';

-- Create function to clean up expired entries
CREATE OR REPLACE FUNCTION cleanup_expired_orbital_context()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM orbital_context 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get cache statistics
CREATE OR REPLACE FUNCTION get_orbital_context_stats()
RETURNS TABLE (
    total_entries BIGINT,
    expired_entries BIGINT,
    api_entries BIGINT,
    local_entries BIGINT,
    cache_entries BIGINT,
    avg_age_hours NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_entries,
        COUNT(*) FILTER (WHERE expires_at < NOW()) as expired_entries,
        COUNT(*) FILTER (WHERE source = 'api') as api_entries,
        COUNT(*) FILTER (WHERE source = 'local') as local_entries,
        COUNT(*) FILTER (WHERE source = 'cache') as cache_entries,
        ROUND(AVG(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600), 2) as avg_age_hours
    FROM orbital_context;
END;
$$ LANGUAGE plpgsql;

COMMIT;

