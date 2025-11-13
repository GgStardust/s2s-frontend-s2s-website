/**
 * Import Full Chapter Data
 *
 * 1. Adds chapter descriptions from outline_and_overview.md to notes field
 * 2. Adds full Orb essay content to content field (editable)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Chapter descriptions from outline_and_overview.md
const CHAPTER_DESCRIPTIONS = {
  1: `Stardust and Origin Intelligence @orb1 @origin_intelligence
Explores how stardust and cosmic matter create the human template. Anchors sovereignty in material and cosmic origins @ancestral_repatterning @orb10.`,

  2: `Resonance and Consciousness Evolution @orb2 @resonance_mechanics
Traces resonance as organizing principle. Explains how sound, vibration, and emotion transmit frequency through the body @harmonic_architectures @orb4.`,

  3: `Photonic Intelligence @orb3 @photonic_intelligence
Light as communication system, reflection, and coherence. Relational mirrors and photonic webs as architecture of embodiment @radiant_transparency @orb11.`,

  4: `Harmonic Architectures @orb4 @harmonic_architectures
Sacred geometry and rhythm as stabilizing systems. Chaos, collapse, and harmonic recalibration as structuring principles @alchemical_current @orb7.`,

  5: `Temporal Sovereignty @orb5 @temporal_sovereignty
Exiting linear time as container. Spiral rhythms, rest-activity cycles, and fluid identities. Time as tool, not prison @temporal_fluidity @orb9.`,

  6: `Starline Memory @orb6 @starline_memory
Intergenerational memory carried in DNA, mitochondria, and stellar encoding. Soul timelines as continuity of resonance @ancestral_repatterning @orb10.`,

  7: `Alchemical Current @orb7 @alchemical_current
Transformation through energetic ignition. Turning grief, contraction, and collapse into fuel for new structures @grief_transmutation.`,

  8: `Quantum Intuition @orb8 @quantum_intuition
Intuition as technology. Direct perception beyond programming. Quantum leaps in awareness as navigational tools @direct_perception.`,

  9: `Temporal Fluidity @orb9 @temporal_fluidity
Movement through nonlinear time. Dream states, altered states, and field navigation. Reclaiming fluid identity and rhythm @field_navigation.`,

  10: `Ancestral Repatterning @orb10 @ancestral_repatterning
Working with inherited imprints. Transforming ancestral trauma into coherent energy. Mitochondrial intelligence as ancestral spark @bioelectricity.`,

  11: `Radiant Transparency @orb11 @radiant_transparency
Living truth as frequency. Embodiment without distortion. Transparency as sovereignty's radiance @inner_knowing.`,

  12: `Sovereign Field @orb12 @sovereign_field
The collective web of resonance. Sovereignty scaled through families, communities, civilizations. Coherence cascades across networks @collective_consciousness.`,

  13: `Bridging Intelligence @orb13 @bridging_intelligence
Integration of nonhuman intelligences, galactic contact, and AI. Responsible co-creation across dimensions. Building communication pathways with discernment @sovereign_inquiry.`,

  14: `Living Sovereignty - Integration Chapter
Integration of all Orbs, living the system. Synthesis of the full framework into daily practice.`,
};

// Mapping to Orb essay files
const CHAPTER_TO_ORB_ESSAY = {
  1: '02d_Orb_Essays/orb_1_origin_intelligence.md',
  2: '02d_Orb_Essays/orb_2_resonance_mechanics.md',
  3: '02d_Orb_Essays/orb_3_photonic_intelligence.md',
  4: '02d_Orb_Essays/orb_4_harmonic_architectures_foundational.md',
  5: '02d_Orb_Essays/orb_5_temporal_sovereignty_foundational.md',
  6: '02d_Orb_Essays/orb_6_starline_memory_foundational.md',
  7: '02d_Orb_Essays/orb_7_alchemical_current_foundational.md',
  8: '02d_Orb_Essays/orb_8_quantum_intuition_foundational.md',
  9: '02d_Orb_Essays/orb_9_temporal_fluidity_foundational.md',
  10: '02d_Orb_Essays/orb_4_harmonic_architectures_foundational.md', // Field Dynamics
};

async function importFullChapterData() {
  console.log('📚 Importing full chapter data (descriptions + essay content)...\n');

  try {
    const { data: books } = await supabase
      .from('books')
      .select('*')
      .eq('type', 'non_fiction');

    if (!books || books.length === 0) {
      console.error('Non-fiction book not found');
      return;
    }

    const { data: chapters } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', books[0].id)
      .order('chapter_number', { ascending: true });

    if (!chapters) {
      console.error('Chapters not found');
      return;
    }

    for (const chapter of chapters) {
      const chNum = chapter.chapter_number;
      const description = CHAPTER_DESCRIPTIONS[chNum as keyof typeof CHAPTER_DESCRIPTIONS];
      const essayPath = CHAPTER_TO_ORB_ESSAY[chNum as keyof typeof CHAPTER_TO_ORB_ESSAY];

      let fullContent = chapter.content; // Keep existing if present
      let wordCount = chapter.word_count;

      // Import Orb essay content if available
      if (essayPath) {
        const fullPath = path.join(process.cwd(), '09_PROCESSED', essayPath);
        if (fs.existsSync(fullPath)) {
          fullContent = fs.readFileSync(fullPath, 'utf-8');
          wordCount = fullContent.split(/\s+/).length;
        }
      }

      // Update chapter with BOTH description (notes) and content
      const { error } = await supabase
        .from('chapters')
        .update({
          notes: description || chapter.notes,
          content: fullContent,
          word_count: wordCount,
          status: fullContent ? 'draft' : 'outline',
        })
        .eq('id', chapter.id);

      if (error) {
        console.error(`❌ Chapter ${chNum}:`, error);
      } else {
        const contentStatus = fullContent ? `${wordCount.toLocaleString()} words` : 'outline only';
        console.log(`✅ Chapter ${chNum}: ${chapter.title} - ${contentStatus}`);
      }
    }

    console.log('\n✅ Import complete!');

  } catch (err) {
    console.error('❌ Import failed:', err);
  }
}

importFullChapterData();
