#!/usr/bin/env tsx

/**
 * Cleanup Orphaned Content Script
 * 
 * Removes content files from Supabase that no longer exist in the file system.
 * Specifically targets orphaned book chapters and any files not in the 3 synced folders.
 * 
 * Usage:
 *   tsx scripts/cleanup-orphaned-content.ts
 *   tsx scripts/cleanup-orphaned-content.ts --dry-run  (preview only)
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Only these folders should have content in the database
const ALLOWED_FOLDERS = [
  '02d_Orb_Essays',
  '02f_S2S_codex_essays',
  '02g_generated_book_content'
];

interface CleanupStats {
  total: number;
  orphaned: number;
  fromWrongFolder: number;
  deleted: number;
  errors: number;
}

const stats: CleanupStats = {
  total: 0,
  orphaned: 0,
  fromWrongFolder: 0,
  deleted: 0,
  errors: 0,
};

function isFileInAllowedFolder(filePath: string): boolean {
  return ALLOWED_FOLDERS.some(folder => filePath.startsWith(`${folder}/`));
}

function getFullFilePath(relativePath: string): string {
  return path.join(process.cwd(), '09_PROCESSED', relativePath);
}

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

async function cleanupOrphanedContent(dryRun: boolean = false) {
  console.log('🧹 Starting Content Library Cleanup...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }
  
  // Fetch all content files from Supabase
  const { data: allFiles, error: fetchError } = await supabase
    .from('content_files')
    .select('id, file_path, title, status')
    .order('file_path');
  
  if (fetchError) {
    console.error('❌ Error fetching content files:', fetchError.message);
    process.exit(1);
  }
  
  if (!allFiles || allFiles.length === 0) {
    console.log('📭 No content files found in database.');
    return;
  }
  
  stats.total = allFiles.length;
  console.log(`📊 Found ${stats.total} content files in database\n`);
  
  const processedDir = path.join(process.cwd(), '09_PROCESSED');
  if (!fs.existsSync(processedDir)) {
    console.error('❌ 09_PROCESSED directory not found!');
    process.exit(1);
  }
  
  const filesToDelete: Array<{ id: string; file_path: string; title: string; reason: string }> = [];
  
  // Check each file
  for (const file of allFiles) {
    const filePath = file.file_path;
    
    // Check 1: Is file from an allowed folder?
    if (!isFileInAllowedFolder(filePath)) {
      stats.fromWrongFolder++;
      filesToDelete.push({
        id: file.id,
        file_path: filePath,
        title: file.title || 'Untitled',
        reason: `Not from allowed folder (${filePath.split('/')[0]})`
      });
      continue;
    }
    
    // Check 2: Does the file exist in the file system?
    const fullPath = getFullFilePath(filePath);
    if (!fileExists(fullPath)) {
      stats.orphaned++;
      filesToDelete.push({
        id: file.id,
        file_path: filePath,
        title: file.title || 'Untitled',
        reason: 'File no longer exists in file system'
      });
      continue;
    }
  }
  
  // Display results
  console.log('📋 Cleanup Summary:\n');
  console.log(`   Total files in database:     ${stats.total}`);
  console.log(`   Files from wrong folders:    ${stats.fromWrongFolder}`);
  console.log(`   Orphaned files (not found):  ${stats.orphaned}`);
  console.log(`   Files to delete:             ${filesToDelete.length}`);
  console.log(`   Files to keep:               ${stats.total - filesToDelete.length}\n`);
  
  if (filesToDelete.length === 0) {
    console.log('✅ No orphaned content found. Database is clean!\n');
    return;
  }
  
  // Show files to be deleted
  console.log('🗑️  Files to be deleted:\n');
  const byFolder = filesToDelete.reduce((acc, file) => {
    const folder = file.file_path.split('/')[0];
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(file);
    return acc;
  }, {} as Record<string, typeof filesToDelete>);
  
  for (const [folder, files] of Object.entries(byFolder)) {
    console.log(`   📁 ${folder}/ (${files.length} files)`);
    files.slice(0, 5).forEach(file => {
      console.log(`      - ${file.title} (${file.reason})`);
    });
    if (files.length > 5) {
      console.log(`      ... and ${files.length - 5} more`);
    }
  }
  console.log('');
  
  if (dryRun) {
    console.log('🔍 DRY RUN - No files were deleted. Run without --dry-run to delete.');
    return;
  }
  
  // Confirm deletion
  console.log('⚠️  About to delete these files from the database...\n');
  
  // Delete files
  for (const file of filesToDelete) {
    try {
      const { error } = await supabase
        .from('content_files')
        .delete()
        .eq('id', file.id);
      
      if (error) {
        console.error(`❌ Error deleting ${file.file_path}:`, error.message);
        stats.errors++;
      } else {
        stats.deleted++;
        console.log(`✅ Deleted: ${file.file_path}`);
      }
    } catch (err: any) {
      console.error(`❌ Error deleting ${file.file_path}:`, err.message);
      stats.errors++;
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Final Summary:\n');
  console.log(`   ✅ Successfully deleted: ${stats.deleted}`);
  console.log(`   ❌ Errors:               ${stats.errors}`);
  console.log('\n✨ Cleanup complete!\n');
}

// Main execution
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-d');

cleanupOrphanedContent(dryRun).catch(console.error);

