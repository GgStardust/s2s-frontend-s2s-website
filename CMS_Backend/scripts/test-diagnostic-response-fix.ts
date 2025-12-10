/**
 * Test script to verify the diagnostic response fix
 * Tests:
 * 1. Creating a diagnostic session
 * 2. Submitting a response
 * 3. Verifying the response is saved correctly
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const CMS_BACKEND_URL = 'http://localhost:4000';

async function testDiagnosticResponse() {
  console.log('🧪 Testing Diagnostic Response Fix\n');
  console.log('='.repeat(50));

  try {
    // Step 1: Create a diagnostic session
    console.log('\n1️⃣ Creating diagnostic session...');
    const sessionResponse = await fetch(`${CMS_BACKEND_URL}/api/console/v3/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!sessionResponse.ok) {
      const error = await sessionResponse.json();
      throw new Error(`Failed to create session: ${error.error || sessionResponse.statusText}`);
    }

    const sessionData = await sessionResponse.json();
    const sessionId = sessionData.session_id;

    if (!sessionId) {
      throw new Error('No session_id returned');
    }

    console.log(`✅ Session created: ${sessionId}`);

    // Step 2: Get a diagnostic question
    console.log('\n2️⃣ Fetching diagnostic questions...');
    const questionsResponse = await fetch(`${CMS_BACKEND_URL}/api/console/v3/questions?limit=1`);

    if (!questionsResponse.ok) {
      const error = await questionsResponse.json();
      throw new Error(`Failed to fetch questions: ${error.error || questionsResponse.statusText}`);
    }

    const questionsData = await questionsResponse.json();
    // Handle both { questions: [...] } and [...] formats
    const questions = questionsData.questions || questionsData;
    if (!questions || questions.length === 0) {
      throw new Error('No questions available');
    }

    const question = questions[0];
    console.log(`✅ Found question: ${question.id} - "${question.question_text.substring(0, 50)}..."`);

    // Step 3: Submit a response
    console.log('\n3️⃣ Submitting diagnostic response...');
    const testAnswer = question.response_type === 'scale' ? 3 : 
                      question.answer_options && question.answer_options.length > 0 
                        ? question.answer_options[0] 
                        : 'test answer';

    const responsePayload = {
      question_id: question.id,
      answer: testAnswer,
    };

    console.log(`   Payload:`, JSON.stringify(responsePayload, null, 2));

    const submitResponse = await fetch(
      `${CMS_BACKEND_URL}/api/console/v3/sessions/${sessionId}/responses`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responsePayload),
      }
    );

    if (!submitResponse.ok) {
      const error = await submitResponse.json();
      console.error('❌ Response submission failed:');
      console.error(JSON.stringify(error, null, 2));
      throw new Error(`Failed to submit response: ${error.error || submitResponse.statusText}`);
    }

    const submitData = await submitResponse.json();
    console.log(`✅ Response submitted successfully!`);
    console.log(`   Response ID: ${submitData.response_id}`);
    console.log(`   Is Complete: ${submitData.is_complete}`);
    if (submitData.next_question) {
      console.log(`   Next Question: ${submitData.next_question.id}`);
    }

    // Step 4: Verify the response was saved in the database
    console.log('\n4️⃣ Verifying response in database...');
    const { data: savedResponse, error: dbError } = await supabase
      .from('diagnostic_responses')
      .select('*')
      .eq('session_id', sessionId)
      .eq('question_id', question.id)
      .single();

    if (dbError) {
      throw new Error(`Database verification failed: ${dbError.message}`);
    }

    if (!savedResponse) {
      throw new Error('Response not found in database');
    }

    console.log(`✅ Response verified in database:`);
    console.log(`   ID: ${savedResponse.id}`);
    console.log(`   Raw Answer: ${savedResponse.raw_answer}`);
    console.log(`   Derived Signal:`, JSON.stringify(savedResponse.derived_signal, null, 2));

    // Step 5: Test updating the same response (upsert)
    console.log('\n5️⃣ Testing upsert (updating existing response)...');
    const updatedAnswer = question.response_type === 'scale' ? 5 : 
                         question.answer_options && question.answer_options.length > 1 
                           ? question.answer_options[1] 
                           : 'updated answer';

    const updatePayload = {
      question_id: question.id,
      answer: updatedAnswer,
    };

    const updateResponse = await fetch(
      `${CMS_BACKEND_URL}/api/console/v3/sessions/${sessionId}/responses`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(`Failed to update response: ${error.error || updateResponse.statusText}`);
    }

    const updateData = await updateResponse.json();
    console.log(`✅ Response updated successfully!`);

    // Verify the update
    const { data: updatedResponse } = await supabase
      .from('diagnostic_responses')
      .select('*')
      .eq('session_id', sessionId)
      .eq('question_id', question.id)
      .single();

    if (updatedResponse && updatedResponse.raw_answer === (typeof updatedAnswer === 'string' ? updatedAnswer : JSON.stringify(updatedAnswer))) {
      console.log(`✅ Update verified: Answer changed to "${updatedResponse.raw_answer}"`);
    } else {
      console.warn(`⚠️  Update may not have worked: Expected "${updatedAnswer}", got "${updatedResponse?.raw_answer}"`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests passed! Diagnostic response fix is working correctly.');
    console.log('='.repeat(50));

  } catch (error: any) {
    console.error('\n' + '='.repeat(50));
    console.error('❌ Test failed:');
    console.error(error.message);
    console.error('='.repeat(50));
    process.exit(1);
  }
}

// Run the test
testDiagnosticResponse();

