import Link from 'next/link';
import Button from '@/components/ui/Button';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function ConsolePage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-stone-100 tracking-tight">
              The Console
            </h1>
            <h2 className="text-xl md:text-2xl font-light mb-2 text-stone-200 italic">
              A digital interface for interacting with the material.
            </h2>
            <p className="text-lg md:text-xl font-medium mb-6 text-cyan-300">
              Coming soon.
            </p>
            <p className="text-base text-cyan-300/80 max-w-2xl mx-auto">
              A living system in active development. Content evolves continuously. The architecture becomes operational through recognition.
            </p>
          </div>
        </section>

        {/* What the Console Is */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                    What the Console Is
                  </h2>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    This digital interface works with the structures the books reveal. Recognition comes first. Navigation follows. Personalization emerges from that foundation.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    Through structural mapping and real-time application, the architecture becomes operational. The interface reads current orientation through the Sovereign Field Inquiry, revealing how the system is perceiving, organizing, and moving.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    Through the Codex, this interface supports exploration of the book and all the content essays that the book is written from. The digital interaction navigates a living system that evolves continuously as new content is added.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                    How It Works
                  </h2>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    Recognition precedes navigation. Navigation enables personalization. This sequence operates through the Resonance-Based Intelligence (RBI) system, patent pending. The interface measures coherence between current state and the design revealed in Book One. Patterns become visible. Pathways emerge.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    Structural mapping reveals orientation and responds with relevant practices, Codex entries, and pathways aligned with the underlying design. The interface adapts as the system evolves.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    The Codex updates continuously with new essays and content, often daily. The system remains alive, revealing fresh perspectives and deepening exploration of the design. This digital interface navigates the living system through dynamic interaction, evolving alongside the material it operationalizes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What the Console Provides */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                    What the Console Provides
                  </h2>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    This digital interface operationalizes the architecture revealed in Book One. It works with the structures already present, mapping orientation and providing pathways aligned with recognition.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Recognition comes first. When the underlying design becomes visible, navigation and personalization follow naturally. The interface supports this sequence through structural mapping, Codex integration, and real-time orientation. As the system evolves, the interface evolves with it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connection to Book One */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                    The Connection
                  </h2>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-base leading-relaxed text-stone-200 mb-4">
                    Book One shows the foundational design: the structure of the Sovereign System, constellation of intelligences, and the coherence design underlying perception, identity, and time. This digital interface works with those structures.
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Through recognition, the architecture becomes operational. The interface maps current orientation and reveals pathways aligned with the underlying design. Together, Book One and the Console form a complete system: structure meets operationalization, design meets navigation. The system continues to evolve as new content is added.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Early Access */}
        <section className="py-16 lg:py-24 border-t border-stone-300/30 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  Early Access for Preorder Participants
                </h2>
                <p className="text-base leading-relaxed text-stone-200 mb-6">
                  Console access will be announced via email to all Book One preorder participants. Targeting mid-February 2026, though it may be available sooner. Preorder Book One to secure early access.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button href="/preorder" variant="primary" className="text-lg">
                    Preorder Book One →
                  </Button>
                  <Button href="/books" variant="secondary" className="text-lg">
                    Learn More About Book One →
                  </Button>
                </div>
                <div className="terminator-border max-w-md mx-auto">
                  <div className="p-6 bg-cosmic-blue rounded-lg">
                    <p className="text-base text-stone-200 mb-4">
                      Get notified when the Console launches:
                    </p>
                    <NewsletterSignup />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
