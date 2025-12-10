import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/pathway/steps
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
 * GET /api/console/v3/pathway/steps
 * Get pathway steps for a pathway template
 * Query params: pathway_template_id
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pathway_template_id = searchParams.get('pathway_template_id');

    if (!pathway_template_id) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'pathway_template_id is required' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: steps, error } = await supabase
      .from('pathway_steps')
      .select('*')
      .eq('pathway_template_id', pathway_template_id)
      .order('step_number', { ascending: true });

    if (error) {
      console.error('Error fetching pathway steps:', error);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch pathway steps', details: error.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    const origin = request.headers.get('origin');
    return NextResponse.json({ steps: steps || [] }, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/console/v3/pathway/steps:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

