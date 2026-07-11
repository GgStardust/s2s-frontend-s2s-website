import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import ExpandableExcerpt from '@/components/ExpandableExcerpt';
import OrderCommerceStrip from '@/components/OrderCommerceStrip';
import { ORDER_CTA } from '@/lib/content';
import {
  BACK_COVER_COPY,
  BOOK_CATALOG,
  BOOK_ONE_BACK_MATTER,
  BOOK_ONE_READER_GUIDE,
  PRICING,
} from '@/lib/publishingMetadata';
import {
  arcMemory,
  bodyAsTechnologyTeaser,
  chapterSovereignField,
  chapterStardustWithin,
  chapterTemporalFluidity,
  energeticSovereigntyTimeQuality,
  prologueOpeningVerbatim,
  prologueSummary,
} from '@/lib/manuscriptWebsiteCopy';

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
    <main className="min-h-screen bg-structural-grid pb-24">
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <p className="text-lg text-cyan-300 font-medium mb-4">
            {BOOK_CATALOG.volumeLabel} · {BOOK_CATALOG.series}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-stone-100">{BOOK_CATALOG.title}</h1>
          <h2 className="text-2xl md:text-3xl font-light mb-6 italic text-stone-200">
            Publication {BOOK_CATALOG.publicationDateDisplay}
          </h2>
          <p className="text-sm text-stone-500">{BOOK_CATALOG.bisacShelf}</p>
        </div>
      </section>

      <section id="order" className="max-w-6xl mx-auto py-12 lg:py-16 border-t border-stone-300/30 px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-10">
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

          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-cyan-300">{BOOK_CATALOG.title}</h2>
              <p className="text-base leading-relaxed text-stone-200 mb-6">{BOOK_CATALOG.catalogDescriptionFull}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button href="/order/direct" variant="primary">
                  {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
                </Button>
                <Button href="/about" variant="tertiary">
                  About the paradigm →
                </Button>
              </div>
              <p className="mt-3 text-sm">
                <Link href="/order" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
                  {ORDER_CTA.whereToBuy}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <OrderCommerceStrip />
      </section>

      <section className="max-w-6xl mx-auto py-16 lg:py-20 border-t border-stone-300/30 px-6">
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
                <Fragment key={`${entry.label}-${entry.title}`}>
                  <dt className="text-sm text-cyan-300/90 font-medium border-t border-stone-500/20 pt-6 mt-6 first:mt-0 first:border-t-0 first:pt-0">
                    <span>{entry.label}</span>
                    <span className="text-stone-500 font-normal"> · </span>
                    <span className="text-cyan-200/95">{entry.title}</span>
                  </dt>
                  <dd className="mt-2 text-base text-stone-200 leading-relaxed">{entry.summary}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </div>

        <details className="terminator-border max-w-4xl mx-auto w-full mt-12 md:mt-14">
          <summary className="cursor-pointer list-none rounded-lg bg-cosmic-blue p-8 md:p-10 text-cyan-300 hover:text-cyan-200 font-semibold text-lg md:text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg">
            Inside the book (back cover &amp; back matter) →
          </summary>
          <div className="p-8 md:p-10 bg-cosmic-blue rounded-b-lg border-t border-stone-500/20 space-y-12">
            <div aria-labelledby="back-cover-heading">
              <h3 id="back-cover-heading" className="text-xl font-semibold text-cyan-300 mb-6">
                From the back cover
              </h3>
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
              </div>
            </div>

            <div className="pt-8 border-t border-stone-500/25">
              <h3 className="text-xl font-semibold text-cyan-300 mb-6">{BOOK_ONE_BACK_MATTER.heading}</h3>
              <dl>
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
                <h4 className="text-lg font-semibold text-cyan-300 mb-2">{BOOK_ONE_BACK_MATTER.fourFunctions.heading}</h4>
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
        </details>
      </section>

      <section
        id="from-the-manuscript"
        className="scroll-mt-28 max-w-6xl mx-auto py-16 lg:py-20 border-t border-stone-300/30 px-6"
      >
        <h2 className="text-xl font-semibold text-cyan-300 mb-2">From the manuscript</h2>
        <p className="text-sm text-stone-400 leading-relaxed mb-8 max-w-prose">
          Short excerpts with a little surrounding context so you can feel how the argument moves.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div id="prologue-excerpt" className="scroll-mt-28">
            <ExpandableExcerpt
              label="Prologue"
              title="Before Form, I Witnessed You"
              excerpt={prologueOpeningVerbatim.first}
              fullText={prologueOpeningVerbatim.continuation}
              paraphrase={{ text: prologueSummary }}
            />
          </div>
          <ExpandableExcerpt
            label="Reader map · 2"
            title="The Body as Advanced Biological Technology"
            excerpt={bodyAsTechnologyTeaser.excerpt}
            italicExcerpt={bodyAsTechnologyTeaser.italic}
            paraphrase={{ text: bodyAsTechnologyTeaser.summary }}
          />
        </div>

        <details className="mt-14 max-w-5xl mx-auto">
          <summary className="cursor-pointer text-cyan-300 hover:text-cyan-200 underline underline-offset-4 font-medium text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm">
            More chapter excerpts →
          </summary>
          <div className="mt-6">
            <div className="terminator-border">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-base font-medium text-cyan-300 mb-2">Reader map · 1: The Stardust Within</h4>
                    <div className="space-y-3 text-base leading-relaxed text-stone-200">
                      <p>{chapterStardustWithin.verbatimLead}</p>
                      <p className="italic text-stone-300">{chapterStardustWithin.verbatimQuote}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-500/25">
                      <p className="text-sm text-stone-400 leading-relaxed">{chapterStardustWithin.summary}</p>
                    </div>
                  </div>
                  <div className="border-t border-cyan-400/30 pt-6">
                    <h4 className="text-base font-medium text-cyan-300 mb-2">
                      Reader map · 5: Energetic Sovereignty (time as quality)
                    </h4>
                    <p className="text-base leading-relaxed text-stone-200 italic">
                      {energeticSovereigntyTimeQuality.verbatim}
                    </p>
                    <div className="mt-4 pt-3 border-t border-stone-500/25">
                      <p className="text-sm text-stone-400 leading-relaxed">{energeticSovereigntyTimeQuality.summary}</p>
                    </div>
                  </div>
                  <div className="border-t border-cyan-400/30 pt-6">
                    <h4 className="text-base font-medium text-cyan-300 mb-2">Reader map · 9: Temporal Fluidity</h4>
                    <p className="text-base leading-relaxed text-stone-200">{chapterTemporalFluidity.verbatim}</p>
                    <div className="mt-4 pt-3 border-t border-stone-500/25">
                      <p className="text-sm text-stone-400 leading-relaxed">{chapterTemporalFluidity.summary}</p>
                    </div>
                  </div>
                  <div className="border-t border-cyan-400/30 pt-6">
                    <h4 className="text-base font-medium text-cyan-300 mb-2">Reader map · 6: Stepping Beyond Limitations</h4>
                    <p className="text-base leading-relaxed text-stone-200 italic">&ldquo;{arcMemory.verbatim}&rdquo;</p>
                    <div className="mt-4 pt-3 border-t border-stone-500/25">
                      <p className="text-sm text-stone-400 leading-relaxed">{arcMemory.summary}</p>
                    </div>
                  </div>
                  <div className="border-t border-cyan-400/30 pt-6">
                    <h4 className="text-base font-medium text-cyan-300 mb-2">Reader map · 12: The Sovereign Field</h4>
                    <p className="text-base leading-relaxed text-stone-200 mb-3">{chapterSovereignField.verbatim}</p>
                    <p className="text-base leading-relaxed text-stone-200 italic">{chapterSovereignField.verbatimClosing}</p>
                    <div className="mt-4 pt-3 border-t border-stone-500/25">
                      <p className="text-sm text-stone-400 leading-relaxed">{chapterSovereignField.summary}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>

        <div className="text-center mt-12">
          <Button href="/order/direct" variant="primary" className="text-lg">
            {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
          </Button>
          <p className="mt-3 text-sm">
            <Link href="/order" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
              {ORDER_CTA.whereToBuy}
            </Link>
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 lg:py-20 border-t border-stone-300/30 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full">
              <h3 className="text-xl font-semibold text-cyan-300">Book Two: The Living Civilization</h3>
              <p className="text-sm text-cyan-300/80 mt-2 mb-3">Scale: Collective Coherence</p>
              <p className="text-base leading-relaxed text-stone-200">
                Collective coherence: how sovereignty scales through families, communities, and planetary systems.
              </p>
            </div>
          </div>
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full">
              <h3 className="text-xl font-semibold text-cyan-300">Book Three: The Resonant Species</h3>
              <p className="text-sm text-cyan-300/80 mt-2 mb-3">Scale: Cosmic Participation</p>
              <p className="text-base leading-relaxed text-stone-200">
                Species-level participation in cosmic intelligence: embodiment expanded and fully retained.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-12 lg:py-16 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <h2 className="text-xl font-semibold text-cyan-300 mb-3">How the books and Console work together</h2>
            <p className="text-base leading-relaxed text-stone-200">
              The Console applies what the books present. Source Field deepens it. Together they move from structure to
              understanding to real-time navigation.
            </p>
          </div>
        </div>
      </section>

      <OrderCommerceStrip variant="sticky" />
    </main>
  );
}
