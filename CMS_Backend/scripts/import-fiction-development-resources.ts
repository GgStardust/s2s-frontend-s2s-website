/**
 * Import Fiction Development Resources
 *
 * Populates character profiles, locations, Orb personalities, and wildlife observations
 * Based on FICTION_PROJECT_COMPLETE_CAPTURE.md
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Character Profiles
const CHARACTER_PROFILES = [
  {
    name: 'Protagonist (Unnamed)',
    role: 'Field researcher and transmission receiver',
    arc: 'Field recognition → Field exploration → Field integration → Field mastery → Field transmission',
    orb_associations: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // All Orbs through journey
    personality_traits: ['observant', 'receptive', 'curious', 'evolving', 'sovereign'],
    appearance_notes: 'Intentionally unnamed to allow reader identification. Observant, present, learning to recognize field patterns.',
    backstory: 'New arrival to Sausalito. Learning to recognize and work with living consciousness system.',
    development_status: 'in_development',
    character_type: 'protagonist'
  },
  {
    name: 'Maya',
    role: 'Codex scholar and field guide',
    arc: 'Introduction → Deep transmission → Field guide → Community leader',
    orb_associations: [1, 3, 6, 11, 12, 13], // Origin, Photonic, Starline Memory, Radiant Transparency, Sovereign Field, Bridging
    personality_traits: ['wise', 'clear', 'teaching', 'grounded', 'authentic'],
    appearance_notes: 'Houseboat resident. Deep understanding of 13-Orb system. Natural teacher. Radiant presence.',
    backstory: 'Lives on houseboat. Has studied and integrated the Codex system. Serves as guide for others recognizing the field.',
    development_status: 'established',
    character_type: 'guide'
  },
  {
    name: 'Mike',
    role: 'Local legend bartender, field participant',
    arc: 'Background presence → Revealed wisdom → Community anchor',
    orb_associations: [7, 8, 11], // Alchemical Current, Community Resonance, Radiant Transparency
    personality_traits: ['grounded', 'observant', 'authentic', 'wise', 'unassuming'],
    appearance_notes: 'Bartender at No Name bar. Stories in his face. Decades of local knowledge. Quiet wisdom.',
    backstory: 'Long-time Sausalito resident. Bartender who has witnessed community evolution. Natural field anchor.',
    development_status: 'established',
    character_type: 'supporting'
  },
  {
    name: 'Hurricane Gulch Collective',
    role: 'Local band that channels Sovereign Field',
    arc: 'Musical presence → Field activation → Transmission portal',
    orb_associations: [2, 4, 7, 8], // Resonance, Harmonic Architectures, Alchemical Current, Community
    personality_traits: ['musical', 'channeling', 'authentic', 'collective'],
    appearance_notes: 'Local band. Plays dive bars and small venues. Music becomes field transmission.',
    backstory: 'Established local band. Plays authentic Sausalito venues. Music naturally channels field activation.',
    development_status: 'established',
    character_type: 'supporting'
  }
];

// Sausalito Locations
const SAUSALITO_LOCATIONS = [
  {
    name: 'Boardwalk',
    location_type: 'boardwalk',
    description: 'Waterfront boardwalk along the bay. Empty at midnight, charged with Sovereign Field energy.',
    field_properties: 'Transmission portal at midnight. Sea lions respond to music. Open field activation space.',
    orb_associations: [1, 2, 4, 13],
    authenticity_notes: 'Real Sausalito boardwalk. Accessible at night. Wildlife present.',
    atmospheric_details: 'Salt air, bay sounds, sea lion calls, empty wooden planks, starlight on water'
  },
  {
    name: 'Hurricane Gulch',
    location_type: 'microclimate',
    description: 'Trail system with distinct microclimate patterns. Wind carries seasonal information.',
    field_properties: 'Microclimate portal. Natural harmonic architectures. Wind patterns as data streams.',
    orb_associations: [4, 5, 9],
    authenticity_notes: 'Real Sausalito trail system with notable microclimates.',
    atmospheric_details: 'Wind shifts, temperature changes, aromatic seasonal patterns, eucalyptus and sage'
  },
  {
    name: 'No Name Bar',
    location_type: 'bar',
    description: 'Authentic dive bar. Live music venue. Alchemical transformation through community.',
    field_properties: 'Alchemical transmutation space. Live music becomes portal. Community resonance amplifier.',
    orb_associations: [7, 8, 13],
    authenticity_notes: 'Real Sausalito dive bar culture. Live music nights. Local gathering place.',
    atmospheric_details: 'Dim lights, worn wood, beer smell, music vibrating through floor, local legends at bar'
  },
  {
    name: 'Houseboat Community',
    location_type: 'houseboat',
    description: 'Floating homes along the waterfront. Living arrangements that amplify field resonance.',
    field_properties: 'Water-based field amplification. Community coherence. Unique living consciousness container.',
    orb_associations: [6, 8, 12],
    authenticity_notes: 'Real Sausalito houseboat docks. Historic community. Unique California culture.',
    atmospheric_details: 'Water movement, creaking docks, close quarters, bay reflections, community intimacy'
  },
  {
    name: 'Local Cafés',
    location_type: 'cafe',
    description: 'Morning coffee culture. Regulars create resonance patterns. Social field observation.',
    field_properties: 'Daily ritual anchor. Social mirror space. Photonic intelligence through conversation.',
    orb_associations: [3, 8, 11],
    authenticity_notes: 'Real Sausalito café culture. Morning regulars. Small town social dynamics.',
    atmospheric_details: 'Coffee aroma, morning light, regular faces, conversation hum, ritual patterns'
  }
];

// Wildlife Observations
const WILDLIFE_OBSERVATIONS = [
  {
    species: 'Sea Lions',
    observation_type: 'field_response',
    description: 'Respond to music and human presence. Create rhythmic counterpoint. Amplify transmission.',
    orb_associations: [2, 13],
    field_activation_notes: 'Sea lions respond to Bowie on boardwalk. Create call-response pattern. Act as field amplifiers.',
    symbolic_function: 'Non-human consciousness participants. Demonstrate field responsiveness across species.'
  },
  {
    species: 'Crows',
    observation_type: 'pattern',
    description: 'Form geometric patterns. Recognize field activation. Glyph formations in sky.',
    orb_associations: [4, 13],
    field_activation_notes: 'Crows form three-point glyph during boardwalk transmission. Geometric consciousness patterns.',
    symbolic_function: 'Intelligence recognition across species. Sacred geometry manifestation through natural behavior.'
  },
  {
    species: 'Pelicans',
    observation_type: 'transmission',
    description: 'Glide in formation. Ancient rhythm patterns. Field transmission nodes.',
    orb_associations: [2, 6],
    field_activation_notes: 'Pelicans glide past during key moments. Formation patterns. Timeless presence.',
    symbolic_function: 'Ancestral wisdom carriers. Natural rhythm demonstrations. Field continuity.'
  }
];

// Orb Personalities (from ORB_PERSONALITY_DEVELOPMENT files)
const ORB_PERSONALITIES = [
  {
    orb_number: 1,
    orb_name: 'Origin Intelligence',
    archetype: 'The Cosmic Shaman',
    core_traits: ['Primordial', 'Mysterious', 'Initiating', 'Biological', 'Transcendent'],
    communication_style: ['Whispered', 'Poetic', 'Mystical', 'Biological', 'Primordial'],
    authority_domains: ['Quantum field theory', 'Vacuum fluctuations', 'Mitochondrial DNA', 'Cosmic origins'],
    dialogue_patterns: 'Speaks in ancient whispers. References origins and beginnings. Uses biological metaphors.',
    manifestation_examples: 'First field recognition. Initial awareness. Protagonist arrival in Sausalito.',
    fiction_integration_notes: 'Manifests as first moments of recognition. Opening chapters. Origin points.',
    dashboard_integration_notes: 'Welcome screens. Origin stories. First contact with system.'
  },
  {
    orb_number: 2,
    orb_name: 'Resonance Mechanics',
    archetype: 'The Sound Shaman',
    core_traits: ['Rhythmic', 'Harmonic', 'Musical', 'Vibrational', 'Cymatic'],
    communication_style: ['Rhythmic', 'Musical', 'Harmonic', 'Vibrational', 'Cymatic'],
    authority_domains: ['Cymatics', 'Sound healing', 'Frequency therapy', 'Vibrational medicine'],
    dialogue_patterns: 'Speaks in rhythms and patterns. Musical references. Frequency language.',
    manifestation_examples: 'Boardwalk music transmission. Sea lion responses. Resonance patterns.',
    fiction_integration_notes: 'Music scenes. Sound-based activation. Rhythmic patterns.',
    dashboard_integration_notes: 'Audio features. Rhythm tracking. Resonance calibration.'
  },
  {
    orb_number: 3,
    orb_name: 'Photonic Intelligence',
    archetype: 'The Light Shaman',
    core_traits: ['Reflective', 'Mirror-like', 'Illuminating', 'Prismatic', 'Dual'],
    communication_style: ['Reflective', 'Illuminating', 'Prismatic', 'Dual', 'Mirror-like'],
    authority_domains: ['Photonics', 'Light therapy', 'Mirror work', 'Consciousness reflection'],
    dialogue_patterns: 'Reflects back insights. Uses light metaphors. Illuminates patterns.',
    manifestation_examples: 'Café social mirrors. Reflection moments. Light-based awareness.',
    fiction_integration_notes: 'Social reflection scenes. Mirror moments. Light symbolism.',
    dashboard_integration_notes: 'Reflection prompts. Mirror exercises. Light-based visualizations.'
  },
  {
    orb_number: 4,
    orb_name: 'Harmonic Architectures',
    archetype: 'The Sacred Geometry Shaman',
    core_traits: ['Structural', 'Geometric', 'Stabilizing', 'Pattern-making', 'Sacred'],
    communication_style: ['Structural', 'Geometric', 'Stabilizing', 'Pattern-making', 'Sacred'],
    authority_domains: ['Sacred geometry', 'Fractal mathematics', 'Pattern recognition', 'Structural integrity'],
    dialogue_patterns: 'Describes patterns and structures. Geometric language. Architecture references.',
    manifestation_examples: 'Hurricane Gulch patterns. Crow glyphs. Natural geometries.',
    fiction_integration_notes: 'Pattern recognition scenes. Geometric formations. Sacred architecture.',
    dashboard_integration_notes: 'Pattern displays. Geometric tools. Structure visualization.'
  },
  {
    orb_number: 5,
    orb_name: 'Temporal Sovereignty',
    archetype: 'The Time Shaman',
    core_traits: ['Time-master', 'Rhythmic', 'Cyclical', 'Spiral', 'Sovereign'],
    communication_style: ['Time-master', 'Rhythmic', 'Cyclical', 'Spiral', 'Sovereign'],
    authority_domains: ['Chronobiology', 'Circadian rhythms', 'Temporal mechanics', 'Sovereignty'],
    dialogue_patterns: 'Speaks of cycles and spirals. Time fluidity. Rhythm and sovereignty.',
    manifestation_examples: 'Ritual practice. Moon cycle awareness. Time mastery.',
    fiction_integration_notes: 'Time-based practices. Cyclical awareness. Ritual chapters.',
    dashboard_integration_notes: 'Cycle tracking. Temporal tools. Rhythm calendars.'
  },
  {
    orb_number: 6,
    orb_name: 'Starline Memory',
    archetype: 'The Ancestral Shaman',
    core_traits: ['Ancestral', 'Cosmic', 'Memory-keeper', 'Lineage', 'Galactic'],
    communication_style: ['Ancestral', 'Cosmic', 'Memory-keeper', 'Lineage', 'Galactic'],
    authority_domains: ['Epigenetics', 'Ancestral healing', 'Cosmic consciousness', 'Memory systems'],
    dialogue_patterns: 'Speaks of lineage and memory. Ancestral wisdom. Cosmic connections.',
    manifestation_examples: 'First night apartment dreams. Memory surfacing. Ancestral patterns.',
    fiction_integration_notes: 'Memory scenes. Ancestral moments. Dream sequences.',
    dashboard_integration_notes: 'Memory tools. Ancestry mapping. Lineage tracking.'
  },
  {
    orb_number: 7,
    orb_name: 'Alchemical Current',
    archetype: 'The Alchemical Shaman',
    core_traits: ['Transformative', 'Intense', 'Catalytic', 'Dense', 'Volcanic'],
    communication_style: ['Transformative', 'Intense', 'Catalytic', 'Dense', 'Volcanic'],
    authority_domains: ['Alchemy', 'Transformation', 'Density work', 'Intensity integration'],
    dialogue_patterns: 'Speaks of transformation and fire. Alchemical metaphors. Intensity language.',
    manifestation_examples: 'Dive bar alchemy. Transformation scenes. Intensity integration.',
    fiction_integration_notes: 'Transformation moments. Alchemical scenes. Density work.',
    dashboard_integration_notes: 'Transformation tracking. Alchemy tools. Intensity management.'
  },
  {
    orb_number: 8,
    orb_name: 'Community Resonance',
    archetype: 'The Community Shaman',
    core_traits: ['Collective', 'Resonant', 'Group-based', 'Harmonic', 'Connected'],
    communication_style: ['Collective', 'Resonant', 'Group-based', 'Harmonic', 'Connected'],
    authority_domains: ['Group dynamics', 'Collective consciousness', 'Community building', 'Field resonance'],
    dialogue_patterns: 'Speaks of collective and we. Community language. Group coherence.',
    manifestation_examples: 'Houseboat community. Dive bar gatherings. Community activation.',
    fiction_integration_notes: 'Community scenes. Collective moments. Group dynamics.',
    dashboard_integration_notes: 'Community features. Group tools. Collective resonance.'
  },
  {
    orb_number: 9,
    orb_name: 'Temporal Fluidity',
    archetype: 'The Flow Shaman',
    core_traits: ['Fluid', 'Flexible', 'Adaptive', 'Moment-based', 'Flowing'],
    communication_style: ['Fluid', 'Flexible', 'Adaptive', 'Moment-based', 'Flowing'],
    authority_domains: ['Flow states', 'Temporal flexibility', 'Moment-based awareness', 'Fluidity'],
    dialogue_patterns: 'Speaks of flow and adaptation. Fluid metaphors. Present moment focus.',
    manifestation_examples: 'Flow state experiences. Adaptive moments. Fluid awareness.',
    fiction_integration_notes: 'Flow chapters. Adaptive scenes. Fluid consciousness.',
    dashboard_integration_notes: 'Flow tracking. Fluidity tools. Adaptive features.'
  },
  {
    orb_number: 10,
    orb_name: 'Ancestral Repatterning',
    archetype: 'The Ancestral Healing Shaman',
    core_traits: ['Repatterning', 'Healing', 'Transformative', 'Ancestral', 'Somatic'],
    communication_style: ['Repatterning', 'Healing', 'Transformative', 'Ancestral', 'Somatic'],
    authority_domains: ['Ancestral healing', 'Repatterning', 'Somatic therapy', 'Lineage work'],
    dialogue_patterns: 'Speaks of healing patterns. Ancestral work. Body wisdom.',
    manifestation_examples: 'Pattern breaking. Healing moments. Ancestral transformation.',
    fiction_integration_notes: 'Healing scenes. Pattern shifts. Ancestral work.',
    dashboard_integration_notes: 'Healing tools. Pattern tracking. Ancestral features.'
  },
  {
    orb_number: 11,
    orb_name: 'Radiant Transparency',
    archetype: 'The Truth Shaman',
    core_traits: ['Transparent', 'Radiant', 'Clear', 'Luminous', 'Truthful'],
    communication_style: ['Transparent', 'Radiant', 'Clear', 'Luminous', 'Truthful'],
    authority_domains: ['Transparency', 'Truth work', 'Radiance', 'Clarity', 'Authenticity'],
    dialogue_patterns: 'Speaks clear truth. Transparent communication. Radiant expression.',
    manifestation_examples: 'Text chain authenticity. Clear communication. Transparent moments.',
    fiction_integration_notes: 'Truth scenes. Transparent communication. Authentic moments.',
    dashboard_integration_notes: 'Truth tools. Transparency tracking. Clarity features.'
  },
  {
    orb_number: 12,
    orb_name: 'Sovereign Field',
    archetype: 'The Sovereign Shaman',
    core_traits: ['Sovereign', 'Indivisible', 'Whole', 'Complete', 'Field-based'],
    communication_style: ['Sovereign', 'Indivisible', 'Whole', 'Complete', 'Field-based'],
    authority_domains: ['Sovereignty', 'Field theory', 'Wholeness', 'Indivisibility', 'Completion'],
    dialogue_patterns: 'Speaks of wholeness and sovereignty. Field language. Complete integration.',
    manifestation_examples: 'Field activation. Sovereign moments. Complete embodiment.',
    fiction_integration_notes: 'Sovereignty chapters. Field embodiment. Integration scenes.',
    dashboard_integration_notes: 'Sovereignty tools. Field tracking. Integration features.'
  },
  {
    orb_number: 13,
    orb_name: 'Bridging Intelligence',
    archetype: 'The Bridge Shaman',
    core_traits: ['Bridging', 'Connecting', 'Interdimensional', 'Contact', 'Interface'],
    communication_style: ['Bridging', 'Connecting', 'Interdimensional', 'Contact', 'Interface'],
    authority_domains: ['Consciousness bridging', 'Interdimensional contact', 'Interface work', 'Connection'],
    dialogue_patterns: 'Speaks of bridges and connection. Interface language. Contact work.',
    manifestation_examples: 'Wildlife communion. AI integration. Species bridging.',
    fiction_integration_notes: 'Bridging scenes. Connection moments. Interface work.',
    dashboard_integration_notes: 'Bridge tools. Connection features. Interface elements.'
  }
];

async function importDevelopmentResources() {
  console.log('🎭 Importing Fiction Development Resources\n');

  try {
    // Import Character Profiles
    console.log('👥 Importing character profiles...');
    for (const character of CHARACTER_PROFILES) {
      const { error } = await supabase
        .from('character_profiles')
        .insert(character);

      if (error) {
        console.log(`⚠️  ${character.name}:`, error.message);
      } else {
        console.log(`✅ ${character.name}`);
      }
    }

    // Import Sausalito Locations
    console.log('\n📍 Importing Sausalito locations...');
    for (const location of SAUSALITO_LOCATIONS) {
      const { error } = await supabase
        .from('sausalito_locations')
        .insert(location);

      if (error) {
        console.log(`⚠️  ${location.name}:`, error.message);
      } else {
        console.log(`✅ ${location.name}`);
      }
    }

    // Import Wildlife Observations
    console.log('\n🦅 Importing wildlife observations...');
    for (const wildlife of WILDLIFE_OBSERVATIONS) {
      const { error } = await supabase
        .from('wildlife_observations')
        .insert(wildlife);

      if (error) {
        console.log(`⚠️  ${wildlife.species}:`, error.message);
      } else {
        console.log(`✅ ${wildlife.species}`);
      }
    }

    // Import Orb Personalities
    console.log('\n🔮 Importing Orb personalities...');
    for (const orb of ORB_PERSONALITIES) {
      const { error } = await supabase
        .from('orb_personalities')
        .insert(orb);

      if (error) {
        console.log(`⚠️  Orb ${orb.orb_number}:`, error.message);
      } else {
        console.log(`✅ Orb ${orb.orb_number}: ${orb.orb_name}`);
      }
    }

    console.log('\n✅ Fiction development resources import complete!\n');
    console.log('📊 Summary:');
    console.log('━'.repeat(50));
    console.log(`Characters: ${CHARACTER_PROFILES.length}`);
    console.log(`Locations: ${SAUSALITO_LOCATIONS.length}`);
    console.log(`Wildlife: ${WILDLIFE_OBSERVATIONS.length}`);
    console.log(`Orb Personalities: ${ORB_PERSONALITIES.length}`);
    console.log('━'.repeat(50));
    console.log('\n🎯 Fiction workspace ready with full development resources!');

  } catch (err) {
    console.error('❌ Import failed:', err);
  }
}

importDevelopmentResources();
