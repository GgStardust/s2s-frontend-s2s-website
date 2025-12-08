-- Phase 2.5: Question Management System
-- Purpose: Add metadata fields to diagnostic_questions for question sets, sources, and inquiry context
-- Created: 2025-01-26
-- Part of: Console V3 Build Plan - Phase 2.5

-- Add question metadata fields to diagnostic_questions table
ALTER TABLE diagnostic_questions
  -- Question set classification
  ADD COLUMN IF NOT EXISTS question_set VARCHAR(50) DEFAULT 'beta' 
    CHECK (question_set IN ('beta', 'early_reader', 'inquiry', 'contextual', 'system_generated')),
  
  -- Source tracking
  ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'system_generated'
    CHECK (source IN ('early_reader_feedback', 'system_generated', 'user_submitted', 'beta_test')),
  
  -- Inquiry context (when to show this question)
  ADD COLUMN IF NOT EXISTS inquiry_context TEXT,
  
  -- Field state triggers (JSONB for flexible trigger conditions)
  ADD COLUMN IF NOT EXISTS triggers JSONB DEFAULT '{}',
  
  -- Follow-up question relationships
  ADD COLUMN IF NOT EXISTS follow_up_question_ids INTEGER[] DEFAULT '{}',
  
  -- Question priority/weight for selection
  ADD COLUMN IF NOT EXISTS selection_priority INTEGER DEFAULT 5 CHECK (selection_priority >= 1 AND selection_priority <= 10),
  
  -- Active status (for enabling/disabling questions)
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_diagnostic_questions_question_set ON diagnostic_questions(question_set);
CREATE INDEX IF NOT EXISTS idx_diagnostic_questions_source ON diagnostic_questions(source);
CREATE INDEX IF NOT EXISTS idx_diagnostic_questions_is_active ON diagnostic_questions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_diagnostic_questions_selection_priority ON diagnostic_questions(selection_priority);
CREATE INDEX IF NOT EXISTS idx_diagnostic_questions_triggers ON diagnostic_questions USING GIN(triggers);

-- Update existing questions to have default values
UPDATE diagnostic_questions
SET 
  question_set = COALESCE(question_set, 'beta'),
  source = COALESCE(source, 'system_generated'),
  is_active = COALESCE(is_active, true),
  selection_priority = COALESCE(selection_priority, 5)
WHERE question_set IS NULL OR source IS NULL OR is_active IS NULL OR selection_priority IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN diagnostic_questions.question_set IS 'Question set classification: beta (default set), early_reader (from book readers), inquiry (user-initiated), contextual (context-dependent), system_generated (AI-generated)';
COMMENT ON COLUMN diagnostic_questions.source IS 'Source of question: early_reader_feedback, system_generated, user_submitted, beta_test';
COMMENT ON COLUMN diagnostic_questions.inquiry_context IS 'When to show this question: e.g., "after_practice_3", "when_orb_5_active", "user_asks_about_timing"';
COMMENT ON COLUMN diagnostic_questions.triggers IS 'JSONB field state triggers: {"orb_profile": {"orb_5": 0.7}, "practice_readiness": {"practice_3": 0.8}, "sfi_state": "coherent"}';
COMMENT ON COLUMN diagnostic_questions.follow_up_question_ids IS 'Array of question IDs that should follow this question based on answer';
COMMENT ON COLUMN diagnostic_questions.selection_priority IS 'Priority for question selection (1-10, higher = more likely to be selected)';
COMMENT ON COLUMN diagnostic_questions.is_active IS 'Whether this question is active and should be included in question selection';

