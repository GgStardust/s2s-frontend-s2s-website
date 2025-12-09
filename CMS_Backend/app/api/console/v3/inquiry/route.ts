/**
 * Inquiry API - Phase 8
 * Handles user-initiated inquiry questions and responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/inquiry
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
 * POST /api/console/v3/inquiry
 * Submit an inquiry question and get a response
 * 
 * Body:
 * - question: string (user's question)
 * - session_id?: string (diagnostic session ID for context)
 * - user_id?: string
 * - email?: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, session_id, user_id, email } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get or create inquiry session
    let inquirySession;
    if (session_id) {
      // Try to find existing inquiry session linked to diagnostic session
      const { data: existing } = await supabase
        .from('inquiry_sessions')
        .select('*')
        .eq('session_id', session_id)
        .single();

      if (existing) {
        inquirySession = existing;
      }
    }

    // If no existing session, create new one
    if (!inquirySession) {
      // Get diagnostic session context if available
      let diagnosticContext: any = {};
      if (session_id) {
        const { data: diagnosticSession } = await supabase
          .from('diagnostic_sessions')
          .select('sfi_score, sfi_state, orb_profile')
          .eq('id', session_id)
          .single();

        if (diagnosticSession) {
          diagnosticContext = {
            sfi_score: diagnosticSession.sfi_score,
            sfi_state: diagnosticSession.sfi_state,
            orb_profile: diagnosticSession.orb_profile,
          };
        }
      }

      const { data: newSession, error: sessionError } = await supabase
        .from('inquiry_sessions')
        .insert({
          user_id: user_id || null,
          email: email || null,
          session_id: session_id || null,
          ...diagnosticContext,
          status: 'active',
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating inquiry session:', sessionError);
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Failed to create inquiry session', details: sessionError.message },
          { status: 500, headers: getCorsHeaders(origin) }
        );
      }

      inquirySession = newSession;
    }

    // Try to match user's question to existing inquiry questions
    const { data: matchedQuestions } = await supabase
      .from('inquiry_questions')
      .select('*')
      .eq('is_active', true)
      .ilike('question_text', `%${question.substring(0, 20)}%`)
      .limit(5);

    // For now, return a placeholder response
    // Phase 8.3 will integrate with Orbital Brain for actual responses
    const responseText = `This inquiry capability is being built. Your question: "${question}" will be answered by Orbital Brain integration (coming in Phase 8.3).`;

    // Log the inquiry
    const { data: inquiryLog, error: logError } = await supabase
      .from('inquiry_log')
      .insert({
        inquiry_session_id: inquirySession.id,
        user_question: question,
        matched_inquiry_question_id: matchedQuestions?.[0]?.id || null,
        response_text: responseText,
        context_at_time: {
          sfi_score: inquirySession.sfi_score,
          sfi_state: inquirySession.sfi_state,
          orb_profile: inquirySession.orb_profile,
        },
      })
      .select()
      .single();

    if (logError) {
      console.error('Error logging inquiry:', logError);
      // Don't fail the request, just log the error
    }

    // Update inquiry session
    await supabase
      .from('inquiry_sessions')
      .update({
        inquiry_count: (inquirySession.inquiry_count || 0) + 1,
        last_inquiry_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', inquirySession.id);

    // Update matched question's times_asked if matched
    if (matchedQuestions && matchedQuestions.length > 0) {
      await supabase
        .from('inquiry_questions')
        .update({
          times_asked: (matchedQuestions[0].times_asked || 0) + 1,
          last_asked_at: new Date().toISOString(),
        })
        .eq('id', matchedQuestions[0].id);
    }

    const origin = request.headers.get('origin');
    return NextResponse.json({
      inquiry_id: inquiryLog?.id,
      question: question,
      response: responseText,
      matched_question: matchedQuestions?.[0] ? {
        id: matchedQuestions[0].id,
        question_text: matchedQuestions[0].question_text,
        category: matchedQuestions[0].category,
      } : null,
      note: 'Orbital Brain integration coming in Phase 8.3',
    }, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in POST /api/console/v3/inquiry:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

/**
 * GET /api/console/v3/inquiry
 * Get inquiry history or common questions
 * 
 * Query Parameters:
 * - session_id: Get inquiries for a specific session
 * - category: Filter by category
 * - common: Get common questions (times_asked > threshold)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const category = searchParams.get('category');
    const common = searchParams.get('common') === 'true';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (sessionId) {
      // Get inquiry history for a session
      const { data: inquirySession } = await supabase
        .from('inquiry_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (!inquirySession) {
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { inquiries: [] },
          { headers: getCorsHeaders(origin) }
        );
      }

      const { data: inquiries, error } = await supabase
        .from('inquiry_log')
        .select('*')
        .eq('inquiry_session_id', inquirySession.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inquiry history:', error);
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Failed to fetch inquiry history', details: error.message },
          { status: 500, headers: getCorsHeaders(origin) }
        );
      }

      const origin = request.headers.get('origin');
      return NextResponse.json(
        { inquiries: inquiries || [] },
        { headers: getCorsHeaders(origin) }
      );
    }

    if (common) {
      // Get common inquiry questions
      let query = supabase
        .from('inquiry_questions')
        .select('*')
        .eq('is_active', true)
        .gt('times_asked', 0)
        .order('times_asked', { ascending: false })
        .limit(20);

      if (category) {
        query = query.eq('category', category);
      }

      const { data: commonQuestions, error } = await query;

      if (error) {
        console.error('Error fetching common questions:', error);
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Failed to fetch common questions', details: error.message },
          { status: 500, headers: getCorsHeaders(origin) }
        );
      }

      const origin = request.headers.get('origin');
      return NextResponse.json(
        { questions: commonQuestions || [] },
        { headers: getCorsHeaders(origin) }
      );
    }

    // Get all active inquiry questions (for reference)
    let query = supabase
      .from('inquiry_questions')
      .select('id, question_text, category, section, tags')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('times_asked', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: questions, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching inquiry questions:', error);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch inquiry questions', details: error.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    const origin = request.headers.get('origin');
    return NextResponse.json(
      { questions: questions || [] },
      { headers: getCorsHeaders(origin) }
    );
  } catch (err: any) {
    console.error('Unexpected error in GET /api/console/v3/inquiry:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

