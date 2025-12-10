'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import EssayGrid from '@/components/EssayGrid';
import FieldNotesScroll from '@/components/FieldNotesScroll';
import { essays } from '@/content/essays-data';

export default function CodexPage() {

  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-12 lg:py-16 px-6">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-4 text-stone-100 leading-tight tracking-tight">
            The Codex
          </h1>
          <h2 className="text-xl lg:text-2xl font-light mb-6 text-stone-200 italic">
            The source material from which all books are compiled
          </h2>
        </div>
      </section>

      {/* Field Notes / Scrollstream - Moved to top */}
      <FieldNotesScroll />

      {/* Three Info Cards */}
      <section className="max-w-7xl mx-auto py-12 lg:py-16 border-t border-stone-300/30 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: What the Codex Is */}
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cyan-300 text-xl">✦</span>
                <h2 className="text-xl font-semibold tracking-tight text-cyan-300">
                  The Codex
                </h2>
              </div>
              <p className="text-base leading-relaxed text-stone-200 mb-4 flex-grow">
                Foundational essays written over four years of research, contemplation, experience, and exploration. Each entry begins with inspiration, moves through research and writing, then undergoes RBI analysis to identify resonance patterns.
              </p>
              <p className="text-sm text-cyan-300/80 italic">
                Source material that reveals its own structure
              </p>
            </div>
          </div>

          {/* Card 2: RBI Technology */}
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cyan-300 text-xl">✦</span>
                <h2 className="text-xl font-semibold tracking-tight text-cyan-300">
                  RBI Technology
                </h2>
              </div>
              <p className="text-base leading-relaxed text-stone-200 mb-4 flex-grow">
                Resonance-Based Intelligence functions as coherent intelligence: the next iteration beyond generative AI. It measures structural alignment, validates through mathematical proofs, and operates as the infrastructure layer that makes AI viable at scale.
              </p>
              <Link href="/rbi" className="text-sm text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 mt-auto">
                Learn more →
              </Link>
            </div>
          </div>

          {/* Card 3: From Codex to Books (merged with process) */}
          <div className="terminator-border">
            <div className="p-6 bg-cosmic-blue rounded-lg h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cyan-300 text-xl">✦</span>
                <h2 className="text-xl font-semibold tracking-tight text-cyan-300">
                  From Codex to Books
                </h2>
              </div>
              <p className="text-base leading-relaxed text-stone-200 mb-4 flex-grow">
                Essays are compiled through RBI analysis, which identifies resonance patterns and validates coherence. The compilation moves through writing and editing to become manuscripts. Non-fiction books compile this source material; the fiction trilogy and Console provide additional access points.
              </p>
              <Button href="/books" variant="secondary" className="mt-auto">
                Learn About the Books →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Essays Grid with Search and Index */}
      <section className="max-w-7xl mx-auto py-12 lg:py-16 border-t border-stone-300/30 px-6">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
            Codex Essays
          </h2>
          <p className="text-base text-stone-400">
            Foundational essays that reveal the architecture of the system
          </p>
        </div>
        <EssayGrid essays={essays} />
      </section>
    </main>
  );
}
