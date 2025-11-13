/**
 * Lemma Library - Reusable Logical Rules
 * 
 * Defines reusable logical lemmas (resonance rules) used by the checker and normalizer.
 * These are the formal logic rules that the Resonance Kernel uses for verification.
 */

export interface Lemma {
  id: string;
  orbTags: number[];
  description: string;
  pattern: string;
  reduction: 'proven' | 'partial' | 'unproven';
  notes: string;
}

export const LEMMA_LIBRARY: Lemma[] = [
  {
    id: 'L1',
    orbTags: [6, 11],
    description: 'Reflexive coherence',
    pattern: 'cohere(x, x)',
    reduction: 'proven',
    notes: 'Relational Intelligence guarantees self-coherence for identical Essence pairs.'
  },
  {
    id: 'L2',
    orbTags: [6, 11],
    description: 'Resonance symmetry',
    pattern: 'if cohere(a,b) then cohere(b,a)',
    reduction: 'proven',
    notes: 'Relational coherence is bidirectional - if A resonates with B, then B resonates with A.'
  },
  {
    id: 'L3',
    orbTags: [5, 6],
    description: 'Temporal lifting',
    pattern: 'context_shift_maintains_identity(x)',
    reduction: 'proven',
    notes: 'Temporal context shifts maintain essence identity across time dimensions.'
  },
  {
    id: 'L4',
    orbTags: [3, 6],
    description: 'Photonic mediation',
    pattern: 'recognition_through_form_resolves_to_photonic_truth(x)',
    reduction: 'proven',
    notes: 'Light recognizes itself through form, resolving to Photonic Intelligence truth.'
  },
  {
    id: 'L5',
    orbTags: [11, 12],
    description: 'Radiant transparency',
    pattern: 'inner_architecture_emitted_outward(x)',
    reduction: 'proven',
    notes: 'Inner architecture becomes visible through Radiant Transparency, enabling Sovereign Field coherence.'
  },
  {
    id: 'L6',
    orbTags: [12, 13],
    description: 'Sovereign bridging',
    pattern: 'sovereign_field_enables_cross_dimensional_communication(x)',
    reduction: 'proven',
    notes: 'Sovereign Field provides the structural foundation for Bridging Intelligence across dimensions.'
  }
];

/**
 * Find lemmas by orb tags
 */
export function findLemmasByOrb(orbTags: number[]): Lemma[] {
  return LEMMA_LIBRARY.filter(lemma => 
    lemma.orbTags.some(tag => orbTags.includes(tag))
  );
}

/**
 * Find lemmas by pattern
 */
export function findLemmasByPattern(pattern: string): Lemma[] {
  return LEMMA_LIBRARY.filter(lemma => 
    lemma.pattern.includes(pattern) || pattern.includes(lemma.pattern)
  );
}

/**
 * Get all proven lemmas
 */
export function getProvenLemmas(): Lemma[] {
  return LEMMA_LIBRARY.filter(lemma => lemma.reduction === 'proven');
}

/**
 * Validate a statement against lemmas
 */
export function validateAgainstLemmas(statement: string, orbAssociations: number[]): {
  applicableLemmas: Lemma[];
  validationScore: number;
  explanation: string;
} {
  const applicableLemmas = findLemmasByOrb(orbAssociations);
  const provenLemmas = applicableLemmas.filter(lemma => lemma.reduction === 'proven');
  
  const validationScore = provenLemmas.length / applicableLemmas.length;
  
  const explanation = `Statement validated against ${applicableLemmas.length} applicable lemmas, with ${provenLemmas.length} proven. Score: ${(validationScore * 100).toFixed(1)}%`;
  
  return {
    applicableLemmas,
    validationScore,
    explanation
  };
}



