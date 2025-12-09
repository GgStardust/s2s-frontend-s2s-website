/**
 * Load Inquiry Questions (Phase 8)
 * 
 * Loads the 53 early reader inquiry questions into the inquiry_questions table.
 * These are questions users ask, not diagnostic questions.
 * 
 * Usage: npx tsx scripts/load-inquiry-questions.ts
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

interface InquiryQuestion {
  question_text: string;
  question_description?: string;
  category?: string;
  section?: string;
  inquiry_context?: string;
  tags?: string[];
  orb_associations?: number[];
  undercurrent_associations?: number[];
  practice_associations?: number[];
  source?: string;
  priority?: number;
}

interface QuestionsFile {
  questions: InquiryQuestion[];
}

async function loadInquiryQuestions(questionsFile: string) {
  console.log('========================================');
  console.log('Phase 8: Loading Inquiry Questions');
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

    console.log(`📊 Found ${data.questions.length} inquiry questions to load\n`);

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

      // Prepare question data
      const questionData: any = {
        question_text: q.question_text,
        question_description: q.question_description,
        category: q.category,
        section: q.section,
        inquiry_context: q.inquiry_context,
        tags: q.tags || [],
        orb_associations: q.orb_associations || [],
        undercurrent_associations: q.undercurrent_associations || [],
        practice_associations: q.practice_associations || [],
        source: q.source || 'early_reader_feedback',
        priority: q.priority || 5,
        is_active: true,
      };

      // Insert question
      const { data: question, error } = await supabase
        .from('inquiry_questions')
        .insert(questionData)
        .select()
        .single();

      if (error) {
        errors.push(`Question ${i + 1}: ${error.message}`);
        console.log(`   ❌ Error: ${error.message}\n`);
        continue;
      }

      loadedQuestions.push(question);
      console.log(`   ✅ Loaded as inquiry question ID: ${question.id}\n`);
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
      console.log('\n✅ Loaded Questions by Category:');
      const byCategory: Record<string, number> = {};
      loadedQuestions.forEach(q => {
        const cat = q.category || 'uncategorized';
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      });
      Object.entries(byCategory).forEach(([cat, count]) => {
        console.log(`   - ${cat}: ${count} questions`);
      });
    }

    console.log('\n========================================');
    console.log(loadedQuestions.length > 0 ? '✅ Inquiry questions loaded successfully!' : '❌ No questions were loaded');
    console.log('========================================\n');

    return loadedQuestions.length > 0;
  } catch (error: any) {
    console.error('\n❌ Fatal error:');
    console.error(error);
    
    if (error.code === 'ENOENT') {
      console.error(`\n⚠️  File not found: ${questionsFile}`);
    } else if (error instanceof SyntaxError) {
      console.error(`\n⚠️  Invalid JSON format in file: ${questionsFile}`);
    } else if (error.message?.includes('relation "inquiry_questions" does not exist')) {
      console.error(`\n⚠️  inquiry_questions table does not exist.`);
      console.error(`   Please run the Phase 8 migration first:`);
      console.error(`   CMS_Backend/supabase/migrations/20250126_phase_8_inquiry_system.sql`);
    }
    
    return false;
  }
}

// Main execution
if (require.main === module) {
  const questionsFile = process.argv[2] || 'data/inquiry-questions-53.json';

  loadInquiryQuestions(questionsFile)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { loadInquiryQuestions };

