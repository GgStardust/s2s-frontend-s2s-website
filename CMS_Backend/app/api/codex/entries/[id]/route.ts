import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorsHeaders } from '@/lib/cors';
import { validateCodexEntry } from '@/lib/services/console-v3/content-validation-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * OPTIONS /api/codex/entries/[id]
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
 * GET /api/codex/entries/[id]
 * Get a specific Codex entry by ID
 * Only returns entries with console_ready=true and visibility='codex'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entryId = params.id;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: entry, error } = await supabase
      .from('content_files')
      .select('*')
      .eq('id', entryId)
      .eq('console_ready', true)
      .eq('visibility', 'codex')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        const origin = request.headers.get('origin');
        return NextResponse.json(
          { error: 'Codex entry not found or not available' },
          { status: 404, headers: getCorsHeaders(origin) }
        );
      }
      console.error('Error fetching Codex entry:', error);
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Failed to fetch Codex entry', details: error.message },
        { status: 500, headers: getCorsHeaders(origin) }
      );
    }

    if (!entry) {
      const origin = request.headers.get('origin');
      return NextResponse.json(
        { error: 'Codex entry not found or not available' },
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    // Validate entry with RBI (non-blocking - include validation in response)
    const validation = await validateCodexEntry(entry, {
      minCoherence: 0.7,
      requireProof: false, // Warn but don't block
      validateOrbAssociations: true,
    });

    // Include validation results in response
    const entryWithValidation = {
      ...entry,
      validation: {
        coherence: validation.coherence,
        proofStatus: validation.proofStatus,
        isValid: validation.isValid,
        warnings: validation.warnings,
      },
    };

    const origin = request.headers.get('origin');
    return NextResponse.json(
      { entry: entryWithValidation },
      {
        headers: getCorsHeaders(origin),
      }
    );
  } catch (err: any) {
    console.error('Unexpected error in GET /api/codex/entries/[id]:', err);
    const origin = request.headers.get('origin');
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

