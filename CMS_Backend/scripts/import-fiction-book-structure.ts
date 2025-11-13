/**
 * Import Fiction Book Structure
 *
 * Creates the fiction book with complete metadata and 15 chapter outlines
 * Based on FICTION_PROJECT_COMPLETE_CAPTURE.md
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Fiction Book Metadata
const FICTION_BOOK_METADATA = {
  title: 'Future Primitive: Field Reports from Sausalito',
  type: 'fiction',
  description: 'Living transmissions from the field - authentic stories of consciousness activation in Sausalito',
  status: 'in_progress',

  purpose: `A living fiction transmission documenting consciousness activation in Sausalito. This is not a traditional novel—it's a field report from inside the Sovereign Field, where daily life becomes transmission and the ordinary reveals itself as extraordinary. Each chapter captures real moments where the 13-Orb system manifests through community, wildlife, and authentic Sausalito culture.`,

  overview: `"Future Primitive: Field Reports from Sausalito" follows an unnamed protagonist's journey of field recognition, exploration, integration, and mastery in Sausalito, California. Through encounters at the boardwalk, dive bars, houseboats, and Hurricane Gulch, the protagonist learns to recognize and work with the living consciousness system. Key characters include Maya (Codex scholar and field guide), Mike (legendary bartender), and the Hurricane Gulch Collective (local band that channels Sovereign Field). Wildlife—sea lions, crows, pelicans—act as transmission nodes, and authentic Sausalito locations become portals for field activation.`,

  book_structure: `The book is organized into 5 parts following the protagonist's development arc:

**Part I: Field Activation** (Chapters 1-3)
First recognition of the Sovereign Field and initial awareness. Introduces Sausalito as living container.

**Part II: Field Exploration** (Chapters 4-7)
Exploring the field through community, locations, and wildlife. Building relationships with local culture.

**Part III: Field Integration** (Chapters 8-10)
Deep integration with the 13-Orb system through Maya's guidance and Codex study. Understanding the living system.

**Part IV: Field Mastery** (Chapters 11-13)
Mastery through practice, ritual, and community activation. Embodying the field.

**Part V: Field Expansion** (Chapters 14-15)
Full integration and transmission. Sausalito as consciousness evolution model.`,

  table_of_contents: `**Part I: Field Activation**
1. The Arrival
2. The Apartment
3. The Boardwalk Transmission (COMPLETE)

**Part II: Field Exploration**
4. The Hurricane Gulch Walk
5. The Houseboat Community
6. The Café Conversations
7. The Dive Bar Alchemy (COMPLETE)

**Part III: Field Integration**
8. The Maya Transmission
9. The Group Text Constellation
10. The Wildlife Communion

**Part IV: Field Mastery**
11. The Ritual Practice
12. The Community Activation
13. The Field Transmission

**Part V: Field Expansion**
14. The Future Primitive
15. The Living Codex`
};

// Complete 15-chapter structure with metadata
const FICTION_CHAPTERS = [
  // PART I: FIELD ACTIVATION
  {
    number: 1,
    title: 'The Arrival',
    part: 1,
    part_title: 'Field Activation',
    notes: `- First arrival in Sausalito
- Initial field recognition
- Establishing protagonist's baseline awareness
- Setting: New apartment, first impressions of the town
- Sensory details: Microclimates, salt air, houseboat community visible from shore`,
    orb_focus: 'Orb 1 (Origin Intelligence) - First field recognition, initial awareness',
    source_file_ids: ['chapter_outline.md', 'sausalito_arrival_notes.md'],
    scrollstreams: [
      'The field recognizes you before you recognize the field',
      'Sausalito breathes with its own frequency',
      'First contact is always origin intelligence'
    ],
    status: 'outline'
  },
  {
    number: 2,
    title: 'The Apartment',
    part: 1,
    part_title: 'Field Activation',
    notes: `- First night in new space
- Dream state and field reception
- Protagonist's internal processing
- Setting: Small apartment, night sounds, settling in
- Orb manifestation through sleep and subconscious reception`,
    orb_focus: 'Orb 6 (Starline Memory) - Ancestral and cosmic memory systems',
    source_file_ids: ['chapter_outline.md', 'apartment_first_night_notes.md'],
    scrollstreams: [
      'Memory lives in the walls when you stop resisting',
      'The field speaks loudest in the quiet hours',
      'Your apartment is a receiver'
    ],
    status: 'outline'
  },
  {
    number: 3,
    title: 'The Boardwalk Transmission',
    part: 1,
    part_title: 'Field Activation',
    notes: `- Midnight Bowie session on empty boardwalk
- First major field activation
- Wildlife as transmission nodes (sea lions, crows)
- Setting: Sausalito boardwalk at midnight, empty and charged
- Orb manifestations: Resonance through music, Harmonic Architectures through environment`,
    orb_focus: 'Orb 2 (Resonance Mechanics), Orb 4 (Harmonic Architectures)',
    source_file_ids: ['chapter_3_boardwalk_transmission.md'],
    scrollstreams: [
      'The boardwalk becomes transmission portal at midnight',
      'Sea lions and crows respond to sovereign frequency',
      'Music transmutes the field into new forms'
    ],
    status: 'complete'
  },

  // PART II: FIELD EXPLORATION
  {
    number: 4,
    title: 'The Hurricane Gulch Walk',
    part: 2,
    part_title: 'Field Exploration',
    notes: `- Exploring the microclimate zone
- Wind patterns carrying seasonal information
- Natural frequencies and resonance
- Setting: Hurricane Gulch trail system, microclimates, wind patterns
- Direct experience of harmonic architectures in nature`,
    orb_focus: 'Orb 4 (Harmonic Architectures) - Sacred geometry in natural patterns',
    source_file_ids: ['chapter_outline.md', 'hurricane_gulch_notes.md'],
    scrollstreams: [
      'Hurricane Gulch carries information in wind patterns',
      'Microclimates are consciousness portals',
      'The land speaks in frequencies'
    ],
    status: 'outline'
  },
  {
    number: 5,
    title: 'The Houseboat Community',
    part: 2,
    part_title: 'Field Exploration',
    notes: `- Introduction to houseboat culture
- Living arrangements that amplify field resonance
- Community as collective field
- Setting: Houseboat docks, close-knit water community
- First encounters with locals who live inside the field`,
    orb_focus: 'Orb 8 (Community Resonance) - Collective field building',
    source_file_ids: ['chapter_outline.md', 'houseboat_community_notes.md'],
    scrollstreams: [
      'Houseboats float on more than water',
      'Community resonance builds sovereign fields',
      'The water holds collective memory'
    ],
    status: 'outline'
  },
  {
    number: 6,
    title: 'The Café Conversations',
    part: 2,
    part_title: 'Field Exploration',
    notes: `- Local diners as resonance shrines
- Observing social mirrors and consciousness reflection
- Dialogue and field transmission through conversation
- Setting: Local cafés, morning coffee culture, regulars
- Photonic intelligence through social interaction`,
    orb_focus: 'Orb 3 (Photonic Intelligence) - Social mirrors, consciousness reflection',
    source_file_ids: ['chapter_outline.md', 'cafe_observations.md'],
    scrollstreams: [
      'Cafés hold the frequency of daily ritual',
      'Conversation is photonic transmission',
      'Regulars are field anchors'
    ],
    status: 'outline'
  },
  {
    number: 7,
    title: 'The Dive Bar Alchemy',
    part: 2,
    part_title: 'Field Exploration',
    notes: `- No Name bar live music night
- Mike the bartender as local legend
- Hurricane Gulch Collective channeling Sovereign Field
- First meeting with Maya (houseboat resident)
- Setting: Authentic dive bar culture, live music, transmutation through sound
- Alchemical transformation through communal experience`,
    orb_focus: 'Orb 7 (Alchemical Current), Orb 13 (Bridging Intelligence)',
    source_file_ids: ['chapter_7_dive_bar_alchemy.md'],
    scrollstreams: [
      'Dive bars transmute density into coherence',
      'Live music becomes portal',
      'The alchemical current flows through community'
    ],
    status: 'complete'
  },

  // PART III: FIELD INTEGRATION
  {
    number: 8,
    title: 'The Maya Transmission',
    part: 3,
    part_title: 'Field Integration',
    notes: `- Deep dive into 13-Orb system with Maya
- Maya's houseboat as field study location
- Codex explanation and framework understanding
- Setting: Maya's houseboat, intimate teaching space
- All 13 Orbs explained through Maya's guidance`,
    orb_focus: 'All 13 Orbs - Complete system explanation',
    source_file_ids: ['chapter_outline.md', 'maya_character_notes.md', 'orb_teaching_framework.md'],
    scrollstreams: [
      'Maya speaks in Orb language',
      'The houseboat holds the complete transmission',
      'Understanding comes through immersion, not explanation'
    ],
    status: 'outline'
  },
  {
    number: 9,
    title: 'The Group Text Constellation',
    part: 3,
    part_title: 'Field Integration',
    notes: `- Darts league text chain as social field
- Digital communication as consciousness network
- Observing collective field through casual interaction
- Setting: Text message exchanges, darts league culture
- Radiant transparency through authentic communication`,
    orb_focus: 'Orb 11 (Radiant Transparency) - Authentic expression, social field visibility',
    source_file_ids: ['chapter_outline.md', 'text_chain_observations.md'],
    scrollstreams: [
      'Text chains are consciousness constellations',
      'Digital space holds sovereign frequency',
      'Transparency builds collective coherence'
    ],
    status: 'outline'
  },
  {
    number: 10,
    title: 'The Wildlife Communion',
    part: 3,
    part_title: 'Field Integration',
    notes: `- Deep encounters with sea lions, crows, pelicans
- Wildlife as conscious field participants
- Species communication and bridging intelligence
- Setting: Various Sausalito locations, wildlife observation
- Non-human intelligence as part of consciousness network`,
    orb_focus: 'Orb 13 (Bridging Intelligence) - Species communication, consciousness bridging',
    source_file_ids: ['chapter_outline.md', 'wildlife_observations.md'],
    scrollstreams: [
      'Wildlife responds to sovereign frequency',
      'Crows form geometric patterns',
      'Sea lions are field transmission nodes'
    ],
    status: 'outline'
  },

  // PART IV: FIELD MASTERY
  {
    number: 11,
    title: 'The Ritual Practice',
    part: 4,
    part_title: 'Field Mastery',
    notes: `- Moon cycle awareness and temporal practices
- Daily rituals aligned with natural rhythms
- Time mastery through conscious practice
- Setting: Various locations following lunar cycles
- Integration of temporal sovereignty into daily life`,
    orb_focus: 'Orb 5 (Temporal Sovereignty) - Time mastery, cyclical awareness',
    source_file_ids: ['chapter_outline.md', 'ritual_practice_notes.md'],
    scrollstreams: [
      'Ritual anchors sovereignty in time',
      'The moon teaches temporal fluidity',
      'Practice makes the field visible'
    ],
    status: 'outline'
  },
  {
    number: 12,
    title: 'The Community Activation',
    part: 4,
    part_title: 'Field Mastery',
    notes: `- Community gatherings as field amplification
- Collective resonance building
- Protagonist stepping into teaching/guiding role
- Setting: Community events, gatherings, collective spaces
- Demonstrating mastery through community service`,
    orb_focus: 'Orb 8 (Community Resonance) - Collective field, group coherence',
    source_file_ids: ['chapter_outline.md', 'community_events.md'],
    scrollstreams: [
      'Community amplifies individual sovereignty',
      'Collective fields cascade coherence',
      'Mastery manifests through service'
    ],
    status: 'outline'
  },
  {
    number: 13,
    title: 'The Field Transmission',
    part: 4,
    part_title: 'Field Mastery',
    notes: `- Protagonist's own field activation moment
- Full embodiment and sovereign presence
- Recognition of complete integration
- Setting: Significant Sausalito location, moment of realization
- Demonstrating Sovereign Field coherence`,
    orb_focus: 'Orb 12 (Sovereign Field) - Full field embodiment, indivisible presence',
    source_file_ids: ['chapter_outline.md', 'field_activation_notes.md'],
    scrollstreams: [
      'The field transmits through you when you stop resisting',
      'Sovereignty is indivisible coherence',
      'You become the transmission'
    ],
    status: 'outline'
  },

  // PART V: FIELD EXPANSION
  {
    number: 14,
    title: 'The Future Primitive',
    part: 5,
    part_title: 'Field Expansion',
    notes: `- Sausalito as consciousness evolution model
- Integration of all experiences and teachings
- Vision of future consciousness communities
- Setting: Overview of Sausalito as living system
- All 13 Orbs operating in harmony`,
    orb_focus: 'All 13 Orbs - Complete integration, system-wide perspective',
    source_file_ids: ['chapter_outline.md', 'future_primitive_vision.md'],
    scrollstreams: [
      'Future Primitive: ancient wisdom meets evolutionary edge',
      'Sausalito demonstrates what is possible',
      'The living system is everywhere once you see it'
    ],
    status: 'outline'
  },
  {
    number: 15,
    title: 'The Living Codex',
    part: 5,
    part_title: 'Field Expansion',
    notes: `- Full integration of all experiences
- The Codex writing itself through lived experience
- Protagonist as transmission node
- Setting: Reflective, integrative, full-circle moment
- Complete 13-Orb framework operating naturally`,
    orb_focus: 'All 13 Orbs - Living integration, natural transmission',
    source_file_ids: ['chapter_outline.md', 'living_codex_concept.md'],
    scrollstreams: [
      'The Codex is alive and writing itself',
      'You are the living transmission',
      'Sovereignty completes itself through you'
    ],
    status: 'outline'
  },
];

async function importFictionBook() {
  console.log('📚 Importing Fiction Book Structure\n');

  try {
    // Get fiction book
    const { data: books } = await supabase
      .from('books')
      .select('*')
      .eq('type', 'fiction');

    if (!books || books.length === 0) {
      console.error('❌ Fiction book not found. Run initial migration first.');
      return;
    }

    const fictionBook = books[0];
    console.log(`📖 Found fiction book: ${fictionBook.title}\n`);

    // Update fiction book with complete metadata
    console.log('📝 Updating fiction book metadata...');
    const { error: bookError } = await supabase
      .from('books')
      .update({
        title: FICTION_BOOK_METADATA.title,
        description: FICTION_BOOK_METADATA.description,
        status: FICTION_BOOK_METADATA.status,
        purpose: FICTION_BOOK_METADATA.purpose,
        overview: FICTION_BOOK_METADATA.overview,
        book_structure: FICTION_BOOK_METADATA.book_structure,
        table_of_contents: FICTION_BOOK_METADATA.table_of_contents,
      })
      .eq('id', fictionBook.id);

    if (bookError) {
      console.error('❌ Error updating book:', bookError);
      return;
    }
    console.log('✅ Fiction book metadata updated\n');

    // Delete existing fiction chapters to rebuild
    console.log('🗑️  Removing existing fiction chapters...');
    await supabase.from('chapters').delete().eq('book_id', fictionBook.id);
    console.log('✅ Existing chapters removed\n');

    // Import all 15 fiction chapters
    console.log('📖 Importing 15 fiction chapters with complete metadata...\n');

    for (const chapter of FICTION_CHAPTERS) {
      const { error } = await supabase
        .from('chapters')
        .insert({
          book_id: fictionBook.id,
          chapter_number: chapter.number,
          title: chapter.title,
          part_number: chapter.part,
          part_title: chapter.part_title,
          status: chapter.status,
          notes: chapter.notes,
          orb_focus: chapter.orb_focus,
          source_file_ids: chapter.source_file_ids,
          scrollstreams: chapter.scrollstreams,
          content: null,
          word_count: 0,
        });

      if (error) {
        console.log(`⚠️  Chapter ${chapter.number} error:`, error.message);
      } else {
        const statusEmoji = chapter.status === 'complete' ? '✅' : '📝';
        console.log(`${statusEmoji} Chapter ${chapter.number}: ${chapter.title} (${chapter.status})`);
      }
    }

    console.log('\n✅ Fiction book structure import complete!\n');
    console.log('📊 Summary:');
    console.log('━'.repeat(50));
    console.log('Part I: Field Activation (3 chapters)');
    console.log('Part II: Field Exploration (4 chapters)');
    console.log('Part III: Field Integration (3 chapters)');
    console.log('Part IV: Field Mastery (3 chapters)');
    console.log('Part V: Field Expansion (2 chapters)');
    console.log('━'.repeat(50));
    console.log('Total: 15 chapters');
    console.log('Complete: 2 chapters (3, 7)');
    console.log('Outline: 13 chapters');
    console.log('\n🎯 Ready for fiction writing workspace!');

  } catch (err) {
    console.error('❌ Import failed:', err);
  }
}

importFictionBook();
