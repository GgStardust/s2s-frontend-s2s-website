/**
 * Coherence Guard
 * 
 * Kernel-first enforcement for AI routes.
 * Validates content coherence before processing.
 * 
 * Step 5 of Backend Stabilization Plan
 */

import { runResonanceValidation } from '@/lib/resonance-api';
import type { ResonanceResult } from '@/lib/rbi/types';

const COHERENCE_THRESHOLD = parseFloat(
  process.env.RESONANCE_COHERENCE_THRESHOLD || '0.5'
);

export interface CoherenceCheckResult {
  allowed: boolean;
  coherenceScore: number;
  threshold: number;
  result?: ResonanceResult;
  reason?: string;
  suggestion?: string;
}

/**
 * Check content coherence before AI processing
 */
export async function checkCoherence(
  content: string,
  title?: string
): Promise<CoherenceCheckResult> {
  try {
    const result = await runResonanceValidation(content, title);
    const coherenceScore = result.coherenceScore;

    if (coherenceScore < COHERENCE_THRESHOLD) {
      return {
        allowed: false,
        coherenceScore,
        threshold: COHERENCE_THRESHOLD,
        result,
        reason: 'Low coherence',
        suggestion: coherenceScore < 0.3
          ? 'Content may need significant revision'
          : 'Minor adjustments may improve coherence',
      };
    }

    return {
      allowed: true,
      coherenceScore,
      threshold: COHERENCE_THRESHOLD,
      result,
    };
  } catch (error) {
    console.error('Coherence check error:', error);
    // On error, allow processing but log warning
    return {
      allowed: true,
      coherenceScore: 0,
      threshold: COHERENCE_THRESHOLD,
      reason: 'Coherence check failed, allowing processing',
    };
  }
}

/**
 * Get suggestion message based on coherence score
 */
function getCoherenceSuggestion(score: number): string {
  if (score < 0.3) {
    return 'Content may need significant revision to improve coherence';
  } else if (score < 0.5) {
    return 'Minor adjustments may improve coherence';
  } else if (score < 0.7) {
    return 'Content is coherent but could be enhanced';
  } else {
    return 'Content demonstrates strong coherence';
  }
}

