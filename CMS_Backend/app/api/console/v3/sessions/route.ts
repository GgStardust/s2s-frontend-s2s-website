import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';
import type { StartDiagnosticSessionRequest, StartDiagnosticSessionResponse } from '@/lib/types/console-v3';
import { selectQuestionsForSession } from '@/lib/services/console-v3/question-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/sessions
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
 * POST /api/console/v3/sessions
 * Start a new diagnostic session
 */
export async function POST(request: NextRequest) {
  try {
    const body: StartDiagnosticSessionRequest = await request.json();
    const { email, user_id } = body;

    // Email and user_id are both optional - allow anonymous sessions
    // Session ID will be used for tracking

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create new diagnostic session
    const { data: session, error: sessionError } = await supabase
      .from('diagnostic_sessions')
      .insert({
        user_id: user_id || null,
        email: email || null,
        status: 'in_progress',
        orb_profile: {},
        undercurrent_profile: {},
        practice_readiness_profile: {},
        foundational_readiness: 0.0,
        functional_readiness: 0.0,
        advanced_readiness: 0.0,
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating diagnostic session:', sessionError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to create diagnostic session', details: sessionError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Guard clause: verify session exists before accessing properties
    if (!session) {
      console.error('Session creation returned no data');
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to create diagnostic session: no session data returned' },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Fetch questions using question selection service
    // Default to beta question set, can be extended to include early_reader questions
    const questions = await selectQuestionsForSession(supabase, {
      question_set: 'beta',
      include_early_reader: false, // Can be enabled later
      max_questions: 12, // Default to 12 questions
    });

    if (!questions || questions.length === 0) {
      console.warn('No questions found for session');
      // Return empty array - frontend should handle this gracefully
    }

    const response: StartDiagnosticSessionResponse = {
      session_id: session.id,
      questions: questions || [],
    };

    const origin = request.headers.get('origin');
    return NextResponse.json(response, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in POST /api/console/v3/sessions:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

