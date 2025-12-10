-- Console V3 Diagnostic System Schema
-- Purpose: Create database structure for diagnostic-led Console V3
-- Includes: Diagnostic system, Pathway system, Practice system (all 12), Access system
-- Created: 2025-01-26

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- DIAGNOSTIC SYSTEM TABLES
-- ==============================================

-- Diagnostic Questions Table
-- NOTE: This table already exists with INTEGER id. We're not recreating it.
-- The existing table has: id (INTEGER), question_text, order_index, etc.
-- If you need to modify the existing table, do so separately.
-- CREATE TABLE IF NOT EXISTS diagnostic_questions (
--   id INTEGER PRIMARY KEY,
--   ...
-- );

-- Diagnostic Sessions Table
CREATE TABLE IF NOT EXISTS diagnostic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Will reference users table when available
  email VARCHAR(255), -- For preorder/access token flow
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  
  -- Diagnostic Results
  sfi_score DECIMAL(5,2), -- Sovereign Field Index score
  sfi_state VARCHAR(100), -- e.g. "coherent_forward_motion", "misaligned_momentum", etc.
  orb_profile JSONB DEFAULT '{}', -- {orb_1: number, orb_2: number, ...}
  undercurrent_profile JSONB DEFAULT '{}', -- {uc_1: number, ...}
  
  -- Practice Readiness Assessment
  foundational_readiness DECIMAL(3,2) DEFAULT 0.0,
  functional_readiness DECIMAL(3,2) DEFAULT 0.0,
  advanced_readiness DECIMAL(3,2) DEFAULT 0.0,
  practice_readiness_profile JSONB DEFAULT '{}', -- {practice_1: readiness_score, ...}
  
  -- Pathway Assignment
  recommended_pathway_template_id UUID, -- References pathway_templates
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diagnostic Responses Table
CREATE TABLE IF NOT EXISTS diagnostic_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES diagnostic_questions(id) ON DELETE CASCADE,
  raw_answer TEXT NOT NULL, -- The actual answer (string/JSON)
  derived_signal JSONB DEFAULT '{}', -- Normalized representation if needed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(session_id, question_id) -- One response per question per session
);

-- ==============================================
-- PATHWAY SYSTEM TABLES
-- ==============================================

-- Pathway Templates Table
CREATE TABLE IF NOT EXISTS pathway_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Orb & Practice Mapping
  orb_focus INTEGER[] DEFAULT '{}', -- Which Orbs this pathway emphasizes
  practice_sequence INTEGER[] DEFAULT '{}', -- Ordered list of practice_ids (1-12)
  primary_practice INTEGER CHECK (primary_practice >= 1 AND primary_practice <= 12),
  secondary_practices INTEGER[] DEFAULT '{}', -- Supporting practices
  
  -- Layer Classification
  layer_focus VARCHAR(50) CHECK (layer_focus IN ('foundational', 'functional', 'advanced', 'mixed')),
  
  -- Metadata
  est_duration_days INTEGER,
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pathway Steps Table
CREATE TABLE IF NOT EXISTS pathway_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_template_id UUID NOT NULL REFERENCES pathway_templates(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('reading', 'reflection', 'practice', 'console_module', 'codex_entry')),
  
  -- Content Reference
  codex_entry_id UUID, -- References codex_entries (when available)
  practice_id INTEGER CHECK (practice_id >= 1 AND practice_id <= 12),
  
  -- Step Details
  title VARCHAR(255),
  description TEXT,
  instructions TEXT,
  est_duration_minutes INTEGER,
  
  -- Dependencies
  requires_step_ids UUID[] DEFAULT '{}', -- Steps that must be completed first
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(pathway_template_id, step_number)
);

-- User Pathways Table
CREATE TABLE IF NOT EXISTS user_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Will reference users table when available
  email VARCHAR(255), -- For preorder/access token flow
  session_id UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
  pathway_template_id UUID NOT NULL REFERENCES pathway_templates(id) ON DELETE CASCADE,
  
  -- Progress State
  current_step_id UUID REFERENCES pathway_steps(id),
  completed_step_ids UUID[] DEFAULT '{}',
  progress_percentage DECIMAL(5,2) DEFAULT 0.0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Pathway Step Progress Table
CREATE TABLE IF NOT EXISTS user_pathway_step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_pathway_id UUID NOT NULL REFERENCES user_pathways(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES pathway_steps(id) ON DELETE CASCADE,
  
  status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_pathway_id, step_id)
);

-- ==============================================
-- PRACTICE SYSTEM (All 12 Practices)
-- ==============================================

-- Practices Reference Table (All 12)
CREATE TABLE IF NOT EXISTS practices (
  id INTEGER PRIMARY KEY CHECK (id >= 1 AND id <= 12),
  name VARCHAR(255) NOT NULL,
  layer VARCHAR(50) NOT NULL CHECK (layer IN ('foundational', 'functional', 'advanced')),
  
  -- Practice Details
  core_function TEXT,
  what_it_trains TEXT[] DEFAULT '{}',
  daily_expression TEXT,
  
  -- Paradigm Alignment
  paradigm_elements TEXT[] DEFAULT '{}', -- Which paradigm elements this practice expresses
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert All 12 Practices
INSERT INTO practices (id, name, layer, core_function) VALUES
  -- Foundational (1-4)
  (1, 'Field Awareness', 'foundational', 'Reality is understood as signal'),
  (2, 'De-Personing', 'foundational', 'Identity reorganizes as field instead of persona'),
  (3, 'Somatic Signal Activation', 'foundational', 'The body becomes interface, not container'),
  (4, 'Temporal Listening', 'foundational', 'Time becomes fluid instead of linear'),
  
  -- Functional (5-8)
  (5, 'Multi-Scale Tracking', 'functional', 'Perception becomes multidimensional'),
  (6, 'Source-Point Decisioning', 'functional', 'Sovereignty becomes the locus of choice'),
  (7, 'Pattern Rewriting', 'functional', 'Creation shifts from outcome to architecture'),
  (8, 'Signal Alignment', 'functional', 'Intuition integrates with larger networks of intelligence'),
  
  -- Advanced (9-12)
  (9, 'Field Merging / Coherence Weaving', 'advanced', 'Operate in shared fields without distortion'),
  (10, 'Sovereign Relational Dynamics', 'advanced', 'Relate without collapse, fusion, or projection'),
  (11, 'Temporal Constellation Navigation', 'advanced', 'Move across timelines and nodal points with precision'),
  (12, 'Origin-State Access', 'advanced', 'Function from the pre-identity source of coherence')
ON CONFLICT (id) DO NOTHING;

-- Practice-Orb Mapping Table
CREATE TABLE IF NOT EXISTS practice_orb_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id INTEGER NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  orb_number INTEGER NOT NULL CHECK (orb_number >= 1 AND orb_number <= 13),
  relationship_type VARCHAR(50) CHECK (relationship_type IN ('primary', 'secondary', 'supporting')),
  weight DECIMAL(3,2) DEFAULT 1.0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(practice_id, orb_number)
);

-- Insert Practice-Orb Mappings (from spec)
INSERT INTO practice_orb_mappings (practice_id, orb_number, relationship_type) VALUES
  -- Practice 1 → Orbs 1 & 8
  (1, 1, 'primary'), (1, 8, 'secondary'),
  -- Practice 2 → Orb 6
  (2, 6, 'primary'),
  -- Practice 3 → Orbs 3 & 7
  (3, 3, 'primary'), (3, 7, 'secondary'),
  -- Practice 4 → Orbs 5 & 7
  (4, 5, 'primary'), (4, 7, 'secondary'),
  -- Practice 5 → Orbs 4 & 6
  (5, 4, 'primary'), (5, 6, 'secondary'),
  -- Practice 6 → Orbs 2, 10, 12
  (6, 2, 'primary'), (6, 10, 'secondary'), (6, 12, 'secondary'),
  -- Practice 7 → Orbs 3, 4, 7
  (7, 3, 'primary'), (7, 4, 'secondary'), (7, 7, 'secondary'),
  -- Practice 8 → Orbs 1, 8, 12
  (8, 1, 'primary'), (8, 8, 'secondary'), (8, 12, 'secondary'),
  -- Practice 9 → Orbs 9, 11
  (9, 9, 'primary'), (9, 11, 'secondary'),
  -- Practice 10 → Orbs 10, 12
  (10, 10, 'primary'), (10, 12, 'secondary'),
  -- Practice 11 → Orbs 5, 9, 11
  (11, 5, 'primary'), (11, 9, 'secondary'), (11, 11, 'secondary'),
  -- Practice 12 → Orbs 1, 13
  (12, 1, 'primary'), (12, 13, 'secondary')
ON CONFLICT DO NOTHING;

-- ==============================================
-- ACCESS SYSTEM TABLES
-- ==============================================

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL, -- e.g. "LE_BOOK_PB", "CONSOLE_BETA", "CONSOLE_ONE_TIME"
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  billing_type VARCHAR(50) CHECK (billing_type IN ('one_time', 'subscription')),
  access_duration_days INTEGER, -- For one-time purchases
  includes_console_beta BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table (Preorder System)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  product_code VARCHAR(100) NOT NULL REFERENCES products(code),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'cancelled')),
  
  -- Shipping (for physical products)
  shipping_name VARCHAR(255),
  shipping_address TEXT,
  
  -- Payment
  payment_provider VARCHAR(50), -- e.g. "stripe", "shopify"
  payment_id VARCHAR(255), -- External payment ID
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access Tokens Table
CREATE TABLE IF NOT EXISTS access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Nullable until account is created
  email VARCHAR(255) NOT NULL,
  product_code VARCHAR(100) NOT NULL REFERENCES products(code),
  token VARCHAR(255) UNIQUE NOT NULL, -- Encoded token for claim flow
  status VARCHAR(50) DEFAULT 'unclaimed' CHECK (status IN ('unclaimed', 'active', 'expired', 'revoked')),
  
  -- Metadata
  metadata JSONB DEFAULT '{}', -- {preorder_batch: number, order_id: uuid, etc.}
  
  expires_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Products Table (Active Access Tracking)
CREATE TABLE IF NOT EXISTS user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Will reference users table when available
  email VARCHAR(255), -- For preorder/access token flow
  product_code VARCHAR(100) NOT NULL REFERENCES products(code),
  access_token_id UUID REFERENCES access_tokens(id),
  order_id UUID REFERENCES orders(id),
  
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'revoked')),
  
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_code) -- One active product per user
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Diagnostic System Indexes
-- NOTE: diagnostic_questions table already exists, so we only create indexes if they don't exist
-- The existing table uses 'order_index' not 'question_order'
CREATE INDEX IF NOT EXISTS idx_diagnostic_questions_order ON diagnostic_questions(order_index);
-- NOTE: layer_focus column doesn't exist in existing diagnostic_questions table, so skip this index
-- CREATE INDEX IF NOT EXISTS idx_diagnostic_questions_layer ON diagnostic_questions(layer_focus);
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_user ON diagnostic_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_email ON diagnostic_sessions(email);
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_status ON diagnostic_sessions(status);
CREATE INDEX IF NOT EXISTS idx_diagnostic_responses_session ON diagnostic_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_responses_question ON diagnostic_responses(question_id);

-- Pathway System Indexes
CREATE INDEX IF NOT EXISTS idx_pathway_templates_layer ON pathway_templates(layer_focus);
CREATE INDEX IF NOT EXISTS idx_pathway_steps_template ON pathway_steps(pathway_template_id);
CREATE INDEX IF NOT EXISTS idx_pathway_steps_order ON pathway_steps(pathway_template_id, step_number);
CREATE INDEX IF NOT EXISTS idx_user_pathways_user ON user_pathways(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pathways_email ON user_pathways(email);
CREATE INDEX IF NOT EXISTS idx_user_pathways_session ON user_pathways(session_id);
CREATE INDEX IF NOT EXISTS idx_user_pathways_status ON user_pathways(status);
CREATE INDEX IF NOT EXISTS idx_user_pathway_step_progress_pathway ON user_pathway_step_progress(user_pathway_id);
CREATE INDEX IF NOT EXISTS idx_user_pathway_step_progress_step ON user_pathway_step_progress(step_id);

-- Practice System Indexes
CREATE INDEX IF NOT EXISTS idx_practices_layer ON practices(layer);
CREATE INDEX IF NOT EXISTS idx_practice_orb_mappings_practice ON practice_orb_mappings(practice_id);
CREATE INDEX IF NOT EXISTS idx_practice_orb_mappings_orb ON practice_orb_mappings(orb_number);

-- Access System Indexes
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_access_tokens_email ON access_tokens(email);
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_access_tokens_status ON access_tokens(status);
CREATE INDEX IF NOT EXISTS idx_user_products_user ON user_products(user_id);
CREATE INDEX IF NOT EXISTS idx_user_products_email ON user_products(email);
CREATE INDEX IF NOT EXISTS idx_user_products_status ON user_products(status);

-- ==============================================
-- INITIAL PRODUCT DATA
-- ==============================================

-- Insert Limited Edition Products
INSERT INTO products (code, name, description, price, billing_type, includes_console_beta) VALUES
  ('LE_BOOK_PB', 'Limited Edition Book — Paperback', 'First print paperback with console beta access', 44.00, 'one_time', true),
  ('LE_BOOK_HB', 'Limited Edition Book — Cloth Hardback', 'First print hardback with console beta access', 55.00, 'one_time', true),
  ('LE_BOOK_DIGITAL', 'Limited Edition Book — Digital Edition', 'First digital edition with console beta access', 22.00, 'one_time', true),
  ('CONSOLE_BETA', 'Console Beta Access', 'Beta access to Console V3 (bundled with Limited Edition)', 0.00, 'one_time', true),
  ('CONSOLE_ONE_TIME', 'Console-Only Access (One-Time)', 'One-time console access (6-12 months)', NULL, 'one_time', true),
  ('CONSOLE_SUBSCRIPTION', 'Console-Only Access (Subscription)', 'Recurring console subscription', NULL, 'subscription', true)
ON CONFLICT (code) DO NOTHING;

