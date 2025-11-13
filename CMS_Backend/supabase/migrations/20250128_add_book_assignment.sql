-- Add book_assignment column to content_files table
-- Purpose: Mark content as 'none', 'ready_for_integration', or specific book assignment
-- Created: 2025-01-28

ALTER TABLE content_files 
ADD COLUMN IF NOT EXISTS book_assignment VARCHAR(50) DEFAULT 'none';

-- Create index for book assignment queries
CREATE INDEX IF NOT EXISTS idx_content_files_book_assignment 
ON content_files(book_assignment);






