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
  bisacShelf: 'Philosophy · Metaphysics · Mind & Body',
  /** Shortest catalog description (Amazon subtitle hook, meta fallback). */
  catalogDescriptionShort:
    'The Cosmic Tapestry maps how lawful order becomes recognizable in a human life: from stellar origin through the body to sovereign participation. Book One of Stardust to Sovereignty.',
  /** Full retailer description (~150–250 words; aligned with lib/amazonCopy.ts). */
  catalogDescriptionFull:
    'The Cosmic Tapestry maps how lawful order becomes recognizable in a human life: from stellar origin through the body, through time, memory, and relationship, toward sovereignty as participation without loss of origin. This is the first completed literary embodiment of Stardust to Sovereignty, an inquiry into consciousness as a living structure active across scales of reality. Recognition came before theory. Structure emerged when language caught up to processes already moving through embodiment, relationship, and perception. The book moves through fourteen structural chapters and imaginative passages that carry the same design in a different register. Some passages land as recognition. Others bring structure gently into view. Together they trace the arc from stellar origins to sovereign participation: how inner order becomes legible in the life you already live. The book names thirteen interlocking capacities already active within awareness. Back matter includes a consciousness architecture overview, paradigm statement, series note, and glossary. Gigi Stardust\'s life has been an evolution toward one question: how does intelligence become recognizable in living form?',
  /** ~155–165 chars for HTML meta tags */
  metaDescription:
    'The Cosmic Tapestry (Book One, Stardust to Sovereignty) by Gigi Stardust: a map of recognition from stellar origin through the body to sovereign participation.',
  authorBioShort:
    'Gigi Stardust\u2019s life has evolved toward one question: how intelligence becomes recognizable in living form. The Cosmic Tapestry is the first completed literary embodiment of Stardust to Sovereignty.',
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
  /** Typical Amazon KDP paperback list (retailer may add shipping at checkout). */
  paperbackUsd: 33,
  /** Current first edition: direct Stripe checkout, paperback trim, standard shipping included in total. */
  directPaperbackUsd: 44,
  digitalUsd: 17,
  /** Shown on the order hub when a price comparison note is needed (keep minimal). */
  websitePaperbackNote:
    'Current First Edition: $44.00 USD total with standard shipping included, purchased directly from Gigi Stardust.',
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
    'Gigi Stardust is a writer and systems thinker exploring the architecture of consciousness. The Cosmic Tapestry is the first completed literary embodiment of Stardust to Sovereignty.',
  colophonLines: ['S2S Press', 'Cover design and art by Gigi Stardust', 'Philosophy | Metaphysics | Mind-Body'],
} as const

/** Book One map for the website: structural arc before manuscript excerpts. */
export const BOOK_ONE_READER_GUIDE = {
  heading: 'A structural introduction to the system',
  subheading:
    "Fourteen reader-map entry points follow the book's conceptual arc (not every titled section in the print manuscript). Section titles match the book.",
  entries: [
    {
      label: 'Prologue',
      title: 'Before Form, I Witnessed You',
      summary: 'Mythic comet-voice opening: scale, Earth threshold, recognition across distance.',
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
 * Sections render rich `dd` content from optional fields; see `app/book-one/page.tsx`.
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
      title: 'Series Note',
      paragraphs: [
        'Places Book One within the larger Stardust to Sovereignty field while leaving future embodiments open.',
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
