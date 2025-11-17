#!/usr/bin/env tsx
/**
 * Sync Finalized Chapters
 * 
 * Moves finalized chapters from the drafts folder (02h_compiler_drafts)
 * to the final output folder (02g_generated_book_content).
 * 
 * Usage: tsx scripts/sync-finalized-chapters.ts [--chapters=1,2,3] [--all]
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const DRAFTS_DIR = path.join(CONTENT_BASE, '02h_compiler_drafts');
const FINAL_OUTPUT_DIR = path.join(CONTENT_BASE, '02g_generated_book_content');

// Parse command line arguments
const args = process.argv.slice(2);
const chapterRange = args.find(arg => arg.startsWith('--chapters='))?.split('=')[1];
const syncAll = args.includes('--all');

/**
 * Extract chapter number from filename
 */
function extractChapterNumber(filename: string): number | null {
  const match = filename.match(/CHAPTER_(\d+)_/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Filter files by chapter range
 */
function shouldSyncFile(filename: string, chapterRange?: string): boolean {
  if (!chapterRange) return true;
  
  const chapterNum = extractChapterNumber(filename);
  if (!chapterNum) return false;
  
  if (chapterRange.includes('-')) {
    const [start, end] = chapterRange.split('-').map(n => parseInt(n.trim()));
    return chapterNum >= start && chapterNum <= end;
  } else if (chapterRange.includes(',')) {
    const numbers = chapterRange.split(',').map(n => parseInt(n.trim()));
    return numbers.includes(chapterNum);
  } else {
    return chapterNum === parseInt(chapterRange.trim());
  }
}

async function syncFinalizedChapters() {
  console.log('📦 Syncing Finalized Chapters');
  console.log('='.repeat(70));
  console.log(`Drafts: ${DRAFTS_DIR}`);
  console.log(`Final: ${FINAL_OUTPUT_DIR}`);
  console.log('='.repeat(70) + '\n');

  // Ensure directories exist
  await fs.mkdir(DRAFTS_DIR, { recursive: true });
  await fs.mkdir(FINAL_OUTPUT_DIR, { recursive: true });

  // Read all files from drafts folder
  const files = await fs.readdir(DRAFTS_DIR);
  const chapterFiles = files.filter(f => f.startsWith('CHAPTER_') && f.endsWith('.md'));

  if (chapterFiles.length === 0) {
    console.log('⚠️  No chapter files found in drafts folder.');
    return;
  }

  // Filter by chapter range if specified
  const filesToSync = chapterRange
    ? chapterFiles.filter(f => shouldSyncFile(f, chapterRange))
    : chapterFiles;

  if (filesToSync.length === 0) {
    console.log('⚠️  No files match the specified chapter range.');
    return;
  }

  console.log(`📄 Found ${filesToSync.length} chapter file(s) to sync\n`);

  const results: Array<{ file: string; success: boolean; error?: string }> = [];

  for (const filename of filesToSync) {
    const draftPath = path.join(DRAFTS_DIR, filename);
    const finalPath = path.join(FINAL_OUTPUT_DIR, filename);

    try {
      // Read draft file
      const content = await fs.readFile(draftPath, 'utf-8');

      // Check if final file exists (backup if it does)
      if (await fs.access(finalPath).then(() => true).catch(() => false)) {
        const backupPath = finalPath + '.backup_' + Date.now();
        await fs.copyFile(finalPath, backupPath);
        console.log(`  ⚠️  ${filename}: Backed up existing file`);
      }

      // Write to final output
      await fs.writeFile(finalPath, content, 'utf-8');
      console.log(`  ✅ ${filename}: Synced to final output`);

      results.push({ file: filename, success: true });
    } catch (error: any) {
      console.log(`  ❌ ${filename}: Failed - ${error.message}`);
      results.push({ file: filename, success: false, error: error.message });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 SYNC SUMMARY');
  console.log('='.repeat(70) + '\n');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total Files: ${filesToSync.length}`);
  console.log(`✅ Successful: ${successful}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}`);
  }

  if (successful > 0) {
    console.log(`\n✅ Finalized chapters are now in: ${FINAL_OUTPUT_DIR}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncFinalizedChapters().catch(console.error);
}

export { syncFinalizedChapters };

