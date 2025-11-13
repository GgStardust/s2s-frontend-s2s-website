import { NextRequest, NextResponse } from 'next/server';
import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';
import { orbitalContextService } from '@/lib/orbital-context';
import { proofLogger } from '@/lib/proof-logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Analyze content with Enhanced Resonance Engine + Orbital Brain
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

    // Initialize Enhanced Resonance Engine
    const resonanceEngine = EnhancedResonanceEngine.getInstance();

    // METADATA-FIRST: Extract metadata from request body if provided
    const metadata = body.metadata ? {
      orb_associations: body.metadata.orb_associations,
      field_function: body.metadata.field_function,
      book_threading: body.metadata.book_threading,
      integration_points: body.metadata.integration_points,
      tags: body.metadata.tags
    } : undefined;

    // Analyze content with mathematical layer - WITH METADATA
    const resonanceAnalysis = await resonanceEngine.analyzeContentWithMathematics(content, title, metadata);

    // Get Orbital context
    const orbitalContext = await orbitalContextService.getOrbitalContext(content, title);

    // Validate coherence
    const coherenceValidation = {
      isValid: resonanceAnalysis.mathematical?.sovereignLogic?.validity === 'proven' || false,
      coherence: resonanceAnalysis.mathematical?.sovereignLogic?.coherence || 0,
      sovereignty: resonanceAnalysis.mathematical?.sovereignLogic?.sovereignty || 0,
      proof: resonanceAnalysis.mathematical?.sovereignLogic
    };

    // Log proof for content analysis
    const proofLog = await proofLogger.logContentAnalysis(
      content,
      resonanceAnalysis,
      coherenceValidation
    );

    return NextResponse.json({
      message: 'Content analyzed successfully',
      content: content.substring(0, 100) + '...', // Truncated for response
      resonanceAnalysis: {
        signature: resonanceAnalysis.signature,
        mathematical: {
          resonanceVector: resonanceAnalysis.mathematical?.resonanceVector,
          harmonicFrequency: resonanceAnalysis.mathematical?.harmonicFrequency,
          coherenceMatrix: resonanceAnalysis.mathematical?.coherenceMatrix,
          fieldDynamics: resonanceAnalysis.mathematical?.fieldDynamics,
          sovereignLogic: resonanceAnalysis.mathematical?.sovereignLogic
        }
      },
      orbitalContext: {
        orbAssociations: orbitalContext.orbAssociations,
        undercurrentLinks: orbitalContext.undercurrentLinks,
        tags: orbitalContext.tags,
        scrollstreams: orbitalContext.scrollstreams,
        resonanceMetrics: orbitalContext.resonanceMetrics,
        codexPath: orbitalContext.codexPath,
        dashboardComponent: orbitalContext.dashboardComponent
      },
      coherenceValidation,
      proofLog: {
        id: proofLog.id,
        type: proofLog.type,
        overallValidity: proofLog.overallValidity,
        coherenceScore: proofLog.coherenceScore,
        sovereigntyScore: proofLog.sovereigntyScore,
        steps: proofLog.steps.length
      }
    });

  } catch (error) {
    console.error('Resonance analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}