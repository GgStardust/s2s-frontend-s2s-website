#!/usr/bin/env tsx
/**
 * Debug Source Selection
 * 
 * Shows scoring details for why sources were selected or not
 */

import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  loadBookOutline,
  createOutlineConfig,
  getSelectionDetails,
} from '../lib/book-compiler/core/index.js';
import { loadContentFiles } from '../lib/book-compiler/core/content-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const DEFAULT_OUTLINE_PATH = path.join(CONTENT_BASE, '02b_book/COMPLETE_BOOK_OUTLINE_AND_OVERVIEW.md');

const chapterNum = process.argv.find(arg => arg.startsWith('--chapter='))?.split('=')[1] 
  ? parseInt(process.argv.find(arg => arg.startsWith('--chapter='))!.split('=')[1])
  : 1;

async function debugSelection() {
  // Load outline
  const outlineConfig = createOutlineConfig({
    mode: 'markdown',
    file_path: DEFAULT_OUTLINE_PATH,
  });
  const chapters = await loadBookOutline(outlineConfig);
  const chapter = chapters.find(ch => ch.chapter_number === chapterNum);
  
  if (!chapter) {
    console.error(`Chapter ${chapterNum} not found`);
    process.exit(1);
  }

  // Load all content
  const allContent = loadContentFiles({
    contentBasePath: CONTENT_BASE,
    orbEssaysPath: path.join(CONTENT_BASE, '02d_Orb_Essays'),
    codexEssaysPath: path.join(CONTENT_BASE, '02f_S2S_codex_essays'),
    systemEssaysPath: path.join(CONTENT_BASE, '02a_System_essays'),
  });

  // Get selection details
  const { sources, details } = getSelectionDetails(chapter, allContent, 10);

  console.log(`\n📊 SELECTION ANALYSIS FOR CHAPTER ${chapterNum}: ${chapter.title}\n`);
  console.log('─'.repeat(70));
  console.log(`Chapter Description: ${chapter.description || 'none'}`);
  console.log(`Orb Focus: ${chapter.orb_focus || 'none'}\n`);

  console.log('─'.repeat(70));
  console.log('TOP 10 SCORED SOURCES:\n');
  
  details.forEach((result, idx) => {
    console.log(`${idx + 1}. ${result.file.title}`);
    console.log(`   Score: ${result.score}`);
    console.log(`   File: ${result.file.file_path}`);
    console.log(`   Reasons:`);
    result.reasons.forEach(reason => {
      console.log(`     - ${reason}`);
    });
    console.log(`   Orbs: ${result.file.orb_tags.join(', ') || 'none'}`);
    console.log('');
  });

  // Check specifically for Orb 1 essay
  const orb1Essay = allContent.find(f => 
    f.file_path.includes('orb_1') && 
    !f.file_path.includes('vignette') &&
    !f.file_path.includes('ARCHIVE')
  );

  if (orb1Essay) {
    console.log('─'.repeat(70));
    console.log('ORB 1 ESSAY ANALYSIS:\n');
    console.log(`Title: ${orb1Essay.title}`);
    console.log(`File: ${orb1Essay.file_path}`);
    console.log(`Orb Tags: ${orb1Essay.orb_tags.join(', ')}`);
    console.log(`Book Threading: ${orb1Essay.yaml.book_threading || 'none'}`);
    console.log(`Content Purpose: ${orb1Essay.yaml.field_function?.content_purpose?.substring(0, 100) || 'none'}...`);
    console.log(`Integration Points: ${Array.isArray(orb1Essay.yaml.integration_points) ? orb1Essay.yaml.integration_points.join(', ') : 'none'}`);
    
    const orb1Score = details.find(d => d.file.file_path === orb1Essay.file_path);
    if (orb1Score) {
      console.log(`\n✅ Orb 1 Essay WAS scored: ${orb1Score.score} points`);
      console.log(`   Reasons: ${orb1Score.reasons.join(', ')}`);
      const rank = details.findIndex(d => d.file.file_path === orb1Essay.file_path) + 1;
      console.log(`   Rank: #${rank} (top 3: ${rank <= 3 ? 'YES ✅' : 'NO ❌'})`);
    } else {
      console.log(`\n❌ Orb 1 Essay was NOT scored (score = 0)`);
      console.log(`   This means it didn't match any scoring criteria:`);
      console.log(`   - Book threading match? ${orb1Essay.yaml.book_threading?.includes('Stardust to Sovereignty') ? 'YES' : 'NO'}`);
      console.log(`   - Content purpose keywords? ${orb1Essay.yaml.field_function?.content_purpose ? 'Check manually' : 'NO'}`);
      console.log(`   - Integration points? ${Array.isArray(orb1Essay.yaml.integration_points) && orb1Essay.yaml.integration_points.includes('Book Compiler') ? 'YES' : 'NO'}`);
      console.log(`   - Orb focus match? ${chapter.orb_focus && orb1Essay.orb_tags.includes(chapter.orb_focus) ? 'YES' : 'NO'}`);
    }
  } else {
    console.log('─'.repeat(70));
    console.log('❌ Orb 1 Essay not found in content library');
  }
}

debugSelection().catch(console.error);

