#!/usr/bin/env tsx
/**
 * Compile S2S Book - Full Features
 * 
 * Compiles the complete Stardust to Sovereignty book using:
 * - Global optimization (non-linear, considers all chapters)
 * - All RBI layers (discovery, validation, ordering)
 * - Orbital Brain (narrative generation)
 * - Style training (voice consistency)
 * - Editorial layer (recognition-first, readability)
 * 
 * Usage: tsx scripts/compile-s2s-book.ts [--mode=full|optimized] [--chapters=1-5]
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  loadAndCompileBook,
  compileBookWithGlobalOptimization,
  loadBookOutline,
  createOutlineConfig,
  saveCompiledChapter,
  generateCompilationReport,
  type OutlineInputMode,
} from '../lib/book-compiler/index.js';
import type { CompilerConfig } from '../lib/book-compiler/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const OUTPUT_DIR = path.join(CONTENT_BASE, '02g_generated_book_content');
const DRAFTS_DIR = path.join(CONTENT_BASE, '02h_compiler_drafts');
const DEFAULT_OUTLINE_PATH = path.join(CONTENT_BASE, '02b_book/COMPLETE_BOOK_OUTLINE_AND_OVERVIEW.md');

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'optimized';
const chapterRange = args.find(arg => arg.startsWith('--chapters='))?.split('=')[1];

/**
 * Full-featured compiler configuration
 */
function getFullFeatureConfig(): Partial<CompilerConfig> {
  return {
    // All layers enabled
    useRBIDiscovery: true,
    useRBIValidation: true,
    useRBIOrdering: true,
    useOrbitalBrain: true,
    useStyleTraining: true,
    useEditorialLayer: true,
    enableGapBridging: true,
    recognitionFirst: true,
    
    // Expanded content pool
    maxSources: 15,
    minCoherence: 0.7,
    
    // Content Curation (Priority 2) - enabled by default
    enableContentCuration: true,
    maxSectionsPerSource: 3,
    maxLengthPerSource: 5000,
    
    // Source Restructuring (Priority 3) - enabled by default
    enableSourceRestructuring: true,
    
    // Synthesis (Priority 4) - can be enabled for unified narrative
    enableSynthesis: true,  // TESTING: Set to true to use synthesis instead of source compilation
    maxChapterLength: 50000,
    preserveScrollstreams: false,
    
    // Paths
    contentBasePath: CONTENT_BASE,
    orbEssaysPath: path.join(CONTENT_BASE, '02d_Orb_Essays'),
    codexEssaysPath: path.join(CONTENT_BASE, '02f_S2S_codex_essays'),
    systemEssaysPath: path.join(CONTENT_BASE, '02a_System_essays'),
    outputPath: OUTPUT_DIR,
  };
}

/**
 * Filter chapters by range (e.g., "1-5" or "1,3,5")
 */
function filterChapters(chapters: any[], range?: string): any[] {
  if (!range) return chapters;
  
  if (range.includes('-')) {
    // Range format: "1-5"
    const [start, end] = range.split('-').map(n => parseInt(n.trim()));
    return chapters.filter(ch => ch.chapter_number >= start && ch.chapter_number <= end);
  } else if (range.includes(',')) {
    // List format: "1,3,5"
    const numbers = range.split(',').map(n => parseInt(n.trim()));
    return chapters.filter(ch => numbers.includes(ch.chapter_number));
  } else {
    // Single number
    const num = parseInt(range.trim());
    return chapters.filter(ch => ch.chapter_number === num);
  }
}

async function compileS2SBook() {
  console.log('📚 Compiling Stardust to Sovereignty Book');
  console.log('='.repeat(70));
  console.log(`Mode: ${mode === 'optimized' ? 'Global Optimization + Full Features' : 'Full Features (Linear)'}`);
  console.log('Layers: All enabled (RBI Discovery, Validation, Ordering, Orbital Brain, Style, Editorial)');
  console.log('='.repeat(70) + '\n');

  // Load outline
  console.log('📖 Loading book outline...');
  const outlineConfig = createOutlineConfig({
    mode: 'markdown',
    file_path: DEFAULT_OUTLINE_PATH,
  });
  let chapters = await loadBookOutline(outlineConfig);
  
  // Filter chapters if range specified
  if (chapterRange) {
    chapters = filterChapters(chapters, chapterRange);
    console.log(`📝 Filtered to chapters: ${chapterRange}`);
  }
  
  console.log(`✅ Loaded ${chapters.length} chapters\n`);

  // Ensure output directories exist
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DRAFTS_DIR, { recursive: true });

  const config = getFullFeatureConfig();
  const startTime = Date.now();

  try {
    let result;
    let optimizationReport: string | undefined;

    if (mode === 'optimized') {
      // Use global optimization (non-linear)
      console.log('🌐 Using global optimization (non-linear, considers all chapters together)...\n');
      result = await compileBookWithGlobalOptimization(chapters, config);
      
      if (result.optimization) {
        // Generate optimization report
        const { generateOptimizationReport } = await import('../lib/book-compiler/core/global-optimizer.js');
        const optResult = {
          assignments: result.optimization.assignments.map(a => ({
            chapter: a.chapter,
            sources: a.sources,
            score: a.score,
            reasons: [] as string[]
          })),
          unusedContent: result.optimization.unusedContent,
          overusedContent: result.optimization.overusedContent.map(o => ({
            file: o.file,
            usedIn: o.usedIn,
            chapters: [] as number[]
          })),
          optimizationMetrics: {
            totalChapters: chapters.length,
            totalContentFiles: 0, // Will be calculated
            averageSourcesPerChapter: result.optimization.metrics.contentUtilizationRate,
            contentUtilizationRate: result.optimization.metrics.contentUtilizationRate,
            orbEssayUtilization: result.optimization.metrics.orbEssayUtilization,
          }
        };
        optimizationReport = generateOptimizationReport(optResult);
      }
    } else {
      // Use linear compilation (one chapter at a time)
      console.log('📝 Using linear compilation (one chapter at a time)...\n');
      const outlineInput: OutlineInputMode = {
        mode: 'direct',
        chapters: chapters
      };
      result = await loadAndCompileBook(outlineInput, config);
    }

    const duration = Date.now() - startTime;

    // Save compiled chapters to drafts folder (work-in-progress)
    console.log('\n💾 Saving compiled chapters to drafts folder...\n');
    for (const compilationResult of result.results) {
      if (compilationResult.compiled && compilationResult.compiledContent) {
        const filename = `CHAPTER_${String(compilationResult.chapter.chapter_number).padStart(2, '0')}_${compilationResult.chapter.title.replace(/[^a-z0-9]/gi, '_').toUpperCase()}.md`;
        const draftPath = path.join(DRAFTS_DIR, filename);
        
        await fs.writeFile(draftPath, compilationResult.compiledContent, 'utf-8');
        
        compilationResult.outputPath = draftPath;
        (compilationResult as any).draftPath = draftPath;
        
        console.log(`  ✅ Chapter ${compilationResult.chapter.chapter_number}: ${path.basename(draftPath)}`);
        console.log(`     Sources: ${compilationResult.sources.length} | Length: ${compilationResult.compiledContent.length} chars`);
        console.log(`     Location: ${DRAFTS_DIR}`);
      }
    }
    
    console.log(`\n📝 Note: Chapters saved to drafts folder (${DRAFTS_DIR})`);
    console.log(`   To sync finalized chapters to ${OUTPUT_DIR}, run:`);
    console.log(`   npx tsx scripts/sync-finalized-chapters.ts [--chapters=1,2,3] [--all]`);

    // Generate compilation report
    const report = generateCompilationReport(result.results, result.report);
    const reportPath = path.join(__dirname, '../COMPILATION_REPORT.md');
    await fs.writeFile(reportPath, report, 'utf-8');

    // Save optimization report if available
    if (optimizationReport) {
      const optReportPath = path.join(__dirname, '../GLOBAL_OPTIMIZATION_REPORT.md');
      await fs.writeFile(optReportPath, optimizationReport, 'utf-8');
      console.log(`\n✅ Optimization report saved to: ${optReportPath}`);
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 COMPILATION SUMMARY');
    console.log('='.repeat(70) + '\n');

    console.log(`⏱️  Total Duration: ${(duration / 1000).toFixed(1)}s`);
    console.log(`📚 Total Chapters: ${result.summary.totalChapters}`);
    console.log(`✅ Compiled: ${result.summary.compiled}`);
    console.log(`⏭️  Skipped: ${result.summary.skipped}`);
    console.log(`📄 Total Sources Used: ${result.summary.totalSources}`);
    console.log(`🔧 Layers Used: ${result.summary.layersUsed.join(', ') || 'metadata_only'}\n`);

    if (result.optimization) {
      console.log('🌐 Global Optimization Metrics:');
      console.log(`   Content Utilization: ${(result.optimization.metrics.contentUtilizationRate * 100).toFixed(1)}%`);
      console.log(`   Orb Essay Utilization: ${(result.optimization.metrics.orbEssayUtilization * 100).toFixed(1)}%\n`);
    }

    console.log('Chapter Details:');
    result.report.forEach(report => {
      const status = report.success ? '✅' : '⏭️';
      const layers = report.layersApplied.length > 0 ? ` [${report.layersApplied.join(', ')}]` : '';
      const metrics = report.rbiMetrics 
        ? ` | Coherence: ${report.rbiMetrics.coherence?.toFixed(2) || 'N/A'}`
        : '';
      console.log(`  ${status} Chapter ${report.chapter.chapter_number}: ${report.chapter.title}${layers}${metrics}`);
    });

    console.log(`\n✅ Compilation report saved to: ${reportPath}`);
    console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  } catch (error) {
    console.error('\n❌ Compilation failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

compileS2SBook()
  .then(() => {
    console.log('✅ Book compilation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

