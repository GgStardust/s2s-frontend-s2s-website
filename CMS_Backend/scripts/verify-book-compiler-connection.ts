import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('🔍 Verifying Book Compiler Connection...\n');

  // 1. List all books
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('id, title, current_word_count, status, created_at')
    .order('created_at', { ascending: false });

  if (booksError) {
    console.error('❌ Error fetching books:', booksError);
    return;
  }

  console.log(`📚 Found ${books?.length || 0} book(s):\n`);
  books?.forEach((book, idx) => {
    console.log(`  ${idx + 1}. ${book.title}`);
    console.log(`     ID: ${book.id}`);
    console.log(`     Status: ${book.status}`);
    console.log(`     Word Count: ${book.current_word_count || 0}`);
    console.log(`     Created: ${book.created_at}`);
    console.log('');
  });

  // 2. For each book, check chapters
  if (books && books.length > 0) {
    for (const book of books) {
      console.log(`\n📖 Checking chapters for: ${book.title} (${book.id})`);
      
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select('id, chapter_number, title, word_count, status')
        .eq('book_id', book.id)
        .order('chapter_number', { ascending: true });

      if (chaptersError) {
        console.error(`   ❌ Error: ${chaptersError.message}`);
      } else {
        console.log(`   ✅ Found ${chapters?.length || 0} chapters`);
        if (chapters && chapters.length > 0) {
          console.log(`   First 3 chapters:`);
          chapters.slice(0, 3).forEach(ch => {
            console.log(`     - ${ch.chapter_number || 'N/A'}: ${ch.title || 'Untitled'}`);
          });
          if (chapters.length > 3) {
            console.log(`     ... and ${chapters.length - 3} more`);
          }
        } else {
          console.log(`   ⚠️  No chapters found for this book`);
        }
      }
    }
  }

  // 3. Check for Chapter 7 duplicates in the correct book
  const book1Id = books?.find(b => b.title === 'Stardust to Sovereignty')?.id;
  if (book1Id) {
    console.log(`\n🔍 Checking for Chapter 7 duplicates in Book 1...`);
    const { data: chapter7s } = await supabase
      .from('chapters')
      .select('id, chapter_number, title')
      .eq('book_id', book1Id)
      .eq('chapter_number', 7);

    if (chapter7s && chapter7s.length > 1) {
      console.log(`   ⚠️  Found ${chapter7s.length} Chapter 7 records:`);
      chapter7s.forEach(ch => {
        console.log(`     - ${ch.title} (ID: ${ch.id})`);
      });
      
      // Keep the one with "Alchemical Current" in the title
      const correctOne = chapter7s.find(ch => 
        ch.title?.toLowerCase().includes('alchemical')
      );
      const wrongOnes = chapter7s.filter(ch => 
        !ch.title?.toLowerCase().includes('alchemical')
      );

      if (correctOne && wrongOnes.length > 0) {
        console.log(`\n   🗑️  Removing ${wrongOnes.length} incorrect Chapter 7 record(s):`);
        for (const wrong of wrongOnes) {
          console.log(`     - Removing: ${wrong.title} (${wrong.id})`);
          const { error } = await supabase
            .from('chapters')
            .delete()
            .eq('id', wrong.id);
          
          if (error) {
            console.error(`       ❌ Error: ${error.message}`);
          } else {
            console.log(`       ✅ Removed`);
          }
        }
      }
    } else if (chapter7s && chapter7s.length === 1) {
      console.log(`   ✅ Only one Chapter 7 found: ${chapter7s[0].title}`);
    } else {
      console.log(`   ⚠️  No Chapter 7 found!`);
    }
  }

  console.log('\n✅ Verification complete!\n');
}

verify().catch(console.error);






