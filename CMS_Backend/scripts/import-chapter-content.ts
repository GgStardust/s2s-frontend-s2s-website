/**
 * Import Chapter Content Script
 *
 * Imports actual chapter content from existing files
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importChapterContent() {
  console.log('📚 Importing chapter content from existing files...\n');

  try {
    // Get fiction book
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')
      .eq('type', 'fiction');

    if (booksError || !books || books.length === 0) {
      console.error('Fiction book not found');
      return;
    }

    const fictionBook = books[0];

    // Get chapters 3 and 7
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', fictionBook.id)
      .in('chapter_number', [3, 7]);

    if (chaptersError || !chapters) {
      console.error('Chapters not found:', chaptersError);
      return;
    }

    // Read chapter 3 content
    const chapter3Path = path.join(
      process.cwd(),
      '06_FICTION_PROJECT/fiction_project/chapters/chapter_3_boardwalk_transmission.md'
    );
    const chapter3Content = fs.readFileSync(chapter3Path, 'utf-8');
    const chapter3WordCount = chapter3Content.split(/\s+/).length;

    const chapter3 = chapters.find(c => c.chapter_number === 3);
    if (chapter3) {
      const { error } = await supabase
        .from('chapters')
        .update({
          content: chapter3Content,
          word_count: chapter3WordCount,
          status: 'complete',
        })
        .eq('id', chapter3.id);

      if (error) {
        console.error('Error updating chapter 3:', error);
      } else {
        console.log(`✅ Chapter 3: The Boardwalk Transmission - ${chapter3WordCount} words imported`);
      }
    }

    // Read chapter 7 content
    const chapter7Path = path.join(
      process.cwd(),
      '06_FICTION_PROJECT/fiction_project/chapters/chapter_7_dive_bar_alchemy.md'
    );
    const chapter7Content = fs.readFileSync(chapter7Path, 'utf-8');
    const chapter7WordCount = chapter7Content.split(/\s+/).length;

    const chapter7 = chapters.find(c => c.chapter_number === 7);
    if (chapter7) {
      const { error } = await supabase
        .from('chapters')
        .update({
          content: chapter7Content,
          word_count: chapter7WordCount,
          status: 'complete',
        })
        .eq('id', chapter7.id);

      if (error) {
        console.error('Error updating chapter 7:', error);
      } else {
        console.log(`✅ Chapter 7: The Dive Bar Alchemy - ${chapter7WordCount} words imported`);
      }
    }

    console.log('\n✅ Chapter content import complete!');
    console.log(`Fiction book now has ${chapters.length} chapters with content`);

  } catch (err) {
    console.error('❌ Import failed:', err);
  }
}

importChapterContent();
