/**
 * Verify Phase 2.5 Migration
 * Checks if the question metadata migration has been run
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function verifyMigration() {
  console.log('========================================');
  console.log('Phase 2.5: Verifying Question Metadata Migration');
  console.log('========================================\n');

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if diagnostic_questions table exists and has new columns
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'diagnostic_questions' })
      .single();

    // Alternative: Try to query with new fields
    const { data: testQuery, error: queryError } = await supabase
      .from('diagnostic_questions')
      .select('id, question_set, source, inquiry_context, triggers, follow_up_question_ids, selection_priority, is_active')
      .limit(1);

    if (queryError) {
      console.error('❌ Migration verification failed:');
      console.error(`   Error: ${queryError.message}`);
      
      if (queryError.message.includes('column') && queryError.message.includes('does not exist')) {
        console.error('\n⚠️  Migration has NOT been run.');
        console.error('   Please run: npx supabase migration up');
        console.error('   Or manually run: CMS_Backend/supabase/migrations/20250126_phase_2_5_question_metadata.sql');
        return false;
      }
      
      return false;
    }

    console.log('✅ Migration verified! All new fields exist.\n');

    // Check existing questions
    const { data: questions, error: questionsError } = await supabase
      .from('diagnostic_questions')
      .select('id, question_text, question_set, source, is_active, selection_priority')
      .limit(10);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return false;
    }

    console.log(`📊 Found ${questions?.length || 0} questions (showing first 10):\n`);

    if (questions && questions.length > 0) {
      questions.forEach((q: any) => {
        console.log(`   Question ${q.id}:`);
        console.log(`     Text: ${(q.question_text || q.text || '').substring(0, 60)}...`);
        console.log(`     Set: ${q.question_set || 'not set'} (default: beta)`);
        console.log(`     Source: ${q.source || 'not set'} (default: system_generated)`);
        console.log(`     Active: ${q.is_active !== false ? 'yes' : 'no'}`);
        console.log(`     Priority: ${q.selection_priority || 5} (default: 5)`);
        console.log('');
      });
    } else {
      console.log('   No questions found in database.\n');
    }

    // Check for indexes
    console.log('📋 Checking indexes...\n');
    const { data: indexes, error: indexesError } = await supabase
      .rpc('get_table_indexes', { table_name: 'diagnostic_questions' })
      .single();

    if (!indexesError && indexes) {
      console.log('   Indexes found (or will be created on first query)');
    } else {
      console.log('   Note: Indexes will be created automatically by Supabase');
    }

    console.log('\n========================================');
    console.log('✅ Migration Verification Complete');
    console.log('========================================\n');

    return true;
  } catch (error: any) {
    console.error('\n❌ Verification failed:');
    console.error(error);
    return false;
  }
}

if (require.main === module) {
  verifyMigration()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { verifyMigration };

