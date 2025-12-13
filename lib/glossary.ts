/**
 * Glossary terms and definitions
 * Used for inline term linking and the glossary page
 */

export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Sovereign Field',
    slug: 'sovereign-field',
    definition: 'Sovereign field is the self-aware totality of intelligence in form. It is the integrated atmosphere where every system organizes through resonance rather than control. It represents the quantum of coherence: the point at which separation dissolves into participatory awareness.',
  },
  {
    term: 'Constellation of Intelligences',
    slug: 'constellation-of-intelligences',
    definition: 'Direct expressions of lived intelligence that function as movements within awareness. They are the fundamental gestures of sovereignty: the ways awareness organizes itself when aligned with truth rather than survival. Each intelligence is a movement you have already experienced, even if unconsciously.',
  },
  {
    term: 'Coherence',
    slug: 'coherence',
    definition: 'Measurable stability across spatial, temporal, and contextual dimensions. High coherence means system components maintain alignment and structural integrity over time. The condition of coherence itself: the unified frequency through which every other orb expresses.',
  },
  {
    term: 'Recognition',
    slug: 'recognition',
    definition: 'Recognition happens through direct experience, not conceptual understanding. When consciousness recognizes itself as the source rather than the competitor, the gap dissolves. It is the process of consciousness experiencing itself as cosmic intelligence.',
  },
  {
    term: 'Origin Intelligence',
    slug: 'origin-intelligence',
    definition: 'Origin Intelligence pulses through your chest as you breathe. It thrums in the mitochondria of every cell, the cosmic inheritance alive in your blood. This is the living intelligence that first inhabited form, the primordial current that courses through every heartbeat, every neural spark, every moment of awareness.',
  },
  {
    term: 'Cosmological Framework',
    slug: 'cosmological-framework',
    definition: 'Stardust to Sovereignty (S2S) is the interpretive and cosmological framework that translates RBI\'s geometric readings into relational and narrative meaning through Orbs, Undercurrents, and Special Domains.',
  },
  {
    term: 'Fragmentation',
    slug: 'fragmentation',
    definition: 'The opposite of coherence. When system components lose alignment, structural integrity degrades, and separation replaces integration.',
  },
  {
    term: 'Temporal Awareness',
    slug: 'temporal-awareness',
    definition: 'Freedom and fluidity within nonlinear temporal perception. The capacity to navigate time as a tool rather than a container.',
  },
  {
    term: 'Body Translates Signal',
    slug: 'body-translates-signal',
    definition: 'The body functions as an advanced biological interface for signal, perception, and intelligence. It receives cosmic and photonic signals and translates them into biological experience.',
  },
  {
    term: 'Perception Organizes Identity',
    slug: 'perception-organizes-identity',
    definition: 'When perception, body signal, memory, and temporal awareness operate in alignment, identity stabilizes and becomes coherent rather than fragmented.',
  },
  {
    term: 'Sovereignty',
    slug: 'sovereignty',
    definition: 'Sovereignty is an active engagement with the universal field of consciousness, shaped by resonance mechanics and the natural laws of energy and perception. Sovereignty emerges as a native condition of awareness when the design is recognized and activated.',
  },
  {
    term: 'Consciousness as Structure',
    slug: 'consciousness-as-structure',
    definition: 'Consciousness behaves as structure. It forms patterns with precision and organizes experience through movements that can be perceived and understood. These movements express through instinct, emotional intelligence, relational dynamics, creativity, and decision making.',
  },
];

/**
 * Get a glossary term by its term name (case-insensitive)
 */
export function getGlossaryTerm(termName: string): GlossaryTerm | undefined {
  return glossaryTerms.find(
    (term) => term.term.toLowerCase() === termName.toLowerCase()
  );
}

/**
 * Get a glossary term by its slug
 */
export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((term) => term.slug === slug);
}

/**
 * Create a slug from a term name
 */
export function createSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
