-- Book Compiler Schema
-- Created: 2025-01-05
-- Purpose: Database schema for intelligent book compilation system

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('non_fiction', 'fiction')),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'complete')),
  description TEXT,
  target_word_count INTEGER,
  current_word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  part_number INTEGER,
  part_title VARCHAR(255),
  status VARCHAR(50) DEFAULT 'outline' CHECK (status IN ('outline', 'draft', 'in_progress', 'complete')),
  word_count INTEGER DEFAULT 0,
  content TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);

-- Chapter sources table (tracks which content files are used in each chapter)
CREATE TABLE IF NOT EXISTS chapter_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  source_file_id UUID REFERENCES content_files(id) ON DELETE CASCADE,
  source_type VARCHAR(50) CHECK (source_type IN ('essay', 'scroll', 'anecdote', 'observation', 'codex_fragment')),
  source_content TEXT,
  relevance_score DECIMAL(3,2),
  ai_suggested BOOLEAN DEFAULT FALSE,
  user_confirmed BOOLEAN DEFAULT FALSE,
  integration_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chapter_id, source_file_id)
);

-- Real world content table (for capturing anecdotes, scenarios, observations as they happen)
CREATE TABLE IF NOT EXISTS real_world_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('anecdote', 'scenario', 'observation', 'field_activation')),
  content TEXT NOT NULL,
  location VARCHAR(255),
  orb_associations INTEGER[],
  chapter_suggestions UUID[],
  tags TEXT[],
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'integrated', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_type ON books(type);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_status ON chapters(status);
CREATE INDEX IF NOT EXISTS idx_chapter_sources_chapter_id ON chapter_sources(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_sources_source_file_id ON chapter_sources(source_file_id);
CREATE INDEX IF NOT EXISTS idx_real_world_content_status ON real_world_content(status);
CREATE INDEX IF NOT EXISTS idx_real_world_content_type ON real_world_content(type);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chapters_updated_at ON chapters;
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_real_world_content_updated_at ON real_world_content;
CREATE TRIGGER update_real_world_content_updated_at
  BEFORE UPDATE ON real_world_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert the two books
INSERT INTO books (title, type, description, status)
VALUES
  (
    'Stardust to Sovereignty',
    'non_fiction',
    'A comprehensive guide to consciousness technology and the 13-Orb framework for sovereignty',
    'in_progress'
  ),
  (
    'Future Primitive: Field Reports from Sausalito',
    'fiction',
    'Living transmissions from the field - authentic stories of consciousness activation in Sausalito',
    'in_progress'
  )
ON CONFLICT DO NOTHING;
