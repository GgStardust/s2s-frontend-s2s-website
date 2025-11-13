#!/usr/bin/env tsx

/**
 * S2S Clean Content Import Script
 * 
 * Imports only the clean, properly tagged files from:
 * - 02d_Orb_Essays/ (Orb essays)
 * - 02f_S2S_codex_essays/ (Codex essays)
 * 
 * Skips all other content to avoid duplicates
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

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

// Only process these specific directories
const TARGET_DIRECTORIES = [
  '02d_Orb_Essays',
  '02f_S2S_codex_essays',
  '02g_generated_book_content'
];

// Skip these files (empty or test files)
const SKIP_FILES = [
  'test_file.md',
  '.DS_Store'
];

function extractScrollstreams(content: string): string[] {
  const scrollstreamRegex = /@scrollstream\s+(.+?)(?=\n|$)/g;
  const matches = [];
  let match;
  
  while ((match = scrollstreamRegex.exec(content)) !== null) {
    matches.push(match[1].trim());
  }
  
  return matches;
}

function shouldSkipFile(fileName: string): boolean {
  return SKIP_FILES.includes(fileName) || fileName.startsWith('.');
}

async function importFile(filePath: string, relativePath: string) {
  try {
    stats.total++;
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content: markdownBody } = matter(fileContent);
    
    // Extract scrollstreams
    const scrollstreams = extractScrollstreams(markdownBody);
    stats.scrollstreamsExtracted += scrollstreams.length;
    
    // Extract orb associations from the complex structure
    let orbAssociations: string[] = [];
    if (frontmatter.orb_associations) {
      if (Array.isArray(frontmatter.orb_associations)) {
        orbAssociations = frontmatter.orb_associations;
      } else if (typeof frontmatter.orb_associations === 'object') {
        // Handle the complex structure: extract all orb references
        const orbRefs = new Set<string>();
        
        if (frontmatter.orb_associations.primary_orb) {
          orbRefs.add(frontmatter.orb_associations.primary_orb);
        }
        
        if (frontmatter.orb_associations.secondary_orbs && Array.isArray(frontmatter.orb_associations.secondary_orbs)) {
          frontmatter.orb_associations.secondary_orbs.forEach((orb: string) => orbRefs.add(orb));
        }
        
        if (frontmatter.orb_associations.orb_mentions_all && Array.isArray(frontmatter.orb_associations.orb_mentions_all)) {
          frontmatter.orb_associations.orb_mentions_all.forEach((orb: string) => orbRefs.add(orb));
        }
        
        orbAssociations = Array.from(orbRefs);
      }
    }

    // Prepare content data
    const contentData = {
      title: frontmatter.title || path.basename(filePath, '.md'),
      file_path: relativePath,
      content_type: frontmatter.type || 'essay',
      status: frontmatter.status || 'active',
      markdown_body: markdownBody,
      yaml_frontmatter: frontmatter,
      orb_associations: orbAssociations,
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
      book_assignment: frontmatter.book_assignment || 'none',
      is_primary_source: frontmatter.is_primary_source !== false,
      related_to: frontmatter.related_to || [],
    };

    // Insert or update into database (upsert to handle duplicates and updates)
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
    if (scrollstreams.length > 0) {
      console.log(`   📜 Extracted ${scrollstreams.length} scrollstream(s)`);
    }
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

        if (scrollError) {
          console.error(`   ⚠️  Scrollstream error:`, scrollError.message);
        }
      }
    }

  } catch (err: any) {
    console.error(`❌ Error processing ${relativePath}:`, err.message);
    stats.errors++;
  }
}

async function scanDirectory(dirPath: string, relativePath: string) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const itemRelativePath = path.join(relativePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Only process target directories
      if (TARGET_DIRECTORIES.includes(item)) {
        await scanDirectory(fullPath, itemRelativePath);
      } else {
        console.log(`⏭️  Skipping directory: ${itemRelativePath}`);
        stats.skipped++;
      }
    } else if (item.endsWith('.md')) {
      if (shouldSkipFile(item)) {
        console.log(`⏭️  Skipping file: ${itemRelativePath}`);
        stats.skipped++;
        continue;
      }
      
      await importFile(fullPath, itemRelativePath);
    } else {
      console.log(`⏭️  Skipping non-markdown: ${itemRelativePath}`);
      stats.skipped++;
    }
  }
}

async function main() {
  console.log('🚀 Starting S2S Clean Content Import...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const processedDir = path.join(process.cwd(), '09_PROCESSED');
  
  if (!fs.existsSync(processedDir)) {
    console.error('❌ 09_PROCESSED directory not found!');
    process.exit(1);
  }
  
  await scanDirectory(processedDir, '');
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Import Summary:\n');
  console.log(`   Total files scanned:     ${stats.total}`);
  console.log(`   ✅ Successfully imported: ${stats.imported}`);
  console.log(`   ⏭️  Skipped:               ${stats.skipped}`);
  console.log(`   ❌ Errors:                ${stats.errors}`);
  console.log(`   📜 Scrollstreams:         ${stats.scrollstreamsExtracted}`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (stats.errors === 0) {
    console.log('✨ Clean content successfully imported to Supabase!\n');
    console.log('Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000/creator/library');
    console.log('   3. View your clean content');
  } else {
    console.log(`⚠️  ${stats.errors} files had errors. Check logs above for details.`);
  }
}

main().catch(console.error);
