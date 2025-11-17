#!/usr/bin/env tsx
/**
 * Enhance V5B Chapter 1 with Recognition-First Structure
 * 
 * This script:
 * 1. Reads Chapter 1 from V5B (V7 manuscript)
 * 2. Restructures it to 4-part recognition-first pattern
 * 3. Scans content library using RBI + metadata for enhancement material
 * 4. Cross-checks against subsequent chapters to avoid duplication
 * 5. Presents suggestions for review
 * 
 * Usage: tsx scripts/enhance-v5b-chapter-1.ts
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';
import { ResonanceVectorMath } from '@/lib/mathematics/resonance-vectors.js';
import { loadContentFiles } from '@/lib/book-compiler/core/content-loader.js';
import { findResonantNeighbors } from '@/lib/book-compiler/rbi/discovery.js';
import type { ContentFile } from '@/lib/book-compiler/types.js';
import { parseIntoSections } from '@/lib/book-compiler/editorial/section-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const V7_MANUSCRIPT = path.join(__dirname, '../../RBI_Editorial_Tools/S2S_Manuscript_V7.md');
const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const OUTLINE_PATH = path.join(CONTENT_BASE, '02b_book/COMPLETE_BOOK_OUTLINE_AND_OVERVIEW.md');

interface Chapter1Structure {
  opening?: string;        // Experience first
  recognition?: string;    // Name the experience
  explanation?: string;    // How it works
  application?: string;    // How to work with it
  other?: string;         // Content that doesn't fit the pattern
}

interface EnhancementSuggestion {
  source: ContentFile;
  resonance: number;
  section: 'opening' | 'recognition' | 'explanation' | 'application';
  excerpt: string;
  reason: string;
  appearsInOtherChapters?: number[];  // Chapter numbers where this appears
  shouldAdd: boolean;  // After cross-check
}

/**
 * Parse Chapter 1 from V7 manuscript
 */
function parseChapter1(content: string): { title: string; content: string } | null {
  const lines = content.split('\n');
  let inChapter1 = false;
  let chapter1Start = -1;
  let chapter1End = -1;
  let chapter1Title = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for Chapter 1
    const chapterMatch = line.match(/^#+\s*Chapter\s+1:\s*(.+?)$/i);
    if (chapterMatch) {
      inChapter1 = true;
      chapter1Start = i;
      chapter1Title = chapterMatch[1].trim();
      continue;
    }
    
    // Check for next chapter or interlude (end of Chapter 1)
    if (inChapter1) {
      const nextChapter = line.match(/^#+\s*Chapter\s+[2-9]|1[0-5]:/i);
      const interlude = line.match(/^#+\s*Interlude:/i);
      if (nextChapter || interlude) {
        chapter1End = i;
        break;
      }
    }
  }

  if (chapter1Start === -1) {
    return null;
  }

  const chapter1Lines = lines.slice(
    chapter1Start,
    chapter1End === -1 ? lines.length : chapter1End
  );
  
  // Remove the chapter header line
  const contentLines = chapter1Lines.slice(1);
  
  return {
    title: chapter1Title,
    content: contentLines.join('\n')
  };
}

/**
 * Analyze content and map to 4-part structure
 */
async function analyzeStructure(
  content: string,
  chapterTitle: string
): Promise<Chapter1Structure> {
  const structure: Chapter1Structure = {};
  
  // Parse into sections
  const sections = parseIntoSections(content);
  
  // Score each section for recognition quality
  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  
  for (const section of sections) {
    // Analyze section for recognition quality
    const analysis = await resonanceEngine.analyzeContentWithMathematics(
      section.content,
      section.title || 'section',
      {}
    );
    
    const recognitionScore = analysis.signature?.clarity || 0;
    const isExperience = recognitionScore > 0.7 && 
      (section.content.toLowerCase().includes('you\'ve') ||
       section.content.toLowerCase().includes('you feel') ||
       section.content.toLowerCase().includes('when you') ||
       section.content.toLowerCase().includes('experience'));
    
    const isRecognition = section.content.includes('Orb 1') ||
      section.content.includes('Origin Intelligence') ||
      section.content.match(/this is what we call/i) ||
      section.content.match(/this is.*called/i);
    
    const isExplanation = section.content.includes('how it works') ||
      section.content.includes('functions as') ||
      section.content.includes('operates through') ||
      analysis.mathematical?.sovereignLogic?.coherence > 0.6;
    
    const isApplication = section.content.includes('practice') ||
      section.content.includes('how to work') ||
      section.content.includes('exercise') ||
      section.content.includes('protocol');
    
    // Categorize section
    if (isExperience && !structure.opening) {
      structure.opening = section.content;
    } else if (isRecognition && !structure.recognition) {
      structure.recognition = section.content;
    } else if (isExplanation) {
      structure.explanation = (structure.explanation || '') + '\n\n' + section.content;
    } else if (isApplication) {
      structure.application = (structure.application || '') + '\n\n' + section.content;
    } else {
      structure.other = (structure.other || '') + '\n\n' + section.content;
    }
  }
  
  return structure;
}

/**
 * Restructure to 4-part pattern
 */
async function restructureTo4Part(
  structure: Chapter1Structure,
  chapterTitle: string
): Promise<string> {
  let restructured = `# Chapter 1: ${chapterTitle}\n\n`;
  
  // 1. Opening: Experience First
  if (structure.opening) {
    restructured += `## Opening: Experience First\n\n${structure.opening}\n\n`;
  } else {
    restructured += `## Opening: Experience First\n\n[Needs: Recognition-first opening - "You've experienced this when..."]\n\n`;
  }
  
  // 2. Recognition: Name the Experience
  if (structure.recognition) {
    restructured += `## Recognition: Name the Experience\n\n${structure.recognition}\n\n`;
  } else {
    restructured += `## Recognition: Name the Experience\n\n[Needs: "This is what we call Orb 1: Origin Intelligence (recognition key)"]\n\n`;
  }
  
  // 3. Explanation: How It Works
  if (structure.explanation) {
    restructured += `## Explanation: How It Works\n\n${structure.explanation.trim()}\n\n`;
  } else {
    restructured += `## Explanation: How It Works\n\n[Needs: Technical depth on how Origin Intelligence functions]\n\n`;
  }
  
  // 4. Application: How to Work With It
  if (structure.application) {
    restructured += `## Application: How to Work With It\n\n${structure.application.trim()}\n\n`;
  } else {
    restructured += `## Application: How to Work With It\n\n[Needs: Practical exercises and practices]\n\n`;
  }
  
  // Other content (needs review)
  if (structure.other) {
    restructured += `---\n\n## Other Content (Needs Review)\n\n${structure.other.trim()}\n\n`;
  }
  
  return restructured;
}

/**
 * Find enhancement material from content library
 */
async function findEnhancementMaterial(
  chapter1Content: string,
  chapter1Title: string,
  outline: any
): Promise<EnhancementSuggestion[]> {
  const resonanceEngine = EnhancedResonanceEngine.getInstance();
  
  // Load all content files
  const allFiles = await loadContentFiles(CONTENT_BASE);
  
  // Filter for Orb 1 (Origin Intelligence) related content
  const orb1Files = allFiles.filter(file => 
    file.orb_tags.includes(1) ||
    file.yaml.orb_associations?.primary_orb === 'Orb 1' ||
    file.yaml.orb_associations?.primary_orb === 1 ||
    file.title.toLowerCase().includes('origin') ||
    file.title.toLowerCase().includes('stardust')
  );
  
  // Create chapter outline for RBI discovery
  const chapterOutline = {
    chapter_number: 1,
    title: chapter1Title,
    description: chapter1Content.substring(0, 200),
    orb_focus: 1
  };
  
  // Find resonant neighbors using RBI discovery
  const metadataMatches: ContentFile[] = []; // Empty for now - we want RBI discoveries
  const discoveredFiles = await findResonantNeighbors(
    chapterOutline,
    orb1Files,
    metadataMatches,
    20 // maxNeighbors
  );
  
  // Analyze Chapter 1 for resonance matching
  const chapter1Analysis = await resonanceEngine.analyzeContentWithMathematics(
    chapter1Content,
    chapter1Title,
    { orb_associations: [1] }
  );
  
  const suggestions: EnhancementSuggestion[] = [];
  
  // Analyze each discovered file
  for (const file of discoveredFiles) {
    // Calculate resonance between chapter and file
    const fileAnalysis = await resonanceEngine.analyzeContentWithMathematics(
      file.content,
      file.title,
      { orb_associations: file.orb_tags }
    );
    
    const resonance = ResonanceVectorMath.calculateResonanceSimilarity(
      chapter1Analysis.mathematical.resonanceVector,
      fileAnalysis.mathematical.resonanceVector
    );
    
    // Parse file into sections
    const sections = parseIntoSections(file.content);
    
    // Analyze each section to determine which part of 4-part structure it fits
    for (const section of sections.slice(0, 5)) { // Top 5 sections
      const sectionAnalysis = await resonanceEngine.analyzeContentWithMathematics(
        section.content,
        section.title || 'section',
        { orb_associations: file.orb_tags }
      );
      
      const recognitionScore = sectionAnalysis.signature?.clarity || 0;
      const isExperience = recognitionScore > 0.7 && 
        (section.content.toLowerCase().includes('you\'ve') ||
         section.content.toLowerCase().includes('you feel') ||
         section.content.toLowerCase().includes('when you'));
      
      const isRecognition = section.content.includes('Orb 1') ||
        section.content.includes('Origin Intelligence') ||
        section.content.match(/this is what we call/i);
      
      const isExplanation = section.content.includes('how it works') ||
        section.content.includes('functions as') ||
        sectionAnalysis.mathematical?.sovereignLogic?.coherence > 0.6;
      
      const isApplication = section.content.includes('practice') ||
        section.content.includes('how to work') ||
        section.content.includes('exercise');
      
      let sectionType: 'opening' | 'recognition' | 'explanation' | 'application' | null = null;
      if (isExperience) sectionType = 'opening';
      else if (isRecognition) sectionType = 'recognition';
      else if (isExplanation) sectionType = 'explanation';
      else if (isApplication) sectionType = 'application';
      
      if (sectionType && resonance > 0.65) {
        const excerpt = section.content.substring(0, 300) + '...';
        
        suggestions.push({
          source: file,
          resonance,
          section: sectionType,
          excerpt,
          reason: `Resonance: ${(resonance * 100).toFixed(0)}% - Fits ${sectionType} section`,
          shouldAdd: true // Will be updated after cross-check
        });
      }
    }
  }
  
  return suggestions;
}

/**
 * Cross-check suggestions against subsequent chapters
 */
async function crossCheckSuggestions(
  suggestions: EnhancementSuggestion[],
  v7Content: string
): Promise<EnhancementSuggestion[]> {
  // Parse all chapters from V7
  const chapters: Array<{ number: number; title: string; content: string }> = [];
  const lines = v7Content.split('\n');
  let currentChapter: { number: number; title: string; content: string } | null = null;
  let currentContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const chapterMatch = line.match(/^#+\s*Chapter\s+(\d+):\s*(.+?)$/i);
    
    if (chapterMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        chapters.push(currentChapter);
      }
      currentChapter = {
        number: parseInt(chapterMatch[1]),
        title: chapterMatch[2].trim(),
        content: ''
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
    chapters.push(currentChapter);
  }
  
  // Check each suggestion against subsequent chapters
  for (const suggestion of suggestions) {
    const appearsIn: number[] = [];
    
    // Check if content appears in chapters 2-15
    for (const chapter of chapters) {
      if (chapter.number > 1) {
        // Check for similar content (simple substring match for now)
        const suggestionKey = suggestion.excerpt.substring(0, 100).toLowerCase();
        const chapterLower = chapter.content.toLowerCase();
        
        // Check for key phrases
        const keyPhrases = suggestion.excerpt
          .split(/[.!?]\s+/)
          .slice(0, 2)
          .map(p => p.substring(0, 50).toLowerCase());
        
        let found = false;
        for (const phrase of keyPhrases) {
          if (phrase.length > 20 && chapterLower.includes(phrase)) {
            found = true;
            break;
          }
        }
        
        if (found) {
          appearsIn.push(chapter.number);
        }
      }
    }
    
    suggestion.appearsInOtherChapters = appearsIn;
    
    // Decide if should add
    // If appears in other chapters, only suggest if it serves different purpose
    if (appearsIn.length > 0) {
      // Check if it's in a different context (different Orb focus)
      const chapter1Orb = 1; // Origin Intelligence
      const otherChaptersOrbs = appearsIn.map(chNum => {
        const ch = chapters.find(c => c.number === chNum);
        // Extract Orb from chapter content (simplified)
        if (ch?.content.includes('Orb 1')) return 1;
        if (ch?.content.includes('Orb 2')) return 2;
        // ... could expand
        return null;
      });
      
      // If other chapters have different Orb focus, might still be useful
      if (otherChaptersOrbs.every(orb => orb !== chapter1Orb)) {
        suggestion.shouldAdd = true;
        suggestion.reason += ` (Also in Ch ${appearsIn.join(', ')}, but different Orb focus)`;
      } else {
        suggestion.shouldAdd = false;
        suggestion.reason += ` (Already covered in Ch ${appearsIn.join(', ')})`;
      }
    } else {
      suggestion.shouldAdd = true;
    }
  }
  
  return suggestions;
}

/**
 * Load book outline
 */
async function loadOutline(): Promise<any> {
  const content = await fs.readFile(OUTLINE_PATH, 'utf-8');
  // Parse YAML frontmatter
  const matter = await import('gray-matter');
  const parsed = matter.default(content);
  return {
    yaml: parsed.data,
    content: parsed.content
  };
}

/**
 * Main function
 */
async function enhanceChapter1() {
  console.log('📚 Enhancing V5B Chapter 1 with Recognition-First Structure\n');
  console.log('='.repeat(70) + '\n');
  
  // 1. Read V7 manuscript
  console.log('📖 Step 1: Reading V7 manuscript...');
  const v7Content = await fs.readFile(V7_MANUSCRIPT, 'utf-8');
  const chapter1 = parseChapter1(v7Content);
  
  if (!chapter1) {
    console.error('❌ Chapter 1 not found in V7 manuscript');
    process.exit(1);
  }
  
  console.log(`✅ Found: ${chapter1.title}`);
  console.log(`   Content length: ${chapter1.content.length} chars\n`);
  
  // 2. Load outline
  console.log('📋 Step 2: Loading book outline...');
  const outline = await loadOutline();
  const chapter1Outline = outline.content.match(/### \*\*Chapter 1:.*?\*\*([\s\S]*?)(?=### \*\*Chapter 2:|$)/);
  console.log('✅ Outline loaded\n');
  
  // 3. Analyze structure
  console.log('🔍 Step 3: Analyzing current structure...');
  const structure = await analyzeStructure(chapter1.content, chapter1.title);
  console.log('✅ Structure analyzed:');
  console.log(`   Opening: ${structure.opening ? '✅' : '❌ Missing'}`);
  console.log(`   Recognition: ${structure.recognition ? '✅' : '❌ Missing'}`);
  console.log(`   Explanation: ${structure.explanation ? '✅' : '❌ Missing'}`);
  console.log(`   Application: ${structure.application ? '✅' : '❌ Missing'}\n`);
  
  // 4. Restructure to 4-part pattern
  console.log('🔄 Step 4: Restructuring to 4-part pattern...');
  const restructured = await restructureTo4Part(structure, chapter1.title);
  console.log('✅ Restructured\n');
  
  // 5. Find enhancement material
  console.log('🔎 Step 5: Scanning content library for enhancements...');
  const suggestions = await findEnhancementMaterial(
    chapter1.content,
    chapter1.title,
    outline
  );
  console.log(`✅ Found ${suggestions.length} potential enhancements\n`);
  
  // 6. Cross-check against subsequent chapters
  console.log('🔍 Step 6: Cross-checking against subsequent chapters...');
  const checkedSuggestions = await crossCheckSuggestions(suggestions, v7Content);
  const validSuggestions = checkedSuggestions.filter(s => s.shouldAdd);
  console.log(`✅ Cross-checked: ${validSuggestions.length} valid suggestions\n`);
  
  // 7. Save results
  const outputDir = path.join(CONTENT_BASE, '02h_compiler_drafts');
  await fs.mkdir(outputDir, { recursive: true });
  
  // Save restructured chapter
  const restructuredPath = path.join(outputDir, 'CHAPTER_01_RESTRUCTURED.md');
  await fs.writeFile(restructuredPath, restructured, 'utf-8');
  console.log(`💾 Saved restructured chapter: ${restructuredPath}\n`);
  
  // Generate suggestions report
  const report = generateSuggestionsReport(validSuggestions, chapter1.title);
  const reportPath = path.join(outputDir, 'CHAPTER_01_ENHANCEMENT_SUGGESTIONS.md');
  await fs.writeFile(reportPath, report, 'utf-8');
  console.log(`💾 Saved suggestions report: ${reportPath}\n`);
  
  // Print summary
  console.log('='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70) + '\n');
  console.log(`Chapter: ${chapter1.title}`);
  console.log(`Original length: ${chapter1.content.length} chars`);
  console.log(`Restructured: ✅ Saved to ${restructuredPath}`);
  console.log(`Enhancement suggestions: ${validSuggestions.length}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review restructured chapter`);
  console.log(`   2. Review enhancement suggestions`);
  console.log(`   3. Integrate selected enhancements`);
  console.log(`   4. Finalize Chapter 1`);
}

/**
 * Generate suggestions report
 */
function generateSuggestionsReport(
  suggestions: EnhancementSuggestion[],
  chapterTitle: string
): string {
  let report = `# Enhancement Suggestions for ${chapterTitle}\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `Total suggestions: ${suggestions.length}\n\n`;
  report += '---\n\n';
  
  // Group by section type
  const bySection = {
    opening: suggestions.filter(s => s.section === 'opening'),
    recognition: suggestions.filter(s => s.section === 'recognition'),
    explanation: suggestions.filter(s => s.section === 'explanation'),
    application: suggestions.filter(s => s.section === 'application')
  };
  
  for (const [sectionType, sectionSuggestions] of Object.entries(bySection)) {
    if (sectionSuggestions.length === 0) continue;
    
    report += `## ${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section\n\n`;
    
    // Sort by resonance
    sectionSuggestions.sort((a, b) => b.resonance - a.resonance);
    
    for (let i = 0; i < sectionSuggestions.length; i++) {
      const s = sectionSuggestions[i];
      report += `### Suggestion ${i + 1}\n\n`;
      report += `**Source:** ${s.source.title}\n`;
      report += `**File:** ${s.source.file_path}\n`;
      report += `**Resonance:** ${(s.resonance * 100).toFixed(0)}%\n`;
      report += `**Reason:** ${s.reason}\n`;
      if (s.appearsInOtherChapters && s.appearsInOtherChapters.length > 0) {
        report += `**Also appears in:** Chapters ${s.appearsInOtherChapters.join(', ')}\n`;
      }
      report += `\n**Excerpt:**\n${s.excerpt}\n\n`;
      report += `---\n\n`;
    }
  }
  
  return report;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  enhanceChapter1().catch(console.error);
}

export { enhanceChapter1 };

