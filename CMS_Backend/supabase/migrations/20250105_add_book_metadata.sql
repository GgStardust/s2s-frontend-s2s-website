-- Add metadata fields to books table
ALTER TABLE books
  ADD COLUMN IF NOT EXISTS purpose TEXT,
  ADD COLUMN IF NOT EXISTS overview TEXT,
  ADD COLUMN IF NOT EXISTS book_structure TEXT,
  ADD COLUMN IF NOT EXISTS table_of_contents TEXT;

-- Add metadata fields to chapters table
ALTER TABLE chapters
  ADD COLUMN IF NOT EXISTS orb_focus TEXT,
  ADD COLUMN IF NOT EXISTS source_file_ids UUID[],
  ADD COLUMN IF NOT EXISTS scrollstreams TEXT[];

-- Add core_themes and appendices as special "chapters" in Part 5 and Part 6
-- These will be handled as special sections in the UI
