import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';
import type { SubmitDiagnosticResponseRequest, SubmitDiagnosticResponseResponse } from '@/lib/types/console-v3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/sessions/[id]/responses
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
 * POST /api/console/v3/sessions/[id]/responses
 * Submit a response to a diagnostic question
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body: SubmitDiagnosticResponseRequest = await request.json();
    const { question_id, answer } = body;

    if (!question_id || answer === undefined) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'question_id and answer are required' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if session exists
    const { data: session, error: sessionError } = await supabase
      .from('diagnostic_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Diagnostic session not found' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    if (session.status === 'completed') {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Diagnostic session is already completed' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Get question details (question_id is INTEGER in existing table)
    const questionIdNum = typeof question_id === 'string' ? parseInt(question_id, 10) : question_id;
    const { data: question, error: questionError } = await supabase
      .from('diagnostic_questions')
      .select('*')
      .eq('id', questionIdNum)
      .single();

    if (questionError || !question) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Diagnostic question not found' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    // Store response
    const rawAnswer = typeof answer === 'string' ? answer : JSON.stringify(answer);
    
    // Calculate normalized value for derived_signal (helps with debugging and future use)
    let normalizedValue = 0;
    if (question.answer_options && question.answer_options.length > 0) {
      const optionIndex = question.answer_options.indexOf(rawAnswer);
      if (optionIndex >= 0) {
        normalizedValue = (optionIndex + 1) / question.answer_options.length;
      } else {
        // Try parsing as number for scale questions
        const numValue = parseFloat(rawAnswer);
        if (!isNaN(numValue)) {
          normalizedValue = numValue > 1 ? numValue / 5 : numValue;
        }
      }
    }
    
    const { data: response, error: responseError } = await supabase
      .from('diagnostic_responses')
      .upsert({
        session_id: sessionId,
        question_id: questionIdNum, // INTEGER
        raw_answer: rawAnswer,
        derived_signal: {
          normalized_value: normalizedValue,
          answer_type: question.response_type,
        },
      }, {
        onConflict: 'session_id,question_id'
      })
      .select()
      .single();

    if (responseError) {
      console.error('Error saving diagnostic response:', responseError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to save response', details: responseError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Check if this is the last question
    // IMPORTANT: Only check against questions in the 'beta' set (the questions assigned to this session)
    // The session was created with questions from the 'beta' set, max 12 questions
    const { data: sessionQuestions } = await supabase
      .from('diagnostic_questions')
      .select('id')
      .eq('question_set', 'beta')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(12); // Sessions are created with max 12 questions

    const { data: allResponses } = await supabase
      .from('diagnostic_responses')
      .select('question_id')
      .eq('session_id', sessionId);

    const answeredQuestionIds = new Set((allResponses || []).map(r => r.question_id));
    const totalQuestions = (sessionQuestions || []).length;
    const isComplete = totalQuestions > 0 && answeredQuestionIds.size >= totalQuestions;

    // Phase 2.5: Check for follow-up questions first
    const { getFollowUpQuestions } = await import('@/lib/services/console-v3/question-service');
    const followUpQuestions = await getFollowUpQuestions(supabase, questionIdNum, rawAnswer);

    // Get next question if not complete
    let nextQuestion = null;
    if (!isComplete) {
      // Priority 1: Follow-up questions (if any)
      if (followUpQuestions && followUpQuestions.length > 0) {
        // Check if follow-up questions haven't been answered yet
        const unansweredFollowUps = followUpQuestions.filter(
          fq => !answeredQuestionIds.has(fq.id)
        );
        
        if (unansweredFollowUps.length > 0) {
          // Return first unanswered follow-up question
          nextQuestion = unansweredFollowUps[0];
        }
      }

      // Priority 2: Regular unanswered questions (if no follow-ups)
      if (!nextQuestion) {
        const unansweredQuestions = (allQuestions || [])
          .filter(q => !answeredQuestionIds.has(q.id))
          .sort((a, b) => {
            // Sort by selection_priority (desc) then order_index (asc)
            // We need to fetch full questions for this, so use a simple approach
            return 0;
          });

        if (unansweredQuestions.length > 0) {
          const { data: nextQ } = await supabase
            .from('diagnostic_questions')
            .select('*')
            .eq('id', unansweredQuestions[0].id)
            .single();
          nextQuestion = nextQ;
        }
      }
    }

    const responseData: SubmitDiagnosticResponseResponse = {
      response_id: response.id,
      next_question: nextQuestion || undefined,
      is_complete: isComplete,
    };

    const origin = request.headers.get('origin');
    return NextResponse.json(responseData, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in POST /api/console/v3/sessions/[id]/responses:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

