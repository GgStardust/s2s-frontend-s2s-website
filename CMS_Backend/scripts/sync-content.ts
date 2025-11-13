/**
 * Content Sync Script
 * 
 * Walks 09_PROCESSED directory and syncs Markdown files to database
 * via the /api/content/import endpoint.
 * 
 * Step 4 of Backend Stabilization Plan
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CONTENT_ROOT = process.env.CONTENT_ROOT || '09_PROCESSED';

interface SyncResult {
  imported: number;
  updated: number;
  skipped: number;
  errors: Array<{ file: string; error: string }>;
  files: Array<{
    path: string;
    action: 'imported' | 'updated' | 'skipped' | 'error';
    coherenceScore?: number;
    version?: string;
  }>;
}

/**
 * Calculate file checksum
 */
function calculateChecksum(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Get file modification time
 */
function getFileModifiedTime(filePath: string): Date {
  const stats = fs.statSync(filePath);
  return stats.mtime;
}

/**
 * Check if file should be skipped (unchanged)
 */
async function shouldSkipFile(
  filePath: string,
  relativePath: string,
  checksum: string
): Promise<boolean> {
  try {
    // Check against database (would need API call to check existing checksum)
    // For now, we'll always process files (can be enhanced later)
    return false;
  } catch {
    return false;
  }
}

/**
 * Import a single file via API
 */
async function importFile(
  filePath: string,
  relativePath: string
): Promise<{ success: boolean; action?: string; coherenceScore?: number; version?: string; error?: string }> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const response = await fetch(`${SITE_URL}/api/content/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        filePath: relativePath,
        content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    
    // Extract action from summary
    let action: string | undefined;
    if (data.summary) {
      if (data.summary.imported > 0) action = 'imported';
      else if (data.summary.updated > 0) action = 'updated';
      else action = 'skipped';
    }

    // Extract coherence score from response if available
    const coherenceScore = data.summary?.files?.[0]?.coherenceScore;

    return {
      success: true,
      action,
      coherenceScore,
      version: data.summary?.files?.[0]?.version,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Walk directory and find all .md files
 */
function walkDirectory(dirPath: string, relativePath: string = ''): Array<{ fullPath: string; relativePath: string }> {
  const files: Array<{ fullPath: string; relativePath: string }> = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively walk subdirectories
        files.push(...walkDirectory(fullPath, itemRelativePath));
      } else if (item.endsWith('.md') && !item.startsWith('.')) {
        // Skip non-content files
        const skipFiles = [
          'README',
          'README_COMPILATION',
          'STARDUST_TO_SOVEREIGNTY_COMPLETE_MANUSCRIPT',
          'STARDUST_TO_SOVEREIGNTY_MAIN_CONTENT',
          'STARDUST_TO_SOVEREIGNTY_READER_VERSION',
        ];
        const shouldSkip = skipFiles.some(skip => item.includes(skip));
        if (!shouldSkip) {
          files.push({ fullPath, relativePath: itemRelativePath });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  return files;
}

/**
 * Main sync function
 */
async function syncContent() {
  console.log('🔄 Starting content sync...\n');
  console.log(`📁 Content root: ${CONTENT_ROOT}`);
  console.log(`🌐 Site URL: ${SITE_URL}\n`);

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment');
    process.exit(1);
  }

  const contentRootPath = path.resolve(process.cwd(), CONTENT_ROOT);
  
  if (!fs.existsSync(contentRootPath)) {
    console.error(`❌ Content root directory not found: ${contentRootPath}`);
    process.exit(1);
  }

  // Find all markdown files
  console.log('📂 Scanning for Markdown files...');
  const files = walkDirectory(contentRootPath);
  console.log(`   Found ${files.length} files\n`);

  if (files.length === 0) {
    console.log('⚠️  No files to sync');
    return;
  }

  const result: SyncResult = {
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    files: [],
  };

  const startTime = Date.now();

  // Process files in batches to avoid overwhelming the API
  const batchSize = 10;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`📤 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(files.length / batchSize)} (${batch.length} files)...`);

    await Promise.all(
      batch.map(async ({ fullPath, relativePath }) => {
        const checksum = calculateChecksum(fullPath);
        
        // Check if should skip (unchanged)
        const shouldSkip = await shouldSkipFile(fullPath, relativePath, checksum);
        if (shouldSkip) {
          result.skipped++;
          result.files.push({ path: relativePath, action: 'skipped' });
          return;
        }

        // Import file
        const importResult = await importFile(fullPath, relativePath);
        
        if (importResult.success) {
          if (importResult.action === 'imported') {
            result.imported++;
          } else if (importResult.action === 'updated') {
            result.updated++;
          } else {
            result.skipped++;
          }
          
          result.files.push({
            path: relativePath,
            action: (importResult.action || 'skipped') as any,
            coherenceScore: importResult.coherenceScore,
            version: importResult.version,
          });
        } else {
          result.errors.push({
            file: relativePath,
            error: importResult.error || 'Unknown error',
          });
          result.files.push({ path: relativePath, action: 'error' });
        }
      })
    );
  }

  const duration = Date.now() - startTime;

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Sync Summary');
  console.log('='.repeat(60));
  console.log(`✅ Imported: ${result.imported}`);
  console.log(`🔄 Updated:  ${result.updated}`);
  console.log(`⏭️  Skipped:  ${result.skipped}`);
  console.log(`❌ Errors:   ${result.errors.length}`);
  console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
  console.log('='.repeat(60) + '\n');

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(({ file, error }) => {
      console.log(`   ${file}: ${error}`);
    });
    console.log();
  }

  // Write sync report JSON for CI/CD
  const reportDir = path.join(process.cwd(), '.github', 'sync-reports');
  fs.mkdirSync(reportDir, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `sync-${timestamp}.json`);
  
  const report = {
    timestamp: new Date().toISOString(),
    trigger: process.env.GITHUB_EVENT_NAME || 'manual',
    branch: process.env.GITHUB_REF_NAME || 'local',
    commit: process.env.GITHUB_SHA || 'local',
    actor: process.env.GITHUB_ACTOR || 'local',
    summary: {
      totalFiles: files.length,
      imported: result.imported,
      updated: result.updated,
      skipped: result.skipped,
      errors: result.errors.length,
    },
    files: result.files,
    errors: result.errors,
    durationMs: duration,
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Sync report saved to: ${reportPath}\n`);

  // Return result for CI/CD artifact generation
  return result;
}

// Run if called directly
if (require.main === module) {
  syncContent()
    .then((result) => {
      if (result && result.errors.length > 0) {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { syncContent };

