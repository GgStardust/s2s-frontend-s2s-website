import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import PresaleBanner from '@/components/PresaleBanner';
import TestimonialsTicker from '@/components/TestimonialsTicker';
import { BUTTON_LABELS, HOMEPAGE_HERO, MIXAM_ORDER_URL } from '@/lib/content';

export const metadata: Metadata = {
  title: {
    absolute: 'Stardust to Sovereignty | Book One: The Cosmic Tapestry',
  },
  description: 'How consciousness, the body, and identity function as a coherent field of intelligence. Book One: The Cosmic Tapestry available now. Recognition, alignment, and sovereignty.',
  keywords: ['Stardust to Sovereignty', 'consciousness technology', 'sovereign field', 'coherence system', 'Book One The Cosmic Tapestry', 'Gigi Stardust', 'resonance-based intelligence', 'RBI'],
  openGraph: {
    title: 'Stardust to Sovereignty | Book One: The Cosmic Tapestry',
    description: 'How consciousness, the body, and identity function as a coherent field of intelligence. Book One: The Cosmic Tapestry available now.',
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
      <section className="max-w-6xl mx-auto pt-8 px-6">
        <PresaleBanner variant="full" />
      </section>

      {/* Book-first hero: cover + The Cosmic Tapestry */}
      <section className="max-w-6xl mx-auto py-12 lg:py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Cover */}
          <div className="flex justify-center md:justify-end order-2 md:order-1">
            <div className="terminator-border w-fit">
              <div className="p-4 bg-cosmic-blue rounded-lg">
                <div className="relative rounded overflow-hidden shadow-lg">
                  <Image
                    src="/book-cover.png"
                    alt="The Cosmic Tapestry, Book One by Gigi Stardust. Stardust to Sovereignty series."
                    width={320}
                    height={480}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Book title + intro + CTAs */}
          <div className="text-center md:text-left order-1 md:order-2">
            <p className="text-sm uppercase tracking-wider text-cyan-300/90 mb-2">
              Stardust to Sovereignty
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-stone-100 mb-2">
              The Cosmic Tapestry
            </h1>
            <p className="text-lg text-stone-300 mb-4">Book One</p>
            <p className="text-lg leading-relaxed text-stone-200 mb-4">
              {HOMEPAGE_HERO.bookSubtitle}
            </p>
            <p className="text-base text-stone-400 mb-8">
              <Link href="/about" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">
                {HOMEPAGE_HERO.fromParadigm}
              </Link>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button href={MIXAM_ORDER_URL} variant="primary" external>
                Get your copy
              </Button>
              <Button href="/books" variant="secondary">
                Read excerpts
              </Button>
              <Button href="/about" variant="tertiary">
                {BUTTON_LABELS.aboutBook}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* A Report from the Field */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  A Report from the Field
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">Reflections from early readers engaging with the manuscript.</span>
                </div>
              </div>
              <div className="lg:col-span-3">
                <TestimonialsTicker />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
