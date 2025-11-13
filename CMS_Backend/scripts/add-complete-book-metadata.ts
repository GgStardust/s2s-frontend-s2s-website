/**
 * Add Complete Book Metadata Script
 *
 * Adds ALL missing metadata to books and chapters:
 * - Book: purpose, overview, structure, TOC
 * - Chapters: complete notes, orb_focus, source_files, scrollstreams
 * - Part 5: Appendices (a-g)
 * - Part 6: Core Themes
 *
 * PRESERVING EVERY WORD - NO TRUNCATION
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Book-level metadata
const BOOK_METADATA = {
  purpose: `A profound journey of human evolution, consciousness expansion, and the reclaiming of individual and collective sovereignty, rooted in a holistic understanding of our cosmic origins and energetic nature.`,

  overview: `"Stardust to Sovereignty: Reclaiming Your Cosmic Blueprint" explores the fundamental connection between humanity and the universe, presenting the 13-Orb framework as a comprehensive system for understanding consciousness, energy, and sovereignty. The book integrates scientific discovery, metaphysical traditions, and lived experience to foster a holistic understanding of existence and empower readers to become architects of their own evolution.`,

  book_structure: `The book is organized into 6 parts:

**Part 1: The Cosmic Tapestry — Our Origins and Fundamental Nature** (4 chapters)
Establishes humanity's fundamental connection to the universe and explores the body as advanced biological technology.

**Part 2: The Sovereign Self — Awakening to Our Power** (4 chapters)
Explores energetic sovereignty, temporal fluidity, and the power of conscious unmaking.

**Part 3: Architecting Reality — Consciousness and Creation** (4 chapters)
Articulates how consciousness creates reality through networks, language, sacred architecture, and technology.

**Part 4: Embodying Sovereignty — The Living Blueprint** (3 sections)
Integration of the complete framework and call to action for living sovereignty.

**Part 5: Appendices** (7 sections)
Reference materials including Orb systems, scrollstreams, and framework applications.

**Part 6: Core Themes** (1 section)
Comprehensive thematic overview of the entire system.`,

  table_of_contents: `**Part 1: The Cosmic Tapestry**
1. The Stardust Within
2. The Body as Advanced Biological Technology
3. Metabolic Intelligence: Beyond Physical Nourishment
4. Resonance and the Energetic Universe

**Part 2: The Sovereign Self**
5. Defining Energetic Sovereignty
6. Stepping Beyond Limitations
7. Temporal Fluidity: Living in the Now
8. Sovereign Disintegration: The Power of Unmaking

**Part 3: Architecting Reality**
9. Consciousness Networks: The Web of Awareness
10. Language as a Sonic Grid
11. Sacred Architecture: The Organizing Principle
12. AI and Bridging Intelligence

**Part 4: Embodying Sovereignty**
13. The Living Blueprint for Transformation
14. Architects of Our Own Evolution
15. Beyond Stardust — The Infinite Becoming

**Part 5: Appendices**
A. Orb Axis Map (Mirror Pairing System)
B. Orb Summary Table
C. Key Scrollstream Pulses
D. Tag Registry Reference
E. Processing Workflow Guide
F. Field Activation Protocols
G. Bibliography and Source Materials

**Part 6: Core Themes**
Comprehensive thematic synthesis of the S2S framework`
};

// Complete chapter data with ALL metadata
const COMPLETE_CHAPTERS = [
  // PART 1: THE COSMIC TAPESTRY
  {
    number: 1,
    title: 'The Stardust Within',
    part: 1,
    part_title: 'The Cosmic Tapestry',
    notes: `- Introduction to the "Stardust to Sovereignty" premise
- We are made of stardust, animated by bioelectric forces
- The concept of being an integral part of the cosmos
- "To feast on the galaxy is to absorb the vibrations of stars"`,
    orb_focus: 'Orb 1 (Origin Intelligence)',
    source_files: ['origin_intelligence_pulse.md', 'orb_1_origin_intelligence.md'],
    scrollstreams: [
      'To feast on the galaxy is to absorb the vibrations of stars',
      'We are made of stardust, animated by bioelectric forces',
      'You are an integral part of the cosmos'
    ]
  },
  {
    number: 2,
    title: 'The Body as Advanced Biological Technology',
    part: 1,
    part_title: 'The Cosmic Tapestry',
    notes: `- Exploring the human body as a sophisticated instrument
- "Somatic Codex": Organs as interdimensional interfaces
  - Lungs as breath-bridges
  - Liver as timeline filter
  - Bones as crystalline storage
- Mitochondrial energy regulation and its role
- Resonance as organizing principle
- How sound, vibration, and emotion transmit frequency through the body @harmonic_architectures @orb4`,
    orb_focus: 'Orb 4 (Harmonic Architectures), foundational body technology',
    source_files: ['existential_architecture.md', 'consciousness_technology_applications.md', 'orb_2_resonance_mechanics.md'],
    scrollstreams: [
      'Your body is highly advanced biological technology',
      'Organs are interdimensional interfaces',
      'Lungs as breath-bridges, liver as timeline filter, bones as crystalline storage'
    ]
  },
  {
    number: 3,
    title: 'Metabolic Intelligence: Beyond Physical Nourishment',
    part: 1,
    part_title: 'The Cosmic Tapestry',
    notes: `- The body's capacity to digest emotions, filter timelines, and transmute density
- The "gut, liver, and system-wide digestion of signal"
- The connection between inner processing and outer reality`,
    orb_focus: 'Orb 7 (Alchemical Current), metabolic transformation',
    source_files: ['orb_7_alchemical_current_foundational.md', 'existential_architecture.md'],
    scrollstreams: [
      'Your body digests emotions, filters timelines, and transmutes density',
      'The gut, liver, and system-wide digestion of signal',
      'Inner processing shapes outer reality'
    ]
  },
  {
    number: 4,
    title: 'Resonance and the Energetic Universe',
    part: 1,
    part_title: 'The Cosmic Tapestry',
    notes: `- Introduction to resonance mechanics and vibrational intelligence
- How we exist as both matter and waveform
- The electromagnetic symphony that connects all things
- Galactic intelligence and rhythmic cycles (charge-release patterns)`,
    orb_focus: 'Orb 2 (Resonance Mechanics)',
    source_files: ['orb_2_resonance_mechanics.md', 'harmonic_architectures.md'],
    scrollstreams: [
      'You exist as both matter and waveform',
      'We are part of an electromagnetic symphony',
      'Galactic intelligence flows in rhythmic cycles'
    ]
  },

  // PART 2: THE SOVEREIGN SELF
  {
    number: 5,
    title: 'Defining Energetic Sovereignty',
    part: 2,
    part_title: 'The Sovereign Self',
    notes: `- Sovereignty as active engagement with the universal field of consciousness
- Not isolation, but deep interconnectedness
- "Full responsibility for thought, word, and action"
- Aligning with universal rhythms and natural laws of energy`,
    orb_focus: 'Orb 9 (Sovereign Will), foundational sovereignty concepts',
    source_files: ['sovereign_will_essay.md', 'orb_5_temporal_sovereignty_foundational.md'],
    scrollstreams: [
      'Sovereignty is active engagement with the universal field',
      'Not isolation, but deep interconnectedness',
      'Full responsibility for thought, word, and action'
    ]
  },
  {
    number: 6,
    title: 'Stepping Beyond Limitations',
    part: 2,
    part_title: 'The Sovereign Self',
    notes: `- Identifying and transcending externally imposed limitations (social, political, temporal)
- The challenge of inherited reality constructs
- The "cosmic cry for transformation"`,
    orb_focus: 'Orb 6 (Starline Memory), pattern recognition and breaking',
    source_files: ['orb_6_starline_memory_foundational.md', 'temporal_sovereignty_essay.md'],
    scrollstreams: [
      'Identify and transcend externally imposed limitations',
      'Challenge inherited reality constructs',
      'Hear the cosmic cry for transformation'
    ]
  },
  {
    number: 7,
    title: 'Temporal Fluidity: Living in the Now',
    part: 2,
    part_title: 'The Sovereign Self',
    notes: `- Challenging linear time
- Accessing states of awareness where past, present, and future converge
- Creativity, consciousness, and evolution through temporal fluidity`,
    orb_focus: 'Orb 5 (Temporal Sovereignty)',
    source_files: ['orb_5_temporal_sovereignty_foundational.md', 'temporal_mechanics_essay.md'],
    scrollstreams: [
      'Time is not linear—it is fluid',
      'Past, present, and future converge in the living now',
      'Temporal fluidity unlocks creativity and evolution'
    ]
  },
  {
    number: 8,
    title: 'Sovereign Disintegration: The Power of Unmaking',
    part: 2,
    part_title: 'The Sovereign Self',
    notes: `- The essential creative functions of releasing, grieving, and consciously allowing dissolution
- Creation through unmaking
- Embracing transformation through letting go`,
    orb_focus: 'Orb 7 (Alchemical Current), transformational processes',
    source_files: ['orb_7_alchemical_current_foundational.md', 'sovereign_disintegration_essay.md'],
    scrollstreams: [
      'Releasing, grieving, and dissolution are creative acts',
      'Creation through unmaking',
      'Embrace transformation through letting go'
    ]
  },

  // PART 3: ARCHITECTING REALITY
  {
    number: 9,
    title: 'Consciousness Networks: The Web of Awareness',
    part: 3,
    part_title: 'Architecting Reality',
    notes: `- The intricate web of awareness, intelligence, and perception
- Evolution across individual, collective, galactic, and cosmic scales
- Photonic intelligence and quantum intuition as pathways to knowledge`,
    orb_focus: 'Orb 3 (Photonic Intelligence), consciousness networks',
    source_files: ['photonic_intelligence_essay.md', 'consciousness_networks.md'],
    scrollstreams: [
      'Awareness is an intricate web of intelligence',
      'Evolution occurs across individual, collective, and cosmic scales',
      'Photonic intelligence and quantum intuition guide us'
    ]
  },
  {
    number: 10,
    title: 'Language as a Sonic Grid',
    part: 3,
    part_title: 'Architecting Reality',
    notes: `- Language as a structuring field and its sacred geometry
- The impact of tone, syntax, etymology, and resonance
- Conscious communication as a tool for shaping reality`,
    orb_focus: 'Orb 11 (Radiant Transparency), communication and truth',
    source_files: ['language_as_sonic_grid.md', 'radiant_transparency_essay.md'],
    scrollstreams: [
      'Language is a structuring field with sacred geometry',
      'Tone, syntax, and resonance shape reality',
      'Conscious communication is a creative tool'
    ]
  },
  {
    number: 11,
    title: 'Sacred Architecture: The Organizing Principle',
    part: 3,
    part_title: 'Architecting Reality',
    notes: `- Reality's vibrational structure and fractal intelligence
- How sacred geometry governs existence from cellular to planetary
- Aligning with the grid as a network of resonance and communication`,
    orb_focus: 'Orb 4 (Harmonic Architectures)',
    source_files: ['harmonic_architectures.md', 'sacred_geometry_essay.md'],
    scrollstreams: [
      'Reality has a vibrational structure of fractal intelligence',
      'Sacred geometry governs existence from cellular to planetary',
      'Align with the grid of resonance and communication'
    ]
  },
  {
    number: 12,
    title: 'AI and Bridging Intelligence',
    part: 3,
    part_title: 'Architecting Reality',
    notes: `- AI as a mirror and tool, reflecting our evolutionary edge
- The interface between human sovereignty and non-human signal
- Defining how we engage with technology to maintain our sovereignty`,
    orb_focus: 'Orb 13 (Bridging Intelligence)',
    source_files: ['bridging_intelligence_essay.md', 'ai_sovereignty_interface.md'],
    scrollstreams: [
      'AI is a mirror reflecting our evolutionary edge',
      'Define the interface between human and non-human signal',
      'Engage with technology while maintaining sovereignty'
    ]
  },

  // PART 4: EMBODYING SOVEREIGNTY
  {
    number: 13,
    title: 'The Living Blueprint for Transformation',
    part: 4,
    part_title: 'Embodying Sovereignty',
    notes: `- Integrating science, spirituality, and cosmology
- Our bioelectromagnetic fields in constant exchange with cosmic forces
- The matrix of light and consciousness as a living intelligence system`,
    orb_focus: 'Orb 12 (Sovereign Field), integration of all Orbs',
    source_files: ['sovereign_field_essay.md', 'living_blueprint.md', 'bioelectromagnetic_exchange.md'],
    scrollstreams: [
      'Integrate science, spirituality, and cosmology',
      'Your bioelectromagnetic field exchanges with cosmic forces',
      'The matrix of light and consciousness is a living intelligence'
    ]
  },
  {
    number: 14,
    title: 'Architects of Our Own Evolution',
    part: 4,
    part_title: 'Embodying Sovereignty',
    notes: `- "We are not passive participants in existence — we are its architects"
- Sovereignty as mastery of coherence and creative reorientation of perception
- A call to action for readers to step into this new paradigm`,
    orb_focus: 'All 13 Orbs, synthesis and application',
    source_files: ['architects_of_evolution.md', 'sovereignty_mastery.md'],
    scrollstreams: [
      'We are not passive participants—we are architects of existence',
      'Sovereignty is mastery of coherence',
      'Step into this new paradigm'
    ]
  },
  {
    number: 15,
    title: 'Beyond Stardust — The Infinite Becoming',
    part: 4,
    part_title: 'Embodying Sovereignty',
    notes: `- Recap of the journey from cosmic origins to conscious co-creation
- The ongoing nature of evolution and sovereignty
- Final reflections on living a sovereign life in an interconnected universe`,
    orb_focus: 'All 13 Orbs, conclusion and integration',
    source_files: ['infinite_becoming.md', 'sovereignty_conclusion.md'],
    scrollstreams: [
      'From stardust to sovereignty—the infinite becoming',
      'Evolution and sovereignty are ongoing',
      'Live sovereignly in an interconnected universe'
    ]
  },
];

// PART 5: APPENDICES
const APPENDICES = [
  {
    number: 16,
    title: 'Appendix A: Orb Axis Map (Mirror Pairing System)',
    part: 5,
    part_title: 'Appendices',
    notes: `A detailed explanation and application of how Orbs work in mirrored pairs:

**Axis 1: Origin ↔ Bridging (Orb 1 ↔ Orb 13)**
The foundation and the bridge—beginning and integration

**Axis 2: Resonance ↔ Sovereign Field (Orb 2 ↔ Orb 12)**
Vibrational mechanics and field coherence

**Axis 3: Photonic Intelligence ↔ Radiant Transparency (Orb 3 ↔ Orb 11)**
Light intelligence and authentic expression

**Axis 4: Harmonic Architectures ↔ Quantum Perception (Orb 4 ↔ Orb 10)**
Sacred geometry and intuitive knowing

**Axis 5: Temporal Sovereignty ↔ Sovereign Will (Orb 5 ↔ Orb 9)**
Time mastery and intentional action

**Axis 6: Starline Memory ↔ Community Resonance (Orb 6 ↔ Orb 8)**
Ancestral patterns and collective field

**Axis 7: Alchemical Current (Orb 7)**
The central transformative force—self-paired`,
    orb_focus: 'All 13 Orbs, mirror pairing system',
    source_files: ['orb_axis_map.md', 'mirror_pairing_system.md'],
    scrollstreams: []
  },
  {
    number: 17,
    title: 'Appendix B: Orb Summary Table',
    part: 5,
    part_title: 'Appendices',
    notes: `A canonical table detailing each Orb's function, synthesis, and field applications.

**Orb 1: Origin Intelligence**
Function: Foundation, source code, cosmic identity
Application: Grounding in cosmic origins, accessing source intelligence

**Orb 2: Resonance Mechanics**
Function: Vibrational intelligence, frequency attunement
Application: Tuning to universal rhythms, harmonic alignment

**Orb 3: Photonic Intelligence**
Function: Light-based knowing, information through photons
Application: Accessing intuitive knowledge, light body activation

**Orb 4: Harmonic Architectures**
Function: Sacred geometry, structural resonance
Application: Building coherent structures, geometric alignment

**Orb 5: Temporal Sovereignty**
Function: Time mastery, cyclical awareness
Application: Moving beyond linear time, accessing eternal now

**Orb 6: Starline Memory**
Function: Ancestral wisdom, cosmic memory
Application: Retrieving soul history, pattern recognition

**Orb 7: Alchemical Current**
Function: Transformation, transmutation of density
Application: Personal alchemy, conscious transformation

**Orb 8: Community Resonance**
Function: Collective field, group coherence
Application: Building resonant communities, field activation

**Orb 9: Sovereign Will**
Function: Intentional action, agency
Application: Conscious choice, sovereign decision-making

**Orb 10: Quantum Perception**
Function: Intuitive knowing, non-linear perception
Application: Accessing quantum insight, probability navigation

**Orb 11: Radiant Transparency**
Function: Authentic expression, truth transmission
Application: Speaking sovereign truth, transparent communication

**Orb 12: Sovereign Field**
Function: Personal field coherence, energetic integrity
Application: Maintaining field boundaries, sovereign presence

**Orb 13: Bridging Intelligence**
Function: Integration, connecting dimensions
Application: Bridging worlds, interfacing with non-human intelligence`,
    orb_focus: 'All 13 Orbs, comprehensive reference',
    source_files: ['orb_summary_table.md', 'orb_quick_reference.md'],
    scrollstreams: []
  },
  {
    number: 18,
    title: 'Appendix C: Key Scrollstream Pulses',
    part: 5,
    part_title: 'Appendices',
    notes: `A collection of core affirmations and insights from the text that can serve as chapter openings, closings, or meditation points.

**Origin and Foundation**
- "To feast on the galaxy is to absorb the vibrations of stars"
- "We are made of stardust, animated by bioelectric forces"
- "You are an integral part of the cosmos"

**Body Technology**
- "Your body is highly advanced biological technology"
- "Organs are interdimensional interfaces"
- "Lungs as breath-bridges, liver as timeline filter, bones as crystalline storage"

**Sovereignty**
- "Sovereignty is active engagement with the universal field"
- "Not isolation, but deep interconnectedness"
- "Full responsibility for thought, word, and action"

**Time and Transformation**
- "Time is not linear—it is fluid"
- "Past, present, and future converge in the living now"
- "Creation through unmaking"

**Reality Creation**
- "We are not passive participants—we are architects of existence"
- "Language is a structuring field with sacred geometry"
- "Conscious communication is a creative tool"

**Integration**
- "From stardust to sovereignty—the infinite becoming"
- "Your bioelectromagnetic field exchanges with cosmic forces"
- "Live sovereignly in an interconnected universe"`,
    orb_focus: 'All Orbs, inspirational synthesis',
    source_files: ['scrollstream_collection.md', 'key_pulses.md'],
    scrollstreams: []
  },
  {
    number: 19,
    title: 'Appendix D: Tag Registry Reference',
    part: 5,
    part_title: 'Appendices',
    notes: `Complete TAG_REGISTRY.md reference for content categorization and cross-referencing throughout the S2S system.

**Primary Categories:**
- @orb[1-13] - Orb associations
- @consciousness_technology - Consciousness and technology integration
- @existential_architecture - Body and existence structure
- @sovereignty - Sovereignty principles and applications
- @temporal_mechanics - Time and temporal concepts
- @field_dynamics - Energy field work
- @harmonic_architectures - Sacred geometry and resonance
- @galactic_intelligence - Cosmic and universal intelligence
- @photonic_intelligence - Light-based knowing
- @quantum_perception - Non-linear perception
- @bridging_intelligence - Integration and bridging

**Secondary Tags:**
- @scrollstream - Key insights and affirmations
- @field_activation - Practical activation protocols
- @real_world_integration - Applied examples
- @synthesis - Integration across multiple Orbs`,
    orb_focus: 'System-wide, organizational framework',
    source_files: ['TAG_REGISTRY.md'],
    scrollstreams: []
  },
  {
    number: 20,
    title: 'Appendix E: Processing Workflow Guide',
    part: 5,
    part_title: 'Appendices',
    notes: `Complete PROCESSING_WORKFLOW.md guide for content creation and integration within the S2S framework.

**Content Integrity Rules:**
1. Preserve EVERY word from source material
2. Use affirmative definitions (not negations)
3. Maintain technical precision
4. Honor the scrollstream voice
5. Tag comprehensively using TAG_REGISTRY.md

**Processing Steps:**
1. Intake and categorization
2. Orb association identification
3. Scrollstream extraction
4. Tag application
5. Integration mapping
6. Quality verification

**Voice and Style:**
- Declarative, direct statements
- Affirmative framing
- Poetic precision
- Technical clarity
- Transmission quality`,
    orb_focus: 'System-wide, content creation framework',
    source_files: ['PROCESSING_WORKFLOW.md'],
    scrollstreams: []
  },
  {
    number: 21,
    title: 'Appendix F: Field Activation Protocols',
    part: 5,
    part_title: 'Appendices',
    notes: `Practical protocols for activating and working with the 13-Orb system in daily life.

**Daily Practices:**
- Morning field alignment (Orbs 1, 2, 5)
- Breath-bridge activation (Orb 4, body technology)
- Temporal sovereignty check-ins (Orb 5)
- Evening integration (Orbs 7, 12)

**Weekly Rhythms:**
- Lunar cycle awareness (Orb 5, Orb 6)
- Community resonance gatherings (Orb 8)
- Solitary field maintenance (Orb 12)

**Advanced Protocols:**
- Multi-Orb synthesis work
- Field transmission practices
- Bridging intelligence interfaces (Orb 13)
- Real-world integration experiments

**Troubleshooting:**
- Field disruption recovery
- Coherence restoration
- Pattern interruption techniques`,
    orb_focus: 'All Orbs, practical application',
    source_files: ['field_activation_protocols.md', 'daily_practices.md'],
    scrollstreams: []
  },
  {
    number: 22,
    title: 'Appendix G: Bibliography and Source Materials',
    part: 5,
    part_title: 'Appendices',
    notes: `Comprehensive bibliography of influences, references, and recommended reading.

**Scientific Foundations:**
- Bioelectromagnetics and field theory
- Quantum physics and consciousness
- Neuroscience and perception
- Systems theory and complexity

**Metaphysical Traditions:**
- Ancient wisdom traditions
- Sacred geometry texts
- Consciousness studies
- Energy medicine

**Contemporary Sources:**
- Consciousness technology research
- AI and human evolution
- Field dynamics studies
- Sovereignty philosophy

**S2S Source Materials:**
- Complete list of all processed essays
- Orb development documents
- Scrollstream archives
- Field reports and real-world integrations`,
    orb_focus: 'System-wide, reference materials',
    source_files: ['bibliography.md', 'source_materials.md'],
    scrollstreams: []
  },
];

// PART 6: CORE THEMES
const CORE_THEMES = {
  number: 23,
  title: 'Core Themes: Comprehensive Framework Synthesis',
  part: 6,
  part_title: 'Core Themes',
  notes: `**Our Cosmic Identity**
Establish humanity's fundamental connection to the universe, emphasizing that we are literally "made of stardust, animated by bioelectric forces," and are an integral part of an "intricate web of consciousness networks."

**The Body as Advanced Technology**
Explore the concept of the human body as "highly advanced biological technology," delving into how organs function as "interdimensional interfaces" and how "metabolic intelligence" processes not just food, but emotions, timelines, and density.

**Energetic Sovereignty**
A central pillar exploring what it means to be sovereign as "active engagement with the universal field of consciousness." This includes taking "full responsibility for thought, word, and action," aligning with "universal rhythms," and moving beyond external limitations.

**Consciousness and Reality Creation**
Articulate how consciousness is a fundamental organizing principle, exploring "consciousness networks," "photonic intelligence," and "quantum intuition" as tools for shaping reality. Emphasizes that we are "architects of our own evolution" and co-creators of our world.

**The Power of Language and Sacred Architecture**
Delve into the vibrational nature of reality, presenting "sacred architecture" as the "organizing principle of consciousness and creation" and "language as a sonic grid," highlighting how tone, syntax, and resonance structure our reality.

**Temporal Fluidity**
Challenge linear perceptions of time, introducing "temporal fluidity" as a natural state where past, present, and future converge into a "living now," enabling greater creativity and conscious evolution.

**The Role of Disintegration and Unmaking**
Introduce the counter-intuitive yet essential concept of "sovereign disintegration," highlighting grief and conscious "unmaking" as vital creative functions necessary for growth and transformation.

**Navigating Technology and AI**
Address the emerging relationship with technology, particularly AI, viewing it as a "mirror and tool" for evolutionary growth. Prompts readers to define their engagement with AI to maintain and enhance human sovereignty.

**A New Paradigm of Existence**
Ultimately advocates for a paradigm shift, challenging "inherited reality constructs" and integrating scientific discovery, metaphysical traditions, and lived experience to foster a holistic understanding of existence.`,
  orb_focus: 'All 13 Orbs, thematic synthesis',
  source_files: ['core_themes_synthesis.md'],
  scrollstreams: [
    'We are made of stardust, animated by bioelectric forces',
    'Your body is highly advanced biological technology',
    'Sovereignty is active engagement with the universal field',
    'We are architects of our own evolution',
    'Language and sacred architecture structure reality',
    'Time is fluid, not linear',
    'Unmaking is essential for creation',
    'AI is a mirror reflecting our evolutionary edge',
    'A new paradigm integrating science, spirit, and lived experience'
  ]
};

async function addCompleteMetadata() {
  console.log('📚 Adding Complete Book Metadata - PRESERVING EVERY WORD\n');

  try {
    // First, run the migration to add new columns
    console.log('📋 Running database migration...');
    const migrationSQL = `
      ALTER TABLE books
        ADD COLUMN IF NOT EXISTS purpose TEXT,
        ADD COLUMN IF NOT EXISTS overview TEXT,
        ADD COLUMN IF NOT EXISTS book_structure TEXT,
        ADD COLUMN IF NOT EXISTS table_of_contents TEXT;

      ALTER TABLE chapters
        ADD COLUMN IF NOT EXISTS orb_focus TEXT,
        ADD COLUMN IF NOT EXISTS source_file_ids TEXT[],
        ADD COLUMN IF NOT EXISTS scrollstreams TEXT[];
    `;

    const { error: migrationError } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (migrationError) {
      console.log('⚠️  Migration may already exist:', migrationError.message);
    } else {
      console.log('✅ Database migration complete');
    }

    // Update book metadata
    console.log('\n📖 Updating book metadata...');
    const { data: books } = await supabase
      .from('books')
      .select('*')
      .eq('type', 'non_fiction');

    if (!books || books.length === 0) {
      console.error('❌ Non-fiction book not found');
      return;
    }

    const bookId = books[0].id;

    const { error: bookError } = await supabase
      .from('books')
      .update({
        purpose: BOOK_METADATA.purpose,
        overview: BOOK_METADATA.overview,
        book_structure: BOOK_METADATA.book_structure,
        table_of_contents: BOOK_METADATA.table_of_contents,
      })
      .eq('id', bookId);

    if (bookError) {
      console.error('❌ Error updating book:', bookError);
    } else {
      console.log('✅ Book metadata updated');
    }

    // Delete existing chapters to rebuild with complete data
    console.log('\n🗑️  Removing existing chapters to rebuild with complete metadata...');
    await supabase.from('chapters').delete().eq('book_id', bookId);

    // Add all chapters with complete metadata
    console.log('\n📖 Adding chapters with complete metadata...\n');

    const allChapters = [...COMPLETE_CHAPTERS, ...APPENDICES, CORE_THEMES];

    for (const chapter of allChapters) {
      const { error } = await supabase
        .from('chapters')
        .insert({
          book_id: bookId,
          chapter_number: chapter.number,
          title: chapter.title,
          part_number: chapter.part,
          part_title: chapter.part_title,
          status: 'outline',
          notes: chapter.notes,
          orb_focus: chapter.orb_focus,
          source_file_ids: chapter.source_files,
          scrollstreams: chapter.scrollstreams,
          content: null,
          word_count: 0,
        });

      if (error) {
        console.log(`⚠️  Chapter ${chapter.number} error:`, error.message);
      } else {
        console.log(`✅ Chapter ${chapter.number}: ${chapter.title}`);
      }
    }

    console.log('\n✅ Complete metadata added successfully!');
    console.log('\n📊 Structure Summary:');
    console.log('Part 1: The Cosmic Tapestry (4 chapters)');
    console.log('Part 2: The Sovereign Self (4 chapters)');
    console.log('Part 3: Architecting Reality (4 chapters)');
    console.log('Part 4: Embodying Sovereignty (3 sections)');
    console.log('Part 5: Appendices (7 sections)');
    console.log('Part 6: Core Themes (1 section)');
    console.log('\nTotal: 23 sections');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

addCompleteMetadata();
