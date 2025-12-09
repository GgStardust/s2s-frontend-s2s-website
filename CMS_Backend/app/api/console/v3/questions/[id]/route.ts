/**
 * Question Management API - Individual Question Operations
 * Phase 2.5: Question Management System
 * 
 * PUT /api/console/v3/questions/[id] - Update a question
 * DELETE /api/console/v3/questions/[id] - Delete/deactivate a question
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/questions/[id]
 * Handle CORS preflight
 */
export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * PUT /api/console/v3/questions/[id]
 * Update a diagnostic question
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = parseInt(params.id, 10);
    
    if (isNaN(questionId) || questionId < 1) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Validate selection_priority if provided
    if (body.selection_priority !== undefined) {
      const priority = parseInt(body.selection_priority, 10);
      if (isNaN(priority) || priority < 1 || priority > 10) {
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Invalid selection_priority. Must be between 1 and 10' },
          { status: 400, headers: getCorsHeaders(origin) }
        );
      }
      body.selection_priority = priority;
    }

    // Update question
    const { data: question, error } = await supabase
      .from('diagnostic_questions')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', questionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating question:', error);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to update question', details: error.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    if (!question) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    const origin = request.headers.get('origin');
    return NextResponse.json({ question }, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in PUT /api/console/v3/questions/[id]:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

/**
 * DELETE /api/console/v3/questions/[id]
 * Delete or deactivate a question
 * By default, deactivates (sets is_active=false) rather than deleting
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = parseInt(params.id, 10);
    
    if (isNaN(questionId) || questionId < 1) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true'; // ?hard=true for actual deletion

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (hardDelete) {
      // Hard delete (actually remove from database)
      const { error } = await supabase
        .from('diagnostic_questions')
        .delete()
        .eq('id', questionId);

      if (error) {
        console.error('Error deleting question:', error);
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Failed to delete question', details: error.message },
          { status: 500, headers: getCorsHeaders(origin) }
        );
      }

      const origin = request.headers.get('origin');
      return NextResponse.json(
        { message: 'Question deleted successfully' },
        { headers: getCorsHeaders(origin) }
      );
    } else {
      // Soft delete (deactivate)
      const { data: question, error } = await supabase
        .from('diagnostic_questions')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', questionId)
        .select()
        .single();

      if (error) {
        console.error('Error deactivating question:', error);
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Failed to deactivate question', details: error.message },
          { status: 500, headers: getCorsHeaders(origin) }
        );
      }

      if (!question) {
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404, headers: getCorsHeaders(origin) }
        );
      }

      const origin = request.headers.get('origin');
      return NextResponse.json(
        { message: 'Question deactivated successfully', question },
        { headers: getCorsHeaders(origin) }
      );
    }
  } catch (err: any) {
    console.error('Unexpected error in DELETE /api/console/v3/questions/[id]:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

