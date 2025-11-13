/**
 * Import Orb Essays to Book Chapters
 *
 * Maps full Orb essay content to corresponding book chapters
 * PRESERVES EVERY WORD per content integrity rules
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapping of chapter numbers to their corresponding Orb essay files
const CHAPTER_TO_ORB_ESSAY_MAP = {
  1: '02d_Orb_Essays/orb_1_origin_intelligence.md', // Chapter 1: The Stardust Within
  2: '02d_Orb_Essays/orb_1_origin_intelligence.md', // Chapter 2: Body as Advanced Technology (uses Orb 1 + system arch)
  3: '02d_Orb_Essays/orb_1_origin_intelligence.md', // Chapter 3: 13-Orb Framework Overview (all orbs intro)
  4: '02d_Orb_Essays/orb_2_resonance_mechanics.md', // Chapter 4: Resonance as Intelligence
  5: '02d_Orb_Essays/orb_5_temporal_sovereignty_foundational.md', // Chapter 5: Temporal Sovereignty
  6: '02d_Orb_Essays/orb_6_starline_memory_foundational.md', // Chapter 6: Starline Memory
  7: '02d_Orb_Essays/orb_7_alchemical_current_foundational.md', // Chapter 7: The Alchemical Current
  8: '02d_Orb_Essays/orb_8_quantum_intuition_foundational.md', // Chapter 8: Quantum Perception
  9: '02d_Orb_Essays/orb_9_temporal_fluidity_foundational.md', // Chapter 9: Sovereign Will (temporal fluidity)
  10: '02d_Orb_Essays/orb_4_harmonic_architectures_foundational.md', // Chapter 10: Field Dynamics
  // Chapters 11-14 don't have corresponding essays yet - leave empty
};

async function importOrbEssays() {
  console.log('📚 Importing full Orb essay content to book chapters...\n');
  console.log('CONTENT INTEGRITY: Preserving EVERY word from source files\n');

  try {
    // Get non-fiction book
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')
      .eq('type', 'non_fiction');

    if (booksError || !books || books.length === 0) {
      console.error('Non-fiction book not found');
      return;
    }

    const nonFictionBook = books[0];

    // Get all chapters
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', nonFictionBook.id)
      .order('chapter_number', { ascending: true });

    if (chaptersError || !chapters) {
      console.error('Chapters not found:', chaptersError);
      return;
    }

    let importedCount = 0;

    // Import each chapter's content
    for (const chapter of chapters) {
      const essayPath = CHAPTER_TO_ORB_ESSAY_MAP[chapter.chapter_number as keyof typeof CHAPTER_TO_ORB_ESSAY_MAP];

      if (!essayPath) {
        console.log(`⏭️  Chapter ${chapter.chapter_number}: ${chapter.title} - No essay mapped yet`);
        continue;
      }

      const fullPath = path.join(process.cwd(), '09_PROCESSED', essayPath);

      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Chapter ${chapter.chapter_number}: File not found - ${essayPath}`);
        continue;
      }

      // Read FULL content - preserve EVERY word
      const fullContent = fs.readFileSync(fullPath, 'utf-8');
      const wordCount = fullContent.split(/\s+/).length;

      // Update chapter with FULL content
      const { error } = await supabase
        .from('chapters')
        .update({
          content: fullContent,
          word_count: wordCount,
          status: 'draft',
        })
        .eq('id', chapter.id);

      if (error) {
        console.error(`❌ Error updating chapter ${chapter.chapter_number}:`, error);
      } else {
        console.log(`✅ Chapter ${chapter.chapter_number}: ${chapter.title} - ${wordCount.toLocaleString()} words imported`);
        importedCount++;
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`📊 Imported ${importedCount} chapters with FULL content`);
    console.log(`📝 ${chapters.length - importedCount} chapters awaiting content`);

  } catch (err) {
    console.error('❌ Import failed:', err);
  }
}

importOrbEssays();
