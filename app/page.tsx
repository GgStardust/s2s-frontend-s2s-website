import { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/NewsletterSignup';
import PresaleBanner from '@/components/PresaleBanner';
import AudienceCarousel from '@/components/AudienceCarousel';
import { PRESALE_INFO, BOOK_DESCRIPTIONS, BUTTON_LABELS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Stardust to Sovereignty | Book One: The Cosmic Tapestry',
  description: 'A living architecture for coherence, perception, and sovereign identity. Preorder Book One: The Cosmic Tapestry - Ships February 28, 2026. Discover the Sovereign Field and the full system of sovereign intelligences through consciousness technology.',
  keywords: ['Stardust to Sovereignty', 'consciousness technology', 'sovereign field', 'coherence system', 'Book One The Cosmic Tapestry', 'preorder', 'Gigi Stardust', 'resonance-based intelligence', 'RBI'],
  openGraph: {
    title: 'Stardust to Sovereignty | Book One: The Cosmic Tapestry',
    description: 'A living architecture for coherence, perception, and sovereign identity. Preorder Book One: The Cosmic Tapestry - Ships February 28, 2026.',
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

      {/* Who This Is For - Carousel Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-6 text-center">
              Who This Is For
            </h2>
            <AudienceCarousel />
          </div>
        </div>
      </section>

      {/* Four Box Grid: Paradigm, Who This Is For, What Book One Contains, Glimpse */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: The Paradigm */}
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full">
              <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-cyan-300 mb-4">
                The Paradigm
              </h2>
              <p className="text-base leading-relaxed text-stone-200 mb-3">
                Before this book had form, its architecture was already moving through instinct, perception, and coherence. What appears here is the articulation of the system shaping human intelligence from within.
              </p>
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                The structure becomes visible. Identity forms through origin signatures, memory, bodily signal, and temporal experience. Perception operates as structure. Intelligence organizes itself through patterns that repeat with precision.
              </p>
              <Link href="/about-the-book" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 text-sm inline-block">
                The full paradigm →
              </Link>
            </div>
          </div>

          {/* Box 2: Who This Is For */}
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full">
              <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-cyan-300 mb-4">
                Who This Is For
              </h2>
              <p className="text-base leading-relaxed text-stone-200 mb-3">
                You sense the structure beneath experience. You notice patterns before they have names. You recognize that reality functions as a coherent system.
              </p>
              <p className="text-base leading-relaxed text-stone-200">
                The system reveals itself to those already attuned. What appears here matches the complexity you already perceive.
              </p>
            </div>
          </div>

          {/* Box 3: What Book One Contains */}
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full">
              <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-cyan-300 mb-4">
                What Book One Contains
              </h2>
              <p className="text-base leading-relaxed text-stone-200 mb-3">
                Consciousness behaves as structure. Internal patterns operate with precision. The mechanics through which consciousness expresses itself become visible.
              </p>
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                Book One reveals the structure of the Sovereign System, the full constellation of sovereign intelligences, and the coherence design underlying perception, identity, and time.
              </p>
              <Link href="/books" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 text-sm inline-block">
                Detailed contents →
              </Link>
            </div>
          </div>

          {/* Box 4: A Glimpse Into The Manuscript */}
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full">
              <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-cyan-300 mb-4">
                A Glimpse Into The Manuscript
              </h2>
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                No one remembers the first moment of arrival. Later, when the elders of the valley spoke of it, they would say the stranger came with the tide: a figure borne in by the long breath of the water, as if the sea had been considering something for many seasons and finally decided to answer.
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
                    The system encoded here remains alive and unmediated. Every word, structure, and timing preserves what emerged through direct encounter. The framework made itself visible through lived experience, pattern, and necessity.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">What Makes This Different:</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Here, the mechanics of awareness become visible. When aligned with internal design, fragmentation decreases, relational clarity increases, intuition becomes directional, and coherence emerges as a lived state. The constellation of sovereign intelligences function as real movements within awareness.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">Your Preorder Matters:</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Preorders support the first printing. By reserving your copy, you bring this work into the world exactly as it was intended: a translation of a system that predates its articulation, preserved in its original integrity.
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
              <p className="text-base leading-relaxed text-stone-200 mb-6 max-w-2xl mx-auto">
                Order Book One before February 28, 2026. The First Edition preserves the system exactly as it was intended.
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
