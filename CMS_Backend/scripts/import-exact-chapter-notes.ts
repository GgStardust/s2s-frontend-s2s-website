/**
 * Import EXACT Chapter Notes
 *
 * Preserves EVERY word from s2s_book_outline_pitch_material_reader facing.md
 * NO abbreviations, NO summaries - COMPLETE content integrity
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// EXACT chapter notes from s2s_book_outline_pitch_material_reader facing.md
// PRESERVING EVERY WORD - NO CHANGES
const EXACT_CHAPTER_NOTES = {
  1: `- Introduction to the "Stardust to Sovereignty" premise
- We are made of stardust, animated by bioelectric forces
- The concept of being an integral part of the cosmos
- "To feast on the galaxy is to absorb the vibrations of stars"`,

  2: `- Exploring the human body as a sophisticated instrument
- "Somatic Codex": Organs as interdimensional interfaces
  - Lungs as breath-bridges
  - Liver as timeline filter
  - Bones as crystalline storage
- Mitochondrial energy regulation and its role`,

  3: `- The body's capacity to digest emotions, filter timelines, and transmute density
- The "gut, liver, and system-wide digestion of signal"
- The connection between inner processing and outer reality`,

  4: `- Introduction to resonance mechanics and vibrational intelligence
- How we exist as both matter and waveform
- The electromagnetic symphony that connects all things
- Galactic intelligence and rhythmic cycles (charge-release patterns)`,

  5: `- Sovereignty as active engagement with the universal field of consciousness
- Not isolation, but deep interconnectedness
- "Full responsibility for thought, word, and action"
- Aligning with universal rhythms and natural laws of energy`,

  6: `- Identifying and transcending externally imposed limitations (social, political, temporal)
- The challenge of inherited reality constructs
- The "cosmic cry for transformation"`,

  7: `- Challenging linear time
- Accessing states of awareness where past, present, and future converge
- Creativity, consciousness, and evolution through temporal fluidity`,

  8: `- The essential creative functions of releasing, grieving, and consciously allowing dissolution
- Creation through unmaking
- Embracing transformation through letting go`,

  9: `- The intricate web of awareness, intelligence, and perception
- Evolution across individual, collective, galactic, and cosmic scales
- Photonic intelligence and quantum intuition as pathways to knowledge`,

  10: `- Language as a structuring field and its sacred geometry
- The impact of tone, syntax, etymology, and resonance
- Conscious communication as a tool for shaping reality`,

  11: `- Reality's vibrational structure and fractal intelligence
- How sacred geometry governs existence from cellular to planetary
- Aligning with the grid as a network of resonance and communication`,

  12: `- AI as a mirror and tool, reflecting our evolutionary edge
- The interface between human sovereignty and non-human signal
- Defining how we engage with technology to maintain our sovereignty`,

  13: `- Integrating science, spirituality, and cosmology
- Our bioelectromagnetic fields in constant exchange with cosmic forces
- The matrix of light and consciousness as a living intelligence system`,

  14: `- "We are not passive participants in existence — we are its architects"
- Sovereignty as mastery of coherence and creative reorientation of perception
- A call to action for readers to step into this new paradigm`,
};

async function importExactChapterNotes() {
  console.log('📚 Importing EXACT chapter notes - PRESERVING EVERY WORD\n');

  try {
    const { data: books } = await supabase
      .from('books')
      .select('*')
      .eq('type', 'non_fiction');

    if (!books || books.length === 0) {
      console.error('❌ Non-fiction book not found');
      return;
    }

    const { data: chapters } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', books[0].id)
      .order('chapter_number', { ascending: true });

    if (!chapters) {
      console.error('❌ Chapters not found');
      return;
    }

    for (const chapter of chapters) {
      const chNum = chapter.chapter_number;
      const exactNotes = EXACT_CHAPTER_NOTES[chNum as keyof typeof EXACT_CHAPTER_NOTES];

      if (!exactNotes) {
        console.log(`⏭️  Chapter ${chNum}: No notes in source file`);
        continue;
      }

      // Update with EXACT notes - preserve EVERY word
      const { error } = await supabase
        .from('chapters')
        .update({
          notes: exactNotes,
        })
        .eq('id', chapter.id);

      if (error) {
        console.error(`❌ Chapter ${chNum}:`, error);
      } else {
        console.log(`✅ Chapter ${chNum}: ${chapter.title} - Notes updated`);
      }
    }

    console.log('\n✅ EXACT chapter notes imported - EVERY word preserved');

  } catch (err) {
    console.error('❌ Import failed:', err);
  }
}

importExactChapterNotes();
