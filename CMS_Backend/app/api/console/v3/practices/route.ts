import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/console/v3/practices
 * Get practices by layer or all practices
 * Query params: layer (optional) - 'foundational', 'functional', 'advanced'
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const layer = searchParams.get('layer');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from('practices')
      .select('*')
      .order('id', { ascending: true });

    if (layer && ['foundational', 'functional', 'advanced'].includes(layer)) {
      query = query.eq('layer', layer);
    }

    const { data: practices, error } = await query;

    if (error) {
      console.error('Error fetching practices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch practices', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ practices: practices || [] });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/console/v3/practices:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}

