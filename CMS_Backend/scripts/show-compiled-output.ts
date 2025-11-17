#!/usr/bin/env tsx
/**
 * Show Compiled Output
 * 
 * Compiles a chapter and displays the full output
 */

import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  compileChapter,
  loadBookOutline,
  createOutlineConfig,
  type CompilerConfig,
} from '../lib/book-compiler/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CONTENT_BASE = path.join(__dirname, '../09_PROCESSED');
const DEFAULT_OUTLINE_PATH = path.join(CONTENT_BASE, '02b_book/COMPLETE_BOOK_OUTLINE_AND_OVERVIEW.md');

const chapterNum = process.argv.find(arg => arg.startsWith('--chapter='))?.split('=')[1] 
  ? parseInt(process.argv.find(arg => arg.startsWith('--chapter='))!.split('=')[1])
  : 1;

const mode = process.argv.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'metadata';

async function showOutput() {
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

  // Get config
  const config: Partial<CompilerConfig> = {
    contentBasePath: CONTENT_BASE,
    orbEssaysPath: path.join(CONTENT_BASE, '02d_Orb_Essays'),
    codexEssaysPath: path.join(CONTENT_BASE, '02f_S2S_codex_essays'),
    systemEssaysPath: path.join(CONTENT_BASE, '02a_System_essays'),
  };

  if (mode === 'full') {
    config.useRBIDiscovery = true;
    config.useRBIValidation = true;
    config.useRBIOrdering = true;
    config.useOrbitalBrain = true;
    config.useStyleTraining = true;
    config.useEditorialLayer = true;
    config.maxSources = 15;
  } else {
    config.useRBIDiscovery = false;
    config.useRBIValidation = false;
    config.useRBIOrdering = false;
    config.useOrbitalBrain = false;
    config.useStyleTraining = false;
    config.useEditorialLayer = false;
    config.maxSources = 3;
  }

  // Compile
  const result = await compileChapter(chapter, config);

  // Display full output
  console.log(result.content);
}

showOutput().catch(console.error);

