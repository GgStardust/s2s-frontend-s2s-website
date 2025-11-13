#!/usr/bin/env tsx
/**
 * Reader-Friendly Manuscript Compiler
 * 
 * Compiles all book content into a beautifully formatted, reader-friendly version
 * optimized for digital sharing with test readers
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
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
  type: 'front_matter' | 'chapter' | 'interlude' | 'back_matter' | 'appendix';
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

function getType(filename: string): ContentFile['type'] {
  if (filename.includes('TABLE_OF_CONTENTS') || filename.includes('SERIES_NOTE') || 
      filename.includes('PROLOGUE') || filename.includes('INTRODUCTION')) {
    return 'front_matter';
  }
  if (filename.includes('INTERLUDE')) {
    return 'interlude';
  }
  if (filename.includes('CHAPTER')) {
    return 'chapter';
  }
  if (filename.includes('APPENDIX')) {
    return 'appendix';
  }
  return 'back_matter';
}

function formatForReader(content: string, type: ContentFile['type']): string {
  let formatted = content;
  
  // Clean up extra spacing
  formatted = formatted.replace(/\n{4,}/g, '\n\n\n');
  
  // Format scrollstream tags for readability
  formatted = formatted.replace(/@scrollstream:(\w+)/g, '*[@$1]*');
  formatted = formatted.replace(/@scrollstream/g, '');
  
  // Clean up inline orb tags (keep them but format nicely)
  formatted = formatted.replace(/@orb(\d+)/g, '[@orb$1]');
  
  // Ensure proper spacing around headers
  formatted = formatted.replace(/\n(#{1,6})/g, '\n\n$1');
  
  return formatted;
}

function compileReaderFriendlyManuscript(): void {
  console.log('📚 Compiling reader-friendly manuscript...\n');
  
  const files: ContentFile[] = [];
  
  // Collect main content files
  for (const [filename, order] of Object.entries(CONTENT_ORDER)) {
    const filePath = join(BOOK_CONTENT_DIR, filename);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      const title = getTitle(content, filename);
      const type = getType(filename);
      const strippedContent = stripYAML(content);
      files.push({
        path: filePath,
        title,
        content: formatForReader(strippedContent, type),
        order,
        type,
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
      const strippedContent = stripYAML(content);
      files.push({
        path: filePath,
        title,
        content: formatForReader(strippedContent, 'appendix'),
        order,
        type: 'appendix',
      });
      console.log(`✓ Added: ${title}`);
    } else {
      console.warn(`⚠ Missing: ${filename}`);
    }
  }
  
  // Sort by order
  files.sort((a, b) => a.order - b.order);
  
  // Build manuscript with enhanced formatting
  const compileDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const currentYear = new Date().getFullYear();
  const legalNotice = `
---

## LEGAL NOTICE

### Copyright Notice
Copyright © ${currentYear} Jennifer Dye, operating as Gigi Stardust. All rights reserved.

This manuscript is protected by copyright law. No part of this document may be reproduced, distributed, transmitted, displayed, published, or broadcast without the prior written permission of the copyright owner.

### Trademark Notice
The following are trademarks or service marks of Jennifer Dye/Gigi Stardust: "Stardust to Sovereignty," "The Sovereignty Cycle," "Orb System," "Resonance Kernel," "Orbital Brain," "Sovereignty Dashboard," and all related logos, designs, and trade dress. All other trademarks, service marks, and company names are the property of their respective owners.

### Confidentiality & Privacy
This manuscript is being shared in confidence for review purposes only. By receiving this document, you agree to:

- Keep the contents confidential and not share, distribute, or reproduce this manuscript without explicit written permission
- Use this material solely for the purpose of providing feedback and review
- Not quote, reference, or cite any portion of this manuscript in public forums, publications, or media without prior written consent
- Respect the intellectual property rights of the author

### Disclaimer
This is a draft manuscript. All content is subject to revision, editing, and final publication approval. The views, opinions, and statements expressed herein are those of the author and do not necessarily reflect any official policy or position. The information provided is for educational and informational purposes only.

### Patent Notice
The Resonance Kernel Method and related computational frameworks described in this work are protected under Provisional Patent Application No. 63/909,031, filed October 31, 2025.

---

`;
  
  const legalFooter = `
---

## LEGAL NOTICE (Footer)

**Copyright © ${currentYear} Jennifer Dye, operating as Gigi Stardust. All rights reserved.**

This manuscript is confidential and proprietary. Unauthorized reproduction, distribution, or disclosure is prohibited.

For questions or permissions, contact: gigi@gigistardust.com

---
`;
  
  let manuscript = `# STARDUST TO SOVEREIGNTY

**Book 1: The Cosmic Tapestry**

*by Gigi Stardust*

---

*Compiled for reader review: ${compileDate}*

*This is a draft manuscript. All content is subject to revision.*

${legalNotice}

`;

  let currentPart = '';
  let partCounter = 0;
  
  for (const file of files) {
    // Add part dividers for major sections
    if (file.type === 'front_matter' && file.title.includes('Introduction')) {
      manuscript += `\n\n${'='.repeat(60)}\n\n`;
      manuscript += `# PART 1: THE COSMIC TAPESTRY\n\n`;
      manuscript += `${'='.repeat(60)}\n\n`;
    }
    
    // Special handling for Table of Contents
    if (file.title.includes('Table of Contents')) {
      manuscript += file.content;
      manuscript += '\n\n---\n\n';
      continue;
    }
    
    // Format based on type
    if (file.type === 'interlude') {
      manuscript += `\n\n---\n\n`;
      manuscript += `## ${file.title}\n\n`;
      manuscript += `*An interlude*\n\n`;
    } else if (file.type === 'appendix') {
      // Add appendix section header before first appendix
      if (!currentPart.includes('APPENDICES')) {
        manuscript += `\n\n${'='.repeat(60)}\n\n`;
        manuscript += `# APPENDICES\n\n`;
        manuscript += `${'='.repeat(60)}\n\n`;
        currentPart = 'APPENDICES';
      }
      manuscript += `\n\n---\n\n`;
      manuscript += `## ${file.title}\n\n`;
    } else if (file.type === 'back_matter') {
      // Add back matter section header
      if (!currentPart.includes('BACK MATTER')) {
        manuscript += `\n\n${'='.repeat(60)}\n\n`;
        manuscript += `# BACK MATTER\n\n`;
        manuscript += `${'='.repeat(60)}\n\n`;
        currentPart = 'BACK MATTER';
      }
      manuscript += `\n\n---\n\n`;
      manuscript += `# ${file.title}\n\n`;
    } else {
      manuscript += `\n\n${'='.repeat(60)}\n\n`;
      manuscript += `# ${file.title}\n\n`;
    }
    
    manuscript += file.content;
    manuscript += '\n\n';
  }
  
  // Add footer
  manuscript += `\n\n${'='.repeat(60)}\n\n`;
  manuscript += `*End of manuscript*\n\n`;
  manuscript += legalFooter;
  
  // Create output directory if it doesn't exist
  const outputDir = join(__dirname, '../09_PROCESSED');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  // Write reader-friendly manuscript
  const outputPath = join(outputDir, 'STARDUST_TO_SOVEREIGNTY_READER_VERSION.md');
  writeFileSync(outputPath, manuscript, 'utf-8');
  
  // Also create a version without appendices for initial review
  const mainContentFiles = files.filter(f => f.type !== 'appendix');
  let mainManuscript = manuscript.split('# APPENDICES')[0]; // Split before appendices
  mainManuscript += `\n\n${'='.repeat(60)}\n\n`;
  mainManuscript += `*End of manuscript*\n\n`;
  mainManuscript += `*Stardust to Sovereignty - Book 1*\n`;
  mainManuscript += `*Copyright © ${new Date().getFullYear()} Gigi Stardust*\n`;
  mainManuscript += `\n\n*Note: Appendices available upon request.*\n`;
  
  const mainOutputPath = join(outputDir, 'STARDUST_TO_SOVEREIGNTY_MAIN_CONTENT.md');
  writeFileSync(mainOutputPath, mainManuscript, 'utf-8');
  
  // Calculate statistics
  const wordCount = manuscript.split(/\s+/).length;
  const pageEstimate = Math.ceil(wordCount / 250); // Approximate pages at 250 words/page
  
  console.log(`\n✅ Reader-friendly manuscript compiled successfully!`);
  console.log(`📄 Full version: ${outputPath}`);
  console.log(`📄 Main content (no appendices): ${mainOutputPath}`);
  console.log(`\n📊 Statistics:`);
  console.log(`   Total sections: ${files.length}`);
  console.log(`   Total words: ${wordCount.toLocaleString()}`);
  console.log(`   Estimated pages: ~${pageEstimate}`);
  console.log(`   Characters: ${manuscript.length.toLocaleString()}`);
}

// Run compiler
compileReaderFriendlyManuscript();

