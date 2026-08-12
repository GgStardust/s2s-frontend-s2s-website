/**
 * Book-site copy: The Cosmic Tapestry (Book One) is the book;
 * Stardust to Sovereignty is the system / series name.
 */

/** Introduction opening — threshold line for Home and About. */
export const BOOK_EPIGRAPH =
  'A system reveals itself in the same way truth does: by arriving before language, waiting for attention to catch up.' as const

/** Series and volume labels (hierarchy: series → volume → book title). */
export const SERIES_NAME = 'Stardust to Sovereignty' as const
export const BOOK_VOLUME_LABEL = 'Book One' as const

/** Compact label for metadata, alt text, and title attributes. */
export const BOOK_SERIES_CONTEXT = `${BOOK_VOLUME_LABEL} · ${SERIES_NAME}` as const

/** Read page intro. */
export const READ_PAGE_LEAD =
  "Three excerpts introduce the book's dual register: the prologue, a structural chapter, and an imaginative passage." as const

/** Home: flowing prose under the book title (no FAQ headers). */
export const BOOK_HOME_BODY = [
  'The Cosmic Tapestry maps how lawful order becomes recognizable in a human life: from stellar origin through the body, through time, memory, and relationship, toward sovereignty as participation without loss of origin.',
  'This is the first completed literary embodiment of Stardust to Sovereignty. It establishes recognition at human scale while the larger field remains open to future forms.',
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
    'Stardust to Sovereignty is a cosmological and human architecture investigating consciousness as a living structure active across scales of reality.',
  body: [
    'It explores biology, systems theory, complexity, ecology, cosmology, technology, mythology, creativity, and direct observation as expressions of the same underlying architecture: how intelligence organizes itself from cells to civilizations to the cosmos.',
    'The inquiry proposes an ontology, a structural account of how reality organizes and what it means for humanity to participate consciously within a living universe.',
    'Through books, essays, field reports, fiction, visual systems, and emerging technologies, the living field develops an evolving thesis of coherent participation across scales. The Cosmic Tapestry establishes the first stable map of the architecture at human scale.',
  ],
} as const

export const ABOUT_ORBS_INTRO =
  'The Cosmic Tapestry names thirteen interlocking capacities already active within awareness. Each names a function through which perception, identity, and coherence organize. The full map lives in the book\u2019s appendices.' as const

/** About page: essence, orientation, and scope (not the full thesis). */
export const ABOUT_AUTHOR = {
  heading: 'About the author',
  body: [
    'Gigi Stardust\u2019s life has been an evolution toward one question: how does intelligence become recognizable in living form?',
    'Her work emerged through building businesses, studying living systems, documenting recurring patterns, and exploring the relationship between people, place, nature, and technology. She is an independent researcher, systems thinker, and author exploring the relationship between consciousness, biology, creativity, civilization, and the cosmos.',
    'Observation across science, systems thinking, technology, business, mythology, and lived experience gathered over a lifetime into the Stardust Current: a living field expressed through books, essays, field reports, fiction, and emerging technologies. The Cosmic Tapestry is its first completed literary embodiment.',
  ],
} as const

export const HOMEPAGE_SERIES = {
  title: 'The larger field',
  lead:
    'Stardust to Sovereignty is larger than any single vessel. The Cosmic Tapestry is Book One and stands complete on its own.',
  bookOne:
    'The Cosmic Tapestry asks: How does a human become a coherent, self-aware field of intelligence?',
  bookTwo: 'Future public forms will be shared when they are ready.',
  bookThree: 'The field remains active through writing, inquiry, observation, making, and encounter.',
} as const
