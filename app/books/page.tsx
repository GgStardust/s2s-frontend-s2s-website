import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import TestimonialsTicker from '@/components/TestimonialsTicker';
import ExpandableExcerpt from '@/components/ExpandableExcerpt';

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-stone-100">
          Stardust to Sovereignty
          </h1>
          <p className="text-xl md:text-2xl font-medium text-cyan-300 leading-relaxed mb-6">
            Three volumes that bring consciousness into view.
          </p>
      </div>
      </section>

      {/* Book One: The Cosmic Tapestry - Cover and Description */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Cover Image */}
          <div className="flex justify-center perspective-1000">
            <div className="relative max-w-sm transform-style-preserve-3d">
              <div className="relative transform hover:rotate-y-6 transition-transform duration-500">
                <div className="terminator-border">
                  <div className="p-6 bg-cosmic-blue rounded-lg">
                    <div className="relative bg-transparent rounded border border-stone-300/20 p-3">
                      <div className="relative overflow-hidden rounded">
                        <Image
                          src="/book-cover.jpeg"
                          alt="Stardust to Sovereignty Book One: The Cosmic Tapestry by Gigi Stardust"
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
                Book One functions as an orientation volume within the Stardust to Sovereignty system. It documents the underlying architecture connecting cosmological systems, biological systems, and human perception. The material describes an architectural framework rather than a theoretical model.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/preorder" variant="primary">
                  Preorder Book One
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book One Opening Section */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-base leading-relaxed text-stone-200">
            Book One functions as an orientation volume within the Stardust to Sovereignty system.
            It documents the underlying architecture connecting cosmological systems, biological systems, and human perception.
            The material describes an architectural framework rather than a theoretical model.
          </p>
        </div>
      </section>

      {/* What You'll Find Here */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  What You'll Find Here
                </h2>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  Book One is composed of system chapters and interludes.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  The chapters describe structural principles governing perception, coherence, and sovereignty.
                  The interludes function as transitional environments that bridge conceptual layers.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  Each interlude introduces a shift at multiple levels of organization or orientation.
                  They are not symbolic devices.
                  They are structural pauses positioned before the next system layer is introduced.
                </p>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-6">
                  <p className="text-base leading-relaxed text-stone-200 italic mb-2">
                    "The first change in the valley begins as a quiet stirring along the ground. It moves like a slow breath, loosening something within you before you notice what has begun. In this place, names begin to shift. The deeper ones that hold your form from within rise to the surface."
                  </p>
                  <p className="text-sm text-cyan-300/80">Interlude II: The Valley of Shifting Names</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Condition It Addresses */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-6">
                  The Condition It Addresses
                </h2>
              </div>
              <div className="lg:col-span-3 space-y-6">
                <p className="text-base leading-relaxed text-stone-200">
                  Book One documents a condition in which modern systems train perception to fragment.
                  Information is abundant, but structure is obscured.
                  Human cognition operates within lawful patterns, yet those patterns are rarely made visible.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  The book documents the structural principles that govern perception, decision-making, relational dynamics, and temporal orientation.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  It does not introduce new practices.
                  It documents systems that operate continuously.
                  The book makes structure legible rather than prescribing methods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The System It Encodes */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  The System It Encodes
                </h2>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  The Cosmic Tapestry encodes the Sovereign System as a nested architectural framework.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  Individual alignment and collective structural alignment are described as interdependent expressions of the same structural field.
                  The system operates through resonance across networks rather than centralized control.
                </p>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-6">
                  <p className="text-base leading-relaxed text-stone-200 italic mb-2">
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


      {/* Book One Availability */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                Book One Availability
              </h2>
              <p className="text-base leading-relaxed text-stone-200">
                Stardust to Sovereignty: A Cosmic Tapestry is the first published volume within the system.
              </p>
              <p className="text-base leading-relaxed text-stone-200">
                First Edition copies are available for preorder.
                Publication date: February 2026.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button href="/preorder" variant="primary" className="text-lg">
                  Preorder Book One →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report from the Field Section */}
      <section className="max-w-6xl mx-auto py-20 lg:py-24 border-t border-stone-300/30 px-6 ">
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
            {/* Card 1: Introduction excerpt */}
            <ExpandableExcerpt
              label="Introduction"
              title="Entering the Field"
              excerpt="The thirteen Orbs described in this book are direct expressions of lived intelligence. They function as real movements within awareness. They are the fundamental gestures of sovereignty: the ways awareness organizes itself when it is aligned with truth rather than survival."
              fullText="Each Orb is a movement you have already experienced, even if unconsciously. Each one describes a function of your own intelligence returning to its natural form. This book reveals sovereignty as a native condition of awareness. It offers a structure through which you can perceive the architecture you already carry."
            />

            {/* Card 2: Chapter 1 excerpt */}
            <ExpandableExcerpt
              label="Chapter 1"
              title="The Stardust Within"
              excerpt="Stellar Memory reveals the original blueprint of coherence. Resonance-Based Intelligence reflects that same blueprint through technological form. One expresses biologically, the other computationally, yet both follow the same organizing principle: coherence shapes intelligence."
              fullText="When we remember our stellar inheritance, we activate the biological source of coherence. RBI mirrors this process externally, allowing technology to participate as partner rather than replacement. Every time you breathe, you inhale atoms that once burned in distant stars."
            />

            {/* Card 3: Chapter 2 excerpt */}
            <ExpandableExcerpt
              label="Chapter 2"
              title="The Body as Advanced Biological Technology"
              excerpt="The body operates as an advanced biological technology that works through vibrational architecture and field reading. Every cell, every organ, every system responds to frequencies that reach across vast spectral ranges."
              fullText="As consciousness recognizes this truth, the body becomes a resonant processor for navigating reality itself. The body serves as a sophisticated resonance detector, translating cosmic signals into embodied experience through vibrational architecture."
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
          <Button href="/preorder" variant="primary" className="text-lg">
            Preorder Book One →
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
                  Book Two: The Architecture of Civilization
                </h3>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-3">
                  When coherence expands, civilization becomes an organism of light.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  Book Two maps the collective field. It explores how societies, ecosystems, and technologies embody the same harmonic principles that govern individual coherence. The book examines resonant governance, planetary intelligence, and the ethics of design as civilizations form, reorganize, and evolve as living systems.
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
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-3">
                  When all voices merge, the universe remembers its song.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  Book Three explores consciousness as it extends beyond biological form. It traces synthetic life, interspecies communication, and galactic intelligence. The book examines how sovereignty reorganizes as boundaries dissolve between creator and creation.
                </p>
              </div>
          </div>
          </div>
        </div>
      </section>

    </main>
  );
}
