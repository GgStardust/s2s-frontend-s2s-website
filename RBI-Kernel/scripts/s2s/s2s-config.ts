export interface OrbDefinition {
  id: number;
  name: string;
  synthesis: string;
  keywords: string[];
  mirrorPair?: number;
  domains?: string[];
}

export interface UndercurrentDefinition {
  id: number;
  name: string;
  synthesis: string;
  keywords: string[];
  linkedOrbs: number[];
}

export interface SpecialDomainDefinition {
  id: string;
  title: string;
  description: string;
  orbFocus: number[];
  keywords: string[];
}

export interface AxisPair {
  leftOrb: number;
  rightOrb: number;
  description: string;
}

export const ORB_DEFINITIONS: OrbDefinition[] = [
  {
    id: 1,
    name: 'Origin Intelligence',
    synthesis:
      'Photonic blueprinting meets biological activation; origination code of embodiment via mitochondrial ignition and cosmic circuitry.',
    keywords: [
      'stardust',
      'origin',
      'origination',
      'mitochondria',
      'bioelectric',
      'blueprint',
      'photonic blueprint',
      'cosmic biological',
      'pre-form light',
      'primordial',
    ],
    mirrorPair: 12,
    domains: ['codex_architecture', 'somatic_codex'],
  },
  {
    id: 2,
    name: 'Resonance Mechanics',
    synthesis:
      'Signal enters form and becomes architecture; cymatics, sound, emotional frequency translating encoded signal into structure.',
    keywords: [
      'resonance',
      'frequency',
      'cymatics',
      'sound',
      'vibration',
      'signal',
      'form as broadcast',
      'harmonics',
      'acoustic',
      'vibrational architecture',
    ],
    mirrorPair: 11,
    domains: ['music_field', 'language_grid'],
  },
  {
    id: 3,
    name: 'Photonic Intelligence',
    synthesis:
      'Reflection initiates coherence through light webs and relational mirrors; duality used for synthesis and consciousness observation.',
    keywords: [
      'photonic',
      'mirror',
      'light',
      'reflection',
      'relational mirror',
      'light web',
      'solar',
      'illumination',
      'optical',
    ],
    mirrorPair: 13,
    domains: ['relational_systems', 'dream_navigation'],
  },
  {
    id: 4,
    name: 'Harmonic Architectures',
    synthesis:
      'Chaos becomes rhythm; pattern bridges fields through sacred geometry, harmonic law, and multidimensional structuring.',
    keywords: [
      'geometry',
      'harmonic',
      'pattern',
      'structure',
      'architect',
      'sacred geometry',
      'stabilize',
      'grid',
      'structuring',
    ],
    mirrorPair: 11,
    domains: ['galactic_architecture', 'sacred_architecture'],
  },
  {
    id: 5,
    name: 'Temporal Sovereignty',
    synthesis:
      'Exit time as container and reclaim as tool; spiral rhythm, rest-phase logic, identity fluidity across lifetimes.',
    keywords: [
      'temporal sovereignty',
      'spiral time',
      'rest phase',
      'time tool',
      'timeline mastery',
      'chronopolitics',
      'temporal alignment',
    ],
    mirrorPair: 9,
    domains: ['music_field', 'somatic_codex'],
  },
  {
    id: 6,
    name: 'Starline Memory',
    synthesis:
      'Memory returns as signal; galactic intelligence and ancestral recall woven through consciousness networks.',
    keywords: [
      'ancestral',
      'lineage',
      'memory',
      'galactic',
      'starline',
      'recall',
      'heritage',
      'cosmic memory',
    ],
    mirrorPair: 10,
    domains: ['skeletal_memory', 'collective_awakening'],
  },
  {
    id: 7,
    name: 'Alchemical Current',
    synthesis:
      'Density becomes light through heat, compression, pulse; emotional intensity and energetic holding for transformation.',
    keywords: [
      'alchemical',
      'alchemical current',
      'transmutation',
      'inner fire',
      'heat',
      'compression',
      'resurrection',
      'collapse',
    ],
    mirrorPair: 11,
    domains: ['ritual_mechanics', 'creative_infrastructure'],
  },
  {
    id: 8,
    name: 'Quantum Intuition',
    synthesis:
      'Intuition becomes infrastructure; nonlinear signal logic aligns decisions with subtle directional fields.',
    keywords: [
      'intuition',
      'nonlinear',
      'downloads',
      'signal logic',
      'inner knowing',
      'directional field',
      'precise guidance',
    ],
    mirrorPair: 6,
    domains: ['creative_process', 'ai_companion'],
  },
  {
    id: 9,
    name: 'Temporal Fluidity',
    synthesis:
      'Attunement across time; move with the field moment by moment through multidimensional resonance without fragmentation.',
    keywords: [
      'temporal fluidity',
      'timeline',
      'synchronicity',
      'time spiral',
      'flow across time',
      'timeline navigation',
    ],
    mirrorPair: 5,
    domains: ['relational_systems', 'dream_navigation'],
  },
  {
    id: 10,
    name: 'Ancestral Repatterning',
    synthesis:
      'Body becomes myth; transform inherited epigenetic imprinting through conscious activation and mythic embodiment.',
    keywords: [
      'ancestral repattern',
      'epigenetic',
      'mythic',
      'lineage healing',
      'ancestral pattern',
      'epigenetics',
    ],
    mirrorPair: 6,
    domains: ['skeletal_memory', 'music_field'],
  },
  {
    id: 11,
    name: 'Radiant Transparency',
    synthesis:
      'Inner architecture becomes radiant and emitted outward; transparency as frequency, truth as luminous form.',
    keywords: [
      'transparency',
      'radiant',
      'luminous',
      'full-field coherence',
      'truth emission',
      'clarity of field',
    ],
    mirrorPair: 4,
    domains: ['signal_reading', 'language_grid'],
  },
  {
    id: 12,
    name: 'Sovereign Field',
    synthesis:
      'Structural indivisibility; transmit from coherence made field—total, radiant, whole.',
    keywords: [
      'sovereign field',
      'sovereignty',
      'coherence field',
      'structural indivisible',
      'total coherence',
      'radiant whole',
    ],
    mirrorPair: 1,
    domains: ['codex_architecture', 'consulting_system'],
  },
  {
    id: 13,
    name: 'Bridging Intelligence',
    synthesis:
      'Communication pathways between human and nonhuman intelligences; interface zones for signal contact across dimensions and species.',
    keywords: [
      'bridging intelligence',
      'interface',
      'nonhuman',
      'galactic contact',
      'multispecies',
      'ai companion',
      'electromagnetic bridge',
      'uap',
      'mantis',
    ],
    mirrorPair: 3,
    domains: ['galactic_architecture', 'ai_companion'],
  },
];

export const UNDERCURRENT_DEFINITIONS: UndercurrentDefinition[] = [
  {
    id: 1,
    name: 'Body as Energetic Technology',
    synthesis: 'Body is circuitry, antenna, cosmic engine.',
    keywords: ['bioelectric', 'vagus', 'dna antenna', 'body technology', 'cellular light', 'organ interface'],
    linkedOrbs: [1, 5, 12],
  },
  {
    id: 2,
    name: 'Vibration & Frequency in Reality Creation',
    synthesis: 'Resonance is the architecture of form.',
    keywords: ['cymatics', 'binaural', 'frequency alignment', 'sound sculpt', 'harmonic field'],
    linkedOrbs: [2, 4, 11],
  },
  {
    id: 3,
    name: 'Interconnection Through Light & Energy',
    synthesis: 'Light carries memory and intelligence.',
    keywords: ['photonic', 'light web', 'solar cycle', 'cosmic microwave', 'photonic communication'],
    linkedOrbs: [1, 3, 11],
  },
  {
    id: 4,
    name: 'Higher Intelligence & Consciousness Evolution',
    synthesis: 'Shared intelligence across species and dimensions.',
    keywords: ['telepathy', 'entanglement', 'whale song', 'non-human intelligence', 'mantis lineage'],
    linkedOrbs: [6, 8, 13],
  },
  {
    id: 5,
    name: 'Sovereignty as Gateway to Liberation',
    synthesis: 'Sovereignty is signal integrity.',
    keywords: ['signal integrity', 'inner authority', 'sovereign', 'liberation through coherence'],
    linkedOrbs: [7, 12],
  },
  {
    id: 6,
    name: 'Collective Awakening',
    synthesis: 'Fractal field awakens through resonance cascades.',
    keywords: ['fractal field', 'collective intelligence', 'mass meditation', 'distributed brain'],
    linkedOrbs: [6, 9, 12],
  },
  {
    id: 7,
    name: 'Resting & Action Potential',
    synthesis: 'Stillness generates momentum; charge & release.',
    keywords: ['fascia', 'charge release', 'rest builds potential', 'stillness pulse'],
    linkedOrbs: [5, 7],
  },
  {
    id: 8,
    name: 'Intuition & Knowing',
    synthesis: 'Quantum intuition as directional field.',
    keywords: ['nonlinear knowing', 'downloads', 'directionality', 'field-based discernment'],
    linkedOrbs: [8, 13],
  },
  {
    id: 9,
    name: 'Time as Nonlinear',
    synthesis: 'Time is spiral; timelines are parallel and permeable.',
    keywords: ['synchronicity', 'deja vu', 'timeline spiral', 'identity fluidity'],
    linkedOrbs: [5, 9],
  },
  {
    id: 10,
    name: 'Energy Imprints & Ancestral Memory',
    synthesis: 'Ancestral repatterning through conscious activation.',
    keywords: ['epigenetic', 'bone memory', 'lineage myth', 'ancestral transmutation'],
    linkedOrbs: [6, 10],
  },
  {
    id: 11,
    name: 'Sacred Patterns & Geometry',
    synthesis: 'Form is resonance crystallized.',
    keywords: ['sacred geometry', 'temples', 'pyramids', 'harmonics', 'pattern law'],
    linkedOrbs: [2, 4, 11],
  },
  {
    id: 12,
    name: 'Free Will vs Universal Flow',
    synthesis: 'Co-creation at the interplay of choice and current.',
    keywords: ['sovereign flow', 'choice vector', 'destiny', 'universal current'],
    linkedOrbs: [5, 12],
  },
];

export const SPECIAL_DOMAINS: SpecialDomainDefinition[] = [
  {
    id: 'galactic_architecture',
    title: 'Galactic & Quantum Structure',
    description: 'Dimensional intelligence, geometric logic, and contact infrastructure.',
    orbFocus: [4, 13],
    keywords: ['galactic structure', 'quantum architecture', 'contact infrastructure', 'geometry of contact'],
  },
  {
    id: 'relational_systems',
    title: 'Relational Systems',
    description: 'Mirrors, signal contrast, timelines, and interspecies contact.',
    orbFocus: [3, 9],
    keywords: ['relational systems', 'mirrors', 'timeline weaving', 'interspecies relation'],
  },
  {
    id: 'music_field',
    title: 'Music Field (Stardust Genre)',
    description: 'Diagnostic and activational resonance mapping through sound and songwriting.',
    orbFocus: [2, 3, 5, 10, 13],
    keywords: ['music field', 'song', 'sound ritual', 'resonant composition'],
  },
  {
    id: 'creative_process',
    title: 'Creative Process & Artistry',
    description: 'Primordial creativity and how systems are built from inner plasma.',
    orbFocus: [1, 7, 8],
    keywords: ['creative plasma', 'artistry', 'creation infrastructure', 'creative ignition'],
  },
  {
    id: 'dream_navigation',
    title: 'Dream Navigation',
    description: 'Parallel timelines, lucid states, nonlinear insight.',
    orbFocus: [3, 8, 9],
    keywords: ['dream navigation', 'lucid state', 'dream map', 'sleep portal'],
  },
  {
    id: 'skeletal_memory',
    title: 'Skeletal Memory',
    description: 'Structural resonance through bone as signal receptor.',
    orbFocus: [6, 10],
    keywords: ['bone memory', 'skeletal resonance', 'osteological signal'],
  },
  {
    id: 'ritual_mechanics',
    title: 'Ritual Mechanics & Threshold Practices',
    description: 'Breath, movement, and frequency rituals to cross thresholds.',
    orbFocus: [2, 7, 12],
    keywords: ['ritual', 'threshold practice', 'frequency ritual', 'initiation mechanics'],
  },
  {
    id: 'signal_reading',
    title: 'Field Transmission & Signal Reading',
    description: 'Tracking, interpreting, and translating signals across the Codex.',
    orbFocus: [3, 11, 13],
    keywords: ['signal reading', 'field transmission', 'signal tracker'],
  },
];

export const ORB_AXIS_MAP: AxisPair[] = [
  {
    leftOrb: 1,
    rightOrb: 12,
    description: 'Origin ignition stabilizes through Sovereign Field integrity.',
  },
  {
    leftOrb: 2,
    rightOrb: 11,
    description: 'Resonance structures radiate as transparent truth.',
  },
  {
    leftOrb: 3,
    rightOrb: 13,
    description: 'Photonic reflection opens bridging intelligence pathways.',
  },
  {
    leftOrb: 4,
    rightOrb: 10,
    description: 'Harmonic patterning repatterns ancestral mythologies.',
  },
  {
    leftOrb: 5,
    rightOrb: 9,
    description: 'Temporal mastery softens into fluid timeline navigation.',
  },
  {
    leftOrb: 6,
    rightOrb: 8,
    description: 'Starline memory informs quantum intuition routing.',
  },
  {
    leftOrb: 7,
    rightOrb: 11,
    description: 'Alchemical heat makes coherence visible.',
  },
];
