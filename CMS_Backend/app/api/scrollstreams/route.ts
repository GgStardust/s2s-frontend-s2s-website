/**
 * Scrollstreams API - Social media content management
 * Created: 2025-01-23
 * Purpose: Backend completion for S2S System Plan v4.0
 * Status: Core API Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';

/**
 * GET /api/scrollstreams - Get scrollstream content
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const orb = searchParams.get('orb');
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('scrollstreams')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by Orb if specified
    if (orb) {
      const orbNumber = parseInt(orb);
      if (orbNumber >= 1 && orbNumber <= 13) {
        // Search for strings like "Orb 1: Origin Intelligence" in array
        query = query.filter('orb_associations', 'cs', `{Orb ${orbNumber}:}`);
      }
    }

    const { data: scrollstreams, error } = await query;

    if (error) {
      console.error('Scrollstreams fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch scrollstreams' },
        { status: 500 }
      );
    }

    // Filter by Orb pattern if specified (client-side filtering)
    let filteredScrollstreams = scrollstreams || [];
    if (orb) {
      const orbNumber = parseInt(orb);
      if (orbNumber >= 1 && orbNumber <= 13) {
        const orbPattern = new RegExp(`^Orb\\s+${orbNumber}:`, 'i');
        filteredScrollstreams = filteredScrollstreams.filter((item: any) => {
          if (!item.orb_associations || !Array.isArray(item.orb_associations)) return false;
          return item.orb_associations.some((orbStr: string) => orbPattern.test(orbStr));
        });
      }
    }

    return NextResponse.json({
      scrollstreams: filteredScrollstreams,
      total_count: filteredScrollstreams?.length || 0,
      filters: {
        orb: orb || null,
        status,
        limit,
        offset
      },
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scrollstreams API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scrollstreams - Create new scrollstream content
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    
    const {
      content,
      orb_associations = [],
      tags = [],
      status = 'draft',
      schedule_date,
      social_platforms = [],
      resonance_score,
      scrollstream_type = 'pulse'
    } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Validate Orb associations (1-13)
    const validOrbs = orb_associations.filter((orb: number) => 
      typeof orb === 'number' && orb >= 1 && orb <= 13
    );

    // Create scrollstream entry
    const { data: scrollstream, error } = await supabase
      .from('scrollstreams')
      .insert({
        content: content.trim(),
        orb_associations: validOrbs,
        tags,
        status,
        schedule_date: schedule_date ? new Date(schedule_date).toISOString() : null,
        social_platforms,
        resonance_score: resonance_score || null,
        scrollstream_type,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Scrollstream creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create scrollstream' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      scrollstream,
      success: true,
      created_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scrollstream creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/scrollstreams - Update scrollstream content
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    
    const {
      id,
      content,
      orb_associations,
      tags,
      status,
      schedule_date,
      social_platforms,
      resonance_score
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Scrollstream ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (content !== undefined) updateData.content = content.trim();
    if (orb_associations !== undefined) {
      const validOrbs = orb_associations.filter((orb: number) => 
        typeof orb === 'number' && orb >= 1 && orb <= 13
      );
      updateData.orb_associations = validOrbs;
    }
    if (tags !== undefined) updateData.tags = tags;
    if (status !== undefined) updateData.status = status;
    if (schedule_date !== undefined) {
      updateData.schedule_date = schedule_date ? new Date(schedule_date).toISOString() : null;
    }
    if (social_platforms !== undefined) updateData.social_platforms = social_platforms;
    if (resonance_score !== undefined) updateData.resonance_score = resonance_score;

    const { data: scrollstream, error } = await supabase
      .from('scrollstreams')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Scrollstream update error:', error);
      return NextResponse.json(
        { error: 'Failed to update scrollstream' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      scrollstream,
      success: true,
      updated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scrollstream update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/scrollstreams - Delete scrollstream content
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Scrollstream ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('scrollstreams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Scrollstream deletion error:', error);
      return NextResponse.json(
        { error: 'Failed to delete scrollstream' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Scrollstream deleted successfully',
      deleted_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scrollstream deletion API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}