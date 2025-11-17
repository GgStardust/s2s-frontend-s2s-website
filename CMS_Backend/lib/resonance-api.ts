/**
 * Resonance API - Helper functions for RBI-Kernel integration
 * 
 * Provides simplified interface for calling resonance validation
 * from API routes and other services.
 * 
 * MIGRATED: Now uses RBI-Kernel instead of local resonance-engine.ts
 */

import { FieldComputation } from 'rbi-kernel';
import { EnhancedResonanceEngine } from './mathematics/enhanced-resonance-engine';
import type { ResonanceResult } from './rbi/types';

/**
 * Main function to run resonance validation on markdown content
 * Now uses RBI-Kernel's EnhancedResonanceEngine
 */
export async function runResonanceValidation(markdown: string, title?: string, metadata?: any): Promise<ResonanceResult> {
  try {
    const engine = EnhancedResonanceEngine.getInstance();
    
    // METADATA-FIRST: Use provided metadata or extract from markdown if available
    // Support both categoryAssociations (generic) and orb_associations (S2S) for backward compatibility
    const contentMetadata = metadata ? {
      categoryAssociations: metadata.categoryAssociations ?? metadata.orb_associations,
      orb_associations: metadata.orb_associations, // Keep for S2S backward compatibility
      field_function: metadata.field_function,
      book_threading: metadata.book_threading,
      integration_points: metadata.integration_points,
      tags: metadata.tags
    } : undefined;
    
    const analysis = await engine.analyzeContentWithMathematics(markdown, title, contentMetadata);
    
    // Map RBI-Kernel analysis to ResonanceResult format for backward compatibility
    const coherenceScore = analysis.mathematical?.fieldDynamics?.coherence || 0;
    const validatedOrbs = analysis.orb_associations || [];
    
    // Extract metrics from RBI analysis
    const metrics = {
      strength: Math.min(10, Math.max(1, Math.round((analysis.mathematical?.fieldDynamics?.fieldStrength || 0) * 10))),
      clarity: Math.min(10, Math.max(1, Math.round((analysis.mathematical?.fieldDynamics?.coherence || 0) * 10))),
      coherence: Math.min(10, Math.max(1, Math.round((analysis.mathematical?.fieldDynamics?.coherence || 0) * 10))),
      pattern: Math.min(10, Math.max(1, Math.round((analysis.mathematical?.harmonicFrequency?.fundamental || 0) * 10)))
    };
    
    // Determine proof status from RBI analysis
    const proofStatus = analysis.mathematical?.sovereignLogic?.validity === 'proven' 
      ? 'proven' 
      : analysis.mathematical?.sovereignLogic?.validity === 'partial'
      ? 'partial'
      : analysis.mathematical?.sovereignLogic?.validity === 'unproven'
      ? 'unproven'
      : 'error';
    
    const explanation = analysis.mathematical?.sovereignLogic?.statement ||
      `RBI analysis: ${validatedOrbs.length} Orbs detected, coherence ${(coherenceScore * 100).toFixed(1)}%`;
    
    return {
      proofStatus,
      coherenceScore,
      validatedOrbs,
      metrics,
      explanation
    };
  } catch (error) {
    console.error('Resonance validation failed:', error);
    return {
      proofStatus: 'error',
      coherenceScore: 0,
      validatedOrbs: [],
      metrics: { strength: 0, clarity: 0, coherence: 0, pattern: 0 },
      explanation: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Batch validation for multiple content pieces
 */
export async function runBatchResonanceValidation(
  contentItems: Array<{ content: string; title?: string }>
): Promise<ResonanceResult[]> {
  const results = await Promise.all(
    contentItems.map(item => runResonanceValidation(item.content, item.title))
  );
  return results;
}

/**
 * Validate content and return simplified result for UI display
 */
export async function validateForUI(markdown: string, title?: string): Promise<{
  proofStatus: string;
  coherenceScore: number;
  validatedOrbs: number[];
  metrics: { strength: number; clarity: number; coherence: number; pattern: number };
}> {
  const result = await runResonanceValidation(markdown, title);
  return {
    proofStatus: result.proofStatus,
    coherenceScore: result.coherenceScore,
    validatedOrbs: result.validatedOrbs,
    metrics: result.metrics
  };
}