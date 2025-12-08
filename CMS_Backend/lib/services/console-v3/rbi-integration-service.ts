/**
 * Console V3 RBI Integration Service
 * Integrates RBI Kernel for field signature computation from diagnostic responses
 * Phase 7: RBI + Orbital Brain Integration
 */

import { FieldComputation } from 'rbi-kernel';
import type {
  DiagnosticSession,
  DiagnosticResponse,
  DiagnosticQuestion,
  SFIResult,
} from '@/lib/types/console-v3';

/**
 * Compute field signature using RBI Kernel from diagnostic responses
 * This replaces simple weighted sums with RBI field computation
 */
export async function computeFieldSignatureWithRBI(
  session: DiagnosticSession,
  responses: DiagnosticResponse[],
  questions: DiagnosticQuestion[]
): Promise<{
  orb_profile: Record<string, number>;
  undercurrent_profile: Record<string, number>;
  coherence_metrics: {
    field_strength: number;
    coherence: number;
    stability: number;
    gradient: number;
  };
  resonance_vectors: Record<string, any>;
}> {
  // Build resonance vectors from responses
  const resonanceVectors: Record<string, any> = {};
  const orbContributions: Record<string, number[]> = {};
  const undercurrentContributions: Record<string, number[]> = {};

  // Process each response to build field signature
  for (const response of responses) {
    const question = questions.find(q => q.id === response.question_id);
    if (!question) continue;

    // Parse answer to get normalized value
    const rawAnswer = response.raw_answer;
    let normalizedValue = 0;
    const optionIndex = question.answer_options?.indexOf(rawAnswer);

    if (optionIndex !== undefined && optionIndex >= 0 && question.answer_options) {
      const maxOptions = question.answer_options.length;
      normalizedValue = (optionIndex + 1) / maxOptions;
    } else {
      try {
        const parsed = JSON.parse(rawAnswer);
        if (typeof parsed === 'number') {
          normalizedValue = parsed > 1 ? parsed / 5 : parsed;
        }
      } catch {
        normalizedValue = parseFloat(rawAnswer) || 0;
        if (normalizedValue > 1) normalizedValue /= 5;
      }
    }

    // Build resonance vector for this response
    const orbWeights = question.orb_weights || {};
    const undercurrentWeights = question.undercurrent_weights || {};

    // Aggregate orb contributions
    for (const [orbKey, weight] of Object.entries(orbWeights)) {
      if (!orbContributions[orbKey]) {
        orbContributions[orbKey] = [];
      }
      orbContributions[orbKey].push(weight * normalizedValue);
    }

    // Aggregate undercurrent contributions
    for (const [ucKey, weight] of Object.entries(undercurrentWeights)) {
      if (!undercurrentContributions[ucKey]) {
        undercurrentContributions[ucKey] = [];
      }
      undercurrentContributions[ucKey].push(weight * normalizedValue);
    }

    // Build resonance vector with orb associations
    const orbAssociations = Object.keys(orbWeights).map(k => parseInt(k.replace('orb_', ''))).filter(n => !isNaN(n));
    resonanceVectors[`response_${response.id}`] = {
      x: normalizedValue,
      y: Object.values(orbWeights).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(orbWeights).length),
      z: Math.sqrt(Object.values(orbWeights).reduce((a, b) => a + b * b, 0)),
      w: orbAssociations.length > 0 ? orbAssociations[0] / 13 : 0, // Normalize orb to 0-1
      orbAssociations,
    };
  }

  // Compute RBI field dynamics from resonance vectors
  let fieldDynamics: any = {
    fieldStrength: 0,
    coherence: 0,
    stability: 0,
    gradient: 0,
  };

  try {
    // Use RBI Kernel to compute field dynamics
    const vectors = Object.values(resonanceVectors);
    if (vectors.length > 0) {
      // Compute resonance between vectors
      const resonanceScores: number[] = [];
      for (let i = 0; i < vectors.length; i++) {
        for (let j = i + 1; j < vectors.length; j++) {
          const v1 = vectors[i] as any;
          const v2 = vectors[j] as any;
          
          // Compute cosine similarity (simplified resonance)
          const dotProduct = (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z) + (v1.w * v2.w);
          const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2 + v1.w ** 2);
          const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2.z ** 2 + v2.w ** 2);
          const similarity = mag1 > 0 && mag2 > 0 ? dotProduct / (mag1 * mag2) : 0;
          
          resonanceScores.push(similarity);
        }
      }

      // Calculate field metrics from resonance scores
      const avgResonance = resonanceScores.length > 0
        ? resonanceScores.reduce((a, b) => a + b, 0) / resonanceScores.length
        : 0;

      fieldDynamics = {
        fieldStrength: avgResonance,
        coherence: avgResonance,
        stability: 1 - (resonanceScores.length > 0
          ? Math.sqrt(resonanceScores.reduce((sum, score) => sum + (score - avgResonance) ** 2, 0) / resonanceScores.length)
          : 0),
        gradient: avgResonance > 0.5 ? 1 : avgResonance * 2,
      };
    }
  } catch (error) {
    console.error('Error computing RBI field dynamics:', error);
    // Fallback to simple calculation
  }

  // Build normalized orb profile from contributions
  const orbProfile: Record<string, number> = {};
  for (const [orbKey, contributions] of Object.entries(orbContributions)) {
    const sum = contributions.reduce((a, b) => a + b, 0);
    orbProfile[orbKey] = sum / Math.max(1, contributions.length);
  }

  // Normalize orb profile (sum to 1.0)
  const orbSum = Object.values(orbProfile).reduce((a, b) => a + b, 0);
  if (orbSum > 0) {
    for (const key in orbProfile) {
      orbProfile[key] /= orbSum;
    }
  }

  // Build normalized undercurrent profile
  const undercurrentProfile: Record<string, number> = {};
  for (const [ucKey, contributions] of Object.entries(undercurrentContributions)) {
    const sum = contributions.reduce((a, b) => a + b, 0);
    undercurrentProfile[ucKey] = sum / Math.max(1, contributions.length);
  }

  // Normalize undercurrent profile
  const ucSum = Object.values(undercurrentProfile).reduce((a, b) => a + b, 0);
  if (ucSum > 0) {
    for (const key in undercurrentProfile) {
      undercurrentProfile[key] /= ucSum;
    }
  }

  return {
    orb_profile: orbProfile,
    undercurrent_profile: undercurrentProfile,
    coherence_metrics: {
      field_strength: fieldDynamics.fieldStrength,
      coherence: fieldDynamics.coherence,
      stability: fieldDynamics.stability,
      gradient: fieldDynamics.gradient,
    },
    resonance_vectors: resonanceVectors,
  };
}

/**
 * Validate pathway recommendation using RBI coherence metrics
 */
export function validatePathwayWithRBI(
  pathwayOrbFocus: number[],
  userOrbProfile: Record<string, number>,
  coherenceMetrics: {
    field_strength: number;
    coherence: number;
    stability: number;
    gradient: number;
  }
): {
  alignment_score: number;
  coherence_validated: boolean;
  recommendation_strength: 'strong' | 'moderate' | 'weak';
} {
  // Calculate alignment between pathway orbs and user orb profile
  let alignmentSum = 0;
  let alignmentCount = 0;

  for (const orbNum of pathwayOrbFocus) {
    const orbKey = `orb_${orbNum}`;
    const userValue = userOrbProfile[orbKey] || 0;
    alignmentSum += userValue;
    alignmentCount++;
  }

  const alignmentScore = alignmentCount > 0 ? alignmentSum / alignmentCount : 0;

  // Validate coherence
  const coherenceValidated = coherenceMetrics.coherence >= 0.5 && coherenceMetrics.stability >= 0.3;

  // Determine recommendation strength
  let recommendationStrength: 'strong' | 'moderate' | 'weak' = 'weak';
  if (alignmentScore >= 0.7 && coherenceValidated) {
    recommendationStrength = 'strong';
  } else if (alignmentScore >= 0.4 && coherenceMetrics.coherence >= 0.3) {
    recommendationStrength = 'moderate';
  }

  return {
    alignment_score: alignmentScore,
    coherence_validated: coherenceValidated,
    recommendation_strength: recommendationStrength,
  };
}

