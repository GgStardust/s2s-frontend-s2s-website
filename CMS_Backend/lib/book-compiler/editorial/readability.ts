/**
 * Readability Analysis Module
 * 
 * Measures readability using RBI Clarity dimension and other metrics.
 * Identifies dense sections needing simplification.
 * 
 * Part of Layer 7 (Editorial) of the compiler architecture.
 */

import { EnhancedResonanceEngine } from '../../mathematics/enhanced-resonance-engine.js';
import type { ContentFile } from '../types.js';

export interface ReadabilityScore {
  clarity: number;        // RBI Clarity dimension (0-1)
  accessibility: number;  // Overall accessibility score (0-1)
  density: 'sparse' | 'moderate' | 'dense' | 'very_dense';
  wordCount: number;
  sentenceLength: number;
  paragraphLength: number;
  needsSimplification: boolean;
}

export interface SectionReadability {
  section: ContentFile | { content: string; title: string };
  score: ReadabilityScore;
  position?: number;
}

/**
 * Analyze readability of a content section
 */
export async function analyzeReadability(
  content: string,
  title?: string
): Promise<ReadabilityScore> {
  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  
  // Analyze with RBI
  const analysis = await resonanceEngine.analyzeContentWithMathematics(content, title);
  
  // Get RBI Clarity dimension
  const clarity = analysis.signature.clarity;
  
  // Calculate text metrics
  const words = content.split(/\s+/).filter(w => w.trim().length > 0);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  const wordCount = words.length;
  const sentenceLength = sentences.length > 0 
    ? words.length / sentences.length 
    : 0;
  const paragraphLength = paragraphs.length > 0
    ? words.length / paragraphs.length
    : 0;
  
  // Determine density
  let density: ReadabilityScore['density'] = 'moderate';
  if (paragraphLength > 200) {
    density = 'very_dense';
  } else if (paragraphLength > 100) {
    density = 'dense';
  } else if (paragraphLength < 50) {
    density = 'sparse';
  }
  
  // Calculate accessibility (combination of clarity and text metrics)
  const sentenceComplexity = sentenceLength > 25 ? 0.7 : sentenceLength > 15 ? 0.9 : 1.0;
  const paragraphComplexity = paragraphLength > 150 ? 0.7 : paragraphLength > 100 ? 0.9 : 1.0;
  const accessibility = (clarity * 0.5 + sentenceComplexity * 0.25 + paragraphComplexity * 0.25);
  
  // Determine if simplification is needed
  const needsSimplification = clarity < 0.6 || accessibility < 0.7 || density === 'very_dense';
  
  return {
    clarity,
    accessibility,
    density,
    wordCount,
    sentenceLength,
    paragraphLength,
    needsSimplification
  };
}

/**
 * Analyze readability of all sections in compiled content
 */
export async function analyzeSectionReadability(
  sections: Array<ContentFile | { content: string; title: string }>
): Promise<SectionReadability[]> {
  const results: SectionReadability[] = [];
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    try {
      const score = await analyzeReadability(section.content, section.title);
      results.push({
        section,
        score,
        position: i
      });
    } catch (error) {
      console.warn(`Warning: Failed to analyze readability for section ${i}:`, error);
      // Add default score
      results.push({
        section,
        score: {
          clarity: 0.5,
          accessibility: 0.5,
          density: 'moderate',
          wordCount: section.content.split(/\s+/).length,
          sentenceLength: 0,
          paragraphLength: 0,
          needsSimplification: false
        },
        position: i
      });
    }
  }
  
  return results;
}

/**
 * Identify sections needing simplification
 */
export function identifyDenseSections(
  readabilityResults: SectionReadability[]
): SectionReadability[] {
  return readabilityResults.filter(result => result.score.needsSimplification);
}

/**
 * Get average readability score
 */
export function getAverageReadability(
  readabilityResults: SectionReadability[]
): {
  averageClarity: number;
  averageAccessibility: number;
  overallDensity: 'sparse' | 'moderate' | 'dense' | 'very_dense';
} {
  if (readabilityResults.length === 0) {
    return {
      averageClarity: 0.5,
      averageAccessibility: 0.5,
      overallDensity: 'moderate'
    };
  }
  
  const avgClarity = readabilityResults.reduce((sum, r) => sum + r.score.clarity, 0) / readabilityResults.length;
  const avgAccessibility = readabilityResults.reduce((sum, r) => sum + r.score.accessibility, 0) / readabilityResults.length;
  
  // Determine overall density (most common)
  const densityCounts = readabilityResults.reduce((acc, r) => {
    acc[r.score.density] = (acc[r.score.density] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const overallDensity = Object.entries(densityCounts).reduce((a, b) => 
    densityCounts[a[0]] > densityCounts[b[0]] ? a : b
  )[0] as ReadabilityScore['density'];
  
  return {
    averageClarity: avgClarity,
    averageAccessibility: avgAccessibility,
    overallDensity
  };
}

