/**
 * Load Diagnostic Questions
 * 
 * Loads diagnostic questions into the diagnostic_questions table.
 * These are questions WE ask THEM (with answer options).
 * 
 * Usage: npx tsx scripts/load-diagnostic-questions.ts [questions-file.json]
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

interface DiagnosticQuestion {
  question_text: string;
  question_description?: string;
  response_type: 'single_choice' | 'multi_choice' | 'scale';
  answer_options: string[];
  orb_weights: Record<string, number>;
  undercurrent_weights?: Record<string, number>;
  practice_weights?: Record<string, number>;
  order_index: number;
  question_set?: string;
  source?: string;
  is_active?: boolean;
  tags?: string[];
  inquiry_context?: string;
  triggers?: Record<string, any>;
  follow_up_question_ids?: number[];
  selection_priority?: number;
  layer_focus?: string;
}

interface QuestionsFile {
  questions: DiagnosticQuestion[];
}

async function loadDiagnosticQuestions(questionsFile: string) {
  console.log('========================================');
  console.log('Loading Diagnostic Questions');
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

    console.log(`📊 Found ${data.questions.length} diagnostic questions to load\n`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
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

      if (!q.answer_options || !Array.isArray(q.answer_options) || q.answer_options.length === 0) {
        errors.push(`Question ${i + 1}: Missing or empty answer_options`);
        console.log(`   ❌ Skipped: Missing answer_options\n`);
        continue;
      }

      if (!q.orb_weights || Object.keys(q.orb_weights).length === 0) {
        errors.push(`Question ${i + 1}: Missing orb_weights`);
        console.log(`   ❌ Skipped: Missing orb_weights\n`);
        continue;
      }

      if (q.order_index === undefined || q.order_index === null) {
        errors.push(`Question ${i + 1}: Missing order_index`);
        console.log(`   ❌ Skipped: Missing order_index\n`);
        continue;
      }

      // Check if question already exists (by question_text and order_index)
      const { data: existing } = await supabase
        .from('diagnostic_questions')
        .select('id')
        .eq('question_text', q.question_text)
        .single();

      if (existing) {
        console.log(`   ⚠️  Question already exists (ID: ${existing.id}), skipping...\n`);
        continue;
      }

      // Prepare question data
      const questionData: any = {
        question_text: q.question_text,
        question_description: q.question_description,
        response_type: q.response_type,
        answer_options: q.answer_options,
        orb_weights: q.orb_weights,
        order_index: q.order_index,
        question_set: q.question_set || 'beta',
        source: q.source || 'system_generated',
        is_active: q.is_active !== undefined ? q.is_active : true,
      };

      // Add optional fields (only if columns exist in schema)
      // Note: undercurrent_weights and practice_weights columns may not exist
      // Skip them to avoid schema errors
      // if (q.undercurrent_weights && Object.keys(q.undercurrent_weights).length > 0) {
      //   questionData.undercurrent_weights = q.undercurrent_weights;
      // }
      // if (q.practice_weights && Object.keys(q.practice_weights).length > 0) {
      //   questionData.practice_weights = q.practice_weights;
      // }
      if (q.tags && q.tags.length > 0) {
        questionData.tags = q.tags;
      }
      if (q.inquiry_context) {
        questionData.inquiry_context = q.inquiry_context;
      }
      if (q.triggers && Object.keys(q.triggers).length > 0) {
        questionData.triggers = q.triggers;
      }
      if (q.follow_up_question_ids && q.follow_up_question_ids.length > 0) {
        questionData.follow_up_question_ids = q.follow_up_question_ids;
      }
      if (q.selection_priority !== undefined) {
        questionData.selection_priority = q.selection_priority;
      }
      if (q.layer_focus) {
        questionData.layer_focus = q.layer_focus;
      }

      // Insert question
      const { data: question, error } = await supabase
        .from('diagnostic_questions')
        .insert(questionData)
        .select()
        .single();

      if (error) {
        errors.push(`Question ${i + 1}: ${error.message}`);
        console.log(`   ❌ Error: ${error.message}\n`);
        continue;
      }

      loadedQuestions.push(question);
      console.log(`   ✅ Loaded as diagnostic question ID: ${question.id} (order_index: ${question.order_index})\n`);
    }

    // Summary
    console.log('========================================');
    console.log('📊 Load Summary:');
    console.log('========================================');
    console.log(`✅ Successfully loaded: ${loadedQuestions.length} questions`);
    console.log(`❌ Errors: ${errors.length} questions`);
    console.log(`⏭️  Skipped (duplicates): ${data.questions.length - loadedQuestions.length - errors.length} questions`);
    
    if (errors.length > 0) {
      console.log('\n⚠️  Errors:');
      errors.forEach(err => console.log(`   - ${err}`));
    }

    if (loadedQuestions.length > 0) {
      console.log('\n✅ Loaded Questions:');
      loadedQuestions.forEach(q => {
        console.log(`   - ID ${q.id}: "${q.question_text.substring(0, 50)}..." (order_index: ${q.order_index})`);
      });
    }

    console.log('\n========================================');
    console.log(loadedQuestions.length > 0 ? '✅ Diagnostic questions loaded successfully!' : '❌ No questions were loaded');
    console.log('========================================\n');

    return loadedQuestions.length > 0;
  } catch (error: any) {
    console.error('\n❌ Fatal error:');
    console.error(error);
    
    if (error.code === 'ENOENT') {
      console.error(`\n⚠️  File not found: ${questionsFile}`);
    } else if (error instanceof SyntaxError) {
      console.error(`\n⚠️  Invalid JSON format in file: ${questionsFile}`);
    } else if (error.message?.includes('relation "diagnostic_questions" does not exist')) {
      console.error(`\n⚠️  diagnostic_questions table does not exist.`);
      console.error(`   Please ensure the Console V3 migration has been run.`);
    }
    
    return false;
  }
}

// Main execution
if (require.main === module) {
  const questionsFile = process.argv[2] || 'data/diagnostic-questions-new.json';

  loadDiagnosticQuestions(questionsFile)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { loadDiagnosticQuestions };

