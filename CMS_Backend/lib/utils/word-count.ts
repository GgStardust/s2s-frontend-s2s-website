/**
 * Word Count Utilities
 * 
 * Provides word counting functionality for the S2S Book Compiler
 */

/**
 * Count words in text content, excluding YAML frontmatter
 */
export function countWords(content: string): number {
  if (!content) return 0;
  
  // Remove YAML frontmatter if present
  const yamlRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
  const contentWithoutYaml = content.replace(yamlRegex, '');
  
  // Split by whitespace and filter out empty strings
  const words = contentWithoutYaml.trim().split(/\s+/).filter(word => word.length > 0);
  
  return words.length;
}

/**
 * Count words in markdown content, excluding headers, code blocks, and YAML
 */
export function countWordsInMarkdown(content: string): number {
  if (!content) return 0;
  
  // Remove YAML frontmatter
  const yamlRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
  let cleanContent = content.replace(yamlRegex, '');
  
  // Remove markdown headers
  cleanContent = cleanContent.replace(/^#+\s+.*$/gm, '');
  
  // Remove code blocks
  cleanContent = cleanContent.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code
  cleanContent = cleanContent.replace(/`[^`]+`/g, '');
  
  // Remove markdown links and images
  cleanContent = cleanContent.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  cleanContent = cleanContent.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  
  // Remove bold and italic markers
  cleanContent = cleanContent.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleanContent = cleanContent.replace(/\*([^*]+)\*/g, '$1');
  cleanContent = cleanContent.replace(/__([^_]+)__/g, '$1');
  cleanContent = cleanContent.replace(/_([^_]+)_/g, '$1');
  
  // Remove horizontal rules
  cleanContent = cleanContent.replace(/^[-*_]{3,}$/gm, '');
  
  // Remove list markers
  cleanContent = cleanContent.replace(/^[\s]*[-*+]\s+/gm, '');
  cleanContent = cleanContent.replace(/^[\s]*\d+\.\s+/gm, '');
  
  // Split by whitespace and filter out empty strings
  const words = cleanContent.trim().split(/\s+/).filter(word => word.length > 0);
  
  return words.length;
}

/**
 * Format word count for display
 */
export function formatWordCount(count: number): string {
  return count.toLocaleString();
}

/**
 * Calculate reading time estimate (average 200 words per minute)
 */
export function calculateReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}

/**
 * Get word count status (under target, at target, over target)
 */
export function getWordCountStatus(current: number, target: number): {
  status: 'under' | 'at' | 'over';
  percentage: number;
  message: string;
} {
  const percentage = Math.round((current / target) * 100);
  
  if (current < target * 0.8) {
    return {
      status: 'under',
      percentage,
      message: `${target - current} words to reach target`
    };
  } else if (current <= target) {
    return {
      status: 'at',
      percentage,
      message: 'On track for target'
    };
  } else {
    return {
      status: 'over',
      percentage,
      message: `${current - target} words over target`
    };
  }
}

