import { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/NewsletterSignup';
import PresaleBanner from '@/components/PresaleBanner';
import { PRESALE_INFO, BOOK_DESCRIPTIONS, BUTTON_LABELS, HOMEPAGE_SECTIONS } from '@/lib/content';

export const metadata: Metadata = {
  title: {
    absolute: 'Stardust to Sovereignty | Book One: The Cosmic Tapestry',
  },
  description: 'A cosmological framework for understanding how consciousness, the body, and identity function. Preorder Book One: The Cosmic Tapestry - Ships February 28, 2026. Discover how consciousness operates as structure and how to move from fragmentation to coherence.',
  keywords: ['Stardust to Sovereignty', 'consciousness technology', 'sovereign field', 'coherence system', 'Book One The Cosmic Tapestry', 'preorder', 'Gigi Stardust', 'resonance-based intelligence', 'RBI'],
  openGraph: {
    title: 'Stardust to Sovereignty | Book One: The Cosmic Tapestry',
    description: 'A cosmological framework for understanding how consciousness, the body, and identity function. Preorder Book One: The Cosmic Tapestry - Ships February 28, 2026.',
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
          <p className="text-lg lg:text-xl leading-relaxed text-stone-200 max-w-2xl mx-auto mb-4">
            {BOOK_DESCRIPTIONS.bookOne.subtitle}
          </p>
          <p className="text-base lg:text-lg leading-relaxed text-stone-200 max-w-2xl mx-auto mb-4">
            {BOOK_DESCRIPTIONS.bookOne.subtitleExtended}
          </p>
          <p className="text-base text-cyan-300 mb-8 font-medium">
            {PRESALE_INFO.announcement}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
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

      {/* About This Work - Celebratory */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  About This Work
        </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">A translation of lived experience</span>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">Why Self-Published:</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Preserves the system exactly as it emerged, without editorial mediation. Every word maintains what appeared through direct encounter.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">What Makes This Different:</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Shows how consciousness operates as structure. When you recognize and align with your internal design, fragmentation decreases, clarity increases, and coherence emerges naturally.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">Your Preorder Matters:</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Supports the first printing and reserves your First Edition copy. Order before February 28, 2026.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Begin Your Journey */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                Reserve Your First Edition Copy
              </h2>
              <p className="text-base leading-relaxed text-stone-200 mb-4 max-w-2xl mx-auto">
                Book One reveals how consciousness operates as structure: recognizing internal design, clearing distortion, and moving from fragmentation to coherence.
              </p>
              <p className="text-base leading-relaxed text-stone-200 mb-6 max-w-2xl mx-auto">
                Reserve your First Edition copy before February 28, 2026.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/preorder" variant="primary" className="text-lg">
                  Preorder Book One →
                </Button>
                <Button href="/books" variant="secondary" className="text-lg">
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
