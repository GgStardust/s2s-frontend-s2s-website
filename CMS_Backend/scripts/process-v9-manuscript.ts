#!/usr/bin/env tsx
/**
 * Process V9 Manuscript
 * 
 * Copies V9 manuscript from RBI_Editorial_Tools to CMS_Backend
 * and prepares it for Console use by adding console metadata.
 * 
 * Usage: tsx scripts/process-v9-manuscript.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const V9_SOURCE = path.join(__dirname, '../../RBI_Editorial_Tools/S2S_Book1/Manuscripts/S2S_Field_Manual_v9_print.md');
const OUTPUT_DIR = path.join(__dirname, '../09_PROCESSED/02g_generated_book_content');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md');

/**
 * Extract orb numbers from content
 * Looks for patterns like "Orb 1", "Orb 2", etc. in chapter headings and content
 */
function extractOrbAssociations(content: string): number[] {
  const orbSet = new Set<number>();
  
  // Pattern 1: "Orb 1:", "Orb 2:", etc. in headings
  const headingPattern = /Orb\s+(\d+):/gi;
  let match;
  while ((match = headingPattern.exec(content)) !== null) {
    const orbNum = parseInt(match[1]);
    if (orbNum >= 1 && orbNum <= 13) {
      orbSet.add(orbNum);
    }
  }
  
  // Pattern 2: "![Orb 1:", "![Orb 2:", etc. in image references
  const imagePattern = /!\[Orb\s+(\d+):/gi;
  while ((match = imagePattern.exec(content)) !== null) {
    const orbNum = parseInt(match[1]);
    if (orbNum >= 1 && orbNum <= 13) {
      orbSet.add(orbNum);
    }
  }
  
  // Pattern 3: "Orb 1", "Orb 2", etc. in text (more general)
  const textPattern = /\bOrb\s+(\d+)\b/gi;
  while ((match = textPattern.exec(content)) !== null) {
    const orbNum = parseInt(match[1]);
    if (orbNum >= 1 && orbNum <= 13) {
      orbSet.add(orbNum);
    }
  }
  
  return Array.from(orbSet).sort((a, b) => a - b);
}

/**
 * Process V9 manuscript
 */
function processV9Manuscript() {
  console.log('📚 Processing V9 Manuscript...\n');
  
  // Check if source exists
  if (!fs.existsSync(V9_SOURCE)) {
    console.error(`❌ Source file not found: ${V9_SOURCE}`);
    process.exit(1);
  }
  
  // Read V9 file
  console.log(`📖 Reading: ${V9_SOURCE}`);
  const v9Content = fs.readFileSync(V9_SOURCE, 'utf-8');
  
  // Parse existing frontmatter
  const parsed = matter(v9Content);
  const existingFrontmatter = parsed.data || {};
  const content = parsed.content;
  
  // Extract orb associations from content
  console.log('🔍 Extracting orb associations from content...');
  const orbAssociations = extractOrbAssociations(content);
  console.log(`   Found Orbs: ${orbAssociations.join(', ')}`);
  
  // Build enhanced frontmatter
  const frontmatter = {
    ...existingFrontmatter,
    // Ensure required fields
    title: existingFrontmatter.title || 'Stardust to Sovereignty',
    author: existingFrontmatter.author || 'Gigi Stardust',
    version: existingFrontmatter.version || 'V9.0',
    date: existingFrontmatter.date || new Date().toISOString().split('T')[0],
    
    // Add console metadata
    content_type: 'book_output',
    field_function: {
      content_purpose: 'complete_manuscript',
      console_context: 'manuscript_reader',
      console_relation: 'primary_content'
    },
    integration_points: {
      codex: ['StardustToSovereignty'],
      console_views: ['ManuscriptReader', 'DynamicExpansion'],
      editorial_pass: 'V9'
    },
    orb_associations: orbAssociations,
    tags: ['manuscript', 'book-1', 'complete', 'v9'],
    
    // Metadata for Supabase
    status: 'active',
    file_path: '02g_generated_book_content/STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT.md'
  };
  
  // Reconstruct file with enhanced frontmatter
  const processedContent = matter.stringify(content, frontmatter, {
    delimiters: '---',
    language: 'yaml'
  });
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(`📁 Creating output directory: ${OUTPUT_DIR}`);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Write processed file
  console.log(`\n💾 Writing: ${OUTPUT_FILE}`);
  fs.writeFileSync(OUTPUT_FILE, processedContent, 'utf-8');
  
  // Stats
  const stats = fs.statSync(OUTPUT_FILE);
  const lineCount = processedContent.split('\n').length;
  
  console.log('\n✅ V9 Manuscript processed successfully!');
  console.log(`📄 Output: ${OUTPUT_FILE}`);
  console.log(`📊 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📝 Lines: ${lineCount.toLocaleString()}`);
  console.log(`🔮 Orb associations: ${orbAssociations.length} (${orbAssociations.join(', ')})`);
  console.log('\n📋 Next steps:');
  console.log('   1. Test endpoint: curl http://localhost:4000/api/manuscript/current');
  console.log('   2. Import to Supabase: cd CMS_Backend && pnpm import-content');
  console.log('   3. Or use file system (works for local dev)');
}

// Run
try {
  processV9Manuscript();
} catch (error) {
  console.error('❌ Error processing V9 manuscript:', error);
  process.exit(1);
}



