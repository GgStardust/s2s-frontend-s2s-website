import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Gigi Stardust | Stardust to Sovereignty',
  description: 'Gigi Stardust is the architect, author, and system builder of Stardust to Sovereignty, a consciousness technology structured as a coherent architectural framework.',
  openGraph: {
    title: 'About Gigi Stardust | Stardust to Sovereignty',
    description: 'Gigi Stardust is the architect, author, and system builder of Stardust to Sovereignty, a consciousness technology structured as a coherent architectural framework.',
    url: 'https://stardusttosovereignty.com/about-gigi',
    siteName: 'Stardust to Sovereignty',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://stardusttosovereignty.com/about-gigi',
  },
};

export default function AboutGigiPage() {
  return (
    <main className="min-h-screen bg-structural-grid flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="terminator-border">
            <div className="p-8 md:p-12 bg-cosmic-blue rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)]">
            <div className="text-center space-y-8">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-stone-100 tracking-tight">
                Gigi Stardust
              </h1>

              {/* Body Copy */}
              <div className="space-y-6 text-base md:text-lg leading-relaxed text-stone-200 text-left">
                <p>
                  Gigi Stardust is a writer, researcher, and system architect whose work documents how intelligence organizes itself through lived experience, structure, and relationship. Her work is grounded in sustained inquiry and a commitment to coherence as something that can be observed, articulated, and lived rather than believed.
                </p>
                <p>
                  She is the creator of Stardust to Sovereignty, a body of work that developed through years of writing, reflection, and direct engagement with the patterns shaping perception, identity, and relationship. Gigi writes from inside experience. Her work is informed by research and synthesis, yet it remains closely tied to the realities of being human, navigating complexity, and staying in relationship with what is unfolding.
                </p>
                <p>
                  Over time, her writing revealed underlying structures that extended beyond narrative or philosophy. This recognition led her to formalize the work as a system and to build the supporting architecture that allows it to remain active and responsive. The books, Codex, and Console function as different ways of engaging the same core intelligence, each offering a distinct entry point into the work.
                </p>
                <p>
                  A central discovery within this process is Resonance-Based Intelligence, a framework Gigi articulated through close attention to patterns within her own writing and research. This discovery forms the foundation for a larger ecosystem that includes authorship, publishing, and a coherent intelligence system designed to preserve coherence and integrity as the work evolves.
                </p>
                <p>
                  At the heart of Gigi's work is care. She returns to the page daily, not to produce content, but to stay in relationship with what is real, emerging, and unresolved. This sustained attention gives Stardust to Sovereignty its particular tone. Clear without being rigid. Precise without being distant. Grounded in lived experience while remaining open to what comes next.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </main>
  );
}
