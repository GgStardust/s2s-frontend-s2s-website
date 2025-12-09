-- Phase 8: Inquiry Capability System
-- Purpose: Create tables for user-initiated inquiry questions and responses
-- Created: 2025-01-26
-- Part of: Console V3 Build Plan - Phase 8

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- INQUIRY SYSTEM TABLES
-- ==============================================

-- Inquiry Questions Table
-- Stores common inquiry questions (like the 53 early reader questions)
-- These are questions users might ask, not diagnostic questions
CREATE TABLE IF NOT EXISTS inquiry_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Question content
  question_text TEXT NOT NULL,
  question_description TEXT,
  category VARCHAR(100), -- e.g., 'orientation', 'integration', 'temporal', 'somatic', 'relational', etc.
  section VARCHAR(100), -- e.g., 'Section A', 'Section B', etc.
  
  -- Context and metadata
  inquiry_context TEXT, -- When this question typically arises
  tags TEXT[], -- Keywords for matching
  orb_associations INTEGER[], -- Which orbs this question relates to (1-13)
  undercurrent_associations INTEGER[], -- Which undercurrents this relates to (1-12)
  practice_associations INTEGER[], -- Which practices this relates to (1-12)
  
  -- Source tracking
  source VARCHAR(50) DEFAULT 'early_reader_feedback' 
    CHECK (source IN ('early_reader_feedback', 'system_generated', 'user_submitted', 'common_inquiry')),
  
  -- Usage tracking
  times_asked INTEGER DEFAULT 0,
  last_asked_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10), -- For ranking in responses
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiry Sessions Table
-- Tracks user inquiry sessions (when users ask questions)
CREATE TABLE IF NOT EXISTS inquiry_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email VARCHAR(255),
  session_id UUID, -- Links to diagnostic_session if applicable
  
  -- Context from user's current state
  sfi_score DECIMAL(5,2),
  sfi_state VARCHAR(100),
  orb_profile JSONB DEFAULT '{}',
  current_pathway_id UUID,
  current_practice_id INTEGER,
  
  -- Session metadata
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  inquiry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_inquiry_at TIMESTAMP WITH TIME ZONE
);

-- Inquiry Log Table
-- Logs each inquiry question asked and response given
CREATE TABLE IF NOT EXISTS inquiry_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_session_id UUID NOT NULL REFERENCES inquiry_sessions(id) ON DELETE CASCADE,
  
  -- The question asked
  user_question TEXT NOT NULL, -- What the user actually asked
  matched_inquiry_question_id UUID REFERENCES inquiry_questions(id), -- If it matched a known question
  
  -- The response
  response_text TEXT NOT NULL, -- The AI-generated response
  response_metadata JSONB DEFAULT '{}', -- RBI analysis, orb associations, etc.
  
  -- Context
  context_at_time JSONB DEFAULT '{}', -- User's field state when question was asked
  
  -- Feedback (optional)
  was_helpful BOOLEAN,
  feedback_text TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiry Learning Table
-- Tracks patterns in inquiries to improve the system
CREATE TABLE IF NOT EXISTS inquiry_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Pattern identification
  pattern_type VARCHAR(50), -- 'common_question', 'contextual_trigger', 'sequence_pattern', etc.
  pattern_data JSONB DEFAULT '{}', -- Pattern details
  
  -- Frequency
  occurrence_count INTEGER DEFAULT 1,
  first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Insights
  insights TEXT,
  suggested_actions JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

CREATE INDEX IF NOT EXISTS idx_inquiry_questions_category ON inquiry_questions(category);
CREATE INDEX IF NOT EXISTS idx_inquiry_questions_source ON inquiry_questions(source);
CREATE INDEX IF NOT EXISTS idx_inquiry_questions_is_active ON inquiry_questions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_inquiry_questions_tags ON inquiry_questions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_inquiry_questions_orb_associations ON inquiry_questions USING GIN(orb_associations);

CREATE INDEX IF NOT EXISTS idx_inquiry_sessions_user ON inquiry_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiry_sessions_email ON inquiry_sessions(email);
CREATE INDEX IF NOT EXISTS idx_inquiry_sessions_session_id ON inquiry_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_inquiry_sessions_status ON inquiry_sessions(status);

CREATE INDEX IF NOT EXISTS idx_inquiry_log_session ON inquiry_log(inquiry_session_id);
CREATE INDEX IF NOT EXISTS idx_inquiry_log_question ON inquiry_log(matched_inquiry_question_id);
CREATE INDEX IF NOT EXISTS idx_inquiry_log_created ON inquiry_log(created_at);

CREATE INDEX IF NOT EXISTS idx_inquiry_patterns_type ON inquiry_patterns(pattern_type);

-- ==============================================
-- COMMENTS FOR DOCUMENTATION
-- ==============================================

COMMENT ON TABLE inquiry_questions IS 'Common inquiry questions that users might ask. These are different from diagnostic questions - they are questions users ask US, not questions we ask them.';
COMMENT ON TABLE inquiry_sessions IS 'Tracks user inquiry sessions, linking to their diagnostic session and current field state';
COMMENT ON TABLE inquiry_log IS 'Logs each inquiry question and response for learning and improvement';
COMMENT ON TABLE inquiry_patterns IS 'Tracks patterns in user inquiries to evolve the inquiry system';

