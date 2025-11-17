#!/usr/bin/env tsx
/**
 * Test Global Optimization
 * 
 * Tests the global optimization system that considers all chapters together
 */

import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  loadBookOutline,
  createOutlineConfig,
  optimizeGlobally,
  generateOptimizationReport,
} from '../lib/book-compiler/core/index.js';
import { loadContentFiles } from '../lib/book-compiler/core/content-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const DEFAULT_OUTLINE_PATH = path.join(CONTENT_BASE, '02b_book/COMPLETE_BOOK_OUTLINE_AND_OVERVIEW.md');

async function testGlobalOptimization() {
  console.log('🌐 Testing Global Optimization System');
  console.log('='.repeat(70));
  console.log('This system optimizes content assignment across ALL chapters simultaneously\n');

  // Load outline
  console.log('📖 Loading outline...');
  const outlineConfig = createOutlineConfig({
    mode: 'markdown',
    file_path: DEFAULT_OUTLINE_PATH,
  });
  const chapters = await loadBookOutline(outlineConfig);
  console.log(`✅ Loaded ${chapters.length} chapters\n`);

  // Load all content
  console.log('📁 Loading content files...');
  const allContent = loadContentFiles({
    contentBasePath: CONTENT_BASE,
    orbEssaysPath: path.join(CONTENT_BASE, '02d_Orb_Essays'),
    codexEssaysPath: path.join(CONTENT_BASE, '02f_S2S_codex_essays'),
    systemEssaysPath: path.join(CONTENT_BASE, '02a_System_essays'),
  });
  console.log(`✅ Loaded ${allContent.length} content files\n`);

  // Run global optimization
  console.log('🚀 Running global optimization...\n');
  const startTime = Date.now();
  const result = optimizeGlobally(chapters, allContent, {
    minSourcesPerChapter: 3,
    maxSourcesPerChapter: 15,
    maxUsesPerContent: 3,
    prioritizeOrbEssays: true,
  });
  const duration = Date.now() - startTime;

  console.log('✅ Optimization Complete\n');
  console.log('─'.repeat(70));
  console.log('📊 OPTIMIZATION RESULTS');
  console.log('─'.repeat(70) + '\n');

  console.log(`⏱️  Duration: ${duration}ms\n`);

  console.log('📈 Metrics:');
  console.log(`   Total Chapters: ${result.optimizationMetrics.totalChapters}`);
  console.log(`   Total Content Files: ${result.optimizationMetrics.totalContentFiles}`);
  console.log(`   Average Sources per Chapter: ${result.optimizationMetrics.averageSourcesPerChapter.toFixed(2)}`);
  console.log(`   Content Utilization Rate: ${(result.optimizationMetrics.contentUtilizationRate * 100).toFixed(1)}%`);
  console.log(`   Orb Essay Utilization: ${(result.optimizationMetrics.orbEssayUtilization * 100).toFixed(1)}%\n`);

  // Check Chapter 1 specifically
  const chapter1 = result.assignments.find(a => a.chapter.chapter_number === 1);
  if (chapter1) {
    console.log('─'.repeat(70));
    console.log('📝 CHAPTER 1 ASSIGNMENT (Globally Optimized):\n');
    console.log(`Chapter: ${chapter1.chapter.title}`);
    console.log(`Score: ${chapter1.score.toFixed(1)}`);
    console.log(`Sources: ${chapter1.sources.length}\n`);
    
    console.log('Assigned Sources:');
    chapter1.sources.forEach((source, idx) => {
      const isOrbEssay = source.file_path.includes('orb_') && source.file_path.includes('02d_Orb_Essays');
      const marker = isOrbEssay ? '⭐' : '  ';
      console.log(`${marker} ${idx + 1}. ${source.title}`);
      console.log(`     File: ${source.file_path}`);
      if (source.orb_tags.length > 0) {
        console.log(`     Orbs: ${source.orb_tags.join(', ')}`);
      }
    });

    // Check if Orb 1 essay is included
    const orb1Essay = chapter1.sources.find(s => 
      s.file_path.includes('orb_1') && 
      !s.file_path.includes('vignette')
    );
    if (orb1Essay) {
      console.log(`\n✅ Orb 1 Essay IS included in Chapter 1 (globally optimized)`);
    } else {
      console.log(`\n❌ Orb 1 Essay is NOT included in Chapter 1`);
      console.log(`   This suggests it's better suited for another chapter, or needs metadata fixes.`);
    }
  }

  if (result.unusedContent.length > 0) {
    console.log('\n─'.repeat(70));
    console.log(`⚠️  UNUSED CONTENT (${result.unusedContent.length} files):\n`);
    result.unusedContent.slice(0, 10).forEach(file => {
      console.log(`   - ${file.title}`);
    });
    if (result.unusedContent.length > 10) {
      console.log(`   ... and ${result.unusedContent.length - 10} more`);
    }
  }

  if (result.overusedContent.length > 0) {
    console.log('\n─'.repeat(70));
    console.log(`⚠️  OVERUSED CONTENT (${result.overusedContent.length} files):\n`);
    result.overusedContent.forEach(item => {
      console.log(`   - ${item.file.title}: Used in ${item.usedIn} chapters (${item.chapters.join(', ')})`);
    });
  }

  // Generate full report
  const report = generateOptimizationReport(result);
  const reportPath = path.join(__dirname, '../GLOBAL_OPTIMIZATION_REPORT.md');
  const fs = await import('fs/promises');
  await fs.writeFile(reportPath, report, 'utf-8');
  console.log(`\n✅ Full report saved to: ${reportPath}\n`);
}

testGlobalOptimization().catch(console.error);

