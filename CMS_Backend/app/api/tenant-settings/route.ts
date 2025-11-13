/**
 * Tenant Settings API - Tenant configuration management
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
 * GET /api/tenant-settings - Get tenant settings
 */
export const GET = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const setting_key = searchParams.get('key');
      const is_public = searchParams.get('public') === 'true';

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      let query = serviceClient
        .from('tenant_settings')
        .select('*')
        .eq('tenant_id', context.tenantId);

      // Apply filters
      if (setting_key) query = query.eq('setting_key', setting_key);
      if (is_public !== null) query = query.eq('is_public', is_public);

      const { data: settings, error } = await query;

      if (error) {
        console.error('Tenant settings fetch error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch tenant settings' },
          { status: 500 }
        );
      }

      // Get tenant info
      const { data: tenant, error: tenantError } = await serviceClient
        .from('tenants')
        .select('name, type, settings, resonance_settings, subscription_tier')
        .eq('id', context.tenantId)
        .single();

      if (tenantError) {
        console.error('Tenant info fetch error:', tenantError);
      }

      return createTenantResponse({
        settings: settings || [],
        tenant_info: tenant || null,
        total_count: settings?.length || 0,
        filters: {
          setting_key: setting_key || null,
          is_public: is_public !== null ? is_public : null
        }
      }, context);

    } catch (error) {
      console.error('Tenant settings API error:', error);
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
 * POST /api/tenant-settings - Create or update tenant setting
 */
export const POST = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const body = await request.json();
      const {
        setting_key,
        setting_value,
        setting_type = 'string',
        is_public = false
      } = body;

      if (!setting_key || setting_value === undefined) {
        return NextResponse.json(
          { error: 'Setting key and value are required' },
          { status: 400 }
        );
      }

      // Validate setting type
      const validTypes = ['string', 'number', 'boolean', 'json', 'array'];
      if (!validTypes.includes(setting_type)) {
        return NextResponse.json(
          { error: 'Invalid setting type' },
          { status: 400 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      // Check if setting already exists
      const { data: existingSetting, error: checkError } = await serviceClient
        .from('tenant_settings')
        .select('id')
        .eq('tenant_id', context.tenantId)
        .eq('setting_key', setting_key)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Setting check error:', checkError);
        return NextResponse.json(
          { error: 'Failed to check existing setting' },
          { status: 500 }
        );
      }

      let setting;
      if (existingSetting) {
        // Update existing setting
        const { data, error: updateError } = await serviceClient
          .from('tenant_settings')
          .update({
            setting_value,
            setting_type,
            is_public,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSetting.id)
          .select()
          .single();

        if (updateError) {
          console.error('Setting update error:', updateError);
          return NextResponse.json(
            { error: 'Failed to update tenant setting' },
            { status: 500 }
          );
        }
        setting = data;
      } else {
        // Create new setting
        const { data, error: createError } = await serviceClient
          .from('tenant_settings')
          .insert({
            tenant_id: context.tenantId,
            setting_key,
            setting_value,
            setting_type,
            is_public
          })
          .select()
          .single();

        if (createError) {
          console.error('Setting creation error:', createError);
          return NextResponse.json(
            { error: 'Failed to create tenant setting' },
            { status: 500 }
          );
        }
        setting = data;
      }

      return createTenantResponse({
        setting,
        action: existingSetting ? 'updated' : 'created'
      }, context, existingSetting ? 200 : 201);

    } catch (error) {
      console.error('Tenant setting creation API error:', error);
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
 * PUT /api/tenant-settings - Update tenant setting
 */
export const PUT = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const body = await request.json();
      const {
        setting_id,
        setting_value,
        setting_type,
        is_public
      } = body;

      if (!setting_id) {
        return NextResponse.json(
          { error: 'Setting ID is required' },
          { status: 400 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (setting_value !== undefined) updateData.setting_value = setting_value;
      if (setting_type !== undefined) updateData.setting_type = setting_type;
      if (is_public !== undefined) updateData.is_public = is_public;

      const { data: setting, error } = await serviceClient
        .from('tenant_settings')
        .update(updateData)
        .eq('id', setting_id)
        .eq('tenant_id', context.tenantId) // Ensure user can only update their tenant's settings
        .select()
        .single();

      if (error) {
        console.error('Tenant setting update error:', error);
        return NextResponse.json(
          { error: 'Failed to update tenant setting' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        setting
      }, context);

    } catch (error) {
      console.error('Tenant setting update API error:', error);
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
 * DELETE /api/tenant-settings - Delete tenant setting
 */
export const DELETE = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const setting_id = searchParams.get('setting_id');
      const setting_key = searchParams.get('setting_key');

      if (!setting_id && !setting_key) {
        return NextResponse.json(
          { error: 'Setting ID or key is required' },
          { status: 400 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      let query = serviceClient
        .from('tenant_settings')
        .delete()
        .eq('tenant_id', context.tenantId);

      if (setting_id) {
        query = query.eq('id', setting_id);
      } else if (setting_key) {
        query = query.eq('setting_key', setting_key);
      }

      const { error } = await query;

      if (error) {
        console.error('Tenant setting deletion error:', error);
        return NextResponse.json(
          { error: 'Failed to delete tenant setting' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        message: 'Tenant setting deleted successfully',
        deleted_at: new Date().toISOString()
      }, context);

    } catch (error) {
      console.error('Tenant setting deletion API error:', error);
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
