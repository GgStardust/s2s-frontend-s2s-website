import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';
import { getPathwayContent } from '@/lib/services/console-v3/pathway-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/pathway/steps/[id]/content
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
 * GET /api/console/v3/pathway/steps/[id]/content
 * Get content for a pathway step (Codex entry, practice, etc.)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stepId = params.id;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get step details
    const { data: step, error: stepError } = await supabase
      .from('pathway_steps')
      .select('*')
      .eq('id', stepId)
      .single();

    if (stepError || !step) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Pathway step not found' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    // Get step content using pathway service
    const content = await getPathwayContent(step, supabase);

    if (!content) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Content not available for this step' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    const origin = request.headers.get('origin');
    return NextResponse.json(content, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/console/v3/pathway/steps/[id]/content:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

