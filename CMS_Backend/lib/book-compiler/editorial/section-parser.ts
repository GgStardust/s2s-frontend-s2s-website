/**
 * Section Parser Module
 * 
 * Parses essays into logical sections for recognition-first restructuring.
 * Part of Phase 12 (Priority 3) - Restructure Source Content
 */

export interface ParsedSection {
  content: string;
  title?: string;
  level: number;  // Header level (1-6)
  type: 'intro' | 'body' | 'conclusion' | 'practice' | 'research' | 'unknown';
  startIndex: number;
  endIndex: number;
  recognitionScore?: number;  // Will be scored later
}

/**
 * Parse content into logical sections
 */
export function parseIntoSections(content: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  
  // Split by markdown headers (##, ###, ####)
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const matches = Array.from(content.matchAll(headerRegex));
  
  if (matches.length === 0) {
    // No headers - split by double newlines (paragraphs)
    return parseByParagraphs(content);
  }
  
  // Has headers - split by sections
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const headerLevel = match[1].length;
    const headerText = match[2].trim();
    const startIndex = match.index!;
    
    // Find end of this section (next header of same or higher level, or end of content)
    let endIndex = content.length;
    if (i < matches.length - 1) {
      const nextMatch = matches[i + 1];
      const nextLevel = nextMatch[1].length;
      if (nextLevel <= headerLevel) {
        endIndex = nextMatch.index!;
      }
    }
    
    const sectionContent = content.substring(startIndex, endIndex).trim();
    if (sectionContent.length > 50) { // Only include substantial sections
      const sectionType = identifySectionType(headerText, sectionContent);
      sections.push({
        content: sectionContent,
        title: headerText,
        level: headerLevel,
        type: sectionType,
        startIndex,
        endIndex
      });
    }
  }
  
  return sections;
}

/**
 * Parse content by paragraphs when no headers exist
 */
function parseByParagraphs(content: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const paragraphs = content.split(/\n\n+/);
  let currentIndex = 0;
  
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (trimmed.length > 100) { // Only include substantial paragraphs
      const sectionType = identifySectionType('', trimmed);
      sections.push({
        content: trimmed,
        level: 0,
        type: sectionType,
        startIndex: currentIndex,
        endIndex: currentIndex + para.length
      });
    }
    currentIndex += para.length + 2; // +2 for \n\n
  }
  
  return sections;
}

/**
 * Identify section type based on title and content
 */
function identifySectionType(title: string, content: string): ParsedSection['type'] {
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();
  
  // Check title first
  if (lowerTitle.includes('practice') || lowerTitle.includes('protocol') || 
      lowerTitle.includes('exercise') || lowerTitle.includes('meditation')) {
    return 'practice';
  }
  
  if (lowerTitle.includes('research') || lowerTitle.includes('study') || 
      lowerTitle.includes('science') || lowerTitle.includes('data')) {
    return 'research';
  }
  
  if (lowerTitle.includes('conclusion') || lowerTitle.includes('summary') || 
      lowerTitle.includes('closing') || lowerTitle.includes('final')) {
    return 'conclusion';
  }
  
  if (lowerTitle.includes('introduction') || lowerTitle.includes('overview') || 
      lowerTitle.includes('beginning') || lowerTitle.includes('opening')) {
    return 'intro';
  }
  
  // Check content patterns
  if (lowerContent.includes('research') || lowerContent.includes('study') || 
      lowerContent.includes('scientists') || lowerContent.includes('data shows') ||
      lowerContent.match(/\d{4}\)|et al\.|journal|published/)) {
    return 'research';
  }
  
  if (lowerContent.includes('practice') || lowerContent.includes('exercise') || 
      lowerContent.includes('meditation') || lowerContent.includes('protocol') ||
      lowerContent.match(/^- |^\d+\./)) { // List items
    return 'practice';
  }
  
  // Default to body
  return 'body';
}

/**
 * Extract recognition-first sections from parsed sections
 */
export function extractRecognitionSections(
  sections: ParsedSection[],
  recognitionScores: Array<{ section: ParsedSection; score: number }>
): ParsedSection[] {
  // Filter to sections with high recognition scores
  const highRecognition = recognitionScores
    .filter(rs => rs.score > 0.6)
    .sort((a, b) => b.score - a.score)
    .map(rs => rs.section);
  
  return highRecognition;
}

/**
 * Reorder sections for recognition-first flow
 */
export function reorderSectionsForRecognitionFirst(
  sections: ParsedSection[],
  recognitionScores: Array<{ section: ParsedSection; score: number }>
): ParsedSection[] {
  // Create a map of scores
  const scoreMap = new Map<ParsedSection, number>();
  recognitionScores.forEach(rs => {
    scoreMap.set(rs.section, rs.score);
  });
  
  // Sort by recognition score (descending), then by type priority
  const typePriority: Record<ParsedSection['type'], number> = {
    'intro': 1,
    'body': 2,
    'practice': 3,
    'research': 4,
    'conclusion': 5,
    'unknown': 6
  };
  
  return [...sections].sort((a, b) => {
    const scoreA = scoreMap.get(a) || 0.5;
    const scoreB = scoreMap.get(b) || 0.5;
    
    // First sort by recognition score (higher = earlier)
    if (Math.abs(scoreA - scoreB) > 0.1) {
      return scoreB - scoreA;
    }
    
    // Then by type priority
    return typePriority[a.type] - typePriority[b.type];
  });
}

