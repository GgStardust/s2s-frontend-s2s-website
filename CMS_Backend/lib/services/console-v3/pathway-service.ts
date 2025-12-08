/**
 * Console V3 Pathway Service
 * Handles pathway building, step management, and content fetching
 */

import type {
  UserPathway,
  PathwayTemplate,
  PathwayStep,
  SFIResult,
  PracticeReadinessAssessment,
} from '@/lib/types/console-v3';
import { EnhancedResonanceEngine } from 'rbi-kernel/types';
import { loadCoreArchitecture } from './architecture-loader';

/**
 * Create pathway steps from template's practice_sequence
 * This ensures pathway steps exist for the template
 */
export async function ensurePathwaySteps(
  template: PathwayTemplate,
  supabase: any
): Promise<PathwayStep[]> {
  // Check if steps already exist
  const { data: existingSteps } = await supabase
    .from('pathway_steps')
    .select('*')
    .eq('pathway_template_id', template.id)
    .order('step_number', { ascending: true });

  // If steps exist, return them
  if (existingSteps && existingSteps.length > 0) {
    return existingSteps;
  }

  // Create steps from practice_sequence
  const steps: PathwayStep[] = [];
  const practiceSequence = template.practice_sequence || [];

  if (practiceSequence.length === 0) {
    console.warn(`Template ${template.id} has no practice_sequence`);
    return [];
  }

  // First, create the introduction step (step_number 0)
  const { data: introStep, error: introError } = await supabase
    .from('pathway_steps')
    .insert({
      pathway_template_id: template.id,
      step_number: 0, // Before practice steps
      type: 'reading',
      title: 'Pathway Introduction',
      description: template.description || 'Begin your practice pathway',
      instructions: `Welcome to ${template.name}. This pathway includes ${practiceSequence.length} practices designed to support your field development.`,
      est_duration_minutes: 5,
      requires_step_ids: [], // Introduction step has no dependencies
    })
    .select()
    .single();

  if (introError) {
    console.error('Failed to create introduction step:', introError);
    throw new Error(`Failed to create pathway introduction step: ${introError.message}`);
  }

  if (!introStep) {
    throw new Error('Introduction step creation returned no data');
  }

  steps.push(introStep);

  // Create a step for each practice in the sequence
  // Each step depends on the previous step (sequential pathway)
  for (let i = 0; i < practiceSequence.length; i++) {
    const practiceId = practiceSequence[i];
    
    // Get practice details for title/description
    const { data: practice, error: practiceError } = await supabase
      .from('practices')
      .select('name, layer, core_function')
      .eq('id', practiceId)
      .single();

    if (practiceError) {
      console.error(`Practice ${practiceId} not found:`, practiceError);
      throw new Error(`Practice ${practiceId} not found: ${practiceError.message}`);
    }

    if (!practice) {
      throw new Error(`Practice ${practiceId} not found: no data returned`);
    }

    // Determine dependencies: first practice step depends on intro, 
    // subsequent steps depend on the previous practice step
    const previousStepId = i === 0 
      ? [introStep.id] // First practice depends on intro (guaranteed to exist)
      : (steps.length > 0 ? [steps[steps.length - 1].id] : []); // Subsequent steps depend on previous step

    const stepData = {
      pathway_template_id: template.id,
      step_number: i + 1,
      type: 'practice' as const,
      practice_id: practiceId,
      title: `Practice ${practiceId}: ${practice.name}`,
      description: practice.core_function || undefined,
      instructions: `Engage with Practice ${practiceId}: ${practice.name}. This is a ${practice.layer || 'foundational'} practice.`,
      est_duration_minutes: 15, // Default duration
      requires_step_ids: previousStepId, // Sequential dependencies
    };

    const { data: step, error: stepError } = await supabase
      .from('pathway_steps')
      .insert(stepData)
      .select()
      .single();

    if (stepError) {
      console.error(`Failed to create pathway step ${i + 1}:`, stepError);
      continue;
    }

    steps.push(step);
  }

  return steps;
}

/**
 * Generate dynamic practice sequence using RBI coherence
 * Phase 7.3: Coherence-based practice sequencing
 * 
 * Uses RBI to:
 * 1. Analyze each practice's coherence with user's field state
 * 2. Calculate resonance between practices (ensuring they resonate with each other)
 * 3. Order practices by coherence and resonance
 * 4. Ensure practices build on each other coherently
 */
export async function generateDynamicPracticeSequence(
  sfi: SFIResult,
  readiness: PracticeReadinessAssessment,
  availablePractices: any[], // Practices from database
  options: {
    minCoherence?: number; // Default: 0.7
    maxPractices?: number; // Default: 8 or 12 based on layer
    layer?: 'foundational' | 'functional' | 'advanced' | 'mixed';
  } = {}
): Promise<number[]> {
  const {
    minCoherence = 0.7,
    maxPractices = 8,
    layer,
  } = options;

  try {
    const engine = EnhancedResonanceEngine.getInstance();
    const architecture = loadCoreArchitecture();

    // Build user's field signature
    const userFieldSignature = JSON.stringify({
      sfi_score: sfi.score,
      sfi_state: sfi.state,
      orb_profile: sfi.orb_profile,
      undercurrent_profile: sfi.undercurrent_profile,
      foundational_readiness: readiness.foundational_readiness,
      functional_readiness: readiness.functional_readiness,
      advanced_readiness: readiness.advanced_readiness,
    });

    // Get user's top orbs
    const userOrbAssociations = Object.entries(sfi.orb_profile)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
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
          primary_mechanism: 'practice_sequencing',
          console_context: 'dynamic_sequence_generation',
        },
      }
    );

    // Filter practices by layer if specified
    let filteredPractices = availablePractices;
    if (layer && layer !== 'mixed') {
      filteredPractices = availablePractices.filter(p => p.layer === layer);
    }

    // Analyze each practice's coherence with user's field state
    const practiceAnalyses = await Promise.all(
      filteredPractices.map(async (practice) => {
        // Build practice content
        const practiceContent = practice.description || practice.instructions || practice.name || '';
        
        // Get practice orb associations
        const practiceOrbAssociations: number[] = [];
        if (practice.orb_mappings && Array.isArray(practice.orb_mappings)) {
          practiceOrbAssociations.push(...practice.orb_mappings.map((m: any) => m.orb_number));
        }

        // Analyze practice with RBI
        const practiceAnalysis = await engine.analyzeContentWithMathematics(
          practiceContent,
          practice.name || `Practice ${practice.id}`,
          {
            orb_associations: practiceOrbAssociations.length > 0 ? practiceOrbAssociations : undefined,
            field_function: {
              content_purpose: 'practice_module',
              primary_mechanism: 'practice_sequencing',
              console_context: 'dynamic_sequence_generation',
            },
          }
        );

        // Calculate resonance with user's field state
        const resonance = await engine.calculateResonanceSimilarity(
          userFieldSignature,
          practiceContent,
          {
            orb_associations: userOrbAssociations.length > 0 ? userOrbAssociations : undefined,
            field_function: {
              content_purpose: 'user_field_state',
              primary_mechanism: 'practice_sequencing',
              console_context: 'dynamic_sequence_generation',
            },
          },
          {
            orb_associations: practiceOrbAssociations.length > 0 ? practiceOrbAssociations : undefined,
            field_function: {
              content_purpose: 'practice_module',
              primary_mechanism: 'practice_sequencing',
              console_context: 'dynamic_sequence_generation',
            },
          }
        );

        // Get coherence metrics
        const coherence = practiceAnalysis.mathematical?.sovereignLogic?.coherence || 0;
        const fieldStrength = practiceAnalysis.mathematical?.fieldDynamics?.fieldStrength || 0;

        // Get practice readiness
        const practiceReadiness = readiness.practice_readiness_profile[`practice_${practice.id}`] || 0;

        // Combined score: resonance (primary) + coherence + readiness
        const score = (
          resonance * 0.5 + // 50% weight on RBI resonance
          coherence * 0.3 + // 30% weight on practice coherence
          practiceReadiness * 0.2 // 20% weight on user readiness
        );

        return {
          practice,
          practiceId: practice.id,
          resonance,
          coherence,
          fieldStrength,
          practiceReadiness,
          score,
        };
      })
    );

    // Filter by coherence threshold
    const validPractices = practiceAnalyses
      .filter(analysis => analysis.coherence >= minCoherence)
      .sort((a, b) => b.score - a.score); // Sort by combined score

    // Now calculate resonance between practices to ensure they resonate with each other
    // This ensures the sequence is coherent, not just individual practices
    const sequencedPractices: number[] = [];
    const remainingPractices = [...validPractices];

    // Start with the highest-scoring practice
    if (remainingPractices.length > 0) {
      const firstPractice = remainingPractices.shift()!;
      sequencedPractices.push(firstPractice.practiceId);

      // Build sequence by finding practices that resonate with the current sequence
      while (sequencedPractices.length < maxPractices && remainingPractices.length > 0) {
        let bestNextPractice: typeof remainingPractices[0] | null = null;
        let bestResonance = 0;

        // Build current sequence signature
        const currentSequenceContent = sequencedPractices
          .map(id => {
            const practice = filteredPractices.find(p => p.id === id);
            return practice?.name || `Practice ${id}`;
          })
          .join('; ');

        // Find practice that resonates best with current sequence
        for (const candidate of remainingPractices) {
          const candidateContent = candidate.practice.description || candidate.practice.name || '';
          
          // Calculate resonance with current sequence
          const sequenceResonance = await engine.calculateResonanceSimilarity(
            currentSequenceContent,
            candidateContent,
            undefined,
            {
              orb_associations: candidate.practice.orb_mappings?.map((m: any) => m.orb_number) || undefined,
              field_function: {
                content_purpose: 'practice_module',
                primary_mechanism: 'practice_sequencing',
                console_context: 'dynamic_sequence_generation',
              },
            }
          );

          // Combined score: resonance with sequence + original score
          const combinedScore = (sequenceResonance * 0.4) + (candidate.score * 0.6);

          if (combinedScore > bestResonance) {
            bestResonance = combinedScore;
            bestNextPractice = candidate;
          }
        }

        if (bestNextPractice) {
          sequencedPractices.push(bestNextPractice.practiceId);
          // Remove from remaining
          const index = remainingPractices.findIndex(p => p.practiceId === bestNextPractice!.practiceId);
          if (index >= 0) {
            remainingPractices.splice(index, 1);
          }
        } else {
          // No good match found, break
          break;
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Dynamic Practice Sequence] RBI coherence-based sequencing:');
      console.log(`   Generated sequence: ${sequencedPractices.join(', ')}`);
      console.log(`   Practices analyzed: ${practiceAnalyses.length}`);
      console.log(`   Valid practices (coherence >= ${minCoherence}): ${validPractices.length}`);
      console.log(`   Final sequence length: ${sequencedPractices.length}`);
    }

    return sequencedPractices;
  } catch (error) {
    console.error('[Dynamic Practice Sequence] RBI sequencing failed, falling back to readiness-based:', error);
    
    // Fallback: sort by practice readiness
    const sortedByReadiness = filteredPractices
      .map(practice => ({
        practice,
        readiness: readiness.practice_readiness_profile[`practice_${practice.id}`] || 0,
      }))
      .sort((a, b) => b.readiness - a.readiness)
      .slice(0, maxPractices)
      .map(item => item.practice.id);

    return sortedByReadiness;
  }
}

/**
 * Build a UserPathway from a PathwayTemplate
 */
export async function buildPathwayFromTemplate(
  template: PathwayTemplate,
  user_id: string | undefined,
  email: string | undefined,
  session_id: string,
  supabase: any
): Promise<UserPathway> {
  // Ensure pathway steps exist for this template
  await ensurePathwaySteps(template, supabase);

  // Create user pathway
  const { data: pathway, error: pathwayError } = await supabase
    .from('user_pathways')
    .insert({
      user_id: user_id || null,
      email: email || null,
      session_id: session_id,
      pathway_template_id: template.id,
      current_step_id: null,
      completed_step_ids: [],
      progress_percentage: 0.0,
      status: 'active',
    })
    .select()
    .single();

  if (pathwayError) {
    throw new Error(`Failed to create user pathway: ${pathwayError.message}`);
  }

  // Get first step to set as current
  const { data: firstStep, error: firstStepError } = await supabase
    .from('pathway_steps')
    .select('*')
    .eq('pathway_template_id', template.id)
    .order('step_number', { ascending: true })
    .limit(1)
    .single();

  if (firstStepError) {
    console.error('Failed to fetch first pathway step:', firstStepError);
    // Don't throw - pathway was created, just log the error
    // The pathway can still be used, user will need to manually select first step
  } else if (firstStep) {
    const { error: updateError } = await supabase
      .from('user_pathways')
      .update({ current_step_id: firstStep.id })
      .eq('id', pathway.id);

    if (updateError) {
      console.warn('Failed to set current step:', updateError);
      // Don't throw - pathway was created successfully, just couldn't set current step
    }
  } else {
    console.warn(`No pathway steps found for template ${template.id}`);
    // This shouldn't happen if ensurePathwaySteps worked, but handle gracefully
  }

  return pathway;
}

/**
 * Get pathway content for a step
 * Returns Codex entry or practice module content
 */
export async function getPathwayContent(
  step: PathwayStep,
  supabase: any
): Promise<any> {
  if (step.type === 'codex_entry' && step.codex_entry_id) {
    // Fetch Codex entry from content_files table (using Codex API logic)
    const { data: codexEntry, error } = await supabase
      .from('content_files')
      .select('*')
      .eq('id', step.codex_entry_id)
      .eq('console_ready', true)
      .eq('visibility', 'codex')
      .single();

    if (error) {
      console.error('Error fetching Codex entry:', error);
      return {
        type: 'codex_entry',
        id: step.codex_entry_id,
        error: 'Codex entry not found or not available',
      };
    }

    return {
      type: 'codex_entry',
      id: codexEntry.id,
      title: codexEntry.title,
      content: codexEntry.content,
      codex_category: codexEntry.codex_category,
      orb_associations: codexEntry.orb_associations,
      console_tags: codexEntry.console_tags,
    };
  }

  if (step.type === 'practice' && step.practice_id) {
    // Fetch practice details
    const { data: practice, error } = await supabase
      .from('practices')
      .select('*')
      .eq('id', step.practice_id)
      .single();

    if (error) {
      console.error('Error fetching practice:', error);
      return null;
    }

    return {
      type: 'practice',
      practice: practice,
      instructions: step.instructions,
    };
  }

  // For other step types (reading, reflection, console_module)
  return {
    type: step.type,
    title: step.title,
    description: step.description,
    instructions: step.instructions,
  };
}

