-- Add book type distinction to real_world_content
ALTER TABLE real_world_content
  ADD COLUMN IF NOT EXISTS book_type VARCHAR(50) CHECK (book_type IN ('non_fiction', 'fiction', 'both')),
  ADD COLUMN IF NOT EXISTS book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sausalito_location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS character_associations TEXT[],
  ADD COLUMN IF NOT EXISTS field_report_notes TEXT;

-- Add index for book_type filtering
CREATE INDEX IF NOT EXISTS idx_real_world_content_book_type ON real_world_content(book_type);
CREATE INDEX IF NOT EXISTS idx_real_world_content_book_id ON real_world_content(book_id);

-- Update existing records to default to 'both' if null
UPDATE real_world_content SET book_type = 'both' WHERE book_type IS NULL;
