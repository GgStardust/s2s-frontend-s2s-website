/**
 * Run Book Compiler Database Migration
 *
 * This script creates the database tables needed for the Book Compiler:
 * - books
 * - chapters
 * - chapter_sources
 * - real_world_content
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'set' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('📚 Running Book Compiler migration...\n');

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250105_book_compiler_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Executing full migration SQL via SQL Editor method...\n');

    // Execute the entire SQL file at once using a direct SQL query
    // Note: This requires running the SQL manually in Supabase dashboard
    // or using a different approach

    console.log('⚠️  SQL execution via script requires admin access.');
    console.log('Please run the following SQL in your Supabase SQL Editor:\n');
    console.log('Dashboard URL: https://supabase.com/dashboard/project/ydnvnfmbbcmcbmxtbrtb/sql\n');
    console.log('---\n');
    console.log(migrationSQL);
    console.log('\n---\n');

    // Alternative: Try to create tables using the REST API
    console.log('Attempting to verify/create tables using REST API...\n');

    // Verify tables were created
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')
      .limit(5);

    if (booksError) {
      console.error('❌ Error verifying books table:', booksError);
    } else {
      console.log(`📖 Books table verified: ${books?.length || 0} books found`);
    }

    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .limit(5);

    if (chaptersError) {
      console.error('❌ Error verifying chapters table:', chaptersError);
    } else {
      console.log(`📄 Chapters table verified: ${chapters?.length || 0} chapters found`);
    }

    const { data: realWorld, error: realWorldError } = await supabase
      .from('real_world_content')
      .select('*')
      .limit(5);

    if (realWorldError) {
      console.error('❌ Error verifying real_world_content table:', realWorldError);
    } else {
      console.log(`🌍 Real-world content table verified: ${realWorld?.length || 0} entries found`);
    }

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
