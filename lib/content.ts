/**
 * Shared content constants for the Stardust to Sovereignty website
 * Consolidates repeated text, quotes, and messaging across pages
 */

import { AMAZON_LISTING_URL, BOOK_CATALOG, SEARCH_KEYWORDS } from './publishingMetadata'

export { BOOK_CATALOG, SEARCH_KEYWORDS } from './publishingMetadata'

// Core Quotes
export const QUOTES = {
  systemRevealsItself: "A system reveals itself in the same way truth does: by arriving before language, waiting for attention to catch up.",
  
  longBeforeBook:
    'Long before this book took form, the field it describes was already in motion. Its architecture lives as instinct, as coherence, as emotional intelligence, and as patterns that repeat with quiet precision. It shapes decisions, relationships, creativity, and identity with a steady, underlying order. Language steps in to recognize this movement and give it shape.',
  
  whatYouAreEntering:
    'What you are entering is a living description of how consciousness behaves when it is whole and uncompressed. These pages trace the movements that unfold inside every human life when awareness has space to deepen and widen.',
  
  firstChangeValley:
    'The first change in the valley begins as a quiet stirring along the ground. It moves like a slow breath, loosening something within you before you notice what has begun. In this place, names begin to shift. The deeper ones that hold your form from within rise to the surface.',
  
  bodyListens:
    'The ground of intelligence translates into the living body as resonance. The body listens. Beneath skin and bone, beneath the familiar rhythms of breath and pulse, a deeper conversation unfolds.',
  
  consciousnessSpeaksToMatter:
    'Hum a single note. The vibration moves through your entire body. Here, awareness enters matter through rhythm and regulation.',
  
  memoryAsStarlight:
    'Old light travels across distance. Matter forged in stellar cores circulates through living form. Memory moves as structure in motion.',
  
  timeAsSpiral:
    'In lived experience, time unfolds as layered and recursive, forming a navigable architecture that folds past, present, and potential into continuity. Experience gathers into strata that remain present as they transform, allowing persistence without collapse. Consciousness moves across temporal layers simultaneously, navigating rhythmic alignments that sustain stability across scales.',
  
  fieldMovesThroughYou:
    'The sovereign field names the relational space of shared attention, rhythm, and feedback. It functions as a resonant network that amplifies alignment while preserving continuity.',
  
  bodyRemembers: 'The body carries the thread. The thread remains. Inheritance awaits recognition.',
} as const;

// Book Descriptions (aligned with KDP / Ingram catalog copy)
export const BOOK_DESCRIPTIONS = {
  bookOne: {
    short: `${BOOK_CATALOG.title} · ${BOOK_CATALOG.volumeLabel}`,
    subtitle: BOOK_CATALOG.catalogDescriptionShort,
    subtitleExtended: BOOK_CATALOG.catalogDescriptionFull,
    full: BOOK_CATALOG.catalogDescriptionShort,
    fullWithSystem: `${BOOK_CATALOG.catalogDescriptionShort} Readers are invited to engage with a model of sovereignty that is internally consistent, operational, and applicable across personal, relational, and collective domains.`,
  },
} as const;

// Homepage: book-first, calm; one clear pitch, low competing narrative
export const HOMEPAGE_HERO = {
  bookSubtitle: BOOK_CATALOG.catalogDescriptionShort,
  authorLine: BOOK_CATALOG.author,
} as const;

/** Order hub: direct + marketplace channels. */
export const ORDER_RETAILERS = [
  {
    id: 'amazon',
    name: 'Amazon',
    blurb: 'Paperback and Kindle on the Amazon listing (regional formats may vary).',
    href: AMAZON_LISTING_URL,
    status: 'live' as const,
  },
] as const;

/** Public contact for orders, wholesale, and site inquiries. */
export const CONTACT_EMAIL = 'gigi@gigistardust.com' as const;

// Book availability (aligned with publication date March 6, 2026)
export const PRESALE_INFO = {
  announcement: 'The Cosmic Tapestry · publication March 6, 2026',
  shortAnnouncement: 'The Cosmic Tapestry · March 6, 2026',
  shipDate: 'March 6, 2026',
  digitalRelease: 'March 2026',
  reserveCopy: 'Purchase the current first edition.',
  orderBefore: '',
} as const;

// Self-Publishing Explanation
export const SELF_PUBLISHING = {
  why: "The system encoded here remains alive and unmediated. Every word, structure, and timing preserves what emerged through direct encounter. The framework made itself visible through lived experience, pattern, and necessity.",
  orderMatters: "By ordering your copy, you support this work as it was intended: a translation of a system that predates its articulation, preserved in its original integrity.",
} as const;

/** Unified purchase CTAs for the current first edition. */
export const ORDER_CTA = {
  primary: (priceUsd: number) => `Order the book · $${priceUsd} shipped`,
  primaryShort: 'Purchase the current first edition',
  amazonSecondary: 'Also on Amazon →',
  whereToBuy: 'Where to buy →',
  editionLine: (priceUsd: number, publicationDisplay: string) =>
    `Current First Edition · $${priceUsd} shipped · ${publicationDisplay}`,
} as const

// Button Labels
export const BUTTON_LABELS = {
  getBookOne: "Get Book One",
  preorder: "Get Book One",
  insideBook: "Inside Book One",
  aboutBook: "About This Book",
  exploreMore: "Explore More",
  returnHome: "Return Home",
} as const;

// Section Headings
export const SECTION_HEADINGS = {
  theParadigm: "The Paradigm",
  whatBookOneContains: "What Book One Contains",
  whoThisIsFor: "Who This Is For",
  aboutThisWork: "About This Work",
  reserveCopy: "Get Book One",
} as const;
