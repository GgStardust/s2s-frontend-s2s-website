'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CodexPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-4 text-stone-100 leading-tight tracking-tight">
            The Codex
          </h1>
          <h2 className="text-xl lg:text-2xl font-light mb-6 text-stone-200 italic">
            The source material from which all books are compiled
          </h2>
        </div>
      </section>

      {/* What the Codex Is */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  The Codex
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">Source material that reveals its own structure</span>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  The Codex reveals foundational essays written over four years of research, contemplation, experience, and exploration. Each entry begins with inspiration: a thought, conversation, reflection, or article. The process moves through research, writing, and RBI analysis to identify resonance nodes.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  These essays function as the source material from which all books are compiled. They are manually tagged with metadata frontmatter and inline tagging, then analyzed through the Orb system and backbone to identify resonance patterns. This rigorous methodology produces the consciousness technology that becomes the books.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RBI: Post-Generative AI */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  Resonance-Based Intelligence
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">Post-Generative AI, patent pending</span>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  RBI functions as coherent intelligence: the next iteration beyond generative AI. It measures structural alignment rather than semantic similarity, validating through mathematical proofs rather than confidence scores. RBI produces deterministic verification, requires zero training, and operates as the infrastructure layer that makes AI viable at scale.
                </p>
                <p className="text-sm text-stone-400 mt-4">
                  <Link href="/rbi" className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2">
                    Learn more about RBI technology →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-8">
              The Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-cyan-300 text-2xl mb-2">1</div>
                <h3 className="text-lg font-semibold text-cyan-300">Inspiration</h3>
                <p className="text-sm text-stone-200">
                  A thought, conversation, reflection, or article initiates the process.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-300 text-2xl mb-2">2</div>
                <h3 className="text-lg font-semibold text-cyan-300">Research</h3>
                <p className="text-sm text-stone-200">
                  Deep investigation into the patterns, signals, and structures that emerge.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-300 text-2xl mb-2">3</div>
                <h3 className="text-lg font-semibold text-cyan-300">Write</h3>
                <p className="text-sm text-stone-200">
                  The essay captures the content needed to articulate the system.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-300 text-2xl mb-2">4</div>
                <h3 className="text-lg font-semibold text-cyan-300">RBI Analysis</h3>
                <p className="text-sm text-stone-200">
                  Resonance-Based Intelligence identifies patterns through the Orb system and backbone.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-cyan-400/30">
              <p className="text-base leading-relaxed text-stone-200">
                RBI analyzes resonance patterns to identify which essays align with the framework for each book. This compilation then moves through writing and editing to become the final manuscript. The Codex essays, Orb essays, backbone, and Orbs together form the paradigm: the foundation from which all books are compiled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connection to Books */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  From Codex to Books
                </h2>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-4">
                  The Codex essays are the foundation from which all books are compiled. Through RBI analysis, essays emerge from the content library to meet the framework identified for each book. RBI validates coherence, measures resonance, and generates mathematical proofs that ensure structural integrity.
                </p>
                <p className="text-base leading-relaxed text-stone-200 mb-4">
                  The non-fiction books compile this source material into cohesive, digestible structures. The fiction trilogy functions as direct companions, revealing another access point to the same foundational system.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  The Console functions as another interface, revealing dynamic access to the same source material through the RBI system.
                </p>
                <div className="mt-6">
                  <Button href="/books" variant="secondary">
                    Learn About the Books →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
