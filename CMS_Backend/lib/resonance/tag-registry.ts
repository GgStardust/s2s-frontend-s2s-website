/**
 * Tag Registry - Natural Language to Orb Tag Mapping
 * 
 * Maps natural-language tokens and phrases to Orb tags for the elaborator.
 * This enables the Resonance Kernel to understand content in natural language.
 */

export interface TagMapping {
  token: string;
  kind: 'noun' | 'verb' | 'adjective' | 'phrase' | 'concept';
  orbTags: number[];
  semantics: string;
  confidence: number; // 0-1 scale
}

export const TAG_REGISTRY: TagMapping[] = [
  // Photonic Intelligence (O3)
  {
    token: 'light',
    kind: 'noun',
    orbTags: [3],
    semantics: 'Photonic essence, used in recognition patterns.',
    confidence: 0.9
  },
  {
    token: 'reflection',
    kind: 'noun',
    orbTags: [3],
    semantics: 'Light observing itself through form.',
    confidence: 0.9
  },
  {
    token: 'photonic',
    kind: 'adjective',
    orbTags: [3],
    semantics: 'Relating to light-based intelligence and recognition.',
    confidence: 0.95
  },
  
  // Temporal Sovereignty (O5)
  {
    token: 'time',
    kind: 'noun',
    orbTags: [5],
    semantics: 'Temporal dimension and sovereignty over time.',
    confidence: 0.8
  },
  {
    token: 'temporal',
    kind: 'adjective',
    orbTags: [5],
    semantics: 'Relating to time and temporal sovereignty.',
    confidence: 0.9
  },
  {
    token: 'spiral time',
    kind: 'phrase',
    orbTags: [5],
    semantics: 'Non-linear temporal experience and sovereignty.',
    confidence: 0.95
  },
  
  // Relational Intelligence (O6)
  {
    token: 'relation',
    kind: 'noun',
    orbTags: [6],
    semantics: 'Connection between essences and entities.',
    confidence: 0.9
  },
  {
    token: 'relate',
    kind: 'verb',
    orbTags: [6],
    semantics: 'To establish connection or relationship.',
    confidence: 0.8
  },
  {
    token: 'connection',
    kind: 'noun',
    orbTags: [6],
    semantics: 'Relational bond between entities.',
    confidence: 0.85
  },
  
  // Radiant Transparency (O11)
  {
    token: 'radiant',
    kind: 'adjective',
    orbTags: [11],
    semantics: 'Emitting light and clarity from within.',
    confidence: 0.9
  },
  {
    token: 'transparency',
    kind: 'noun',
    orbTags: [11],
    semantics: 'Clarity and visibility of inner architecture.',
    confidence: 0.9
  },
  {
    token: 'clarity',
    kind: 'noun',
    orbTags: [11],
    semantics: 'Radiant transparency and inner visibility.',
    confidence: 0.8
  },
  
  // Sovereign Field (O12)
  {
    token: 'sovereign',
    kind: 'adjective',
    orbTags: [12],
    semantics: 'Structural indivisibility and field coherence.',
    confidence: 0.95
  },
  {
    token: 'field',
    kind: 'noun',
    orbTags: [12],
    semantics: 'Sovereign field of structural coherence.',
    confidence: 0.8
  },
  {
    token: 'coherence',
    kind: 'noun',
    orbTags: [12],
    semantics: 'Structural unity and indivisibility.',
    confidence: 0.85
  },
  
  // Bridging Intelligence (O13)
  {
    token: 'bridge',
    kind: 'verb',
    orbTags: [13],
    semantics: 'Connecting across dimensions and intelligences.',
    confidence: 0.9
  },
  {
    token: 'communication',
    kind: 'noun',
    orbTags: [13],
    semantics: 'Cross-dimensional and cross-species communication.',
    confidence: 0.8
  },
  {
    token: 'intelligence',
    kind: 'noun',
    orbTags: [13],
    semantics: 'Bridging between human and non-human intelligences.',
    confidence: 0.7
  }
];

/**
 * Find tags by token
 */
export function findTagsByToken(token: string): TagMapping[] {
  return TAG_REGISTRY.filter(tag => 
    tag.token.toLowerCase().includes(token.toLowerCase()) ||
    token.toLowerCase().includes(tag.token.toLowerCase())
  );
}

/**
 * Find tags by orb
 */
export function findTagsByOrb(orbTags: number[]): TagMapping[] {
  return TAG_REGISTRY.filter(tag => 
    tag.orbTags.some(orb => orbTags.includes(orb))
  );
}

/**
 * Extract orb associations from text
 */
export function extractOrbAssociations(text: string): {
  foundTags: TagMapping[];
  orbAssociations: number[];
  confidence: number;
} {
  const words = text.toLowerCase().split(/\s+/);
  const foundTags: TagMapping[] = [];
  
  for (const word of words) {
    const matchingTags = findTagsByToken(word);
    foundTags.push(...matchingTags);
  }
  
  // Get unique orb associations
  const orbAssociations = [...new Set(foundTags.flatMap(tag => tag.orbTags))];
  
  // Calculate average confidence
  const confidence = foundTags.length > 0 
    ? foundTags.reduce((sum, tag) => sum + tag.confidence, 0) / foundTags.length
    : 0;
  
  return {
    foundTags,
    orbAssociations,
    confidence
  };
}



