import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';
import type { GetPathwayRequest, GetPathwayResponse } from '@/lib/types/console-v3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/pathway
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
 * GET /api/console/v3/pathway
 * Get current user pathway
 * Query params: user_id, email, or session_id
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get('user_id') || undefined;
    const email = searchParams.get('email') || undefined;
    const session_id = searchParams.get('session_id') || undefined;

    if (!user_id && !email && !session_id) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Either user_id, email, or session_id is required' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build query
    let query = supabase
      .from('user_pathways')
      .select('*')
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1);

    if (user_id) {
      query = query.eq('user_id', user_id);
    } else if (email) {
      query = query.eq('email', email);
    } else if (session_id) {
      query = query.eq('session_id', session_id);
    }

    const { data: pathways, error: pathwaysError } = await query;

    if (pathwaysError) {
      console.error('Error fetching user pathway:', pathwaysError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch pathway', details: pathwaysError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    if (!pathways || pathways.length === 0) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'No active pathway found' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    const pathway = pathways[0];

    // Get pathway template
    const { data: template, error: templateError } = await supabase
      .from('pathway_templates')
      .select('*')
      .eq('id', pathway.pathway_template_id)
      .single();

    if (templateError || !template) {
      console.error('Error fetching pathway template:', templateError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch pathway template', details: templateError?.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Get pathway steps
    const { data: steps, error: stepsError } = await supabase
      .from('pathway_steps')
      .select('*')
      .eq('pathway_template_id', pathway.pathway_template_id)
      .order('step_number', { ascending: true });

    if (stepsError) {
      console.error('Error fetching pathway steps:', stepsError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch pathway steps', details: stepsError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Get progress for each step
    const { data: progress, error: progressError } = await supabase
      .from('user_pathway_step_progress')
      .select('*')
      .eq('user_pathway_id', pathway.id);

    if (progressError) {
      console.error('Error fetching pathway progress:', progressError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch pathway progress', details: progressError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    const response: GetPathwayResponse = {
      pathway,
      template,
      steps: steps || [],
      progress: progress || [],
    };

    const origin = request.headers.get('origin');
    return NextResponse.json(response, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/console/v3/pathway:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

