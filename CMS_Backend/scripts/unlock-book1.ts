#!/usr/bin/env tsx

/**
 * Unlock Book 1: Stardust to Sovereignty
 * 
 * Changes book status from 'complete' to 'draft' to allow V4 updates
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

async function unlockBook1() {
  console.log('🔓 Unlocking Book 1: Stardust to Sovereignty\n');
  
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
    return;
  }
  
  const book = books[0];
  console.log(`📖 Found: ${book.title} (ID: ${book.id})`);
  console.log(`   Current status: ${book.status || 'null'}\n`);
  
  if (book.status !== 'complete') {
    console.log(`✅ Book 1 is already unlocked (status: ${book.status})\n`);
    return;
  }
  
  // Update status to 'draft' to allow updates
  const { data: updatedBook, error: updateError } = await supabase
    .from('books')
    .update({ status: 'draft' })
    .eq('id', book.id)
    .select()
    .single();
  
  if (updateError) {
    console.error('❌ Error unlocking book:', updateError.message);
    return;
  }
  
  console.log('✅ Book 1 unlocked successfully!');
  console.log(`   New status: ${updatedBook.status}\n`);
  console.log('🔓 Chapters can now be updated with V4 content\n');
}

unlockBook1();

