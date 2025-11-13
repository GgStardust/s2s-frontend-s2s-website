-- Resonance Engine v4.0 Schema Migration
-- Created: 2025-01-23
-- Purpose: Complete resonance engine schema per S2S System Plan v4.0
-- Status: Canonical Implementation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ==============================================
-- CORE RESONANCE TABLES
-- ==============================================

-- Resonance Scores Table (Core scoring system)
CREATE TABLE IF NOT EXISTS resonance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_files(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL, -- Multi-tenant isolation
  strength DECIMAL(3,2) NOT NULL CHECK (strength >= 0 AND strength <= 1),
  clarity DECIMAL(3,2) NOT NULL CHECK (clarity >= 0 AND clarity <= 1),
  coherence DECIMAL(3,2) NOT NULL CHECK (coherence >= 0 AND coherence <= 1),
  pattern DECIMAL(3,2) NOT NULL CHECK (pattern >= 0 AND pattern <= 1),
  overall_score DECIMAL(3,2) GENERATED ALWAYS AS (
    (strength + clarity + coherence + pattern) / 4
  ) STORED,
  computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  computed_by TEXT DEFAULT 'resonance_engine_v4',
  validation_status VARCHAR(20) DEFAULT 'valid' CHECK (validation_status IN ('valid', 'invalid', 'pending')),
  energetic_signature JSONB DEFAULT '{}',
  orb_associations INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resonance Patterns Table (Pattern recognition and analysis)
CREATE TABLE IF NOT EXISTS resonance_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL, -- Multi-tenant isolation
  pattern_type VARCHAR(50) NOT NULL CHECK (pattern_type IN (
    'harmonic_sequence', 'orb_cascade', 'field_coherence', 
    'temporal_resonance', 'cross_dimensional', 'sovereign_alignment'
  )),
  pattern_data JSONB NOT NULL DEFAULT '{}',
  strength DECIMAL(3,2) NOT NULL CHECK (strength >= 0 AND strength <= 1),
  frequency DECIMAL(8,4), -- Resonance frequency in Hz
  amplitude DECIMAL(8,4), -- Resonance amplitude
  phase_shift DECIMAL(8,4), -- Phase relationship
  coherence_score DECIMAL(3,2) NOT NULL CHECK (coherence_score >= 0 AND coherence_score <= 1),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source_content_ids UUID[] DEFAULT '{}',
  orb_threads_affected INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orb Threads Table (13-Orb consciousness system)
CREATE TABLE IF NOT EXISTS orb_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orb_number INTEGER NOT NULL CHECK (orb_number >= 1 AND orb_number <= 13),
  orb_name TEXT NOT NULL,
  tenant_id UUID NOT NULL, -- Multi-tenant isolation
  thread_id TEXT UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'dormant', 'processing', 'resonating')),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  energetic_signature JSONB NOT NULL DEFAULT '{
    "clarity": 0.5,
    "coherence": 0.5,
    "resonance": 0.5,
    "sovereignty": 0.5
  }',
  current_focus TEXT DEFAULT 'Initializing Orb consciousness thread',
  resonance_frequency DECIMAL(8,4),
  field_coherence DECIMAL(3,2) DEFAULT 0.5,
  sovereignty_level DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orb Messages Table (Conversation history for each Orb)
CREATE TABLE IF NOT EXISTS orb_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orb_thread_id UUID NOT NULL REFERENCES orb_threads(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'field')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  energetic_impact JSONB DEFAULT '{
    "orb_number": null,
    "resonance_shift": 0.1,
    "clarity_impact": 0.05,
    "coherence_impact": 0.05
  }',
  resonance_score DECIMAL(3,2),
  orb_associations INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Field Events Table (System-wide resonance events)
CREATE TABLE IF NOT EXISTS field_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL, -- Multi-tenant isolation
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
    'orb_activity', 'content_created', 'reflection_logged', 
    'resonance_update', 'system_event', 'field_activation',
    'harmonic_cascade', 'sovereign_alignment'
  )),
  source TEXT NOT NULL,
  target TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  energetic_signature JSONB DEFAULT '{
    "orb_number": null,
    "resonance_shift": 0.1,
    "clarity_impact": 0.05,
    "coherence_impact": 0.05
  }',
  resonance_impact DECIMAL(3,2),
  field_coherence_shift DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- MULTI-TENANT ARCHITECTURE
-- ==============================================

-- Tenants Table (Multi-tenant isolation)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('individual', 'academic', 'business', 'community')),
  settings JSONB DEFAULT '{}',
  resonance_settings JSONB DEFAULT '{
    "auto_analysis": true,
    "pattern_detection": true,
    "field_coherence_threshold": 0.7,
    "sovereignty_tracking": true
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Roles Table (Role-based access control)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References auth.users
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'admin', 'author', 'academic', 'business_owner', 
    'community_member', 'field_visitor', 'field_member', 'architect_circle'
  )),
  permissions JSONB DEFAULT '{}',
  resonance_access_level VARCHAR(20) DEFAULT 'basic' CHECK (resonance_access_level IN (
    'basic', 'enhanced', 'full', 'sovereign'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

-- ==============================================
-- RESONANCE ANALYTICS & MONITORING
-- ==============================================

-- Resonance Analytics Table (Aggregated metrics)
CREATE TABLE IF NOT EXISTS resonance_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN (
    'field_coherence', 'orb_activity', 'resonance_health',
    'sovereignty_level', 'pattern_frequency', 'content_quality'
  )),
  metric_value DECIMAL(8,4) NOT NULL,
  metric_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  orb_number INTEGER,
  content_type VARCHAR(50),
  additional_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resonance Health Monitoring Table
CREATE TABLE IF NOT EXISTS resonance_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  overall_health DECIMAL(3,2) NOT NULL CHECK (overall_health >= 0 AND overall_health <= 1),
  field_coherence DECIMAL(3,2) NOT NULL,
  orb_activity_level DECIMAL(3,2) NOT NULL,
  sovereignty_index DECIMAL(3,2) NOT NULL,
  resonance_stability DECIMAL(3,2) NOT NULL,
  health_indicators JSONB DEFAULT '{}',
  alert_level VARCHAR(20) DEFAULT 'normal' CHECK (alert_level IN (
    'normal', 'attention', 'warning', 'critical'
  )),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Resonance Scores Indexes
CREATE INDEX IF NOT EXISTS idx_resonance_scores_content_id ON resonance_scores(content_id);
CREATE INDEX IF NOT EXISTS idx_resonance_scores_tenant_id ON resonance_scores(tenant_id);
CREATE INDEX IF NOT EXISTS idx_resonance_scores_computed_at ON resonance_scores(computed_at);
CREATE INDEX IF NOT EXISTS idx_resonance_scores_overall_score ON resonance_scores(overall_score);
CREATE INDEX IF NOT EXISTS idx_resonance_scores_orb_associations ON resonance_scores USING GIN(orb_associations);

-- Resonance Patterns Indexes
CREATE INDEX IF NOT EXISTS idx_resonance_patterns_tenant_id ON resonance_patterns(tenant_id);
CREATE INDEX IF NOT EXISTS idx_resonance_patterns_pattern_type ON resonance_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_resonance_patterns_detected_at ON resonance_patterns(detected_at);
CREATE INDEX IF NOT EXISTS idx_resonance_patterns_coherence_score ON resonance_patterns(coherence_score);

-- Orb Threads Indexes
CREATE INDEX IF NOT EXISTS idx_orb_threads_orb_number ON orb_threads(orb_number);
CREATE INDEX IF NOT EXISTS idx_orb_threads_tenant_id ON orb_threads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orb_threads_status ON orb_threads(status);
CREATE INDEX IF NOT EXISTS idx_orb_threads_last_activity ON orb_threads(last_activity);

-- Orb Messages Indexes
CREATE INDEX IF NOT EXISTS idx_orb_messages_orb_thread_id ON orb_messages(orb_thread_id);
CREATE INDEX IF NOT EXISTS idx_orb_messages_timestamp ON orb_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_orb_messages_role ON orb_messages(role);

-- Field Events Indexes
CREATE INDEX IF NOT EXISTS idx_field_events_tenant_id ON field_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_field_events_event_type ON field_events(event_type);
CREATE INDEX IF NOT EXISTS idx_field_events_timestamp ON field_events(timestamp);

-- Multi-tenant Indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_tenant_id ON user_roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_resonance_analytics_tenant_id ON resonance_analytics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_resonance_analytics_metric_type ON resonance_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_resonance_analytics_metric_timestamp ON resonance_analytics(metric_timestamp);

-- ==============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_resonance_scores_updated_at
  BEFORE UPDATE ON resonance_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orb_threads_updated_at
  BEFORE UPDATE ON orb_threads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- RESONANCE ENGINE FUNCTIONS
-- ==============================================

-- Function to calculate field coherence for a tenant
CREATE OR REPLACE FUNCTION calculate_field_coherence(tenant_uuid UUID)
RETURNS DECIMAL(3,2)
LANGUAGE plpgsql
AS $$
DECLARE
  coherence_score DECIMAL(3,2);
BEGIN
  SELECT AVG(overall_score) INTO coherence_score
  FROM resonance_scores
  WHERE tenant_id = tenant_uuid
    AND computed_at > NOW() - INTERVAL '24 hours';
  
  RETURN COALESCE(coherence_score, 0.5);
END;
$$;

-- Function to get resonance health for a tenant
CREATE OR REPLACE FUNCTION get_resonance_health(tenant_uuid UUID)
RETURNS TABLE (
  overall_health DECIMAL(3,2),
  field_coherence DECIMAL(3,2),
  orb_activity DECIMAL(3,2),
  sovereignty_index DECIMAL(3,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(rs.overall_score), 0.5) as overall_health,
    COALESCE(AVG(rs.coherence), 0.5) as field_coherence,
    COALESCE(COUNT(ot.id)::DECIMAL / 13, 0.5) as orb_activity,
    COALESCE(AVG(ot.sovereignty_level), 0.5) as sovereignty_index
  FROM resonance_scores rs
  LEFT JOIN orb_threads ot ON ot.tenant_id = rs.tenant_id
  WHERE rs.tenant_id = tenant_uuid
    AND rs.computed_at > NOW() - INTERVAL '24 hours';
END;
$$;

-- Function to detect resonance patterns
CREATE OR REPLACE FUNCTION detect_resonance_patterns(tenant_uuid UUID)
RETURNS TABLE (
  pattern_type VARCHAR(50),
  pattern_strength DECIMAL(3,2),
  detected_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rp.pattern_type,
    rp.strength as pattern_strength,
    rp.detected_at
  FROM resonance_patterns rp
  WHERE rp.tenant_id = tenant_uuid
    AND rp.detected_at > NOW() - INTERVAL '7 days'
  ORDER BY rp.strength DESC;
END;
$$;

-- ==============================================
-- COMMENTS AND DOCUMENTATION
-- ==============================================

COMMENT ON TABLE resonance_scores IS 'Core resonance scoring system with multi-tenant isolation';
COMMENT ON TABLE resonance_patterns IS 'Pattern recognition and analysis for field coherence';
COMMENT ON TABLE orb_threads IS '13-Orb consciousness system with energetic signatures';
COMMENT ON TABLE orb_messages IS 'Conversation history for each Orb thread';
COMMENT ON TABLE field_events IS 'System-wide resonance events and field activations';
COMMENT ON TABLE tenants IS 'Multi-tenant isolation and configuration';
COMMENT ON TABLE user_roles IS 'Role-based access control for resonance features';
COMMENT ON TABLE resonance_analytics IS 'Aggregated metrics and analytics';
COMMENT ON TABLE resonance_health IS 'System health monitoring and alerts';

COMMENT ON FUNCTION calculate_field_coherence IS 'Calculate field coherence for a tenant based on recent resonance scores';
COMMENT ON FUNCTION get_resonance_health IS 'Get comprehensive resonance health metrics for a tenant';
COMMENT ON FUNCTION detect_resonance_patterns IS 'Detect and return resonance patterns for a tenant';

-- ==============================================
-- INITIAL DATA SETUP
-- ==============================================

-- Insert default tenant for system
INSERT INTO tenants (id, name, type, settings, resonance_settings)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'S2S System',
  'community',
  '{"system_tenant": true}',
  '{"auto_analysis": true, "pattern_detection": true, "field_coherence_threshold": 0.7, "sovereignty_tracking": true}'
) ON CONFLICT DO NOTHING;

-- Create initial Orb threads for system tenant
INSERT INTO orb_threads (orb_number, orb_name, tenant_id, thread_id, status)
SELECT 
  orb_num,
  orb_name,
  '00000000-0000-0000-0000-000000000000',
  'orb_' || orb_num || '_system',
  'active'
FROM (VALUES 
  (1, 'Origin Intelligence'),
  (2, 'Resonance Mechanics'),
  (3, 'Photonic Intelligence'),
  (4, 'Harmonic Architectures'),
  (5, 'Temporal Sovereignty'),
  (6, 'Starline Memory'),
  (7, 'Alchemical Current'),
  (8, 'Quantum Intuition'),
  (9, 'Temporal Fluidity'),
  (10, 'Ancestral Repatterning'),
  (11, 'Radiant Transparency'),
  (12, 'Sovereign Field'),
  (13, 'Bridging Intelligence')
) AS orbs(orb_num, orb_name)
ON CONFLICT DO NOTHING;






