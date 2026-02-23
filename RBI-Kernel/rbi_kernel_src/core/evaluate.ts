import { EnhancedResonanceEngine } from '../field/computation/enhanced-engine.js';
import { verifyConsciousness as verify } from '../field/validation/proof-of-meaning.js';

import type { ContentMetadata } from '../types.js';
import type { EnhancedResonanceAnalysis } from '../types.js';

/**
 * Primary RBI Kernel entry point.
 * Deterministic evaluation of content coherence.
 */
export async function evaluate(
  content: string,
  metadata?: ContentMetadata
): Promise<EnhancedResonanceAnalysis> {
  if (!content || content.trim().length === 0) {
    throw new Error('Content cannot be empty');
  }
  
  return EnhancedResonanceEngine
    .getInstance()
    .analyzeContentWithMathematics(content, undefined, metadata);
}

/**
 * Validation-only proof check.
 */
export const verifyConsciousness = verify;

