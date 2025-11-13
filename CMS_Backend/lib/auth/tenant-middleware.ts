/**
 * Tenant Middleware - Multi-tenant security and access control
 * Created: 2025-01-24
 * Purpose: Sprint 1 - Multi-Tenant Architecture Foundation
 * Status: Core Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

/**
 * Extract tenant context from request
 */
export async function extractTenantContext(
  request: NextRequest,
  options: TenantMiddlewareOptions = {}
): Promise<TenantContext | null> {
  try {
    const supabase = createClient();
    
    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      if (options.requireAuth) {
        return null;
      }
      // Allow system tenant for public access
      if (options.allowSystemTenant) {
        return {
          tenantId: '00000000-0000-0000-0000-000000000000',
          userId: 'system',
          userRole: 'system',
          permissions: {
            content_create: true,
            content_edit: true,
            content_delete: true,
            resonance_analyze: true,
            book_compile: true,
            ai_companion: true,
            analytics_view: true,
            tenant_manage: true
          },
          resonanceAccessLevel: 'sovereign',
          tenantType: 'community',
          tenantName: 'S2S System'
        };
      }
      return null;
    }

    // Extract tenant from headers or query params
    const tenantId = request.headers.get('x-tenant-id') || 
                    request.nextUrl.searchParams.get('tenant_id') ||
                    '00000000-0000-0000-0000-000000000000';

    // Get user's role and permissions for this tenant
    const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
    
    const { data: userRole, error: roleError } = await serviceClient
      .from('user_roles')
      .select(`
        role,
        permissions,
        resonance_access_level,
        status,
        tenants!inner(
          id,
          name,
          type,
          status
        )
      `)
      .eq('user_id', user.id)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .eq('tenants.status', 'active')
      .single();

    if (roleError || !userRole) {
      return null;
    }

    return {
      tenantId,
      userId: user.id,
      userRole: userRole.role,
      permissions: userRole.permissions || {},
      resonanceAccessLevel: userRole.resonance_access_level,
      tenantType: userRole.tenants[0]?.type || 'community',
      tenantName: userRole.tenants[0]?.name || 'Unknown Tenant'
    };

  } catch (error) {
    console.error('Tenant context extraction error:', error);
    return null;
  }
}

/**
 * Validate user permissions
 */
export function validatePermissions(
  context: TenantContext,
  options: TenantMiddlewareOptions
): boolean {
  // Check required role
  if (options.requiredRole && context.userRole !== options.requiredRole) {
    return false;
  }

  // Check required permissions
  if (options.requiredPermissions) {
    for (const permission of options.requiredPermissions) {
      if (!context.permissions[permission]) {
        return false;
      }
    }
  }

  // Check resonance access level
  if (options.minResonanceAccess) {
    const accessLevels = ['basic', 'enhanced', 'full', 'sovereign'];
    const userLevel = accessLevels.indexOf(context.resonanceAccessLevel);
    const requiredLevel = accessLevels.indexOf(options.minResonanceAccess);
    
    if (userLevel < requiredLevel) {
      return false;
    }
  }

  return true;
}

/**
 * Tenant middleware wrapper
 */
export function withTenantAuth(
  handler: (request: NextRequest, context: TenantContext) => Promise<NextResponse>,
  options: TenantMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Extract tenant context
      const tenantContext = await extractTenantContext(request, options);
      
      if (!tenantContext) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid tenant context' },
          { status: 401 }
        );
      }

      // Validate permissions
      if (!validatePermissions(tenantContext, options)) {
        return NextResponse.json(
          { error: 'Forbidden: Insufficient permissions' },
          { status: 403 }
        );
      }

      // Add tenant context to request headers for downstream use
      request.headers.set('x-tenant-context', JSON.stringify(tenantContext));

      // Call the actual handler
      return await handler(request, tenantContext);

    } catch (error) {
      console.error('Tenant middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Get tenant context from request headers
 */
export function getTenantContext(request: NextRequest): TenantContext | null {
  try {
    const contextHeader = request.headers.get('x-tenant-context');
    if (!contextHeader) return null;
    
    return JSON.parse(contextHeader) as TenantContext;
  } catch (error) {
    console.error('Error parsing tenant context:', error);
    return null;
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(
  context: TenantContext,
  permission: string
): boolean {
  return context.permissions[permission] === true;
}

/**
 * Check if user has minimum resonance access level
 */
export function hasResonanceAccess(
  context: TenantContext,
  requiredLevel: string
): boolean {
  const accessLevels = ['basic', 'enhanced', 'full', 'sovereign'];
  const userLevel = accessLevels.indexOf(context.resonanceAccessLevel);
  const requiredLevelIndex = accessLevels.indexOf(requiredLevel);
  
  return userLevel >= requiredLevelIndex;
}

/**
 * Get tenant-scoped Supabase client
 */
export function getTenantScopedClient(tenantId: string) {
  return createServiceClient(supabaseUrl, supabaseServiceKey, {
    global: {
      headers: {
        'x-tenant-id': tenantId
      }
    }
  });
}

/**
 * Apply tenant filter to Supabase query
 */
export function applyTenantFilter(
  query: any,
  tenantId: string,
  tableName: string
) {
  return query.eq(`${tableName}.tenant_id`, tenantId);
}

/**
 * Validate tenant access to content
 */
export async function validateContentAccess(
  contentId: string,
  tenantId: string,
  userId: string
): Promise<boolean> {
  try {
    const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
    
    // Check if content belongs to tenant
    const { data: content, error: contentError } = await serviceClient
      .from('content_files')
      .select('tenant_id')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      return false;
    }

    // Check if content belongs to user's tenant
    if (content.tenant_id !== tenantId) {
      return false;
    }

    // Check if user has access to this content
    const { data: access, error: accessError } = await serviceClient
      .from('tenant_content_access')
      .select('access_level')
      .eq('tenant_id', tenantId)
      .eq('content_id', contentId)
      .single();

    // If no specific access record, allow if content belongs to tenant
    if (accessError && accessError.code === 'PGRST116') {
      return true;
    }

    return Boolean(access && access.access_level !== 'none');

  } catch (error) {
    console.error('Content access validation error:', error);
    return false;
  }
}

/**
 * Create tenant-scoped API response
 */
export function createTenantResponse(
  data: any,
  context: TenantContext,
  status: number = 200
): NextResponse {
  return NextResponse.json({
    data,
    tenant: {
      id: context.tenantId,
      name: context.tenantName,
      type: context.tenantType
    },
    user: {
      role: context.userRole,
      resonance_access: context.resonanceAccessLevel
    },
    generated_at: new Date().toISOString()
  }, { status });
}

/**
 * Middleware for content operations
 */
export const contentAuth = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    // This will be overridden by specific route handlers
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
  },
  {
    requireAuth: true,
    requiredPermissions: ['content_create', 'content_edit']
  }
);

/**
 * Middleware for resonance operations
 */
export const resonanceAuth = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    // This will be overridden by specific route handlers
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
  },
  {
    requireAuth: true,
    requiredPermissions: ['resonance_analyze'],
    minResonanceAccess: 'basic'
  }
);

/**
 * Middleware for admin operations
 */
export const adminAuth = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    // This will be overridden by specific route handlers
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
  },
  {
    requireAuth: true,
    requiredRole: 'admin',
    requiredPermissions: ['tenant_manage']
  }
);
