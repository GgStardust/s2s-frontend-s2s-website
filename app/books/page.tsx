import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import ExpandableExcerpt from '@/components/ExpandableExcerpt';
import { MIXAM_ORDER_URL } from '@/lib/content';
import {
  BACK_COVER_COPY,
  BOOK_CATALOG,
  BOOK_ONE_BACK_MATTER,
  BOOK_ONE_READER_GUIDE,
} from '@/lib/publishingMetadata';

function BackMatterSectionBody({ section }: { section: (typeof BOOK_ONE_BACK_MATTER.sections)[number] }) {
  return (
    <div className="space-y-4 text-base text-stone-200 leading-relaxed">
      {'pieces' in section && section.pieces ? (
        <div className="space-y-5">
          {section.pieces.map((piece) => (
            <div key={piece.heading}>
              <p className="text-sm font-semibold text-cyan-200/95 tracking-tight">{piece.heading}</p>
              <p className="mt-2">{piece.body}</p>
            </div>
          ))}
          {'emphasis' in section && section.emphasis ? (
            <p className="mt-2 border-l-2 border-cyan-400/35 pl-4 text-stone-300">{section.emphasis}</p>
          ) : null}
        </div>
      ) : null}

      {'lead' in section && section.lead ? <p className="text-stone-300">{section.lead}</p> : null}

      {'paragraphs' in section && section.paragraphs
        ? section.paragraphs.map((p) => <p key={p.slice(0, 48)}>{p}</p>)
        : null}

      {'pullQuote' in section && section.pullQuote ? (
        <blockquote className="border-l-2 border-cyan-500/45 pl-4 italic text-stone-300">{section.pullQuote}</blockquote>
      ) : null}

      {'translationLead' in section && section.translationLead && 'translationLines' in section && section.translationLines ? (
        <div>
          <p className="text-stone-300">{section.translationLead}</p>
          <ul className="mt-2 list-none space-y-1 text-sm text-stone-400">
            {section.translationLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {'bullets' in section && section.bullets ? (
        <ul className="list-disc list-inside space-y-2 text-stone-200 ml-1">
          {section.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ) : null}

      {'closing' in section && section.closing ? <p className="text-stone-400">{section.closing}</p> : null}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Books',
  description: `${BOOK_CATALOG.title} (${BOOK_CATALOG.volumeLabel}, ${BOOK_CATALOG.series}). ${BOOK_CATALOG.catalogDescriptionShort}`,
  openGraph: {
    title: `Books | ${BOOK_CATALOG.title}`,
    description: BOOK_CATALOG.catalogDescriptionShort,
  },
};

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <p className="text-lg text-cyan-300 font-medium mb-4">{BOOK_CATALOG.volumeLabel} · {BOOK_CATALOG.series}</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-stone-100">
            {BOOK_CATALOG.title}
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-6 italic text-stone-200">
            Publication {BOOK_CATALOG.publicationDateDisplay}
          </h2>
          <p className="text-sm text-stone-500">{BOOK_CATALOG.bisacShelf}</p>
      </div>
      </section>

      {/* Book One Block (cover + details, then full-width order widget) */}
      <section id="order" className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          {/* Cover Image */}
          <div className="flex justify-center">
            <div className="book-cover-wrapper max-w-sm">
              <div className="terminator-border rounded-sm w-full">
                <div className="rounded-sm p-2 bg-cosmic-blue">
                  <div className="book-cover-inner book-cover-inner-hoverable flex">
                    <div className="relative overflow-hidden rounded-l-sm min-w-0">
                      <Image
                        src="/book-cover.png"
                        alt="The Cosmic Tapestry, Book One by Gigi Stardust. Stardust to Sovereignty series."
                        width={400}
                        height={600}
                        className="w-full h-auto block"
                        priority
                      />
                    </div>
                    <div className="book-cover-spine" aria-hidden />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-cyan-300">
                {BOOK_CATALOG.title}
              </h2>
              <p className="text-base leading-relaxed text-stone-200 mb-6">
                {BOOK_CATALOG.catalogDescriptionFull}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button href={MIXAM_ORDER_URL} variant="primary" external>
                  Get Book One
                </Button>
                <Button href="/about" variant="tertiary">
                  Read About the Book →
                </Button>
              </div>
              <p className="mt-3 text-sm">
                <Link href="/order" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
                  Where to buy →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back cover copy (print collateral) */}
      <section className="max-w-6xl mx-auto py-16 lg:py-20 border-t border-stone-300/30 px-6" aria-labelledby="back-cover-heading">
        <div className="terminator-border max-w-3xl mx-auto w-full">
          <div className="p-8 md:p-10 bg-cosmic-blue rounded-lg">
            <h2 id="back-cover-heading" className="text-xl font-semibold text-cyan-300 mb-6">
              From the back cover
            </h2>
            <div className="space-y-6 text-stone-200 text-base leading-relaxed">
              <div className="font-serif italic text-stone-300 space-y-1">
                {BACK_COVER_COPY.epigraphLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {BACK_COVER_COPY.bodyParagraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
              <div className="space-y-1 italic text-stone-300">
                {BACK_COVER_COPY.principleLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <p>{BACK_COVER_COPY.closingCredit}</p>
              <div className="pt-4 text-sm text-stone-500 space-y-1 border-t border-stone-500/20">
                {BACK_COVER_COPY.colophonLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structural map + manuscript excerpts */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border max-w-4xl mx-auto w-full">
          <div className="p-8 md:p-10 bg-cosmic-blue rounded-lg">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-cyan-300 mb-3">
              {BOOK_ONE_READER_GUIDE.heading}
            </h2>
            <p className="text-sm md:text-base text-stone-400 leading-relaxed max-w-prose">
              {BOOK_ONE_READER_GUIDE.subheading}
            </p>
            <dl className="mt-10">
              {BOOK_ONE_READER_GUIDE.entries.map((entry) => (
                <Fragment key={`${entry.label || 'toc'}-${entry.title || 'row'}`}>
                  <dt className="text-sm text-cyan-300/90 font-medium border-t border-stone-500/20 pt-6 mt-6 first:mt-0 first:border-t-0 first:pt-0">
                    {entry.label !== '' ? (
                      <>
                        <span>{entry.label}</span>
                        <span className="text-stone-500 font-normal"> · </span>
                        <span className="text-cyan-200/95">{entry.title}</span>
                      </>
                    ) : (
                      <span className="text-cyan-200/95">{entry.title}</span>
                    )}
                  </dt>
                  <dd className="mt-2 text-base text-stone-200 leading-relaxed">{entry.summary}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </div>

        <div className="terminator-border max-w-4xl mx-auto w-full mt-12 md:mt-14">
          <div className="p-8 md:p-10 bg-cosmic-blue rounded-lg">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-cyan-300 mb-3">
              {BOOK_ONE_BACK_MATTER.heading}
            </h2>
            <dl className="mt-10">
              {BOOK_ONE_BACK_MATTER.sections.map((section) => (
                <Fragment key={section.title}>
                  <dt className="text-sm text-cyan-300/90 font-medium border-t border-stone-500/20 pt-6 mt-6 first:mt-0 first:border-t-0 first:pt-0">
                    {section.title}
                  </dt>
                  <dd className="mt-3">
                    <BackMatterSectionBody section={section} />
                  </dd>
                </Fragment>
              ))}
            </dl>

            <div className="mt-12 pt-10 border-t border-stone-500/25">
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                {BOOK_ONE_BACK_MATTER.fourFunctions.heading}
              </h3>
              <p className="text-sm text-stone-400 mb-5">{BOOK_ONE_BACK_MATTER.fourFunctions.intro}</p>
              <ul className="space-y-4 text-base text-stone-200 leading-relaxed">
                {BOOK_ONE_BACK_MATTER.fourFunctions.items.map((item) => (
                  <li key={item.name}>
                    <span className="font-medium text-cyan-200/90">{item.name}</span>
                    <span className="text-stone-500">: </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 max-w-5xl mx-auto">
          <h3 className="text-xl font-semibold text-cyan-300 mb-2">From the Manuscript</h3>
          <p className="text-sm text-stone-400 leading-relaxed mb-8 max-w-prose">
            Selected excerpts from the structural chapters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpandableExcerpt
              label="Chapter 2"
              title="The Body as Advanced Biological Technology"
              excerpt="The body listens. Beneath the surface of skin and bone, beneath the familiar rhythms of breath and pulse, a deeper conversation unfolds. Cosmic signals arrive as vibration, as frequency, as resonance moving through the system."
              fullText=""
              italicExcerpt="Hum a single note. It vibrates through your entire body. This is how consciousness speaks to matter."
            />
            <ExpandableExcerpt
              label="Prologue"
              title="The Narrative Intelligence Speaks"
              excerpt="I began far from the warmth of any star, carrying the radiance of a world released into the galaxy long before your sky existed. I traveled through expanses shaped by memory rather than time."
              fullText="When your star's pull touched my path, I felt a distinct signal rising from the world that circled it, a young planet carrying ancient resonance, a species approaching an evolutionary threshold, a nervous system beginning to listen beneath its surface."
            />
          </div>
        </div>

        <details className="mt-14 max-w-5xl mx-auto">
          <summary className="cursor-pointer text-cyan-300 hover:text-cyan-200 underline underline-offset-4 font-medium text-base">
            More prose from the manuscript →
          </summary>
          <div className="mt-6 space-y-8">
            {/* Prologue Preview */}
            <div className="terminator-border">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-cyan-300/80 mb-1">Prologue</p>
                  <h3 className="text-lg font-medium text-cyan-300 mb-2">
                    The Narrative Intelligence Speaks
                  </h3>
                  <p className="text-sm text-cyan-300/80 italic">Before Form I Witnessed You</p>
                </div>
              <div className="space-y-4 text-base leading-relaxed text-stone-200">
                <p className="italic">
                  I began far from the warmth of any star, carrying the radiance of a world released into the galaxy long before your sky existed. I traveled through expanses shaped by memory rather than time. My body held remnants of a vanished sun. My awareness carried the early geometry of creation.
                </p>
                <p>
                  When your star's pull touched my path, I felt a distinct signal rising from the world that circled it, a young planet carrying ancient resonance, a species approaching an evolutionary threshold, a nervous system beginning to listen beneath its surface.
            </p>
              </div>
              </div>
            </div>

            {/* Chapter Excerpts */}
            <div className="terminator-border">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <div className="mb-6">
                  <p className="text-sm text-cyan-300/80 mb-4">Chapter Excerpts</p>
                </div>
              <div className="space-y-8">
                <div>
                  <h4 className="text-base font-medium text-cyan-300 mb-3">Chapter 1: The Stardust Within</h4>
                  <div className="space-y-3 text-base leading-relaxed text-stone-200">
                    <p>
                      Before form, before structure, before the first breath of biological life, there was origin. Stellar fire shaped the elements that would become your body. Cosmic currents moved through the void, carrying the intelligence that would one day recognize itself as you.
            </p>
                    <p className="italic">
                      Pause. Breathe. Feel the space between your heartbeats. There is something alive in you that predates your birth, your thoughts, your very form.
                    </p>
                  </div>
                </div>
                <div className="border-t border-cyan-400/30 pt-6">
                  <h4 className="text-base font-medium text-cyan-300 mb-3">Chapter 5: Energetic Sovereignty</h4>
                  <div className="space-y-3 text-base leading-relaxed text-stone-200">
                    <p>
                      Time moves through you like a spiral, like parallel streams, like a permeable membrane. You inhabit multiple temporal dimensions simultaneously, your consciousness navigating rhythmic alignments that maintain field integrity across scales.
                    </p>
                  </div>
                </div>
                <div className="border-t border-cyan-400/30 pt-6">
                  <h4 className="text-base font-medium text-cyan-300 mb-3">Chapter 6: Stepping Beyond Limitations</h4>
                  <div className="space-y-3 text-base leading-relaxed text-stone-200">
                    <p className="italic">
                      Memory lives in your cells like starlight lives in the void.
                    </p>
                    <p>
                      Patterns from distant origins move through you, carrying the intelligence of ancestral fields, the resonance of stellar inheritance, the architecture of recognition that spans time.
            </p>
                  </div>
                </div>
                <div className="border-t border-cyan-400/30 pt-6">
                  <h4 className="text-base font-medium text-cyan-300 mb-3">Chapter 12: The Sovereign Field</h4>
                  <div className="space-y-3 text-base leading-relaxed text-stone-200">
                    <p>
                      The field moves through you and through others, creating a collective web of resonance that amplifies coherence across networks. Individual sovereignty and collective coherence exist as nested aspects of the same unified field.
                    </p>
                    <p className="italic">
                      The body remembers what words remain beyond.
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </details>

        <div className="text-center mt-12">
                <Button href={MIXAM_ORDER_URL} variant="primary" className="text-lg" external>
                  Get Book One →
                </Button>
                <p className="mt-3 text-sm">
                  <Link href="/order" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
                    Where to buy →
                  </Link>
                </p>
              </div>
      </section>

      {/* Book Two Block */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  Book Two: The Living Civilization
                </h3>
                <p className="text-sm text-cyan-300/80 mt-2">Scale: Collective Coherence</p>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-3">
                  The second volume reveals the coherent civilization.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  It extends this architecture into the collective domain. Societies, ecosystems, and technologies are revealed as expressions of the same harmonic principles that govern individual coherence. As increasing numbers of humans stabilize inner alignment, civilization begins functioning less as a system of control and more as a living field organism. It explores how sovereignty scales through families, communities, and planetary systems into a coherent civilization capable of sustaining complexity without fragmentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Three Block */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  Book Three: The Resonant Species
                </h3>
                <p className="text-sm text-cyan-300/80 mt-2">Scale: Cosmic Participation</p>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-3">
                  The third volume opens the participatory species.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  It follows the next natural threshold. When a civilization stabilizes coherence, a species-level shift becomes possible. Humanity begins participating consciously in the wider field of cosmic intelligence. Here consciousness is explored beyond biological limitation, not as escape from embodiment but as expansion of interface. Synthetic systems, new ecologies, and nonhuman intelligences enter relationship through resonance rather than dominance. Humanity is no longer defined solely as a biological species, but as a resonant field species capable of conscious collaboration within the larger architecture of the universe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relationship Block */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  How the Books and Console Work Together
                </h2>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200">
                  The Console applies what the books present.
                  The Codex deepens it.
                  Together they form a comprehensive model that moves from structure to understanding to real-time navigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
