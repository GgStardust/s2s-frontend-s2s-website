/**
 * Inline Tag Preservation Verification
 * 
 * Verifies that compiled book chapters preserve all inline tags
 * from source content files
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TagPreservationResult {
  chapter_id: string;
  chapter_title: string;
  source_tags: string[];
  compiled_tags: string[];
  missing_tags: string[];
  preserved: boolean;
}

function extractInlineTags(content: string): string[] {
  const tags: string[] = [];
  
  // Extract @orb tags
  const orbMatches = content.matchAll(/@orb[_\s]*(\d+)/gi);
  for (const match of orbMatches) {
    tags.push(`@orb_${match[1]}`);
  }
  
  // Extract other @tags
  const tagMatches = content.matchAll(/@([a-z_]+)/gi);
  for (const match of tagMatches) {
    const tag = `@${match[1].toLowerCase()}`;
    if (!tags.includes(tag) && !tag.startsWith('@orb')) {
      tags.push(tag);
    }
  }
  
  return Array.from(new Set(tags));
}

async function verifyTagPreservation(bookId: string): Promise<TagPreservationResult[]> {
  console.log('🔍 Verifying Tag Preservation\n');

  // Get all chapters for the book
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .order('chapter_number', { ascending: true });

  if (chaptersError || !chapters) {
    throw new Error('Failed to fetch chapters');
  }

  const results: TagPreservationResult[] = [];

  for (const chapter of chapters) {
    // Get chapter sources
    const { data: sources, error: sourcesError } = await supabase
      .from('chapter_sources')
      .select(`
        *,
        content_files (
          id,
          title,
          markdown_body,
          content
        )
      `)
      .eq('chapter_id', chapter.id);

    if (sourcesError) {
      console.warn(`⚠️  Failed to fetch sources for chapter ${chapter.chapter_number}`);
      continue;
    }

    // Extract all tags from source files
    const sourceTags = new Set<string>();
    if (sources) {
      for (const source of sources) {
        const contentFile = (source as any).content_files;
        if (contentFile) {
          const content = contentFile.markdown_body || contentFile.content || '';
          const tags = extractInlineTags(content);
          tags.forEach(tag => sourceTags.add(tag));
        }
      }
    }

    // Extract tags from compiled chapter
    const compiledContent = chapter.content || '';
    const compiledTags = new Set(extractInlineTags(compiledContent));

    // Find missing tags
    const missingTags = Array.from(sourceTags).filter(tag => !compiledTags.has(tag));

    results.push({
      chapter_id: chapter.id,
      chapter_title: chapter.title,
      source_tags: Array.from(sourceTags).sort(),
      compiled_tags: Array.from(compiledTags).sort(),
      missing_tags: missingTags,
      preserved: missingTags.length === 0
    });
  }

  return results;
}

async function main() {
  try {
    // Get Stardust to Sovereignty book
    const { data: books } = await supabase
      .from('books')
      .select('*')
      .eq('title', 'Stardust to Sovereignty')
      .limit(1);

    if (!books || books.length === 0) {
      console.error('❌ Stardust to Sovereignty book not found');
      process.exit(1);
    }

    const book = books[0];
    console.log(`📖 Verifying tag preservation for: ${book.title}\n`);

    const results = await verifyTagPreservation(book.id);

    // Report results
    console.log('📊 Tag Preservation Report\n');
    console.log('='.repeat(60));

    let totalPreserved = 0;
    let totalMissing = 0;

    for (const result of results) {
      const status = result.preserved ? '✅' : '❌';
      console.log(`\n${status} Chapter ${result.chapter_title}`);
      console.log(`   Source tags: ${result.source_tags.length}`);
      console.log(`   Compiled tags: ${result.compiled_tags.length}`);
      
      if (result.missing_tags.length > 0) {
        console.log(`   ⚠️  Missing tags: ${result.missing_tags.join(', ')}`);
        totalMissing += result.missing_tags.length;
      } else {
        totalPreserved++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n📈 Summary:`);
    console.log(`   Chapters with preserved tags: ${totalPreserved}/${results.length}`);
    console.log(`   Total missing tags: ${totalMissing}`);

    // Save report
    const reportPath = path.join(process.cwd(), 'TAG_PRESERVATION_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { verifyTagPreservation };

