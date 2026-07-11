import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import FirstReaders from '@/components/FirstReaders';
import { ORDER_CTA, SEARCH_KEYWORDS } from '@/lib/content';
import { BOOK_CATALOG, PRICING, BACK_COVER_COPY } from '@/lib/publishingMetadata';
import { BOOK_EPIGRAPH, BOOK_HOME_BODY, BOOK_SERIES_CONTEXT } from '@/lib/homepageCopy';
import { AUTHORS_EDITION_LABEL } from '@/lib/orderCopy';

export const metadata: Metadata = {
  title: {
    absolute: `The Cosmic Tapestry · ${BOOK_CATALOG.volumeLabel} | ${BOOK_CATALOG.series}`,
  },
  description:
    'The Cosmic Tapestry (Book One): a paperback map of recognition from stellar origin through the body to sovereign participation. Read excerpts or order the Author\'s Edition.',
  keywords: [...SEARCH_KEYWORDS, BOOK_CATALOG.title, BOOK_CATALOG.author],
  openGraph: {
    title: `The Cosmic Tapestry · ${BOOK_CATALOG.volumeLabel} | ${BOOK_CATALOG.series}`,
    description: BOOK_CATALOG.catalogDescriptionShort,
    url: 'https://stardusttosovereignty.com',
    siteName: BOOK_CATALOG.series,
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://stardusttosovereignty.com',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-book-vessel relative z-10 pb-20">
      <section
        id="home-hero"
        aria-labelledby="home-hero-heading"
        className="scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10 md:pt-24 md:pb-14"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-start">
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="rounded-sm p-2 bg-cosmic-blue-light/30">
              <Image
                src="/book-cover.png"
                alt={`${BOOK_CATALOG.title} by ${BOOK_CATALOG.author}, ${BOOK_SERIES_CONTEXT}`}
                width={320}
                height={480}
                className="w-full h-auto block max-w-[280px] lg:max-w-[320px] rounded-sm"
                priority
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-5 text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-sans">{BOOK_SERIES_CONTEXT}</p>
            <div>
              <h1
                id="home-hero-heading"
                className="text-display font-bold text-stone-100 font-serif text-balance"
              >
                {BOOK_CATALOG.title}
              </h1>
              <p className="text-base text-stone-400 mt-2 font-sans">{BOOK_CATALOG.author}</p>
            <p className="text-sm text-stone-500 mt-1 font-sans">{AUTHORS_EDITION_LABEL} available here</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-1 justify-center lg:justify-start">
              <Button href="/order/direct" variant="primary" className="px-8">
                {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
              </Button>
              <Link
                href="/books"
                className="inline-flex min-h-[44px] items-center justify-center text-sm text-stone-400 hover:text-stone-200 underline underline-offset-4 focus:outline-2 focus:outline-stone-400/50 focus:outline-offset-2 rounded-sm px-4 touch-manipulation font-sans"
              >
                Read an excerpt
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-14 md:pb-16 border-t border-stone-300/15 pt-12 md:pt-14">
        <div className="text-center mb-10 space-y-1">
          {BACK_COVER_COPY.epigraphLines.map((line) => (
            <p key={line} className="text-base md:text-lg text-stone-500 italic font-serif leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        <blockquote className="border-l-2 border-stone-500/40 pl-5 md:pl-6 mb-12">
          <p className="text-lg md:text-xl leading-relaxed text-stone-300 italic font-serif">{BOOK_EPIGRAPH}</p>
        </blockquote>

        <div className="space-y-6">
          {BOOK_HOME_BODY.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <FirstReaders />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/order/direct" variant="primary" className="px-8">
            {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
          </Button>
          <Link
            href="/books"
            className="inline-flex min-h-[44px] items-center justify-center text-sm text-stone-400 hover:text-stone-200 underline underline-offset-4 px-2 touch-manipulation font-sans"
          >
            Read an excerpt
          </Link>
        </div>
      </section>
    </main>
  );
}
