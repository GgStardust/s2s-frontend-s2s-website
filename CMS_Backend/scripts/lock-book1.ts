#!/usr/bin/env tsx

/**
 * Lock Book 1: Stardust to Sovereignty
 * 
 * Sets book status to 'complete' which locks all chapters from editing
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function lockBook1() {
  console.log('🔒 Locking Book 1: Stardust to Sovereignty\n');
  
  // Find Book 1
  const { data: books, error: findError } = await supabase
    .from('books')
    .select('id, title, status')
    .ilike('title', '%Stardust to Sovereignty%')
    .limit(1);
  
  if (findError) {
    console.error('❌ Error finding book:', findError.message);
    return;
  }
  
  if (!books || books.length === 0) {
    console.error('❌ Book 1 not found in database');
    console.log('\n💡 You may need to create Book 1 first or check the title');
    return;
  }
  
  const book = books[0];
  console.log(`📖 Found: ${book.title} (ID: ${book.id})`);
  console.log(`   Current status: ${book.status || 'null'}\n`);
  
  if (book.status === 'complete') {
    console.log('✅ Book 1 is already locked!\n');
    return;
  }
  
  // Update status to 'complete'
  const { data: updatedBook, error: updateError } = await supabase
    .from('books')
    .update({ status: 'complete' })
    .eq('id', book.id)
    .select()
    .single();
  
  if (updateError) {
    console.error('❌ Error locking book:', updateError.message);
    return;
  }
  
  console.log('✅ Book 1 locked successfully!');
  console.log(`   New status: ${updatedBook.status}\n`);
  console.log('🔐 All chapters are now read-only\n');
  
  // Verify chapters are protected
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id, chapter_number, title')
    .eq('book_id', book.id)
    .order('chapter_number', { ascending: true });
  
  if (chaptersError) {
    console.error('⚠️  Could not verify chapters:', chaptersError.message);
    return;
  }
  
  console.log(`📚 Protected ${chapters?.length || 0} chapters:\n`);
  chapters?.forEach(ch => {
    console.log(`   Chapter ${ch.chapter_number}: ${ch.title}`);
  });
  console.log('');
}

lockBook1();

