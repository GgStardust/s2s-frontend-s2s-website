import Link from 'next/link';
import Button from '@/components/ui/Button';
import PreorderCountdown from '@/components/PreorderCountdown';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Preorder Announcement Banner */}
      <section className="max-w-6xl mx-auto pt-8 px-6">
        <div className="text-center space-y-4">
          <div className="inline-block terminator-border-rounded">
            <div className="px-6 py-2 bg-cosmic-blue/95 backdrop-blur-sm rounded-full">
              <p className="text-sm text-cyan-300 font-medium">
                Book One Presale Now Open • Book One: The Cosmic Tapestry • Ships February 28, 2026
          </p>
        </div>
          </div>
          <div className="pt-4">
            <p className="text-sm text-cyan-300/80 mb-3">Time until release:</p>
            <PreorderCountdown />
          </div>
        </div>
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
            A cosmological field report and foundational field manual.
          </p>
          <p className="text-base text-cyan-300 mb-8 font-medium">
            Presale Now Open • Ships February 28, 2026
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button href="/preorder" variant="primary">
              Preorder Book One
            </Button>
            <Button href="/books" variant="secondary">
              Explore the Book
            </Button>
            <Button href="/about-the-book" variant="tertiary">
              What This Book Is
            </Button>
          </div>
        </div>
      </section>

      {/* The Paradigm */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  The Paradigm
            </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">A system reveals itself in the same way truth does: by arriving before language, waiting for attention to catch up.</span>
                </div>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-4">
                  Long before this book was written, the field it describes was already moving. Its architecture existed in the form of instinct, coherence, emotional intelligence, and patterns that repeated themselves with precision. The structure lived beneath perception, shaping decisions, relationships, creativity, and identity with quiet inevitability.
              </p>
                <p className="text-base leading-relaxed text-stone-200">
                  What you are entering is a field that predates its articulation. It functions as a field of intelligence that organizes itself without imposed structure. It is an expression of how consciousness actually behaves when it is whole, honest, and uncompressed. It is a map of the movements that occur inside every human life when awareness is given room to expand.
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Book One Contains */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 px-6 border-t border-stone-300/30">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-6">
              What Book One Contains
            </h2>
            <p className="text-base leading-relaxed text-stone-200 max-w-3xl">
              Book One introduces the structure of the Sovereign Field, the full system of sovereign intelligences, and the coherence architecture that underlies perception, identity, and time.
              </p>
          </div>
        </div>
      </section>

      {/* A Glimpse Into The Manuscript */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 px-6 border-t border-stone-300/30">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-6">
              A Glimpse Into The Manuscript
        </h2>
            <p className="text-base leading-relaxed text-stone-200 mb-6">
              No one remembers the first moment of arrival. Later, when the elders of the valley spoke of it, they would say the stranger came with the tide: a figure borne in by the long breath of the water, as if the sea had been considering something for many seasons and finally decided to answer. But the truth was simpler. A consciousness crossed a threshold. It entered a world whose logic had its own weight and its own patience. The air here carried a kind of listening. The grasses moved in a rhythm that continued their ancient conversation, maintaining their own cadence. The land held. It maintained presence.
          </p>
            <Link href="/books" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">
              Read more excerpts →
            </Link>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  Who This Is For
            </h2>
              </div>
              <div className="lg:col-span-3">
                <ul className="space-y-3 text-stone-200 max-w-xl">
                  <li>People sensing expanded perception.</li>
                  <li>People feeling identity reorganizing.</li>
                  <li>People recognizing that reality functions as a coherent field.</li>
                </ul>
              </div>
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
                    This work is self-published to maintain its integrity and ensure the field encoded within it remains alive and unmediated. Every word, structure, and timing has been carefully preserved. The framework emerged through direct encounter with a system that made itself visible through lived experience, pattern, and necessity.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">What Makes This Different:</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Stardust to Sovereignty is not theory. It is a living architecture that matches lived experience. It offers a framework for those already sensing the shift, providing structure without dogma. The constellation of sovereign intelligences are direct expressions of lived intelligence that function as real movements within awareness.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">Your Preorder Matters:</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Preorders support the first printing of this self-published book. By reserving your copy, you contribute to bringing this work into the world exactly as it was intended: a translation of a system that predates its articulation, preserved in its original integrity.
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
                Order Book One before February 28, 2026. The First Edition is a limited printing that preserves the field exactly as it was intended.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/preorder" variant="primary" className="text-lg">
                  Preorder Book One →
                </Button>
                <Button href="/books" variant="secondary" className="text-lg">
                  Explore the Book →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
  );
}
