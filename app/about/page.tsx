import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-stone-100 tracking-tight">
            Stardust to Sovereignty
          </h1>
          <p className="text-xl md:text-2xl font-medium text-cyan-300 leading-relaxed mb-6">
            A system architecture that brings structure into view.
          </p>
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
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  Consciousness behaves as structure. The same laws that govern stellar formation and electromagnetic fields govern the human nervous system, cellular communication, and relational behavior. Humans are a localized expression of cosmic order.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  Consciousness is structural and lawful. Its effects are observable in perception, decision making, and relational dynamics. Perception reorganizes. Coherence stabilizes as alignment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Exists */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  Why This Exists
                </h2>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  Stardust to Sovereignty exists because human experience unfolds across interacting biological, perceptual, relational, and technological systems without a shared structural map. These domains influence one another continuously, yet they are rarely understood as a single coherent field.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  This system was developed to make structure legible. It reveals the structural principles that govern coherence, stabilize perception, and support reliable decision making across time and context. Stardust to Sovereignty is an integrated architectural framework that enables orientation within complexity through alignment rather than interpretation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Consciousness Technology */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  A Consciousness Technology
                </h2>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  Stardust to Sovereignty is a consciousness technology built as a system architecture. The technology consists of coherent structural principles that describe how intelligence organizes, stabilizes, and transmits across biological, perceptual, relational, and temporal domains.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  This underlying architecture operates independently of its expressions. The Book, Codex, and Console function as interfaces that surface and apply the system, while the technology itself resides in the core system from which these expressions are generated. The system functions by making structure legible, operable, and usable within lived experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Button href="/preorder" variant="primary">
            Preorder Book One
          </Button>
          <Button href="/codex" variant="secondary">
            Explore Codex
          </Button>
        </div>
      </section>
    </main>
  );
}
