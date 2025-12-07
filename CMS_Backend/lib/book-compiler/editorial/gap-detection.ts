/**
 * Gap Detection Module
 * 
 * Detects coherence gaps between adjacent sections.
 * Identifies abrupt transitions and flags sections needing bridges.
 * 
 * Part of Layer 7 (Editorial) of the compiler architecture.
 */

import { EnhancedResonanceEngine } from '../../mathematics/enhanced-resonance-engine.js';
import { ResonanceVectorMath, type ResonanceVector } from '@/lib/mathematics/resonance-vectors.js';
import { computeResonance } from '@/lib/rbi/core/compute.js';

// Fallback for computeResonanceWithOrbs - uses ResonanceVectorMath
function computeResonanceWithOrbs(
  vector1: ResonanceVector,
  vector2: ResonanceVector,
  orbs: number[]
): number {
  return ResonanceVectorMath.calculateResonanceSimilarity(vector1, vector2);
}
import type { ContentFile } from '../types.js';

export interface Gap {
  position: number;  // Position between sections (after section at index)
  section1: ContentFile | { content: string; title: string };
  section2: ContentFile | { content: string; title: string };
  coherence: number;
  resonance: number;
  severity: 'low' | 'medium' | 'high';
  needsBridge: boolean;
}

/**
 * Detect gaps between adjacent sections
 */
export async function detectGaps(
  sections: Array<ContentFile | { content: string; title: string }>,
  minCoherence: number = 0.5
): Promise<Gap[]> {
  if (sections.length < 2) {
    return [];
  }

  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  const gaps: Gap[] = [];

  for (let i = 0; i < sections.length - 1; i++) {
    const section1 = sections[i];
    const section2 = sections[i + 1];

    try {
      // Analyze both sections
      const [analysis1, analysis2] = await Promise.all([
        resonanceEngine.analyzeContentWithMathematics(
          section1.content,
          section1.title,
          {
            orb_associations: 'orb_tags' in section1 && Array.isArray(section1.orb_tags)
              ? section1.orb_tags
              : undefined
          }
        ),
        resonanceEngine.analyzeContentWithMathematics(
          section2.content,
          section2.title,
          {
            orb_associations: 'orb_tags' in section2 && Array.isArray(section2.orb_tags)
              ? section2.orb_tags
              : undefined
          }
        )
      ]);

      // Calculate coherence between sections
      const coherence1 = analysis1.mathematical.sovereignLogic.coherence;
      const coherence2 = analysis2.mathematical.sovereignLogic.coherence;
      const coherence = (coherence1 + coherence2) / 2;

      // Calculate resonance between sections
      const orbTags1 = 'orb_tags' in section1 && Array.isArray(section1.orb_tags) ? section1.orb_tags : [];
      const orbTags2 = 'orb_tags' in section2 && Array.isArray(section2.orb_tags) ? section2.orb_tags : [];
      const allOrbs = [...new Set([...orbTags1, ...orbTags2])];

      const resonance = allOrbs.length > 0
        ? computeResonanceWithOrbs(
            analysis1.mathematical.resonanceVector,
            analysis2.mathematical.resonanceVector,
            allOrbs
          )
        : ResonanceVectorMath.calculateResonanceSimilarity(
            analysis1.mathematical.resonanceVector,
            analysis2.mathematical.resonanceVector
          );

      // Determine severity
      let severity: 'low' | 'medium' | 'high';
      if (coherence < 0.4 || resonance < 0.3) {
        severity = 'high';
      } else if (coherence < 0.6 || resonance < 0.5) {
        severity = 'medium';
      } else {
        severity = 'low';
      }

      // Determine if bridge is needed
      const needsBridge = coherence < minCoherence || resonance < 0.5;

      if (needsBridge) {
        gaps.push({
          position: i + 1, // After section at index i
          section1,
          section2,
          coherence,
          resonance,
          severity,
          needsBridge
        });
      }
    } catch (error) {
      console.warn(`Warning: Failed to detect gap between sections ${i} and ${i + 1}:`, error);
    }
  }

  return gaps;
}

/**
 * Get gaps that need immediate attention (high severity)
 */
export function getCriticalGaps(gaps: Gap[]): Gap[] {
  return gaps.filter(gap => gap.severity === 'high');
}

/**
 * Get average coherence across all gaps
 */
export function getAverageGapCoherence(gaps: Gap[]): number {
  if (gaps.length === 0) {
    return 1.0;
  }

  return gaps.reduce((sum, gap) => sum + gap.coherence, 0) / gaps.length;
}

