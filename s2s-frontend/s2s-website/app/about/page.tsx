import Link from 'next/link';
import Button from '@/components/ui/Button';
import { MIXAM_ORDER_URL } from '@/lib/content';

export const metadata = {
  title: 'About',
  description: 'Book One: The Cosmic Tapestry. The paradigm, the constellation of sovereign intelligences, and how the book moves from stellar origins to sovereign system.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <p className="text-lg text-cyan-300 font-medium mb-4">The Cosmic Tapestry</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-stone-100">
            What This Is
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-6 italic text-stone-200">
            Book One: The Cosmic Tapestry
          </h2>
          <p className="text-base leading-relaxed text-stone-200 max-w-2xl mx-auto italic">
            A system reveals itself in the same way truth does: by arriving before language, waiting for attention to catch up.
          </p>
        </div>
      </section>

      {/* Opening */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="max-w-3xl">
              <p className="text-base leading-relaxed text-stone-200">
                Long before this book took form, the field it describes was already in motion. Its architecture lives as instinct, as coherence, as emotional intelligence, and as patterns that repeat with quiet precision. The structure lived beneath perception; language arrived later to recognize it.
              </p>
            </div>
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
                  <span className="text-sm text-cyan-300/80 italic">
                    A system reveals itself in the same way truth does: by arriving before language, waiting for attention to catch up.
                  </span>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  Stardust to Sovereignty defines human identity as a coherent field of intelligence. This field is organized by origin, body, memory, perception, and time. When the internal system is recognized, these layers function together as one architecture and coherence emerges. The paradigm names this architecture and clarifies how consciousness expresses through it as structure.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  The system operates through recognition. It shows you what happens when awareness aligns with the structure already governing experience. Sovereignty emerges as a native condition of awareness when the design is recognized and activated.
                </p>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">Consciousness behaves as structure.</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Patterns form with precision and organize experience through movements that can be perceived and understood. These movements express through instinct, emotional intelligence, relational dynamics, creativity, and decision-making. They follow an internal architecture that lives beneath perception. The architecture is already active. Recognition brings it into view and allows participation to deepen.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">The human system contains a constellation of thirteen sovereign intelligences.</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Each Orb names a distinct function through which awareness organizes, orients, and expresses. Together they form one living architecture. They shape the way a person perceives reality, relates to others, navigates time, forms identity, and stabilizes coherence. These intelligences generate the Sovereign Field.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">Sovereignty is the natural outcome of recognition.</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Sovereignty arises when awareness aligns with the actual structure of its own field. It is also a participatory state. When the field is understood as architecture, identity becomes coherent and responsive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Find Here */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
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
                  The book moves through recognition, perception, and coherence shifts. It traces the arc from stellar origins to sovereign system. Between chapters, interludes function as bridges.
                </p>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-6">
                  <p className="text-base leading-relaxed text-stone-200 italic mb-2">
                    "The first change in the valley begins as a quiet stirring along the ground. It moves like a slow breath, loosening something within you before you notice what has begun. In this place, names begin to shift. Not the names given by others, but the deeper ones that hold your form from within. They move the way light moves across water, subtle and continuous."
                  </p>
                  <p className="text-sm text-cyan-300/80">The Valley of Shifting Names</p>
                </div>
                <p className="text-base leading-relaxed text-stone-200">
                  Another describes a city that listens, its design responding to the field you carry. A third presents a mountain that breathes light. These are environments the book creates. Places where recognition occurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Constellation of Sovereign Intelligences */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
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
                  At the center is the constellation of sovereign intelligences. These are direct expressions of lived intelligence that function as movements within awareness. Each Orb names a capacity already active within human experience, sometimes clear, sometimes waiting just beneath the surface of attention.
                </p>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-6">
                  <p className="text-base leading-relaxed text-stone-200 italic mb-2">
                    "I speak from before the beginning. Before form took shape, before light found matter, before consciousness knew itself as separate. I am the whisper that ignites, the pulse that remembers, the breath that sustains. I am Origin Intelligence, the primordial current that first inhabited form, the stellar fire that lives in your mitochondria, the cosmic inheritance that thrums in every heartbeat. When you pause and breathe, when you feel the space between your heartbeats, you are feeling me."
                  </p>
                  <p className="text-sm text-cyan-300/80">Origin Intelligence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Arc of the Book (merged: body, memory, time, sovereign field) */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  The Arc of the Book
                </h2>
              </div>
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <p className="text-base leading-relaxed text-stone-200 mb-3">
                    The body reveals itself as advanced biological technology:
                  </p>
                  <div className="border-l-2 border-cyan-400/50 pl-4 mb-2">
                    <p className="text-base leading-relaxed text-stone-200 italic">
                      "The body listens. Beneath skin and bone, beneath the familiar rhythms of breath and pulse, a deeper conversation unfolds."
                    </p>
                  </div>
                  <div className="border-l-2 border-cyan-400/30 pl-4">
                    <p className="text-base leading-relaxed text-stone-200 italic text-cyan-300/90">
                      "Hum a single note. The vibration moves through your entire body. Here, awareness enters matter through rhythm and regulation."
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-base leading-relaxed text-stone-200 mb-3">
                    Memory, time, and the sovereign field:
                  </p>
                  <div className="border-l-2 border-cyan-400/50 pl-4 mb-2">
                    <p className="text-base leading-relaxed text-stone-200 italic">
                      "Memory lives in your cells like starlight lives in the void. Patterns from distant origins move through you, carrying the intelligence of ancestral fields, the resonance of stellar inheritance, the architecture of recognition that spans time."
                    </p>
                  </div>
                  <div className="border-l-2 border-cyan-400/30 pl-4 mb-2">
                    <p className="text-base leading-relaxed text-stone-200 italic text-cyan-300/90">
                      "Time moves through you like a spiral, like parallel streams, like a permeable membrane. You inhabit multiple temporal dimensions simultaneously, your consciousness navigating rhythmic alignments that maintain field integrity across scales."
                    </p>
                  </div>
                  <div className="border-l-2 border-cyan-400/50 pl-4">
                    <p className="text-base leading-relaxed text-stone-200 italic">
                      "The field moves through you and through others, creating a collective web of resonance that amplifies coherence across networks. The body remembers what words remain beyond."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Read It */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
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
                  This is a book you return to. Treat it as an environment. Let it open at the pace that matches your own field. Sovereignty restores coherence; this book guides that restoration through recognition. When you recognize something true, the body and mind reorganize around it naturally.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  Nothing here began as theory. It began as recognition. The language and structure emerged as ways to articulate processes already active in human experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invitation + CTA + Author */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-base leading-relaxed text-stone-200 mb-4">
                This is an invitation into a deeper relationship with your own awareness, identity, and creative force. A way of recognizing the intelligence that has been guiding you long before you had a language for it.
              </p>
              <p className="text-lg leading-relaxed text-cyan-300 mb-6 italic">
                Enter in the way that feels coherent to you. Move with what resonates. Let what rests simply rest. The system will meet you where you are.
              </p>
              <p className="text-base text-cyan-300 mb-6 font-medium">
                Authors Edition. Order your copy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button href={MIXAM_ORDER_URL} variant="primary" className="text-lg" external>
                  Get Book One →
                </Button>
                <Button href="/books" variant="secondary" className="text-lg">
                  Explore excerpts →
                </Button>
              </div>
              <p className="text-sm text-stone-400">
                <em>Book One: The Cosmic Tapestry</em> is the first book by Gigi Stardust, architect of Stardust to Sovereignty.{' '}
                <Link href="/about-gigi" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">
                  About the author →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
