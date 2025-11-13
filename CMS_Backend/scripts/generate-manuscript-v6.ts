#!/usr/bin/env tsx
/**
 * Manuscript V6 Draft Generator
 * 
 * Generates an alternate version of the manuscript (V6) by:
 * 1. Using V5 as the base structure
 * 2. Intelligently inserting safe, high-scoring content recommendations
 * 3. Maintaining narrative flow and chapter structure
 * 4. Generating comparison report
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MANUSCRIPT_V5 = path.join(__dirname, '../../RBI_Editorial_Tools/S2S_Manuscript_V5.md');
const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const ORB_ESSAYS_DIR = path.join(CONTENT_BASE, '02d_Orb_Essays');
const CODEX_ESSAYS_DIR = path.join(CONTENT_BASE, '02f_S2S_codex_essays');
const OUTPUT_V6 = path.join(__dirname, '../../RBI_Editorial_Tools/S2S_Manuscript_V6_DRAFT.md');
const OUTPUT_COMPARISON = path.join(__dirname, '../MANUSCRIPT_V5_V6_COMPARISON.md');

// Import types and functions from cohesion analysis
interface ContentFile {
  file_path: string;
  title: string;
  yaml: any;
  content: string;
  inline_tags: string[];
  orb_tags: number[];
  word_count: number;
  content_fingerprint: string;
}

interface ChapterInfo {
  chapter_number?: number;
  title: string;
  content: string;
  type: 'chapter' | 'interlude' | 'front_matter' | 'back_matter';
  part?: string;
  word_count: number;
  orb_tags: number[];
  inline_tags: string[];
  content_fingerprint: string;
  key_terms: string[];
  original_start_line?: number;
  original_end_line?: number;
}

interface ContentInsertion {
  content_file: ContentFile;
  chapter: ChapterInfo;
  insertion_point: 'beginning' | 'middle' | 'end';
  score: number;
  reason: string;
  excerpt_preview: string;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractKeyTerms(content: string, maxTerms: number = 30): string[] {
  const normalized = normalizeText(content);
  const commonWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 
    'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'this', 'that', 'with', 'from',
    'when', 'where', 'what', 'which', 'they', 'them', 'their', 'there', 'these', 'those', 'been', 'have', 'will', 'would'
  ]);
  
  const words = normalized.split(/\s+/)
    .filter(w => w.length > 4 && !commonWords.has(w));
  
  const freq = new Map<string, number>();
  words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1));
  
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTerms)
    .map(([word]) => word);
}

function extractInlineTags(content: string): { allTags: string[]; orbTags: number[] } {
  const allTags: string[] = [];
  const orbTags: number[] = [];
  
  const orbMatches = content.matchAll(/@orb[_\s]*(\d+)/gi);
  for (const match of orbMatches) {
    const orbNum = parseInt(match[1]);
    if (orbNum >= 1 && orbNum <= 13) {
      orbTags.push(orbNum);
      const originalTag = match[0];
      if (!allTags.includes(originalTag)) {
        allTags.push(originalTag);
      }
    }
  }
  
  const scrollMatches = content.matchAll(/@scrollstream[:\s]*([^\n@]*)/gi);
  for (const match of scrollMatches) {
    const originalTag = match[0];
    if (!allTags.includes(originalTag)) {
      allTags.push(originalTag);
    }
  }
  
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

function parseManuscriptV5(): { chapters: ChapterInfo[]; originalContent: string } {
  console.log('📖 Parsing Manuscript V5...\n');
  
  if (!fs.existsSync(MANUSCRIPT_V5)) {
    console.error(`❌ Manuscript V5 not found at: ${MANUSCRIPT_V5}`);
    process.exit(1);
  }
  
  const originalContent = fs.readFileSync(MANUSCRIPT_V5, 'utf-8');
  const lines = originalContent.split('\n');
  const chapters: ChapterInfo[] = [];
  
  let currentChapter: ChapterInfo | null = null;
  let currentContent: string[] = [];
  let currentPart: string | undefined;
  let startLine = 0;
  
  const patterns = {
    part: /^###?\s*\*\*PART\s+(\d+):\s*(.+?)\*\*/i,
    chapter: /^#+\s*Chapter\s+(\d+):\s*(.+?)$/i,
    interlude: /^#+\s*Interlude:\s*(.+?)$/i,
    front_matter: /^#+\s*(Series Note|Prologue|Introduction|Entering the Field)/i,
    back_matter: /^#+\s*(Conclusion|Afterword|Epilogue|APPENDIX [A-Z]|Appendix [A-Z])/i,
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const partMatch = line.match(patterns.part);
    if (partMatch) {
      currentPart = `Part ${partMatch[1]}: ${partMatch[2]}`;
      continue;
    }
    
    const chapterMatch = line.match(patterns.chapter);
    if (chapterMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        currentChapter.content_fingerprint = normalizeText(currentChapter.content);
        currentChapter.key_terms = extractKeyTerms(currentChapter.content);
        currentChapter.original_end_line = i - 1;
        chapters.push(currentChapter);
      }
      
      startLine = i;
      currentChapter = {
        chapter_number: parseInt(chapterMatch[1]),
        title: `Chapter ${chapterMatch[1]}: ${chapterMatch[2]}`,
        content: '',
        type: 'chapter',
        part: currentPart,
        word_count: 0,
        orb_tags: [],
        inline_tags: [],
        content_fingerprint: '',
        key_terms: [],
        original_start_line: startLine
      };
      currentContent = [];
      continue;
    }
    
    const interludeMatch = line.match(patterns.interlude);
    if (interludeMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        currentChapter.content_fingerprint = normalizeText(currentChapter.content);
        currentChapter.key_terms = extractKeyTerms(currentChapter.content);
        currentChapter.original_end_line = i - 1;
        chapters.push(currentChapter);
      }
      
      startLine = i;
      currentChapter = {
        title: `Interlude: ${interludeMatch[1]}`,
        content: '',
        type: 'interlude',
        part: currentPart,
        word_count: 0,
        orb_tags: [],
        inline_tags: [],
        content_fingerprint: '',
        key_terms: [],
        original_start_line: startLine
      };
      currentContent = [];
      continue;
    }
    
    const frontMatch = line.match(patterns.front_matter);
    if (frontMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        currentChapter.content_fingerprint = normalizeText(currentChapter.content);
        currentChapter.key_terms = extractKeyTerms(currentChapter.content);
        currentChapter.original_end_line = i - 1;
        chapters.push(currentChapter);
      }
      
      startLine = i;
      currentChapter = {
        title: frontMatch[1],
        content: '',
        type: 'front_matter',
        word_count: 0,
        orb_tags: [],
        inline_tags: [],
        content_fingerprint: '',
        key_terms: [],
        original_start_line: startLine
      };
      currentContent = [];
      continue;
    }
    
    const backMatch = line.match(patterns.back_matter);
    if (backMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        currentChapter.content_fingerprint = normalizeText(currentChapter.content);
        currentChapter.key_terms = extractKeyTerms(currentChapter.content);
        currentChapter.original_end_line = i - 1;
        chapters.push(currentChapter);
      }
      
      startLine = i;
      currentChapter = {
        title: backMatch[1],
        content: '',
        type: 'back_matter',
        word_count: 0,
        orb_tags: [],
        inline_tags: [],
        content_fingerprint: '',
        key_terms: [],
        original_start_line: startLine
      };
      currentContent = [];
      continue;
    }
    
    if (currentChapter) {
      currentContent.push(line);
    }
  }
  
  if (currentChapter) {
    currentChapter.content = currentContent.join('\n');
    const tags = extractInlineTags(currentChapter.content);
    currentChapter.inline_tags = tags.allTags;
    currentChapter.orb_tags = tags.orbTags;
    currentChapter.word_count = currentChapter.content.split(/\s+/).length;
    currentChapter.content_fingerprint = normalizeText(currentChapter.content);
    currentChapter.key_terms = extractKeyTerms(currentChapter.content);
    currentChapter.original_end_line = lines.length - 1;
    chapters.push(currentChapter);
  }
  
  console.log(`✅ Parsed ${chapters.length} sections from manuscript\n`);
  return { chapters, originalContent };
}

function loadContentLibrary(): ContentFile[] {
  console.log('📚 Loading content library...\n');
  const files: ContentFile[] = [];
  
  const loadDir = (dir: string, prefix: string) => {
    if (!fs.existsSync(dir)) return;
    const mdFiles = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    mdFiles.forEach(filename => {
      const filePath = path.join(dir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      const tags = extractInlineTags(parsed.content);
      const normalized = normalizeText(parsed.content);
      
      files.push({
        file_path: `${prefix}/${filename}`,
        title: parsed.data.title || filename.replace('.md', ''),
        yaml: parsed.data,
        content: parsed.content,
        inline_tags: tags.allTags,
        orb_tags: tags.orbTags,
        word_count: parsed.content.split(/\s+/).length,
        content_fingerprint: normalized
      });
    });
  };
  
  loadDir(ORB_ESSAYS_DIR, '02d_Orb_Essays');
  loadDir(CODEX_ESSAYS_DIR, '02f_S2S_codex_essays');
  
  console.log(`✅ Loaded ${files.length} content files from library\n`);
  return files;
}

function calculateSimilarity(text1: string, text2: string): number {
  const norm1 = normalizeText(text1);
  const norm2 = normalizeText(text2);
  
  if (norm1.length === 0 || norm2.length === 0) return 0;
  
  const terms1 = new Set(extractKeyTerms(norm1, 50));
  const terms2 = new Set(extractKeyTerms(norm2, 50));
  
  const intersection = new Set([...terms1].filter(x => terms2.has(x)));
  const union = new Set([...terms1, ...terms2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

function checkDuplicationRisk(contentFile: ContentFile, allChapters: ChapterInfo[]): 'none' | 'low' | 'medium' | 'high' {
  let maxSimilarity = 0;
  
  for (const chapter of allChapters) {
    if (chapter.type === 'front_matter' || chapter.type === 'back_matter') continue;
    
    const similarity = calculateSimilarity(contentFile.content, chapter.content);
    maxSimilarity = Math.max(maxSimilarity, similarity);
  }
  
  if (maxSimilarity > 0.7) return 'high';
  if (maxSimilarity > 0.5) return 'medium';
  if (maxSimilarity > 0.3) return 'low';
  return 'none';
}

function scoreContentMatch(contentFile: ContentFile, chapter: ChapterInfo): { score: number; reasons: string[]; match_type: 'metadata' | 'rbi' | 'orbital' | 'semantic' } {
  let score = 0;
  const reasons: string[] = [];
  let matchType: 'metadata' | 'rbi' | 'orbital' | 'semantic' = 'semantic';
  
  const bookThreading = typeof contentFile.yaml.book_threading === 'string' 
    ? contentFile.yaml.book_threading 
    : '';
  if (bookThreading && (bookThreading.includes('Stardust to Sovereignty') || 
      bookThreading.includes('Book : Stardust to Sovereignty') ||
      bookThreading.includes('Book 1'))) {
    score += 15;
    reasons.push('✅ Book threading match');
    matchType = 'metadata';
  }
  
  const fieldFunction = contentFile.yaml.field_function || {};
  const contentPurpose = (fieldFunction.content_purpose || '').toLowerCase();
  const chapterText = `${chapter.title} ${chapter.content.substring(0, 500)}`.toLowerCase();
  
  const chapterWords = chapterText.split(/\s+/).filter(w => w.length > 4);
  const purposeWords = contentPurpose.split(/\s+/).filter(w => w.length > 4);
  const matchingWords = purposeWords.filter(pw => 
    chapterWords.some(cw => cw.includes(pw) || pw.includes(cw))
  );
  
  if (matchingWords.length > 0) {
    score += matchingWords.length * 3;
    reasons.push(`✅ Content purpose match (${matchingWords.length} keywords)`);
    matchType = 'metadata';
  }
  
  const chapterOrbs = chapter.orb_tags;
  const fileOrbs = contentFile.orb_tags;
  const matchingOrbs = chapterOrbs.filter(co => fileOrbs.includes(co));
  
  if (matchingOrbs.length > 0) {
    score += matchingOrbs.length * 5;
    reasons.push(`✅ Orb association match (Orbs: ${matchingOrbs.join(', ')})`);
    matchType = 'orbital';
  }
  
  const integrationPoints = Array.isArray(contentFile.yaml.integration_points) 
    ? contentFile.yaml.integration_points 
    : (contentFile.yaml.integration_points ? [contentFile.yaml.integration_points] : []);
  if (integrationPoints.includes('Book Compiler') || integrationPoints.includes('book_fragments')) {
    score += 8;
    reasons.push('✅ Book Compiler integration point');
    matchType = 'metadata';
  }
  
  const fileTerms = new Set(extractKeyTerms(contentFile.content, 30));
  const chapterTerms = new Set(chapter.key_terms);
  const termOverlap = [...fileTerms].filter(t => chapterTerms.has(t)).length;
  if (termOverlap > 5) {
    score += Math.min(termOverlap, 10);
    reasons.push(`✅ Key term overlap (${termOverlap} terms)`);
    matchType = 'semantic';
  }
  
  return { score, reasons, match_type: matchType };
}

function determineInsertionPoint(contentFile: ContentFile, chapter: ChapterInfo): 'beginning' | 'middle' | 'end' {
  // For foundational content or Orb essays, prefer beginning
  if (contentFile.yaml.type === 'orb_essay' || contentFile.file_path.includes('Orb_Essays')) {
    return 'beginning';
  }
  
  // For content that extends or deepens, prefer end
  const fieldFunction = contentFile.yaml.field_function || {};
  const contentPurpose = (fieldFunction.content_purpose || '').toLowerCase();
  if (contentPurpose.includes('extends') || contentPurpose.includes('deepens') || 
      contentPurpose.includes('application') || contentPurpose.includes('practice')) {
    return 'end';
  }
  
  // Default to middle for most content
  return 'middle';
}

function selectContentForV6(chapters: ChapterInfo[], allContent: ContentFile[]): ContentInsertion[] {
  console.log('🎯 Selecting content for V6...\n');
  
  const insertions: ContentInsertion[] = [];
  const usedContent = new Set<string>();
  const maxInsertionsPerChapter = 2; // Limit to maintain flow
  
  const narrativeChapters = chapters.filter(c => c.type === 'chapter' || c.type === 'interlude');
  
  for (const chapter of narrativeChapters) {
    // Find all potential matches
    const matches = allContent
      .filter(file => !usedContent.has(file.file_path))
      .map(file => {
        const match = scoreContentMatch(file, chapter);
        const duplication = checkDuplicationRisk(file, chapters);
        const insertionPoint = determineInsertionPoint(file, chapter);
        
        // Only include safe, high-scoring content
        const isSafe = duplication === 'none' || 
                      (duplication === 'low' && match.score >= 15);
        
        return {
          content_file: file,
          ...match,
          duplication_risk: duplication,
          insertion_point: insertionPoint,
          safe: isSafe
        };
      })
      .filter(m => m.safe && m.score >= 15)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxInsertionsPerChapter);
    
    // Add top matches as insertions
    for (const match of matches) {
      const excerpt = match.content_file.content.substring(0, 200).replace(/\n/g, ' ');
      insertions.push({
        content_file: match.content_file,
        chapter,
        insertion_point: match.insertion_point,
        score: match.score,
        reason: match.reasons[0] || 'High relevance score',
        excerpt_preview: excerpt + '...'
      });
      usedContent.add(match.content_file.file_path);
    }
  }
  
  console.log(`✅ Selected ${insertions.length} content insertions for V6\n`);
  return insertions;
}

function generateV6Manuscript(
  originalChapters: ChapterInfo[],
  insertions: ContentInsertion[]
): string {
  console.log('📝 Generating V6 manuscript...\n');
  
  const lines: string[] = [];
  
  // Group insertions by chapter
  const insertionsByChapter = new Map<string, ContentInsertion[]>();
  for (const insertion of insertions) {
    const key = insertion.chapter.title;
    if (!insertionsByChapter.has(key)) {
      insertionsByChapter.set(key, []);
    }
    insertionsByChapter.get(key)!.push(insertion);
  }
  
  // Build V6 from V5 structure
  for (const chapter of originalChapters) {
    // Add chapter header
    if (chapter.type === 'chapter') {
      lines.push(`# ${chapter.title}`);
    } else if (chapter.type === 'interlude') {
      lines.push(`# ${chapter.title}`);
    } else {
      lines.push(`# ${chapter.title}`);
    }
    lines.push('');
    
    // Get insertions for this chapter
    const chapterInsertions = insertionsByChapter.get(chapter.title) || [];
    const beginningInserts = chapterInsertions.filter(i => i.insertion_point === 'beginning');
    const middleInserts = chapterInsertions.filter(i => i.insertion_point === 'middle');
    const endInserts = chapterInsertions.filter(i => i.insertion_point === 'end');
    
    // Add beginning insertions
    for (const insertion of beginningInserts) {
      lines.push(`<!-- V6 Addition: ${insertion.content_file.title} (Score: ${insertion.score}) -->`);
      lines.push(`<!-- Reason: ${insertion.reason} -->`);
      lines.push('');
      lines.push(insertion.content_file.content);
      lines.push('');
      lines.push('---');
      lines.push('');
    }
    
    // Add original chapter content
    const chapterLines = chapter.content.split('\n');
    const middleInsertIndex = Math.floor(chapterLines.length / 2);
    
    for (let i = 0; i < chapterLines.length; i++) {
      lines.push(chapterLines[i]);
      
      // Insert middle content at midpoint
      if (i === middleInsertIndex && middleInserts.length > 0) {
        for (const insertion of middleInserts) {
          lines.push('');
          lines.push(`<!-- V6 Addition: ${insertion.content_file.title} (Score: ${insertion.score}) -->`);
          lines.push(`<!-- Reason: ${insertion.reason} -->`);
          lines.push('');
          lines.push(insertion.content_file.content);
          lines.push('');
          lines.push('---');
          lines.push('');
        }
      }
    }
    
    // Add end insertions
    for (const insertion of endInserts) {
      lines.push('');
      lines.push(`<!-- V6 Addition: ${insertion.content_file.title} (Score: ${insertion.score}) -->`);
      lines.push(`<!-- Reason: ${insertion.reason} -->`);
      lines.push('');
      lines.push(insertion.content_file.content);
      lines.push('');
      lines.push('---');
      lines.push('');
    }
    
    lines.push('');
    lines.push('');
  }
  
  return lines.join('\n');
}

function generateComparisonReport(
  v5Chapters: ChapterInfo[],
  insertions: ContentInsertion[]
): string {
  const lines: string[] = [];
  
  lines.push('# Manuscript V5 → V6 Comparison Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  
  lines.push('## Executive Summary\n');
  lines.push(`- **Total Chapters:** ${v5Chapters.filter(c => c.type === 'chapter' || c.type === 'interlude').length}`);
  lines.push(`- **Content Additions:** ${insertions.length}`);
  lines.push(`- **Average Additions per Chapter:** ${(insertions.length / v5Chapters.filter(c => c.type === 'chapter' || c.type === 'interlude').length).toFixed(1)}\n`);
  
  lines.push('## Content Additions by Chapter\n');
  
  const insertionsByChapter = new Map<string, ContentInsertion[]>();
  for (const insertion of insertions) {
    const key = insertion.chapter.title;
    if (!insertionsByChapter.has(key)) {
      insertionsByChapter.set(key, []);
    }
    insertionsByChapter.get(key)!.push(insertion);
  }
  
  for (const chapter of v5Chapters.filter(c => c.type === 'chapter' || c.type === 'interlude')) {
    const chapterInsertions = insertionsByChapter.get(chapter.title) || [];
    if (chapterInsertions.length === 0) continue;
    
    lines.push(`### ${chapter.title}`);
    lines.push(`**Original Word Count:** ${chapter.word_count.toLocaleString()}`);
    lines.push(`**Additions:** ${chapterInsertions.length}\n`);
    
    chapterInsertions.forEach((insertion, i) => {
      lines.push(`${i + 1}. **${insertion.content_file.title}** (Score: ${insertion.score})`);
      lines.push(`   - Path: ${insertion.content_file.file_path}`);
      lines.push(`   - Word Count: ${insertion.content_file.word_count.toLocaleString()}`);
      lines.push(`   - Insertion Point: ${insertion.insertion_point}`);
      lines.push(`   - Reason: ${insertion.reason}`);
      lines.push(`   - Preview: ${insertion.excerpt_preview}`);
      lines.push('');
    });
    
    lines.push('---\n');
  }
  
  return lines.join('\n');
}

async function main() {
  console.log('📚 Manuscript V6 Draft Generator');
  console.log('='.repeat(70));
  console.log('Generating alternate version with safe content additions\n');
  console.log('='.repeat(70) + '\n');
  
  const { chapters, originalContent } = parseManuscriptV5();
  const allContent = loadContentLibrary();
  const insertions = selectContentForV6(chapters, allContent);
  
  const v6Content = generateV6Manuscript(chapters, insertions);
  fs.writeFileSync(OUTPUT_V6, v6Content, 'utf-8');
  
  const comparison = generateComparisonReport(chapters, insertions);
  fs.writeFileSync(OUTPUT_COMPARISON, comparison, 'utf-8');
  
  console.log(`✅ V6 draft generated!`);
  console.log(`📄 V6 Draft: ${OUTPUT_V6}`);
  console.log(`📊 Comparison Report: ${OUTPUT_COMPARISON}\n`);
  
  console.log('Summary:');
  console.log(`  - Chapters processed: ${chapters.filter(c => c.type === 'chapter' || c.type === 'interlude').length}`);
  console.log(`  - Content additions: ${insertions.length}`);
  console.log(`  - Average per chapter: ${(insertions.length / chapters.filter(c => c.type === 'chapter' || c.type === 'interlude').length).toFixed(1)}\n`);
}

main()
  .then(() => {
    console.log('✅ V6 generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  });

