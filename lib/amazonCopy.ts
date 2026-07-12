/**
 * Amazon / KDP listing copy for The Cosmic Tapestry (trade paperback + Kindle).
 * Paste into KDP: Description, Series, Keywords, Author Central bio.
 * Voice: book vessel + affirmative (see docs/archive/STYLE_AND_LANGUAGE_UPDATES.md).
 */

import { BOOK_CATALOG } from './publishingMetadata'

export const AMAZON_SERIES = {
  title: 'Stardust to Sovereignty',
  number: 1,
} as const

/** Optional KDP subtitle (keep short; title is The Cosmic Tapestry). */
export const AMAZON_SUBTITLE = 'Book One of Stardust to Sovereignty' as const

/** First ~200 characters should carry the hook (mobile “Read more” fold). */
export const AMAZON_DESCRIPTION_OPENING =
  'The Cosmic Tapestry maps how lawful order becomes recognizable in a human life: from stellar origin through the body, through time, memory, and relationship, toward sovereignty as participation without loss of origin.' as const

/** Plain text for KDP description box (line breaks preserved). */
export const AMAZON_DESCRIPTION_PLAIN = `${AMAZON_DESCRIPTION_OPENING}

This is the first published volume of Stardust to Sovereignty, an inquiry into consciousness as a living structure active across scales of reality. Recognition came before theory. Structure emerged when language caught up to processes already moving through embodiment, relationship, and perception.

${BOOK_CATALOG.title} moves through fourteen structural chapters and imaginative passages that carry the same design in a different register. Some passages land as recognition. Others bring structure gently into view. Together they trace the arc from stellar origins to sovereign participation: how inner order becomes legible in the life you already live.

The book names thirteen interlocking capacities already active within awareness. The full map lives in the appendices. Back matter includes a consciousness architecture overview, paradigm statement, series note, and glossary.

Book One asks: How does a human become a coherent, self-aware field of intelligence?

Gigi Stardust's life has been an evolution toward one question: how does intelligence become recognizable in living form?

The Stardust to Sovereignty series continues with The Living Civilization (Book Two) and The Resonant Species (Book Three).` as const

/** KDP accepts basic HTML in the description field. */
export const AMAZON_DESCRIPTION_HTML = `<p><i>${AMAZON_DESCRIPTION_OPENING}</i></p>

<p>This is the first published volume of <b>Stardust to Sovereignty</b>, an inquiry into consciousness as a living structure active across scales of reality. Recognition came before theory. Structure emerged when language caught up to processes already moving through embodiment, relationship, and perception.</p>

<p><b>${BOOK_CATALOG.title}</b> moves through fourteen structural chapters and imaginative passages that carry the same design in a different register. Some passages land as recognition. Others bring structure gently into view. Together they trace the arc from stellar origins to sovereign participation: how inner order becomes legible in the life you already live.</p>

<p>The book names thirteen interlocking capacities already active within awareness. The full map lives in the appendices. Back matter includes a consciousness architecture overview, paradigm statement, series note, and glossary.</p>

<p><b>Book One asks:</b> How does a human become a coherent, self-aware field of intelligence?</p>

<p>Gigi Stardust's life has been an evolution toward one question: how does intelligence become recognizable in living form?</p>

<p>The Stardust to Sovereignty series continues with <i>The Living Civilization</i> (Book Two) and <i>The Resonant Species</i> (Book Three).</p>` as const

/** KDP allows 7 keyword phrases (max 50 characters each). */
export const AMAZON_KEYWORDS = [
  'consciousness and reality',
  'metaphysics mind body',
  'sovereignty and creation',
  'cosmology consciousness biology',
  'human identity and perception',
  'structured consciousness model',
  'stardust to sovereignty',
] as const

/** Amazon Author Central / “About the author” (third person). */
export const AMAZON_AUTHOR_BIO =
  "Gigi Stardust's life has been an evolution toward one question: how does intelligence become recognizable in living form? Her work emerged through building businesses, studying living systems, documenting recurring patterns, and exploring the relationship between people, place, nature, and technology. She is an independent researcher, systems architect, and author. The Cosmic Tapestry is the first published volume of Stardust to Sovereignty." as const

/** One-line catalog blurb (A+ Content, ads, short fields). */
export const AMAZON_CATALOG_BLURB =
  'Book One of Stardust to Sovereignty: a map of recognition from stellar origin through the body to sovereign participation.' as const
