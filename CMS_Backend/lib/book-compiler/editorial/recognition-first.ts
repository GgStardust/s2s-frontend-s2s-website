/**
 * Recognition-First Restructuring Module
 * 
 * Reorders content to start with experience before concepts.
 * Scores sections for recognition quality and restructures accordingly.
 * 
 * Part of Layer 7 (Editorial) of the compiler architecture.
 */

import { EnhancedResonanceEngine } from '../../mathematics/enhanced-resonance-engine.js';
import type { ContentFile } from '../types.js';

export interface RecognitionScore {
  section: ContentFile | { content: string; title: string };
  score: number;  // 0-1, higher = more recognition/experience-based
  type: 'experience' | 'concept' | 'mixed';
  indicators: {
    hasExperienceLanguage: boolean;
    hasConceptLanguage: boolean;
    hasSensoryLanguage: boolean;
    hasAbstractLanguage: boolean;
    startsWithQuestion: boolean;
    startsWithStatement: boolean;
  };
}

/**
 * Score a section for recognition quality
 * 
 * Higher scores = more experience-based, recognition-first
 * Lower scores = more concept-based, abstract
 */
export async function scoreRecognitionQuality(
  content: string,
  title?: string
): Promise<{
  score: number;
  type: 'experience' | 'concept' | 'mixed';
  indicators: RecognitionScore['indicators'];
}> {
  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  
  // Analyze with RBI
  const analysis = await resonanceEngine.analyzeContentWithMathematics(content, title);
  
  // Get RBI metrics
  const clarity = analysis.signature.clarity;
  const resonance = analysis.signature.resonance;
  
  // Analyze content for recognition indicators
  const lowerContent = content.toLowerCase();
  const firstSentence = content.split(/[.!?]/)[0]?.trim() || '';
  const firstSentenceLower = firstSentence.toLowerCase();
  
  // Experience/recognition indicators
  const hasExperienceLanguage = /feel|sense|experience|recognize|notice|perceive|aware|body|breath|heart|chest|hands|feet/i.test(content);
  const hasSensoryLanguage = /see|hear|touch|taste|smell|feel|sense|perceive|notice|aware/i.test(content);
  const startsWithQuestion = firstSentenceLower.includes('?');
  
  // Concept/abstract indicators
  const hasConceptLanguage = /concept|theory|framework|system|architecture|principle|mechanism|structure|model/i.test(content);
  const hasAbstractLanguage = /abstract|theoretical|philosophical|metaphysical|ontological|epistemological/i.test(content);
  const startsWithStatement = !startsWithQuestion && firstSentence.length > 0;
  
  // Calculate recognition score
  // Higher = more experience-based, lower = more concept-based
  let score = 0.5; // Start neutral
  
  // Boost for experience indicators
  if (hasExperienceLanguage) score += 0.15;
  if (hasSensoryLanguage) score += 0.15;
  if (startsWithQuestion) score += 0.1;
  
  // Reduce for concept indicators
  if (hasConceptLanguage) score -= 0.15;
  if (hasAbstractLanguage) score -= 0.15;
  if (startsWithStatement && hasAbstractLanguage) score -= 0.1;
  
  // Use RBI Resonance as indicator (higher resonance = more recognition)
  score = (score * 0.7) + (resonance * 0.3);
  
  // Clamp to 0-1
  score = Math.max(0, Math.min(1, score));
  
  // Determine type
  let type: 'experience' | 'concept' | 'mixed';
  if (score >= 0.7) {
    type = 'experience';
  } else if (score <= 0.3) {
    type = 'concept';
  } else {
    type = 'mixed';
  }
  
  return {
    score,
    type,
    indicators: {
      hasExperienceLanguage,
      hasConceptLanguage,
      hasSensoryLanguage,
      hasAbstractLanguage,
      startsWithQuestion,
      startsWithStatement
    }
  };
}

/**
 * Score all sections for recognition quality
 */
export async function scoreAllSections(
  sections: Array<ContentFile | { content: string; title: string }>
): Promise<RecognitionScore[]> {
  const results: RecognitionScore[] = [];
  
  for (const section of sections) {
    try {
      const scoring = await scoreRecognitionQuality(section.content, section.title);
      results.push({
        section,
        score: scoring.score,
        type: scoring.type,
        indicators: scoring.indicators
      });
    } catch (error) {
      console.warn(`Warning: Failed to score recognition for section:`, error);
      // Default to mixed
      results.push({
        section,
        score: 0.5,
        type: 'mixed',
        indicators: {
          hasExperienceLanguage: false,
          hasConceptLanguage: false,
          hasSensoryLanguage: false,
          hasAbstractLanguage: false,
          startsWithQuestion: false,
          startsWithStatement: true
        }
      });
    }
  }
  
  return results;
}

/**
 * Reorder sections for recognition-first flow
 * 
 * Orders: High recognition (experience) → Medium → Low (concepts)
 */
export function reorderForRecognitionFirst(
  scoredSections: RecognitionScore[]
): RecognitionScore[] {
  // Sort by recognition score (descending)
  const sorted = [...scoredSections].sort((a, b) => b.score - a.score);
  
  return sorted;
}

/**
 * Get best opening section (highest recognition score)
 */
export function getBestOpeningSection(
  scoredSections: RecognitionScore[]
): RecognitionScore | null {
  if (scoredSections.length === 0) {
    return null;
  }
  
  // Find section with highest recognition score
  return scoredSections.reduce((best, current) => 
    current.score > best.score ? current : best
  );
}

/**
 * Restructure source content for recognition-first flow
 * 
 * Parses source into sections, scores them, and reorders for recognition-first.
 * Part of Phase 12 (Priority 3) - Restructure Source Content
 */
export async function restructureSourceForRecognitionFirst(
  source: { content: string; title: string }
): Promise<string> {
  const { parseIntoSections, reorderSectionsForRecognitionFirst } = await import('./section-parser.js');
  
  // Parse into sections
  const sections = parseIntoSections(source.content);
  
  if (sections.length === 0) {
    return source.content; // No sections to restructure
  }
  
  // Score each section for recognition quality
  const scoredSections: Array<{ section: typeof sections[0]; score: number }> = [];
  for (const section of sections) {
    try {
      const scoring = await scoreRecognitionQuality(section.content, section.title);
      scoredSections.push({
        section,
        score: scoring.score
      });
    } catch (error) {
      // Default score if scoring fails
      scoredSections.push({
        section,
        score: 0.5
      });
    }
  }
  
  // Reorder for recognition-first
  const reordered = reorderSectionsForRecognitionFirst(sections, scoredSections);
  
  // Reconstruct content
  return reordered.map(s => s.content).join('\n\n---\n\n');
}

