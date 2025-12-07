/**
 * RBI Validation Module
 * 
 * Validates resonance between sources and final chapters.
 * Ensures coherence and quality before compilation.
 * 
 * Part of Layer 2 (Computation) of the compiler architecture.
 */

import { EnhancedResonanceEngine } from '../../mathematics/enhanced-resonance-engine.js';
import { ResonanceVectorMath, type ResonanceVector } from '@/lib/mathematics/resonance-vectors.js';
import type { ContentFile, ChapterOutline, CompiledChapter } from '../types.js';

// Fallback for computeResonanceWithOrbs - uses ResonanceVectorMath
function computeResonanceWithOrbs(
  vector1: ResonanceVector,
  vector2: ResonanceVector,
  orbs: number[]
): number {
  return ResonanceVectorMath.calculateResonanceSimilarity(vector1, vector2);
}

export interface ValidationResult {
  isValid: boolean;
  coherence: number;
  fieldStrength: number;
  stability: number;
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  type: 'low_coherence' | 'resonance_gap' | 'field_instability' | 'orb_mismatch';
  severity: 'warning' | 'error';
  message: string;
  source1?: string;
  source2?: string;
}

export interface SourceResonance {
  source1: ContentFile;
  source2: ContentFile;
  resonance: number;
  coherence: number;
}

/**
 * Validate resonance between all pairs of sources
 */
export async function validateResonanceBetweenSources(
  sources: ContentFile[]
): Promise<{
  valid: boolean;
  averageResonance: number;
  minResonance: number;
  pairs: SourceResonance[];
  issues: ValidationIssue[];
}> {
  if (sources.length < 2) {
    return {
      valid: true,
      averageResonance: 1.0,
      minResonance: 1.0,
      pairs: [],
      issues: []
    };
  }

  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  const pairs: SourceResonance[] = [];
  const issues: ValidationIssue[] = [];

  // Analyze all sources to get resonance vectors
  const sourceAnalyses = await Promise.all(
    sources.map(async (source) => {
      try {
        const analysis = await resonanceEngine.analyzeContentWithMathematics(
          source.content,
          source.title,
          {
            orb_associations: source.orb_tags.length > 0 ? source.orb_tags : undefined
          }
        );
        return {
          source,
          analysis,
          resonanceVector: analysis.mathematical.resonanceVector
        };
      } catch (error) {
        console.warn(`Warning: Failed to analyze ${source.title} for validation:`, error);
        return null;
      }
    })
  );

  const validAnalyses = sourceAnalyses.filter((a): a is NonNullable<typeof a> => a !== null);

  // Calculate resonance between all pairs
  for (let i = 0; i < validAnalyses.length; i++) {
    for (let j = i + 1; j < validAnalyses.length; j++) {
      const analysis1 = validAnalyses[i];
      const analysis2 = validAnalyses[j];

      // Get combined orb associations
      const allOrbs = [...new Set([...analysis1.source.orb_tags, ...analysis2.source.orb_tags])];

      // Calculate resonance with Orb system
      const resonance = allOrbs.length > 0
        ? computeResonanceWithOrbs(
            analysis1.resonanceVector,
            analysis2.resonanceVector,
            allOrbs
          )
        : ResonanceVectorMath.calculateResonanceSimilarity(
            analysis1.resonanceVector,
            analysis2.resonanceVector
          );

      // Calculate average coherence
      const coherence = (analysis1.analysis.mathematical.fieldDynamics.coherence +
                        analysis2.analysis.mathematical.fieldDynamics.coherence) / 2;

      pairs.push({
        source1: analysis1.source,
        source2: analysis2.source,
        resonance,
        coherence
      });

      // Check for issues
      if (resonance < 0.5) {
        issues.push({
          type: 'resonance_gap',
          severity: 'warning',
          message: `Low resonance (${resonance.toFixed(2)}) between "${analysis1.source.title}" and "${analysis2.source.title}"`,
          source1: analysis1.source.title,
          source2: analysis2.source.title
        });
      }

      if (coherence < 0.6) {
        issues.push({
          type: 'low_coherence',
          severity: 'warning',
          message: `Low coherence (${coherence.toFixed(2)}) between "${analysis1.source.title}" and "${analysis2.source.title}"`,
          source1: analysis1.source.title,
          source2: analysis2.source.title
        });
      }
    }
  }

  const resonances = pairs.map(p => p.resonance);
  const averageResonance = resonances.length > 0
    ? resonances.reduce((a, b) => a + b, 0) / resonances.length
    : 0;
  const minResonance = resonances.length > 0 ? Math.min(...resonances) : 0;

  return {
    valid: minResonance >= 0.4 && averageResonance >= 0.5,
    averageResonance,
    minResonance,
    pairs,
    issues
  };
}

/**
 * Validate final compiled chapter coherence
 */
export async function validateChapterCoherence(
  compiledChapter: CompiledChapter,
  minCoherence: number = 0.7
): Promise<ValidationResult> {
  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  const issues: ValidationIssue[] = [];

  try {
    // Analyze compiled chapter
    const analysis = await resonanceEngine.analyzeContentWithMathematics(
      compiledChapter.content,
      compiledChapter.chapter.title,
      {
        orb_associations: compiledChapter.metadata.orb_associations.length > 0
          ? compiledChapter.metadata.orb_associations.map((o: string) => {
              const match = o.match(/Orb\s*(\d+)/i);
              return match ? parseInt(match[1]) : null;
            }).filter((n): n is number => n !== null)
          : undefined
      }
    );

    const coherence = analysis.mathematical.sovereignLogic.coherence;
    const fieldDynamics = analysis.mathematical.fieldDynamics;
    const fieldStrength = fieldDynamics.fieldStrength;
    const stability = fieldDynamics.stability;

    // Check coherence threshold
    if (coherence < minCoherence) {
      issues.push({
        type: 'low_coherence',
        severity: 'error',
        message: `Chapter coherence (${coherence.toFixed(2)}) below threshold (${minCoherence})`
      });
    }

    // Check field stability
    if (stability < 0.6) {
      issues.push({
        type: 'field_instability',
        severity: 'warning',
        message: `Field stability (${stability.toFixed(2)}) is low - chapter may need restructuring`
      });
    }

    // Check proof status
    if (analysis.mathematical.sovereignLogic.validity !== 'proven') {
      issues.push({
        type: 'low_coherence',
        severity: 'warning',
        message: `Proof status: ${analysis.mathematical.sovereignLogic.validity} (not proven)`
      });
    }

    return {
      isValid: coherence >= minCoherence && issues.filter(i => i.severity === 'error').length === 0,
      coherence,
      fieldStrength,
      stability,
      issues
    };
  } catch (error) {
    issues.push({
      type: 'low_coherence',
      severity: 'error',
      message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });

    return {
      isValid: false,
      coherence: 0,
      fieldStrength: 0,
      stability: 0,
      issues
    };
  }
}

/**
 * Filter sources based on validation results
 * Removes sources that don't resonate well with others
 */
export async function filterSourcesByValidation(
  sources: ContentFile[],
  minResonance: number = 0.4
): Promise<ContentFile[]> {
  if (sources.length <= 1) {
    return sources;
  }

  const validation = await validateResonanceBetweenSources(sources);

  // If validation passes, return all sources
  if (validation.valid) {
    return sources;
  }

  // Otherwise, filter out sources with low resonance
  const sourceScores = new Map<string, number>();

  // Calculate average resonance for each source
  for (const pair of validation.pairs) {
    const score1 = sourceScores.get(pair.source1.file_path) || 0;
    const score2 = sourceScores.get(pair.source2.file_path) || 0;
    sourceScores.set(pair.source1.file_path, score1 + pair.resonance);
    sourceScores.set(pair.source2.file_path, score2 + pair.resonance);
  }

  // Calculate averages
  const sourceAverages = Array.from(sourceScores.entries()).map(([path, total]) => {
    const pairCount = validation.pairs.filter(
      p => p.source1.file_path === path || p.source2.file_path === path
    ).length;
    return {
      path,
      average: pairCount > 0 ? total / pairCount : 0
    };
  });

  // Filter sources with average resonance above threshold
  const filtered = sources.filter(source => {
    const avg = sourceAverages.find(a => a.path === source.file_path);
    return avg ? avg.average >= minResonance : true; // Keep if no data
  });

  return filtered;
}

