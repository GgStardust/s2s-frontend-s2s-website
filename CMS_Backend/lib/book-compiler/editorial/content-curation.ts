/**
 * Content Curation Module
 * 
 * Extracts key sections from sources instead of including full essays.
 * Provides excerpting, synthesis, and recognition-first extraction.
 * 
 * Part of Phase 11 (Priority 2) - Content Curation Layer
 */

import type { ContentFile } from '../types.js';
import { scoreRecognitionQuality } from './recognition-first.js';

export interface CuratedSection {
  content: string;
  title?: string;
  score: number;
  type: 'experience' | 'concept' | 'mixed';
  startIndex: number;
  endIndex: number;
}

export interface CuratedSource {
  original: ContentFile;
  sections: CuratedSection[];
  curatedContent: string;
  totalLength: number;
}

/**
 * Extract key sections from content
 * 
 * @param content - Full content to extract from
 * @param maxSections - Maximum number of sections to extract (default: 3)
 * @param maxLength - Maximum total length in characters (default: 5000)
 * @param title - Optional title for context
 */
export async function extractKeySections(
  content: string,
  maxSections: number = 3,
  maxLength: number = 5000,
  title?: string
): Promise<CuratedSection[]> {
  // Parse content into logical sections
  const sections = parseIntoSections(content);
  
  // Score each section for recognition quality and relevance
  const scoredSections: Array<CuratedSection & { relevanceScore: number }> = [];
  
  for (const section of sections) {
    try {
      const recognition = await scoreRecognitionQuality(section.content, title);
      
      // Calculate relevance score (combination of recognition + length)
      // Prefer sections that are recognition-first and reasonable length
      const lengthScore = Math.min(1, section.content.length / 1000); // Normalize to 1000 chars
      const relevanceScore = (recognition.score * 0.6) + (lengthScore * 0.4);
      
      scoredSections.push({
        ...section,
        score: recognition.score,
        type: recognition.type,
        relevanceScore
      });
    } catch (error) {
      // If scoring fails, include section with neutral score
      scoredSections.push({
        ...section,
        score: 0.5,
        type: 'mixed',
        relevanceScore: 0.5
      });
    }
  }
  
  // Sort by relevance (highest first)
  scoredSections.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Select top sections up to maxLength
  const selected: CuratedSection[] = [];
  let totalLength = 0;
  
  for (const section of scoredSections.slice(0, maxSections)) {
    if (totalLength + section.content.length <= maxLength) {
      selected.push({
        content: section.content,
        title: section.title,
        score: section.score,
        type: section.type,
        startIndex: section.startIndex,
        endIndex: section.endIndex
      });
      totalLength += section.content.length;
    } else {
      // If adding this section would exceed maxLength, truncate it
      const remaining = maxLength - totalLength;
      if (remaining > 200) { // Only add if we have meaningful space
        selected.push({
          content: section.content.substring(0, remaining) + '...',
          title: section.title,
          score: section.score,
          type: section.type,
          startIndex: section.startIndex,
          endIndex: section.startIndex + remaining
        });
      }
      break;
    }
  }
  
  // Reorder selected sections by recognition score (recognition-first)
  selected.sort((a, b) => b.score - a.score);
  
  return selected;
}

/**
 * Parse content into logical sections
 */
function parseIntoSections(content: string): Array<{
  content: string;
  title?: string;
  startIndex: number;
  endIndex: number;
}> {
  const sections: Array<{
    content: string;
    title?: string;
    startIndex: number;
    endIndex: number;
  }> = [];
  
  // Filter out scrollstream sections first
  const contentWithoutScrollstreams = filterScrollstreams(content);
  
  // Split by markdown headers (##, ###)
  const headerRegex = /^(#{2,3})\s+(.+)$/gm;
  const matches = Array.from(contentWithoutScrollstreams.matchAll(headerRegex));
  
  if (matches.length === 0) {
    // No headers - split by double newlines (paragraphs)
    const paragraphs = contentWithoutScrollstreams.split(/\n\n+/);
    let currentIndex = 0;
    
    for (const para of paragraphs) {
      const trimmed = para.trim();
      // Skip scrollstream-only paragraphs
      if (trimmed.length > 100 && !isScrollstreamOnly(trimmed)) {
        sections.push({
          content: trimmed,
          startIndex: currentIndex,
          endIndex: currentIndex + para.length
        });
      }
      currentIndex += para.length + 2; // +2 for \n\n
    }
  } else {
    // Has headers - split by sections
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const headerLevel = match[1].length;
      const headerText = match[2].trim();
      const startIndex = match.index!;
      
      // Find end of this section (next header of same or higher level, or end of content)
      let endIndex = contentWithoutScrollstreams.length;
      if (i < matches.length - 1) {
        const nextMatch = matches[i + 1];
        const nextLevel = nextMatch[1].length;
        if (nextLevel <= headerLevel) {
          endIndex = nextMatch.index!;
        }
      }
      
      const sectionContent = contentWithoutScrollstreams.substring(startIndex, endIndex).trim();
      // Filter scrollstreams from section and check if substantial
      const filteredSection = filterScrollstreams(sectionContent);
      if (filteredSection.length > 100) {
        sections.push({
          content: filteredSection,
          title: headerText,
          startIndex,
          endIndex
        });
      }
    }
  }
  
  return sections;
}

/**
 * Filter scrollstreams from content
 * Removes ALL @scrollstream lines - they're for console use, not manuscript
 */
function filterScrollstreams(content: string): string {
  // Remove @scrollstream lines (with or without leading whitespace)
  let filtered = content.replace(/^\s*@scrollstream\s+.*$/gm, '');
  // Remove blocks of scrollstreams (multiple consecutive scrollstream lines)
  filtered = filtered.replace(/(@scrollstream[^\n]*\n\s*)+/g, '');
  // Remove any remaining @scrollstream references
  filtered = filtered.replace(/@scrollstream[^\n]*/g, '');
  // Clean up multiple blank lines
  filtered = filtered.replace(/\n{3,}/g, '\n\n');
  return filtered.trim();
}

/**
 * Check if content is only scrollstreams
 */
function isScrollstreamOnly(content: string): boolean {
  const lines = content.split('\n');
  const nonScrollstreamLines = lines.filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 0 && !trimmed.startsWith('@scrollstream');
  });
  return nonScrollstreamLines.length === 0;
}

/**
 * Create recognition-first excerpt from an essay
 * 
 * Extracts sections that are experience-based and recognition-first.
 */
export async function createRecognitionFirstExcerpt(
  source: ContentFile,
  maxLength: number = 5000
): Promise<string> {
  const sections = await extractKeySections(
    source.content,
    3, // max sections
    maxLength,
    source.title
  );
  
  // Filter to recognition-first sections (experience or mixed)
  const recognitionSections = sections
    .filter(s => s.type === 'experience' || s.type === 'mixed')
    .sort((a, b) => b.score - a.score);
  
  // Combine sections with separators
  return recognitionSections
    .map(s => s.content)
    .join('\n\n---\n\n');
}

/**
 * Curate a source file - extract key sections
 */
export async function curateSource(
  source: ContentFile,
  config: {
    maxSections?: number;
    maxLength?: number;
    recognitionFirst?: boolean;
  } = {}
): Promise<CuratedSource> {
  const {
    maxSections = 3,
    maxLength = 5000,
    recognitionFirst = true
  } = config;
  
  let sections: CuratedSection[];
  
  if (recognitionFirst) {
    // Extract recognition-first sections
    sections = await extractKeySections(source.content, maxSections, maxLength, source.title);
  } else {
    // Extract top sections by relevance
    sections = await extractKeySections(source.content, maxSections, maxLength, source.title);
  }
  
  // Combine sections into curated content
  const curatedContent = sections
    .map((s, idx) => {
      if (s.title) {
        return `## ${s.title}\n\n${s.content}`;
      }
      return s.content;
    })
    .join('\n\n---\n\n');
  
  return {
    original: source,
    sections,
    curatedContent,
    totalLength: curatedContent.length
  };
}

/**
 * Synthesize overlapping content from multiple sources
 * 
 * Identifies and merges redundant or overlapping concepts.
 */
export function synthesizeOverlappingContent(
  sources: ContentFile[]
): ContentFile[] {
  // For now, return sources as-is
  // TODO: Implement actual synthesis logic
  // This would involve:
  // 1. Identifying overlapping concepts
  // 2. Merging similar sections
  // 3. Removing redundancy
  // 4. Creating unified narrative
  
  return sources;
}

