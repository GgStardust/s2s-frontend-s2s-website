/**
 * Import Book Chapters Script
 *
 * Imports chapter outlines from files into the database
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Fiction book chapters from chapter_outline.md
const FICTION_CHAPTERS = [
  // Part I: Field Activation
  { number: 1, title: 'The Arrival', part: 1, part_title: 'Field Activation', notes: 'Setting: First arrival in Sausalito. Orbs: Orb 1 (Origin Intelligence)' },
  { number: 2, title: 'The Apartment', part: 1, part_title: 'Field Activation', notes: 'Setting: New apartment, first night. Orbs: Orb 6 (Starline Memory)' },
  { number: 3, title: 'The Boardwalk Transmission', part: 1, part_title: 'Field Activation', notes: 'Setting: Boardwalk at midnight. Orbs: Orb 2, 4. Status: Completed' },

  // Part II: Field Exploration
  { number: 4, title: 'The Hurricane Gulch Walk', part: 2, part_title: 'Field Exploration', notes: 'Setting: Microclimate zone. Orbs: Orb 4 (Harmonic Architectures)' },
  { number: 5, title: 'The Houseboat Community', part: 2, part_title: 'Field Exploration', notes: 'Setting: Houseboat culture. Orbs: Orb 8 (Community Resonance)' },
  { number: 6, title: 'The Café Conversations', part: 2, part_title: 'Field Exploration', notes: 'Setting: Local cafés. Orbs: Orb 3 (Photonic Intelligence)' },
  { number: 7, title: 'The Dive Bar Alchemy', part: 2, part_title: 'Field Exploration', notes: 'Setting: No Name bar. Orbs: Orb 7, 13. Status: Completed' },

  // Part III: Field Integration
  { number: 8, title: 'The Maya Transmission', part: 3, part_title: 'Field Integration', notes: 'Setting: Maya\'s houseboat. Orbs: All 13 Orbs explained' },
  { number: 9, title: 'The Group Text Constellation', part: 3, part_title: 'Field Integration', notes: 'Setting: Darts league text chain. Orbs: Orb 11 (Radiant Transparency)' },
  { number: 10, title: 'The Wildlife Communion', part: 3, part_title: 'Field Integration', notes: 'Setting: Wildlife encounters. Orbs: Orb 13 (Bridging Intelligence)' },

  // Part IV: Field Mastery
  { number: 11, title: 'The Ritual Practice', part: 4, part_title: 'Field Mastery', notes: 'Setting: Moon cycle rituals. Orbs: Orb 5 (Temporal Sovereignty)' },
  { number: 12, title: 'The Community Activation', part: 4, part_title: 'Field Mastery', notes: 'Setting: Community gatherings. Orbs: Orb 8 (Community Resonance)' },
  { number: 13, title: 'The Field Transmission', part: 4, part_title: 'Field Mastery', notes: 'Setting: Protagonist\'s field activation. Orbs: Orb 12 (Sovereign Field)' },

  // Part V: Field Expansion
  { number: 14, title: 'The Future Primitive', part: 5, part_title: 'Field Expansion', notes: 'Setting: Sausalito as consciousness evolution model. Orbs: All 13 Orbs' },
  { number: 15, title: 'The Living Codex', part: 5, part_title: 'Field Expansion', notes: 'Setting: Integration of all experiences. Orbs: Full 13-Orb integration' },
];

// Non-fiction book chapters (14 chapters from BOOK_COMPILER_IMPLEMENTATION_PLAN.md)
const NON_FICTION_CHAPTERS = [
  // Part 1: The Cosmic Tapestry
  { number: 1, title: 'The Stardust Within', part: 1, part_title: 'The Cosmic Tapestry', notes: 'Origin intelligence, human form, mitochondrial intelligence' },
  { number: 2, title: 'Body as Advanced Technology', part: 1, part_title: 'The Cosmic Tapestry', notes: 'Existential architecture, consciousness technology applications' },
  { number: 3, title: 'The 13-Orb Framework', part: 1, part_title: 'The Cosmic Tapestry', notes: 'Introduction to all 13 Orbs, system overview' },
  { number: 4, title: 'Resonance as Intelligence', part: 1, part_title: 'The Cosmic Tapestry', notes: 'Orb 2 - Resonance Mechanics, frequency and vibration' },

  // Part 2: The Foundations of Sovereignty
  { number: 5, title: 'Temporal Sovereignty', part: 2, part_title: 'The Foundations of Sovereignty', notes: 'Orb 5 - Time mastery, cyclical understanding' },
  { number: 6, title: 'Starline Memory', part: 2, part_title: 'The Foundations of Sovereignty', notes: 'Orb 6 - Ancestral and cosmic memory' },
  { number: 7, title: 'The Alchemical Current', part: 2, part_title: 'The Foundations of Sovereignty', notes: 'Orb 7 - Transformation and alchemy' },

  // Part 3: Applied Consciousness
  { number: 8, title: 'Quantum Perception', part: 3, part_title: 'Applied Consciousness', notes: 'Orb 8 - Intuition and perception' },
  { number: 9, title: 'Sovereign Will', part: 3, part_title: 'Applied Consciousness', notes: 'Orb 9 - Agency and choice' },
  { number: 10, title: 'Field Dynamics', part: 3, part_title: 'Applied Consciousness', notes: 'Orb 10 - Working with energy fields' },

  // Part 4: Integration and Mastery
  { number: 11, title: 'Galactic Integration', part: 4, part_title: 'Integration and Mastery', notes: 'Orb 11 - Universal consciousness' },
  { number: 12, title: 'Ascension Mechanics', part: 4, part_title: 'Integration and Mastery', notes: 'Orb 12 - Evolution and ascension' },
  { number: 13, title: 'Bridging Intelligence', part: 4, part_title: 'Integration and Mastery', notes: 'Orb 13 - Connection and bridging' },
  { number: 14, title: 'Living Sovereignty', part: 4, part_title: 'Integration and Mastery', notes: 'Integration of all Orbs, living the system' },
];

async function importChapters() {
  console.log('📚 Importing book chapters...\n');

  try {
    // Get books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*');

    if (booksError) {
      console.error('Error fetching books:', booksError);
      return;
    }

    const nonFictionBook = books?.find(b => b.type === 'non_fiction');
    const fictionBook = books?.find(b => b.type === 'fiction');

    if (!nonFictionBook || !fictionBook) {
      console.error('Books not found in database');
      return;
    }

    // Import non-fiction chapters
    console.log(`📖 Importing ${NON_FICTION_CHAPTERS.length} non-fiction chapters...`);
    for (const chapter of NON_FICTION_CHAPTERS) {
      const { error } = await supabase
        .from('chapters')
        .insert({
          book_id: nonFictionBook.id,
          chapter_number: chapter.number,
          title: chapter.title,
          part_number: chapter.part,
          part_title: chapter.part_title,
          status: 'outline',
          notes: chapter.notes,
          content: null,
          word_count: 0,
        });

      if (error) {
        console.log(`⚠️  Chapter ${chapter.number} may already exist:`, error.message);
      } else {
        console.log(`✅ Imported: Chapter ${chapter.number} - ${chapter.title}`);
      }
    }

    // Import fiction chapters
    console.log(`\n📖 Importing ${FICTION_CHAPTERS.length} fiction chapters...`);
    for (const chapter of FICTION_CHAPTERS) {
      const { error } = await supabase
        .from('chapters')
        .insert({
          book_id: fictionBook.id,
          chapter_number: chapter.number,
          title: chapter.title,
          part_number: chapter.part,
          part_title: chapter.part_title,
          status: chapter.notes.includes('Completed') ? 'complete' : 'outline',
          notes: chapter.notes,
          content: null,
          word_count: 0,
        });

      if (error) {
        console.log(`⚠️  Chapter ${chapter.number} may already exist:`, error.message);
      } else {
        console.log(`✅ Imported: Chapter ${chapter.number} - ${chapter.title}`);
      }
    }

    console.log('\n✅ Chapter import complete!');
    console.log(`\nNon-Fiction: ${NON_FICTION_CHAPTERS.length} chapters`);
    console.log(`Fiction: ${FICTION_CHAPTERS.length} chapters`);

  } catch (err) {
    console.error('❌ Import failed:', err);
  }
}

importChapters();
