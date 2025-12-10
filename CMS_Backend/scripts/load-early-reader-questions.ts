/**
 * Load Early Reader Questions
 * Phase 2.5: Question Management System
 * 
 * This script helps load questions from early book readers into the database.
 * 
 * USAGE:
 * 1. Prepare a JSON file with early reader questions (see example format below)
 * 2. Run: npx tsx scripts/load-early-reader-questions.ts <questions-file.json>
 * 
 * EXAMPLE QUESTION FORMAT:
 * {
 *   "questions": [
 *     {
 *       "question_text": "What question did you have while reading?",
 *       "question_description": "Optional description",
 *       "response_type": "single_choice",
 *       "answer_options": ["Option 1", "Option 2", "Option 3"],
 *       "orb_weights": {"orb_1": 0.3, "orb_2": 0.2},
 *       "undercurrent_weights": {"uc_1": 0.4},
 *       "practice_weights": {"practice_1": 0.5},
 *       "tags": ["early_reader", "inquiry"],
 *       "inquiry_context": "user_asks_about_timing",
 *       "selection_priority": 7
 *     }
 *   ]
 * }
 * 
 * NOTE: This script requires questions to be provided in a JSON file.
 * Contact the user to provide early reader questions.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface EarlyReaderQuestion {
  question_text: string;
  question_description?: string;
  response_type: 'single_choice' | 'multi_choice' | 'scale';
  answer_options?: string[];
  orb_weights?: Record<string, number>;
  undercurrent_weights?: Record<string, number>;
  practice_weights?: Record<string, number>;
  tags?: string[];
  inquiry_context?: string;
  triggers?: Record<string, any>;
  follow_up_question_ids?: number[];
  selection_priority?: number;
}

interface QuestionsFile {
  questions: EarlyReaderQuestion[];
}

async function loadQuestions(questionsFile: string) {
  console.log('========================================');
  console.log('Phase 2.5: Loading Early Reader Questions');
  console.log('========================================\n');

  try {
    // Read questions file
    console.log(`📖 Reading questions from: ${questionsFile}\n`);
    const fileContent = readFileSync(questionsFile, 'utf-8');
    const data: QuestionsFile = JSON.parse(fileContent);

    if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
      console.error('❌ No questions found in file. Expected format: {"questions": [...]}');
      return false;
    }

    console.log(`📊 Found ${data.questions.length} questions to load\n`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // The order_index constraint is causing issues
    // Let's try using sequential values starting from a safe range
    // Existing questions use 1-5, so we'll start early_reader at 1000 to be safe
    // If that fails, we may need to run the migration to fix the constraint
    let currentOrderIndex = 1000;
    
    const loadedQuestions: any[] = [];
    const errors: string[] = [];

    // Load each question
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      console.log(`[${i + 1}/${data.questions.length}] Loading: ${q.question_text.substring(0, 60)}...`);

      // Validate required fields
      if (!q.question_text) {
        errors.push(`Question ${i + 1}: Missing question_text`);
        console.log(`   ❌ Skipped: Missing question_text\n`);
        continue;
      }

      if (!q.response_type || !['single_choice', 'multi_choice', 'scale'].includes(q.response_type)) {
        errors.push(`Question ${i + 1}: Invalid or missing response_type`);
        console.log(`   ❌ Skipped: Invalid response_type\n`);
        continue;
      }

      // Prepare question data - only include fields that exist in the schema
      // orb_weights is required (NOT NULL), so always include it
      const questionData: any = {
        question_text: q.question_text,
        response_type: q.response_type,
        answer_options: q.answer_options || [],
        orb_weights: q.orb_weights || {}, // Required field - always include
        order_index: currentOrderIndex++,
        // Phase 2.5 metadata - verified to exist
        question_set: q.question_set || 'early_reader',
        source: q.source || 'early_reader_feedback',
        selection_priority: q.selection_priority || 6,
        is_active: true,
      };
      
      // Conditionally add optional fields
      if (q.question_description) questionData.question_description = q.question_description;
      if (q.inquiry_context) questionData.inquiry_context = q.inquiry_context;
      if (q.triggers && Object.keys(q.triggers).length > 0) questionData.triggers = q.triggers;
      if (q.follow_up_question_ids && q.follow_up_question_ids.length > 0) {
        questionData.follow_up_question_ids = q.follow_up_question_ids;
      }

      // Use the API endpoint which handles order_index constraints better
      // The API sets order_index to 0 by default if not provided
      const apiUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      let question;
      let error;
      
      try {
        // Remove order_index and let API handle it
        delete questionData.order_index;
        
        const response = await fetch(`${apiUrl}/api/console/v3/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(questionData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          error = { message: errorData.error || `HTTP ${response.status}: Failed to create question` };
        } else {
          const result = await response.json();
          question = result.question;
        }
      } catch (fetchError: any) {
        // If API is not available, try direct insert with order_index = 0
        questionData.order_index = 0;
        const result = await supabase
          .from('diagnostic_questions')
          .insert(questionData)
          .select()
          .single();
        question = result.data;
        error = result.error;
      }

      if (error) {
        errors.push(`Question ${i + 1}: ${error.message}`);
        console.log(`   ❌ Error: ${error.message}\n`);
        continue;
      }

      loadedQuestions.push(question);
      console.log(`   ✅ Loaded as question ID: ${question.id}\n`);
    }

    // Summary
    console.log('========================================');
    console.log('📊 Load Summary:');
    console.log('========================================');
    console.log(`✅ Successfully loaded: ${loadedQuestions.length} questions`);
    console.log(`❌ Errors: ${errors.length} questions`);
    
    if (errors.length > 0) {
      console.log('\n⚠️  Errors:');
      errors.forEach(err => console.log(`   - ${err}`));
    }

    if (loadedQuestions.length > 0) {
      console.log('\n✅ Loaded Questions:');
      loadedQuestions.forEach(q => {
        console.log(`   - ID ${q.id}: ${q.question_text.substring(0, 60)}...`);
      });
    }

    console.log('\n========================================');
    console.log(loadedQuestions.length > 0 ? '✅ Questions loaded successfully!' : '❌ No questions were loaded');
    console.log('========================================\n');

    return loadedQuestions.length > 0;
  } catch (error: any) {
    console.error('\n❌ Fatal error:');
    console.error(error);
    
    if (error.code === 'ENOENT') {
      console.error(`\n⚠️  File not found: ${questionsFile}`);
      console.error('   Please provide a valid JSON file with questions.');
      console.error('   See script comments for example format.');
    } else if (error instanceof SyntaxError) {
      console.error(`\n⚠️  Invalid JSON format in file: ${questionsFile}`);
      console.error('   Please check the JSON syntax.');
    }
    
    return false;
  }
}

// Main execution
if (require.main === module) {
  const questionsFile = process.argv[2];

  if (!questionsFile) {
    console.error('========================================');
    console.error('❌ Error: Questions file required');
    console.error('========================================\n');
    console.error('Usage: npx tsx scripts/load-early-reader-questions.ts <questions-file.json>\n');
    console.error('Example format:');
    console.error(JSON.stringify({
      questions: [
        {
          question_text: "What question did you have while reading?",
          response_type: "single_choice",
          answer_options: ["Option 1", "Option 2"],
          orb_weights: {"orb_1": 0.3},
          question_set: "early_reader",
          source: "early_reader_feedback"
        }
      ]
    }, null, 2));
    console.error('\n⚠️  Please provide a JSON file with early reader questions.\n');
    process.exit(1);
  }

  loadQuestions(questionsFile)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { loadQuestions };

