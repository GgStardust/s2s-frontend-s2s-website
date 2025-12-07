/**
 * Validation Layer - Proof of Meaning
 * 
 * Performs Proof-of-Meaning operations using type-theoretic validation.
 * Implements coherence verification and structural integrity checks.
 * 
 * Architecture Layer: 4 (Validation)
 */

import { SovereignLogic, ConsciousnessContext, CoherenceProof } from '../../mathematics/sovereign-logic.js';

// Re-export types for external use
export type { ConsciousnessContext, CoherenceProof };

/**
 * Decision Trail - tracks which rules and associations were active during validation
 */
export interface DecisionTrail {
  activeAssociations: number[];
  validationRules: Array<{
    rule: string;
    applied: boolean;
    weight: number;
    result: 'passed' | 'failed' | 'partial';
  }>;
  reasoningPath: Array<{
    step: string;
    input: any;
    output: any;
    rule: string;
  }>;
  metadata: {
    contentType: 'text' | 'json' | 'code' | 'mixed';
    hasSchema: boolean;
    associationsProvided: boolean;
  };
}

/**
 * Verify coherence using Proof-of-Meaning
 * Enhanced with decision trail tracking
 */
export function verifyConsciousness(
  content: string,
  orbAssociations: number[]
): {
  verified: boolean;
  confidence: number;
  mathematicalProof: string;
  decisionTrail?: DecisionTrail;
} {
  const result = SovereignLogic.verifyConsciousness(content, orbAssociations);
  
  // Build decision trail
  const decisionTrail: DecisionTrail = {
    activeAssociations: orbAssociations,
    validationRules: buildValidationRules(orbAssociations, result),
    reasoningPath: buildReasoningPath(content, orbAssociations, result),
    metadata: {
      contentType: detectContentType(content),
      hasSchema: false, // Will be set by caller if JSON schema is available
      associationsProvided: orbAssociations.length > 0
    }
  };
  
  return {
    ...result,
    decisionTrail
  };
}

/**
 * Build validation rules that were active
 */
function buildValidationRules(
  orbAssociations: number[],
  result: { verified: boolean; confidence: number }
): DecisionTrail['validationRules'] {
  const rules: DecisionTrail['validationRules'] = [];
  
  // Coherence validation rule
  rules.push({
    rule: 'coherence_validation',
    applied: true,
    weight: 0.4,
    result: result.verified ? 'passed' : 'failed'
  });
  
  // Association-based validation (if associations provided)
  if (orbAssociations.length > 0) {
    rules.push({
      rule: 'association_validation',
      applied: true,
      weight: 0.3,
      result: result.confidence > 0.7 ? 'passed' : 'partial'
    });
  }
  
  // Confidence threshold rule
  rules.push({
    rule: 'confidence_threshold',
    applied: true,
    weight: 0.3,
    result: result.confidence > 0.5 ? 'passed' : 'partial'
  });
  
  return rules;
}

/**
 * Build reasoning path
 */
function buildReasoningPath(
  content: string,
  orbAssociations: number[],
  result: { verified: boolean; confidence: number }
): DecisionTrail['reasoningPath'] {
  const path: DecisionTrail['reasoningPath'] = [];
  
  path.push({
    step: 'content_analysis',
    input: { contentLength: content.length, associations: orbAssociations },
    output: { hasContent: content.length > 0, hasAssociations: orbAssociations.length > 0 },
    rule: 'content_presence'
  });
  
  path.push({
    step: 'coherence_calculation',
    input: { content, associations: orbAssociations },
    output: { verified: result.verified, confidence: result.confidence },
    rule: 'proof_of_meaning'
  });
  
  return path;
}

/**
 * Detect content type
 */
function detectContentType(content: string): 'text' | 'json' | 'code' | 'mixed' {
  try {
    JSON.parse(content);
    return 'json';
  } catch {
    // Check for code patterns
    if (content.includes('function') || content.includes('const') || content.includes('class')) {
      return 'code';
    }
    return 'text';
  }
}

/**
 * Validate coherence with full context
 */
export function validateCoherence(
  content: string,
  context: ConsciousnessContext
): CoherenceProof {
  return SovereignLogic.validateConsciousnessCoherence(content, context);
}

