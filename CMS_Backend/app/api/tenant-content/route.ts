/**
 * Tenant Content API - Tenant-specific content management
 * Created: 2025-01-24
 * Purpose: Sprint 1 - Multi-Tenant Architecture Foundation
 * Status: Core Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { withTenantAuth, createTenantResponse, TenantContext, applyTenantFilter } from '@/lib/auth/tenant-middleware';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';

/**
 * GET /api/tenant-content - Get tenant-specific content
 */
export const GET = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const content_type = searchParams.get('type');
      const status = searchParams.get('status') || 'published';
      const orb = searchParams.get('orb');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');
      const search = searchParams.get('search');

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      let query = serviceClient
        .from('content_files')
        .select(`
          id,
          title,
          content,
          type,
          status,
          orb_associations,
          tags,
          word_count,
          resonance_score,
          created_at,
          updated_at
        `)
        .eq('tenant_id', context.tenantId);

      // Apply filters
      if (content_type) query = query.eq('type', content_type);
      if (status) query = query.eq('status', status);
      if (orb) {
        const orbNumber = parseInt(orb);
        if (orbNumber >= 1 && orbNumber <= 13) {
          // Search for strings like "Orb 1: Origin Intelligence" in array
          query = query.filter('orb_associations', 'cs', `{Orb ${orbNumber}:}`);
        }
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      // Apply pagination
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: content, error } = await query;

      if (error) {
        console.error('Tenant content fetch error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch tenant content' },
          { status: 500 }
        );
      }

      // Filter by Orb pattern if specified (client-side filtering)
      let filteredContent = content || [];
      if (orb) {
        const orbNumber = parseInt(orb);
        if (orbNumber >= 1 && orbNumber <= 13) {
          const orbPattern = new RegExp(`^Orb\\s+${orbNumber}:`, 'i');
          filteredContent = filteredContent.filter((item: any) => {
            if (!item.orb_associations || !Array.isArray(item.orb_associations)) return false;
            return item.orb_associations.some((orbStr: string) => orbPattern.test(orbStr));
          });
        }
      }

      // Get content statistics
      const { data: stats, error: statsError } = await serviceClient
        .from('content_files')
        .select('type, status')
        .eq('tenant_id', context.tenantId);

      if (statsError) {
        console.error('Content stats error:', statsError);
      }

      // Calculate statistics
      const contentStats = {
        total: stats?.length || 0,
        by_type: stats?.reduce((acc: Record<string, number>, item: any) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {}) || {},
        by_status: stats?.reduce((acc: Record<string, number>, item: any) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {}) || {}
      };

      return createTenantResponse({
        content: filteredContent || [],
        total_count: filteredContent?.length || 0,
        statistics: contentStats,
        filters: {
          content_type: content_type || null,
          status,
          orb: orb || null,
          search: search || null,
          limit,
          offset
        }
      }, context);

    } catch (error) {
      console.error('Tenant content API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ['content_create']
  }
);

/**
 * POST /api/tenant-content - Create tenant-specific content
 */
export const POST = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const body = await request.json();
      const {
        title,
        content,
        type = 'codex_core',
        status = 'draft',
        orb_associations = [],
        tags = [],
        metadata = {}
      } = body;

      if (!title || !content) {
        return NextResponse.json(
          { error: 'Title and content are required' },
          { status: 400 }
        );
      }

      // Validate Orb associations
      const validOrbs = orb_associations.filter((orb: number) => 
        typeof orb === 'number' && orb >= 1 && orb <= 13
      );

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      // Create content file
      const { data: contentFile, error } = await serviceClient
        .from('content_files')
        .insert({
          title: title.trim(),
          content: content.trim(),
          type,
          status,
          tenant_id: context.tenantId,
          orb_associations: validOrbs,
          tags,
          metadata,
          word_count: content.trim().split(/\s+/).length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Content creation error:', error);
        return NextResponse.json(
          { error: 'Failed to create content' },
          { status: 500 }
        );
      }

      // Set up content access for tenant
      const { error: accessError } = await serviceClient
        .from('tenant_content_access')
        .insert({
          tenant_id: context.tenantId,
          content_id: contentFile.id,
          access_level: 'write',
          granted_by: context.userId
        });

      if (accessError) {
        console.error('Content access setup error:', accessError);
        // Continue anyway as content is created
      }

      return createTenantResponse({
        content: contentFile
      }, context, 201);

    } catch (error) {
      console.error('Tenant content creation API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ['content_create']
  }
);

/**
 * PUT /api/tenant-content - Update tenant content
 */
export const PUT = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const body = await request.json();
      const {
        content_id,
        title,
        content,
        type,
        status,
        orb_associations,
        tags,
        metadata
      } = body;

      if (!content_id) {
        return NextResponse.json(
          { error: 'Content ID is required' },
          { status: 400 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (title !== undefined) updateData.title = title.trim();
      if (content !== undefined) {
        updateData.content = content.trim();
        updateData.word_count = content.trim().split(/\s+/).length;
      }
      if (type !== undefined) updateData.type = type;
      if (status !== undefined) updateData.status = status;
      if (orb_associations !== undefined) {
        const validOrbs = orb_associations.filter((orb: number) => 
          typeof orb === 'number' && orb >= 1 && orb <= 13
        );
        updateData.orb_associations = validOrbs;
      }
      if (tags !== undefined) updateData.tags = tags;
      if (metadata !== undefined) updateData.metadata = metadata;

      const { data: contentFile, error } = await serviceClient
        .from('content_files')
        .update(updateData)
        .eq('id', content_id)
        .eq('tenant_id', context.tenantId) // Ensure user can only update their tenant's content
        .select()
        .single();

      if (error) {
        console.error('Content update error:', error);
        return NextResponse.json(
          { error: 'Failed to update content' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        content: contentFile
      }, context);

    } catch (error) {
      console.error('Tenant content update API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ['content_edit']
  }
);

/**
 * DELETE /api/tenant-content - Delete tenant content
 */
export const DELETE = withTenantAuth(
  async (request: NextRequest, context: TenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const content_id = searchParams.get('content_id');

      if (!content_id) {
        return NextResponse.json(
          { error: 'Content ID is required' },
          { status: 400 }
        );
      }

      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      // Delete content (this will cascade to related records)
      const { error } = await serviceClient
        .from('content_files')
        .delete()
        .eq('id', content_id)
        .eq('tenant_id', context.tenantId); // Ensure user can only delete their tenant's content

      if (error) {
        console.error('Content deletion error:', error);
        return NextResponse.json(
          { error: 'Failed to delete content' },
          { status: 500 }
        );
      }

      return createTenantResponse({
        message: 'Content deleted successfully',
        deleted_at: new Date().toISOString()
      }, context);

    } catch (error) {
      console.error('Tenant content deletion API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  {
    requireAuth: true,
    requiredPermissions: ['content_delete']
  }
);
