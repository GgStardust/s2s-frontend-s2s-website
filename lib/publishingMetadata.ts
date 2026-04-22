/**
 * Canonical copy aligned with Amazon KDP, Ingram Spark, and on-book metadata.
 * Update this file when retailer or cover copy changes.
 */

export const BOOK_CATALOG = {
  title: 'The Cosmic Tapestry',
  series: 'Stardust to Sovereignty',
  volumeLabel: 'Book One',
  author: 'Gigi Stardust',
  imprint: 'Stardust to Sovereignty UNA',
  press: 'S2S Press',
  publicationDateISO: '2026-03-06',
  publicationDateDisplay: 'March 6, 2026',
  trimSize: '6 × 9 in.',
  pageCountIngramAmazon: 254,
  pageCountMixamPod: 237,
  bisacShelf: 'Philosophy · Metaphysics · Mind & Body',
  /** Shortest catalog description (matches retailer “catalog” short) */
  catalogDescriptionShort:
    'The Cosmic Tapestry presents a structured model of consciousness in which body, perception, and identity operate as a unified field of intelligence. It establishes a framework for understanding human experience as an expression of underlying architectural coherence.',
  /** Full 150–250 word retailer description (deduped; matches KDP/Ingram long short) */
  catalogDescriptionFull:
    'The Cosmic Tapestry presents a structured framework for understanding consciousness, creation, and the inherent intelligence within reality. Drawing from cosmology, biology, and lived experience, the work positions the human being as an expression of Origin Intelligence: coherent, precise, and capable of direct authorship of experience. It presents a system that reveals how perception, structure, and awareness interlock to form a unified field of creation. Readers are invited to engage with a model of sovereignty that is internally consistent, operational, and applicable across personal, relational, and collective domains.',
  /** ~155–165 chars for HTML meta tags */
  metaDescription:
    'The Cosmic Tapestry (Book One, Stardust to Sovereignty) by Gigi Stardust: consciousness as a unified field: Origin Intelligence, sovereignty, and architectural coherence. Publication March 6, 2026.',
  authorBioShort:
    'Gigi Stardust is an author and systems thinker developing a structured model of consciousness known as Stardust to Sovereignty. Her work integrates cosmology, biological systems, and lived experience into a unified architecture of creation and awareness.',
} as const

/** Deduped search phrases (KDP / site keywords) */
export const SEARCH_KEYWORDS = [
  'consciousness architecture',
  'consciousness and reality',
  'sovereignty and creation',
  'origin intelligence',
  'cosmic intelligence and biology',
  'metaphysical systems',
  'structured consciousness model',
] as const

export const PRICING = {
  /** Retail / marketplace paperback reference */
  paperbackUsd: 33,
  /** Reserved for a future author-direct checkout path (off the public site until you enable it). */
  directPaperbackUsd: 29,
  digitalUsd: 17,
  hardcoverUsd: 44,
  websitePaperbackNote: 'Paperback list price $33.00 USD on Amazon; Mixam Authors Edition uses the order link on this site.',
} as const

/** Primary ISBN for schema.org (Amazon KDP paperback, 254 pp.) */
export const ISBN_SCHEMA_PRIMARY = '9798994934227'

/** Primary Amazon product link (KDP paperback; other formats available on the same title page). */
export const AMAZON_LISTING_URL = 'https://www.amazon.com/gp/product/B0GXCNLMBQ' as const

/** Back cover / jacket copy (matches print collateral) */
export const BACK_COVER_COPY = {
  epigraphLines: [
    'A comet crosses the sky',
    'Ancient light enters the field',
    'Humanity recognizes itself',
  ],
  bodyParagraphs: [
    'The Cosmic Tapestry traces the journey from stardust to sovereignty: an evolutionary passage in which consciousness becomes aware of its underlying architecture. It presents a coherent framework of human identity organized through origin, body, memory, perception, and time, situating the human inside the fabric of reality, where structure becomes visible through lived recognition.',
  ],
  principleLines: [
    'The principles that shape stars shape cells.',
    'The coherence that stabilizes galaxies stabilizes identity.',
    'Sovereignty emerges as the perceptual state that arises when structure is recognized and lived.',
  ],
  closingCredit:
    'Gigi Stardust is a writer and systems thinker exploring the architecture of consciousness. The Cosmic Tapestry is the first volume in the Stardust to Sovereignty trilogy.',
  colophonLines: ['S2S Press', 'Cover design and art by Gigi Stardust', 'Philosophy | Metaphysics | Mind-Body'],
} as const

/** Book One map for the website: structural arc before manuscript excerpts. */
export const BOOK_ONE_READER_GUIDE = {
  heading: 'A structural introduction to the system',
  subheading:
    'Book One builds the architecture from origin and biology into sovereignty, time, and collective field.',
  entries: [
    {
      label: 'Prologue',
      title: 'The Narrative Intelligence Speaks',
      summary: 'Establishes scale and field through a mythic opening voice.',
    },
    {
      label: 'Chapter 1',
      title: 'The Stardust Within',
      summary: 'Positions the body as material continuity of cosmic order.',
    },
    {
      label: 'Chapter 2',
      title: 'The Body as Advanced Biological Technology',
      summary: 'Shows how signal becomes sensation, physiology, and action.',
    },
    {
      label: 'Chapter 3',
      title: 'Metabolic Intelligence',
      summary: 'Explains how light and timing organize energy and awareness.',
    },
    {
      label: 'Chapter 4',
      title: 'Resonance and the Energetic Universe',
      summary: 'Describes coherence through rhythm, proportion, and structure.',
    },
    {
      label: 'Chapter 5',
      title: 'Energetic Sovereignty',
      summary: 'Defines sovereignty as rhythm, pacing, and viable action.',
    },
    {
      label: 'Chapter 6',
      title: 'Stepping Beyond Limitations',
      summary: 'Explores inheritance, memory, and extended identity.',
    },
    {
      label: 'Chapter 7',
      title: 'The Alchemical Current',
      summary: 'Tracks transformation through pressure and reorganization.',
    },
    {
      label: 'Chapter 8',
      title: 'Sovereign Disintegration',
      summary: 'Shows how direction forms as structure releases.',
    },
    {
      label: 'Chapter 9',
      title: 'Temporal Fluidity',
      summary: 'Frames time as a sensed and navigable field.',
    },
    {
      label: 'Chapter 10',
      title: 'Language as Sonic Grid',
      summary: 'Maps how pattern moves through language and relationship.',
    },
    {
      label: 'Chapter 11',
      title: 'Sacred Architecture',
      summary: 'Reveals coherence as visible structure and presence.',
    },
    {
      label: 'Chapter 12',
      title: 'The Sovereign Field',
      summary: 'Extends coherence into shared environments and systems.',
    },
    {
      label: 'Chapter 13',
      title: 'Bridging Intelligence',
      summary:
        'Bridging intelligence: how human coherence extends into collaborators, tools, and systems while keeping agency intact.',
    },
    {
      label: 'Chapter 14',
      title: 'The Living Blueprint',
      summary:
        'The living blueprint as operable order: pattern stable enough to inhabit, revise, and pass forward.',
    },
  ],
} as const

/**
 * Back matter: manuscript-accurate structure.
 * Sections render rich `dd` content from optional fields; see `app/books/page.tsx`.
 */
export const BOOK_ONE_BACK_MATTER = {
  heading: 'Back matter',
  sections: [
    {
      title: 'Prologue / Epilogue · Comet Voice (Mythological Frame)',
      pieces: [
        {
          heading: 'Before Form, I Witnessed You (opening)',
          body: 'A cosmological narrative spoken by a traveling intelligence. A comet carries memory, perception, and recognition across systems. It observes Earth, senses human emergence, and registers a threshold event.',
        },
        {
          heading: 'The Light That Recognized You Recognizes You Still (closing)',
          body: 'The same voice continues beyond the encounter. Recognition persists as a structural condition across distance and time. The human is addressed as one who crossed a threshold and now carries that coherence forward.',
        },
      ],
      emphasis:
        'These passages establish a relational event between intelligences across scale. The book opens and closes within this field of recognition.',
    },
    {
      title: 'Conclusion',
      lead: 'The system resolves into continuity:',
      paragraphs: [
        'Consciousness as lawful architecture. The Orbs as active functions. The body as interface. Sovereignty as participation.',
      ],
      closing: 'It stabilizes the work as operational reality you can inhabit and use.',
    },
    {
      title: 'Consciousness Architecture Overview',
      paragraphs: [
        'This section converts the entire book into a structured system map.',
        'Each chapter is rendered as: Guiding Question · What Is Being Explored · Why This Matters · Relation to Consciousness Advancement.',
      ],
      pullQuote:
        'What you have just traveled through as story, symbol, and lived reflection is presented here as structure.',
      translationLead: 'This section functions as structural translation:',
      translationLines: [
        'Narrative resolves into system. Experience resolves into architecture. Reading resolves into application.',
      ],
    },
    {
      title: 'The Paradigm of Stardust to Sovereignty',
      paragraphs: [
        'Defines the framework itself: what Stardust to Sovereignty is, what kind of system it is, and the scale of inquiry it opens.',
      ],
    },
    {
      title: 'The Trilogy',
      paragraphs: [
        'Places Book One within the larger three-book arc. The progression moves from sovereign individual, to coherent civilization, to participatory species.',
      ],
    },
    {
      title: 'Appendix A',
      lead: 'Primary appendix: core system material.',
      paragraphs: [
        'This section defines the Orb System as a living architecture: Orbs as nodes in a multidimensional field, coherence points shaped by resonance, memory, intelligence, and form.',
        'This is primary system definition.',
      ],
    },
    {
      title: 'Appendix B',
      paragraphs: [
        'This section extends the system into applied structure.',
        'It carries the architecture into use, interaction, and continuation beyond the main body.',
      ],
    },
    {
      title: 'Glossary',
      lead: 'Precise system language:',
      bullets: [
        'Defines system language as functional components of the architecture.',
        'It stabilizes meaning across the system.',
      ],
    },
    {
      title: 'Constellations of Companions',
      lead: 'This section maps the relational field through which the system emerged.',
      paragraphs: [
        'It defines how the system emerged through books, thinkers, artists, and lived encounters across time.',
        'It explicitly frames this as lifelong dialogue shaping the architecture:',
      ],
      pullQuote: 'The system described in this book emerged through that kind of lifelong dialogue.',
      bullets: [
        'It situates the work within a living lineage while maintaining authorship.',
        'Shows influence as field interaction.',
      ],
    },
  ],
  fourFunctions: {
    heading: 'What this back matter actually does',
    intro: 'It completes four distinct functions:',
    items: [
      {
        name: 'Mythological framing (Comet Voice)',
        text: 'Establishes the work as an event within a larger field of intelligence.',
      },
      {
        name: 'System stabilization (Conclusion · Paradigm · Trilogy)',
        text: 'Grounds the architecture as coherent and continuous.',
      },
      {
        name: 'Structural translation (Architecture Overview + Appendices)',
        text: 'Makes the system usable and navigable.',
      },
      {
        name: 'Relational positioning (Constellations)',
        text: 'Places the work within a living field of influence.',
      },
    ],
  },
} as const
