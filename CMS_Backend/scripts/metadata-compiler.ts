#!/usr/bin/env tsx
/**
 * Book Compiler Script
 * 
 * Standalone script for compiling books using the modular book compiler.
 * 
 * Supports multiple modes:
 * - metadata-only: Pure YAML frontmatter matching (backward compatible)
 * - full-features: All layers enabled (RBI, Orbital Brain, Editorial)
 * 
 * Usage:
 *   tsx scripts/metadata-compiler.ts [--mode=metadata|full] [--outline=path]
 * 
 * Rules:
 * - Preserve all inline tags (@orb_1, @scrollstream, etc.)
 * - Include YAML frontmatter in compiled output
 * - Use field_function.content_purpose and book_threading for source selection
 * - Do not strip or normalize tag syntax
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import modular compiler
import {
  loadAndCompileBook,
  compileBook,
  loadBookOutline,
  createOutlineConfig,
  saveCompiledChapter,
  generateCompilationReport,
  type OutlineInputMode,
} from '../lib/book-compiler/index.js';
import type { CompilerConfig } from '../lib/book-compiler/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const OUTPUT_DIR = path.join(CONTENT_BASE, '02g_generated_book_content');
const DEFAULT_OUTLINE_PATH = path.join(CONTENT_BASE, '02b_book/COMPLETE_BOOK_OUTLINE_AND_OVERVIEW.md');

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'metadata';
const outlinePath = args.find(arg => arg.startsWith('--outline='))?.split('=')[1] || DEFAULT_OUTLINE_PATH;

/**
 * Get compiler configuration based on mode
 */
function getCompilerConfig(mode: string): Partial<CompilerConfig> {
  if (mode === 'full') {
    // Full-featured compilation with all layers
  return {
      useRBIDiscovery: true,
      useRBIValidation: true,
      useRBIOrdering: true,
      useOrbitalBrain: true,
      useStyleTraining: true,
      useEditorialLayer: true,
      enableGapBridging: true,
      maxSources: 15,
      minCoherence: 0.7,
      contentBasePath: CONTENT_BASE,
      orbEssaysPath: path.join(CONTENT_BASE, '02d_Orb_Essays'),
      codexEssaysPath: path.join(CONTENT_BASE, '02f_S2S_codex_essays'),
      systemEssaysPath: path.join(CONTENT_BASE, '02a_System_essays'),
    };
  } else {
    // Metadata-only mode (backward compatible)
    return {
      useRBIDiscovery: false,
      useRBIValidation: false,
      useRBIOrdering: false,
      useOrbitalBrain: false,
      useStyleTraining: false,
      useEditorialLayer: false,
      enableGapBridging: false,
      maxSources: 3,
      contentBasePath: CONTENT_BASE,
      orbEssaysPath: path.join(CONTENT_BASE, '02d_Orb_Essays'),
      codexEssaysPath: path.join(CONTENT_BASE, '02f_S2S_codex_essays'),
      systemEssaysPath: path.join(CONTENT_BASE, '02a_System_essays'),
    };
  }
}

async function compileBook() {
  const config = getCompilerConfig(mode);
  const isFullMode = mode === 'full';
  
  console.log('📚 Book Compiler');
  console.log('='.repeat(70));
  console.log(`Mode: ${isFullMode ? 'Full Features (All Layers)' : 'Metadata-Only (Backward Compatible)'}`);
  if (isFullMode) {
    console.log('Layers: RBI Discovery, Validation, Ordering, Orbital Brain, Style, Editorial');
  } else {
    console.log('Layers: Metadata Matching Only');
  }
  console.log('='.repeat(70) + '\n');
  
  // Determine outline input mode
  let outlineInput: OutlineInputMode;
  
  if (fs.existsSync(outlinePath)) {
    console.log(`📖 Loading outline from: ${outlinePath}`);
    outlineInput = { mode: 'markdown', file_path: outlinePath };
  } else {
    console.error(`❌ Outline file not found: ${outlinePath}`);
    console.error('Please provide a valid outline file with --outline=path');
    process.exit(1);
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  try {
    // Load outline and compile book
    console.log('🚀 Starting compilation...\n');
    const result = await loadAndCompileBook(outlineInput, config);
    
    // Save compiled chapters
    console.log('\n💾 Saving compiled chapters...');
    for (const compilationResult of result.results) {
      if (compilationResult.compiled && compilationResult.compiledContent) {
        const filename = `CHAPTER_${String(compilationResult.chapter.chapter_number).padStart(2, '0')}_${compilationResult.chapter.title.replace(/[^a-z0-9]/gi, '_').toUpperCase()}.md`;
    const outputPath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(outputPath, compilationResult.compiledContent, 'utf-8');
        compilationResult.outputPath = outputPath;
        
        console.log(`  ✅ Chapter ${compilationResult.chapter.chapter_number}: ${path.basename(outputPath)}`);
      }
    }
    
    // Generate and save report
    const report = generateCompilationReport(result.results, result.report);
    const reportPath = path.join(__dirname, '../COMPILATION_REPORT.md');
    fs.writeFileSync(reportPath, report, 'utf-8');
    
    // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 COMPILATION SUMMARY');
  console.log('='.repeat(70) + '\n');
  
    console.log(`Total Chapters: ${result.summary.totalChapters}`);
    console.log(`Compiled: ${result.summary.compiled}`);
    console.log(`Skipped: ${result.summary.skipped}`);
    console.log(`Total Sources Used: ${result.summary.totalSources}`);
    console.log(`Layers Used: ${result.summary.layersUsed.join(', ') || 'metadata_only'}\n`);
  
  console.log('Chapter Details:');
    result.report.forEach(report => {
      const status = report.success ? '✅' : '⏭️';
      const layers = report.layersApplied.length > 0 ? ` [${report.layersApplied.join(', ')}]` : '';
      console.log(`  ${status} Chapter ${report.chapter.chapter_number}: ${report.chapter.title}${layers}`);
  });
  
  console.log(`\n✅ Report saved to: ${reportPath}\n`);
    
  } catch (error) {
    console.error('❌ Compilation failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error(error.stack);
      }
    process.exit(1);
  }
}

// Run compilation
compileBook()
  .then(() => {
    console.log('✅ Book compilation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Compilation failed:', error);
    process.exit(1);
  });

