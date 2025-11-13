import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Enhanced AI Integration API with Mathematical Layer
 * 
 * Provides AI analysis enhanced with mathematical consciousness framework:
 * - Train AI on writing style and field experiences
 * - Integrate mathematical models into AI responses
 * - Enhance AI accuracy with mathematical validation
 * - Verify Orb association accuracy
 */

export async function POST(request: NextRequest) {
  try {
    // Dynamic import to prevent build-time execution
    const { EnhancedAIIntegration } = await import('@/lib/ai/enhanced-ai-integration');
    
    const body = await request.json();
    const { action, content, title, prompt, context, fieldData } = body;

    const enhancedAI = new EnhancedAIIntegration();

    if (action === 'analyze_with_enhanced_ai') {
      if (!content) {
        return NextResponse.json(
          { error: 'content is required for enhanced AI analysis' },
          { status: 400 }
        );
      }

      // Enhanced content analysis with mathematical validation
      const analysis = await enhancedAI.analyzeContentWithEnhancedAI(content, title);
      
      return NextResponse.json({
        analysis,
        summary: {
          ai_confidence: analysis.ai_confidence,
          mathematical_accuracy: analysis.mathematical_accuracy,
          consciousness_verified: analysis.mathematical_validation.sovereign_logic.validity === 'proven',
          resonance_strength: analysis.mathematical_validation.resonance_vector.x,
          field_coherence: analysis.mathematical_validation.field_dynamics.coherence
        },
        generated_at: new Date().toISOString(),
        version: 'v1.0-enhanced-ai'
      });
    }

    if (action === 'generate_consciousness_response') {
      if (!prompt) {
        return NextResponse.json(
          { error: 'prompt is required for consciousness-aware response generation' },
          { status: 400 }
        );
      }

      // Generate AI response with mathematical consciousness framework
      const response = await enhancedAI.generateConsciousnessAwareResponse(prompt, context);
      
      return NextResponse.json({
        response: response.response,
        mathematical_validation: response.mathematicalValidation,
        consciousness_verified: response.consciousnessVerified,
        generated_at: new Date().toISOString(),
        version: 'v1.0-enhanced-ai'
      });
    }

    if (action === 'train_on_field_experience') {
      if (!fieldData || !Array.isArray(fieldData)) {
        return NextResponse.json(
          { error: 'fieldData array is required for AI training' },
          { status: 400 }
        );
      }

      // Train AI on field experience data
      await enhancedAI.trainOnFieldExperience(fieldData);
      
      return NextResponse.json({
        training_complete: true,
        samples_processed: fieldData.length,
        generated_at: new Date().toISOString(),
        version: 'v1.0-enhanced-ai'
      });
    }

    if (action === 'compare_ai_mathematical') {
      if (!content) {
        return NextResponse.json(
          { error: 'content is required for AI vs mathematical comparison' },
          { status: 400 }
        );
      }

      // Compare AI analysis with mathematical validation
      const analysis = await enhancedAI.analyzeContentWithEnhancedAI(content, title);
      
      const comparison = {
        ai_analysis: {
          orb_associations: analysis.orb_associations,
          resonance_rating: analysis.resonance_rating,
          confidence: analysis.ai_confidence
        },
        mathematical_analysis: {
          resonance_vector: analysis.mathematical_validation.resonance_vector,
          field_dynamics: analysis.mathematical_validation.field_dynamics,
          sovereign_logic: analysis.mathematical_validation.sovereign_logic,
          accuracy: analysis.mathematical_accuracy
        },
        alignment_score: (analysis.ai_confidence + analysis.mathematical_accuracy) / 2
      };
      
      return NextResponse.json({
        comparison,
        insights: {
          ai_mathematical_alignment: comparison.alignment_score,
          consciousness_verification: analysis.mathematical_validation.sovereign_logic.validity,
          resonance_consistency: Math.abs(analysis.resonance_rating - analysis.mathematical_validation.resonance_vector.x * 10),
          field_coherence: analysis.mathematical_validation.field_dynamics.coherence
        },
        generated_at: new Date().toISOString(),
        version: 'v1.0-enhanced-ai'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action specified. Valid actions: analyze_with_enhanced_ai, generate_consciousness_response, train_on_field_experience, compare_ai_mathematical' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Enhanced AI Integration API error:', error);
    return NextResponse.json(
      { error: 'Failed to process enhanced AI analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}





