/**
 * Metadata Selector Module
 * 
 * Selects content sources based on YAML frontmatter metadata matching.
 * This is the base layer (Layer 1) of the compiler.
 */

import type { ContentFile, ChapterOutline } from '../types.js';

export interface SelectionResult {
  file: ContentFile;
  score: number;
  reasons: string[];
}

/**
 * Select sources for a chapter based on metadata matching
 * 
 * Scoring system:
 * - Book threading match: 10 points (highest priority)
 * - Content purpose keyword match: 2 points per keyword
 * - Integration points: 5 points (Book Compiler) or 3 points (book_fragments)
 * - Orb focus match: 5 points
 * - Inline tag relevance: 1 point per match
 * - Framework keyword match: 8 points (weighted)
 */
export function selectSourcesForChapter(
  chapter: ChapterOutline,
  contentFiles: ContentFile[],
  maxSources: number = 3
): ContentFile[] {
  // Filter to only essays - exclude book_output (compiled chapters should not be used as sources)
  // System references can be included if use_in_book_compiler is true
  // Files without YAML are treated as essays by default (created by content loader)
  const essayFiles = contentFiles.filter(f => {
    const fileType = f.yaml?.type || 'essay';
    if (fileType !== 'essay' && fileType !== 'book_output') {
      // Allow files without explicit type if they have content
      if (!f.content) return false;
    }
    
    // Exclude compiled book output
    if (fileType === 'book_output') return false;
    
    // Check if this is a framework file
    if (f.yaml?.source_type === 'system_reference' || f.yaml?.system_role === 'core_framework') {
      // Only include if explicitly allowed
      return f.yaml?.use_in_book_compiler === true;
    }
    
    return true;
  });
  
  const scored: SelectionResult[] = [];
  
  for (const file of essayFiles) {
    let score = 0;
    const reasons: string[] = [];
    
    // 0. Framework file handling - check auto_include_keywords
    if (file.yaml.framework_handling?.auto_include_keywords && Array.isArray(file.yaml.framework_handling.auto_include_keywords)) {
      const chapterText = `${chapter.title} ${chapter.description || ''}`.toLowerCase();
      const keywords = file.yaml.framework_handling.auto_include_keywords.map((k: string) => k.toLowerCase());
      const hasKeywordMatch = keywords.some(keyword => chapterText.includes(keyword));
      
      if (hasKeywordMatch) {
        // Apply inclusion_weight for framework files
        const weight = typeof file.yaml.inclusion_weight === 'number' ? file.yaml.inclusion_weight : 0.25;
        score += 8 * weight; // Boost but weighted lower
        reasons.push(`framework keyword match (weight: ${weight})`);
      }
    }

    // 1. Book threading match (highest priority)
    const bookThreading = file.yaml.book_threading || '';
    if (bookThreading.includes('Stardust to Sovereignty') || 
        bookThreading.includes('Book : Stardust to Sovereignty') ||
        bookThreading.includes('Book 1')) {
      score += 10;
      reasons.push('book_threading match');
    }
    
    // 2. Field function content_purpose match
    const fieldFunction = file.yaml.field_function || {};
    const contentPurpose = (fieldFunction.content_purpose || '').toLowerCase();
    const chapterText = `${chapter.title} ${chapter.description || ''}`.toLowerCase();
    
    // Check for keyword matches
    const chapterWords = chapterText.split(/\s+/).filter(w => w.length > 4);
    const purposeWords = contentPurpose.split(/\s+/).filter(w => w.length > 4);
    const matchingWords = purposeWords.filter(pw => 
      chapterWords.some(cw => cw.includes(pw) || pw.includes(cw))
    );
    
    if (matchingWords.length > 0) {
      score += matchingWords.length * 2;
      reasons.push(`content_purpose match (${matchingWords.length} keywords)`);
    }
    
    // 3. Integration points - prioritize Book Compiler content
    const integrationPoints = file.yaml.integration_points || [];
    if (Array.isArray(integrationPoints) && integrationPoints.includes('Book Compiler')) {
      score += 5;
      reasons.push('Book Compiler integration');
    } else if (Array.isArray(integrationPoints) && integrationPoints.includes('book_fragments')) {
      score += 3;
      reasons.push('book_fragments integration');
    }
    
    // 4. Orb focus match (if specified)
    if (chapter.orb_focus) {
      const fileOrbs = file.orb_tags;
      if (fileOrbs.includes(chapter.orb_focus)) {
        score += 5;
        reasons.push(`orb_${chapter.orb_focus} match`);
      }
    }
    
    // 5. Inline tag relevance
    const chapterTitleLower = chapter.title.toLowerCase();
    for (const tag of file.inline_tags) {
      const tagName = tag.replace('@', '').replace(/\d+/, '').toLowerCase();
      if (chapterTitleLower.includes(tagName) || chapterTitleLower.includes(tagName.replace('_', ' '))) {
        score += 1;
        reasons.push(`inline tag match: ${tag}`);
      }
    }
    
    if (score > 0) {
      scored.push({ file, score, reasons });
    }
  }
  
  // Sort by score and select top N
  scored.sort((a, b) => b.score - a.score);
  const topSources = scored.slice(0, maxSources);
  
  return topSources.map(item => item.file);
}

/**
 * Get selection details for debugging/logging
 */
export function getSelectionDetails(
  chapter: ChapterOutline,
  contentFiles: ContentFile[],
  maxSources: number = 3
): { sources: ContentFile[]; details: SelectionResult[] } {
  const essayFiles = contentFiles.filter(f => {
    if (f.yaml.type !== 'essay') return false;
    if (f.yaml.source_type === 'system_reference' || f.yaml.system_role === 'core_framework') {
      return f.yaml.use_in_book_compiler === true;
    }
    return true;
  });
  
  const scored: SelectionResult[] = [];
  
  for (const file of essayFiles) {
    let score = 0;
    const reasons: string[] = [];
    
    // Same scoring logic as selectSourcesForChapter
    if (file.yaml.framework_handling?.auto_include_keywords && Array.isArray(file.yaml.framework_handling.auto_include_keywords)) {
      const chapterText = `${chapter.title} ${chapter.description || ''}`.toLowerCase();
      const keywords = file.yaml.framework_handling.auto_include_keywords.map((k: string) => k.toLowerCase());
      const hasKeywordMatch = keywords.some(keyword => chapterText.includes(keyword));
      
      if (hasKeywordMatch) {
        const weight = typeof file.yaml.inclusion_weight === 'number' ? file.yaml.inclusion_weight : 0.25;
        score += 8 * weight;
        reasons.push(`framework keyword match (weight: ${weight})`);
      }
    }

    const bookThreading = file.yaml.book_threading || '';
    if (bookThreading.includes('Stardust to Sovereignty') || 
        bookThreading.includes('Book : Stardust to Sovereignty') ||
        bookThreading.includes('Book 1')) {
      score += 10;
      reasons.push('book_threading match');
    }
    
    const fieldFunction = file.yaml.field_function || {};
    const contentPurpose = (fieldFunction.content_purpose || '').toLowerCase();
    const chapterText = `${chapter.title} ${chapter.description || ''}`.toLowerCase();
    
    const chapterWords = chapterText.split(/\s+/).filter(w => w.length > 4);
    const purposeWords = contentPurpose.split(/\s+/).filter(w => w.length > 4);
    const matchingWords = purposeWords.filter(pw => 
      chapterWords.some(cw => cw.includes(pw) || pw.includes(cw))
    );
    
    if (matchingWords.length > 0) {
      score += matchingWords.length * 2;
      reasons.push(`content_purpose match (${matchingWords.length} keywords)`);
    }
    
    const integrationPoints = file.yaml.integration_points || [];
    if (Array.isArray(integrationPoints) && integrationPoints.includes('Book Compiler')) {
      score += 5;
      reasons.push('Book Compiler integration');
    } else if (Array.isArray(integrationPoints) && integrationPoints.includes('book_fragments')) {
      score += 3;
      reasons.push('book_fragments integration');
    }
    
    if (chapter.orb_focus) {
      const fileOrbs = file.orb_tags;
      if (fileOrbs.includes(chapter.orb_focus)) {
        score += 5;
        reasons.push(`orb_${chapter.orb_focus} match`);
      }
    }
    
    const chapterTitleLower = chapter.title.toLowerCase();
    for (const tag of file.inline_tags) {
      const tagName = tag.replace('@', '').replace(/\d+/, '').toLowerCase();
      if (chapterTitleLower.includes(tagName) || chapterTitleLower.includes(tagName.replace('_', ' '))) {
        score += 1;
        reasons.push(`inline tag match: ${tag}`);
      }
    }
    
    if (score > 0) {
      scored.push({ file, score, reasons });
    }
  }
  
  scored.sort((a, b) => b.score - a.score);
  const topSources = scored.slice(0, maxSources);
  
  return {
    sources: topSources.map(item => item.file),
    details: topSources
  };
}

