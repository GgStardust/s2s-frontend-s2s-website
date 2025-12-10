import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';
import type { CompletePathwayStepRequest, CompletePathwayStepResponse } from '@/lib/types/console-v3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/pathway/steps/[id]/complete
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
 * POST /api/console/v3/pathway/steps/[id]/complete
 * Mark a pathway step as complete
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stepId = params.id;
    const body: CompletePathwayStepRequest = await request.json();
    const { user_pathway_id, notes } = body;

    if (!user_pathway_id) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'user_pathway_id is required' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify pathway exists and is active
    const { data: pathway, error: pathwayError } = await supabase
      .from('user_pathways')
      .select('*')
      .eq('id', user_pathway_id)
      .single();

    if (pathwayError || !pathway) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'User pathway not found' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    if (pathway.status !== 'active') {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Pathway is not active' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    // Verify step exists and belongs to the pathway template
    const { data: step, error: stepError } = await supabase
      .from('pathway_steps')
      .select('*')
      .eq('id', stepId)
      .eq('pathway_template_id', pathway.pathway_template_id)
      .single();

    if (stepError || !step) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Pathway step not found or does not belong to this pathway' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    // Check if step dependencies are met
    if (step.requires_step_ids && step.requires_step_ids.length > 0) {
      const { data: completedSteps } = await supabase
        .from('user_pathway_step_progress')
        .select('step_id')
        .eq('user_pathway_id', user_pathway_id)
        .eq('status', 'completed');

      const completedStepIds = new Set((completedSteps || []).map(s => s.step_id));
      const unmetDependencies = step.requires_step_ids.filter(
        (reqId: string) => !completedStepIds.has(reqId)
      );

      if (unmetDependencies.length > 0) {
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { 
            error: 'Step dependencies not met',
            unmet_dependencies: unmetDependencies 
          },
          { status: 400, headers: getCorsHeaders(origin) }
        );
      }
    }

    // Update or create progress record
    const { data: existingProgress } = await supabase
      .from('user_pathway_step_progress')
      .select('*')
      .eq('user_pathway_id', user_pathway_id)
      .eq('step_id', stepId)
      .single();

    const progressData = {
      user_pathway_id,
      step_id: stepId,
      status: 'completed' as const,
      completed_at: new Date().toISOString(),
      notes: notes || null,
    };

    let progress;
    if (existingProgress) {
      const { data: updated, error: updateError } = await supabase
        .from('user_pathway_step_progress')
        .update(progressData)
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating progress:', updateError);
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Failed to update step progress', details: updateError.message },
          { status: 500, headers: getCorsHeaders(origin) }
        );
      }
      progress = updated;
    } else {
      const { data: created, error: createError } = await supabase
        .from('user_pathway_step_progress')
        .insert({
          ...progressData,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating progress:', createError);
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Failed to create step progress', details: createError.message },
          { status: 500, headers: getCorsHeaders(origin) }
        );
      }
      progress = created;
    }

    // Update pathway progress percentage
    const { data: allSteps } = await supabase
      .from('pathway_steps')
      .select('id')
      .eq('pathway_template_id', pathway.pathway_template_id);

    const { data: completedSteps } = await supabase
      .from('user_pathway_step_progress')
      .select('step_id')
      .eq('user_pathway_id', user_pathway_id)
      .eq('status', 'completed');

    const totalSteps = (allSteps || []).length;
    const completedCount = (completedSteps || []).length;
    const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

    // Update pathway
    const updatedCompletedStepIds = [
      ...(pathway.completed_step_ids || []),
      ...(pathway.completed_step_ids?.includes(stepId) ? [] : [stepId]),
    ];

    const { data: updatedPathway, error: pathwayUpdateError } = await supabase
      .from('user_pathways')
      .update({
        completed_step_ids: updatedCompletedStepIds,
        progress_percentage: progressPercentage,
        status: progressPercentage >= 100 ? 'completed' : 'active',
        completed_at: progressPercentage >= 100 ? new Date().toISOString() : null,
      })
      .eq('id', user_pathway_id)
      .select()
      .single();

    if (pathwayUpdateError) {
      console.error('Error updating pathway:', pathwayUpdateError);
      // Don't fail the request, progress was saved
    }

    // Get next step
    const { data: nextStep } = await supabase
      .from('pathway_steps')
      .select('*')
      .eq('pathway_template_id', pathway.pathway_template_id)
      .gt('step_number', step.step_number)
      .order('step_number', { ascending: true })
      .limit(1)
      .single();

    const response: CompletePathwayStepResponse = {
      progress,
      next_step: nextStep || undefined,
      pathway_complete: progressPercentage >= 100,
    };

    const origin = request.headers.get('origin');
    return NextResponse.json(response, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in POST /api/console/v3/pathway/steps/[id]/complete:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

