/**
 * Enhanced Resonance Engine - Wrapper for RBI-Kernel
 * 
 * This file is a wrapper that delegates to the consolidated RBI-Kernel.
 * It preserves the existing interface while using RBI-Kernel as the implementation.
 * 
 * MIGRATION NOTE: This wrapper maintains backward compatibility.
 * Future code should import directly from 'rbi-kernel'.
 */

// Import from RBI-Kernel
// Note: Importing directly from the computation module
import { EnhancedResonanceEngine as RBIEnhancedEngine, type EnhancedResonanceAnalysis } from 'rbi-kernel/field/computation/enhanced-engine';
import type { ResonanceVector, FieldDynamics } from 'rbi-kernel/mathematics/resonance-vectors';
import type { ContentMetadata } from 'orbital-brain/types';

// Re-export types for backward compatibility
export type { ResonanceVector, FieldDynamics, EnhancedResonanceAnalysis };

/**
 * Enhanced Resonance Engine - Wrapper class
 * 
 * Delegates to RBI-Kernel's EnhancedResonanceEngine while preserving
 * the local singleton pattern and interface.
 */
export class EnhancedResonanceEngine {
  private static instance: EnhancedResonanceEngine;
  private rbiEngine: RBIEnhancedEngine;

  private constructor() {
    this.rbiEngine = RBIEnhancedEngine.getInstance();
  }

  public static getInstance(): EnhancedResonanceEngine {
    if (!EnhancedResonanceEngine.instance) {
      EnhancedResonanceEngine.instance = new EnhancedResonanceEngine();
    }
    return EnhancedResonanceEngine.instance;
  }

  /**
   * Enhanced content analysis with mathematical layer
   * Delegates to RBI-Kernel's EnhancedResonanceEngine
   * 
   * METADATA-FIRST: Metadata must be extracted BEFORE calling RBI
   * Metadata anchors the computation - RBI is subordinate to Codex metadata
   */
  public async analyzeContentWithMathematics(
    content: string,
    title?: string,
    metadata?: ContentMetadata
  ): Promise<EnhancedResonanceAnalysis> {
    return await this.rbiEngine.analyzeContentWithMathematics(content, title, metadata);
  }

  /**
   * Calculate resonance similarity between two content pieces
   * Delegates to RBI-Kernel's EnhancedResonanceEngine
   */
  public calculateResonanceSimilarity(
    content1: string,
    content2: string,
    metadata1?: ContentMetadata,
    metadata2?: ContentMetadata
  ): Promise<number> {
    return this.rbiEngine.calculateResonanceSimilarity(content1, content2, metadata1, metadata2);
  }

  /**
   * Verify consciousness through mathematical protocols
   * Delegates to RBI-Kernel's EnhancedResonanceEngine
   */
  public async verifyConsciousness(
    content: string,
    orbAssociations: number[],
    metadata?: ContentMetadata
  ): Promise<{
    verified: boolean;
    confidence: number;
    mathematicalProof: string;
    resonanceVector: ResonanceVector;
    fieldDynamics: FieldDynamics;
  }> {
    return await this.rbiEngine.verifyConsciousness(content, orbAssociations, metadata);
  }
}
