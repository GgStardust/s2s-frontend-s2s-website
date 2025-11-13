/**
 * Book 1 Import Script
 * 
 * Imports the completed "Stardust to Sovereignty" Book 1 from content_files
 * into the Book Compiler (books + chapters tables).
 * 
 * Source: content_files table (where chapters are already synced)
 * Destination: books + chapters + chapter_sources tables
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ContentFile {
  id: string;
  title: string;
  file_path: string;
  markdown_body: string;
  yaml_frontmatter: any;
  orb_associations: string[];
  tags: string[];
  word_count?: number;
}

interface ChapterData {
  chapterNumber: number;
  title: string;
  content: string;
  contentType: 'chapter' | 'interlude';
  contentFileId: string;
  yaml: any;
  wordCount: number;
}

/**
 * Extract chapter number from filename
 * CHAPTER_01_THE_STARDUST_WITHIN.md -> 1
 * INTERLUDE_FROM_STARDUST_TO_TECHNOLOGY.md -> interlude (needs special handling)
 */
function extractChapterNumber(filePath: string, title: string): number | null {
  // Try to extract from filename
  const match = filePath.match(/CHAPTER_(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }

  // Try to extract from title
  const titleMatch = title.match(/Chapter\s+(\d+)/i);
  if (titleMatch) {
    return parseInt(titleMatch[1], 10);
  }

  return null;
}

/**
 * Sort chapters and interludes for proper ordering
 * Interludes are kept separate and numbered sequentially after chapters
 */
function sortChapters(chapters: ChapterData[]): ChapterData[] {
  const chapterChapters = chapters.filter(c => c.contentType === 'chapter');
  const interludes = chapters.filter(c => c.contentType === 'interlude');
  
  // Sort chapters by number
  chapterChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
  
  // Sort interludes by filename (for consistent ordering)
  interludes.sort((a, b) => {
    // Extract potential ordering from filename if available
    return a.title.localeCompare(b.title);
  });
  
  // Return chapters first, then interludes
  return [...chapterChapters, ...interludes];
}

/**
 * Build table of contents from sorted chapters
 */
function buildTableOfContents(chapters: ChapterData[]): string {
  const toc: string[] = [];
  
  chapters.forEach((chapter) => {
    if (chapter.contentType === 'chapter') {
      toc.push(`${chapter.chapterNumber}. ${chapter.title}`);
    } else {
      toc.push(`Interlude: ${chapter.title}`);
    }
  });
  
  return toc.join('\n');
}

/**
 * Calculate total word count
 */
function calculateWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Main import function
 */
async function importBook1() {
  console.log('📚 Starting Book 1 import from content_files...\n');

  try {
    // Step 1: Query content_files for Book 1 chapters and interludes
    console.log('Step 1: Fetching Book 1 content from content_files...');
    const { data: contentFiles, error: fetchError } = await supabase
      .from('content_files')
      .select('*')
      .or('file_path.ilike.%02g_generated_book_content/CHAPTER_%,file_path.ilike.%02g_generated_book_content/INTERLUDE_%')
      .order('file_path', { ascending: true });

    if (fetchError) {
      throw new Error(`Failed to fetch content files: ${fetchError.message}`);
    }

    if (!contentFiles || contentFiles.length === 0) {
      throw new Error('No Book 1 chapters found in content_files. Make sure sync has run.');
    }

    console.log(`   Found ${contentFiles.length} files\n`);

    // Step 2: Process and categorize files
    console.log('Step 2: Processing chapters and interludes...');
    const chapters: ChapterData[] = [];
    const otherFiles: ContentFile[] = [];

    for (const file of contentFiles as ContentFile[]) {
      const isChapter = file.file_path.includes('CHAPTER_');
      const isInterlude = file.file_path.includes('INTERLUDE_');
      
      if (isChapter || isInterlude) {
        const chapterNum = extractChapterNumber(file.file_path, file.title);
        const wordCount = file.word_count || calculateWordCount(file.markdown_body);
        
        chapters.push({
          chapterNumber: chapterNum || 999, // Interludes get high number, will be sorted
          title: file.title,
          content: file.markdown_body,
          contentType: isChapter ? 'chapter' : 'interlude',
          contentFileId: file.id,
          yaml: file.yaml_frontmatter,
          wordCount,
        });
      } else {
        otherFiles.push(file);
      }
    }

    // Sort chapters properly
    const sortedChapters = sortChapters(chapters);
    console.log(`   Processed ${sortedChapters.length} chapters/interludes`);
    console.log(`   Chapters: ${sortedChapters.filter(c => c.contentType === 'chapter').length}`);
    console.log(`   Interludes: ${sortedChapters.filter(c => c.contentType === 'interlude').length}\n`);

    // Step 3: Check if book already exists
    console.log('Step 3: Checking for existing Book 1...');
    const { data: existingBooks, error: bookCheckError } = await supabase
      .from('books')
      .select('id, title')
      .ilike('title', '%Stardust to Sovereignty%')
      .limit(1);

    if (bookCheckError) {
      throw new Error(`Failed to check existing books: ${bookCheckError.message}`);
    }

    let bookId: string;
    if (existingBooks && existingBooks.length > 0) {
      console.log(`   Found existing book: ${existingBooks[0].title}`);
      bookId = existingBooks[0].id;
      console.log(`   Updating existing book (ID: ${bookId})\n`);
    } else {
      // Step 4: Create books record
      console.log('Step 4: Creating books record...');
      const totalWordCount = sortedChapters.reduce((sum, ch) => sum + ch.wordCount, 0);
      const tableOfContents = buildTableOfContents(sortedChapters);
      
      const bookData = {
        title: 'Stardust to Sovereignty',
        type: 'non_fiction',
        status: 'complete',
        description: 'A visionary cosmology mapping consciousness awakening to its cosmic origins',
        target_word_count: null, // Don't set target for complete book
        current_word_count: totalWordCount,
        purpose: 'Establishes the foundational framework for understanding consciousness as cosmic intelligence expressing through biological form',
        overview: 'Maps the journey from stardust to sovereignty, exploring how cosmic intelligence inhabits human form and how this recognition resolves the consciousness-technology gap',
        book_structure: '15 chapters organized in 4 parts, with 11 interludes bridging transitions',
        table_of_contents: tableOfContents,
      };

      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single();

      if (bookError) {
        throw new Error(`Failed to create book: ${bookError.message}`);
      }

      bookId = book.id;
      console.log(`   Created book (ID: ${bookId})`);
      console.log(`   Total word count: ${totalWordCount.toLocaleString()}\n`);
    }

    // Step 5: Delete existing chapters (if updating)
    if (existingBooks && existingBooks.length > 0) {
      console.log('Step 5: Clearing existing chapters...');
      const { error: deleteError } = await supabase
        .from('chapters')
        .delete()
        .eq('book_id', bookId);

      if (deleteError) {
        throw new Error(`Failed to delete existing chapters: ${deleteError.message}`);
      }
      console.log('   Cleared existing chapters\n');
    }

    // Step 6: Create chapters records
    console.log('Step 6: Creating chapters records...');
    let currentChapterNumber = 1;
    let interludeCounter = 1;

    for (const chapterData of sortedChapters) {
      // Extract primary orb from YAML
      const primaryOrb = chapterData.yaml?.orb_associations?.primary_orb || 
                        (Array.isArray(chapterData.yaml?.orb_associations) 
                          ? chapterData.yaml.orb_associations[0] 
                          : null);

      // Determine chapter number
      let chapterNumber: number;
      if (chapterData.contentType === 'chapter') {
        chapterNumber = chapterData.chapterNumber;
        currentChapterNumber = chapterNumber + 1; // Track for next chapter
      } else {
        // Interludes: use 100+ numbering (100, 101, 102...) to keep them separate
        chapterNumber = 100 + interludeCounter;
        interludeCounter++;
      }

      const chapterRecord = {
        book_id: bookId,
        chapter_number: chapterNumber,
        title: chapterData.title,
        part_number: null, // Can be extracted from YAML if needed
        part_title: null,  // Can be extracted from YAML if needed
        status: 'complete',
        word_count: chapterData.wordCount,
        content: chapterData.content,
        notes: chapterData.contentType === 'interlude' ? 'Interlude' : null,
        orb_focus: primaryOrb,
        assigned_files: [chapterData.contentFileId], // Link to source content_file
      };

      const { data: chapter, error: chapterError } = await supabase
        .from('chapters')
        .insert(chapterRecord)
        .select()
        .single();

      if (chapterError) {
        console.error(`   ❌ Failed to create chapter "${chapterData.title}": ${chapterError.message}`);
        continue;
      }

      // Step 7: Create chapter_sources link
      // Try file_id first (migration renamed source_file_id to file_id)
      let sourceError: any = null;
      let inserted = false;
      
      // Try file_id (renamed column)
      const { error: error1 } = await supabase
        .from('chapter_sources')
        .insert({
          chapter_id: chapter.id,
          file_id: chapterData.contentFileId,
          source_type: 'essay',
          ai_suggested: false,
          user_confirmed: true,
          relevance_score: 1.0,
        });
      
      if (!error1) {
        inserted = true;
      } else {
        // Fallback to source_file_id if migration hasn't run
        const { error: error2 } = await supabase
          .from('chapter_sources')
          .insert({
            chapter_id: chapter.id,
            source_file_id: chapterData.contentFileId,
            source_type: 'essay',
            ai_suggested: false,
            user_confirmed: true,
            relevance_score: 1.0,
          });
        
        sourceError = error2;
        if (!error2) inserted = true;
      }

      if (!inserted) {
        console.error(`   ⚠️  Failed to link source for "${chapterData.title}": ${sourceError?.message || 'Unknown error'}`);
      } else {
        console.log(`   ✅ Created: ${chapterData.title} (${chapterData.wordCount} words)`);
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   Book ID: ${bookId}`);
    console.log(`   Total chapters/interludes: ${sortedChapters.length}`);
    console.log(`   Total word count: ${sortedChapters.reduce((sum, ch) => sum + ch.wordCount, 0).toLocaleString()}\n`);

  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the import
importBook1()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

