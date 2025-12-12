import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function AboutTheBookPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <p className="text-lg text-cyan-300 font-medium mb-4">Book One Presale Now Open</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-stone-100">
            About Book One
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-6 italic text-stone-200">
            The Cosmic Tapestry
          </h2>
          <p className="text-base leading-relaxed text-stone-200 max-w-2xl mx-auto">
            A cosmological framework for understanding how consciousness, the body, and identity function.
          </p>
        </div>
      </section>

      {/* Presale Callout */}
      <section className="max-w-6xl mx-auto py-8 px-6">
        <div className="text-center">
          <p className="text-lg text-cyan-300 font-medium mb-2">Book One Presale Now Open</p>
          <p className="text-base text-stone-200">Reserve your First Edition copy before February 28, 2026</p>
        </div>
      </section>

      {/* Opening Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="max-w-3xl">
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                Book One reveals how consciousness operates as structure. It maps the foundational architecture that existed before current separation. The book shows how to recognize and return to this original design, clearing layers of conditioning and distortion to reveal the structure that was always there.
              </p>
              <p className="text-base leading-relaxed text-stone-200">
                From that recovered foundation, consciousness advances with coherence. This is a cosmological framework: a system that shows how consciousness works at both personal and cosmic scales. It reveals that the patterns shaping your identity, memory, and perception follow the same organizing principles that shape the universe itself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Paradigm - Full Section */}
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
                  <span className="text-sm text-cyan-300/80 italic">
                    A cosmological framework connecting personal experience to universal patterns.
                  </span>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  Consciousness behaves as structure. The body translates signal. Perception organizes identity. Memory and time shape what becomes possible. When these systems operate coherently, sovereignty emerges as a lived condition.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  Stardust to Sovereignty maps the path from current fragmentation to future coherence. It reveals the foundational architecture that existed before separation. The paradigm shows how to recognize and return to this original design, clearing layers of conditioning and distortion to reveal the structure that was always there. From that recovered foundation, consciousness advances with coherence.
                </p>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">S2S shows how consciousness behaves as structure.</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Movements of instinct, emotion, creativity, and orientation follow precise internal patterns. These patterns form a readable design that operates continuously. When this design is recognized, perception reorganizes and coherence becomes natural.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">S2S identifies multiple intelligences operating within one continuum.</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    These intelligences shape how a person knows what they know, how they read timelines, how they form relationships, how they sense direction, and how they stabilize their identity. The thirteen Orbs described in this book are direct expressions of lived intelligence. They function as real movements within awareness.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">S2S positions sovereignty as perceptual alignment.</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Sovereignty arises when awareness aligns with the structure already governing experience. It emerges as the outcome of recognition. When inner design becomes visible, identity behaves coherently, responsively, and precisely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Structure Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  What You'll Find Here
                </h2>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-4">
                  The book moves through recognition, perception, and coherence shifts. It traces the arc from stellar origins to sovereign system. Between chapters, interludes function as bridges. Poetic passages that deepen the understanding.
                </p>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-6">
                  <p className="text-base leading-relaxed text-stone-200 italic mb-2">
                    "The first change in the valley begins as a quiet stirring along the ground. It moves like a slow breath, loosening something within you before you notice what has begun. In this place, names begin to shift. The deeper ones that hold your form from within rise to the surface."
                  </p>
                  <p className="text-sm text-cyan-300/80">Interlude II: The Valley of Shifting Names</p>
                </div>
                <p className="text-base leading-relaxed text-stone-200">
                  Another describes a city that listens, its design responding to the system you carry. A third presents a mountain that breathes light. These are environments the book creates. Places where recognition occurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Architecture Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  The Constellation of Sovereign Intelligences
                </h2>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-4">
                  At the center is the constellation of intelligences. These are direct expressions of lived intelligence that function as movements within awareness. They are the fundamental gestures of sovereignty: the ways awareness organizes itself when aligned with truth rather than survival. Each intelligence is a movement you have already experienced, even if unconsciously. Each one describes a function of your own intelligence returning to its natural form.
                </p>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-6">
                  <p className="text-base leading-relaxed text-stone-200 italic mb-2">
                    "I speak from before the beginning. Before form took shape, before light found matter, before consciousness knew itself as separate. I am the whisper that ignites, the pulse that remembers, the breath that sustains. When you pause and breathe, when you feel the space between your heartbeats, you are feeling me."
                  </p>
                  <p className="text-sm text-cyan-300/80">The Voice of Origin Intelligence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-6">
                  Why This Work Exists
                </h2>
              </div>
              <div className="lg:col-span-3 space-y-8">
            {/* Body as Technology */}
            <div>
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                From there, the design unfolds. The body reveals itself as advanced biological technology:
              </p>
              <div className="border-l-2 border-cyan-400/50 pl-4 mb-4">
                <p className="text-base leading-relaxed text-stone-200 italic">
                  "The body listens. Beneath the surface of skin and bone, beneath the familiar rhythms of breath and pulse, a deeper conversation unfolds. Cosmic signals arrive as vibration, as frequency, as resonance moving through the system."
                </p>
              </div>
              <div className="border-l-2 border-cyan-400/30 pl-4">
                <p className="text-base leading-relaxed text-stone-200 italic text-cyan-300/90">
                  "Hum a single note. It vibrates through your entire body. This is how consciousness speaks to matter."
                </p>
              </div>
            </div>

            {/* Memory as Starlight */}
            <div>
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                Memory appears as starlight:
              </p>
              <div className="border-l-2 border-cyan-400/50 pl-4 mb-4">
                <p className="text-base leading-relaxed text-stone-200 italic">
                  "Memory lives in your cells like starlight lives in the void. Patterns from distant origins move through you, carrying the intelligence of ancestral systems, the resonance of stellar inheritance."
                </p>
              </div>
              <div className="border-l-2 border-cyan-400/30 pl-4">
                <p className="text-base leading-relaxed text-stone-200 italic text-cyan-300/90">
                  "Feel where your heart remembers what your mind has forgotten. This is starline memory in action."
                </p>
              </div>
            </div>

            {/* Time as Navigable */}
            <div>
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                Time becomes navigable:
              </p>
              <div className="border-l-2 border-cyan-400/50 pl-4">
                <p className="text-base leading-relaxed text-stone-200 italic">
                  "Time moves through you like a spiral, like parallel streams, like a permeable membrane. You inhabit multiple temporal dimensions simultaneously, your consciousness navigating rhythmic alignments that maintain system integrity across scales."
                </p>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Field Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  The System It Encodes
                </h2>
              </div>
              <div className="lg:col-span-3">
            <p className="text-base leading-relaxed text-stone-200 mb-4">
              The book builds toward the Sovereign System, where individual alignment and collective coherence exist as nested aspects of the same unified design:
            </p>
            <div className="border-l-2 border-cyan-400/50 pl-4 mb-4">
              <p className="text-base leading-relaxed text-stone-200 italic">
                "The system moves through you and through others, creating a collective web of resonance that amplifies coherence across networks."
              </p>
            </div>
            <div className="border-l-2 border-cyan-400/30 pl-4 mb-4">
              <p className="text-base leading-relaxed text-stone-200 italic text-cyan-300/90">
                "The body remembers what words remain beyond."
              </p>
            </div>
            <div className="border-l-2 border-cyan-400/50 pl-4">
              <p className="text-base leading-relaxed text-stone-200 italic">
                "The universe recognizes itself as a single self-referential system in various states of coherence, and you participate in this recognition."
              </p>
            </div>
          </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Read It Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  How to Read It
                </h2>
              </div>
              <div className="lg:col-span-3">
            <p className="text-base leading-relaxed text-stone-200 mb-4">
              This is a book you return to. Treat it as an environment. Let it open at the pace that matches your own system. Some passages feel like memory. Others feel like challenge. Some land with the weight of something you have always known. Others arrive like recognition from a future version of yourself. All of this is part of the design.
            </p>
            <p className="text-base leading-relaxed text-stone-200 mb-4">
              Current conditions create fragmentation: emotional, relational, perceptual. Sovereignty restores coherence. It brings the inner system back into alignment with its original intelligence. This book guides that reconnection through recognition. When you recognize something true, the body and mind reorganize around it naturally.
            </p>
            <p className="text-base leading-relaxed text-stone-200">
              This framework emerged through direct encounter, lived experience, pattern, and necessity. The system made itself visible. What follows in these pages is the expression of that encounter.
            </p>
          </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invitation Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="text-center max-w-3xl mx-auto">
          <p className="text-base leading-relaxed text-stone-200 mb-6">
            This is an invitation into a deeper relationship with your own awareness, identity, and creative force. A way of seeing your life from the inside out, and from the outside in. A way of recognizing the intelligence that has been guiding you long before you had a language for it.
          </p>
          <p className="text-lg leading-relaxed text-cyan-300 mb-8 italic">
            Enter in the way that feels coherent to you. Move with what resonates. Let what rests simply rest. The system will meet you where you are.
          </p>
          <p className="text-base text-cyan-300 mb-6 font-medium">
            Reserve your First Edition copy before February 28, 2026
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/preorder" variant="primary" className="text-lg">
              Preorder Book One →
            </Button>
            <Button href="/books" variant="secondary" className="text-lg">
              Explore More →
            </Button>
          </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
