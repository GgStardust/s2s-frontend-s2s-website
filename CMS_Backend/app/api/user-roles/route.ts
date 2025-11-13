/**
 * User Roles API - Role-based access control management
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
 * GET /api/user-roles - Get user roles for tenant
 */
export const GET = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const user_id = searchParams.get('user_id');
      const role = searchParams.get('role');
      const status = searchParams.get('status') || 'active';

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      let query = serviceClient
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          permissions,
          resonance_access_level,
          status,
          created_at,
          updated_at,
          tenants!inner(
            id,
            name,
            type
          )
        `)
        .eq('tenant_id', context.tenantId);

      // Apply filters
      if (user_id) query = query.eq('user_id', user_id);
      if (role) query = query.eq('role', role);
      if (status) query = query.eq('status', status);

      const { data: userRoles, error } = await query;

      if (error) {
        console.error('User roles fetch error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch user roles' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        user_roles: userRoles || [],
        total_count: userRoles?.length || 0,
        filters: {
          user_id: user_id || null,
          role: role || null,
          status
        }
      }, context);

    } catch (error) {
      console.error('User roles API error:', error);
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
 * POST /api/user-roles - Create or update user role
 */
export const POST = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const body = await request.json();
      const {
        user_id,
        role,
        permissions = {},
        resonance_access_level = 'basic',
        status = 'active'
      } = body;

      if (!user_id || !role) {
        return NextResponse.json(
          { error: 'User ID and role are required' },
          { status: 400 }
        );
      }

      // Validate role
      const validRoles = [
        'admin', 'author', 'academic', 'business_owner', 
        'community_member', 'field_visitor', 'field_member', 'architect_circle'
      ];
      
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role specified' },
          { status: 400 }
        );
      }

      // Validate resonance access level
      const validAccessLevels = ['basic', 'enhanced', 'full', 'sovereign'];
      if (!validAccessLevels.includes(resonance_access_level)) {
        return NextResponse.json(
          { error: 'Invalid resonance access level' },
          { status: 400 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      // Check if user role already exists
      const { data: existingRole, error: checkError } = await serviceClient
        .from('user_roles')
        .select('id')
        .eq('user_id', user_id)
        .eq('tenant_id', context.tenantId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Role check error:', checkError);
        return NextResponse.json(
          { error: 'Failed to check existing role' },
          { status: 500 }
        );
      }

      let userRole;
      if (existingRole) {
        // Update existing role
        const { data, error: updateError } = await serviceClient
          .from('user_roles')
          .update({
            role,
            permissions,
            resonance_access_level,
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRole.id)
          .select()
          .single();

        if (updateError) {
          console.error('Role update error:', updateError);
          return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
          );
        }
        userRole = data;
      } else {
        // Create new role
        const { data, error: createError } = await serviceClient
          .from('user_roles')
          .insert({
            user_id,
            tenant_id: context.tenantId,
            role,
            permissions,
            resonance_access_level,
            status
          })
          .select()
          .single();

        if (createError) {
          console.error('Role creation error:', createError);
          return NextResponse.json(
            { error: 'Failed to create user role' },
            { status: 500 }
          );
        }
        userRole = data;
      }

      return createTenantResponse({
        user_role: userRole,
        action: existingRole ? 'updated' : 'created'
      }, context, existingRole ? 200 : 201);

    } catch (error) {
      console.error('User role creation API error:', error);
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
 * PUT /api/user-roles - Update user role
 */
export const PUT = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const body = await request.json();
      const {
        role_id,
        role,
        permissions,
        resonance_access_level,
        status
      } = body;

      if (!role_id) {
        return NextResponse.json(
          { error: 'Role ID is required' },
          { status: 400 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (role !== undefined) updateData.role = role;
      if (permissions !== undefined) updateData.permissions = permissions;
      if (resonance_access_level !== undefined) updateData.resonance_access_level = resonance_access_level;
      if (status !== undefined) updateData.status = status;

      const { data: userRole, error } = await serviceClient
        .from('user_roles')
        .update(updateData)
        .eq('id', role_id)
        .eq('tenant_id', context.tenantId) // Ensure user can only update roles in their tenant
        .select()
        .single();

      if (error) {
        console.error('User role update error:', error);
        return NextResponse.json(
          { error: 'Failed to update user role' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        user_role: userRole
      }, context);

    } catch (error) {
      console.error('User role update API error:', error);
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
 * DELETE /api/user-roles - Remove user role
 */
export const DELETE = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const role_id = searchParams.get('role_id');
      const user_id = searchParams.get('user_id');

      if (!role_id && !user_id) {
        return NextResponse.json(
          { error: 'Role ID or User ID is required' },
          { status: 400 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      let query = serviceClient
        .from('user_roles')
        .delete()
        .eq('tenant_id', context.tenantId);

      if (role_id) {
        query = query.eq('id', role_id);
      } else if (user_id) {
        query = query.eq('user_id', user_id);
      }

      const { error } = await query;

      if (error) {
        console.error('User role deletion error:', error);
        return NextResponse.json(
          { error: 'Failed to delete user role' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        message: 'User role deleted successfully',
        deleted_at: new Date().toISOString()
      }, context);

    } catch (error) {
      console.error('User role deletion API error:', error);
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
