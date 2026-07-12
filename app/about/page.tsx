import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import BookProseAxioms from '@/components/book-vessel/BookProseAxioms';
import BookProsePull from '@/components/book-vessel/BookProsePull';
import BookSeriesEyebrow from '@/components/book-vessel/BookSeriesEyebrow';
import OrbsConstellation from '@/components/OrbsConstellation';
import { ORDER_CTA } from '@/lib/content';
import { BOOK_CATALOG, PRICING, BACK_COVER_COPY } from '@/lib/publishingMetadata';
import { howToReadVerbatim, introductionOpeningFollow } from '@/lib/manuscriptWebsiteCopy';
import {
  ABOUT_AUTHOR,
  ABOUT_INSIDE_THE_BOOK,
  ABOUT_ORBS_INTRO,
  ABOUT_SYSTEM_CONTEXT,
  ABOUT_WHY_NOW,
  BOOK_EPIGRAPH,
  BOOK_SERIES_CONTEXT,
} from '@/lib/homepageCopy';

export const metadata: Metadata = {
  title: `About · ${BOOK_CATALOG.title}`,
  description: `${BOOK_CATALOG.title} (${BOOK_SERIES_CONTEXT}). ${BOOK_CATALOG.catalogDescriptionShort}`,
  openGraph: {
    title: `About · ${BOOK_CATALOG.title}`,
    description: BOOK_CATALOG.catalogDescriptionShort,
  },
};

const [projectArchitecture, projectOntology, projectForms] = ABOUT_SYSTEM_CONTEXT.body;
const [authorEssence, ...authorRest] = ABOUT_AUTHOR.body;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <section className="max-w-3xl mx-auto py-14 md:py-18 px-6 text-center border-b border-stone-300/15">
        <BookSeriesEyebrow className="mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 font-serif">
          {BOOK_CATALOG.title}
        </h1>
        <p className="text-base text-stone-400 mt-3 font-sans">{BOOK_CATALOG.author}</p>
      </section>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-12 md:space-y-14">
        <blockquote className="border-l-2 border-stone-500/40 pl-5 md:pl-6">
          <p className="text-lg md:text-xl leading-relaxed text-stone-300 italic font-serif">{BOOK_EPIGRAPH}</p>
        </blockquote>

        <p className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">{introductionOpeningFollow}</p>

        <p className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">{ABOUT_WHY_NOW.body}</p>

        <div className="space-y-5 pt-2 border-t border-stone-300/15">
          <h2 className="text-section-title font-semibold text-stone-200 font-serif pt-6">Inside the book</h2>
          {ABOUT_INSIDE_THE_BOOK.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="pt-2 border-t border-stone-300/15">
          <h2 className="text-section-title font-semibold text-stone-200 font-serif pt-6 mb-6">
            {ABOUT_SYSTEM_CONTEXT.heading}
          </h2>
          <div className="book-section-panel">
            <p className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">{ABOUT_SYSTEM_CONTEXT.lead}</p>
            <p className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">{projectArchitecture}</p>
            <BookProsePull>{projectOntology}</BookProsePull>
            <p className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">{projectForms}</p>
          </div>
        </div>

        <BookProseAxioms lines={BACK_COVER_COPY.principleLines} />

        <details className="pt-2 border-t border-stone-300/15 group">
          <summary className="cursor-pointer list-none pt-6 text-section-title font-semibold text-stone-200 font-serif hover:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 rounded-sm">
            Thirteen capacities named in the book →
          </summary>
          <div className="mt-6 space-y-6">
            <p className="text-base leading-relaxed text-stone-400 font-serif">{ABOUT_ORBS_INTRO}</p>
            <OrbsConstellation />
          </div>
        </details>

        <div className="space-y-5 pt-2 border-t border-stone-300/15">
          <h2 className="text-section-title font-semibold text-stone-200 font-serif pt-6">Reading the book</h2>
          {howToReadVerbatim.map((p) => (
            <p key={p.slice(0, 48)} className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
              {p}
            </p>
          ))}
        </div>

        <div className="pt-2 border-t border-stone-300/15">
          <h2 className="text-section-title font-semibold text-stone-200 font-serif pt-6 mb-6">{ABOUT_AUTHOR.heading}</h2>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <Image
              src="/author-gigi-stardust.jpg"
              alt={`${BOOK_CATALOG.author}, author of ${BOOK_CATALOG.title}`}
              width={300}
              height={400}
              className="w-44 sm:w-52 h-auto shrink-0 rounded-sm"
            />
            <div className="space-y-5 min-w-0">
              <BookProsePull>{authorEssence}</BookProsePull>
              {authorRest.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-300/15 text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/order/direct" variant="primary" className="px-8">
              {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
            </Button>
            <Button href="/books" variant="secondary" className="px-8">
              Read an excerpt
            </Button>
          </div>
          <p className="text-sm font-sans">
            <Link href="/order" className="text-stone-500 hover:text-stone-300 underline underline-offset-4">
              {ORDER_CTA.whereToBuy}
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
