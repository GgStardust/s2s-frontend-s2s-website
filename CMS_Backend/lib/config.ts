/**
 * S2S Dashboard Configuration
 * Central configuration for content processing, social media, and system settings
 */

// Content exclusion list - files to NOT import/process
export const EXCLUDED_FILES = [
  'andrew_bartzis',
  'comparing_stardust_to_sovereignty',
  'perimeter_gather',
  '02e_do not publish scrolls', // Use embedded scrollstreams instead
] as const;

// Check if a file should be excluded
export function shouldExcludeFile(filePath: string): boolean {
  return EXCLUDED_FILES.some(excluded =>
    filePath.toLowerCase().includes(excluded.toLowerCase())
  );
}

// Orb essay status tracking
export const ORB_ESSAY_STATUS = {
  completed: [1, 2, 3, 4, 5, 6, 8],
  needsRewrite: [7],
  needsReview: [9],
  notWritten: [10, 11, 12, 13],
} as const;

// Social media configuration
export const SOCIAL_MEDIA_CONFIG = {
  instagram: {
    username: 'gigi_stardust',
    platform: 'instagram',
  },
  linkedin: {
    profileUrl: 'https://www.linkedin.com/in/jenniferldye/',
    platform: 'linkedin',
  },
} as const;

// Orb glyph paths
export const ORB_GLYPHS = {
  1: '/glyphs/1.png',
  2: '/glyphs/2.png',
  3: '/glyphs/3.png',
  4: '/glyphs/4.png',
  5: '/glyphs/5.png',
  6: '/glyphs/6.png',
  7: '/glyphs/7.png',
  8: '/glyphs/8.png',
  9: '/glyphs/9.png',
  10: '/glyphs/10.png',
  11: '/glyphs/11.png',
  12: '/glyphs/12.png',
  13: '/glyphs/13.png',
} as const;

// Canonical Orb names (from PROCESSING_WORKFLOW.md)
export const ORB_NAMES = {
  1: 'Origin Intelligence',
  2: 'Resonance Mechanics',
  3: 'Photonic Intelligence',
  4: 'Harmonic Architectures',
  5: 'Temporal Sovereignty',
  6: 'Starline Memory',
  7: 'Alchemical Current',
  8: 'Quantum Intuition',
  9: 'Temporal Fluidity',
  10: 'Ancestral Repatterning',
  11: 'Radiant Transparency',
  12: 'Sovereign Field',
  13: 'Bridging Intelligence',
} as const;

// Orb synthesis (from PROCESSING_WORKFLOW.md)
export const ORB_SYNTHESIS = {
  1: 'Photonic blueprinting meets biological activation',
  2: 'Sovereign signal enters form and becomes architecture',
  3: 'Reflection initiates coherence through light webs',
  4: 'Chaos becomes rhythm through harmonic law',
  5: 'Exit time as container and reclaim it as tool',
  6: 'Memory returns as signal across galactic networks',
  7: 'Density becomes light through heat and compression',
  8: 'Intuition becomes infrastructure for decision-making',
  9: 'Attunement across time without fragmentation',
  10: 'Body becomes myth; field becomes form',
  11: 'Inner architecture emitted outward with clarity',
  12: 'Structural indivisibility; coherence made field',
  13: 'Communication pathways between human and nonhuman',
} as const;

// Brand colors (from Brand Guidelines)
export const BRAND_COLORS = {
  deepGold: '#C49A6C',
  deepNavy: '#1C1F3B',
  creamyWhite: '#F4F1E8',
  // Orb-specific colors
  orb1: '#8B0000', // Mitochondrial red
  orb2: '#1E90FF', // Cymatics blue
  orb3: '#FFFFFF', // Prism white
  orb4: '#FFD700', // Geometric gold
  orb5: '#9370DB', // Spiral violet
  orb6: '#4169E1', // Galactic blue
  orb7: '#FF4500', // Volcanic orange
  orb8: '#00CED1', // Probability cyan
  orb9: '#48D1CC', // Flow turquoise
  orb10: '#8B4513', // Earth brown
  orb11: '#F0E68C', // Luminous yellow
  orb12: '#DAA520', // Field gold
  orb13: '#9932CC', // Interface purple
} as const;

// Content type classifications (from PROCESSING_WORKFLOW.md)
export const CONTENT_TYPES = [
  'codex_core',
  'book_fragment',
  'scrollstream_entry',
  'research_notes',
  'system_architecture',
  'orb_essay',
  'supporting_essay',
] as const;

// Status classifications (from PROCESSING_WORKFLOW.md)
export const CONTENT_STATUS = [
  'canonical',
  'active',
  'draft',
  'archived',
] as const;

// Dashboard component mappings (from PROCESSING_WORKFLOW.md)
export const DASHBOARD_COMPONENTS = [
  'book_fragments',
  'orb_explorer',
  'scrollstream',
  'relational_inquiry',
  'research_viewer',
  'consciousness_field_design',
  'sonic_architecture',
] as const;

export type OrbNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type ContentType = typeof CONTENT_TYPES[number];
export type ContentStatus = typeof CONTENT_STATUS[number];
export type DashboardComponent = typeof DASHBOARD_COMPONENTS[number];
