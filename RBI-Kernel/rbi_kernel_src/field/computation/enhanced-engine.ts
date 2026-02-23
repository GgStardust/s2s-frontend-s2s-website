/**
 * Computation Layer - Enhanced Resonance Engine
 * 
 * Integrates mathematical framework with resonance engine.
 * Provides enhanced content analysis with 4D vectors and validation.
 * 
 * Architecture Layer: 2 (Computation)
 */

import { ResonanceEngine, EnergeticSignature, ResonanceAnalysis } from './resonance-engine.js';
import { ResonanceVectorMath, ResonanceVector, HarmonicFrequency, CoherenceMatrix, FieldDynamics } from '../../mathematics/resonance-vectors.js';
import { SovereignLogic, ConsciousnessContext, CoherenceProof } from '../../mathematics/sovereign-logic.js';
import { proofLogger, ProofStep } from '../validation/proof-logger.js';

/**
 * Generic content metadata interface
 * Domain-agnostic metadata for RBI analysis
 */
export interface ContentMetadata {
  /**
   * Category associations (generic term, replaces orb_associations)
   * Array of numeric identifiers representing content categories/domains
   */
  associations?: number[];
  
  /**
   * @deprecated Use 'associations' instead. Kept for backward compatibility.
   */
  orb_associations?: number[];
  
  /**
   * Content function and purpose (generic term, replaces field_function)
   */
  contentFunction?: {
    purpose?: string;
    mechanism?: string;
    context?: string;
    relation?: string;
  };
  
  /**
   * @deprecated Use 'contentFunction' instead. Kept for backward compatibility.
   */
  field_function?: {
    content_purpose?: string;
    primary_mechanism?: string;
    console_context?: string;
    console_relation?: string;
  };
  
  /**
   * Content threading and relationships (generic term, replaces book_threading)
   * Note: This is separate from structural relationships in metadata parsers
   */
  contentThreading?: {
    sourceId?: string;
    targetSection?: string;
    targetChapter?: string;
    relevanceScore?: number;
  };
  
  /**
   * @deprecated Use 'contentThreading' instead. Kept for backward compatibility.
   */
  book_threading?: {
    book_id?: string;
    target_section?: string;
    target_chapter?: string;
    relevance_score?: number;
  };
  
  /**
   * Integration and connection points (generic term, replaces integration_points)
   */
  integrationPoints?: {
    systems?: string[];
    views?: string[];
    processes?: string[];
  };
  
  /**
   * @deprecated Use 'integrationPoints' instead. Kept for backward compatibility.
   */
  integration_points?: {
    codex?: string[];
    console_views?: string[];
    editorial_pass?: string;
  };
  
  tags?: string[];
  category?: string;
  dashboard_component?: string;
}

export interface EnhancedResonanceAnalysis extends ResonanceAnalysis {
  mathematical: {
    resonanceVector: ResonanceVector;
    harmonicFrequency: HarmonicFrequency;
    coherenceMatrix: CoherenceMatrix;
    fieldDynamics: FieldDynamics;
    sovereignLogic: CoherenceProof;
  };
}

export class EnhancedResonanceEngine {
  private static instance: EnhancedResonanceEngine;
  private baseEngine: ResonanceEngine;

  private constructor() {
    this.baseEngine = ResonanceEngine.getInstance();
  }

  public static getInstance(): EnhancedResonanceEngine {
    if (!EnhancedResonanceEngine.instance) {
      EnhancedResonanceEngine.instance = new EnhancedResonanceEngine();
    }
    return EnhancedResonanceEngine.instance;
  }

  /**
   * Enhanced content analysis with mathematical layer
   * 
   * Metadata-first: Uses metadata.associations (or orb_associations for backward compat) to weight computation
   * Metadata anchors the computation - RBI is subordinate to domain metadata
   */
  public async analyzeContentWithMathematics(
    content: string, 
    title?: string,
    metadata?: ContentMetadata
  ): Promise<EnhancedResonanceAnalysis> {
    try {
      const baseAnalysis = await this.baseEngine.analyzeContent(content, title);
      
      // METADATA-FIRST: Use metadata.associations (or orb_associations for backward compat) if provided, otherwise fall back to base analysis
      // This ensures metadata anchors the computation, not RBI extraction
      const associations = metadata?.associations && metadata.associations.length > 0
        ? metadata.associations
        : (metadata?.orb_associations && metadata.orb_associations.length > 0
          ? metadata.orb_associations
          : baseAnalysis.orb_associations);
      
      const resonanceVector = ResonanceVectorMath.signatureToVector(baseAnalysis.signature);
      const harmonicFrequency = ResonanceVectorMath.analyzeHarmonicFrequency(content);
      
      // Use metadata-anchored associations for coherence matrix
      const coherenceMatrix = ResonanceVectorMath.buildCoherenceMatrix(associations);
      const fieldDynamics = ResonanceVectorMath.calculateFieldDynamics(
        resonanceVector, 
        associations
      );
      
      const consciousnessContext: ConsciousnessContext = {
        orbAssociations: associations, // Use metadata-anchored associations (backward compat: orbAssociations field name)
        fieldState: fieldDynamics.gradient,
        temporalContext: new Date().toISOString(),
        spatialContext: 'field'
      };
      
      const sovereignLogic = SovereignLogic.validateConsciousnessCoherence(content, consciousnessContext);
      
      const mathematicalScore = this.calculateMathematicalScore(
        resonanceVector,
        harmonicFrequency,
        coherenceMatrix,
        fieldDynamics,
        sovereignLogic
      );
      
      // Handle null/NaN overall_score from geometric refactored engine
      const baseScore = baseAnalysis.overall_score ?? (
        baseAnalysis.signature.clarity * 0.25 +
        baseAnalysis.signature.coherence * 0.25 +
        baseAnalysis.signature.resonance * 0.25 +
        baseAnalysis.signature.sovereignty * 0.25
      );
      
      const enhancedOverallScore = (baseScore + mathematicalScore) / 2;
      
      return {
        ...baseAnalysis,
        orb_associations: associations, // Return metadata-anchored associations (backward compat field name)
        overall_score: enhancedOverallScore,
        mathematical: {
          resonanceVector,
          harmonicFrequency,
          coherenceMatrix,
          fieldDynamics,
          sovereignLogic
        }
      };
    } catch (error) {
      console.error('Enhanced Resonance Engine analysis error:', error);
      throw new Error('Failed to analyze content with Enhanced Resonance Engine');
    }
  }

  /**
   * Calculate resonance similarity between two content pieces
   */
  public calculateResonanceSimilarity(
    content1: string,
    content2: string,
    metadata1?: ContentMetadata,
    metadata2?: ContentMetadata
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const analysis1 = await this.analyzeContentWithMathematics(content1, undefined, metadata1);
        const analysis2 = await this.analyzeContentWithMathematics(content2, undefined, metadata2);
        
        const similarity = ResonanceVectorMath.calculateResonanceSimilarity(
          analysis1.mathematical.resonanceVector,
          analysis2.mathematical.resonanceVector
        );
        
        resolve(similarity);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Verify coherence through mathematical protocols
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
    try {
      // Use metadata.associations (or orb_associations for backward compat) if provided, otherwise use parameter
      const finalAssociations = metadata?.associations && metadata.associations.length > 0
        ? metadata.associations
        : (metadata?.orb_associations && metadata.orb_associations.length > 0
          ? metadata.orb_associations
          : orbAssociations);
      
      const verification = SovereignLogic.verifyConsciousness(content, finalAssociations);
      const analysis = await this.analyzeContentWithMathematics(content, undefined, metadata);
      const resonanceVector = analysis.mathematical.resonanceVector;
      const fieldDynamics = analysis.mathematical.fieldDynamics;
      
      return {
        verified: verification.verified,
        confidence: verification.confidence,
        mathematicalProof: verification.mathematicalProof,
        resonanceVector,
        fieldDynamics
      };
    } catch (error) {
      console.error('Coherence verification error:', error);
      throw new Error('Failed to verify coherence');
    }
  }

  private calculateMathematicalScore(
    resonanceVector: ResonanceVector,
    harmonicFrequency: HarmonicFrequency,
    coherenceMatrix: CoherenceMatrix,
    fieldDynamics: FieldDynamics,
    sovereignLogic: CoherenceProof
  ): number {
    const vectorScore = this.calculateVectorScore(resonanceVector);
    const harmonicScore = this.calculateHarmonicScore(harmonicFrequency);
    const coherenceScore = this.calculateCoherenceScore(coherenceMatrix);
    const fieldScore = this.calculateFieldScore(fieldDynamics);
    const logicScore = this.calculateLogicScore(sovereignLogic);
    
    return (
      vectorScore * 0.25 +
      harmonicScore * 0.20 +
      coherenceScore * 0.25 +
      fieldScore * 0.15 +
      logicScore * 0.15
    );
  }

  private calculateVectorScore(resonanceVector: ResonanceVector): number {
    const magnitude = Math.sqrt(
      resonanceVector.x * resonanceVector.x +
      resonanceVector.y * resonanceVector.y +
      resonanceVector.z * resonanceVector.z +
      resonanceVector.w * resonanceVector.w
    );
    
    const balance = 1 - this.calculateVariance([
      resonanceVector.x,
      resonanceVector.y,
      resonanceVector.z,
      resonanceVector.w
    ]);
    
    return (magnitude + balance) / 2;
  }

  private calculateHarmonicScore(harmonicFrequency: HarmonicFrequency): number {
    const fundamentalScore = Math.min(1, harmonicFrequency.fundamental / 10);
    const dissonanceScore = 1 - harmonicFrequency.dissonance;
    const spectralScore = Math.min(1, harmonicFrequency.spectralDensity);
    
    return (fundamentalScore + dissonanceScore + spectralScore) / 3;
  }

  private calculateCoherenceScore(coherenceMatrix: CoherenceMatrix): number {
    const rankScore = coherenceMatrix.coherenceRank / coherenceMatrix.nxn.length;
    const eigenvalueScore = coherenceMatrix.eigenvalues.reduce((sum, val) => sum + Math.abs(val), 0) / coherenceMatrix.eigenvalues.length;
    
    return (rankScore + eigenvalueScore) / 2;
  }

  private calculateFieldScore(fieldDynamics: FieldDynamics): number {
    const strengthScore = Math.min(1, fieldDynamics.fieldStrength / 4);
    const stabilityScore = fieldDynamics.stability;
    const coherenceScore = fieldDynamics.coherence;
    
    return (strengthScore + stabilityScore + coherenceScore) / 3;
  }

  private calculateLogicScore(sovereignLogic: CoherenceProof): number {
    const validityScore = {
      'proven': 1.0,
      'partial': 0.7,
      'unproven': 0.3,
      'error': 0.0
    }[sovereignLogic.validity] || 0.0;
    
    const coherenceScore = sovereignLogic.coherence;
    const sovereigntyScore = sovereignLogic.sovereignty;
    
    return (validityScore + coherenceScore + sovereigntyScore) / 3;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }
}

