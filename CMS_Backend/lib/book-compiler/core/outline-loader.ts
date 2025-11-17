/**
 * Outline Loader - Flexible Input Modes for Book Outlines
 * 
 * Supports multiple input modes to accommodate different book structures:
 * - Database: Load from Supabase chapters table
 * - Markdown: Parse from markdown outline file
 * - Direct: Pass ChapterOutline[] array directly
 * - JSON/YAML: Load from structured file
 */

import { ChapterOutline } from '../types';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import yaml from 'js-yaml';

export type OutlineInputMode = 
  | { mode: 'database'; book_id: string }
  | { mode: 'markdown'; file_path: string }
  | { mode: 'direct'; chapters: ChapterOutline[] }
  | { mode: 'json'; file_path: string }
  | { mode: 'yaml'; file_path: string };

export interface OutlineLoaderConfig {
  input: OutlineInputMode;
  supabaseUrl?: string;
  supabaseKey?: string;
}

/**
 * Load book outline from various input sources
 */
export async function loadBookOutline(
  config: OutlineLoaderConfig
): Promise<ChapterOutline[]> {
  switch (config.input.mode) {
    case 'database':
      return await loadFromDatabase(config);
    
    case 'markdown':
      return await loadFromMarkdown(config.input.file_path);
    
    case 'direct':
      return config.input.chapters;
    
    case 'json':
      return await loadFromJSON(config.input.file_path);
    
    case 'yaml':
      return await loadFromYAML(config.input.file_path);
    
    default:
      throw new Error(`Unsupported outline input mode: ${(config.input as any).mode}`);
  }
}

/**
 * Load outline from Supabase chapters table
 */
async function loadFromDatabase(
  config: OutlineLoaderConfig
): Promise<ChapterOutline[]> {
  if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error('Supabase URL and key required for database mode');
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseKey);
  const bookId = (config.input as Extract<OutlineInputMode, { mode: 'database' }>).book_id;

  const { data: chapters, error } = await supabase
    .from('chapters')
    .select('id, chapter_number, title, part_number, part_title, orb_focus, notes')
    .eq('book_id', bookId)
    .order('chapter_number', { ascending: true });

  if (error) {
    throw new Error(`Failed to load chapters from database: ${error.message}`);
  }

  if (!chapters || chapters.length === 0) {
    throw new Error(`No chapters found for book_id: ${bookId}`);
  }

  return chapters.map(ch => ({
    chapter_number: ch.chapter_number,
    title: ch.title,
    description: ch.notes || undefined,
    orb_focus: ch.orb_focus ? parseInt(ch.orb_focus.toString()) : undefined,
    // Store additional metadata for reference
    part_number: ch.part_number || undefined,
    part_title: ch.part_title || undefined,
  } as ChapterOutline & { part_number?: number; part_title?: string }));
}

/**
 * Parse outline from markdown file
 * Supports formats like COMPLETE_BOOK_OUTLINE_AND_OVERVIEW.md
 */
async function loadFromMarkdown(filePath: string): Promise<ChapterOutline[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const chapters: ChapterOutline[] = [];

  // Extract YAML frontmatter if present
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  let metadata: any = {};
  let body = content;

  if (frontmatterMatch) {
    try {
      metadata = yaml.load(frontmatterMatch[1]) || {};
      body = content.slice(frontmatterMatch[0].length);
    } catch (e) {
      console.warn('Failed to parse YAML frontmatter, continuing without it');
    }
  }

  // Parse chapter structure
  // Look for patterns like:
  // ### **Chapter N: Title** @orbX
  // **Orb Focus:** ...
  const chapterPattern = /###\s*\*\*Chapter\s+(\d+):\s*([^*]+)\*\*(?:\s*@(\w+))?/gi;
  const partPattern = /##\s*\*\*PART\s+(\d+):\s*([^*]+)\*\*/gi;

  let currentPart = 0;
  let chapterNumber = 0;
  let match;

  // First pass: identify parts
  const parts: Array<{ number: number; title: string; startIndex: number }> = [];
  while ((match = partPattern.exec(body)) !== null) {
    parts.push({
      number: parseInt(match[1]),
      title: match[2].trim(),
      startIndex: match.index,
    });
  }

  // Second pass: extract chapters
  while ((match = chapterPattern.exec(body)) !== null) {
    chapterNumber = parseInt(match[1]);
    const title = match[2].trim();
    const orbTag = match[3];

    // Find which part this chapter belongs to
    const part = parts
      .filter(p => p.startIndex < match!.index)
      .sort((a, b) => b.startIndex - a.startIndex)[0];

    // Extract Orb focus from the chapter section
    const chapterSection = body.slice(
      match.index,
      body.indexOf('###', match.index + 1) !== -1
        ? body.indexOf('###', match.index + 1)
        : body.length
    );

    const orbFocusMatch = chapterSection.match(/\*\*Orb Focus:\*\*\s*[^\n]*Orb\s+(\d+)/i);
    const orbFocus = orbFocusMatch
      ? parseInt(orbFocusMatch[1])
      : orbTag
      ? parseInt(orbTag.replace(/\D/g, ''))
      : undefined;

    // Extract description from Content section
    const contentMatch = chapterSection.match(/\*\*Content:\*\*\s*\n([\s\S]*?)(?=\*\*Source Files:\*\*|\*\*Scrollstreams:\*\*|$)/i);
    const description = contentMatch
      ? contentMatch[1]
          .trim()
          .split('\n')
          .map(line => line.replace(/^-\s*/, '').trim())
          .filter(line => line.length > 0)
          .join(' ')
      : undefined;

    chapters.push({
      chapter_number: chapterNumber,
      title,
      description,
      orb_focus: orbFocus,
    });
  }

  // If no chapters found with the pattern, try simpler format
  if (chapters.length === 0) {
    // Fallback: look for numbered list items or headers
    const simplePattern = /(?:^|\n)(?:###?\s+)?(?:Chapter\s+)?(\d+)[:\.]\s*([^\n]+)/gi;
    while ((match = simplePattern.exec(body)) !== null) {
      chapters.push({
        chapter_number: parseInt(match[1]),
        title: match[2].trim(),
      });
    }
  }

  if (chapters.length === 0) {
    throw new Error(`No chapters found in markdown file: ${filePath}`);
  }

  return chapters.sort((a, b) => a.chapter_number - b.chapter_number);
}

/**
 * Load outline from JSON file
 */
async function loadFromJSON(filePath: string): Promise<ChapterOutline[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(content);

  // Support multiple JSON formats
  if (Array.isArray(data)) {
    return data as ChapterOutline[];
  }

  if (data.chapters && Array.isArray(data.chapters)) {
    return data.chapters as ChapterOutline[];
  }

  if (data.outline && Array.isArray(data.outline)) {
    return data.outline as ChapterOutline[];
  }

  throw new Error(`Invalid JSON format in ${filePath}. Expected array or object with 'chapters' or 'outline' property.`);
}

/**
 * Load outline from YAML file
 */
async function loadFromYAML(filePath: string): Promise<ChapterOutline[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const data = yaml.load(content) as any;

  if (!data) {
    throw new Error(`Empty YAML file: ${filePath}`);
  }

  // Support multiple YAML formats
  if (Array.isArray(data)) {
    return data as ChapterOutline[];
  }

  if (data.chapters && Array.isArray(data.chapters)) {
    return data.chapters as ChapterOutline[];
  }

  if (data.outline && Array.isArray(data.outline)) {
    return data.outline as ChapterOutline[];
  }

  throw new Error(`Invalid YAML format in ${filePath}. Expected array or object with 'chapters' or 'outline' property.`);
}

/**
 * Helper: Create outline loader config from environment or defaults
 */
export function createOutlineConfig(
  input: OutlineInputMode,
  options?: {
    supabaseUrl?: string;
    supabaseKey?: string;
  }
): OutlineLoaderConfig {
  return {
    input,
    supabaseUrl: options?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: options?.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

