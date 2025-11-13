/**
 * Multi-Tenant TypeScript Types
 * Created: 2025-01-24
 * Purpose: Sprint 1 - Multi-Tenant Architecture Foundation
 * Status: Core Implementation
 */

// ==============================================
// CORE MULTI-TENANT TYPES
// ==============================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: 'individual' | 'academic' | 'business' | 'community';
  description?: string;
  settings: Record<string, any>;
  resonance_settings: {
    auto_analysis: boolean;
    pattern_detection: boolean;
    field_coherence_threshold: number;
    sovereignty_tracking: boolean;
    orb_activation_threshold: number;
    resonance_calculation_method: 'weighted_average' | 'harmonic_mean' | 'sovereign_alignment';
  };
  subscription_tier: 'field_visitor' | 'field_member' | 'architect_circle' | 'enterprise';
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  tenant_id: string;
  role: 'admin' | 'author' | 'academic' | 'business_owner' | 
        'community_member' | 'field_visitor' | 'field_member' | 'architect_circle';
  permissions: {
    content_create: boolean;
    content_edit: boolean;
    content_delete: boolean;
    resonance_analyze: boolean;
    book_compile: boolean;
    ai_companion: boolean;
    analytics_view: boolean;
    tenant_manage: boolean;
  };
  resonance_access_level: 'basic' | 'enhanced' | 'full' | 'sovereign';
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface TenantContentAccess {
  id: string;
  tenant_id: string;
  content_id: string;
  access_level: 'read' | 'write' | 'admin';
  granted_by: string;
  granted_at: string;
  expires_at?: string;
}

export interface TenantSetting {
  id: string;
  tenant_id: string;
  setting_key: string;
  setting_value: any;
  setting_type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// ==============================================
// API REQUEST/RESPONSE TYPES
// ==============================================

export interface TenantCreateRequest {
  name: string;
  slug: string;
  type?: 'individual' | 'academic' | 'business' | 'community';
  description?: string;
  settings?: Record<string, any>;
  resonance_settings?: Partial<Tenant['resonance_settings']>;
}

export interface TenantUpdateRequest {
  tenant_id: string;
  name?: string;
  description?: string;
  settings?: Record<string, any>;
  resonance_settings?: Partial<Tenant['resonance_settings']>;
  subscription_tier?: Tenant['subscription_tier'];
}

export interface TenantResponse {
  tenant: Tenant & {
    user_role?: string;
    user_permissions?: UserRole['permissions'];
    resonance_access_level?: string;
  };
  total_count?: number;
  message?: string;
  generated_at: string;
}

export interface UserRoleCreateRequest {
  user_id: string;
  role: UserRole['role'];
  permissions?: Partial<UserRole['permissions']>;
  resonance_access_level?: UserRole['resonance_access_level'];
  status?: UserRole['status'];
}

export interface UserRoleUpdateRequest {
  role_id: string;
  role?: UserRole['role'];
  permissions?: Partial<UserRole['permissions']>;
  resonance_access_level?: UserRole['resonance_access_level'];
  status?: UserRole['status'];
}

export interface UserRoleResponse {
  user_role: UserRole;
  user_roles?: UserRole[];
  total_count?: number;
  action?: 'created' | 'updated';
  message?: string;
  generated_at: string;
}

export interface TenantContentRequest {
  content_type?: string;
  status?: string;
  orb?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface TenantContentResponse {
  content: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    status: string;
    orb_associations: number[];
    tags: string[];
    word_count: number;
    resonance_score?: number;
    created_at: string;
    updated_at: string;
  }>;
  total_count: number;
  statistics: {
    total: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
  };
  filters: {
    content_type?: string;
    status?: string;
    orb?: string;
    search?: string;
    limit: number;
    offset: number;
  };
  generated_at: string;
}

export interface TenantContentCreateRequest {
  title: string;
  content: string;
  type?: string;
  status?: string;
  orb_associations?: number[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TenantContentUpdateRequest {
  content_id: string;
  title?: string;
  content?: string;
  type?: string;
  status?: string;
  orb_associations?: number[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface TenantSettingsRequest {
  key?: string;
  public?: boolean;
}

export interface TenantSettingsResponse {
  settings: TenantSetting[];
  tenant_info?: {
    name: string;
    type: string;
    settings: Record<string, any>;
    resonance_settings: Record<string, any>;
    subscription_tier: string;
  };
  total_count: number;
  filters: {
    setting_key?: string;
    is_public?: boolean;
  };
  generated_at: string;
}

export interface TenantSettingCreateRequest {
  setting_key: string;
  setting_value: any;
  setting_type?: TenantSetting['setting_type'];
  is_public?: boolean;
}

export interface TenantSettingUpdateRequest {
  setting_id: string;
  setting_value?: any;
  setting_type?: TenantSetting['setting_type'];
  is_public?: boolean;
}

// ==============================================
// MIDDLEWARE TYPES
// ==============================================

export interface TenantContext {
  tenantId: string;
  userId: string;
  userRole: string;
  permissions: Record<string, boolean>;
  resonanceAccessLevel: string;
  tenantType: string;
  tenantName: string;
}

export interface TenantMiddlewareOptions {
  requireAuth?: boolean;
  requiredPermissions?: string[];
  requiredRole?: string;
  minResonanceAccess?: string;
  allowSystemTenant?: boolean;
}

// ==============================================
// UTILITY TYPES
// ==============================================

export interface TenantStats {
  total_tenants: number;
  active_tenants: number;
  total_users: number;
  content_count: number;
  by_type: Record<string, number>;
  by_subscription: Record<string, number>;
}

export interface UserTenantInfo {
  tenant_id: string;
  tenant_name: string;
  tenant_slug: string;
  tenant_type: string;
  user_role: string;
  resonance_access_level: string;
  permissions: Record<string, boolean>;
}

export interface TenantPermission {
  permission: string;
  description: string;
  required_role: string;
  resonance_level: string;
}

export interface TenantSubscriptionTier {
  tier: string;
  name: string;
  description: string;
  features: string[];
  limits: {
    content_files: number;
    users: number;
    storage_gb: number;
    api_calls_per_month: number;
  };
  pricing: {
    monthly: number;
    yearly: number;
  };
}

// ==============================================
// VALIDATION TYPES
// ==============================================

export interface TenantValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface RoleValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  permission_conflicts: string[];
}

export interface ContentAccessValidation {
  has_access: boolean;
  access_level: string;
  restrictions: string[];
  expires_at?: string;
}

// ==============================================
// ANALYTICS TYPES
// ==============================================

export interface TenantAnalytics {
  tenant_id: string;
  period: '24h' | '7d' | '30d' | '90d';
  metrics: {
    active_users: number;
    content_created: number;
    resonance_analyses: number;
    api_calls: number;
    storage_used_mb: number;
  };
  trends: {
    user_growth: number;
    content_growth: number;
    engagement_rate: number;
    resonance_health: number;
  };
  generated_at: string;
}

export interface TenantUsageReport {
  tenant_id: string;
  report_period: {
    start: string;
    end: string;
  };
  usage_summary: {
    total_users: number;
    active_users: number;
    content_files: number;
    api_calls: number;
    storage_used_mb: number;
  };
  subscription_usage: {
    tier: string;
    limits: Record<string, number>;
    usage: Record<string, number>;
    overages: Record<string, number>;
  };
  recommendations: string[];
  generated_at: string;
}

// ==============================================
// EXPORT ALL TYPES
// ==============================================

// All types are already exported as interfaces above
