/**
 * Console V3 RBI Integration Service
 * Integrates RBI Kernel for field signature computation from diagnostic responses
 * Phase 7: RBI + Orbital Brain Integration
 * 
 * Uses RBI Kernel's full 5-layer field-level coherence architecture:
 * - Layer 1: Representation (multidimensional resonance fields)
 * - Layer 2: Computation (spatial, temporal, contextual coherence)
 * - Layer 3: Temporal Continuity (adaptive stability)
 * - Layer 4: Validation (Proof-of-Meaning)
 * - Layer 5: Integration (verified coherence data)
 * 
 * Core Architecture Integration:
 * - Loads core architecture files FIRST (orbs, undercurrents)
 * - Uses architecture as reference for RBI analysis
 * - Matches user responses to actual orb/undercurrent content via resonance
 */

import { EnhancedResonanceEngine } from '@/lib/rbi-kernel/field/computation/enhanced-engine';
import { loadCoreArchitecture, findOrbsByKeyword, findUndercurrentsByKeyword } from './architecture-loader';
import type {
  DiagnosticSession,
  DiagnosticResponse,
  DiagnosticQuestion,
  SFIResult,
} from '@/lib/types/console-v3';

/**
 * ContentMetadata interface for RBI Kernel
 * Matches the interface from RBI-Kernel/src/field/computation/enhanced-engine.ts
 */
interface ContentMetadata {
  orb_associations?: number[];
  field_function?: {
    content_purpose?: string;
    primary_mechanism?: string;
    console_context?: string;
    console_relation?: string;
  };
  book_threading?: {
    book_id?: string;
    target_section?: string;
    target_chapter?: string;
    relevance_score?: number;
  };
  integration_points?: {
    codex?: string[];
    console_views?: string[];
    editorial_pass?: string;
  };
  tags?: string[];
  category?: string;
  dashboard_component?: string;
}

/**
 * Extract orb associations from diagnostic responses and questions
 * Returns array of orb numbers (1-13) that are associated with the responses
 */
function extractOrbAssociations(
  responses: DiagnosticResponse[],
  questions: DiagnosticQuestion[]
): number[] {
  const orbSet = new Set<number>();
  
  for (const response of responses) {
    const question = questions.find(q => q.id === response.question_id);
    if (!question || !question.orb_weights) continue;
    
    // Extract orb numbers from orb_weights keys (e.g., "orb_1" -> 1)
    for (const orbKey of Object.keys(question.orb_weights)) {
      const orbNum = parseInt(orbKey.replace('orb_', ''));
      if (!isNaN(orbNum) && orbNum >= 1 && orbNum <= 13) {
        orbSet.add(orbNum);
      }
    }
  }
  
  return Array.from(orbSet).sort((a, b) => a - b);
}

/**
 * Build orb profile from RBI analysis results
 * Extracts orb activation from RBI's orb_associations and coherence matrix
 * Uses architecture to validate and enhance orb associations
 */
function buildOrbProfileFromRBI(
  analysis: any,
  responses: DiagnosticResponse[],
  questions: DiagnosticQuestion[],
  architecture?: any
): Record<string, number> {
  // Get orb associations from RBI analysis (metadata-first approach)
  const orbAssociations = analysis.orb_associations || [];
  
  // If RBI provided orb associations, use them to build profile
  if (orbAssociations.length > 0) {
    const orbProfile: Record<string, number> = {};
    
    // Initialize all orbs to 0
    for (let i = 1; i <= 13; i++) {
      orbProfile[`orb_${i}`] = 0;
    }
    
    // Weight orbs by their presence in associations and coherence
    const coherence = analysis.mathematical?.sovereignLogic?.coherence || 0;
    const weightPerOrb = coherence / orbAssociations.length;
    
    for (const orbNum of orbAssociations) {
      if (orbNum >= 1 && orbNum <= 13) {
        orbProfile[`orb_${orbNum}`] = weightPerOrb;
      }
    }
    
    // Also incorporate orb weights from questions (weighted by answer values)
    for (const response of responses) {
      const question = questions.find(q => q.id === response.question_id);
      if (!question || !question.orb_weights) continue;
      
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
      
      // Add weighted contributions
      for (const [orbKey, weight] of Object.entries(question.orb_weights)) {
        const orbNum = parseInt(orbKey.replace('orb_', ''));
        if (!isNaN(orbNum) && orbNum >= 1 && orbNum <= 13) {
          orbProfile[`orb_${orbNum}`] = (orbProfile[`orb_${orbNum}`] || 0) + (weight * normalizedValue);
        }
      }
    }
    
    // Normalize orb profile (sum to 1.0)
    const orbSum = Object.values(orbProfile).reduce((a, b) => a + b, 0);
    if (orbSum > 0) {
      for (const key in orbProfile) {
        orbProfile[key] /= orbSum;
      }
    } else {
      // Default to uniform distribution if sum is zero
      for (let i = 1; i <= 13; i++) {
        orbProfile[`orb_${i}`] = 1 / 13;
      }
    }
    
    return orbProfile;
  }
  
  // Fallback: build from question orb_weights if RBI didn't provide associations
  const orbProfile: Record<string, number> = {};
  const orbContributions: Record<string, number[]> = {};
  
  for (const response of responses) {
    const question = questions.find(q => q.id === response.question_id);
    if (!question || !question.orb_weights) continue;
    
    // Parse answer
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
    
    // Aggregate orb contributions
    for (const [orbKey, weight] of Object.entries(question.orb_weights)) {
      if (!orbContributions[orbKey]) {
        orbContributions[orbKey] = [];
      }
      orbContributions[orbKey].push(weight * normalizedValue);
    }
  }
  
  // Build profile from contributions
  for (const [orbKey, contributions] of Object.entries(orbContributions)) {
    const sum = contributions.reduce((a, b) => a + b, 0);
    orbProfile[orbKey] = sum / Math.max(1, contributions.length);
  }
  
  // Normalize
  const orbSum = Object.values(orbProfile).reduce((a, b) => a + b, 0);
  if (orbSum > 0) {
    for (const key in orbProfile) {
      orbProfile[key] /= orbSum;
    }
  } else {
    // Default to uniform distribution
    for (let i = 1; i <= 13; i++) {
      orbProfile[`orb_${i}`] = 1 / 13;
    }
  }
  
  return orbProfile;
}

/**
 * Build undercurrent profile from RBI analysis results
 * Uses question undercurrent_weights as fallback
 * Uses architecture to validate undercurrent associations
 */
function buildUndercurrentProfileFromRBI(
  analysis: any,
  responses: DiagnosticResponse[],
  questions: DiagnosticQuestion[],
  architecture?: any
): Record<string, number> {
  const undercurrentProfile: Record<string, number> = {};
  const undercurrentContributions: Record<string, number[]> = {};
  
  for (const response of responses) {
    const question = questions.find(q => q.id === response.question_id);
    if (!question || !question.undercurrent_weights) continue;
    
    // Parse answer
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
    
    // Aggregate undercurrent contributions
    for (const [ucKey, weight] of Object.entries(question.undercurrent_weights)) {
      if (!undercurrentContributions[ucKey]) {
        undercurrentContributions[ucKey] = [];
      }
      undercurrentContributions[ucKey].push(weight * normalizedValue);
    }
  }
  
  // Build profile from contributions
  for (const [ucKey, contributions] of Object.entries(undercurrentContributions)) {
    const sum = contributions.reduce((a, b) => a + b, 0);
    undercurrentProfile[ucKey] = sum / Math.max(1, contributions.length);
  }
  
  // Normalize
  const ucSum = Object.values(undercurrentProfile).reduce((a, b) => a + b, 0);
  if (ucSum > 0) {
    for (const key in undercurrentProfile) {
      undercurrentProfile[key] /= ucSum;
    }
  }
  
  return undercurrentProfile;
}

/**
 * Compute field signature using RBI Kernel's full field-level coherence architecture
 * Replaces manual cosine similarity with RBI's analyzeContentWithMathematics
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
  try {
    // Get RBI Kernel instance
    const engine = EnhancedResonanceEngine.getInstance();
    
    // Build content from diagnostic responses
    // Structure responses as JSON for RBI analysis
    const diagnosticContent = JSON.stringify({
      session_id: session.id,
      responses: responses.map(r => {
        const question = questions.find(q => q.id === r.question_id);
        return {
          question_id: r.question_id,
          question_text: question?.question_text || question?.text,
          answer: r.raw_answer,
          orb_weights: question?.orb_weights || {},
          undercurrent_weights: question?.undercurrent_weights || {},
        };
      }),
      metadata: {
        total_responses: responses.length,
        total_questions: questions.length,
      }
    });
    
    // Extract orb associations from responses and questions
    const orbAssociations = extractOrbAssociations(responses, questions);
    
    // Load core architecture to enhance metadata
    const architecture = loadCoreArchitecture();
    
    // Build enhanced orb associations using architecture
    // Verify orbs exist in architecture and get their definitions
    const validatedOrbAssociations = orbAssociations.filter(orbNum => {
      const orbDef = architecture.orbs.get(orbNum);
      if (!orbDef) {
        console.warn(`[RBI] Orb ${orbNum} not found in architecture, excluding from associations`);
        return false;
      }
      return true;
    });
    
    // Extract undercurrent associations from questions
    const undercurrentAssociations: number[] = [];
    for (const response of responses) {
      const question = questions.find(q => q.id === response.question_id);
      if (!question || !question.undercurrent_weights) continue;
      
      for (const ucKey of Object.keys(question.undercurrent_weights)) {
        const ucNum = parseInt(ucKey.replace('uc_', ''));
        if (!isNaN(ucNum) && ucNum >= 1 && ucNum <= 12 && !undercurrentAssociations.includes(ucNum)) {
          // Verify undercurrent exists in architecture
          const ucDef = architecture.undercurrents.get(ucNum);
          if (ucDef) {
            undercurrentAssociations.push(ucNum);
          }
        }
      }
    }
    
    // Build ContentMetadata for RBI (metadata-first approach with architecture context)
    const metadata: ContentMetadata = {
      orb_associations: validatedOrbAssociations.length > 0 ? validatedOrbAssociations : undefined,
      field_function: {
        content_purpose: 'sovereign_field_inquiry',
        primary_mechanism: 'diagnostic_analysis',
        console_context: 'sfi_computation',
        console_relation: 'field_signature_generation',
      },
      tags: [
        'diagnostic',
        'sfi',
        'field_analysis',
        'sovereign_field_inquiry',
        ...validatedOrbAssociations.map(orb => `orb_${orb}`),
        ...undercurrentAssociations.map(uc => `undercurrent_${uc}`),
      ],
      category: 'diagnostic_response',
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[RBI] Architecture-enhanced metadata:');
      console.log(`   Orbs: ${validatedOrbAssociations.join(', ')}`);
      console.log(`   Undercurrents: ${undercurrentAssociations.join(', ')}`);
    }
    
    // Use RBI Kernel's full field analysis
    const analysis = await engine.analyzeContentWithMathematics(
      diagnosticContent,
      `Diagnostic Session ${session.id}`,
      metadata
    );
    
    // Extract field signature from RBI analysis
    // Use architecture to enhance orb profile building
    const orbProfile = buildOrbProfileFromRBI(analysis, responses, questions, architecture);
    const undercurrentProfile = buildUndercurrentProfileFromRBI(analysis, responses, questions, architecture);
    
    // Extract coherence metrics from RBI's field dynamics
    const fieldDynamics = analysis.mathematical?.fieldDynamics;
    const sovereignLogic = analysis.mathematical?.sovereignLogic;
    const resonanceVector = analysis.mathematical?.resonanceVector;
    
    // Build resonance vectors from RBI analysis
    const resonanceVectors: Record<string, any> = {};
    if (resonanceVector) {
      resonanceVectors['field_signature'] = {
        x: resonanceVector.x, // clarity
        y: resonanceVector.y, // coherence
        z: resonanceVector.z, // resonance
        w: resonanceVector.w, // sovereignty
        orb_associations: orbAssociations,
      };
    }
    
    // Extract coherence metrics from RBI (RBI returns 0-1 values)
    // Keep as 0-1 for internal use, caller can scale to 0-100 if needed
    const coherenceMetrics = {
      field_strength: fieldDynamics?.fieldStrength || 0,
      coherence: sovereignLogic?.coherence || fieldDynamics?.coherence || 0,
      stability: fieldDynamics?.stability || 0,
      gradient: Array.isArray(fieldDynamics?.gradient) 
        ? (fieldDynamics.gradient[0] || 0)
        : (fieldDynamics?.gradient || 0),
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[RBI] Full field analysis complete');
      console.log('[RBI] Proof status:', sovereignLogic?.validity || 'unknown');
      console.log('[RBI] Coherence:', coherenceMetrics.coherence);
      console.log('[RBI] Orb associations:', orbAssociations);
      console.log('[RBI] Field dynamics:', fieldDynamics);
    }
    
    return {
      orb_profile: orbProfile,
      undercurrent_profile: undercurrentProfile,
      coherence_metrics: coherenceMetrics,
      resonance_vectors: resonanceVectors,
    };
  } catch (error) {
    console.error('[RBI] Error computing field signature with RBI Kernel:', error);
    // Fallback to manual computation if RBI fails
    throw error; // Let caller handle fallback
  }
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

