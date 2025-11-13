#!/usr/bin/env tsx

/**
 * Update V4 Manuscript to 02g Content Library
 * 
 * Splits V4 manuscript by sections, preserves existing YAML from 02g files,
 * updates content with V4 editorial changes, and identifies new content.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const V4_MANUSCRIPT = '/Users/gigi/S2S_RBI_Editorial_V3/S2S_Manuscript_V4_ready.md';
const TARGET_DIR = path.join(__dirname, '../09_PROCESSED/02g_generated_book_content');
const BACKUP_DIR = path.join(__dirname, '../09_PROCESSED/02g_generated_book_content_backup');

interface Section {
  title: string;
  content: string;
  lineStart: number;
  lineEnd: number;
  type: 'chapter' | 'interlude' | 'front_matter' | 'back_matter' | 'appendix';
}

interface UpdateResult {
  file: string;
  status: 'updated' | 'created' | 'not_found' | 'error';
  message?: string;
}

// Section markers with variations
const SECTION_PATTERNS = {
  chapter: /^# Chapter (\d+):\s*(.+)$/,
  interlude: /^# Interlude:\s*(.+)$/,
  series_note: /^# Series Note:\s*(.+)$/i,
  prologue: /^# Prologue:\s*(.+)$/i,
  introduction: /^# Introduction:\s*(.+)$/i,
  conclusion: /^# Conclusion:\s*(.+)$/i,
  afterword: /^# Afterword:\s*(.+)$/i,
  epilogue: /^# Epilogue:\s*(.+)$/i,
  appendix_a: /^# APPENDIX A\s+(.+)$/i,
  appendix_b: /^# Appendix B:\s*(.+)$/i,
  appendix_c: /^# APPENDIX C\s+(.+)$/i,
  appendix_d: /^# Primary Pulses$/,
  appendix_e: /^# Orb Axis Map$/,
  appendix_f: /^# Somatic Codex Diagram$/,
  appendix_g: /^# Appendix G:\s*(.+)$/i,
  appendix_h: /^# Appendix H:\s*(.+)$/i,
  appendix_i: /^# Appendix I:\s*(.+)$/i,
};

// File name mappings
const FILE_MAPPINGS: Record<string, string> = {
  'Series Note': 'SERIES_NOTE.md',
  'Prologue': 'PROLOGUE.md',
  'Introduction': 'INTRODUCTION.md',
  'Chapter 1': 'CHAPTER_01_THE_STARDUST_WITHIN.md',
  'Chapter 2': 'CHAPTER_02_THE_BODY_AS_ADVANCED_BIOLOGICAL_TECHNOLOGY.md',
  'Chapter 3': 'CHAPTER_03_METABOLIC_INTELLIGENCE.md',
  'Chapter 4': 'CHAPTER_04_RESONANCE_AND_THE_ENERGETIC_UNIVERSE.md',
  'Chapter 5': 'CHAPTER_05_DEFINING_ENERGETIC_SOVEREIGNTY.md',
  'Chapter 6': 'CHAPTER_06_STEPPING_BEYOND_LIMITATIONS.md',
  'Chapter 7': 'CHAPTER_07_THE_ALCHEMICAL_CURRENT.md',
  'Chapter 8': 'CHAPTER_08_SOVEREIGN_DISINTEGRATION.md',
  'Chapter 9': 'CHAPTER_09_TEMPORAL_FLUIDITY.md',
  'Chapter 10': 'CHAPTER_10_LANGUAGE_AS_SONIC_GRID.md',
  'Chapter 11': 'CHAPTER_11_SACRED_ARCHITECTURE.md',
  'Chapter 12': 'CHAPTER_12_THE_SOVEREIGN_FIELD.md',
  'Chapter 13': 'CHAPTER_13_AI_AND_BRIDGING_INTELLIGENCE.md',
  'Chapter 14': 'CHAPTER_14_THE_LIVING_BLUEPRINT.md',
  'Chapter 15': 'CHAPTER_15_BEYOND_STARDUST.md',
  'Conclusion': 'CONCLUSION.md',
  'Afterword': 'AFTERWORD_LIVING_SYSTEM_INTERFACE.md',
  'Epilogue': 'EPILOGUE.md',
  'Appendix A': 'appendices/APPENDIX_A_ORB_SYSTEM_REFERENCE_TABLE.md',
  'Appendix B': 'appendices/APPENDIX_B_ORB_PERSONALITY_SYSTEM_OVERVIEW.md',
  'Appendix C': 'appendices/APPENDIX_C_LANGUAGE_AND_DEFINITIONS.md',
  'Appendix D': 'appendices/APPENDIX_D_SCROLLSTREAM_PRIMARY_PULSES.md',
  'Appendix E': 'appendices/APPENDIX_E_ORB_AXIS_MAP.md',
  'Appendix F': 'appendices/APPENDIX_F_SOMATIC_CODEX_DIAGRAM.md',
  'Appendix G': 'appendices/APPENDIX_G_PRACTICAL_APPLICATIONS_GUIDE.md',
  'Appendix H': 'appendices/APPENDIX_H_BIBLIOGRAPHY_AND_SOURCES.md',
  'Appendix I': 'appendices/APPENDIX_I_RESONANCE_KERNEL_VALIDATION_AND_THEORETICAL_FOUNDATIONS.md',
};

// Interlude mappings
const INTERLUDE_MAPPINGS: Record<string, string> = {
  'From Stardust to Technology': 'INTERLUDE_FROM_STARDUST_TO_TECHNOLOGY.md',
  'From Technology to Intelligence': 'INTERLUDE_FROM_TECHNOLOGY_TO_INTELLIGENCE.md',
  'Through Collapse and Coherence': 'INTERLUDE_THROUGH_COLLAPSE_AND_COHERENCE.md',
  'From Structure to Sovereignty': 'INTERLUDE_FROM_STRUCTURE_TO_SOVEREIGNTY.md',
  'From Sovereignty to Memory': 'INTERLUDE_FROM_SOVEREIGNTY_TO_MEMORY.md',
  'From Memory to Transformation': 'INTERLUDE_FROM_MEMORY_TO_TRANSFORMATION.md',
  'From Alchemy to Disintegration': 'INTERLUDE_FROM_ALCHEMY_TO_DISINTEGRATION.md',
  'From Signal to Flow': 'INTERLUDE_FROM_SIGNAL_TO_FLOW.md',
  'From Fluidity to Language': 'INTERLUDE_FROM_FLUIDITY_TO_LANGUAGE.md',
  'From Language to Architecture': 'INTERLUDE_FROM_LANGUAGE_TO_ARCHITECTURE.md',
  'From Architecture to Field': 'INTERLUDE_FROM_ARCHITECTURE_TO_FIELD.md',
  'From Field to AI': 'INTERLUDE_FROM_FIELD_TO_AI.md',
  'From AI to Blueprint': 'INTERLUDE_FROM_AI_TO_BLUEPRINT.md',
  'From Blueprint to Becoming': 'INTERLUDE_FROM_BLUEPRINT_TO_BECOMING.md',
};

function parseManuscript(): Section[] {
  console.log('📖 Parsing V4 manuscript...\n');
  
  const content = fs.readFileSync(V4_MANUSCRIPT, 'utf-8');
  const lines = content.split('\n');
  const sections: Section[] = [];
  
  let currentSection: Section | null = null;
  let currentContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for chapter
    const chapterMatch = line.match(SECTION_PATTERNS.chapter);
    if (chapterMatch) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: `Chapter ${chapterMatch[1]}: ${chapterMatch[2]}`,
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'chapter',
      };
      currentContent = [];
      // Don't include the header line in content - skip it
      continue;
    }
    
    // Check for interlude
    const interludeMatch = line.match(SECTION_PATTERNS.interlude);
    if (interludeMatch) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: `Interlude: ${interludeMatch[1]}`,
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'interlude',
      };
      currentContent = [];
      continue;
    }
    
    // Check for front matter
    if (line.match(SECTION_PATTERNS.series_note)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Series Note',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'front_matter',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.prologue)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Prologue',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'front_matter',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.introduction)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Introduction',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'front_matter',
      };
      currentContent = [];
      continue;
    }
    
    // Check for back matter
    if (line.match(SECTION_PATTERNS.conclusion)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Conclusion',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'back_matter',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.afterword)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Afterword',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'back_matter',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.epilogue)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Epilogue',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'back_matter',
      };
      currentContent = [];
      continue;
    }
    
    // Check for appendices
    if (line.match(SECTION_PATTERNS.appendix_a)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Appendix A',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'appendix',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.appendix_b)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Appendix B',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'appendix',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.appendix_c)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Appendix C',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'appendix',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.appendix_d)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Appendix D',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'appendix',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.appendix_e)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Appendix E',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'appendix',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.appendix_f)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Appendix F',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'appendix',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.appendix_g)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Appendix G',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'appendix',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.appendix_h)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Appendix H',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'appendix',
      };
      currentContent = [];
      continue;
    }
    
    if (line.match(SECTION_PATTERNS.appendix_i)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      currentSection = {
        title: 'Appendix I',
        content: '',
        lineStart: i,
        lineEnd: i,
        type: 'appendix',
      };
      currentContent = [];
      continue;
    }
    
    // Accumulate content
    if (currentSection) {
      currentContent.push(line);
    }
  }
  
  // Add final section
  if (currentSection) {
    currentSection.content = currentContent.join('\n');
    currentSection.lineEnd = lines.length - 1;
    sections.push(currentSection);
  }
  
  console.log(`✅ Found ${sections.length} sections\n`);
  return sections;
}

function getFileName(section: Section): string | null {
  if (section.type === 'chapter') {
    const chapterNum = section.title.match(/Chapter (\d+):/)?.[1];
    if (chapterNum) {
      return FILE_MAPPINGS[`Chapter ${chapterNum}`] || null;
    }
  }
  
  if (section.type === 'interlude') {
    const interludeTitle = section.title.replace('Interlude: ', '');
    return INTERLUDE_MAPPINGS[interludeTitle] || null;
  }
  
  if (section.type === 'front_matter' || section.type === 'back_matter') {
    return FILE_MAPPINGS[section.title] || null;
  }
  
  if (section.type === 'appendix') {
    return FILE_MAPPINGS[section.title] || null;
  }
  
  return null;
}

function updateFile(section: Section, fileName: string): UpdateResult {
  const filePath = path.join(TARGET_DIR, fileName);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return {
      file: fileName,
      status: 'not_found',
      message: `File not found: ${fileName}`,
    };
  }
  
  try {
    // Read existing file
    const existingContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content: existingBody } = matter(existingContent);
    
    // Update version and modified date
    const updatedFrontmatter = {
      ...frontmatter,
      version: 'V4-editorial',
      modified: new Date().toISOString().split('T')[0],
    };
    
    // Create new content with preserved YAML and V4 body
    const newContent = matter.stringify(section.content.trim(), updatedFrontmatter);
    
    // Write updated file
    fs.writeFileSync(filePath, newContent, 'utf-8');
    
    return {
      file: fileName,
      status: 'updated',
      message: `Updated with V4 content (${section.content.length} chars)`,
    };
  } catch (error: any) {
    return {
      file: fileName,
      status: 'error',
      message: `Error: ${error.message}`,
    };
  }
}

function createBackup() {
  console.log('📦 Creating backup...\n');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  
  // Copy entire directory
  fs.cpSync(TARGET_DIR, backupPath, { recursive: true });
  
  console.log(`✅ Backup created: ${backupPath}\n`);
  return backupPath;
}

function main() {
  console.log('🚀 V4 Manuscript Update Script\n');
  console.log('=' .repeat(60) + '\n');
  
  // Create backup
  const backupPath = createBackup();
  
  // Parse V4 manuscript
  const sections = parseManuscript();
  
  // Process each section
  const results: UpdateResult[] = [];
  const newSections: Section[] = [];
  
  console.log('📝 Processing sections...\n');
  
  for (const section of sections) {
    const fileName = getFileName(section);
    
    if (!fileName) {
      console.log(`⚠️  No file mapping for: ${section.title}`);
      newSections.push(section);
      continue;
    }
    
    const result = updateFile(section, fileName);
    results.push(result);
    
    if (result.status === 'updated') {
      console.log(`✅ ${fileName}`);
    } else if (result.status === 'not_found') {
      console.log(`❌ ${fileName} - ${result.message}`);
      newSections.push(section);
    } else {
      console.log(`⚠️  ${fileName} - ${result.message}`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:\n');
  console.log(`✅ Updated: ${results.filter(r => r.status === 'updated').length}`);
  console.log(`❌ Not Found: ${results.filter(r => r.status === 'not_found').length}`);
  console.log(`⚠️  Errors: ${results.filter(r => r.status === 'error').length}`);
  console.log(`🆕 New Sections: ${newSections.length}`);
  console.log(`\n💾 Backup: ${backupPath}\n`);
  
  // Report new sections
  if (newSections.length > 0) {
    console.log('🆕 New Sections Found (need manual review):\n');
    for (const section of newSections) {
      console.log(`  - ${section.title} (${section.type})`);
    }
    console.log('');
  }
  
  console.log('✨ Done! Review changes and sync to database when ready.\n');
}

main();

