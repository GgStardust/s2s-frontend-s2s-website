import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import OrderCommerceStrip from '@/components/OrderCommerceStrip';
import TestimonialsTicker from '@/components/TestimonialsTicker';
import { ORDER_CTA, SEARCH_KEYWORDS } from '@/lib/content';
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata';
import {
  HOMEPAGE_ANCHOR_EXCERPT,
  HOMEPAGE_HERO,
  HOMEPAGE_INVITATION,
  HOMEPAGE_LINEAGE,
  HOMEPAGE_PROLOGUE,
  HOMEPAGE_SERIES,
  HOMEPAGE_WHAT_THIS_IS,
  HOMEPAGE_WHO_ITS_FOR,
} from '@/lib/homepageCopy';

export const metadata: Metadata = {
  title: {
    absolute: `The Cosmic Tapestry · ${BOOK_CATALOG.volumeLabel} | ${BOOK_CATALOG.series}`,
  },
  description: BOOK_CATALOG.metaDescription,
  keywords: [...SEARCH_KEYWORDS, BOOK_CATALOG.title, BOOK_CATALOG.author, 'RBI'],
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
    <main className="min-h-screen bg-structural-grid relative z-10 pb-24">
      {/* Hero: minimal title + manuscript orientation (commerce deferred) */}
      <section
        id="home-hero"
        aria-labelledby="home-hero-heading"
        className="scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 md:pt-24 md:pb-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-start">
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="book-cover-wrapper">
              <div className="terminator-border rounded-sm w-fit">
                <div className="rounded-sm p-2 bg-cosmic-blue">
                  <div className="book-cover-inner flex">
                    <div className="relative overflow-hidden rounded-l-sm min-w-0">
                      <Image
                        src="/book-cover.png"
                        alt={`${BOOK_CATALOG.title} by ${BOOK_CATALOG.author}, ${BOOK_CATALOG.series}, ${BOOK_CATALOG.volumeLabel}`}
                        width={320}
                        height={480}
                        className="w-full h-auto block max-w-[280px] lg:max-w-none"
                        priority
                      />
                    </div>
                    <div className="book-cover-spine" aria-hidden />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70">
              {BOOK_CATALOG.volumeLabel} · {BOOK_CATALOG.series}
            </p>
            <div>
              <h1
                id="home-hero-heading"
                className="text-display font-bold text-stone-100 font-sans text-balance"
              >
                {BOOK_CATALOG.title}
              </h1>
              <p className="text-base text-stone-400 mt-2 font-sans">{BOOK_CATALOG.author}</p>
            </div>
            <div className="space-y-4 max-w-xl mx-auto lg:mx-0 text-left">
              <p className="text-lg sm:text-xl leading-relaxed text-stone-200 font-serif italic border-l-2 border-cyan-500/35 pl-5">
                {HOMEPAGE_HERO.lead}
              </p>
              <p className="text-base leading-relaxed text-stone-400 font-sans">{HOMEPAGE_HERO.follow}</p>
            </div>
            <p className="text-xs text-stone-600 font-sans">{BOOK_CATALOG.bisacShelf}</p>
          </div>
        </div>
      </section>

      {/* Anchor excerpt: voice of the book */}
      <section
        id="home-opening"
        aria-labelledby="anchor-excerpt-heading"
        className="scroll-mt-28 max-w-3xl mx-auto px-4 sm:px-6 py-14 md:py-20 border-t border-stone-300/15"
      >
        <h2 id="anchor-excerpt-heading" className="sr-only">
          From the opening chapter
        </h2>
        <blockquote className="space-y-6 font-serif text-stone-200">
          <p className="text-lg md:text-xl italic text-stone-300 leading-relaxed">
            <span className="text-cyan-300/90 not-italic font-sans text-sm uppercase tracking-wider block mb-3">
              The Stardust Within
            </span>
            {HOMEPAGE_ANCHOR_EXCERPT.question}
          </p>
          <p className="text-base md:text-lg leading-relaxed text-stone-100/95">{HOMEPAGE_ANCHOR_EXCERPT.answer}</p>
        </blockquote>
      </section>

      <section className="scroll-mt-28 max-w-3xl mx-auto px-4 sm:px-6 pb-14 md:pb-16">
        <OrderCommerceStrip />
      </section>

      {/* What this is / Who it is for */}
      <section
        id="home-about-book"
        className="scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 border-t border-stone-300/15"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <div className="terminator-border rounded-lg">
            <div className="p-8 md:p-9 bg-cosmic-blue rounded-lg h-full">
              <h2 className="text-section-title font-semibold text-cyan-300 mb-4 font-sans">
                {HOMEPAGE_WHAT_THIS_IS.title}
              </h2>
              <p className="text-base leading-relaxed text-stone-300 font-sans">{HOMEPAGE_WHAT_THIS_IS.body}</p>
            </div>
          </div>
          <div className="terminator-border rounded-lg">
            <div className="p-8 md:p-9 bg-cosmic-blue rounded-lg h-full">
              <h2 className="text-section-title font-semibold text-cyan-300 mb-4 font-sans">
                {HOMEPAGE_WHO_ITS_FOR.title}
              </h2>
              <p className="text-base leading-relaxed text-stone-300 font-sans">{HOMEPAGE_WHO_ITS_FOR.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mythic frame: prologue */}
      <section
        id="home-prologue"
        aria-labelledby="prologue-heading"
        className="scroll-mt-28 border-t border-stone-300/15 bg-black/25 border-b border-stone-500/10"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <h2 id="prologue-heading" className="text-sm uppercase tracking-[0.2em] text-cyan-300/80 mb-2 font-sans">
            Prologue
          </h2>
          <p className="text-xl md:text-2xl font-serif text-stone-100/95 mb-6 leading-snug">{HOMEPAGE_PROLOGUE.title}</p>
          <p className="font-serif text-lg text-stone-300/95 leading-relaxed italic">{HOMEPAGE_PROLOGUE.teaser}</p>
          <p className="mt-8">
            <Link
              href={HOMEPAGE_PROLOGUE.readPrologueHref}
              className="inline-flex min-h-[44px] items-center text-sm text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4 focus:outline-2 focus:outline-cyan-300 focus:outline-offset-2 rounded-sm px-2 py-2 touch-manipulation font-sans"
            >
              {HOMEPAGE_PROLOGUE.readPrologueLabel} →
            </Link>
          </p>
          <p className="mt-10 text-sm uppercase tracking-widest text-cyan-300/70 font-sans">
            {HOMEPAGE_PROLOGUE.closing}
          </p>
        </div>
      </section>

      {/* Series + lineage */}
      <section id="home-series" className="scroll-mt-28 max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-16">
        <div>
          <h2 className="text-section-title font-semibold text-cyan-300 mb-4 font-sans">{HOMEPAGE_SERIES.title}</h2>
          <p className="text-base text-stone-400 leading-relaxed mb-4 font-sans">{HOMEPAGE_SERIES.lead}</p>
          <p className="text-base text-stone-300 leading-relaxed font-sans">{HOMEPAGE_SERIES.bookOne}</p>
        </div>
        <div className="pt-8 border-t border-stone-500/20">
          <h2 className="text-section-title font-semibold text-cyan-300 mb-4 font-sans">{HOMEPAGE_LINEAGE.title}</h2>
          <p className="text-base text-stone-400 leading-relaxed font-serif">{HOMEPAGE_LINEAGE.body.slice(0, 180)}…</p>
          <p className="mt-4">
            <Link
              href="/about"
              className="inline-flex min-h-[44px] items-center text-sm text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4 focus:outline-2 focus:outline-cyan-300 focus:outline-offset-2 rounded-sm px-2 py-2 touch-manipulation font-sans"
            >
              Read the full lineage framing →
            </Link>
          </p>
        </div>
      </section>

      {/* Invitation + primary actions (commerce after immersion) */}
      <section id="home-invitation" className="scroll-mt-28 max-w-3xl mx-auto px-4 sm:px-6 pb-16 md:pb-20 text-center">
        <p className="text-lg md:text-xl font-serif italic text-cyan-200/95 leading-relaxed mb-10">
          {HOMEPAGE_INVITATION.line}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/order/direct" variant="primary" className="text-base px-8">
            {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
          </Button>
          <Link
            href="/books"
            className="inline-flex min-h-[44px] items-center text-sm text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4 focus:outline-2 focus:outline-cyan-300 focus:outline-offset-2 rounded-sm px-2 py-2 touch-manipulation"
          >
            Read excerpts &amp; structure
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-[44px] items-center text-sm text-stone-400 hover:text-stone-300 underline underline-offset-4 focus:outline-2 focus:outline-stone-400 focus:outline-offset-2 rounded-sm px-2 py-2 touch-manipulation"
          >
            About the book
          </Link>
        </div>
      </section>

      {/* Social proof: after narrative (epilogue band; manual controls + pause-off-screen in ticker) */}
      <section
        id="from-readers"
        aria-labelledby="from-readers-heading"
        className="scroll-mt-28 max-w-6xl mx-auto py-14 lg:py-20 border-t border-stone-300/20 px-4 sm:px-6 pb-20"
      >
        <div className="terminator-border rounded-lg">
          <div className="p-6 sm:p-8 md:p-10 bg-cosmic-blue rounded-lg h-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
              <div className="lg:col-span-2">
                <h2
                  id="from-readers-heading"
                  className="text-xl md:text-2xl font-semibold tracking-tight text-cyan-300/95 mb-2 font-sans text-balance"
                >
                  From readers
                </h2>
                <p className="text-sm text-stone-400 leading-relaxed font-sans">
                  Early reflections on the manuscript.
                </p>
              </div>
              <div className="lg:col-span-3">
                <TestimonialsTicker />
              </div>
            </div>
          </div>
        </div>
      </section>

      <OrderCommerceStrip variant="sticky" />
    </main>
  );
}
