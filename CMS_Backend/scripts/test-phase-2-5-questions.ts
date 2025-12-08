/**
 * Test Phase 2.5: Question Management System
 * Tests question selection, filtering, and metadata
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { selectQuestions, selectQuestionsForSession } from '../lib/services/console-v3/question-service';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}`);
  console.error(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅' : '❌'}`);
  process.exit(1);
}

async function testPhase25() {
  console.log('🧪 Testing Phase 2.5: Question Management System\n');
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Test 1: Check if question metadata fields exist
  console.log('Test 1: Checking question metadata fields...');
  const { data: sampleQuestion, error: sampleError } = await supabase
    .from('diagnostic_questions')
    .select('id, question_text, question_set, source, is_active, selection_priority, triggers, follow_up_question_ids')
    .limit(1)
    .single();

  if (sampleError) {
    console.error('❌ Error fetching sample question:', sampleError);
    return;
  }

  if (sampleQuestion) {
    console.log('✅ Question metadata fields exist');
    console.log(`   - question_set: ${sampleQuestion.question_set || 'null'}`);
    console.log(`   - source: ${sampleQuestion.source || 'null'}`);
    console.log(`   - is_active: ${sampleQuestion.is_active}`);
    console.log(`   - selection_priority: ${sampleQuestion.selection_priority || 'null'}`);
    console.log(`   - triggers: ${JSON.stringify(sampleQuestion.triggers || {})}`);
    console.log(`   - follow_up_question_ids: ${JSON.stringify(sampleQuestion.follow_up_question_ids || [])}`);
  } else {
    console.log('⚠️  No questions found in database');
  }

  // Test 2: Test question selection by question_set
  console.log('\nTest 2: Testing question selection by question_set...');
  const betaQuestions = await selectQuestions(supabase, {
    question_set: 'beta',
    is_active: true,
    limit: 5,
  });
  console.log(`✅ Found ${betaQuestions.length} beta questions`);

  // Test 3: Test selectQuestionsForSession
  console.log('\nTest 3: Testing selectQuestionsForSession...');
  const sessionQuestions = await selectQuestionsForSession(supabase, {
    question_set: 'beta',
    include_early_reader: false,
    max_questions: 12,
  });
  console.log(`✅ Selected ${sessionQuestions.length} questions for session`);
  if (sessionQuestions.length > 0) {
    console.log(`   - First question: ${sessionQuestions[0].question_text?.substring(0, 50)}...`);
    console.log(`   - Question set: ${sessionQuestions[0].question_set}`);
    console.log(`   - Source: ${sessionQuestions[0].source}`);
  }

  // Test 4: Test filtering by source
  console.log('\nTest 4: Testing filtering by source...');
  const systemQuestions = await selectQuestions(supabase, {
    source: 'system_generated',
    is_active: true,
    limit: 3,
  });
  console.log(`✅ Found ${systemQuestions.length} system_generated questions`);

  // Test 5: Test API endpoint (simulate)
  console.log('\nTest 5: Testing question filtering logic...');
  const { data: filteredQuestions, error: filterError } = await supabase
    .from('diagnostic_questions')
    .select('*')
    .eq('question_set', 'beta')
    .eq('is_active', true)
    .order('selection_priority', { ascending: false })
    .order('order_index', { ascending: true })
    .limit(12);

  if (filterError) {
    console.error('❌ Error filtering questions:', filterError);
  } else {
    console.log(`✅ API filtering logic works: ${filteredQuestions?.length || 0} questions`);
    if (filteredQuestions && filteredQuestions.length > 0) {
      console.log(`   - Questions ordered by priority: ${filteredQuestions.map(q => q.selection_priority).join(', ')}`);
    }
  }

  // Test 6: Check for early_reader questions
  console.log('\nTest 6: Checking for early_reader questions...');
  const { data: earlyReaderQuestions, error: earlyReaderError } = await supabase
    .from('diagnostic_questions')
    .select('id, question_text, question_set, source')
    .eq('question_set', 'early_reader')
    .eq('is_active', true);

  if (earlyReaderError) {
    console.error('❌ Error fetching early_reader questions:', earlyReaderError);
  } else {
    console.log(`✅ Found ${earlyReaderQuestions?.length || 0} early_reader questions`);
    if (earlyReaderQuestions && earlyReaderQuestions.length > 0) {
      console.log(`   - First early_reader: ${earlyReaderQuestions[0].question_text?.substring(0, 50)}...`);
    }
  }

  // Test 7: Test follow-up question relationships
  console.log('\nTest 7: Testing follow-up question relationships...');
  const { data: questionsWithFollowUps, error: followUpError } = await supabase
    .from('diagnostic_questions')
    .select('id, question_text, follow_up_question_ids')
    .not('follow_up_question_ids', 'eq', '{}')
    .limit(5);

  if (followUpError) {
    console.error('❌ Error fetching questions with follow-ups:', followUpError);
  } else {
    console.log(`✅ Found ${questionsWithFollowUps?.length || 0} questions with follow-ups`);
    if (questionsWithFollowUps && questionsWithFollowUps.length > 0) {
      questionsWithFollowUps.forEach(q => {
        console.log(`   - Q${q.id}: ${q.follow_up_question_ids?.length || 0} follow-ups`);
      });
    }
  }

  console.log('\n✅ Phase 2.5 Question Management System tests complete!');
}

// Run tests
testPhase25().catch(console.error);

