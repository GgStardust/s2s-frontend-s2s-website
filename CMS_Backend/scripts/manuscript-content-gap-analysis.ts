#!/usr/bin/env tsx
/**
 * Manuscript Content Gap Analysis
 * 
 * Analyzes manuscript V5 against content library to identify:
 * - Content in library that could enhance chapters but wasn't included
 * - Missing content based on metadata, RBI workflow, and orbital brain analysis
 * - Recommendations for content additions
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Paths
const MANUSCRIPT_V5 = path.join(__dirname, '../../RBI_Editorial_Tools/S2S_Manuscript_V5.md');
const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const ORB_ESSAYS_DIR = path.join(CONTENT_BASE, '02d_Orb_Essays');
const CODEX_ESSAYS_DIR = path.join(CONTENT_BASE, '02f_S2S_codex_essays');
const SUPPORTING_MATERIAL_DIR = path.join(CONTENT_BASE, '02c_Supporting material');
const SYSTEM_ESSAYS_DIR = path.join(CONTENT_BASE, '02a_System_essays');
const OUTPUT_REPORT = path.join(__dirname, '../MANUSCRIPT_CONTENT_GAP_ANALYSIS_REPORT.md');

interface ContentFile {
  file_path: string;
  title: string;
  yaml: any;
  content: string;
  inline_tags: string[];
  orb_tags: number[];
  word_count: number;
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
}

interface ContentMatch {
  content_file: ContentFile;
  score: number;
  reasons: string[];
  match_type: 'metadata' | 'rbi' | 'orbital' | 'semantic';
  chapter: ChapterInfo;
}

interface GapAnalysisResult {
  chapter: ChapterInfo;
  currently_used: ContentFile[];
  recommended_additions: ContentMatch[];
  missing_themes: string[];
  orb_gaps: number[];
}

function extractInlineTags(content: string): { allTags: string[]; orbTags: number[] } {
  const allTags: string[] = [];
  const orbTags: number[] = [];
  
  // Extract @orb tags
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
  
  // Extract @scrollstream tags
  const scrollMatches = content.matchAll(/@scrollstream[:\s]*([^\n@]*)/gi);
  for (const match of scrollMatches) {
    const originalTag = match[0];
    if (!allTags.includes(originalTag)) {
      allTags.push(originalTag);
    }
  }
  
  // Extract other @tags
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
  let chapterCounter = 0;
  
  // Patterns for different section types
  const patterns = {
    part: /^###?\s*\*\*PART\s+(\d+):\s*(.+?)\*\*/i,
    chapter: /^#+\s*Chapter\s+(\d+):\s*(.+?)$/i,
    interlude: /^#+\s*Interlude:\s*(.+?)$/i,
    front_matter: /^#+\s*(Series Note|Prologue|Introduction|Entering the Field)/i,
    back_matter: /^#+\s*(Conclusion|Afterword|Epilogue|APPENDIX [A-Z]|Appendix [A-Z])/i,
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for Part
    const partMatch = line.match(patterns.part);
    if (partMatch) {
      currentPart = `Part ${partMatch[1]}: ${partMatch[2]}`;
      continue;
    }
    
    // Check for Chapter
    const chapterMatch = line.match(patterns.chapter);
    if (chapterMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        chapters.push(currentChapter);
      }
      
      chapterCounter++;
      currentChapter = {
        chapter_number: parseInt(chapterMatch[1]),
        title: `Chapter ${chapterMatch[1]}: ${chapterMatch[2]}`,
        content: '',
        type: 'chapter',
        part: currentPart,
        word_count: 0,
        orb_tags: [],
        inline_tags: []
      };
      currentContent = [];
      continue;
    }
    
    // Check for Interlude
    const interludeMatch = line.match(patterns.interlude);
    if (interludeMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: `Interlude: ${interludeMatch[1]}`,
        content: '',
        type: 'interlude',
        part: currentPart,
        word_count: 0,
        orb_tags: [],
        inline_tags: []
      };
      currentContent = [];
      continue;
    }
    
    // Check for Front Matter
    const frontMatch = line.match(patterns.front_matter);
    if (frontMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: frontMatch[1],
        content: '',
        type: 'front_matter',
        word_count: 0,
        orb_tags: [],
        inline_tags: []
      };
      currentContent = [];
      continue;
    }
    
    // Check for Back Matter
    const backMatch = line.match(patterns.back_matter);
    if (backMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        const tags = extractInlineTags(currentChapter.content);
        currentChapter.inline_tags = tags.allTags;
        currentChapter.orb_tags = tags.orbTags;
        currentChapter.word_count = currentChapter.content.split(/\s+/).length;
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: backMatch[1],
        content: '',
        type: 'back_matter',
        word_count: 0,
        orb_tags: [],
        inline_tags: []
      };
      currentContent = [];
      continue;
    }
    
    // Accumulate content
    if (currentChapter) {
      currentContent.push(line);
    }
  }
  
  // Save last chapter
  if (currentChapter) {
    currentChapter.content = currentContent.join('\n');
    const tags = extractInlineTags(currentChapter.content);
    currentChapter.inline_tags = tags.allTags;
    currentChapter.orb_tags = tags.orbTags;
    currentChapter.word_count = currentChapter.content.split(/\s+/).length;
    chapters.push(currentChapter);
  }
  
  console.log(`✅ Parsed ${chapters.length} sections from manuscript\n`);
  return chapters;
}

function loadContentLibrary(): ContentFile[] {
  console.log('📚 Loading content library...\n');
  const files: ContentFile[] = [];
  
  // Load Orb Essays
  if (fs.existsSync(ORB_ESSAYS_DIR)) {
    const orbFiles = fs.readdirSync(ORB_ESSAYS_DIR).filter(f => f.endsWith('.md'));
    orbFiles.forEach(filename => {
      const filePath = path.join(ORB_ESSAYS_DIR, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      const tags = extractInlineTags(parsed.content);
      
      files.push({
        file_path: `02d_Orb_Essays/${filename}`,
        title: parsed.data.title || filename.replace('.md', ''),
        yaml: parsed.data,
        content: parsed.content,
        inline_tags: tags.allTags,
        orb_tags: tags.orbTags,
        word_count: parsed.content.split(/\s+/).length
      });
    });
  }
  
  // Load Codex Essays
  if (fs.existsSync(CODEX_ESSAYS_DIR)) {
    const codexFiles = fs.readdirSync(CODEX_ESSAYS_DIR).filter(f => f.endsWith('.md'));
    codexFiles.forEach(filename => {
      const filePath = path.join(CODEX_ESSAYS_DIR, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      const tags = extractInlineTags(parsed.content);
      
      files.push({
        file_path: `02f_S2S_codex_essays/${filename}`,
        title: parsed.data.title || filename.replace('.md', ''),
        yaml: parsed.data,
        content: parsed.content,
        inline_tags: tags.allTags,
        orb_tags: tags.orbTags,
        word_count: parsed.content.split(/\s+/).length
      });
    });
  }
  
  // Load Supporting Material
  if (fs.existsSync(SUPPORTING_MATERIAL_DIR)) {
    const supportingFiles = fs.readdirSync(SUPPORTING_MATERIAL_DIR).filter(f => f.endsWith('.md'));
    supportingFiles.forEach(filename => {
      const filePath = path.join(SUPPORTING_MATERIAL_DIR, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      const tags = extractInlineTags(parsed.content);
      
      files.push({
        file_path: `02c_Supporting material/${filename}`,
        title: parsed.data.title || filename.replace('.md', ''),
        yaml: parsed.data,
        content: parsed.content,
        inline_tags: tags.allTags,
        orb_tags: tags.orbTags,
        word_count: parsed.content.split(/\s+/).length
      });
    });
  }
  
  // Load System Essays
  if (fs.existsSync(SYSTEM_ESSAYS_DIR)) {
    const systemFiles = fs.readdirSync(SYSTEM_ESSAYS_DIR).filter(f => f.endsWith('.md'));
    systemFiles.forEach(filename => {
      const filePath = path.join(SYSTEM_ESSAYS_DIR, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      const tags = extractInlineTags(parsed.content);
      
      files.push({
        file_path: `02a_System_essays/${filename}`,
        title: parsed.data.title || filename.replace('.md', ''),
        yaml: parsed.data,
        content: parsed.content,
        inline_tags: tags.allTags,
        orb_tags: tags.orbTags,
        word_count: parsed.content.split(/\s+/).length
      });
    });
  }
  
  console.log(`✅ Loaded ${files.length} content files from library\n`);
  return files;
}

function scoreContentMatch(
  contentFile: ContentFile,
  chapter: ChapterInfo
): { score: number; reasons: string[]; match_type: 'metadata' | 'rbi' | 'orbital' | 'semantic' } {
  let score = 0;
  const reasons: string[] = [];
  let matchType: 'metadata' | 'rbi' | 'orbital' | 'semantic' = 'semantic';
  
  // 1. Book Threading Match (Metadata - Highest Priority)
  const bookThreading = typeof contentFile.yaml.book_threading === 'string' 
    ? contentFile.yaml.book_threading 
    : '';
  if (bookThreading && (bookThreading.includes('Stardust to Sovereignty') || 
      bookThreading.includes('Book : Stardust to Sovereignty') ||
      bookThreading.includes('Book 1'))) {
    score += 15;
    reasons.push('✅ Book threading match (Stardust to Sovereignty)');
    matchType = 'metadata';
  }
  
  // 2. Field Function Content Purpose Match (Metadata)
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
    reasons.push(`✅ Content purpose match (${matchingWords.length} keywords: ${matchingWords.slice(0, 3).join(', ')})`);
    matchType = 'metadata';
  }
  
  // 3. Orb Association Match (RBI/Orbital)
  const chapterOrbs = chapter.orb_tags;
  const fileOrbs = contentFile.orb_tags;
  const matchingOrbs = chapterOrbs.filter(co => fileOrbs.includes(co));
  
  if (matchingOrbs.length > 0) {
    score += matchingOrbs.length * 5;
    reasons.push(`✅ Orb association match (Orbs: ${matchingOrbs.join(', ')})`);
    matchType = 'orbital';
  }
  
  // Also check YAML orb_associations
  if (contentFile.yaml.orb_associations) {
    const yamlOrbs: number[] = [];
    if (Array.isArray(contentFile.yaml.orb_associations)) {
      contentFile.yaml.orb_associations.forEach((orb: any) => {
        if (typeof orb === 'number') yamlOrbs.push(orb);
        if (typeof orb === 'string') {
          const match = orb.match(/Orb\s*(\d+)/i);
          if (match) yamlOrbs.push(parseInt(match[1]));
        }
      });
    }
    
    const yamlMatchingOrbs = chapterOrbs.filter(co => yamlOrbs.includes(co));
    if (yamlMatchingOrbs.length > 0) {
      score += yamlMatchingOrbs.length * 3;
      reasons.push(`✅ YAML orb_associations match (Orbs: ${yamlMatchingOrbs.join(', ')})`);
      matchType = 'orbital';
    }
  }
  
  // 4. Integration Points Match (Metadata)
  const integrationPoints = Array.isArray(contentFile.yaml.integration_points) 
    ? contentFile.yaml.integration_points 
    : (contentFile.yaml.integration_points ? [contentFile.yaml.integration_points] : []);
  if (integrationPoints.includes('Book Compiler') || integrationPoints.includes('book_fragments')) {
    score += 8;
    reasons.push('✅ Book Compiler integration point');
    matchType = 'metadata';
  }
  
  // 5. Framework Auto-Include Keywords (Metadata)
  if (contentFile.yaml.framework_handling?.auto_include_keywords && Array.isArray(contentFile.yaml.framework_handling.auto_include_keywords)) {
    const keywords = contentFile.yaml.framework_handling.auto_include_keywords.map((k: string) => k.toLowerCase());
    const hasKeywordMatch = keywords.some(keyword => chapterText.includes(keyword));
    
    if (hasKeywordMatch) {
      const weight = typeof contentFile.yaml.inclusion_weight === 'number' ? contentFile.yaml.inclusion_weight : 0.25;
      score += 10 * weight;
      reasons.push(`✅ Framework auto-include keyword match (weight: ${weight})`);
      matchType = 'metadata';
    }
  }
  
  // 6. Inline Tag Relevance (Semantic)
  const chapterTitleLower = chapter.title.toLowerCase();
  for (const tag of contentFile.inline_tags) {
    const tagName = tag.replace('@', '').replace(/\d+/, '').toLowerCase();
    if (chapterTitleLower.includes(tagName) || chapterTitleLower.includes(tagName.replace('_', ' '))) {
      score += 2;
      reasons.push(`✅ Inline tag match: ${tag}`);
      matchType = 'semantic';
    }
  }
  
  // 7. Semantic Content Overlap (RBI/Semantic)
  const chapterContentLower = chapter.content.toLowerCase();
  const fileContentLower = contentFile.content.toLowerCase();
  
  // Extract key terms from chapter (words > 5 chars, excluding common words)
  const commonWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'she', 'use', 'her', 'man', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who']);
  const chapterTerms = chapterContentLower.split(/\s+/)
    .filter(w => w.length > 5 && !commonWords.has(w))
    .slice(0, 50);
  
  const fileTerms = fileContentLower.split(/\s+/)
    .filter(w => w.length > 5 && !commonWords.has(w))
    .slice(0, 50);
  
  const matchingTerms = chapterTerms.filter(ct => fileTerms.some(ft => ft.includes(ct) || ct.includes(ft)));
  if (matchingTerms.length > 5) {
    score += Math.min(matchingTerms.length, 10);
    reasons.push(`✅ Semantic content overlap (${matchingTerms.length} matching terms)`);
    matchType = 'semantic';
  }
  
  return { score, reasons, match_type: matchType };
}

function findCurrentlyUsedContent(chapter: ChapterInfo, allContent: ContentFile[]): ContentFile[] {
  // This is a simplified check - in reality, you'd need to compare actual content
  // For now, we'll identify content that likely matches based on high scores
  const matches = allContent.map(file => ({
    file,
    ...scoreContentMatch(file, chapter)
  })).filter(m => m.score > 20); // High threshold for "currently used"
  
  return matches.sort((a, b) => b.score - a.score).slice(0, 5).map(m => m.file);
}

function analyzeGaps(chapters: ChapterInfo[], allContent: ContentFile[]): GapAnalysisResult[] {
  console.log('🔍 Analyzing content gaps...\n');
  
  const results: GapAnalysisResult[] = [];
  
  for (const chapter of chapters) {
    if (chapter.type === 'front_matter' || chapter.type === 'back_matter') {
      continue; // Skip front/back matter for now
    }
    
    console.log(`  Analyzing: ${chapter.title}`);
    
    // Find currently used content (high-scoring matches)
    const currentlyUsed = findCurrentlyUsedContent(chapter, allContent);
    
    // Find all potential matches
    const allMatches = allContent
      .map(file => ({
        content_file: file,
        ...scoreContentMatch(file, chapter),
        chapter
      }))
      .filter(m => m.score > 5); // Lower threshold to find potential additions
    
    // Filter out content that's likely already used
    const recommendedAdditions = allMatches
      .filter(m => {
        // Exclude if it's in currently used
        const isUsed = currentlyUsed.some(cu => cu.file_path === m.content_file.file_path);
        if (isUsed) return false;
        
        // Include if it has strong metadata or orbital matches
        return m.score >= 10 || m.match_type === 'metadata' || m.match_type === 'orbital';
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 recommendations
    
    // Identify missing themes (based on chapter title/content analysis)
    const missingThemes: string[] = [];
    const chapterLower = chapter.title.toLowerCase();
    
    // Check for common themes that might be missing
    const themeKeywords = ['sovereignty', 'resonance', 'orb', 'field', 'intelligence', 'architecture', 'coherence'];
    themeKeywords.forEach(theme => {
      if (chapterLower.includes(theme)) {
        // Check if we have content specifically about this theme
        const themeContent = allContent.filter(c => 
          c.title.toLowerCase().includes(theme) || 
          c.yaml.field_function?.content_purpose?.toLowerCase().includes(theme)
        );
        if (themeContent.length > 0 && !currentlyUsed.some(cu => themeContent.some(tc => tc.file_path === cu.file_path))) {
          missingThemes.push(theme);
        }
      }
    });
    
    // Identify orb gaps
    const chapterOrbs = chapter.orb_tags;
    const allOrbs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const orbGaps = allOrbs.filter(orb => {
      // If chapter mentions an orb but doesn't have content for it
      const hasOrbContent = currentlyUsed.some(cu => cu.orb_tags.includes(orb));
      const chapterMentionsOrb = chapterLower.includes(`orb ${orb}`) || chapterLower.includes(`orb_${orb}`);
      return chapterMentionsOrb && !hasOrbContent;
    });
    
    results.push({
      chapter,
      currently_used: currentlyUsed,
      recommended_additions: recommendedAdditions,
      missing_themes: missingThemes,
      orb_gaps: orbGaps
    });
  }
  
  return results;
}

function generateReport(results: GapAnalysisResult[]): string {
  const lines: string[] = [];
  
  lines.push('# Manuscript V5 Content Gap Analysis Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  lines.push('## Executive Summary\n');
  
  const totalChapters = results.length;
  const chaptersWithGaps = results.filter(r => r.recommended_additions.length > 0).length;
  const totalRecommendations = results.reduce((sum, r) => sum + r.recommended_additions.length, 0);
  
  lines.push(`- **Total Chapters Analyzed:** ${totalChapters}`);
  lines.push(`- **Chapters with Recommended Additions:** ${chaptersWithGaps}`);
  lines.push(`- **Total Content Recommendations:** ${totalRecommendations}`);
  lines.push(`- **Average Recommendations per Chapter:** ${(totalRecommendations / totalChapters).toFixed(1)}\n`);
  
  lines.push('---\n');
  lines.push('## Detailed Chapter Analysis\n');
  
  results.forEach((result, idx) => {
    lines.push(`### ${result.chapter.title}`);
    if (result.chapter.part) {
      lines.push(`**Part:** ${result.chapter.part}`);
    }
    lines.push(`**Type:** ${result.chapter.type}`);
    lines.push(`**Word Count:** ${result.chapter.word_count.toLocaleString()}`);
    lines.push(`**Orb Tags:** ${result.chapter.orb_tags.length > 0 ? result.chapter.orb_tags.join(', ') : 'None'}\n`);
    
    // Currently Used Content
    lines.push('#### Currently Used Content');
    if (result.currently_used.length > 0) {
      result.currently_used.forEach((file, i) => {
        lines.push(`${i + 1}. **${file.title}**`);
        lines.push(`   - Path: ${file.file_path}`);
        lines.push(`   - Word Count: ${file.word_count.toLocaleString()}`);
        if (file.orb_tags.length > 0) {
          lines.push(`   - Orb Tags: ${file.orb_tags.join(', ')}`);
        }
        if (file.yaml.book_threading) {
          lines.push(`   - Book Threading: ${file.yaml.book_threading}`);
        }
        lines.push('');
      });
    } else {
      lines.push('*No content identified as currently used*\n');
    }
    
    // Recommended Additions
    lines.push('#### Recommended Content Additions');
    if (result.recommended_additions.length > 0) {
      result.recommended_additions.forEach((match, i) => {
        lines.push(`${i + 1}. **${match.content_file.title}** (Score: ${match.score})`);
        lines.push(`   - Path: ${match.content_file.file_path}`);
        lines.push(`   - Match Type: ${match.match_type}`);
        lines.push(`   - Word Count: ${match.content_file.word_count.toLocaleString()}`);
        if (match.content_file.orb_tags.length > 0) {
          lines.push(`   - Orb Tags: ${match.content_file.orb_tags.join(', ')}`);
        }
        lines.push(`   - Reasons:`);
        match.reasons.forEach(reason => {
          lines.push(`     ${reason}`);
        });
        if (match.content_file.yaml.book_threading) {
          lines.push(`   - Book Threading: ${match.content_file.yaml.book_threading}`);
        }
        if (match.content_file.yaml.field_function?.content_purpose) {
          lines.push(`   - Content Purpose: ${match.content_file.yaml.field_function.content_purpose.substring(0, 100)}...`);
        }
        lines.push('');
      });
    } else {
      lines.push('*No additional content recommendations*\n');
    }
    
    // Missing Themes
    if (result.missing_themes.length > 0) {
      lines.push('#### Missing Themes');
      lines.push(`The following themes are mentioned but may lack dedicated content:`);
      result.missing_themes.forEach(theme => {
        lines.push(`- ${theme}`);
      });
      lines.push('');
    }
    
    // Orb Gaps
    if (result.orb_gaps.length > 0) {
      lines.push('#### Orb Gaps');
      lines.push(`The following Orbs are mentioned but may lack dedicated content:`);
      result.orb_gaps.forEach(orb => {
        lines.push(`- Orb ${orb}`);
      });
      lines.push('');
    }
    
    lines.push('---\n');
  });
  
  // Summary by Match Type
  lines.push('## Recommendations by Match Type\n');
  
  const byMatchType = {
    metadata: results.flatMap(r => r.recommended_additions.filter(m => m.match_type === 'metadata')),
    orbital: results.flatMap(r => r.recommended_additions.filter(m => m.match_type === 'orbital')),
    rbi: results.flatMap(r => r.recommended_additions.filter(m => m.match_type === 'rbi')),
    semantic: results.flatMap(r => r.recommended_additions.filter(m => m.match_type === 'semantic'))
  };
  
  lines.push(`- **Metadata Matches:** ${byMatchType.metadata.length}`);
  lines.push(`- **Orbital/Orb Matches:** ${byMatchType.orbital.length}`);
  lines.push(`- **RBI Matches:** ${byMatchType.rbi.length}`);
  lines.push(`- **Semantic Matches:** ${byMatchType.semantic.length}\n`);
  
  // Top Recommendations
  lines.push('## Top 20 Overall Recommendations\n');
  const allRecommendations = results.flatMap(r => r.recommended_additions);
  const topRecommendations = allRecommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  
  topRecommendations.forEach((match, i) => {
    lines.push(`${i + 1}. **${match.content_file.title}** (Score: ${match.score})`);
    lines.push(`   - Path: ${match.content_file.file_path}`);
    lines.push(`   - Match Type: ${match.match_type}`);
    lines.push(`   - Recommended for: ${match.chapter.title}`);
    lines.push(`   - Top Reason: ${match.reasons[0] || 'N/A'}`);
    lines.push('');
  });
  
  return lines.join('\n');
}

async function main() {
  console.log('📚 Manuscript Content Gap Analysis');
  console.log('='.repeat(70));
  console.log('Analyzing Manuscript V5 against Content Library\n');
  console.log('='.repeat(70) + '\n');
  
  // Parse manuscript
  const chapters = parseManuscriptV5();
  
  // Load content library
  const allContent = loadContentLibrary();
  
  // Analyze gaps
  const results = analyzeGaps(chapters, allContent);
  
  // Generate report
  console.log('📝 Generating report...\n');
  const report = generateReport(results);
  fs.writeFileSync(OUTPUT_REPORT, report, 'utf-8');
  
  console.log(`✅ Analysis complete!`);
  console.log(`📄 Report saved to: ${OUTPUT_REPORT}\n`);
  
  // Print summary
  const totalRecommendations = results.reduce((sum, r) => sum + r.recommended_additions.length, 0);
  console.log('Summary:');
  console.log(`  - Chapters analyzed: ${results.length}`);
  console.log(`  - Total recommendations: ${totalRecommendations}`);
  console.log(`  - Average per chapter: ${(totalRecommendations / results.length).toFixed(1)}\n`);
}

main()
  .then(() => {
    console.log('✅ Gap analysis complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });

