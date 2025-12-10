/**
 * Check Console V3 Database Schema
 * Verifies table structure matches expected schema
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('Checking Console V3 schema...\n');

  // Check diagnostic_questions table structure
  const { data: questions, error } = await supabase
    .from('diagnostic_questions')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error querying diagnostic_questions:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Try to get table info via raw SQL (if possible)
    console.log('\nTrying to get table structure...');
    return;
  }

  if (questions && questions.length > 0) {
    console.log('✓ diagnostic_questions table exists');
    console.log('Columns found:', Object.keys(questions[0]));
    console.log('\nSample row:', JSON.stringify(questions[0], null, 2));
  } else {
    console.log('✓ diagnostic_questions table exists (empty)');
  }

  // Check if question_order column exists by trying to order by it
  const { error: orderError } = await supabase
    .from('diagnostic_questions')
    .select('*')
    .order('question_order', { ascending: true })
    .limit(1);

  if (orderError) {
    console.log('\n⚠️  Warning: Cannot order by question_order');
    console.log('Error:', orderError.message);
    console.log('\nThis suggests the column may not exist or have a different name.');
  } else {
    console.log('\n✓ question_order column exists and is queryable');
  }
}

checkSchema().catch(console.error);

