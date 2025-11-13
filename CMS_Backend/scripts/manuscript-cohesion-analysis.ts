#!/usr/bin/env tsx
/**
 * Enhanced Manuscript Cohesion Analysis
 * 
 * Analyzes manuscript V5 with:
 * 1. Cross-chapter duplication detection
 * 2. Through-line/narrative flow analysis
 * 3. Safe content recommendations (no duplication)
 * 4. Alternate version (V6) generation capability
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
const OUTPUT_REPORT = path.join(__dirname, '../MANUSCRIPT_COHESION_ANALYSIS_REPORT.md');
const OUTPUT_V6_DRAFT = path.join(__dirname, '../MANUSCRIPT_V6_DRAFT.md');

interface ContentFile {
  file_path: string;
  title: string;
  yaml: any;
  content: string;
  inline_tags: string[];
  orb_tags: number[];
  word_count: number;
  content_fingerprint: string; // Normalized content signature
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
}

interface ContentMatch {
  content_file: ContentFile;
  score: number;
  reasons: string[];
  match_type: 'metadata' | 'rbi' | 'orbital' | 'semantic';
  duplication_risk: 'none' | 'low' | 'medium' | 'high';
  cohesion_impact: 'enhances' | 'neutral' | 'disrupts';
  safe_to_add: boolean;
}

interface CohesionAnalysis {
  chapter: ChapterInfo;
  currently_used: ContentFile[];
  safe_recommendations: ContentMatch[];
  unsafe_recommendations: ContentMatch[];
  duplication_warnings: Array<{
    content: ContentFile;
    appears_in: string[];
    similarity: number;
  }>;
  narrative_position: number;
  flow_score: number;
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
  
  // Count frequency
  const freq = new Map<string, number>();
  words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1));
  
  // Sort by frequency and return top terms
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTerms)
    .map(([word]) => word);
}

function calculateSimilarity(text1: string, text2: string): number {
  const norm1 = normalizeText(text1);
  const norm2 = normalizeText(text2);
  
  if (norm1.length === 0 || norm2.length === 0) return 0;
  
  // Extract key terms from both
  const terms1 = new Set(extractKeyTerms(norm1, 50));
  const terms2 = new Set(extractKeyTerms(norm2, 50));
  
  // Calculate Jaccard similarity
  const intersection = new Set([...terms1].filter(x => terms2.has(x)));
  const union = new Set([...terms1, ...terms2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
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

function parseManuscriptV5(): ChapterInfo[] {
  console.log('📖 Parsing Manuscript V5...\n');
  
  if (!fs.existsSync(MANUSCRIPT_V5)) {
    console.error(`❌ Manuscript V5 not found at: ${MANUSCRIPT_V5}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(MANUSCRIPT_V5, 'utf-8');
  const lines = content.split('\n');
  const chapters: ChapterInfo[] = [];
  
  let currentChapter: ChapterInfo | null = null;
  let currentContent: string[] = [];
  let currentPart: string | undefined;
  
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
        chapters.push(currentChapter);
      }
      
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
        key_terms: []
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
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: `Interlude: ${interludeMatch[1]}`,
        content: '',
        type: 'interlude',
        part: currentPart,
        word_count: 0,
        orb_tags: [],
        inline_tags: [],
        content_fingerprint: '',
        key_terms: []
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
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: frontMatch[1],
        content: '',
        type: 'front_matter',
        word_count: 0,
        orb_tags: [],
        inline_tags: [],
        content_fingerprint: '',
        key_terms: []
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
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: backMatch[1],
        content: '',
        type: 'back_matter',
        word_count: 0,
        orb_tags: [],
        inline_tags: [],
        content_fingerprint: '',
        key_terms: []
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
    chapters.push(currentChapter);
  }
  
  console.log(`✅ Parsed ${chapters.length} sections from manuscript\n`);
  return chapters;
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

function checkDuplicationRisk(
  contentFile: ContentFile,
  allChapters: ChapterInfo[]
): { risk: 'none' | 'low' | 'medium' | 'high'; appears_in: string[]; max_similarity: number } {
  const similarities: Array<{ chapter: string; similarity: number }> = [];
  
  for (const chapter of allChapters) {
    if (chapter.type === 'front_matter' || chapter.type === 'back_matter') continue;
    
    const similarity = calculateSimilarity(contentFile.content, chapter.content);
    if (similarity > 0.1) { // Threshold for potential duplication
      similarities.push({
        chapter: chapter.title,
        similarity
      });
    }
  }
  
  if (similarities.length === 0) {
    return { risk: 'none', appears_in: [], max_similarity: 0 };
  }
  
  const maxSimilarity = Math.max(...similarities.map(s => s.similarity));
  const appearsIn = similarities
    .filter(s => s.similarity > 0.3)
    .map(s => s.chapter);
  
  let risk: 'none' | 'low' | 'medium' | 'high';
  if (maxSimilarity > 0.7) risk = 'high';
  else if (maxSimilarity > 0.5) risk = 'medium';
  else if (maxSimilarity > 0.3) risk = 'low';
  else risk = 'none';
  
  return { risk, appears_in: appearsIn, max_similarity: maxSimilarity };
}

function assessCohesionImpact(
  contentFile: ContentFile,
  chapter: ChapterInfo,
  allChapters: ChapterInfo[]
): 'enhances' | 'neutral' | 'disrupts' {
  // Check if content aligns with chapter's key terms
  const fileTerms = new Set(extractKeyTerms(contentFile.content, 30));
  const chapterTerms = new Set(chapter.key_terms);
  const overlap = [...fileTerms].filter(t => chapterTerms.has(t)).length;
  const overlapRatio = chapterTerms.size > 0 ? overlap / chapterTerms.size : 0;
  
  // Check narrative position
  const chapterIndex = allChapters.findIndex(c => c.title === chapter.title);
  const isEarlyChapter = chapterIndex < 5;
  
  // Strong metadata indicators (high weight)
  const hasBookThreading = typeof contentFile.yaml.book_threading === 'string' &&
    (contentFile.yaml.book_threading.includes('Stardust to Sovereignty') ||
     contentFile.yaml.book_threading.includes('Book : Stardust to Sovereignty') ||
     contentFile.yaml.book_threading.includes('Book 1'));
  
  const hasOrbMatch = contentFile.orb_tags.some(orb => chapter.orb_tags.includes(orb));
  const hasIntegrationPoint = Array.isArray(contentFile.yaml.integration_points) &&
    (contentFile.yaml.integration_points.includes('Book Compiler') ||
     contentFile.yaml.integration_points.includes('book_fragments'));
  
  // Check field_function content_purpose alignment
  const fieldFunction = contentFile.yaml.field_function || {};
  const contentPurpose = (fieldFunction.content_purpose || '').toLowerCase();
  const chapterText = `${chapter.title} ${chapter.content.substring(0, 500)}`.toLowerCase();
  const purposeWords = contentPurpose.split(/\s+/).filter(w => w.length > 4);
  const chapterWords = chapterText.split(/\s+/).filter(w => w.length > 4);
  const purposeMatch = purposeWords.filter(pw => 
    chapterWords.some(cw => cw.includes(pw) || pw.includes(cw))
  ).length;
  const hasStrongPurposeMatch = purposeMatch >= 3;
  
  // Scoring system for cohesion impact
  let enhanceScore = 0;
  
  // High term overlap = strong enhancement signal
  if (overlapRatio > 0.4) enhanceScore += 3;
  else if (overlapRatio > 0.25) enhanceScore += 2;
  else if (overlapRatio > 0.15) enhanceScore += 1;
  
  // Metadata matches = strong enhancement signals
  if (hasBookThreading) enhanceScore += 3;
  if (hasOrbMatch) enhanceScore += 2;
  if (hasIntegrationPoint) enhanceScore += 2;
  if (hasStrongPurposeMatch) enhanceScore += 2;
  
  // Framework auto-include keywords
  if (contentFile.yaml.framework_handling?.auto_include_keywords && 
      Array.isArray(contentFile.yaml.framework_handling.auto_include_keywords)) {
    const keywords = contentFile.yaml.framework_handling.auto_include_keywords.map((k: string) => k.toLowerCase());
    const hasKeywordMatch = keywords.some(keyword => chapterText.includes(keyword));
    if (hasKeywordMatch) enhanceScore += 2;
  }
  
  // Determine impact based on total score
  if (enhanceScore >= 5) return 'enhances';
  if (enhanceScore >= 3) return 'neutral';
  return 'disrupts';
}

function scoreContentMatch(
  contentFile: ContentFile,
  chapter: ChapterInfo
): { score: number; reasons: string[]; match_type: 'metadata' | 'rbi' | 'orbital' | 'semantic' } {
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
  
  // Semantic overlap using key terms
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

function analyzeCohesion(
  chapters: ChapterInfo[],
  allContent: ContentFile[]
): CohesionAnalysis[] {
  console.log('🔍 Analyzing manuscript cohesion and safe content additions...\n');
  
  const results: CohesionAnalysis[] = [];
  const narrativeChapters = chapters.filter(c => c.type === 'chapter' || c.type === 'interlude');
  
  for (let i = 0; i < narrativeChapters.length; i++) {
    const chapter = narrativeChapters[i];
    
    console.log(`  Analyzing: ${chapter.title}`);
    
    // Find currently used content
    const currentlyUsed = allContent
      .map(file => ({ file, ...scoreContentMatch(file, chapter) }))
      .filter(m => m.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(m => m.file);
    
    // Find all potential matches
    const allMatches = allContent
      .map(file => {
        const match = scoreContentMatch(file, chapter);
        const duplication = checkDuplicationRisk(file, chapters);
        const cohesion = assessCohesionImpact(file, chapter, narrativeChapters);
        
        // Safe to add if:
        // 1. No duplication risk, OR
        // 2. Low duplication risk AND (enhances cohesion OR strong metadata match), OR
        // 3. Low duplication risk AND high score (>= 15) indicating strong relevance
        const safeToAdd = duplication.risk === 'none' || 
                          (duplication.risk === 'low' && (cohesion === 'enhances' || cohesion === 'neutral')) ||
                          (duplication.risk === 'low' && match.match_type === 'metadata' && match.score >= 15) ||
                          (duplication.risk === 'low' && match.score >= 20);
        
        return {
          content_file: file,
          ...match,
          duplication_risk: duplication.risk,
          cohesion_impact: cohesion,
          safe_to_add: safeToAdd,
          duplication_info: duplication
        };
      })
      .filter(m => m.score > 5);
    
    // Separate safe and unsafe recommendations
    const safeRecommendations = allMatches
      .filter(m => m.safe_to_add && !currentlyUsed.some(cu => cu.file_path === m.content_file.file_path))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    const unsafeRecommendations = allMatches
      .filter(m => !m.safe_to_add && !currentlyUsed.some(cu => cu.file_path === m.content_file.file_path))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    // Check for duplication warnings
    const duplicationWarnings = currentlyUsed
      .map(file => {
        const dup = checkDuplicationRisk(file, chapters);
        if (dup.risk !== 'none') {
          return {
            content: file,
            appears_in: dup.appears_in,
            similarity: dup.max_similarity
          };
        }
        return null;
      })
      .filter((w): w is NonNullable<typeof w> => w !== null);
    
    // Calculate narrative position and flow score
    const narrativePosition = i + 1;
    const flowScore = calculateFlowScore(chapter, i > 0 ? narrativeChapters[i - 1] : null, i < narrativeChapters.length - 1 ? narrativeChapters[i + 1] : null);
    
    results.push({
      chapter,
      currently_used: currentlyUsed,
      safe_recommendations: safeRecommendations,
      unsafe_recommendations: unsafeRecommendations,
      duplication_warnings: duplicationWarnings,
      narrative_position: narrativePosition,
      flow_score: flowScore
    });
  }
  
  return results;
}

function calculateFlowScore(
  chapter: ChapterInfo,
  previousChapter: ChapterInfo | null,
  nextChapter: ChapterInfo | null
): number {
  let score = 0.5; // Base score
  
  // Check continuity with previous chapter
  if (previousChapter) {
    const prevTerms = new Set(previousChapter.key_terms);
    const currTerms = new Set(chapter.key_terms);
    const continuity = [...currTerms].filter(t => prevTerms.has(t)).length;
    score += Math.min(continuity / 10, 0.2);
  }
  
  // Check forward connection with next chapter
  if (nextChapter) {
    const currTerms = new Set(chapter.key_terms);
    const nextTerms = new Set(nextChapter.key_terms);
    const forwardLink = [...nextTerms].filter(t => currTerms.has(t)).length;
    score += Math.min(forwardLink / 10, 0.2);
  }
  
  // Orb progression check
  if (previousChapter && chapter.orb_tags.length > 0 && previousChapter.orb_tags.length > 0) {
    const hasOrbProgression = chapter.orb_tags.some(orb => 
      previousChapter.orb_tags.some(prevOrb => orb >= prevOrb)
    );
    if (hasOrbProgression) score += 0.1;
  }
  
  return Math.min(score, 1.0);
}

function generateReport(results: CohesionAnalysis[]): string {
  const lines: string[] = [];
  
  lines.push('# Manuscript V5 Cohesion Analysis Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  lines.push('## Executive Summary\n');
  
  const totalSafe = results.reduce((sum, r) => sum + r.safe_recommendations.length, 0);
  const totalUnsafe = results.reduce((sum, r) => sum + r.unsafe_recommendations.length, 0);
  const totalDuplications = results.reduce((sum, r) => sum + r.duplication_warnings.length, 0);
  const avgFlowScore = results.reduce((sum, r) => sum + r.flow_score, 0) / results.length;
  
  lines.push(`- **Total Chapters Analyzed:** ${results.length}`);
  lines.push(`- **Safe Content Recommendations:** ${totalSafe}`);
  lines.push(`- **Unsafe/High-Risk Recommendations:** ${totalUnsafe}`);
  lines.push(`- **Duplication Warnings:** ${totalDuplications}`);
  lines.push(`- **Average Narrative Flow Score:** ${avgFlowScore.toFixed(2)}/1.0\n`);
  
  lines.push('### Key Findings\n');
  lines.push('✅ **Safe to Add:** Content that enhances chapters without duplication risk');
  lines.push('⚠️ **Review Required:** Content with potential duplication or cohesion concerns');
  lines.push('🔍 **Duplication Warnings:** Content already appearing in multiple chapters\n');
  
  lines.push('---\n');
  lines.push('## Detailed Chapter Analysis\n');
  
  results.forEach((result, idx) => {
    lines.push(`### ${result.chapter.title}`);
    if (result.chapter.part) {
      lines.push(`**Part:** ${result.chapter.part}`);
    }
    lines.push(`**Narrative Position:** ${result.narrative_position}/${results.length}`);
    lines.push(`**Flow Score:** ${result.flow_score.toFixed(2)}/1.0`);
    lines.push(`**Word Count:** ${result.chapter.word_count.toLocaleString()}\n`);
    
    // Safe Recommendations
    if (result.safe_recommendations.length > 0) {
      lines.push('#### ✅ Safe Content Recommendations');
      result.safe_recommendations.forEach((match, i) => {
        lines.push(`${i + 1}. **${match.content_file.title}** (Score: ${match.score})`);
        lines.push(`   - Path: ${match.content_file.file_path}`);
        lines.push(`   - Match Type: ${match.match_type}`);
        lines.push(`   - Duplication Risk: ${match.duplication_risk}`);
        lines.push(`   - Cohesion Impact: ${match.cohesion_impact}`);
        lines.push(`   - Top Reason: ${match.reasons[0] || 'N/A'}`);
        lines.push('');
      });
    }
    
    // Unsafe Recommendations
    if (result.unsafe_recommendations.length > 0) {
      lines.push('#### ⚠️ High-Risk Recommendations (Review Required)');
      result.unsafe_recommendations.forEach((match, i) => {
        lines.push(`${i + 1}. **${match.content_file.title}** (Score: ${match.score})`);
        lines.push(`   - Path: ${match.content_file.file_path}`);
        lines.push(`   - ⚠️ Duplication Risk: ${match.duplication_risk}`);
        lines.push(`   - ⚠️ Cohesion Impact: ${match.cohesion_impact}`);
        if (match.duplication_info.appears_in.length > 0) {
          lines.push(`   - Appears in: ${match.duplication_info.appears_in.join(', ')}`);
          lines.push(`   - Similarity: ${(match.duplication_info.max_similarity * 100).toFixed(1)}%`);
        }
        lines.push('');
      });
    }
    
    // Duplication Warnings
    if (result.duplication_warnings.length > 0) {
      lines.push('#### 🔍 Duplication Warnings');
      result.duplication_warnings.forEach((warning, i) => {
        lines.push(`${i + 1}. **${warning.content.title}**`);
        lines.push(`   - Also appears in: ${warning.appears_in.join(', ')}`);
        lines.push(`   - Similarity: ${(warning.similarity * 100).toFixed(1)}%`);
        lines.push('');
      });
    }
    
    lines.push('---\n');
  });
  
  // Top Safe Recommendations
  lines.push('## Top 20 Safe Recommendations (No Duplication Risk)\n');
  const allSafe = results.flatMap(r => 
    r.safe_recommendations.map(match => ({ ...match, chapter_title: r.chapter.title }))
  );
  const topSafe = allSafe
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  
  topSafe.forEach((match, i) => {
    lines.push(`${i + 1}. **${match.content_file.title}** (Score: ${match.score})`);
    lines.push(`   - Path: ${match.content_file.file_path}`);
    lines.push(`   - Recommended for: ${match.chapter_title}`);
    lines.push(`   - Match Type: ${match.match_type}`);
    lines.push(`   - Cohesion: ${match.cohesion_impact}`);
    lines.push('');
  });
  
  return lines.join('\n');
}

async function main() {
  console.log('📚 Manuscript Cohesion Analysis');
  console.log('='.repeat(70));
  console.log('Analyzing V5 with duplication detection and cohesion assessment\n');
  console.log('='.repeat(70) + '\n');
  
  const chapters = parseManuscriptV5();
  const allContent = loadContentLibrary();
  const results = analyzeCohesion(chapters, allContent);
  
  console.log('📝 Generating report...\n');
  const report = generateReport(results);
  fs.writeFileSync(OUTPUT_REPORT, report, 'utf-8');
  
  console.log(`✅ Analysis complete!`);
  console.log(`📄 Report saved to: ${OUTPUT_REPORT}\n`);
  
  const totalSafe = results.reduce((sum, r) => sum + r.safe_recommendations.length, 0);
  const totalUnsafe = results.reduce((sum, r) => sum + r.unsafe_recommendations.length, 0);
  
  console.log('Summary:');
  console.log(`  - Safe recommendations: ${totalSafe}`);
  console.log(`  - High-risk recommendations: ${totalUnsafe}`);
  console.log(`  - Average flow score: ${(results.reduce((sum, r) => sum + r.flow_score, 0) / results.length).toFixed(2)}/1.0\n`);
}

main()
  .then(() => {
    console.log('✅ Cohesion analysis complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });

