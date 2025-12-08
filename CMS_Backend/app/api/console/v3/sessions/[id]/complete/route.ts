import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';
import { computeSFI, computePracticeReadiness, matchPathway } from '@/lib/services/console-v3/diagnostic-service';
import { buildPathwayFromTemplate } from '@/lib/services/console-v3/pathway-service';
import type { CompleteDiagnosticSessionResponse } from '@/lib/types/console-v3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/console/v3/sessions/[id]/complete
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
 * POST /api/console/v3/sessions/[id]/complete
 * Complete diagnostic session and compute results
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get session
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

    // Get all responses for this session
    const { data: responses, error: responsesError } = await supabase
      .from('diagnostic_responses')
      .select('*')
      .eq('session_id', sessionId);

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch diagnostic responses', details: responsesError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Get all questions
    const { data: questions, error: questionsError } = await supabase
      .from('diagnostic_questions')
      .select('*')
      .order('order_index', { ascending: true });

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch diagnostic questions', details: questionsError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Compute SFI
    const sfi = await computeSFI(session, responses || [], questions || []);

    // Compute practice readiness
    const readiness = await computePracticeReadiness(responses || [], questions || []);

    // Get pathway templates
    const { data: pathwayTemplates, error: templatesError } = await supabase
      .from('pathway_templates')
      .select('*');

    if (templatesError) {
      console.error('Error fetching pathway templates:', templatesError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch pathway templates', details: templatesError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Match to pathway
    const pathwayMatch = await matchPathway(sfi, readiness, pathwayTemplates || []);

    // Update session with results
    const { data: updatedSession, error: updateError } = await supabase
      .from('diagnostic_sessions')
      .update({
        status: 'completed',
        sfi_score: sfi.score,
        sfi_state: sfi.state,
        orb_profile: sfi.orb_profile,
        undercurrent_profile: sfi.undercurrent_profile,
        foundational_readiness: readiness.foundational_readiness,
        functional_readiness: readiness.functional_readiness,
        advanced_readiness: readiness.advanced_readiness,
        practice_readiness_profile: readiness.practice_readiness_profile,
        recommended_pathway_template_id: pathwayMatch?.pathway_template.id || null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating session:', updateError);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to update diagnostic session', details: updateError.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    // Create user pathway if match found
    let userPathway = null;
    if (pathwayMatch) {
      try {
        // Use pathway service to build pathway (ensures steps are created)
        userPathway = await buildPathwayFromTemplate(
          pathwayMatch.pathway_template,
          session.user_id || undefined,
          session.email || undefined,
          sessionId,
          supabase
        );
      } catch (pathwayError: any) {
        console.error('Error building pathway from template:', pathwayError);
        // Fallback: create pathway without steps (will be handled later)
        const { data: createdPathway, error: fallbackError } = await supabase
          .from('user_pathways')
          .insert({
            user_id: session.user_id || null,
            email: session.email || null,
            session_id: sessionId,
            pathway_template_id: pathwayMatch.pathway_template.id,
            current_step_id: null,
            completed_step_ids: [],
            progress_percentage: 0.0,
            status: 'active',
          })
          .select()
          .single();

        if (!fallbackError && createdPathway) {
          userPathway = createdPathway;
        }
      }
    }

    const response: CompleteDiagnosticSessionResponse = {
      session: updatedSession,
      result: {
        session: updatedSession,
        sfi,
        readiness,
        pathway_match: pathwayMatch || undefined,
      },
      pathway: userPathway || undefined,
    };

    const origin = request.headers.get('origin');
    return NextResponse.json(response, {
      headers: getCorsHeaders(origin),
    });
  } catch (err: any) {
    console.error('Unexpected error in POST /api/console/v3/sessions/[id]/complete:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

