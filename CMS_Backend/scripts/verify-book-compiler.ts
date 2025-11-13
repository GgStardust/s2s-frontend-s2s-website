#!/usr/bin/env tsx

/**
 * Verify Book Compiler has V4 content loaded
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

async function verifyCompiler() {
  console.log('🔍 Verifying Book Compiler V4 content...\n');
  
  // Find Book 1
  const { data: books } = await supabase
    .from('books')
    .select('id, title, status, current_word_count')
    .ilike('title', '%Stardust to Sovereignty%')
    .limit(1);
  
  if (!books || books.length === 0) {
    console.error('❌ Book 1 not found');
    return;
  }
  
  const book = books[0];
  console.log(`📖 Book: ${book.title}`);
  console.log(`   Status: ${book.status}`);
  console.log(`   Word count: ${book.current_word_count?.toLocaleString() || 'N/A'}\n`);
  
  // Get chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('chapter_number, title, word_count, status, content')
    .eq('book_id', book.id)
    .order('chapter_number', { ascending: true });
  
  console.log(`📚 Chapters: ${chapters?.length || 0}\n`);
  
  // Check chapter sources
  const { data: sources } = await supabase
    .from('chapter_sources')
    .select(`
      chapter_id,
      content_files (
        file_path,
        yaml_frontmatter
      )
    `)
    .limit(5);
  
  console.log('🔗 Chapter Sources (sample):\n');
  sources?.forEach((s: any) => {
    const yaml = s.content_files?.yaml_frontmatter as any;
    console.log(`   ${s.content_files?.file_path}`);
    console.log(`      Version: ${yaml?.version || 'unknown'}`);
  });
  
  console.log('\n✅ Book Compiler verification complete\n');
}

verifyCompiler();

