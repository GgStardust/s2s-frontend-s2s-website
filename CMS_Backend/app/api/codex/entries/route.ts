import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/codex/entries
 * Handle CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * GET /api/codex/entries
 * Get Codex entries filtered by console_ready=true and visibility='codex'
 * 
 * Query Parameters:
 * - practice_id: Filter by practice association (1-12)
 * - orb_number: Filter by orb association (1-13)
 * - category: Filter by codex_category (essay, scroll, interlude, field_report, exercise)
 * - tags: Filter by console_tags (comma-separated)
 * - limit: Limit results (default: 50)
 * - offset: Pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);

    // Build query
    let query = supabase
      .from('content_files')
      .select('*')
      .eq('console_ready', true)
      .eq('visibility', 'codex')
      .order('created_at', { ascending: false });

    // Filter by practice_id
    const practiceId = searchParams.get('practice_id');
    if (practiceId) {
      const practiceNum = parseInt(practiceId, 10);
      if (practiceNum >= 1 && practiceNum <= 12) {
        query = query.contains('practice_associations', [practiceNum]);
      }
    }

    // Filter by orb_number
    const orbNumber = searchParams.get('orb_number');
    if (orbNumber) {
      const orbNum = parseInt(orbNumber, 10);
      if (orbNum >= 1 && orbNum <= 13) {
        query = query.contains('orb_associations', [orbNum]);
      }
    }

    // Filter by category
    const category = searchParams.get('category');
    if (category && ['essay', 'scroll', 'interlude', 'field_report', 'exercise'].includes(category)) {
      query = query.eq('codex_category', category);
    }

    // Filter by tags
    const tags = searchParams.get('tags');
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      query = query.overlaps('console_tags', tagArray);
    }

    // Pagination - validate and sanitize inputs
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    
    // Validate limit: must be positive integer, max 100, default 50
    let limit = 50;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
        limit = parsedLimit;
      } else {
        // Invalid limit - return error
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Invalid limit parameter. Must be a positive integer between 1 and 100.' },
          { status: 400, headers: getCorsHeaders(origin) }
        );
      }
    }
    
    // Validate offset: must be non-negative integer, default 0
    let offset = 0;
    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam, 10);
      if (!isNaN(parsedOffset) && parsedOffset >= 0) {
        offset = parsedOffset;
      } else {
        // Invalid offset - return error
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Invalid offset parameter. Must be a non-negative integer.' },
          { status: 400, headers: getCorsHeaders(origin) }
        );
      }
    }
    
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching Codex entries:', error);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch Codex entries', details: error.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    const origin = request.headers.get('origin');
    return NextResponse.json(
      {
        entries: data || [],
        count: data?.length || 0,
        limit,
        offset,
      },
      {
        headers: getCorsHeaders(origin),
      }
    );
  } catch (err: any) {
    console.error('Unexpected error in GET /api/codex/entries:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

