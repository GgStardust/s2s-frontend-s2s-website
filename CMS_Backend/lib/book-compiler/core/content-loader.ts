/**
 * Content Loader Module
 * 
 * Loads content files from the content library and extracts inline tags.
 */

import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import type { ContentFile, TagExtractionResult } from '../types.js';

/**
 * Extract inline tags from content
 * Preserves exact tag syntax (@orb_1, @scrollstream, etc.)
 */
export function extractInlineTags(content: string): TagExtractionResult {
  const allTags: string[] = [];
  const orbTags: number[] = [];
  
  // Extract @orb tags (preserve exact syntax)
  const orbMatches = content.matchAll(/@orb[_\s]*(\d+)/gi);
  for (const match of orbMatches) {
    const orbNum = parseInt(match[1]);
    if (orbNum >= 1 && orbNum <= 13) {
      orbTags.push(orbNum);
      // Preserve original tag format
      const originalTag = match[0];
      if (!allTags.includes(originalTag)) {
        allTags.push(originalTag);
      }
    }
  }
  
  // Extract @scrollstream tags (preserve exact syntax)
  const scrollMatches = content.matchAll(/@scrollstream[:\s]*([^\n@]*)/gi);
  for (const match of scrollMatches) {
    const originalTag = match[0];
    if (!allTags.includes(originalTag)) {
      allTags.push(originalTag);
    }
  }
  
  // Extract other @tags (preserve exact syntax)
  const tagMatches = content.matchAll(/@([a-z_]+)/gi);
  for (const match of tagMatches) {
    const originalTag = match[0];
    if (!allTags.includes(originalTag) && !originalTag.startsWith('@orb') && !originalTag.startsWith('@scrollstream')) {
      allTags.push(originalTag);
    }
  }
  
  return {
    allTags: Array.from(new Set(allTags)),
    orbTags: Array.from(new Set(orbTags)).sort((a, b) => a - b)
  };
}

/**
 * Create default YAML metadata for files without frontmatter
 */
function createDefaultYAML(filename: string, content: string): any {
  // Extract title from first H1 if available
  const h1Match = content.match(/^#\s+(.+)$/m);
  const title = h1Match ? h1Match[1].trim() : filename.replace('.md', '').replace(/_/g, ' ');
  
  // Determine type based on directory or content
  let type = 'essay';
  if (filename.includes('orb_')) {
    type = 'essay';
  } else if (filename.includes('foundation') || filename.includes('philosophical')) {
    type = 'essay';
  }
  
  return {
    title,
    type,
    category: 'foundational',
    status: 'canonical',
    // Mark as usable in book compiler by default
    use_in_book_compiler: true,
  };
}

/**
 * Load a single markdown file, handling both YAML and non-YAML files
 */
function loadMarkdownFile(
  filePath: string,
  relativePath: string,
  filename: string
): ContentFile | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    
    // If no YAML frontmatter, create default
    const hasYAML = Object.keys(parsed.data).length > 0;
    const yaml = hasYAML ? parsed.data : createDefaultYAML(filename, parsed.content);
    
    // Ensure type is set (required for filtering)
    if (!yaml.type) {
      yaml.type = 'essay';
    }
    
    // Extract tags from content
    const tags = extractInlineTags(parsed.content);
    
    // Extract title from YAML or content
    const title = yaml.title || 
                  parsed.content.match(/^#\s+(.+)$/m)?.[1]?.trim() || 
                  filename.replace('.md', '').replace(/_/g, ' ');
    
    return {
      file_path: relativePath,
      title,
      yaml,
      content: parsed.content,
      inline_tags: tags.allTags,
      orb_tags: tags.orbTags
    };
  } catch (error) {
    console.warn(`Warning: Failed to load ${filename}:`, error);
    return null;
  }
}

/**
 * Load content files from specified directories
 * 
 * Supports:
 * - Files with YAML frontmatter (standard)
 * - Files without YAML (creates default metadata)
 * - Multiple source directories
 */
export function loadContentFiles(options?: {
  contentBasePath?: string;
  orbEssaysPath?: string;
  codexEssaysPath?: string;
  systemEssaysPath?: string;
}): ContentFile[] {
  const files: ContentFile[] = [];
  
  // Default paths (relative to CMS_Backend root)
  const contentBase = options?.contentBasePath || path.join(process.cwd(), '09_PROCESSED');
  const orbEssaysDir = options?.orbEssaysPath || path.join(contentBase, '02d_Orb_Essays');
  const codexEssaysDir = options?.codexEssaysPath || path.join(contentBase, '02f_S2S_codex_essays');
  const systemEssaysDir = options?.systemEssaysPath || path.join(contentBase, '02a_System_essays');
  
  // Load Orb Essays
  if (fs.existsSync(orbEssaysDir)) {
    const orbFiles = fs.readdirSync(orbEssaysDir).filter(f => f.endsWith('.md'));
    orbFiles.forEach(filename => {
      const filePath = path.join(orbEssaysDir, filename);
      const relativePath = `02d_Orb_Essays/${filename}`;
      const file = loadMarkdownFile(filePath, relativePath, filename);
      if (file) files.push(file);
    });
  }
  
  // Load Codex Essays
  if (fs.existsSync(codexEssaysDir)) {
    const codexFiles = fs.readdirSync(codexEssaysDir).filter(f => f.endsWith('.md'));
    codexFiles.forEach(filename => {
      const filePath = path.join(codexEssaysDir, filename);
      const relativePath = `02f_S2S_codex_essays/${filename}`;
      const file = loadMarkdownFile(filePath, relativePath, filename);
      if (file) files.push(file);
    });
  }
  
  // Load System Essays (philosophical foundation, etc.)
  if (fs.existsSync(systemEssaysDir)) {
    const systemFiles = fs.readdirSync(systemEssaysDir).filter(f => f.endsWith('.md'));
    systemFiles.forEach(filename => {
      const filePath = path.join(systemEssaysDir, filename);
      const relativePath = `02a_System_essays/${filename}`;
      const file = loadMarkdownFile(filePath, relativePath, filename);
      if (file) {
        // Ensure system essays are marked as usable
        if (!file.yaml.use_in_book_compiler) {
          file.yaml.use_in_book_compiler = true;
        }
        files.push(file);
      }
    });
  }
  
  return files;
}

