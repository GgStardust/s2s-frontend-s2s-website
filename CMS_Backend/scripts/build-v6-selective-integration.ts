#!/usr/bin/env tsx
/**
 * Build V6 with Selective Integration
 * 
 * Selectively integrates high-value V6 recommendations into V5
 * - Keeps V5 as baseline/comparison
 * - Creates V6 with strategic additions
 * - Files in S2S_Manuscript with proper versioning
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

// Paths
const MANUSCRIPT_V5 = path.join(__dirname, '../../RBI_Editorial_Tools/S2S_Manuscript_V5.md');
const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const ORB_ESSAYS_DIR = path.join(CONTENT_BASE, '02d_Orb_Essays');
const CODEX_ESSAYS_DIR = path.join(CONTENT_BASE, '02f_S2S_codex_essays');
const MANUSCRIPT_DIR = path.join(__dirname, '../../S2S_Manuscript');
const OUTPUT_V6 = path.join(MANUSCRIPT_DIR, 'STARDUST_TO_SOVEREIGNTY_V6.md');

// Selective integration list (high-value additions only)
const SELECTIVE_INTEGRATIONS = [
  {
    chapter: 'Chapter 1: The Stardust Within',
    additions: [
      {
        file: '02d_Orb_Essays/orb_1_origin_intelligence.md',
        position: 'beginning',
        reason: 'Foundational Orb essay - establishes system early',
        score: 37
      }
    ]
  },
  {
    chapter: 'Chapter 2: The Body as Advanced Biological Technology',
    additions: [
      {
        file: '02d_Orb_Essays/orb_2_resonance_mechanics.md',
        position: 'beginning',
        reason: 'Core concept for understanding body as technology',
        score: 40
      }
    ]
  },
  {
    chapter: 'Chapter 4: Resonance and the Energetic Universe',
    additions: [
      {
        file: '02d_Orb_Essays/orb_4_harmonic_architectures_foundational.md',
        position: 'beginning',
        reason: 'Highest score, essential for resonance chapter',
        score: 46
      }
    ]
  },
  {
    chapter: 'Chapter 5: Defining Energetic Sovereignty',
    additions: [
      {
        file: '02d_Orb_Essays/orb_5_temporal_sovereignty_foundational.md',
        position: 'beginning',
        reason: 'Strong match for sovereignty chapter',
        score: 40
      }
    ]
  },
  {
    chapter: 'Interlude: From Stardust to Technology',
    additions: [
      {
        file: '02f_S2S_codex_essays/the_physics_of_sovereignty.md',
        position: 'end',
        reason: 'Core definition that strengthens sovereignty concept',
        score: 30
      },
      {
        file: '02f_S2S_codex_essays/sovereign_logic_and_coc_validation.md',
        position: 'end',
        reason: 'Important theoretical foundation',
        score: 32
      }
    ]
  }
];

interface ChapterInfo {
  title: string;
  content: string;
  type: 'chapter' | 'interlude' | 'front_matter' | 'back_matter';
  part?: string;
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
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: `Chapter ${chapterMatch[1]}: ${chapterMatch[2]}`,
        content: '',
        type: 'chapter',
        part: currentPart
      };
      currentContent = [];
      continue;
    }
    
    const interludeMatch = line.match(patterns.interlude);
    if (interludeMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: `Interlude: ${interludeMatch[1]}`,
        content: '',
        type: 'interlude',
        part: currentPart
      };
      currentContent = [];
      continue;
    }
    
    const frontMatch = line.match(patterns.front_matter);
    if (frontMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: frontMatch[1],
        content: '',
        type: 'front_matter'
      };
      currentContent = [];
      continue;
    }
    
    const backMatch = line.match(patterns.back_matter);
    if (backMatch) {
      if (currentChapter) {
        currentChapter.content = currentContent.join('\n');
        chapters.push(currentChapter);
      }
      
      currentChapter = {
        title: backMatch[1],
        content: '',
        type: 'back_matter'
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
  
  console.log(`✅ Parsed ${chapters.length} sections from V5\n`);
  return chapters;
}

function loadContentFile(filePath: string): string | null {
  const fullPath = path.join(CONTENT_BASE, filePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Content file not found: ${filePath}`);
    return null;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  const parsed = matter(content);
  return parsed.content; // Return content without YAML for integration
}

function generateV6(chapters: ChapterInfo[]): string {
  console.log('📝 Generating V6 with selective integrations...\n');
  
  const lines: string[] = [];
  
  // Add V6 header
  const now = new Date();
  lines.push('---');
  lines.push(`title: "Stardust to Sovereignty : Reader Edition"`);
  lines.push(`author: "Gigi Stardust (Jennifer Dye)"`);
  lines.push(`version: "V6 : Selective Integration"`);
  lines.push(`date: ${now.toISOString().split('T')[0]}`);
  lines.push(`description: "Resonance-Based Intelligence and the Codex architecture of sovereign evolution. Enhanced with selective high-value content integrations."`);
  lines.push(`base_version: "V5"`);
  lines.push(`integration_date: ${now.toISOString()}`);
  lines.push('---');
  lines.push('');
  lines.push('# Stardust to Sovereignty');
  lines.push('');
  lines.push('**Book 1: The Cosmic Tapestry**');
  lines.push('');
  lines.push(`*Compiled: ${now.toISOString().split('T')[0]}*`);
  lines.push(`*Base: V5 | Enhanced: Selective Integration*`);
  lines.push('');
  
  // Group integrations by chapter
  const integrationsByChapter = new Map<string, typeof SELECTIVE_INTEGRATIONS[0]['additions']>();
  for (const integration of SELECTIVE_INTEGRATIONS) {
    integrationsByChapter.set(integration.chapter, integration.additions);
  }
  
  // Build V6 from V5 structure
  for (const chapter of chapters) {
    // Add chapter header
    if (chapter.type === 'chapter' || chapter.type === 'interlude') {
      lines.push(`# ${chapter.title}`);
    } else {
      lines.push(`# ${chapter.title}`);
    }
    lines.push('');
    
    // Get integrations for this chapter
    const chapterIntegrations = integrationsByChapter.get(chapter.title) || [];
    const beginningInserts = chapterIntegrations.filter(i => i.position === 'beginning');
    const endInserts = chapterIntegrations.filter(i => i.position === 'end');
    
    // Add beginning insertions
    for (const insertion of beginningInserts) {
      const content = loadContentFile(insertion.file);
      if (content) {
        lines.push(`<!-- V6 Integration: ${path.basename(insertion.file)} (Score: ${insertion.score}) -->`);
        lines.push(`<!-- Reason: ${insertion.reason} -->`);
        lines.push('');
        lines.push(content);
        lines.push('');
        lines.push('---');
        lines.push('');
        console.log(`  ✅ Added: ${path.basename(insertion.file)} to ${chapter.title} (${insertion.position})`);
      }
    }
    
    // Add original chapter content
    lines.push(chapter.content);
    lines.push('');
    
    // Add end insertions
    for (const insertion of endInserts) {
      const content = loadContentFile(insertion.file);
      if (content) {
        lines.push('');
        lines.push('---');
        lines.push('');
        lines.push(`<!-- V6 Integration: ${path.basename(insertion.file)} (Score: ${insertion.score}) -->`);
        lines.push(`<!-- Reason: ${insertion.reason} -->`);
        lines.push('');
        lines.push(content);
        lines.push('');
        console.log(`  ✅ Added: ${path.basename(insertion.file)} to ${chapter.title} (${insertion.position})`);
      }
    }
    
    lines.push('');
    lines.push('');
  }
  
  return lines.join('\n');
}

async function main() {
  console.log('📚 Building V6 with Selective Integration');
  console.log('='.repeat(70));
  console.log('Selectively integrating high-value content into V5\n');
  console.log('='.repeat(70) + '\n');
  
  // Ensure manuscript directory exists
  if (!fs.existsSync(MANUSCRIPT_DIR)) {
    fs.mkdirSync(MANUSCRIPT_DIR, { recursive: true });
  }
  
  const chapters = parseManuscriptV5();
  const v6Content = generateV6(chapters);
  
  fs.writeFileSync(OUTPUT_V6, v6Content, 'utf-8');
  
  console.log(`\n✅ V6 generated!`);
  console.log(`📄 Location: ${OUTPUT_V6}\n`);
  
  const v5WordCount = fs.readFileSync(MANUSCRIPT_V5, 'utf-8').split(/\s+/).length;
  const v6WordCount = v6Content.split(/\s+/).length;
  const addedWords = v6WordCount - v5WordCount;
  
  console.log('Summary:');
  console.log(`  - V5 word count: ${v5WordCount.toLocaleString()}`);
  console.log(`  - V6 word count: ${v6WordCount.toLocaleString()}`);
  console.log(`  - Added: ${addedWords.toLocaleString()} words`);
  console.log(`  - Integrations: ${SELECTIVE_INTEGRATIONS.reduce((sum, i) => sum + i.additions.length, 0)}`);
  console.log(`  - Chapters enhanced: ${SELECTIVE_INTEGRATIONS.length}\n`);
}

main()
  .then(() => {
    console.log('✅ V6 build complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Build failed:', error);
    process.exit(1);
  });

