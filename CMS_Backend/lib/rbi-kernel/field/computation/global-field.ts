/**
 * Global Field Computation
 * 
 * Architecture Layer: 2 (Computation)
 * 
 * Processes multiple diverse inputs (JSON, code, text) simultaneously
 * in a global, non-linear field computation. All inputs are considered
 * together to compute global coherence, not processed linearly.
 */

import { EnhancedResonanceEngine } from './enhanced-engine.js';
import * as Mathematics from '../../mathematics/index.js';
import type { ResonanceVector, FieldDynamics } from '../../mathematics/resonance-vectors.js';
import { detectAndParseJSON } from '../../metadata/content-detector.js';
import type { EnhancedResonanceAnalysis } from './enhanced-engine.js';

export interface MultiInputItem {
  content: any;
  title?: string;
  metadata?: Record<string, any>;
}

export interface GlobalFieldAnalysis {
  // Individual analyses for each input
  individual: Array<{
    index: number;
    title?: string;
    analysis: EnhancedResonanceAnalysis;
    resonanceVector: ResonanceVector;
    fieldDynamics: FieldDynamics;
  }>;
  
  // Global field metrics (computed from all inputs together)
  global: {
    // Average resonance vector across all inputs
    averageVector: ResonanceVector;
    
    // Global field dynamics (computed from all vectors together)
    fieldDynamics: FieldDynamics;
    
    // Coherence matrix across all inputs
    coherenceMatrix: {
      pairwise: Array<{
        index1: number;
        index2: number;
        similarity: number;
        coherence: number;
      }>;
      average: number; // Average pairwise coherence
      global: number; // Global coherence score
    };
    
    // Field strength and stability across all inputs
    fieldStrength: number;
    stability: number;
    
    // Category associations aggregated from all inputs (generic term, replaces orbAssociations)
    associations: number[];
    
    /**
     * @deprecated Use 'associations' instead. Kept for backward compatibility.
     */
    orbAssociations: number[];
  };
}

/**
 * Analyze multiple inputs globally (non-linear field computation)
 * 
 * All inputs are processed together to compute global coherence,
 * not processed linearly one-by-one.
 */
export async function analyzeGlobalField(
  inputs: MultiInputItem[]
): Promise<GlobalFieldAnalysis> {
  if (inputs.length === 0) {
    throw new Error('Inputs array cannot be empty');
  }

  const engine = EnhancedResonanceEngine.getInstance();

  // Layer 1 (Representation): Process all inputs
  // Process globally (all at once) - non-linear field computation
  const individualAnalyses = await Promise.all(
    inputs.map(async (input, index) => {
      // Detect and parse JSON if present
      const parsed = detectAndParseJSON(input.content);
      
      // Combine input metadata with parsed metadata
      const metadata = {
        ...parsed.metadata,
        ...input.metadata
      };
      
      // Analyze each input
      const analysis = await engine.analyzeContentWithMathematics(
        parsed.contentString,
        input.title,
        metadata
      );
      
      return {
        index,
        title: input.title,
        analysis,
        resonanceVector: analysis.mathematical.resonanceVector,
        fieldDynamics: analysis.mathematical.fieldDynamics
      };
    })
  );

  // Layer 2 (Computation): Compute global field from all inputs together
  const resonanceVectors = individualAnalyses.map(a => a.resonanceVector);
  const allAssociations = individualAnalyses
    .map(a => a.analysis.orb_associations || [])
    .flat();
  
  // Aggregate unique associations
  const uniqueAssociations = Array.from(new Set(allAssociations));

  // Calculate average resonance vector
  const averageVector: ResonanceVector = {
    x: resonanceVectors.reduce((sum, v) => sum + v.x, 0) / resonanceVectors.length,
    y: resonanceVectors.reduce((sum, v) => sum + v.y, 0) / resonanceVectors.length,
    z: resonanceVectors.reduce((sum, v) => sum + v.z, 0) / resonanceVectors.length,
    w: resonanceVectors.reduce((sum, v) => sum + v.w, 0) / resonanceVectors.length
  };

  // Calculate global field dynamics from average vector
  const globalFieldDynamics = Mathematics.ResonanceVectorMath.calculateFieldDynamics(
    averageVector,
    uniqueAssociations
  );

  // Calculate pairwise coherence matrix
  const pairwise: GlobalFieldAnalysis['global']['coherenceMatrix']['pairwise'] = [];
  let totalSimilarity = 0;
  let totalCoherence = 0;
  let pairCount = 0;

  for (let i = 0; i < resonanceVectors.length; i++) {
    for (let j = i + 1; j < resonanceVectors.length; j++) {
      const similarity = Mathematics.ResonanceVectorMath.calculateResonanceSimilarity(
        resonanceVectors[i],
        resonanceVectors[j]
      );
      
      // Calculate coherence between these two vectors
      const fieldDynamics1 = individualAnalyses[i].fieldDynamics;
      const fieldDynamics2 = individualAnalyses[j].fieldDynamics;
      const coherence = (fieldDynamics1.coherence + fieldDynamics2.coherence) / 2;
      
      pairwise.push({
        index1: i,
        index2: j,
        similarity,
        coherence
      });
      
      totalSimilarity += similarity;
      totalCoherence += coherence;
      pairCount++;
    }
  }

  const averageCoherence = pairCount > 0 ? totalCoherence / pairCount : 0;
  
  // Global coherence = average of all pairwise coherences, weighted by similarity
  const globalCoherence = pairCount > 0 
    ? (totalSimilarity * 0.5 + totalCoherence * 0.5) / pairCount
    : 0;

  // Calculate global stability (variance in field dynamics)
  const stabilities = individualAnalyses.map(a => a.fieldDynamics.stability);
  const avgStability = stabilities.reduce((sum, s) => sum + s, 0) / stabilities.length;
  const variance = stabilities.reduce((sum, s) => sum + Math.pow(s - avgStability, 2), 0) / stabilities.length;
  const globalStability = 1 / (1 + variance);

  return {
    individual: individualAnalyses,
    global: {
      averageVector,
      fieldDynamics: globalFieldDynamics,
      coherenceMatrix: {
        pairwise,
        average: averageCoherence,
        global: globalCoherence
      },
      fieldStrength: globalFieldDynamics.fieldStrength,
      stability: globalStability,
      associations: uniqueAssociations,
      orbAssociations: uniqueAssociations // Backward compatibility
    }
  };
}

