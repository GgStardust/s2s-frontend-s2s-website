import { NextRequest, NextResponse } from 'next/server';
import { checkCoherence } from '@/lib/rbi/coherence-guard';

// Prevent build-time execution
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Dynamic import to prevent build-time execution
export async function POST(request: NextRequest) {
  try {
    // Only import during runtime, not build time
    const { analyzeContent } = await import('@/lib/ai/content-analysis');
    
    const { content, title } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Kernel-first enforcement: Check coherence before processing
    const coherenceCheck = await checkCoherence(content, title);
    
    if (!coherenceCheck.allowed) {
      return NextResponse.json({
        allowed: false,
        reason: coherenceCheck.reason || 'Low coherence',
        coherenceScore: coherenceCheck.coherenceScore,
        threshold: coherenceCheck.threshold,
        metrics: coherenceCheck.result?.metrics,
        validatedOrbs: coherenceCheck.result?.validatedOrbs,
        proofStatus: coherenceCheck.result?.proofStatus,
        explanation: coherenceCheck.result?.explanation,
        suggestion: coherenceCheck.suggestion,
      }, { status: 400 });
    }

    const analysis = await analyzeContent(content, title);

    // Include coherence score in response for transparency
    return NextResponse.json({
      ...analysis,
      coherenceScore: coherenceCheck.coherenceScore,
      resonanceMetrics: coherenceCheck.result?.metrics,
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}
