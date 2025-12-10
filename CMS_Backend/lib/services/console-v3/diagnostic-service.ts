/**
 * Console V3 Diagnostic Service
 * Handles SFI calculation, practice readiness assessment, and pathway matching
 * Uses RBI Kernel as primary computation method
 */

import type {
  DiagnosticSession,
  DiagnosticResponse,
  DiagnosticQuestion,
  SFIResult,
  PracticeReadinessAssessment,
  PathwayTemplate,
  PathwayMatch,
} from '@/lib/types/console-v3';
import { computeFieldSignatureWithRBI } from './rbi-integration-service';
import { EnhancedResonanceEngine } from 'rbi-kernel/field/computation/enhanced-engine';
import { loadCoreArchitecture, getOrbDefinition } from './architecture-loader';

/**
 * Calculate SFI (Sovereign Field Index) from diagnostic responses
 * Uses RBI Kernel as primary method for field signature computation
 */
export async function computeSFI(
  session: DiagnosticSession,
  responses: DiagnosticResponse[],
  questions: DiagnosticQuestion[]
): Promise<SFIResult> {
  // Use RBI Kernel as primary method
  try {
    const rbiResult = await computeFieldSignatureWithRBI(session, responses, questions);
    
    // Use RBI-computed orb and undercurrent profiles
    let orbProfile = rbiResult.orb_profile;
    const undercurrentProfile = rbiResult.undercurrent_profile;
    
    // Handle empty orb profile: create default uniform distribution across all 13 orbs
    if (Object.keys(orbProfile).length === 0) {
      console.warn('[SFI] Empty orb profile from RBI - creating default uniform distribution');
      for (let i = 1; i <= 13; i++) {
        orbProfile[`orb_${i}`] = 1 / 13;
      }
    }
    
    // Calculate SFI score from RBI coherence metrics
    // RBI coherence is 0.0-1.0, scale to 0.0-100.0 for SFI score
    const rbiCoherence = rbiResult.coherence_metrics.coherence;
    const sfiScore = Math.max(0, Math.min(100, rbiCoherence * 100));
    
    // Determine SFI state based on scaled SFI score (0-100 range)
    let sfiState: SFIResult['state'] = 'Emergent';
    if (sfiScore > 75.0) {
      sfiState = 'Coherent';
    } else if (sfiScore > 40.0) {
      sfiState = 'Fluid';
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[SFI] Using RBI Kernel computation');
      console.log('[SFI] RBI coherence metrics:', rbiResult.coherence_metrics);
      console.log('[SFI] RBI orb profile:', orbProfile);
    }
    
    return {
      score: sfiScore,
      state: sfiState,
      orb_profile: orbProfile,
      undercurrent_profile: undercurrentProfile,
    };
  } catch (rbiError) {
    // Fallback to weighted sum method only if RBI fails
    console.warn('[SFI] RBI computation failed, falling back to weighted sum method:', rbiError);
    return computeSFIWeightedSum(session, responses, questions);
  }
}

/**
 * Fallback SFI computation using weighted sum method
 * Only used if RBI Kernel computation fails
 */
function computeSFIWeightedSum(
  session: DiagnosticSession,
  responses: DiagnosticResponse[],
  questions: DiagnosticQuestion[]
): SFIResult {
  // Initialize orb and undercurrent profiles
  const orbProfile: Record<string, number> = {};
  const undercurrentProfile: Record<string, number> = {};

  // Aggregate weights from all responses
  for (const response of responses) {
    const question = questions.find(q => q.id === response.question_id);
    if (!question) continue;

    // Parse answer (could be string, number, or array)
    let answerValue: number = 0;
    let normalizedValue: number = 0;
    let optionIndex: number | undefined = undefined;
    
    // First, try to match raw answer directly to answer_options (most common case)
    const rawAnswer = response.raw_answer;
    optionIndex = question.answer_options?.indexOf(rawAnswer);
    
    if (optionIndex !== undefined && optionIndex >= 0 && question.answer_options) {
      // String answer matched to option: map index to normalized value
      // For 4 options: [0.25, 0.5, 0.75, 1.0] - creates clear differentiation
      const maxOptions = question.answer_options.length;
      normalizedValue = (optionIndex + 1) / maxOptions;
      answerValue = optionIndex + 1; // Store 1-indexed for reference
    } else {
      // Try JSON parsing for structured answers
      try {
        const parsed = JSON.parse(rawAnswer);
        if (typeof parsed === 'number') {
          answerValue = parsed;
          // Normalize numeric answers (assuming scale 1-5)
          normalizedValue = answerValue > 1 ? answerValue / 5 : answerValue;
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          // Multi-choice: use count normalized by max options
          answerValue = parsed.length;
          const maxOptions = question.answer_options?.length || 1;
          normalizedValue = answerValue / maxOptions;
        } else if (typeof parsed === 'string') {
          // Try matching parsed string
          optionIndex = question.answer_options?.indexOf(parsed);
          if (optionIndex !== undefined && optionIndex >= 0 && question.answer_options) {
            const maxOptions = question.answer_options.length;
            normalizedValue = (optionIndex + 1) / maxOptions;
            answerValue = optionIndex + 1;
          } else {
            // Fallback: try parsing as number
            answerValue = parseFloat(parsed) || 0;
            normalizedValue = answerValue > 1 ? answerValue / 5 : answerValue;
          }
        }
      } catch {
        // Not JSON, try parsing as number
        answerValue = parseFloat(rawAnswer) || 0;
        normalizedValue = answerValue > 1 ? answerValue / 5 : answerValue;
      }
    }
    
    // Debug: Log normalized value to verify it's different for different answers
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SFI] Q${question.id} Answer: "${rawAnswer}" (index: ${optionIndex}) → Normalized: ${normalizedValue.toFixed(3)}`);
    }

    // Apply orb weights - use normalized value AND option index to create variation
    // Since orb_weights are the same for all answer options, we use the option index
    // to shift emphasis between different orbs in the weight set
    const orbKeys = Object.keys(question.orb_weights || {});
    
    if (orbKeys.length > 0 && optionIndex !== undefined && optionIndex >= 0 && question.answer_options) {
      const numOptions = question.answer_options.length;
      const numOrbs = orbKeys.length;
      
      // Each answer option emphasizes different orbs
      // Option 0 → emphasizes first orb(s) more
      // Option N → emphasizes last orb(s) more
      orbKeys.forEach((orbKey, orbIndex) => {
        // Calculate emphasis: earlier options emphasize earlier orbs, later options emphasize later orbs
        const optionRatio = optionIndex / Math.max(1, numOptions - 1); // 0 to 1
        const orbRatio = orbIndex / Math.max(1, numOrbs - 1); // 0 to 1
        // Emphasis factor: 0.5 to 1.5 (50% less to 50% more)
        // Closer option/orb positions = higher emphasis
        // When option and orb are at same relative position, emphasis is highest
        const distance = Math.abs(optionRatio - orbRatio);
        const emphasisFactor = Math.max(0.5, Math.min(1.5, 1.5 - (distance * 1.0))); // Clamp to 0.5-1.5
        const baseWeight = question.orb_weights[orbKey] || 0;
        const adjustedWeight = baseWeight * emphasisFactor * normalizedValue;
        orbProfile[orbKey] = (orbProfile[orbKey] || 0) + adjustedWeight;
        
        // Only log in development to reduce noise
        if (process.env.NODE_ENV === 'development') {
          console.log(`[SFI]   Orb ${orbKey}: base=${baseWeight.toFixed(2)}, emphasis=${emphasisFactor.toFixed(2)}, final=${adjustedWeight.toFixed(4)}`);
        }
      });
    } else {
      // Fallback: simple multiplication (for scale questions or if no answer_options)
      for (const [orbKey, weight] of Object.entries(question.orb_weights || {})) {
        orbProfile[orbKey] = (orbProfile[orbKey] || 0) + (weight * normalizedValue);
      }
    }

    // Apply undercurrent weights
    for (const [ucKey, weight] of Object.entries(question.undercurrent_weights || {})) {
      undercurrentProfile[ucKey] = (undercurrentProfile[ucKey] || 0) + (weight * normalizedValue);
    }
  }

  // Debug: Log raw orb profile before normalization
  if (process.env.NODE_ENV === 'development') {
    console.log('[SFI] Raw orb profile before normalization:', JSON.stringify(orbProfile, null, 2));
  }

  // Normalize profiles (sum to 1.0) - but preserve relative differences
  const orbSum = Object.values(orbProfile).reduce((a, b) => a + b, 0);
  const ucSum = Object.values(undercurrentProfile).reduce((a, b) => a + b, 0);

  if (orbSum > 0) {
    for (const key in orbProfile) {
      orbProfile[key] = orbProfile[key] / orbSum;
    }
  } else {
    // If no orb weights were applied, create a default uniform distribution across all 13 orbs
    // This prevents empty profile from causing incorrect coherence calculations
    console.warn('[SFI] No orb weights applied - creating default uniform distribution across 13 orbs');
    for (let i = 1; i <= 13; i++) {
      orbProfile[`orb_${i}`] = 1 / 13;
    }
  }

  if (ucSum > 0) {
    for (const key in undercurrentProfile) {
      undercurrentProfile[key] = undercurrentProfile[key] / ucSum;
    }
  }

  // Debug: Log normalized orb profile
  console.log('[SFI] Normalized orb profile:', JSON.stringify(orbProfile, null, 2));

  // Calculate SFI score (0-100)
  // SFI is based on coherence across orbs and undercurrents
  const orbVariance = calculateVariance(Object.values(orbProfile));
  const ucVariance = calculateVariance(Object.values(undercurrentProfile));
  
  // Debug: Log variance calculations
  console.log(`[SFI] Orb variance: ${orbVariance.toFixed(4)}, UC variance: ${ucVariance.toFixed(4)}`);
  
  // Lower variance = higher coherence = higher SFI
  const coherenceScore = 1 - ((orbVariance + ucVariance) / 2);
  const sfiScore = Math.max(0, Math.min(100, coherenceScore * 100));
  
  console.log(`[SFI] Coherence score: ${coherenceScore.toFixed(4)}, SFI score: ${sfiScore.toFixed(2)}`);

  // Determine SFI state based on score and profile
  const sfiState = determineSFIState(sfiScore, orbProfile);

  return {
    score: sfiScore,
    state: sfiState,
    orb_profile: orbProfile,
    undercurrent_profile: undercurrentProfile,
  };
}

/**
 * Calculate practice readiness assessment
 */
export async function computePracticeReadiness(
  responses: DiagnosticResponse[],
  questions: DiagnosticQuestion[]
): Promise<PracticeReadinessAssessment> {
  const practiceReadinessProfile: Record<string, number> = {};
  const layerScores: Record<string, number[]> = {
    foundational: [],
    functional: [],
    advanced: [],
  };

  // Aggregate practice weights from responses
  for (const response of responses) {
    const question = questions.find(q => q.id === response.question_id);
    if (!question) continue;

    // Parse answer value (same logic as SFI calculation)
    let answerValue: number = 0;
    let normalizedValue: number = 0;
    let optionIndex: number | undefined = undefined;
    
    const rawAnswer = response.raw_answer;
    optionIndex = question.answer_options?.indexOf(rawAnswer);
    
    if (optionIndex !== undefined && optionIndex >= 0 && question.answer_options) {
      const maxOptions = question.answer_options.length;
      normalizedValue = (optionIndex + 1) / maxOptions;
      answerValue = optionIndex + 1;
    } else {
      try {
        const parsed = JSON.parse(rawAnswer);
        if (typeof parsed === 'number') {
          answerValue = parsed;
          normalizedValue = answerValue > 1 ? answerValue / 5 : answerValue;
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          answerValue = parsed.length;
          const maxOptions = question.answer_options?.length || 1;
          normalizedValue = answerValue / maxOptions;
        } else if (typeof parsed === 'string') {
          optionIndex = question.answer_options?.indexOf(parsed);
          if (optionIndex !== undefined && optionIndex >= 0 && question.answer_options) {
            const maxOptions = question.answer_options.length;
            normalizedValue = (optionIndex + 1) / maxOptions;
            answerValue = optionIndex + 1;
          } else {
            answerValue = parseFloat(parsed) || 0;
            normalizedValue = answerValue > 1 ? answerValue / 5 : answerValue;
          }
        }
      } catch {
        answerValue = parseFloat(rawAnswer) || 0;
        normalizedValue = answerValue > 1 ? answerValue / 5 : answerValue;
      }
    }

    // Apply practice weights
    for (const [practiceKey, weight] of Object.entries(question.practice_weights || {})) {
      practiceReadinessProfile[practiceKey] = 
        (practiceReadinessProfile[practiceKey] || 0) + (weight * normalizedValue);
    }

    // Track by layer if question has layer focus
    if (question.layer_focus && question.layer_focus !== 'all') {
      const layer = question.layer_focus as 'foundational' | 'functional' | 'advanced';
      layerScores[layer].push(normalizedValue);
    }
  }

  // Normalize practice readiness profile
  const maxPracticeScore = Math.max(...Object.values(practiceReadinessProfile), 1);
  for (const key in practiceReadinessProfile) {
    practiceReadinessProfile[key] = practiceReadinessProfile[key] / maxPracticeScore;
  }

  // Calculate layer readiness (average of layer-specific questions)
  const foundationalReadiness = layerScores.foundational.length > 0
    ? layerScores.foundational.reduce((a, b) => a + b, 0) / layerScores.foundational.length
    : 0.5; // Default if no foundational questions

  const functionalReadiness = layerScores.functional.length > 0
    ? layerScores.functional.reduce((a, b) => a + b, 0) / layerScores.functional.length
    : 0.5;

  const advancedReadiness = layerScores.advanced.length > 0
    ? layerScores.advanced.reduce((a, b) => a + b, 0) / layerScores.advanced.length
    : 0.3; // Lower default for advanced (requires higher readiness)

  return {
    foundational_readiness: Math.max(0, Math.min(1, foundationalReadiness)),
    functional_readiness: Math.max(0, Math.min(1, functionalReadiness)),
    advanced_readiness: Math.max(0, Math.min(1, advancedReadiness)),
    practice_readiness_profile: practiceReadinessProfile,
  };
}

/**
 * Match diagnostic results to pathway template
 */
/**
 * Match pathway using RBI resonance-based matching
 * Replaces simple weighted scoring with RBI's coherence-based matching
 */
export async function matchPathway(
  sfi: SFIResult,
  readiness: PracticeReadinessAssessment,
  pathwayTemplates: PathwayTemplate[]
): Promise<PathwayMatch | null> {
  if (pathwayTemplates.length === 0) {
    return null;
  }

  try {
    const engine = EnhancedResonanceEngine.getInstance();
    const architecture = loadCoreArchitecture();

    // Build user's field signature from SFI and readiness
    const userFieldSignature = JSON.stringify({
      sfi_score: sfi.score,
      sfi_state: sfi.state,
      orb_profile: sfi.orb_profile,
      undercurrent_profile: sfi.undercurrent_profile,
      foundational_readiness: readiness.foundational_readiness,
      functional_readiness: readiness.functional_readiness,
      advanced_readiness: readiness.advanced_readiness,
      practice_readiness: readiness.practice_readiness_profile,
    });

    // Build orb associations from user's orb profile (top orbs)
    const userOrbAssociations = Object.entries(sfi.orb_profile)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5) // Top 5 orbs
      .map(([key]) => parseInt(key.replace('orb_', '')))
      .filter(orbNum => !isNaN(orbNum) && orbNum >= 1 && orbNum <= 13);

    // Analyze user's field state with RBI
    const userAnalysis = await engine.analyzeContentWithMathematics(
      userFieldSignature,
      'User Field State',
      {
        orb_associations: userOrbAssociations.length > 0 ? userOrbAssociations : undefined,
        field_function: {
          content_purpose: 'user_field_state',
          primary_mechanism: 'pathway_matching',
          console_context: 'pathway_selection',
        },
      }
    );

    // Calculate resonance with each pathway template
    const pathwayMatches = await Promise.all(
      pathwayTemplates.map(async (template) => {
        // Build pathway template content
        const templateContent = JSON.stringify({
          name: template.name,
          description: template.description,
          orb_focus: template.orb_focus,
          practice_sequence: template.practice_sequence,
          layer_focus: template.layer_focus,
        });

        // Get orb definitions from architecture for metadata
        const templateOrbDefs = template.orb_focus
          .map(orbNum => architecture.orbs.get(orbNum))
          .filter(Boolean);

        // Build template description from orb definitions
        const templateDescription = template.description || 
          templateOrbDefs.map(orb => `${orb?.name}: ${orb?.function || ''}`).join('; ') ||
          `Pathway focusing on orbs ${template.orb_focus.join(', ')}`;

        // Analyze pathway template with RBI
        const templateAnalysis = await engine.analyzeContentWithMathematics(
          templateDescription,
          template.name,
          {
            orb_associations: template.orb_focus.length > 0 ? template.orb_focus : undefined,
            field_function: {
              content_purpose: 'pathway_template',
              primary_mechanism: 'pathway_matching',
              console_context: 'pathway_selection',
            },
          }
        );

        // Calculate resonance similarity (coherence-based matching)
        const resonance = await engine.calculateResonanceSimilarity(
          userFieldSignature,
          templateDescription,
          {
            orb_associations: userOrbAssociations.length > 0 ? userOrbAssociations : undefined,
            field_function: {
              content_purpose: 'user_field_state',
              primary_mechanism: 'pathway_matching',
              console_context: 'pathway_selection',
            },
          },
          {
            orb_associations: template.orb_focus.length > 0 ? template.orb_focus : undefined,
            field_function: {
              content_purpose: 'pathway_template',
              primary_mechanism: 'pathway_matching',
              console_context: 'pathway_selection',
            },
          }
        );

        // Get coherence metrics
        const templateCoherence = templateAnalysis.mathematical?.sovereignLogic?.coherence || 0;
        const userCoherence = userAnalysis.mathematical?.sovereignLogic?.coherence || 0;

        // Calculate field alignment (how well template orbs match user's orb profile)
        let fieldAlignment = 0;
        if (template.orb_focus.length > 0) {
          const orbAlignment = template.orb_focus.reduce((sum, orbNum) => {
            const orbKey = `orb_${orbNum}`;
            return sum + (sfi.orb_profile[orbKey] || 0);
          }, 0) / template.orb_focus.length;
          fieldAlignment = orbAlignment;
        }

        // Calculate layer alignment
        let layerAlignment = 0;
        if (template.layer_focus) {
          if (template.layer_focus === 'foundational') {
            layerAlignment = readiness.foundational_readiness;
          } else if (template.layer_focus === 'functional') {
            layerAlignment = readiness.functional_readiness;
          } else if (template.layer_focus === 'advanced') {
            layerAlignment = readiness.advanced_readiness;
          } else if (template.layer_focus === 'mixed') {
            layerAlignment = (
              readiness.foundational_readiness +
              readiness.functional_readiness +
              readiness.advanced_readiness
            ) / 3;
          }
        }

        // Combined match score: resonance (primary) + field alignment + layer alignment
        // Resonance is coherence-based, so it's the primary factor
        const matchScore = (
          resonance * 0.6 + // 60% weight on RBI resonance (coherence-based)
          fieldAlignment * 0.25 + // 25% weight on orb alignment
          layerAlignment * 0.15 // 15% weight on layer readiness
        );

        // Build reasoning
        const reasons: string[] = [];
        reasons.push(`RBI resonance: ${(resonance * 100).toFixed(0)}%`);
        reasons.push(`Template coherence: ${(templateCoherence * 100).toFixed(0)}%`);
        reasons.push(`Field alignment: ${(fieldAlignment * 100).toFixed(0)}%`);
        if (template.layer_focus) {
          reasons.push(`${template.layer_focus} layer: ${(layerAlignment * 100).toFixed(0)}%`);
        }

        return {
          template,
          resonance,
          coherence: templateCoherence,
          fieldAlignment,
          layerAlignment,
          matchScore,
          reasoning: reasons.join('; '),
        };
      })
    );

    // Filter by coherence threshold (> 0.7) and sort by resonance
    const validMatches = pathwayMatches
      .filter(m => m.coherence > 0.7) // Only coherent pathways
      .sort((a, b) => {
        // Primary: resonance score (coherence-based matching)
        if (Math.abs(a.resonance - b.resonance) > 0.05) {
          return b.resonance - a.resonance;
        }
        // Secondary: match score
        return b.matchScore - a.matchScore;
      });

    if (validMatches.length === 0) {
      // Fallback: if no pathways meet coherence threshold, use best match regardless
      const bestMatch = pathwayMatches.sort((a, b) => b.matchScore - a.matchScore)[0];
      if (bestMatch) {
        return {
          pathway_template: bestMatch.template,
          match_score: bestMatch.matchScore,
          reasoning: bestMatch.reasoning + ' (below coherence threshold, using best available)',
        };
      }
      return null;
    }

    const bestMatch = validMatches[0];

    if (process.env.NODE_ENV === 'development') {
      console.log('[Pathway Matching] RBI resonance-based matching:');
      console.log(`   Best match: ${bestMatch.template.name}`);
      console.log(`   Resonance: ${(bestMatch.resonance * 100).toFixed(0)}%`);
      console.log(`   Coherence: ${(bestMatch.coherence * 100).toFixed(0)}%`);
      console.log(`   Match score: ${(bestMatch.matchScore * 100).toFixed(0)}%`);
    }

    return {
      pathway_template: bestMatch.template,
      match_score: bestMatch.matchScore,
      reasoning: bestMatch.reasoning,
    };
  } catch (error) {
    console.error('[Pathway Matching] RBI matching failed, falling back to simple scoring:', error);
    
    // Fallback to simple scoring if RBI fails
    return matchPathwaySimple(sfi, readiness, pathwayTemplates);
  }
}

/**
 * Fallback pathway matching using simple weighted scoring
 * Only used if RBI matching fails
 */
function matchPathwaySimple(
  sfi: SFIResult,
  readiness: PracticeReadinessAssessment,
  pathwayTemplates: PathwayTemplate[]
): PathwayMatch | null {
  if (pathwayTemplates.length === 0) {
    return null;
  }

  let bestMatch: PathwayTemplate | null = null;
  let bestScore = 0;
  let bestReasoning = '';

  for (const template of pathwayTemplates) {
    let matchScore = 0;
    const reasons: string[] = [];

    // Score based on orb alignment
    if (template.orb_focus.length > 0) {
      const orbAlignment = template.orb_focus.reduce((sum, orbNum) => {
        const orbKey = `orb_${orbNum}`;
        return sum + (sfi.orb_profile[orbKey] || 0);
      }, 0) / template.orb_focus.length;
      matchScore += orbAlignment * 0.4;
      reasons.push(`Orb alignment: ${(orbAlignment * 100).toFixed(0)}%`);
    }

    // Score based on layer readiness
    if (template.layer_focus) {
      let layerReadiness = 0;
      if (template.layer_focus === 'foundational') {
        layerReadiness = readiness.foundational_readiness;
      } else if (template.layer_focus === 'functional') {
        layerReadiness = readiness.functional_readiness;
      } else if (template.layer_focus === 'advanced') {
        layerReadiness = readiness.advanced_readiness;
      } else if (template.layer_focus === 'mixed') {
        layerReadiness = (
          readiness.foundational_readiness +
          readiness.functional_readiness +
          readiness.advanced_readiness
        ) / 3;
      }
      matchScore += layerReadiness * 0.3;
      reasons.push(`${template.layer_focus} layer readiness: ${(layerReadiness * 100).toFixed(0)}%`);
    }

    // Score based on practice sequence alignment
    if (template.practice_sequence.length > 0) {
      const practiceAlignment = template.practice_sequence.reduce((sum, practiceId) => {
        const practiceKey = `practice_${practiceId}`;
        return sum + (readiness.practice_readiness_profile[practiceKey] || 0);
      }, 0) / template.practice_sequence.length;
      matchScore += practiceAlignment * 0.3;
      reasons.push(`Practice alignment: ${(practiceAlignment * 100).toFixed(0)}%`);
    }

    if (matchScore > bestScore) {
      bestScore = matchScore;
      bestMatch = template;
      bestReasoning = reasons.join('; ');
    }
  }

  if (!bestMatch) {
    return null;
  }

  return {
    pathway_template: bestMatch,
    match_score: bestScore,
    reasoning: bestReasoning,
  };
}

// Helper functions

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return variance;
}

function determineSFIState(score: number, orbProfile: Record<string, number>): string {
  if (score >= 80) {
    return 'coherent_forward_motion';
  } else if (score >= 60) {
    return 'aligned_momentum';
  } else if (score >= 40) {
    return 'stabilizing_coherence';
  } else if (score >= 20) {
    return 'misaligned_momentum';
  } else {
    return 'fragmented_field';
  }
}

