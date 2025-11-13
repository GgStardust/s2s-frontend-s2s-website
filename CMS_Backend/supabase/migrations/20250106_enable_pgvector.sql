-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table for content files
CREATE TABLE IF NOT EXISTS content_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_file_id UUID NOT NULL REFERENCES content_files(id) ON DELETE CASCADE,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimension
  content_chunk TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS content_embeddings_embedding_idx
ON content_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for content_file_id lookups
CREATE INDEX IF NOT EXISTS content_embeddings_file_id_idx
ON content_embeddings(content_file_id);

-- Add comments
COMMENT ON TABLE content_embeddings IS 'Vector embeddings for semantic search across content files';
COMMENT ON COLUMN content_embeddings.embedding IS 'OpenAI text-embedding-3-small vector (1536 dimensions)';
COMMENT ON COLUMN content_embeddings.content_chunk IS 'Text chunk that was embedded (max ~8000 tokens)';
COMMENT ON COLUMN content_embeddings.chunk_index IS 'Order of chunk within source file';

-- Function to search similar content
CREATE OR REPLACE FUNCTION match_content(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  content_file_id UUID,
  content_chunk TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.content_file_id,
    ce.content_chunk,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM content_embeddings ce
  WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION match_content IS 'Search for similar content using vector similarity (cosine distance)';
