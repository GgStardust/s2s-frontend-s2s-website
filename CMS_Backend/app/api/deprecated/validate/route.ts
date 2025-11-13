import { NextRequest, NextResponse } from 'next/server';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Dedicated Validation API - Resonance Kernel
 * 
 * This is the formal verification system that:
 * - Checks coherence between content and Orb structure
 * - Never alters text - verification only
 * - Activated only on explicit commands
 * - Outputs proof data and explanation
 */
export async function POST(request: NextRequest) {
  try {
    // Dynamic imports to prevent build-time execution
    const { runResonanceValidation } = await import('@/lib/resonance-api');

    const body = await request.json();
    const { content, title, validationType = 'coherence' } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required for validation' },
        { status: 400 }
      );
    }

    // Run Resonance Kernel validation
    const validationResult = await runResonanceValidation(content, title);

    // Return proof data and explanation - NO content modification
    return NextResponse.json({
      success: true,
      validation: {
        proofStatus: validationResult.proofStatus,
        coherenceScore: validationResult.coherenceScore,
        validatedOrbs: validationResult.validatedOrbs,
        metrics: validationResult.metrics,
        explanation: validationResult.explanation
      },
      // Note: No content modification - verification only
      content: content, // Return original content unchanged
      title: title // Return original title unchanged
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { 
        error: 'Validation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



