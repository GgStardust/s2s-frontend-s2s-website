/**
 * Verify Order Index Constraint Fix
 * Tests that the order_index constraint allows high values
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function verifyConstraint() {
  console.log('========================================');
  console.log('Verifying Order Index Constraint Fix');
  console.log('========================================\n');

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test if order_index constraint is fixed by trying to insert a test question
    const testQuestion = {
      question_text: 'Test question for order_index constraint verification',
      response_type: 'scale',
      answer_options: ['1', '2', '3', '4', '5'],
      orb_weights: {},
      order_index: 999, // High value to test constraint
      question_set: 'beta',
      source: 'system_generated',
      is_active: true,
    };

    console.log('Testing insertion with order_index = 999...\n');

    const { data, error } = await supabase
      .from('diagnostic_questions')
      .insert(testQuestion)
      .select()
      .single();

    if (error) {
      console.log('❌ Constraint still blocking:');
      console.log(`   Error: ${error.message}\n`);
      console.log('⚠️  The order_index constraint may not have been fixed yet.');
      return false;
    }

    console.log('✅ Constraint fixed! Test question inserted successfully.');
    console.log(`   Question ID: ${data.id}`);
    console.log(`   Order Index: ${data.order_index}\n`);

    // Clean up test question
    console.log('Cleaning up test question...');
    const { error: deleteError } = await supabase
      .from('diagnostic_questions')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.log('⚠️  Warning: Could not delete test question:', deleteError.message);
    } else {
      console.log('✅ Test question cleaned up\n');
    }

    console.log('========================================');
    console.log('✅ Phase 2.5: Ready for diagnostic questions!');
    console.log('========================================\n');
    console.log('You can now load diagnostic questions with any order_index >= 1.\n');

    return true;
  } catch (error: any) {
    console.error('\n❌ Error:');
    console.error(error);
    return false;
  }
}

if (require.main === module) {
  verifyConstraint()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { verifyConstraint };

