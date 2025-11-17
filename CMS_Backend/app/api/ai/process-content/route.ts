import { NextRequest, NextResponse } from 'next/server';
import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';
import { checkCoherence } from '@/lib/rbi/coherence-guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Process content with enhanced AI analysis
 */
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

    const enhancedEngine = EnhancedResonanceEngine.getInstance();
    
    // METADATA-FIRST: Extract metadata from request body if provided
    // Support both categoryAssociations (generic) and orb_associations (S2S) for backward compatibility
    const metadata = body.metadata ? {
      categoryAssociations: body.metadata.categoryAssociations ?? body.metadata.orb_associations,
      orb_associations: body.metadata.orb_associations, // Keep for S2S backward compatibility
      field_function: body.metadata.field_function,
      book_threading: body.metadata.book_threading,
      integration_points: body.metadata.integration_points,
      tags: body.metadata.tags
    } : undefined;
    
    // Analyze content with mathematical layer - WITH METADATA
    const analysis = await enhancedEngine.analyzeContentWithMathematics(content, title, metadata);
    
    // Format the processed content
    const processedContent = {
      yaml: generateYAML(analysis),
      markdown: content,
      fullContent: `${generateYAML(analysis)}\n\n${content}`,
      orbAssociations: analysis.orb_associations || [],
      scrollstreams: [], // These properties don't exist on EnhancedResonanceAnalysis
      crossReferences: [],
      recommendations: []
    };

    return NextResponse.json({
      processed: processedContent,
      message: 'Content processed successfully'
    });

  } catch (error) {
    console.error('Content processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process content' },
      { status: 500 }
    );
  }
}

function generateYAML(analysis: any): string {
  const yaml = `---
title: "${analysis.title || 'Untitled'}"
content_type: "orb_essay"
orb_associations: [${(analysis.orb_associations || []).join(', ')}]
scrollstreams: []
cross_references: []
resonance_rating: ${analysis.overall_score || 0}
created_at: "${new Date().toISOString()}"
---`;

  return yaml;
}





