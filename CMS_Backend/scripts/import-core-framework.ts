#!/usr/bin/env tsx

/**
 * Import 01_CORE_FRAMEWORK files into Supabase
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import { shouldExcludeFile } from '../lib/config';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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

/**
 * Extract scrollstream entries from markdown content
 */
function extractScrollstreams(content: string): string[] {
  const scrollstreams: string[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1].trim();

    if (line === '**@scrollstream**' && nextLine) {
      scrollstreams.push(nextLine);
    }
  }

  return scrollstreams;
}

async function importCoreFramework() {
  console.log('\n🚀 Importing 01_CORE_FRAMEWORK files...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const coreFrameworkDir = path.join(process.cwd(), '01_CORE_FRAMEWORK');
  const files = fs.readdirSync(coreFrameworkDir).filter(f => f.endsWith('.md'));

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const filename of files) {
    try {
      const filePath = path.join(coreFrameworkDir, filename);
      const relativePath = `01_CORE_FRAMEWORK/${filename}`;

      console.log(`Processing: ${filename}`);

      // Read and parse file
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content: markdownBody } = matter(fileContent);

      // Extract scrollstreams
      const scrollstreams = extractScrollstreams(markdownBody);

      // Prepare data
      const contentData = {
        title: frontmatter.title || filename.replace('.md', ''),
        file_path: relativePath,
        content_type: frontmatter.type || 'codex_core',
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

      // Insert or update
      const { data, error } = await supabase
        .from('content_files')
        .upsert(contentData, {
          onConflict: 'file_path',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        console.error(`  ❌ Error: ${error.message}`);
        errors++;
        continue;
      }

      console.log(`  ✅ Imported`);
      imported++;

      // Import scrollstreams
      if (scrollstreams.length > 0 && data) {
        for (const scrollContent of scrollstreams) {
          await supabase
            .from('scrollstreams')
            .insert({
              content: scrollContent,
              source_file_id: data.id,
              orb_associations: contentData.orb_associations,
              tags: contentData.tags,
              status: 'published',
            });
        }
        console.log(`  📜 Extracted ${scrollstreams.length} scrollstream(s)`);
      }

    } catch (err) {
      console.error(`  ❌ Error processing ${filename}:`, err);
      errors++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Summary:\n');
  console.log(`   Total files: ${files.length}`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

importCoreFramework().catch(console.error);
