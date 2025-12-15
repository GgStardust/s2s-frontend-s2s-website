import { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/NewsletterSignup';
import PresaleBanner from '@/components/PresaleBanner';
import TestimonialsTicker from '@/components/TestimonialsTicker';
import { PRESALE_INFO, BOOK_DESCRIPTIONS, BUTTON_LABELS, HOMEPAGE_SECTIONS } from '@/lib/content';

export const metadata: Metadata = {
  title: {
    absolute: 'Stardust to Sovereignty | Book One: The Cosmic Tapestry',
  },
  description: 'A consciousness architecture that reveals the shared organizing principles of galaxies, biology, and human perception. Preorder Book One: The Cosmic Tapestry - Ships February 28, 2026.',
  keywords: ['Stardust to Sovereignty', 'consciousness technology', 'sovereign field', 'coherence system', 'Book One The Cosmic Tapestry', 'preorder', 'Gigi Stardust', 'resonance-based intelligence', 'RBI'],
  openGraph: {
    title: 'Stardust to Sovereignty | Book One: The Cosmic Tapestry',
    description: 'A consciousness architecture that reveals the shared organizing principles of galaxies, biology, and human perception. Preorder Book One: The Cosmic Tapestry - Ships February 28, 2026.',
    url: 'https://stardusttosovereignty.com',
    siteName: 'Stardust to Sovereignty',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://stardusttosovereignty.com',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Preorder Announcement Banner */}
      <section className="max-w-6xl mx-auto pt-8 px-6">
        <PresaleBanner variant="full" />
      </section>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-4 text-stone-100 leading-tight tracking-tight">
            Stardust to Sovereignty
          </h1>
          <h2 className="text-2xl lg:text-3xl font-light mb-2 text-stone-200">
            Book One
          </h2>
          <h3 className="text-xl lg:text-2xl font-light mb-6 text-stone-200 italic">
            The Cosmic Tapestry
          </h3>
          <p className="text-lg lg:text-xl leading-relaxed text-stone-200 max-w-2xl mx-auto mb-8">
            {BOOK_DESCRIPTIONS.bookOne.subtitleExtended}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/preorder" variant="primary">
              {BUTTON_LABELS.preorder}
            </Button>
            <Button href="/books" variant="secondary">
              {BUTTON_LABELS.insideBook}
            </Button>
            <Button href="/about-the-book" variant="tertiary">
              {BUTTON_LABELS.aboutBook}
            </Button>
          </div>
        </div>
      </section>

      {/* Early Reader Reflections Section */}
      <section className="max-w-6xl mx-auto py-12 lg:py-16 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-6 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  Early Reader Reflections
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">From early readers engaging with the manuscript.</span>
                </div>
              </div>
              <div className="lg:col-span-3">
                <TestimonialsTicker />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Box Grid: Paradigm and Glimpse */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: The Paradigm */}
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full">
              <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-cyan-300 mb-4">
                The Paradigm
              </h2>
              <p className="text-base leading-relaxed text-stone-200 mb-3">
                {HOMEPAGE_SECTIONS.paradigm.paragraph1}
              </p>
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                {HOMEPAGE_SECTIONS.paradigm.paragraph2}
              </p>
              <Link href="/about-the-book" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 text-sm inline-block">
                The full paradigm →
              </Link>
            </div>
          </div>

          {/* Box 2: A Glimpse Into The Manuscript */}
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full">
              <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-cyan-300 mb-4">
                A Glimpse Into The Manuscript
              </h2>
              <p className="text-base leading-relaxed text-stone-200 mb-3 font-medium">
                {HOMEPAGE_SECTIONS.glimpse.paragraph1}
              </p>
              <p className="text-base leading-relaxed text-stone-200 mb-3">
                {HOMEPAGE_SECTIONS.glimpse.paragraph2}
              </p>
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                {HOMEPAGE_SECTIONS.glimpse.paragraph3}
              </p>
              <Link href="/books" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 text-sm inline-block">
                Read more excerpts →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About This Publication - Presale & Self-Publishing */}
      <section className="max-w-6xl mx-auto py-12 lg:py-16 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-6 bg-cosmic-blue rounded-lg">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-cyan-300 mb-4">
                About This Publication
              </h2>
              <p className="text-sm leading-relaxed text-stone-200 mb-6">
                Self-published to preserve the writing and system without compromise. No editorial mediation. The framework appears exactly as intended.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/preorder" variant="primary">
                  Preorder Book One →
                </Button>
                <Button href="/books" variant="secondary">
                  Inside Book One →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
  );
}
