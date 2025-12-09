/**
 * Inquiry Service - Phase 8.3
 * Generates Orbital Brain responses to user inquiry questions
 */

import { generateOrbitalResponse } from 'orbital-brain';
import type { ContentMetadata, RBIOutput } from 'orbital-brain/types';
import { EnhancedResonanceEngine } from 'rbi-kernel/types';
import { loadCoreArchitecture } from './architecture-loader';
import type { DiagnosticSession } from '@/lib/types/console-v3';

/**
 * Generate Orbital Brain response to an inquiry question
 */
export async function generateInquiryResponse(
  inquiry: string,
  options: {
    diagnosticSession?: DiagnosticSession | null;
    matchedInquiryQuestion?: {
      id: string;
      question_text: string;
      category?: string;
      orb_associations?: number[];
      undercurrent_associations?: number[];
      practice_associations?: number[];
      tags?: string[];
    } | null;
    inquirySessionId?: string;
  } = {}
): Promise<{
  response: string;
  rbi_analysis?: any;
  orbital_interpretation?: any;
  metadata?: ContentMetadata;
}> {
  try {
    // Get user's field state from diagnostic session if available
    const fieldState = options.diagnosticSession ? {
      sfi_score: options.diagnosticSession.sfi_score,
      sfi_state: options.diagnosticSession.sfi_state,
      orb_profile: options.diagnosticSession.orb_profile || {},
      undercurrent_profile: options.diagnosticSession.undercurrent_profile || {},
    } : null;

    // Build metadata from matched inquiry question or user's field state
    const orbAssociations = options.matchedInquiryQuestion?.orb_associations || 
      (fieldState ? Object.entries(fieldState.orb_profile || {})
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([key]) => parseInt(key.replace('orb_', '')))
        .filter(orbNum => !isNaN(orbNum) && orbNum >= 1 && orbNum <= 13) : []);

    const metadata: ContentMetadata = {
      orb_associations: orbAssociations.length > 0 ? orbAssociations : undefined,
      field_function: {
        content_purpose: 'inquiry_response',
        primary_mechanism: 'narrative_generation',
        console_context: 'inquiry_system',
        console_relation: 'user_question',
      },
      tags: options.matchedInquiryQuestion?.tags || ['inquiry', options.matchedInquiryQuestion?.category || 'general'],
      category: options.matchedInquiryQuestion?.category || 'inquiry',
    };

    // STEP 1: Analyze inquiry with RBI Kernel
    const engine = EnhancedResonanceEngine.getInstance();
    // Load architecture for context (used by RBI internally)
    await loadCoreArchitecture();

    // Build inquiry content with context
    const inquiryContent = fieldState ? JSON.stringify({
      inquiry,
      field_state: fieldState,
      matched_question: options.matchedInquiryQuestion?.question_text,
    }) : inquiry;

    const rbiAnalysis = await engine.analyzeContentWithMathematics(
      inquiryContent,
      `Inquiry: ${inquiry.substring(0, 50)}...`,
      metadata
    );

    // STEP 2: Format RBI output for Orbital Brain
    const rbiOutput: RBIOutput = {
      resonance_metrics: {
        strength: rbiAnalysis.mathematical?.fieldDynamics?.fieldStrength ? 
                 Math.round(rbiAnalysis.mathematical.fieldDynamics.fieldStrength * 10) / 10 : 0,
        clarity: rbiAnalysis.signature?.clarity ? 
                Math.round(rbiAnalysis.signature.clarity * 10) / 10 : 0,
        coherence: rbiAnalysis.mathematical?.sovereignLogic?.coherence ? 
                  Math.round(rbiAnalysis.mathematical.sovereignLogic.coherence * 10) / 10 : 0,
        pattern: rbiAnalysis.mathematical?.harmonicFrequency?.fundamental ? 
                Math.round(rbiAnalysis.mathematical.harmonicFrequency.fundamental * 10) / 10 : 0
      },
      coherence: rbiAnalysis.mathematical?.sovereignLogic?.coherence || 0,
      proof_status: rbiAnalysis.mathematical?.sovereignLogic?.validity || 'unproven',
      mathematical: {
        resonanceVector: rbiAnalysis.mathematical?.resonanceVector,
        fieldDynamics: rbiAnalysis.mathematical?.fieldDynamics,
        sovereignLogic: rbiAnalysis.mathematical?.sovereignLogic
      }
    };

    // STEP 3: Generate Orbital Brain response
    const orbitalResponse = await generateOrbitalResponse({
      inquiry,
      metadata,
      rbi_output: rbiOutput,
      session_id: options.inquirySessionId,
    });

    return {
      response: orbitalResponse.content || 'I apologize, but I encountered an error generating a response.',
      rbi_analysis: rbiAnalysis,
      orbital_interpretation: orbitalResponse.orbital_interpretation,
      metadata,
    };
  } catch (error: any) {
    console.error('[InquiryService] Error generating response:', error);
    
    // Fallback response
    return {
      response: `I'm processing your question: "${inquiry}". This inquiry system is integrating with Orbital Brain to provide S2S-aligned responses. Please try again in a moment, or rephrase your question.`,
    };
  }
}

/**
 * Find relevant Codex entries for an inquiry
 * Uses RBI to find content that resonates with the inquiry
 */
export async function findRelevantCodexEntries(
  inquiry: string,
  orbAssociations?: number[],
  limit: number = 3
): Promise<Array<{
  id: string;
  title: string;
  category: string;
  relevance_score: number;
}>> {
  try {
    // This would query the Codex API with RBI-based matching
    // For now, return empty array - can be enhanced later
    return [];
  } catch (error) {
    console.error('[InquiryService] Error finding Codex entries:', error);
    return [];
  }
}

