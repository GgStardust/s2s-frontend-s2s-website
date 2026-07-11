/**
 * Book-site copy: The Cosmic Tapestry (Book One) is the book;
 * Stardust to Sovereignty is the system / series name.
 */

/** Introduction opening — threshold line for Home and About. */
export const BOOK_EPIGRAPH =
  'A system reveals itself in the same way truth does: by arriving before language, waiting for attention to catch up.' as const

/** Nav and hero: book title primary, system name secondary. */
export const BOOK_SERIES_CONTEXT = 'Book One · Stardust to Sovereignty' as const

/** Home: flowing prose under the book title (no FAQ headers). */
export const BOOK_HOME_BODY = [
  'The Cosmic Tapestry maps how lawful order becomes recognizable in a human life: from stellar origin through the body, through time, memory, and relationship, toward sovereignty as participation without loss of origin.',
  'This is the first volume in Stardust to Sovereignty, the name given to the system the book describes. It establishes recognition at human scale. Later volumes carry that design into civilization and species life.',
  'Structural chapters and imaginative passages work together. Some passages land as recognition. Others bring structure gently into view. The book is offered as a companion in that recognition.',
] as const

/** About page only (progressive disclosure: not repeated on Home). */
export const ABOUT_PARADIGM_LEAD = BOOK_EPIGRAPH

/** Read page: role of imaginative passages between chapters. */
export const READ_INTERLUDE_ROLE =
  'Between the structural chapters, imaginative passages offer connection, imagination, example, relief from density, and creativity. They carry the same design in a different register.' as const

export const ABOUT_WHY_NOW = {
  body:
    'Modern life often splits emotion, relationship, and perception into separate streams. The Cosmic Tapestry restores continuity: recognition first, then alignment as a natural expression of coherence. It names structure you can feel in the body.',
} as const

export const ABOUT_INSIDE_THE_BOOK = {
  body: [
    'The Cosmic Tapestry moves through recognition, perception, and coherence shifts. It traces the arc from stellar origins to sovereign participation. Each chapter builds the same movement forward: how inner order becomes legible in the life you already live.',
    'The prose stays close to lived experience: body, attention, relationship, timing. Imaginative passages carry the same architecture in a different register.',
  ],
} as const

export const ABOUT_SYSTEM_CONTEXT = {
  heading: 'Stardust to Sovereignty',
  lead:
    'Stardust to Sovereignty is an interdisciplinary body of work investigating consciousness as a living structure active across scales of reality.',
  body: [
    'It explores biology, systems theory, complexity, ecology, cosmology, technology, mythology, creativity, and direct observation as expressions of the same underlying architecture: how intelligence organizes itself from cells to civilizations to the cosmos.',
    'The inquiry proposes an ontology, a structural account of how reality organizes and what it means for humanity to participate consciously within a living universe.',
    'Through books, essays, field reports, fiction, visual systems, and emerging technologies, the work develops an evolving thesis of coherent participation across scales. The Cosmic Tapestry establishes the first stable map of the architecture at human scale.',
  ],
} as const

export const ABOUT_ORBS_INTRO =
  'The Cosmic Tapestry names thirteen interlocking capacities already active within awareness. Each names a function through which perception, identity, and coherence organize. The full map lives in the book\u2019s appendices.' as const

/** About page: essence, orientation, and scope (not the full thesis). */
export const ABOUT_AUTHOR = {
  heading: 'About the author',
  body: [
    'For more than three decades, Gigi Stardust has followed one question: how does intelligence become recognizable in living form?',
    'Her work emerged through building businesses, traveling widely, studying living systems, and documenting recurring patterns across human experience, nature, and technology. She is an independent researcher, systems architect, and author exploring the relationship between consciousness, biology, creativity, civilization, and the cosmos.',
    'Decades of observation across science, systems thinking, technology, business, mythology, and lived experience gather into a unified inquiry she calls Stardust to Sovereignty. The Cosmic Tapestry is the first volume of this evolving body of work. She continues to develop the project through writing, research, travel, and field observation.',
  ],
} as const

export const HOMEPAGE_SERIES = {
  title: 'The trilogy',
  lead:
    'Stardust to Sovereignty is three volumes. The Cosmic Tapestry is Book One. Each volume stands alone.',
  bookOne:
    'The Cosmic Tapestry asks: How does a human become a coherent, self-aware field of intelligence?',
  bookTwo: 'The Living Civilization asks: What does society become when coherence organizes collective life?',
  bookThree: 'The Resonant Species asks: What does a species become when it participates consciously in cosmic evolution?',
} as const
