/**
 * Console V3 Orbital Brain Integration Service
 * Uses Orbital Brain to generate personalized pathway descriptions and guidance
 * Phase 7: RBI + Orbital Brain Integration
 */

import { generateOrbitalResponse } from 'orbital-brain';
import type { ContentMetadata, RBIOutput } from 'orbital-brain/types';
import type {
  DiagnosticSession,
  PathwayTemplate,
  SFIResult,
  PracticeReadinessAssessment,
} from '@/lib/types/console-v3';

/**
 * Generate personalized pathway description using Orbital Brain
 */
export async function generatePathwayDescription(
  pathwayTemplate: PathwayTemplate,
  sfi: SFIResult,
  readiness: PracticeReadinessAssessment,
  session: DiagnosticSession
): Promise<{
  description: string;
  reasoning: string;
  guidance: string;
}> {
  try {
    // Build metadata from pathway and field state
    const metadata: ContentMetadata = {
      orb_associations: pathwayTemplate.orb_focus || [],
      practice_associations: pathwayTemplate.practice_sequence || [],
      tags: ['pathway', 'practice_sequence'],
      field_function: 'pathway_generation',
    };

    // Build RBI output from SFI and readiness
    const rbiOutput: RBIOutput = {
      coherence: sfi.score || 0,
      resonance_vectors: {},
      field_dynamics: {
        field_strength: sfi.score || 0,
        coherence: sfi.score || 0,
        stability: 0.7, // Default stability
        gradient: 0.5,
      },
      validated_orbs: Object.keys(sfi.orb_profile || {})
        .map(k => parseInt(k.replace('orb_', '')))
        .filter(n => !isNaN(n)),
      proof_status: sfi.score && sfi.score > 0.6 ? 'proven' : 'partial',
    };

    // Build inquiry for Orbital Brain
    const inquiry = `Generate a personalized description for this practice pathway. 
The pathway focuses on Orbs ${pathwayTemplate.orb_focus?.join(', ') || 'various'} 
and includes practices ${pathwayTemplate.practice_sequence?.join(', ') || 'various'}.
The user's current field state shows ${sfi.state || 'coherent'} coherence with 
foundational readiness ${(readiness.foundational_readiness * 100).toFixed(0)}%, 
functional readiness ${(readiness.functional_readiness * 100).toFixed(0)}%, 
and advanced readiness ${(readiness.advanced_readiness * 100).toFixed(0)}%.
Explain why this pathway is recommended and how it supports their current field configuration.`;

    // Generate Orbital Brain response
    const orbitalResponse = await generateOrbitalResponse({
      inquiry,
      metadata,
      rbi_output: rbiOutput,
      session_id: session.id,
    });

    // Extract description and reasoning from Orbital Brain response
    const description = orbitalResponse.content || pathwayTemplate.description || '';
    const reasoning = orbitalResponse.orbital_interpretation?.reasoning || 
      `This pathway aligns with your current field configuration, focusing on ${pathwayTemplate.orb_focus?.length || 0} primary Orbs.`;
    const guidance = orbitalResponse.orbital_interpretation?.guidance || 
      `Begin with the first practice and allow the sequence to unfold naturally.`;

    return {
      description,
      reasoning,
      guidance,
    };
  } catch (error) {
    console.error('Error generating pathway description with Orbital Brain:', error);
    // Fallback to template description
    return {
      description: pathwayTemplate.description || 'A personalized practice pathway.',
      reasoning: `This pathway focuses on Orbs ${pathwayTemplate.orb_focus?.join(', ') || 'various'}.`,
      guidance: 'Begin with the first practice and allow the sequence to unfold naturally.',
    };
  }
}

/**
 * Generate contextual guidance for a pathway step
 */
export async function generateStepGuidance(
  stepTitle: string,
  stepType: string,
  practiceId?: number,
  codexEntryId?: string,
  currentFieldState?: {
    sfi_state?: string;
    orb_profile?: Record<string, number>;
    practice_readiness?: Record<string, number>;
  }
): Promise<string> {
  try {
    const metadata: ContentMetadata = {
      orb_associations: [],
      tags: ['pathway_step', stepType],
      field_function: 'step_guidance',
    };

    const rbiOutput: RBIOutput = {
      coherence: 0.7,
      resonance_vectors: {},
      field_dynamics: {
        field_strength: 0.7,
        coherence: 0.7,
        stability: 0.6,
        gradient: 0.5,
      },
      validated_orbs: [],
      proof_status: 'partial',
    };

    const inquiry = `Provide brief, contextual guidance for this pathway step: ${stepTitle} (${stepType}).
${currentFieldState ? `The user's current field state is ${currentFieldState.sfi_state || 'coherent'}.` : ''}
Keep the guidance concise, supportive, and aligned with S2S language.`;

    const orbitalResponse = await generateOrbitalResponse({
      inquiry,
      metadata,
      rbi_output: rbiOutput,
    });

    return orbitalResponse.content || `Engage with ${stepTitle} as it aligns with your current field configuration.`;
  } catch (error) {
    console.error('Error generating step guidance:', error);
    return `Engage with ${stepTitle} as it aligns with your current field configuration.`;
  }
}

/**
 * Explain why specific practices are recommended
 */
export async function explainPracticeRecommendation(
  practiceId: number,
  practiceName: string,
  orbAssociations: number[],
  userOrbProfile: Record<string, number>,
  practiceReadiness: number
): Promise<string> {
  try {
    const metadata: ContentMetadata = {
      orb_associations: orbAssociations,
      tags: ['practice', `practice_${practiceId}`],
      field_function: 'practice_explanation',
    };

    const rbiOutput: RBIOutput = {
      coherence: practiceReadiness,
      resonance_vectors: {},
      field_dynamics: {
        field_strength: practiceReadiness,
        coherence: practiceReadiness,
        stability: 0.6,
        gradient: 0.5,
      },
      validated_orbs: orbAssociations,
      proof_status: practiceReadiness > 0.6 ? 'proven' : 'partial',
    };

    const inquiry = `Explain why ${practiceName} (Practice ${practiceId}) is recommended for this user.
The practice is associated with Orbs ${orbAssociations.join(', ')}.
The user's readiness for this practice is ${(practiceReadiness * 100).toFixed(0)}%.
Their current orb profile shows alignment with these Orbs.
Keep the explanation concise and aligned with S2S language.`;

    const orbitalResponse = await generateOrbitalResponse({
      inquiry,
      metadata,
      rbi_output: rbiOutput,
    });

    return orbitalResponse.content || `${practiceName} aligns with your current field configuration and supports your development.`;
  } catch (error) {
    console.error('Error explaining practice recommendation:', error);
    return `${practiceName} aligns with your current field configuration and supports your development.`;
  }
}

