#!/usr/bin/env tsx
/**
 * Manuscript Compiler
 * 
 * Compiles all book content files from 02g_generated_book_content folder
 * into a single manuscript document in order based on Table of Contents
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to book content directory
const BOOK_CONTENT_DIR = join(__dirname, '../09_PROCESSED/02g_generated_book_content');

interface ContentFile {
  path: string;
  title: string;
  content: string;
  order: number;
}

// Order of content based on Table of Contents
const CONTENT_ORDER: { [key: string]: number } = {
  // Front Matter
  'TABLE_OF_CONTENTS.md': 1,
  'SERIES_NOTE.md': 2,
  'PROLOGUE.md': 3,
  'INTRODUCTION.md': 4,
  
  // Part 1: The Cosmic Tapestry
  'CHAPTER_01_THE_STARDUST_WITHIN.md': 5,
  'INTERLUDE_FROM_STARDUST_TO_TECHNOLOGY.md': 6,
  'CHAPTER_02_THE_BODY_AS_ADVANCED_BIOLOGICAL_TECHNOLOGY.md': 7,
  'INTERLUDE_FROM_TECHNOLOGY_TO_INTELLIGENCE.md': 8,
  'CHAPTER_03_METABOLIC_INTELLIGENCE.md': 9,
  'INTERLUDE_THROUGH_COLLAPSE_AND_COHERENCE.md': 10,
  'CHAPTER_04_RESONANCE_AND_THE_ENERGETIC_UNIVERSE.md': 11,
  'INTERLUDE_FROM_STRUCTURE_TO_SOVEREIGNTY.md': 12,
  
  // Part 2: The Sovereign Self
  'CHAPTER_05_DEFINING_ENERGETIC_SOVEREIGNTY.md': 13,
  'INTERLUDE_FROM_SOVEREIGNTY_TO_MEMORY.md': 14,
  'CHAPTER_06_STEPPING_BEYOND_LIMITATIONS.md': 15,
  'INTERLUDE_FROM_MEMORY_TO_TRANSFORMATION.md': 16,
  'CHAPTER_07_THE_ALCHEMICAL_CURRENT.md': 17,
  'INTERLUDE_FROM_ALCHEMY_TO_DISINTEGRATION.md': 18,
  'CHAPTER_08_SOVEREIGN_DISINTEGRATION.md': 19,
  'INTERLUDE_FROM_SIGNAL_TO_FLOW.md': 20,
  
  // Part 3: Architecting Reality
  'CHAPTER_09_TEMPORAL_FLUIDITY.md': 21,
  'INTERLUDE_FROM_FLUIDITY_TO_LANGUAGE.md': 22,
  'CHAPTER_10_LANGUAGE_AS_SONIC_GRID.md': 23,
  'INTERLUDE_FROM_LANGUAGE_TO_ARCHITECTURE.md': 24,
  'CHAPTER_11_SACRED_ARCHITECTURE.md': 25,
  'INTERLUDE_FROM_ARCHITECTURE_TO_FIELD.md': 26,
  'CHAPTER_12_THE_SOVEREIGN_FIELD.md': 27,
  'INTERLUDE_FROM_FIELD_TO_AI.md': 28,
  'CHAPTER_13_AI_AND_BRIDGING_INTELLIGENCE.md': 29,
  'INTERLUDE_FROM_AI_TO_BLUEPRINT.md': 30,
  
  // Part 4: Embodying Sovereignty
  'CHAPTER_14_THE_LIVING_BLUEPRINT.md': 31,
  'INTERLUDE_FROM_BLUEPRINT_TO_BECOMING.md': 32,
  'CHAPTER_15_BEYOND_STARDUST.md': 33,
  
  // Back Matter
  'CONCLUSION.md': 34,
  'AFTERWORD_LIVING_SYSTEM_INTERFACE.md': 35,
  'EPILOGUE.md': 36,
};

// Appendices order
const APPENDIX_ORDER: { [key: string]: number } = {
  'APPENDIX_A_ORB_SYSTEM_REFERENCE_TABLE.md': 37,
  'APPENDIX_B_ORB_PERSONALITY_SYSTEM_OVERVIEW.md': 38,
  'APPENDIX_C_LANGUAGE_AND_DEFINITIONS.md': 39,
  'APPENDIX_D_SCROLLSTREAM_PRIMARY_PULSES.md': 40,
  'APPENDIX_E_ORB_AXIS_MAP.md': 41,
  'APPENDIX_F_SOMATIC_CODEX_DIAGRAM.md': 42,
  'APPENDIX_G_PRACTICAL_APPLICATIONS_GUIDE.md': 43,
  'APPENDIX_H_BIBLIOGRAPHY_AND_SOURCES.md': 44,
  'APPENDIX_I_RESONANCE_KERNEL_VALIDATION_AND_THEORETICAL_FOUNDATIONS.md': 45,
};

function stripYAML(content: string): string {
  const parsed = matter(content);
  return parsed.content.trim();
}

function getTitle(content: string, filename: string): string {
  const parsed = matter(content);
  if (parsed.data.title) {
    return parsed.data.title;
  }
  // Fallback: derive from filename
  return filename
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function compileManuscript(includeYAML: boolean = false): void {
  console.log('📚 Compiling manuscript...\n');
  
  const files: ContentFile[] = [];
  
  // Collect main content files
  for (const [filename, order] of Object.entries(CONTENT_ORDER)) {
    const filePath = join(BOOK_CONTENT_DIR, filename);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      const title = getTitle(content, filename);
      files.push({
        path: filePath,
        title,
        content: includeYAML ? content : stripYAML(content),
        order,
      });
      console.log(`✓ Added: ${title}`);
    } else {
      console.warn(`⚠ Missing: ${filename}`);
    }
  }
  
  // Collect appendices
  const appendicesDir = join(BOOK_CONTENT_DIR, 'appendices');
  for (const [filename, order] of Object.entries(APPENDIX_ORDER)) {
    const filePath = join(appendicesDir, filename);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      const title = getTitle(content, filename);
      files.push({
        path: filePath,
        title,
        content: includeYAML ? content : stripYAML(content),
        order,
      });
      console.log(`✓ Added: ${title}`);
    } else {
      console.warn(`⚠ Missing: ${filename}`);
    }
  }
  
  // Sort by order
  files.sort((a, b) => a.order - b.order);
  
  // Compile into single document
  let manuscript = `# Stardust to Sovereignty\n\n**Book 1: The Cosmic Tapestry**\n\n*Compiled: ${new Date().toISOString().split('T')[0]}*\n\n---\n\n`;
  
  for (const file of files) {
    // Skip adding title for Table of Contents as it already has its own heading
    if (file.title.includes('Table of Contents') || file.path.includes('TABLE_OF_CONTENTS')) {
      manuscript += '\n\n';
      manuscript += file.content;
      manuscript += '\n\n---\n\n';
    } else {
      manuscript += `\n\n# ${file.title}\n\n`;
      manuscript += file.content;
      manuscript += '\n\n---\n\n';
    }
  }
  
  // Write compiled manuscript
  const outputPath = join(__dirname, '../09_PROCESSED/STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md');
  writeFileSync(outputPath, manuscript, 'utf-8');
  
  console.log(`\n✅ Manuscript compiled successfully!`);
  console.log(`📄 Output: ${outputPath}`);
  console.log(`📊 Total sections: ${files.length}`);
  console.log(`📝 Total characters: ${manuscript.length.toLocaleString()}`);
}

// Run compiler
const includeYAML = process.argv.includes('--include-yaml');
compileManuscript(includeYAML);

