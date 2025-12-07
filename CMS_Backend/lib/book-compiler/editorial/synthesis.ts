/**
 * Synthesis Module
 * 
 * Creates unified narrative from multiple sources instead of concatenation.
 * Part of Phase 13 (Priority 4) - Synthesis Layer
 */

import type { ContentFile } from '../types.js';
import { scoreRecognitionQuality } from './recognition-first.js';
import { parseIntoSections } from './section-parser.js';
import { EnhancedResonanceEngine } from '../../mathematics/enhanced-resonance-engine.js';
import { ResonanceVectorMath } from '../../mathematics/resonance-vectors.js';

export interface SynthesizedSection {
  content: string;
  sources: ContentFile[];
  theme: string;
  recognitionScore: number;
}

export interface SynthesisResult {
  sections: SynthesizedSection[];
  totalLength: number;
  redundancyRemoved: number;
  themes: string[];
}

/**
 * Synthesize chapter from multiple sources
 * 
 * Creates unified narrative by:
 * 1. Identifying overlapping concepts
 * 2. Merging related sections
 * 3. Creating smooth transitions
 * 4. Eliminating redundancy
 */
export async function synthesizeChapter(
  sources: ContentFile[],
  config: {
    maxLength?: number;
    preserveScrollstreams?: boolean;
    createNarrativeFlow?: boolean;
  } = {}
): Promise<SynthesisResult> {
  const {
    maxLength = 50000,
    preserveScrollstreams = false,
    createNarrativeFlow = true
  } = config;
  
  // Step 1: Identify themes and group related content
  const themes = identifyThemes(sources);
  
  // Step 2: Organize content by theme
  const contentByTheme = organizeByTheme(sources, themes);
  
  // Step 3: Merge related concepts within each theme
  const mergedThemes = await mergeRelatedConcepts(contentByTheme, preserveScrollstreams);
  
  // Step 4: Create narrative flow
  const synthesizedSections = createNarrativeFlow
    ? await createThematicFlow(mergedThemes)
    : mergedThemes;
  
  // Step 5: Calculate metrics
  const originalLength = sources.reduce((sum, s) => sum + s.content.length, 0);
  const synthesizedLength = synthesizedSections.reduce((sum, s) => sum + s.content.length, 0);
  const redundancyRemoved = originalLength - synthesizedLength;
  
  // Step 6: Limit to maxLength if needed
  let finalSections = synthesizedSections;
  if (synthesizedLength > maxLength) {
    finalSections = limitToMaxLength(synthesizedSections, maxLength);
  }
  
  return {
    sections: finalSections,
    totalLength: finalSections.reduce((sum, s) => sum + s.content.length, 0),
    redundancyRemoved,
    themes: themes.map(t => t.name)
  };
}

/**
 * Identify themes across sources
 */
function identifyThemes(sources: ContentFile[]): Array<{ name: string; keywords: string[] }> {
  const themeMap = new Map<string, number>();
  const keywordMap = new Map<string, Set<string>>();
  
  // Extract themes from source metadata and content
  for (const source of sources) {
    // Check YAML metadata
    const fieldFunction = source.yaml?.field_function?.content_purpose || '';
    const bookThreading = source.yaml?.book_threading || '';
    const orbAssociations = source.yaml?.orb_associations || [];
    
    // Extract keywords
    const keywords = extractKeywords(fieldFunction + ' ' + bookThreading + ' ' + source.title);
    
    // Identify themes
    const themes = identifyThemesFromKeywords(keywords);
    for (const theme of themes) {
      themeMap.set(theme, (themeMap.get(theme) || 0) + 1);
      if (!keywordMap.has(theme)) {
        keywordMap.set(theme, new Set());
      }
      keywords.forEach(kw => keywordMap.get(theme)!.add(kw));
    }
  }
  
  // Return top themes
  return Array.from(themeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10 themes
    .map(([name, count]) => ({
      name,
      keywords: Array.from(keywordMap.get(name) || [])
    }));
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const keywords: string[] = [];
  
  // Common S2S concepts
  const concepts = [
    'resonance', 'sovereignty', 'orb', 'field', 'coherence', 'frequency',
    'temporal', 'ancestral', 'photonic', 'harmonic', 'alchemical', 'quantum',
    'stardust', 'cosmic', 'biological', 'metabolic', 'rhythmic', 'origin',
    'starline', 'memory', 'transparency', 'bridging', 'intelligence'
  ];
  
  for (const concept of concepts) {
    if (lower.includes(concept)) {
      keywords.push(concept);
    }
  }
  
  return keywords;
}

/**
 * Identify themes from keywords
 */
function identifyThemesFromKeywords(keywords: string[]): string[] {
  const themes: string[] = [];
  
  // Map keywords to themes
  if (keywords.some(k => ['resonance', 'frequency', 'vibration'].includes(k))) {
    themes.push('Resonance Mechanics');
  }
  if (keywords.some(k => ['temporal', 'time', 'rhythm'].includes(k))) {
    themes.push('Temporal Sovereignty');
  }
  if (keywords.some(k => ['ancestral', 'memory', 'lineage'].includes(k))) {
    themes.push('Ancestral Memory');
  }
  if (keywords.some(k => ['photonic', 'light', 'reflection'].includes(k))) {
    themes.push('Photonic Intelligence');
  }
  if (keywords.some(k => ['harmonic', 'geometry', 'pattern'].includes(k))) {
    themes.push('Harmonic Architectures');
  }
  if (keywords.some(k => ['biological', 'metabolic', 'body'].includes(k))) {
    themes.push('Biological Intelligence');
  }
  if (keywords.some(k => ['cosmic', 'stardust', 'galactic'].includes(k))) {
    themes.push('Cosmic Origins');
  }
  if (keywords.some(k => ['sovereignty', 'field', 'coherence'].includes(k))) {
    themes.push('Sovereign Field');
  }
  
  return themes.length > 0 ? themes : ['General'];
}

/**
 * Organize content by theme
 */
function organizeByTheme(
  sources: ContentFile[],
  themes: Array<{ name: string; keywords: string[] }>
): Map<string, ContentFile[]> {
  const contentByTheme = new Map<string, ContentFile[]>();
  
  // Initialize theme buckets
  themes.forEach(theme => {
    contentByTheme.set(theme.name, []);
  });
  
  // Assign sources to themes
  for (const source of sources) {
    const sourceText = (source.yaml?.field_function?.content_purpose || '') + 
                       ' ' + (source.yaml?.book_threading || '') + 
                       ' ' + source.title;
    const sourceKeywords = extractKeywords(sourceText);
    
    // Find best matching theme
    let bestTheme = 'General';
    let bestScore = 0;
    
    for (const theme of themes) {
      const score = theme.keywords.filter(kw => sourceKeywords.includes(kw)).length;
      if (score > bestScore) {
        bestScore = score;
        bestTheme = theme.name;
      }
    }
    
    if (!contentByTheme.has(bestTheme)) {
      contentByTheme.set(bestTheme, []);
    }
    contentByTheme.get(bestTheme)!.push(source);
  }
  
  return contentByTheme;
}

/**
 * Merge related concepts within themes
 * Uses RBI to find the most resonant sections within each source (not just first 3 paragraphs)
 */
async function mergeRelatedConcepts(
  contentByTheme: Map<string, ContentFile[]>,
  preserveScrollstreams: boolean
): Promise<SynthesizedSection[]> {
  const merged: SynthesizedSection[] = [];
  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  
  for (const [theme, sources] of contentByTheme.entries()) {
    if (sources.length === 0) continue;
    
    // Analyze theme to get resonance vector for finding resonant sections
    const themeAnalysis = await resonanceEngine.analyzeContentWithMathematics(
      theme,
      theme
    );
    const themeResonanceVector = themeAnalysis.mathematical.resonanceVector;
    
    // Extract key content from each source using RBI to find resonant sections
    const keyContents: string[] = [];
    const allSources: ContentFile[] = [];
    
    for (const source of sources) {
      // Extract main content (always remove scrollstreams - they're for console, not manuscript)
      let content = source.content;
      
      // Remove all scrollstreams
      content = content.replace(/^\s*@scrollstream\s+.*$/gm, '');
      content = content.replace(/(@scrollstream[^\n]*\n\s*)+/g, '');
      content = content.replace(/@scrollstream[^\n]*/g, '');
      content = content.replace(/\n{3,}/g, '\n\n').trim();
      
      // Parse source into sections (not just paragraphs)
      const sections = parseIntoSections(content);
      
      if (sections.length === 0) {
        // Fallback: if no sections found, use paragraph parsing
        const paragraphs = content.split(/\n\n+/);
        const substantial = paragraphs
          .filter(p => p.trim().length > 150)
          .slice(0, 3)
          .map(p => p.trim())
          .join('\n\n');
        
        if (substantial.trim().length > 100) {
          keyContents.push(substantial.trim());
          allSources.push(source);
        }
        continue;
      }
      
      // Score each section against theme using RBI
      const scoredSections = await Promise.all(
        sections.map(async (section) => {
          try {
            // Analyze section to get resonance vector
            const sectionAnalysis = await resonanceEngine.analyzeContentWithMathematics(
              section.content,
              section.title || source.title
            );
            const sectionResonanceVector = sectionAnalysis.mathematical.resonanceVector;
            
            // Calculate resonance similarity with theme
            const resonance = ResonanceVectorMath.calculateResonanceSimilarity(
              themeResonanceVector,
              sectionResonanceVector
            );
            
            // Also check Orb associations if available
            let orbBonus = 0;
            if (source.orb_tags.length > 0) {
              // Orb associations can boost resonance
              orbBonus = 0.1;
            }
            
            return {
              section,
              resonance: resonance + orbBonus,
              content: section.content
            };
          } catch (error) {
            // Fallback: use content length as proxy for importance
            return {
              section,
              resonance: 0.3,
              content: section.content
            };
          }
        })
      );
      
      // Select top 3 most resonant sections (not just first 3)
      const topSections = scoredSections
        .sort((a, b) => b.resonance - a.resonance)
        .slice(0, 3)
        .filter(s => s.content.trim().length > 100);
      
      if (topSections.length > 0) {
        const selectedContent = topSections
          .map(s => s.content.trim())
          .join('\n\n');
        keyContents.push(selectedContent);
        allSources.push(source);
      }
    }
    
    // Merge into single section
    const mergedContent = keyContents.join('\n\n');
    
    // Score for recognition
    let recognitionScore = 0.5;
    try {
      const scoring = await scoreRecognitionQuality(mergedContent, theme);
      recognitionScore = scoring.score;
    } catch (error) {
      // Default score
    }
    
    merged.push({
      content: mergedContent,
      sources: allSources,
      theme,
      recognitionScore
    });
  }
  
  return merged;
}

/**
 * Create thematic flow between sections
 */
async function createThematicFlow(
  sections: SynthesizedSection[]
): Promise<SynthesizedSection[]> {
  // Sort by recognition score (recognition-first)
  const sorted = [...sections].sort((a, b) => b.recognitionScore - a.recognitionScore);
  
  // Add transitions between sections
  const withTransitions: SynthesizedSection[] = [];
  
  for (let i = 0; i < sorted.length; i++) {
    const section = sorted[i];
    let content = section.content;
    
    // Add transition from previous section if not first
    if (i > 0) {
      const prevSection = sorted[i - 1];
      const transition = createTransition(prevSection.theme, section.theme);
      content = transition + '\n\n' + content;
    }
    
    withTransitions.push({
      ...section,
      content
    });
  }
  
  return withTransitions;
}

/**
 * Create transition between themes
 */
function createTransition(fromTheme: string, toTheme: string): string {
  // Simple transition - can be enhanced with AI generation later
  return `As we move from ${fromTheme} to ${toTheme}, the patterns deepen and the connections become clearer.`;
}

/**
 * Limit sections to max length
 */
function limitToMaxLength(
  sections: SynthesizedSection[],
  maxLength: number
): SynthesizedSection[] {
  const limited: SynthesizedSection[] = [];
  let currentLength = 0;
  
  for (const section of sections) {
    if (currentLength + section.content.length <= maxLength) {
      limited.push(section);
      currentLength += section.content.length;
    } else {
      // Truncate last section if needed
      const remaining = maxLength - currentLength;
      if (remaining > 200) {
        limited.push({
          ...section,
          content: section.content.substring(0, remaining) + '...'
        });
      }
      break;
    }
  }
  
  return limited;
}

/**
 * Identify redundancy across sources
 */
export function identifyRedundancy(sources: ContentFile[]): Array<{
  concept: string;
  sources: ContentFile[];
  similarity: number;
}> {
  const redundancies: Array<{
    concept: string;
    sources: ContentFile[];
    similarity: number;
  }> = [];
  
  // Simple redundancy detection based on title and content similarity
  for (let i = 0; i < sources.length; i++) {
    for (let j = i + 1; j < sources.length; j++) {
      const source1 = sources[i];
      const source2 = sources[j];
      
      // Calculate similarity
      const similarity = calculateSimilarity(source1, source2);
      
      if (similarity > 0.7) {
        redundancies.push({
          concept: source1.title,
          sources: [source1, source2],
          similarity
        });
      }
    }
  }
  
  return redundancies;
}

/**
 * Calculate similarity between two sources
 */
function calculateSimilarity(source1: ContentFile, source2: ContentFile): number {
  // Simple word overlap similarity
  const words1 = new Set(
    (source1.title + ' ' + source1.content.substring(0, 500))
      .toLowerCase()
      .split(/\s+/)
  );
  const words2 = new Set(
    (source2.title + ' ' + source2.content.substring(0, 500))
      .toLowerCase()
      .split(/\s+/)
  );
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

