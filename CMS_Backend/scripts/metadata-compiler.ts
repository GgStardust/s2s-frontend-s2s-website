#!/usr/bin/env tsx
/**
 * Metadata-Based Book Compiler
 * 
 * Assembles manuscript using YAML frontmatter and inline tags ONLY.
 * No RBI or resonance scoring.
 * 
 * Rules:
 * - Preserve all inline tags (@orb_1, @scrollstream, etc.)
 * - Include YAML frontmatter in compiled output
 * - Use field_function.content_purpose and book_threading for source selection
 * - Do not strip or normalize tag syntax
 * - RBI validation happens separately afterward
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

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const ORB_ESSAYS_DIR = path.join(CONTENT_BASE, '02d_Orb_Essays');
const CODEX_ESSAYS_DIR = path.join(CONTENT_BASE, '02f_S2S_codex_essays');
const OUTPUT_DIR = path.join(CONTENT_BASE, '02g_generated_book_content');

const BOOK_ID = 'b00cf52b-65cb-4f00-b7d9-293cde462c3a'; // Stardust to Sovereignty

interface ContentFile {
  file_path: string;
  title: string;
  yaml: any;
  content: string;
  inline_tags: string[];
  orb_tags: number[];
}

interface ChapterOutline {
  chapter_number: number;
  title: string;
  description?: string;
  orb_focus?: number;
}

function extractInlineTags(content: string): { allTags: string[]; orbTags: number[] } {
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

function loadContentFiles(): ContentFile[] {
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
        content: parsed.content, // Preserve content with all tags intact
        inline_tags: tags.allTags,
        orb_tags: tags.orbTags
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
        content: parsed.content, // Preserve content with all tags intact
        inline_tags: tags.allTags,
        orb_tags: tags.orbTags
      });
    });
  }
  
  return files;
}

function getChapterOutlines(): ChapterOutline[] {
  // Get actual chapter outlines from database or use predefined
  // For now, using the Stardust to Sovereignty chapter structure
  return [
    { chapter_number: 1, title: 'Chapter 1: The Stardust Within', description: 'Establishes the foundational intelligence that first inhabits form' },
    { chapter_number: 2, title: 'Chapter 2: The Body as Advanced Biological Technology', description: 'Explores the body as cosmic biological circuitry' },
    { chapter_number: 3, title: 'Chapter 3: Metabolic Intelligence', description: 'Photonic intelligence and metabolic coherence' },
    { chapter_number: 4, title: 'Chapter 4: Resonance and the Energetic Universe', description: 'Harmonic architectures and resonance mechanics' },
    { chapter_number: 5, title: 'Chapter 5: Defining Energetic Sovereignty', description: 'Temporal sovereignty and sovereign field' },
    // Add more chapters as needed
  ];
}

function selectSourcesForChapter(
  chapter: ChapterOutline,
  contentFiles: ContentFile[]
): ContentFile[] {
  // Filter to only essays - exclude book_output (compiled chapters should not be used as sources)
  // System references can be included if use_in_book_compiler is true
  const essayFiles = contentFiles.filter(f => {
    if (f.yaml.type !== 'essay') return false;
    
    // Check if this is a framework file
    if (f.yaml.source_type === 'system_reference' || f.yaml.system_role === 'core_framework') {
      // Only include if explicitly allowed
      return f.yaml.use_in_book_compiler === true;
    }
    
    return true;
  });
  
  const selected: ContentFile[] = [];
  const scored: Array<{ file: ContentFile; score: number; reasons: string[] }> = [];
  
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
    if (integrationPoints.includes('Book Compiler')) {
      score += 5;
      reasons.push('Book Compiler integration');
    } else if (integrationPoints.includes('book_fragments')) {
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
  
  // Sort by score and select top 3
  scored.sort((a, b) => b.score - a.score);
  const topSources = scored.slice(0, 3);
  
  console.log(`  Selected ${topSources.length} sources:`);
  topSources.forEach((item, idx) => {
    console.log(`    ${idx + 1}. ${item.file.title} (score: ${item.score})`);
    item.reasons.forEach(reason => console.log(`       - ${reason}`));
  });
  
  return topSources.map(item => item.file);
}

function compileChapter(
  chapter: ChapterOutline,
  sources: ContentFile[]
): string {
  // Start with YAML frontmatter for the chapter
  const chapterYAML: any = {
    title: chapter.title,
    author: 'Gigi Stardust',
    type: 'book_output',
    category: 'foundational',
    status: 'canonical',
    version: 'metadata-compiled',
    created: new Date().toISOString().split('T')[0],
    modified: new Date().toISOString().split('T')[0],
    orb_associations: [],
    field_function: {
      content_purpose: chapter.description || '',
      primary_mechanism: '',
      secondary_mechanisms: [],
      resonance_indicators: ['Metadata-compiled', 'YAML-based selection'],
      integration_points: ['Book Compiler', 'Metadata Compiler']
    },
    integration_points: ['Book Compiler', 'Content Library'],
    book_threading: 'Book : Stardust to Sovereignty',
    is_primary_source: true,
    related_files: sources.map(s => s.file_path)
  };
  
  // Collect all orb associations from sources
  const allOrbs = new Set<number>();
  sources.forEach(source => {
    source.orb_tags.forEach(orb => allOrbs.add(orb));
    // Also check YAML orb_associations
    if (source.yaml.orb_associations) {
      if (Array.isArray(source.yaml.orb_associations)) {
        source.yaml.orb_associations.forEach((orb: any) => {
          if (typeof orb === 'number') allOrbs.add(orb);
          if (typeof orb === 'string') {
            const match = orb.match(/Orb\s*(\d+)/i);
            if (match) allOrbs.add(parseInt(match[1]));
          }
        });
      } else if (source.yaml.orb_associations.primary_orb) {
        const match = String(source.yaml.orb_associations.primary_orb).match(/Orb\s*(\d+)/i);
        if (match) allOrbs.add(parseInt(match[1]));
      }
    }
  });
  
  chapterYAML.orb_associations = Array.from(allOrbs).sort((a, b) => a - b).map(n => `Orb ${n}`);
  
  // Build chapter content - preserve all inline tags
  let chapterContent = `# ${chapter.title}\n\n`;
  
  if (chapter.description) {
    chapterContent += `${chapter.description}\n\n`;
  }
  
  // Add source content, preserving all tags
  sources.forEach((source, idx) => {
    chapterContent += `## Source ${idx + 1}: ${source.title}\n\n`;
    
    // Include source YAML metadata as comment
    chapterContent += `<!-- Source YAML Metadata:\n`;
    chapterContent += `  Book Threading: ${source.yaml.book_threading || 'none'}\n`;
    chapterContent += `  Field Function: ${source.yaml.field_function?.content_purpose || 'none'}\n`;
    chapterContent += `  Integration Points: ${(source.yaml.integration_points || []).join(', ') || 'none'}\n`;
    chapterContent += `-->\n\n`;
    
    // Include source content with ALL tags preserved
    chapterContent += `${source.content}\n\n`;
    chapterContent += `---\n\n`;
  });
  
  // Convert YAML to string (simple format)
  const yamlString = `---
${Object.entries(chapterYAML).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}:\n${value.map((v: any) => `  - ${JSON.stringify(v)}`).join('\n')}`;
  } else if (typeof value === 'object' && value !== null) {
    return `${key}:\n${Object.entries(value).map(([k, v]) => {
      if (Array.isArray(v)) {
        return `  ${k}:\n${v.map((item: any) => `    - ${JSON.stringify(item)}`).join('\n')}`;
      }
      return `  ${k}: ${JSON.stringify(v)}`;
    }).join('\n')}`;
  }
  return `${key}: ${JSON.stringify(value)}`;
}).join('\n')}
---
`;
  
  return yamlString + '\n' + chapterContent;
}

async function compileBook() {
  console.log('📚 Metadata-Based Book Compiler');
  console.log('='.repeat(70));
  console.log('Mode: YAML frontmatter + inline tags ONLY');
  console.log('No RBI or resonance scoring\n');
  console.log('='.repeat(70) + '\n');
  
  // Load content files
  console.log('📁 Loading content files...');
  const contentFiles = loadContentFiles();
  console.log(`✅ Loaded ${contentFiles.length} content files\n`);
  
  // Get chapter outlines
  console.log('📖 Loading chapter outlines...');
  const chapters = getChapterOutlines();
  console.log(`✅ Loaded ${chapters.length} chapters\n`);
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const compilationResults: Array<{
    chapter: ChapterOutline;
    sources: ContentFile[];
    compiled: boolean;
    outputPath?: string;
  }> = [];
  
  // Compile each chapter
  for (const chapter of chapters) {
    console.log(`\n📝 Compiling Chapter ${chapter.chapter_number}: ${chapter.title}`);
    console.log('-'.repeat(70));
    
    // Select sources using YAML metadata only
    const sources = selectSourcesForChapter(chapter, contentFiles);
    
    if (sources.length === 0) {
      console.log('  ⚠️  No sources selected, skipping');
      compilationResults.push({
        chapter,
        sources: [],
        compiled: false
      });
      continue;
    }
    
    // Compile chapter
    const compiledContent = compileChapter(chapter, sources);
    
    // Save to file
    const filename = `CHAPTER_${String(chapter.chapter_number).padStart(2, '0')}_${chapter.title.replace(/[^a-z0-9]/gi, '_').toUpperCase()}.md`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(outputPath, compiledContent, 'utf-8');
    
    console.log(`  ✅ Compiled and saved to: ${filename}`);
    console.log(`     Content length: ${compiledContent.length} characters`);
    console.log(`     Sources used: ${sources.length}`);
    
    compilationResults.push({
      chapter,
      sources,
      compiled: true,
      outputPath
    });
  }
  
  // Generate summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 COMPILATION SUMMARY');
  console.log('='.repeat(70) + '\n');
  
  const compiled = compilationResults.filter(r => r.compiled).length;
  const totalSources = compilationResults.reduce((sum, r) => sum + r.sources.length, 0);
  
  console.log(`Total Chapters: ${chapters.length}`);
  console.log(`Compiled: ${compiled}`);
  console.log(`Skipped: ${chapters.length - compiled}`);
  console.log(`Total Sources Used: ${totalSources}\n`);
  
  console.log('Chapter Details:');
  compilationResults.forEach(result => {
    const status = result.compiled ? '✅' : '⏭️';
    const sources = result.sources.length > 0 ? ` [${result.sources.length} sources]` : '';
    console.log(`  ${status} Chapter ${result.chapter.chapter_number}: ${result.chapter.title}${sources}`);
  });
  
  // Save report
  const reportPath = path.join(__dirname, '../METADATA_COMPILATION_REPORT.md');
  const report = generateReport(compilationResults);
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\n✅ Report saved to: ${reportPath}\n`);
}

function generateReport(results: Array<{
  chapter: ChapterOutline;
  sources: ContentFile[];
  compiled: boolean;
  outputPath?: string;
}>): string {
  const lines: string[] = [];
  
  lines.push('# Metadata-Based Book Compilation Report');
  lines.push(`**Generated:** ${new Date().toISOString()}\n`);
  lines.push('---\n');
  lines.push('## Compiler Mode\n');
  lines.push('- **Method:** YAML frontmatter + inline tags ONLY');
  lines.push('- **No RBI/Resonance Scoring:** Pure metadata-driven selection');
  lines.push('- **Tag Preservation:** All inline tags (@orb_1, @scrollstream, etc.) preserved');
  lines.push('- **YAML Frontmatter:** Included in compiled output\n');
  
  const compiled = results.filter(r => r.compiled).length;
  const totalSources = results.reduce((sum, r) => sum + r.sources.length, 0);
  
  lines.push('## Summary\n');
  lines.push(`- **Total Chapters:** ${results.length}`);
  lines.push(`- **Compiled:** ${compiled}`);
  lines.push(`- **Skipped:** ${results.length - compiled}`);
  lines.push(`- **Total Sources Used:** ${totalSources}\n`);
  
  lines.push('## Chapter Details\n');
  lines.push('| Chapter | Title | Status | Sources | Output File |');
  lines.push('|---------|-------|--------|--------|-------------|');
  
  results.forEach(result => {
    const status = result.compiled ? '✅ Compiled' : '⏭️ Skipped';
    const sourceCount = result.sources.length;
    const outputFile = result.outputPath ? path.basename(result.outputPath) : '-';
    lines.push(`| ${result.chapter.chapter_number} | ${result.chapter.title} | ${status} | ${sourceCount} | ${outputFile} |`);
  });
  
  lines.push('\n## Source Selection Details\n');
  
  results.forEach(result => {
    if (result.sources.length === 0) return;
    
    lines.push(`### Chapter ${result.chapter.chapter_number}: ${result.chapter.title}\n`);
    result.sources.forEach((source, idx) => {
      lines.push(`${idx + 1}. **${source.title}**`);
      lines.push(`   - File: ${source.file_path}`);
      if (source.yaml.book_threading) {
        lines.push(`   - Book Threading: ${source.yaml.book_threading}`);
      }
      if (source.yaml.field_function?.content_purpose) {
        lines.push(`   - Content Purpose: ${source.yaml.field_function.content_purpose.substring(0, 100)}...`);
      }
      if (source.yaml.integration_points?.length) {
        lines.push(`   - Integration Points: ${source.yaml.integration_points.join(', ')}`);
      }
      if (source.inline_tags.length > 0) {
        lines.push(`   - Inline Tags: ${source.inline_tags.slice(0, 5).join(', ')}${source.inline_tags.length > 5 ? '...' : ''}`);
      }
      lines.push('');
    });
  });
  
  return lines.join('\n');
}

// Run compilation
compileBook()
  .then(() => {
    console.log('✅ Metadata-based compilation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Compilation failed:', error);
    process.exit(1);
  });

