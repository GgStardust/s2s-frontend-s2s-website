-- Fix order_index constraint to allow more values
-- The existing constraint might be too restrictive
-- This migration modifies the constraint to allow values >= 1

-- Drop existing constraint if it exists
ALTER TABLE diagnostic_questions 
  DROP CONSTRAINT IF EXISTS diagnostic_questions_order_index_check;

-- Add new constraint that allows any positive integer
ALTER TABLE diagnostic_questions
  ADD CONSTRAINT diagnostic_questions_order_index_check 
  CHECK (order_index >= 1);

