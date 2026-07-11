import Link from 'next/link';
import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import { ORDER_CTA } from '@/lib/content';
import { BOOK_CATALOG, PRICING } from '@/lib/publishingMetadata';
import {
  howToReadSummary,
  howToReadVerbatim,
  introductionClosingInvitation,
  introductionOpeningFollow,
} from '@/lib/manuscriptWebsiteCopy';
import { ABOUT_PARADIGM_LEAD } from '@/lib/homepageCopy';

export const metadata: Metadata = {
  title: 'About',
  description: `${BOOK_CATALOG.title} (${BOOK_CATALOG.volumeLabel}). ${BOOK_CATALOG.catalogDescriptionShort}`,
  openGraph: {
    title: `About | ${BOOK_CATALOG.title}`,
    description: BOOK_CATALOG.catalogDescriptionShort,
  },
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
            {ABOUT_PARADIGM_LEAD}
          </p>
        </div>
      </section>

      {/* Opening */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="max-w-3xl">
              <p className="text-base leading-relaxed text-stone-200">{introductionOpeningFollow}</p>
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
                <p className="text-sm text-cyan-300/80 italic mt-4">
                  Consciousness as lawful, embodied design.
                </p>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  Stardust to Sovereignty defines human identity as a coherent system of intelligence. This system is
                  organized by origin, body, memory, perception, and time. When the internal design is recognized, these
                  layers function together as one structure and coherence emerges. The paradigm names this design and
                  clarifies how consciousness expresses through it as structure.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  The system operates through recognition. It shows you what happens when awareness aligns with the
                  structure already governing experience. Sovereignty emerges as a native condition of awareness when the
                  design is recognized and activated.
                </p>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">Consciousness behaves as structure.</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Patterns form with precision and organize experience through movements that can be perceived and
                    understood. These movements express through instinct, emotional intelligence, relational dynamics,
                    creativity, and decision-making. They follow an internal design that lives beneath perception. The
                    design is already active. Recognition brings it into view and allows participation to deepen.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">The human system contains a constellation of thirteen sovereign intelligences.</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Each Orb names a distinct function through which awareness organizes, orients, and expresses.
                    Together they form one living structure. They shape the way a person perceives reality, relates to
                    others, navigates time, forms identity, and stabilizes coherence. These intelligences generate the
                    Sovereign Field.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-400/50 pl-4 my-4">
                  <p className="text-base leading-relaxed text-stone-200 mb-2">
                    <strong className="text-cyan-300">Sovereignty is the natural outcome of recognition.</strong>
                  </p>
                  <p className="text-base leading-relaxed text-stone-200">
                    Sovereignty arises when awareness aligns with the actual structure of its own system. It is also a
                    participatory state. When the system is understood as design, identity becomes coherent and
                    responsive.
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
                  The book moves through recognition, perception, and coherence shifts. It traces the arc from stellar origins to sovereign system. Each chapter builds the same argument forward: how inner order becomes legible, shareable, and operable in the world you inhabit.
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  The prose stays close to lived experience (body, attention, relationship, design) while naming the structure that makes coherence possible.
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

      {/* Manuscript excerpts live on Books */}
      <section className="max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6">
        <div className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-4">
                  From the manuscript
                </h2>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <p className="text-base leading-relaxed text-stone-200">
                  Chapter excerpts, the prologue, and a structural reader map live on the Books page so this section stays
                  focused on the paradigm itself.
                </p>
                <Link
                  href="/books#from-the-manuscript"
                  className="inline-flex min-h-[44px] items-center text-sm text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4"
                >
                  Read excerpts &amp; structure →
                </Link>
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
              <div className="lg:col-span-3 space-y-4">
                {howToReadVerbatim.map((p) => (
                  <p key={p.slice(0, 48)} className="text-base leading-relaxed text-stone-200">
                    {p}
                  </p>
                ))}
                <p className="text-sm text-stone-400 leading-relaxed">{howToReadSummary}</p>
                <p className="text-base leading-relaxed text-stone-200">
                  Recognition came first. The language, structure, and diagrams emerged as ways to articulate processes
                  already active in human experience.
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
              <p className="text-lg leading-relaxed text-cyan-300 mb-6 italic text-center">
                {introductionClosingInvitation}
              </p>
              <p className="text-base text-cyan-300 mb-6 font-medium">
                Author&apos;s Edition. Order your copy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button href="/order/direct" variant="primary" className="text-lg">
                  {ORDER_CTA.primary(PRICING.directPaperbackUsd)}
                </Button>
                <Button href="/books" variant="secondary" className="text-lg">
                  Explore excerpts →
                </Button>
              </div>
              <p className="text-sm text-center mb-10">
                <Link href="/order" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-4">
                  {ORDER_CTA.whereToBuy}
                </Link>
              </p>
              <p className="text-base text-stone-300 leading-relaxed mb-6 max-w-2xl mx-auto">
                {BOOK_CATALOG.authorBioShort}
              </p>
              <p className="text-sm text-stone-400">
                <Link href="/about-gigi" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">
                  More about the author →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
