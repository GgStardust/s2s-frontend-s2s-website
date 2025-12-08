/**
 * Console V3 Pathway Service
 * Handles pathway building, step management, and content fetching
 */

import type {
  UserPathway,
  PathwayTemplate,
  PathwayStep,
} from '@/lib/types/console-v3';

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
  const { data: introStep } = await supabase
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

  if (introStep) {
    steps.push(introStep);
  }

  // Create a step for each practice in the sequence
  // Each step depends on the previous step (sequential pathway)
  for (let i = 0; i < practiceSequence.length; i++) {
    const practiceId = practiceSequence[i];
    
    // Get practice details for title/description
    const { data: practice } = await supabase
      .from('practices')
      .select('name, layer, core_function')
      .eq('id', practiceId)
      .single();

    // Determine dependencies: first practice step depends on intro (if exists), 
    // subsequent steps depend on the previous practice step
    const previousStepId = i === 0 
      ? (introStep?.id ? [introStep.id] : []) // First practice depends on intro
      : (steps.length > 0 ? [steps[steps.length - 1].id] : []); // Subsequent steps depend on previous step

    const stepData = {
      pathway_template_id: template.id,
      step_number: i + 1,
      type: 'practice' as const,
      practice_id: practiceId,
      title: practice ? `Practice ${practiceId}: ${practice.name}` : `Practice ${practiceId}`,
      description: practice?.core_function || undefined,
      instructions: `Engage with Practice ${practiceId}: ${practice?.name || 'Practice'}. This is a ${practice?.layer || 'foundational'} practice.`,
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
  const { data: firstStep } = await supabase
    .from('pathway_steps')
    .select('*')
    .eq('pathway_template_id', template.id)
    .order('step_number', { ascending: true })
    .limit(1)
    .single();

  if (firstStep) {
    const { error: updateError } = await supabase
      .from('user_pathways')
      .update({ current_step_id: firstStep.id })
      .eq('id', pathway.id);

    if (updateError) {
      console.warn('Failed to set current step:', updateError);
    }
  } else {
    console.warn(`No pathway steps found for template ${template.id}`);
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

