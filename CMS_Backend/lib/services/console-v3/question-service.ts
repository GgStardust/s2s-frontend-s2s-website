/**
 * Console V3 Question Service
 * Handles question selection, filtering, and dynamic question management
 * Phase 2.5: Question Management System
 */

import type { DiagnosticQuestion, DiagnosticSession } from '@/lib/types/console-v3';

/**
 * Select questions based on question set, triggers, and context
 */
export async function selectQuestions(
  supabase: any,
  options: {
    question_set?: string | string[]; // 'beta', 'early_reader', 'inquiry', etc.
    source?: string | string[];
    is_active?: boolean;
    limit?: number;
    exclude_question_ids?: number[];
    field_state?: {
      orb_profile?: Record<string, number>;
      practice_readiness?: Record<string, number>;
      sfi_state?: string;
    };
  } = {}
): Promise<DiagnosticQuestion[]> {
  const {
    question_set,
    source,
    is_active = true,
    limit,
    exclude_question_ids = [],
    field_state,
  } = options;

  // Build base query
  let query = supabase
    .from('diagnostic_questions')
    .select('*')
    .eq('is_active', is_active);

  // Filter by question_set
  if (question_set) {
    if (Array.isArray(question_set)) {
      query = query.in('question_set', question_set);
    } else {
      query = query.eq('question_set', question_set);
    }
  }

  // Filter by source
  if (source) {
    if (Array.isArray(source)) {
      query = query.in('source', source);
    } else {
      query = query.eq('source', source);
    }
  }

  // Exclude specific question IDs
  if (exclude_question_ids.length > 0) {
    query = query.not('id', 'in', `(${exclude_question_ids.join(',')})`);
  }

  // Execute query
  const { data: questions, error } = await query.order('selection_priority', { ascending: false })
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error selecting questions:', error);
    return [];
  }

  // Filter by triggers if field_state is provided
  let filteredQuestions = questions || [];
  if (field_state && questions) {
    filteredQuestions = questions.filter((q: DiagnosticQuestion) => {
      if (!q.triggers || Object.keys(q.triggers).length === 0) {
        return true; // No triggers = always eligible
      }

      return checkTriggers(q.triggers, field_state);
    });
  }

  // Apply limit if specified
  if (limit && limit > 0) {
    filteredQuestions = filteredQuestions.slice(0, limit);
  }

  return filteredQuestions;
}

/**
 * Check if a question's triggers match the current field state
 */
function checkTriggers(
  triggers: Record<string, any>,
  field_state: {
    orb_profile?: Record<string, number>;
    practice_readiness?: Record<string, number>;
    sfi_state?: string;
  }
): boolean {
  // Check orb_profile triggers
  if (triggers.orb_profile && field_state.orb_profile) {
    for (const [orbKey, threshold] of Object.entries(triggers.orb_profile)) {
      const currentValue = field_state.orb_profile[orbKey] || 0;
      if (typeof threshold === 'number') {
        if (currentValue < threshold) {
          return false; // Trigger not met
        }
      } else if (typeof threshold === 'object' && threshold.min !== undefined) {
        if (currentValue < threshold.min || (threshold.max !== undefined && currentValue > threshold.max)) {
          return false;
        }
      }
    }
  }

  // Check practice_readiness triggers
  if (triggers.practice_readiness && field_state.practice_readiness) {
    for (const [practiceKey, threshold] of Object.entries(triggers.practice_readiness)) {
      const currentValue = field_state.practice_readiness[practiceKey] || 0;
      if (typeof threshold === 'number') {
        if (currentValue < threshold) {
          return false;
        }
      }
    }
  }

  // Check sfi_state trigger
  if (triggers.sfi_state && field_state.sfi_state) {
    if (triggers.sfi_state !== field_state.sfi_state) {
      return false;
    }
  }

  // All triggers passed
  return true;
}

/**
 * Get follow-up questions for a given question based on answer
 */
export async function getFollowUpQuestions(
  supabase: any,
  questionId: number,
  answer?: string | number
): Promise<DiagnosticQuestion[]> {
  // Get the question to find follow-up question IDs
  const { data: question, error } = await supabase
    .from('diagnostic_questions')
    .select('follow_up_question_ids')
    .eq('id', questionId)
    .single();

  if (error || !question || !question.follow_up_question_ids || question.follow_up_question_ids.length === 0) {
    return [];
  }

  // Fetch follow-up questions
  const { data: followUpQuestions, error: followUpError } = await supabase
    .from('diagnostic_questions')
    .select('*')
    .in('id', question.follow_up_question_ids)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (followUpError) {
    console.error('Error fetching follow-up questions:', followUpError);
    return [];
  }

  return followUpQuestions || [];
}

/**
 * Select questions for a new inquiry session
 * Uses question_set and selection_priority to determine which questions to include
 */
export async function selectQuestionsForSession(
  supabase: any,
  options: {
    question_set?: string | string[]; // Default: ['beta']
    include_early_reader?: boolean; // Include early_reader questions
    max_questions?: number; // Limit total questions
  } = {}
): Promise<DiagnosticQuestion[]> {
  const {
    question_set = ['beta'],
    include_early_reader = false,
    max_questions = 12, // Default to 12 questions
  } = options;

  // Build question sets to include
  const setsToInclude: string[] = Array.isArray(question_set) ? question_set : [question_set];
  if (include_early_reader) {
    setsToInclude.push('early_reader');
  }

  // Select questions
  const questions = await selectQuestions(supabase, {
    question_set: setsToInclude,
    is_active: true,
    limit: max_questions,
  });

  return questions;
}

/**
 * Get contextual questions based on current field state
 * Used for dynamic question injection during inquiry
 */
export async function getContextualQuestions(
  supabase: any,
  session: DiagnosticSession,
  answered_question_ids: number[]
): Promise<DiagnosticQuestion[]> {
  // Build field state from session
  const field_state = {
    orb_profile: session.orb_profile || {},
    practice_readiness: session.practice_readiness_profile || {},
    sfi_state: session.sfi_state,
  };

  // Select contextual questions that match triggers
  const contextualQuestions = await selectQuestions(supabase, {
    question_set: 'contextual',
    is_active: true,
    field_state,
    exclude_question_ids: answered_question_ids,
    limit: 3, // Limit contextual questions to avoid overwhelming
  });

  return contextualQuestions;
}

