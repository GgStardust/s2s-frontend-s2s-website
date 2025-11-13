import { NextRequest, NextResponse } from 'next/server';
import { simpleEnhancedResonanceEngine } from '@/lib/mathematics/simple-enhanced-resonance-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const analysis = await simpleEnhancedResonanceEngine.analyzeContentWithMathematics(content, title);

    return NextResponse.json({
      success: true,
      analysis,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in enhanced resonance analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
