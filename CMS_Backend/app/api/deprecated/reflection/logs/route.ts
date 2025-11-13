import { NextRequest, NextResponse } from 'next/server';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/reflection/logs
 * 
 * Creates a new reflection log entry for the Reality-Check Protocol
 * 
 * Request body:
 * {
 *   "artifact_id": "content_file_123",
 *   "summary_one_sentence": "Brief description of the artifact",
 *   "clarity_score": 0.8,
 *   "coherence_score": 0.7,
 *   "consequence_score": 0.9,
 *   "notes": "Additional observations",
 *   "reviewed_by": "Gigi Stardust"
 * }
 * 
 * Response:
 * {
 *   "id": "uuid",
 *   "artifact_id": "content_file_123",
 *   "summary_one_sentence": "Brief description of the artifact",
 *   "clarity_score": 0.8,
 *   "coherence_score": 0.7,
 *   "consequence_score": 0.9,
 *   "notes": "Additional observations",
 *   "reviewed_by": "Gigi Stardust",
 *   "created_at": "2024-10-16T...",
 *   "updated_at": "2024-10-16T..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Dynamic import to prevent build-time execution
    const { createClient } = await import('@supabase/supabase-js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await request.json();
    const {
      artifact_id,
      summary_one_sentence,
      clarity_score,
      coherence_score,
      consequence_score,
      notes,
      reviewed_by = 'Gigi Stardust'
    } = body;

    // Validate required fields
    if (!artifact_id || !summary_one_sentence) {
      return NextResponse.json(
        { error: 'artifact_id and summary_one_sentence are required' },
        { status: 400 }
      );
    }

    // Validate score ranges
    const scores = [clarity_score, coherence_score, consequence_score];
    for (const score of scores) {
      if (typeof score !== 'number' || score < 0 || score > 1) {
        return NextResponse.json(
          { error: 'All scores must be numbers between 0 and 1' },
          { status: 400 }
        );
      }
    }

    // Insert reflection log
    const { data, error } = await supabase
      .from('reflection_logs')
      .insert([{
        artifact_id,
        summary_one_sentence,
        clarity_score,
        coherence_score,
        consequence_score,
        notes: notes || null,
        reviewed_by
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating reflection log:', error);
      return NextResponse.json(
        { error: 'Failed to create reflection log' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Reflection logs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reflection/logs
 * 
 * Retrieves reflection log entries
 * 
 * Query parameters:
 * - limit: number of entries to return (default: 10)
 * - offset: number of entries to skip (default: 0)
 * - artifact_id: filter by specific artifact
 * 
 * Response:
 * {
 *   "logs": [...],
 *   "total": 25,
 *   "limit": 10,
 *   "offset": 0
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Dynamic import to prevent build-time execution
    const { createClient } = await import('@supabase/supabase-js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const artifactId = searchParams.get('artifact_id');

    // Build query
    let query = supabase
      .from('reflection_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add artifact filter if provided
    if (artifactId) {
      query = query.eq('artifact_id', artifactId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching reflection logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reflection logs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      logs: data || [],
      total: count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('Reflection logs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
