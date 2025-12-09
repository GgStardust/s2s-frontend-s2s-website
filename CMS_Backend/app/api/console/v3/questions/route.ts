import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';
import type { DiagnosticQuestion } from '@/lib/types/console-v3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/questions
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
 * POST /api/console/v3/questions
 * Create a new diagnostic question
 * Phase 2.5: Question Management System
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate required fields
    if (!body.question_text && !body.text) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'question_text is required' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    if (!body.response_type || !['single_choice', 'multi_choice', 'scale'].includes(body.response_type)) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'response_type is required and must be one of: single_choice, multi_choice, scale' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Validate question_set if provided
    if (body.question_set && !['beta', 'early_reader', 'inquiry', 'contextual', 'system_generated'].includes(body.question_set)) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Invalid question_set. Must be one of: beta, early_reader, inquiry, contextual, system_generated' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Validate source if provided
    if (body.source && !['early_reader_feedback', 'system_generated', 'user_submitted', 'beta_test'].includes(body.source)) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Invalid source. Must be one of: early_reader_feedback, system_generated, user_submitted, beta_test' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Set defaults
    const questionData = {
      question_text: body.question_text || body.text,
      text: body.question_text || body.text, // Alias for compatibility
      question_description: body.question_description || body.description,
      slug: body.slug,
      response_type: body.response_type,
      answer_options: body.answer_options || [],
      orb_weights: body.orb_weights || {},
      undercurrent_weights: body.undercurrent_weights || {},
      practice_weights: body.practice_weights || {},
      tags: body.tags || [],
      order_index: body.order_index || 0,
      layer_focus: body.layer_focus,
      // Phase 2.5 metadata
      question_set: body.question_set || 'beta',
      source: body.source || 'system_generated',
      inquiry_context: body.inquiry_context,
      triggers: body.triggers || {},
      follow_up_question_ids: body.follow_up_question_ids || [],
      selection_priority: body.selection_priority || 5,
      is_active: body.is_active !== undefined ? body.is_active : true,
    };

    // Create question
    const { data: question, error } = await supabase
      .from('diagnostic_questions')
      .insert(questionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating question:', error);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to create question', details: error.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    const origin = request.headers.get('origin');
    return NextResponse.json({ question }, {
      status: 201,
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in POST /api/console/v3/questions:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

/**
 * GET /api/console/v3/questions
 * Fetch diagnostic questions with optional filtering
 * 
 * Query Parameters:
 * - question_set: Filter by question set (beta, early_reader, inquiry, contextual)
 * - source: Filter by source (early_reader_feedback, system_generated, user_submitted)
 * - is_active: Filter by active status (default: true)
 * - limit: Limit number of questions returned
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const questionSet = searchParams.get('question_set');
    const source = searchParams.get('source');
    const isActive = searchParams.get('is_active') !== 'false'; // Default to true
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    // Build query
    let query = supabase
      .from('diagnostic_questions')
      .select('*')
      .eq('is_active', isActive);

    // Filter by question_set
    if (questionSet) {
      const sets = questionSet.split(',').map(s => s.trim());
      if (sets.length === 1) {
        query = query.eq('question_set', sets[0]);
      } else {
        query = query.in('question_set', sets);
      }
    }

    // Filter by source
    if (source) {
      const sources = source.split(',').map(s => s.trim());
      if (sources.length === 1) {
        query = query.eq('source', sources[0]);
      } else {
        query = query.in('source', sources);
      }
    }

    // Order by selection_priority (desc) then order_index (asc)
    query = query.order('selection_priority', { ascending: false })
      .order('order_index', { ascending: true });

    // Apply limit if specified
    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    const { data: questions, error } = await query;

    if (error) {
      console.error('Error fetching diagnostic questions:', error);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch diagnostic questions', details: error.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    const origin = request.headers.get('origin');
    return NextResponse.json({ questions: questions || [] }, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/console/v3/questions:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

