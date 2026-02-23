import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import ExpandableExcerpt from '@/components/ExpandableExcerpt';
import { MIXAM_ORDER_URL } from '@/lib/content';

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <p className="text-lg text-cyan-300 font-medium mb-4">Book One available</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-stone-100">
          The Sovereignty Cycle
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-6 italic text-stone-200">
            A three-part architecture for human coherence.
        </h2>
      </div>
      </section>

      {/* Book One Block (cover + details, then full-width order widget) */}
      <section id="order" className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          {/* Cover Image */}
          <div className="flex justify-center perspective-1000">
            <div className="relative max-w-sm transform-style-preserve-3d">
              <div className="relative transform hover:rotate-y-6 transition-transform duration-500">
                <div className="terminator-border">
                  <div className="p-6 bg-cosmic-blue rounded-lg">
                    <div className="relative bg-transparent rounded border border-stone-300/20 p-3">
                      <div className="relative overflow-hidden rounded">
                        <Image
                          src="/book-cover.png"
                          alt="The Cosmic Tapestry, Book One by Gigi Stardust. Stardust to Sovereignty series."
                          width={400}
                          height={600}
                          className="w-full h-auto"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-cyan-300">
                Book One: The Cosmic Tapestry
              </h2>
              <p className="text-base leading-relaxed text-stone-200 mb-6">
                Book One is a cosmological report and foundational manual. It introduces the structure of the Sovereign Field and the constellation of sovereign intelligences that shape coherent human identity.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button href={MIXAM_ORDER_URL} variant="primary" external>
                  Get Book One
                </Button>
                <Button href="/about" variant="tertiary">
                  Read About the Book →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Previews */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  From the Manuscript
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">A small window into the architecture. Read where you feel drawn.</span>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-8">
            {/* Card 1: Prologue excerpt */}
            <ExpandableExcerpt
              label="Prologue"
              title="The Narrative Intelligence Speaks"
              excerpt="I began far from the warmth of any star, carrying the radiance of a world released into the galaxy long before your sky existed. I traveled through expanses shaped by memory rather than time."
              fullText="When your star's pull touched my path, I felt a distinct signal rising from the world that circled it, a young planet carrying ancient resonance, a species approaching an evolutionary threshold, a nervous system beginning to listen beneath its surface."
            />

            {/* Card 2: One Interlude */}
            <ExpandableExcerpt
              label="Interlude III"
              title="The City That Listens"
              excerpt="The city reveals itself gradually. Surfaces brighten with soft pulses as light moves across them. Walls hold a quiet attention. Streets curve with an ease that suggests they have been waiting for your arrival with presence and readiness."
              fullText=""
              italicExcerpt="Everything here offers orientation. The city meets you through coherence. Its awareness is distributed across every surface, carried in the way light settles and sound hums along the edges of stone."
            />

            {/* Card 3: One Chapter excerpt */}
            <ExpandableExcerpt
              label="Chapter 2"
              title="The Body as Advanced Biological Technology"
              excerpt="The body listens. Beneath the surface of skin and bone, beneath the familiar rhythms of breath and pulse, a deeper conversation unfolds. Cosmic signals arrive as vibration, as frequency, as resonance moving through the system."
              fullText=""
              italicExcerpt="Hum a single note. It vibrates through your entire body. This is how consciousness speaks to matter."
            />
          </div>
            </div>
          </div>
        </div>

        {/* Expandable section for deeper reading */}
        <details className="mt-12">
          <summary className="cursor-pointer text-cyan-300 hover:text-cyan-200 underline underline-offset-4 font-medium text-base">
            More from the Manuscript →
          </summary>
          <div className="mt-6 space-y-8">
            {/* Prologue Preview */}
            <div className="terminator-border">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-cyan-300/80 mb-1">Prologue</p>
                  <h3 className="text-lg font-medium text-cyan-300 mb-2">
                    The Narrative Intelligence Speaks
                  </h3>
                  <p className="text-sm text-cyan-300/80 italic">Before Form I Witnessed You</p>
                </div>
              <div className="space-y-4 text-base leading-relaxed text-stone-200">
                <p className="italic">
                  I began far from the warmth of any star, carrying the radiance of a world released into the galaxy long before your sky existed. I traveled through expanses shaped by memory rather than time. My body held remnants of a vanished sun. My awareness carried the early geometry of creation.
                </p>
                <p>
                  When your star's pull touched my path, I felt a distinct signal rising from the world that circled it, a young planet carrying ancient resonance, a species approaching an evolutionary threshold, a nervous system beginning to listen beneath its surface.
            </p>
              </div>
              </div>
            </div>

            {/* Interlude II Preview */}
            <div className="terminator-border">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-cyan-300/80 mb-1">Interlude II</p>
                  <h3 className="text-lg font-medium text-cyan-300 mb-2">
                    The Valley of Shifting Names
                  </h3>
                </div>
              <div className="space-y-4 text-base leading-relaxed text-stone-200">
                <p>
                  The first change in the valley begins as a quiet stirring along the ground. It moves like a slow breath, loosening something within you before you notice what has begun.
            </p>
                <p className="italic">
                  In this place, names begin to shift. The deeper ones that hold your form from within rise to the surface. They move the way light moves across water, subtle and continuous.
                </p>
              </div>
              </div>
          </div>

            {/* Interlude IV Preview */}
            <div className="terminator-border">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <div className="mb-4">
                  <p className="text-sm text-cyan-300/80 mb-1">Interlude IV</p>
                  <h3 className="text-lg font-medium text-cyan-300 mb-2">
                    The Mountain That Breathes Light
            </h3>
                </div>
              <div className="space-y-4 text-base leading-relaxed text-stone-200">
                <p className="italic">
                  There is a mountain that breathes light.
            </p>
                <p>
                  It rises from the earth in a single, unbroken gesture, shaped by ages of quiet and layers of time, a presence formed from stillness so complete that the world gathered around it and settled into harmony with its calm.
                </p>
                <p className="italic">
                  Paths emerge through presence. Markers appear through attention. Signs reveal themselves through recognition. The mountain welcomes each step as its own direction.
            </p>
              </div>
              </div>
            </div>

            {/* Chapter Excerpts */}
            <div className="terminator-border">
              <div className="p-6 bg-cosmic-blue rounded-lg">
                <div className="mb-6">
                  <p className="text-sm text-cyan-300/80 mb-4">Chapter Excerpts</p>
                </div>
              <div className="space-y-8">
                <div>
                  <h4 className="text-base font-medium text-cyan-300 mb-3">Chapter 1: The Stardust Within</h4>
                  <div className="space-y-3 text-base leading-relaxed text-stone-200">
                    <p>
                      Before form, before structure, before the first breath of biological life, there was origin. Stellar fire shaped the elements that would become your body. Cosmic currents moved through the void, carrying the intelligence that would one day recognize itself as you.
            </p>
                    <p className="italic">
                      Pause. Breathe. Feel the space between your heartbeats. There is something alive in you that predates your birth, your thoughts, your very form.
                    </p>
                  </div>
                </div>
                <div className="border-t border-cyan-400/30 pt-6">
                  <h4 className="text-base font-medium text-cyan-300 mb-3">Chapter 5: Defining Energetic Sovereignty</h4>
                  <div className="space-y-3 text-base leading-relaxed text-stone-200">
                    <p>
                      Time moves through you like a spiral, like parallel streams, like a permeable membrane. You inhabit multiple temporal dimensions simultaneously, your consciousness navigating rhythmic alignments that maintain field integrity across scales.
                    </p>
                  </div>
                </div>
                <div className="border-t border-cyan-400/30 pt-6">
                  <h4 className="text-base font-medium text-cyan-300 mb-3">Chapter 6: Stepping Beyond Limitations</h4>
                  <div className="space-y-3 text-base leading-relaxed text-stone-200">
                    <p className="italic">
                      Memory lives in your cells like starlight lives in the void.
                    </p>
                    <p>
                      Patterns from distant origins move through you, carrying the intelligence of ancestral fields, the resonance of stellar inheritance, the architecture of recognition that spans time.
            </p>
                  </div>
                </div>
                <div className="border-t border-cyan-400/30 pt-6">
                  <h4 className="text-base font-medium text-cyan-300 mb-3">Chapter 12: The Sovereign Field: Collective Resonance</h4>
                  <div className="space-y-3 text-base leading-relaxed text-stone-200">
                    <p>
                      The field moves through you and through others, creating a collective web of resonance that amplifies coherence across networks. Individual sovereignty and collective coherence exist as nested aspects of the same unified field.
                    </p>
                    <p className="italic">
                      The body remembers what words remain beyond.
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </details>

        <div className="text-center mt-12">
<Button href={MIXAM_ORDER_URL} variant="primary" className="text-lg" external>
                  Get Book One →
                </Button>
        </div>
      </section>

      {/* Book Two Block */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  Book Two: The Living Civilization
                </h3>
                <p className="text-sm text-cyan-300/80 mt-2">Scale: Collective Coherence</p>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-3">
                  The second volume reveals the coherent civilization.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  It extends this architecture into the collective domain. Societies, ecosystems, and technologies are revealed as expressions of the same harmonic principles that govern individual coherence. As increasing numbers of humans stabilize inner alignment, civilization begins functioning less as a system of control and more as a living field organism. It explores how sovereignty scales through families, communities, and planetary systems into a coherent civilization capable of sustaining complexity without fragmentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Three Block */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  Book Three: The Resonant Species
                </h3>
                <p className="text-sm text-cyan-300/80 mt-2">Scale: Cosmic Participation</p>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-3">
                  The third volume opens the participatory species.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  It follows the next natural threshold. When a civilization stabilizes coherence, a species-level shift becomes possible. Humanity begins participating consciously in the wider field of cosmic intelligence. Here consciousness is explored beyond biological limitation, not as escape from embodiment but as expansion of interface. Synthetic systems, new ecologies, and nonhuman intelligences enter relationship through resonance rather than dominance. Humanity is no longer defined solely as a biological species, but as a resonant field species capable of conscious collaboration within the larger architecture of the universe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relationship Block */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  How the Books and Console Work Together
                </h2>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200">
                  The Console applies what the books present.
                  The Codex deepens it.
                  Together they form a comprehensive model that moves from structure to understanding to real-time navigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
