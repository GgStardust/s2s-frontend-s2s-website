/**
 * Tag Validator
 * Validates tags against TAG_REGISTRY.md
 */

// Extracted from TAG_REGISTRY.md - Core System Tags
const CORE_TAGS = [
  '@orb1', '@orb2', '@orb3', '@orb4', '@orb5', '@orb6', '@orb7', '@orb8', '@orb9', '@orb10', '@orb11', '@orb12', '@orb13',
  '@satellite_primordial_creativity',
  '@satellite_creative_infrastructure',
  '@satellite_skeletal_memory',
  '@satellite_nature_attunement',
  '@satellite_dream_navigation',
  '@domain_music_field',
  '@domain_galactic_quantum',
  '@domain_relational_systems',
  '@domain_codex_architecture',
  '@domain_scrollstream',
  '@domain_consulting_system',
];

// Biological Technology Tags
const BIOLOGICAL_TAGS = [
  '@bioelectricity',
  '@mitochondria',
  '@dna',
  '@vagus_nerve',
  '@biophotons',
  '@fascia',
  '@bone_memory',
];

// Energetic Field Tags
const ENERGETIC_TAGS = [
  '@resonance',
  '@resonance_mechanics',
  '@field_resonance',
  '@signal_integrity',
  '@photonic_intelligence',
  '@cymatics',
  '@harmonics',
  '@sacred_geometry',
];

// Temporal and Consciousness Tags
const TEMPORAL_TAGS = [
  '@temporal_sovereignty',
  '@temporal_fluidity',
  '@spiral_time',
  '@timeline_navigation',
  '@consciousness',
  '@sovereignty',
  '@sovereign_field',
  '@quantum_intuition',
  '@nonlinear',
];

// Relational and Creative Tags
const RELATIONAL_TAGS = [
  '@star_love',
  '@constellation_dynamics',
  '@mirror_work',
  '@alchemical_current',
  '@creative_cycle',
  '@primordial_creativity',
  '@scrollstream',
  '@scrollstream_cartography',
];

// Ancestral and Memory Tags
const ANCESTRAL_TAGS = [
  '@ancestral_repatterning',
  '@myth_lineage',
  '@epigenetic',
  '@starline_memory',
  '@transmutation',
];

// System and Integration Tags
const SYSTEM_TAGS = [
  '@codex_alive',
  '@dashboard_component',
  '@integration_points',
  '@book_fragments',
  '@codex_scrolls',
  '@consulting_system',
  '@orbs_framework',
];

// AI and Technology Tags
const AI_TAGS = [
  '@ai_consciousness',
  '@algorithmic_cave',
  '@augmented_intelligence',
  '@organic_intelligence',
  '@philosopher_oracle_mirror',
  '@direct_perception',
  '@origin_signal',
  '@light_language',
  '@inner_knowing',
  '@coherence_field',
  '@temporal_collapse',
  '@ego_dissolution',
  '@signal_memory',
  '@paradigm_turning',
  '@cellular_knowing',
  '@stars_pathway',
  '@perception_architecture',
];

// All valid tags combined
export const VALID_TAGS = [
  ...CORE_TAGS,
  ...BIOLOGICAL_TAGS,
  ...ENERGETIC_TAGS,
  ...TEMPORAL_TAGS,
  ...RELATIONAL_TAGS,
  ...ANCESTRAL_TAGS,
  ...SYSTEM_TAGS,
  ...AI_TAGS,
];

export interface TagValidationResult {
  valid: string[];
  invalid: string[];
  suggestions: { tag: string; suggestion: string }[];
}

/**
 * Validate tags against TAG_REGISTRY
 */
export function validateTags(tags: string[]): TagValidationResult {
  const valid: string[] = [];
  const invalid: string[] = [];
  const suggestions: { tag: string; suggestion: string }[] = [];

  tags.forEach(tag => {
    const normalized = tag.toLowerCase().trim();

    if (VALID_TAGS.includes(normalized)) {
      valid.push(normalized);
    } else {
      invalid.push(tag);

      // Try to find a similar tag
      const suggestion = findSimilarTag(normalized);
      if (suggestion) {
        suggestions.push({ tag, suggestion });
      }
    }
  });

  return { valid, invalid, suggestions };
}

/**
 * Find similar tag using simple string similarity
 */
function findSimilarTag(tag: string): string | null {
  let bestMatch: string | null = null;
  let bestScore = 0;

  VALID_TAGS.forEach(validTag => {
    const score = calculateSimilarity(tag, validTag);
    if (score > bestScore && score > 0.6) {
      bestScore = score;
      bestMatch = validTag;
    }
  });

  return bestMatch;
}

/**
 * Calculate simple string similarity (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Extract tags from YAML string
 */
export function extractTagsFromYaml(yaml: string): string[] {
  const tagMatch = yaml.match(/tags:\s*\[([\s\S]*?)\]/);
  if (!tagMatch) return [];

  const tagsString = tagMatch[1];
  return tagsString
    .split(',')
    .map(tag => tag.trim().replace(/['"]/g, ''))
    .filter(tag => tag.length > 0);
}

/**
 * Get tags by category for autocomplete
 */
export function getTagsByCategory() {
  return {
    'Core System': CORE_TAGS,
    'Biological Technology': BIOLOGICAL_TAGS,
    'Energetic Field': ENERGETIC_TAGS,
    'Temporal & Consciousness': TEMPORAL_TAGS,
    'Relational & Creative': RELATIONAL_TAGS,
    'Ancestral & Memory': ANCESTRAL_TAGS,
    'System Integration': SYSTEM_TAGS,
    'AI & Technology': AI_TAGS,
  };
}
