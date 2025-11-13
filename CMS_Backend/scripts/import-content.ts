#!/usr/bin/env tsx

/**
 * S2S Content Import Script
 *
 * Scans 09_PROCESSED folder, parses markdown files with YAML frontmatter,
 * and imports them into Supabase database.
 *
 * Respects exclusion rules from lib/config.ts
 * Extracts embedded scrollstreams
 * Follows strict writing rules from PROCESSING_WORKFLOW.md
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import { shouldExcludeFile } from '../lib/config';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Supabase client with service role key (admin access)
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

interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  errors: number;
  scrollstreamsExtracted: number;
}

const stats: ImportStats = {
  total: 0,
  imported: 0,
  skipped: 0,
  errors: 0,
  scrollstreamsExtracted: 0,
};

/**
 * Extract scrollstream entries from markdown content
 * Looks for lines tagged with **@scrollstream**
 */
function extractScrollstreams(content: string): string[] {
  const scrollstreams: string[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1].trim();

    // Look for **@scrollstream** marker followed by content
    if (line === '**@scrollstream**' && nextLine) {
      scrollstreams.push(nextLine);
    }
  }

  return scrollstreams;
}

/**
 * Process a single markdown file
 */
async function processFile(filePath: string, relativePath: string) {
  try {
    stats.total++;

    // Check exclusion list
    if (shouldExcludeFile(relativePath)) {
      console.log(`⏭️  Skipping (excluded): ${relativePath}`);
      stats.skipped++;
      return;
    }

    // Read file
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Parse frontmatter
    const { data: frontmatter, content: markdownBody } = matter(fileContent);

    // Extract scrollstreams
    const scrollstreams = extractScrollstreams(markdownBody);

    // Prepare data for database
    const contentData = {
      title: frontmatter.title || path.basename(filePath, '.md'),
      file_path: relativePath,
      content_type: frontmatter.type || 'supporting_essay',
      status: frontmatter.status || 'active',
      markdown_body: markdownBody,
      yaml_frontmatter: frontmatter,
      orb_associations: frontmatter.orb_associations || [],
      tags: frontmatter.tags || [],
      resonance_rating: frontmatter.resonance_rating || 5,
      resonance_metrics: frontmatter.resonance_metrics || {
        strength: 10,
        clarity: 10,
        coherence: 10,
        pattern: 10,
      },
      dashboard_component: frontmatter.dashboard_component || null,
      codex_destination: frontmatter.codex_destination || null,
      book_threading: frontmatter.book_threading || null,
      is_primary_source: frontmatter.is_primary_source !== false,
      related_to: frontmatter.related_to || [],
    };

    // Insert into database (upsert to handle duplicates)
    const { data, error } = await supabase
      .from('content_files')
      .upsert(contentData, {
        onConflict: 'file_path',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Error importing ${relativePath}:`, error.message);
      stats.errors++;
      return;
    }

    console.log(`✅ Imported: ${relativePath}`);
    stats.imported++;

    // Import scrollstreams if any
    if (scrollstreams.length > 0 && data) {
      for (const scrollContent of scrollstreams) {
        const { error: scrollError } = await supabase
          .from('scrollstreams')
          .insert({
            content: scrollContent,
            source_file_id: data.id,
            orb_associations: contentData.orb_associations,
            tags: contentData.tags,
            status: 'published',
          });

        if (!scrollError) {
          stats.scrollstreamsExtracted++;
        }
      }

      if (scrollstreams.length > 0) {
        console.log(`   📜 Extracted ${scrollstreams.length} scrollstream(s)`);
      }
    }

  } catch (error) {
    console.error(`❌ Error processing ${relativePath}:`, error);
    stats.errors++;
  }
}

/**
 * Recursively scan directory for markdown files
 */
async function scanDirectory(dirPath: string, baseDir: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      await scanDirectory(fullPath, baseDir);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Process markdown file
      await processFile(fullPath, relativePath);
    }
  }
}

/**
 * Main import function
 */
async function main() {
  console.log('\n🚀 Starting S2S Content Import...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Supabase credentials not found in .env.local');
    console.error('   Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const processedDir = path.join(process.cwd(), '09_PROCESSED');

  // Check if directory exists
  if (!fs.existsSync(processedDir)) {
    console.error(`❌ Directory not found: ${processedDir}`);
    process.exit(1);
  }

  console.log(`📂 Scanning: 09_PROCESSED/\n`);

  // Scan and import
  await scanDirectory(processedDir, processedDir);

  // Print summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Import Summary:\n');
  console.log(`   Total files scanned:     ${stats.total}`);
  console.log(`   ✅ Successfully imported: ${stats.imported}`);
  console.log(`   ⏭️  Skipped (excluded):   ${stats.skipped}`);
  console.log(`   ❌ Errors:                ${stats.errors}`);
  console.log(`   📜 Scrollstreams:         ${stats.scrollstreamsExtracted}`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (stats.imported > 0) {
    console.log('✨ Content successfully imported to Supabase!\n');
    console.log('Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000/creator/library');
    console.log('   3. View your imported content\n');
  }

  if (stats.errors > 0) {
    console.log(`⚠️  ${stats.errors} files had errors. Check logs above for details.\n`);
  }
}

// Run the import
main().catch(console.error);
