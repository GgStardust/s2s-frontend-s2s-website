import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validatePractice } from '@/lib/services/console-v3/content-validation-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/console/v3/practices/[id]
 * Get a specific practice by ID (1-12)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const practiceId = parseInt(params.id, 10);

    if (isNaN(practiceId) || practiceId < 1 || practiceId > 12) {
      return NextResponse.json(
        { error: 'Invalid practice ID. Must be between 1 and 12' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: practice, error } = await supabase
      .from('practices')
      .select('*')
      .eq('id', practiceId)
      .single();

    if (error) {
      console.error('Error fetching practice:', error);
      return NextResponse.json(
        { error: 'Failed to fetch practice', details: error.message },
        { status: 500 }
      );
    }

    if (!practice) {
      return NextResponse.json(
        { error: 'Practice not found' },
        { status: 404 }
      );
    }

    // Get Orb mappings for this practice
    const { data: orbMappings, error: mappingsError } = await supabase
      .from('practice_orb_mappings')
      .select('*')
      .eq('practice_id', practiceId);

    if (mappingsError) {
      console.warn('Error fetching practice-orb mappings:', mappingsError);
    }

    // Validate practice with RBI (non-blocking - include validation in response)
    const practiceWithMappings = {
      ...practice,
      orb_mappings: orbMappings || [],
    };

    const validation = await validatePractice(practiceWithMappings, {
      minCoherence: 0.7,
      requireProof: false, // Warn but don't block
      validateOrbAssociations: true,
    });

    // Include validation results in response
    const practiceWithValidation = {
      ...practice,
      orb_mappings: orbMappings || [],
      validation: {
        coherence: validation.coherence,
        proofStatus: validation.proofStatus,
        isValid: validation.isValid,
        warnings: validation.warnings,
      },
    };

    return NextResponse.json({
      practice: practiceWithValidation,
      orb_mappings: orbMappings || [],
    });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/console/v3/practices/[id]:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}

