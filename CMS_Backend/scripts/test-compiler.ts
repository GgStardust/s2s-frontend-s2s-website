#!/usr/bin/env tsx
/**
 * Test Script for Book Compiler
 * 
 * Quick test script to verify compiler functionality
 * Usage: tsx scripts/test-compiler.ts [--mode=metadata|full] [--chapter=1]
 */

import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  compileChapter,
  loadBookOutline,
  createOutlineConfig,
  type ChapterOutline,
  type CompilerConfig,
} from '../lib/book-compiler/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const DEFAULT_OUTLINE_PATH = path.join(CONTENT_BASE, '02b_book/COMPLETE_BOOK_OUTLINE_AND_OVERVIEW.md');

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'metadata';
const chapterNum = args.find(arg => arg.startsWith('--chapter='))?.split('=')[1] 
  ? parseInt(args.find(arg => arg.startsWith('--chapter='))!.split('=')[1])
  : 1;

/**
 * Get compiler configuration
 */
function getConfig(mode: string): Partial<CompilerConfig> {
  const baseConfig: Partial<CompilerConfig> = {
    contentBasePath: CONTENT_BASE,
    orbEssaysPath: path.join(CONTENT_BASE, '02d_Orb_Essays'),
    codexEssaysPath: path.join(CONTENT_BASE, '02f_S2S_codex_essays'),
    systemEssaysPath: path.join(CONTENT_BASE, '02a_System_essays'),
  };

  if (mode === 'full') {
    return {
      ...baseConfig,
      useRBIDiscovery: true,
      useRBIValidation: true,
      useRBIOrdering: true,
      useOrbitalBrain: true,
      useStyleTraining: true,
      useEditorialLayer: true,
      enableGapBridging: true,
      maxSources: 15,
      minCoherence: 0.7,
    };
  } else {
    return {
      ...baseConfig,
      useRBIDiscovery: false,
      useRBIValidation: false,
      useRBIOrdering: false,
      useOrbitalBrain: false,
      useStyleTraining: false,
      useEditorialLayer: false,
      enableGapBridging: false,
      maxSources: 3,
    };
  }
}

/**
 * Test single chapter compilation
 */
async function testChapterCompilation() {
  console.log('🧪 Testing Book Compiler');
  console.log('='.repeat(70));
  console.log(`Mode: ${mode === 'full' ? 'Full Features' : 'Metadata-Only'}`);
  console.log(`Chapter: ${chapterNum}`);
  console.log('='.repeat(70) + '\n');

  try {
    // Load outline
    console.log('📖 Loading outline...');
    const outlineConfig = createOutlineConfig({
      mode: 'markdown',
      file_path: DEFAULT_OUTLINE_PATH,
    });
    const chapters = await loadBookOutline(outlineConfig);
    console.log(`✅ Loaded ${chapters.length} chapters\n`);

    // Find the requested chapter
    const chapter = chapters.find(ch => ch.chapter_number === chapterNum);
    if (!chapter) {
      console.error(`❌ Chapter ${chapterNum} not found in outline`);
      console.log(`Available chapters: ${chapters.map(ch => ch.chapter_number).join(', ')}`);
      process.exit(1);
    }

    console.log(`📝 Testing Chapter ${chapter.chapter_number}: ${chapter.title}`);
    if (chapter.description) {
      console.log(`   Description: ${chapter.description.substring(0, 100)}...`);
    }
    if (chapter.orb_focus) {
      console.log(`   Orb Focus: ${chapter.orb_focus}`);
    }
    console.log('');

    // Get config
    const config = getConfig(mode);

    // Compile chapter
    console.log('🚀 Compiling chapter...\n');
    const startTime = Date.now();
    const result = await compileChapter(chapter, config);
    const duration = Date.now() - startTime;

    // Display results
    console.log('✅ Compilation Complete\n');
    console.log('─'.repeat(70));
    console.log('📊 RESULTS');
    console.log('─'.repeat(70) + '\n');

    console.log(`⏱️  Duration: ${duration}ms\n`);

    console.log(`📚 Sources Used: ${result.sources.length}`);
    result.sources.forEach((source, idx) => {
      console.log(`   ${idx + 1}. ${source.title}`);
      console.log(`      File: ${source.file_path}`);
      if (source.orb_tags.length > 0) {
        console.log(`      Orbs: ${source.orb_tags.join(', ')}`);
      }
      if (source.inline_tags.length > 0) {
        const tags = source.inline_tags.slice(0, 3).join(', ');
        const more = source.inline_tags.length > 3 ? ` (+${source.inline_tags.length - 3} more)` : '';
        console.log(`      Tags: ${tags}${more}`);
      }
    });
    console.log('');

    if (result.layersApplied && result.layersApplied.length > 0) {
      console.log(`🔧 Layers Applied: ${result.layersApplied.join(', ')}\n`);
    }

    if (result.rbi_metrics) {
      console.log('📈 RBI Metrics:');
      if (result.rbi_metrics.coherence !== undefined) {
        console.log(`   Coherence: ${result.rbi_metrics.coherence.toFixed(3)}`);
      }
      if (result.rbi_metrics.field_strength !== undefined) {
        console.log(`   Field Strength: ${result.rbi_metrics.field_strength.toFixed(3)}`);
      }
      if (result.rbi_metrics.stability !== undefined) {
        console.log(`   Stability: ${result.rbi_metrics.stability.toFixed(3)}`);
      }
      console.log('');
    }

    if (result.style_applied) {
      console.log('✨ Style Training: Applied\n');
    }

    if (result.warnings && result.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      result.warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
      console.log('');
    }

    console.log(`📄 Content Length: ${result.content.length} characters`);
    console.log(`   Lines: ${result.content.split('\n').length}`);

    // Show content preview
    console.log('\n─'.repeat(70));
    console.log('📖 CONTENT PREVIEW (first 500 chars)');
    console.log('─'.repeat(70));
    const preview = result.content.substring(0, 500);
    console.log(preview);
    if (result.content.length > 500) {
      console.log(`\n... (${result.content.length - 500} more characters)`);
    }

    console.log('\n✅ Test completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      if (error.stack) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

// Run test
testChapterCompilation()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

