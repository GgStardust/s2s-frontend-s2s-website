/**
 * Tenants API - Multi-tenant management
 * Created: 2025-01-24
 * Purpose: Sprint 1 - Multi-Tenant Architecture Foundation
 * Status: Core Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { withTenantAuth, createTenantResponse, TenantContext } from '@/lib/auth/tenant-middleware';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';

/**
 * GET /api/tenants - Get user's tenants
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
    
    // Get user's tenants with their roles
    const { data: userTenants, error } = await serviceClient
      .from('user_roles')
      .select(`
        role,
        permissions,
        resonance_access_level,
        status,
        tenants!inner(
          id,
          name,
          slug,
          type,
          description,
          subscription_tier,
          status,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .eq('tenants.status', 'active');

    if (error) {
      console.error('Tenants fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tenants' },
        { status: 500 }
      );
    }

    const tenants = userTenants?.map(ut => ({
      ...ut.tenants,
      user_role: ut.role,
      user_permissions: ut.permissions,
      resonance_access_level: ut.resonance_access_level
    })) || [];

    return NextResponse.json({
      tenants,
      total_count: tenants.length,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Tenants API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tenants - Create new tenant
 */
export const POST = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const body = await request.json();
      const {
        name,
        slug,
        type = 'individual',
        description,
        settings = {},
        resonance_settings = {}
      } = body;

      if (!name || !slug) {
        return NextResponse.json(
          { error: 'Name and slug are required' },
          { status: 400 }
        );
      }

      // Validate slug format
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return NextResponse.json(
          { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
          { status: 400 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      // Create tenant
      const { data: tenant, error: tenantError } = await serviceClient
        .from('tenants')
        .insert({
          name: name.trim(),
          slug,
          type,
          description: description?.trim(),
          settings,
          resonance_settings: {
            auto_analysis: true,
            pattern_detection: true,
            field_coherence_threshold: 0.7,
            sovereignty_tracking: true,
            orb_activation_threshold: 0.6,
            resonance_calculation_method: 'weighted_average',
            ...resonance_settings
          },
          subscription_tier: 'field_visitor',
          status: 'active'
        })
        .select()
        .single();

      if (tenantError) {
        console.error('Tenant creation error:', tenantError);
        return NextResponse.json(
          { error: 'Failed to create tenant' },
          { status: 500 }
        );
      }

      // Add creator as admin
      const { error: roleError } = await serviceClient
        .from('user_roles')
        .insert({
          user_id: context.userId,
          tenant_id: tenant.id,
          role: 'admin',
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
          resonance_access_level: 'sovereign',
          status: 'active'
        });

      if (roleError) {
        console.error('Role creation error:', roleError);
        // Clean up tenant if role creation fails
        await serviceClient.from('tenants').delete().eq('id', tenant.id);
        return NextResponse.json(
          { error: 'Failed to create user role' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        tenant: {
          ...tenant,
          user_role: 'admin',
          user_permissions: {
            content_create: true,
            content_edit: true,
            content_delete: true,
            resonance_analyze: true,
            book_compile: true,
            ai_companion: true,
            analytics_view: true,
            tenant_manage: true
          },
          resonance_access_level: 'sovereign'
        }
      }, context, 201);

    } catch (error) {
      console.error('Tenant creation API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ['tenant_manage']
  }
);

/**
 * PUT /api/tenants - Update tenant
 */
export const PUT = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const body = await request.json();
      const {
        tenant_id,
        name,
        description,
        settings,
        resonance_settings,
        subscription_tier
      } = body;

      if (!tenant_id) {
        return NextResponse.json(
          { error: 'Tenant ID is required' },
          { status: 400 }
        );
      }

      // Verify user has access to this tenant
      if (tenant_id !== context.tenantId && !context.permissions.tenant_manage) {
        return NextResponse.json(
          { error: 'Forbidden: Cannot update this tenant' },
          { status: 403 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (settings !== undefined) updateData.settings = settings;
      if (resonance_settings !== undefined) updateData.resonance_settings = resonance_settings;
      if (subscription_tier !== undefined) updateData.subscription_tier = subscription_tier;

      const { data: tenant, error } = await serviceClient
        .from('tenants')
        .update(updateData)
        .eq('id', tenant_id)
        .select()
        .single();

      if (error) {
        console.error('Tenant update error:', error);
        return NextResponse.json(
          { error: 'Failed to update tenant' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        tenant
      }, context);

    } catch (error) {
      console.error('Tenant update API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ['tenant_manage']
  }
);

/**
 * DELETE /api/tenants - Delete tenant
 */
export const DELETE = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const tenant_id = searchParams.get('tenant_id');

      if (!tenant_id) {
        return NextResponse.json(
          { error: 'Tenant ID is required' },
          { status: 400 }
        );
      }

      // Verify user has access to this tenant
      if (tenant_id !== context.tenantId && !context.permissions.tenant_manage) {
        return NextResponse.json(
          { error: 'Forbidden: Cannot delete this tenant' },
          { status: 403 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      // Soft delete by setting status to inactive
      const { error } = await serviceClient
        .from('tenants')
        .update({
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', tenant_id);

      if (error) {
        console.error('Tenant deletion error:', error);
        return NextResponse.json(
          { error: 'Failed to delete tenant' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        message: 'Tenant deleted successfully',
        deleted_at: new Date().toISOString()
      }, context);

    } catch (error) {
      console.error('Tenant deletion API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ['tenant_manage']
  }
);
