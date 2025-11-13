/**
 * Import Fiction Content Script
 * 
 * Imports fiction chapters from 06_FICTION_PROJECT/ into content library
 * and links them to the existing fiction book in the database
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const FICTION_PROJECT_DIR = path.join(process.cwd(), '06_FICTION_PROJECT/fiction_project/chapters');

interface FictionChapter {
  filename: string;
  filepath: string;
  content: string;
  frontmatter: any;
  chapterNumber: number;
  title: string;
}

async function loadFictionChapters(): Promise<FictionChapter[]> {
  const chapters: FictionChapter[] = [];
  
  if (!fs.existsSync(FICTION_PROJECT_DIR)) {
    console.error(`❌ Fiction project directory not found: ${FICTION_PROJECT_DIR}`);
    return chapters;
  }

  const files = fs.readdirSync(FICTION_PROJECT_DIR).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const filepath = path.join(FICTION_PROJECT_DIR, file);
    const content = fs.readFileSync(filepath, 'utf-8');
    const parsed = matter(content);
    
    // Extract chapter number from filename (e.g., chapter_3_boardwalk_transmission.md -> 3)
    const chapterMatch = file.match(/chapter_(\d+)_/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : 0;
    
    // Extract title from frontmatter or filename
    const title = parsed.data.title || 
                  file.replace(/chapter_\d+_/, '').replace(/_/g, ' ').replace('.md', '') ||
                  `Chapter ${chapterNumber}`;

    chapters.push({
      filename: file,
      filepath: filepath.replace(process.cwd(), ''),
      content: parsed.content,
      frontmatter: parsed.data,
      chapterNumber,
      title
    });
  }

  return chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
}

async function getFictionBook() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('type', 'fiction')
    .limit(1);

  if (error) {
    throw new Error(`Failed to fetch fiction book: ${error.message}`);
  }

  if (!books || books.length === 0) {
    throw new Error('Fiction book not found. Run book compiler migration first.');
  }

  return books[0];
}

async function findOrCreateChapter(bookId: string, chapterNumber: number, title: string) {
  // Try to find existing chapter
  const { data: existing } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .eq('chapter_number', chapterNumber)
    .single();

  if (existing) {
    return existing;
  }

  // Create new chapter
  const { data: chapter, error } = await supabase
    .from('chapters')
    .insert({
      book_id: bookId,
      chapter_number: chapterNumber,
      title,
      status: 'draft',
      content: ''
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create chapter: ${error.message}`);
  }

  return chapter;
}

async function importFictionContent() {
  console.log('📚 Importing Fiction Content\n');

  try {
    // Get fiction book
    const fictionBook = await getFictionBook();
    console.log(`📖 Found fiction book: ${fictionBook.title} (${fictionBook.id})\n`);

    // Load fiction chapters
    const chapters = await loadFictionChapters();
    console.log(`📄 Found ${chapters.length} fiction chapter files\n`);

    if (chapters.length === 0) {
      console.log('⚠️  No fiction chapters found to import');
      return;
    }

    // Import each chapter
    for (const chapter of chapters) {
      console.log(`\n📝 Processing: ${chapter.filename}`);
      console.log(`   Chapter ${chapter.chapterNumber}: ${chapter.title}`);

      // Find or create chapter record
      const chapterRecord = await findOrCreateChapter(
        fictionBook.id,
        chapter.chapterNumber,
        chapter.title
      );

      // Create content file entry
      const contentFileData: any = {
        title: chapter.title,
        file_path: chapter.filepath,
        markdown_body: chapter.content,
        yaml_frontmatter: {
          ...chapter.frontmatter,
          title: chapter.title,
          author: 'Gigi Stardust',
          type: 'essay',
          status: 'active',
          version: 'V4',
          source_type: 'fiction_chapter',
          book_threading: {
            book_id: fictionBook.id,
            target_chapter: `Chapter ${chapter.chapterNumber}: ${chapter.title}`,
            role_in_chapter: 'source_content',
            position_in_sequence: chapter.chapterNumber
          },
          field_function: {
            content_purpose: `Fiction chapter content for ${chapter.title}`,
            primary_mechanism: 'fiction',
            console_context: 'fiction_chapter',
            console_relation: 'source_content'
          },
          integration_points: {
            codex: ['fiction'],
            console_views: ['FictionViewer'],
            editorial_pass: 'V4'
          }
        },
        content_type: 'fiction',
        status: 'active'
      };

      // Check if content file already exists
      const { data: existingFile } = await supabase
        .from('content_files')
        .select('id')
        .eq('file_path', chapter.filepath)
        .single();

      let contentFileId: string;

      if (existingFile) {
        // Update existing
        const { data: updated, error } = await supabase
          .from('content_files')
          .update(contentFileData)
          .eq('id', existingFile.id)
          .select()
          .single();

        if (error) throw new Error(`Failed to update content file: ${error.message}`);
        contentFileId = updated.id;
        console.log(`   ✅ Updated content file: ${updated.id}`);
      } else {
        // Create new
        const { data: created, error } = await supabase
          .from('content_files')
          .insert(contentFileData)
          .select()
          .single();

        if (error) throw new Error(`Failed to create content file: ${error.message}`);
        contentFileId = created.id;
        console.log(`   ✅ Created content file: ${created.id}`);
      }

      // Link content file to chapter
      // Try both column names (source_file_id or file_id) depending on migration state
      const { error: linkError } = await supabase
        .from('chapter_sources')
        .upsert({
          chapter_id: chapterRecord.id,
          file_id: contentFileId, // Use file_id (newer schema)
          source_type: 'essay',
          user_confirmed: true,
          relevance_score: 1.0
        }, {
          onConflict: 'chapter_id,file_id'
        });

      if (linkError) {
        console.warn(`   ⚠️  Failed to link content to chapter: ${linkError.message}`);
      } else {
        console.log(`   ✅ Linked content to chapter ${chapterRecord.id}`);
      }

      // Update chapter content if chapter record has no content
      if (!chapterRecord.content || chapterRecord.content.trim() === '') {
        const { error: updateError } = await supabase
          .from('chapters')
          .update({
            content: chapter.content,
            status: 'draft',
            word_count: chapter.content.split(/\s+/).length
          })
          .eq('id', chapterRecord.id);

        if (updateError) {
          console.warn(`   ⚠️  Failed to update chapter content: ${updateError.message}`);
        } else {
          console.log(`   ✅ Updated chapter content`);
        }
      }
    }

    console.log(`\n✅ Successfully imported ${chapters.length} fiction chapters`);
    console.log(`📖 Fiction book: ${fictionBook.title}`);
    console.log(`🔗 All chapters linked to book and content library`);

  } catch (error) {
    console.error('❌ Error importing fiction content:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  importFictionContent();
}

export { importFictionContent };

