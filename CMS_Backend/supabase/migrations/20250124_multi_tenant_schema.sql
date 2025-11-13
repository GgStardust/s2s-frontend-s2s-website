-- Multi-Tenant Architecture Schema Migration
-- Created: 2025-01-24
-- Purpose: Sprint 1 - Multi-Tenant Architecture Foundation
-- Status: Core Implementation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- MULTI-TENANT CORE TABLES
-- ==============================================

-- Tenants Table (Multi-tenant isolation)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('individual', 'academic', 'business', 'community')),
  description TEXT,
  settings JSONB DEFAULT '{}',
  resonance_settings JSONB DEFAULT '{
    "auto_analysis": true,
    "pattern_detection": true,
    "field_coherence_threshold": 0.7,
    "sovereignty_tracking": true,
    "orb_activation_threshold": 0.6,
    "resonance_calculation_method": "weighted_average"
  }',
  subscription_tier VARCHAR(50) DEFAULT 'field_visitor' CHECK (subscription_tier IN (
    'field_visitor', 'field_member', 'architect_circle', 'enterprise'
  )),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
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
  permissions JSONB DEFAULT '{
    "content_create": true,
    "content_edit": true,
    "content_delete": false,
    "resonance_analyze": true,
    "book_compile": true,
    "ai_companion": true,
    "analytics_view": false,
    "tenant_manage": false
  }',
  resonance_access_level VARCHAR(20) DEFAULT 'basic' CHECK (resonance_access_level IN (
    'basic', 'enhanced', 'full', 'sovereign'
  )),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

-- Tenant Content Access Table (Content visibility per tenant)
CREATE TABLE IF NOT EXISTS tenant_content_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content_files(id) ON DELETE CASCADE,
  access_level VARCHAR(20) DEFAULT 'read' CHECK (access_level IN ('read', 'write', 'admin')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(tenant_id, content_id)
);

-- Tenant Settings Table (Tenant-specific configurations)
CREATE TABLE IF NOT EXISTS tenant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN (
    'string', 'number', 'boolean', 'json', 'array'
  )),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, setting_key)
);

-- ==============================================
-- UPDATE EXISTING TABLES FOR MULTI-TENANT
-- ==============================================

-- Add tenant_id to content_files if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'content_files' AND column_name = 'tenant_id') THEN
    ALTER TABLE content_files ADD COLUMN tenant_id UUID REFERENCES tenants(id);
  END IF;
END $$;

-- Add tenant_id to books if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'books' AND column_name = 'tenant_id') THEN
    ALTER TABLE books ADD COLUMN tenant_id UUID REFERENCES tenants(id);
  END IF;
END $$;

-- Add tenant_id to chapters if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'chapters' AND column_name = 'tenant_id') THEN
    ALTER TABLE chapters ADD COLUMN tenant_id UUID REFERENCES tenants(id);
  END IF;
END $$;

-- Add tenant_id to scrollstreams if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'scrollstreams' AND column_name = 'tenant_id') THEN
    ALTER TABLE scrollstreams ADD COLUMN tenant_id UUID REFERENCES tenants(id);
  END IF;
END $$;

-- Add tenant_id to real_world_content if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'real_world_content' AND column_name = 'tenant_id') THEN
    ALTER TABLE real_world_content ADD COLUMN tenant_id UUID REFERENCES tenants(id);
  END IF;
END $$;

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Tenants indexes
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_type ON tenants(type);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_subscription_tier ON tenants(subscription_tier);

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_tenant_id ON user_roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_status ON user_roles(status);
CREATE INDEX IF NOT EXISTS idx_user_roles_resonance_access ON user_roles(resonance_access_level);

-- Tenant content access indexes
CREATE INDEX IF NOT EXISTS idx_tenant_content_access_tenant_id ON tenant_content_access(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_content_access_content_id ON tenant_content_access(content_id);
CREATE INDEX IF NOT EXISTS idx_tenant_content_access_level ON tenant_content_access(access_level);

-- Tenant settings indexes
CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant_id ON tenant_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_settings_key ON tenant_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_tenant_settings_public ON tenant_settings(is_public);

-- Multi-tenant content indexes
CREATE INDEX IF NOT EXISTS idx_content_files_tenant_id ON content_files(tenant_id);
CREATE INDEX IF NOT EXISTS idx_books_tenant_id ON books(tenant_id);
CREATE INDEX IF NOT EXISTS idx_chapters_tenant_id ON chapters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_scrollstreams_tenant_id ON scrollstreams(tenant_id);
CREATE INDEX IF NOT EXISTS idx_real_world_content_tenant_id ON real_world_content(tenant_id);

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
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_settings_updated_at
  BEFORE UPDATE ON tenant_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- MULTI-TENANT FUNCTIONS
-- ==============================================

-- Function to get user's tenants
CREATE OR REPLACE FUNCTION get_user_tenants(user_uuid UUID)
RETURNS TABLE (
  tenant_id UUID,
  tenant_name VARCHAR(255),
  tenant_slug VARCHAR(100),
  tenant_type VARCHAR(50),
  user_role VARCHAR(50),
  resonance_access_level VARCHAR(20),
  permissions JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    t.slug as tenant_slug,
    t.type as tenant_type,
    ur.role as user_role,
    ur.resonance_access_level,
    ur.permissions
  FROM tenants t
  JOIN user_roles ur ON ur.tenant_id = t.id
  WHERE ur.user_id = user_uuid
    AND ur.status = 'active'
    AND t.status = 'active';
END;
$$;

-- Function to check user permission
CREATE OR REPLACE FUNCTION check_user_permission(
  user_uuid UUID,
  tenant_uuid UUID,
  permission_key TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  has_permission BOOLEAN := FALSE;
BEGIN
  SELECT (ur.permissions->permission_key)::BOOLEAN INTO has_permission
  FROM user_roles ur
  WHERE ur.user_id = user_uuid
    AND ur.tenant_id = tenant_uuid
    AND ur.status = 'active';
  
  RETURN COALESCE(has_permission, FALSE);
END;
$$;

-- Function to get tenant content with access control
CREATE OR REPLACE FUNCTION get_tenant_content(
  tenant_uuid UUID,
  user_uuid UUID,
  content_type_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  content_id UUID,
  title TEXT,
  content_type VARCHAR(50),
  access_level VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cf.id as content_id,
    cf.title,
    cf.type as content_type,
    tca.access_level,
    cf.created_at
  FROM content_files cf
  LEFT JOIN tenant_content_access tca ON tca.content_id = cf.id AND tca.tenant_id = tenant_uuid
  WHERE cf.tenant_id = tenant_uuid
    AND (content_type_filter IS NULL OR cf.type = content_type_filter)
    AND (tca.access_level IS NOT NULL OR cf.tenant_id = tenant_uuid)
  ORDER BY cf.created_at DESC;
END;
$$;

-- Function to create default tenant for new users
CREATE OR REPLACE FUNCTION create_default_tenant_for_user(user_uuid UUID, user_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  tenant_id UUID;
  user_domain TEXT;
BEGIN
  -- Extract domain from email for tenant slug
  user_domain := split_part(user_email, '@', 2);
  
  -- Create personal tenant
  INSERT INTO tenants (name, slug, type, description, subscription_tier)
  VALUES (
    'Personal Workspace',
    'personal-' || user_domain || '-' || extract(epoch from now())::text,
    'individual',
    'Personal workspace for ' || user_email,
    'field_visitor'
  )
  RETURNING id INTO tenant_id;
  
  -- Add user as admin of their personal tenant
  INSERT INTO user_roles (user_id, tenant_id, role, permissions, resonance_access_level)
  VALUES (
    user_uuid,
    tenant_id,
    'admin',
    '{
      "content_create": true,
      "content_edit": true,
      "content_delete": true,
      "resonance_analyze": true,
      "book_compile": true,
      "ai_companion": true,
      "analytics_view": true,
      "tenant_manage": true
    }',
    'sovereign'
  );
  
  RETURN tenant_id;
END;
$$;

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all multi-tenant tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_content_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see tenants they belong to
CREATE POLICY tenant_access_policy ON tenants
  FOR ALL TO authenticated
  USING (
    id IN (
      SELECT tenant_id FROM user_roles 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- RLS Policy: Users can only see their own roles
CREATE POLICY user_roles_policy ON user_roles
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- RLS Policy: Users can only see content access for their tenants
CREATE POLICY tenant_content_access_policy ON tenant_content_access
  FOR ALL TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_roles 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- RLS Policy: Users can only see settings for their tenants
CREATE POLICY tenant_settings_policy ON tenant_settings
  FOR ALL TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_roles 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- ==============================================
-- INITIAL DATA SETUP
-- ==============================================

-- Insert system tenant
INSERT INTO tenants (id, name, slug, type, description, subscription_tier, status)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'S2S System',
  's2s-system',
  'community',
  'System-wide tenant for S2S platform',
  'enterprise',
  'active'
) ON CONFLICT DO NOTHING;

-- ==============================================
-- COMMENTS AND DOCUMENTATION
-- ==============================================

COMMENT ON TABLE tenants IS 'Multi-tenant isolation and configuration';
COMMENT ON TABLE user_roles IS 'Role-based access control for multi-tenant system';
COMMENT ON TABLE tenant_content_access IS 'Content visibility and access control per tenant';
COMMENT ON TABLE tenant_settings IS 'Tenant-specific configuration settings';

COMMENT ON FUNCTION get_user_tenants IS 'Get all tenants a user belongs to with their roles';
COMMENT ON FUNCTION check_user_permission IS 'Check if user has specific permission in tenant';
COMMENT ON FUNCTION get_tenant_content IS 'Get tenant content with proper access control';
COMMENT ON FUNCTION create_default_tenant_for_user IS 'Create personal tenant for new users';

-- ==============================================
-- VALIDATION CONSTRAINTS
-- ==============================================

-- Ensure tenant slugs are URL-safe
ALTER TABLE tenants ADD CONSTRAINT check_tenant_slug_format 
  CHECK (slug ~ '^[a-z0-9-]+$');

-- Ensure tenant names are not empty
ALTER TABLE tenants ADD CONSTRAINT check_tenant_name_not_empty 
  CHECK (length(trim(name)) > 0);

-- Ensure user roles have valid permissions structure
ALTER TABLE user_roles ADD CONSTRAINT check_permissions_structure
  CHECK (permissions ? 'content_create' AND permissions ? 'resonance_analyze');

-- Ensure tenant settings have valid types
ALTER TABLE tenant_settings ADD CONSTRAINT check_setting_value_type
  CHECK (
    (setting_type = 'string' AND jsonb_typeof(setting_value) = 'string') OR
    (setting_type = 'number' AND jsonb_typeof(setting_value) = 'number') OR
    (setting_type = 'boolean' AND jsonb_typeof(setting_value) = 'boolean') OR
    (setting_type = 'json' AND jsonb_typeof(setting_value) = 'object') OR
    (setting_type = 'array' AND jsonb_typeof(setting_value) = 'array')
  );






