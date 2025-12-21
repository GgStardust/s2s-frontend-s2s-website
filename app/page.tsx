import { Metadata } from 'next';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Stardust to Sovereignty',
  description: 'A consciousness technology that makes structure perceptible in how perception, identity, time, and coherence organize.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Stardust to Sovereignty',
    description: 'A consciousness technology that makes structure perceptible in how perception, identity, time, and coherence organize.',
    url: 'https://stardusttosovereignty.com',
    siteName: 'Stardust to Sovereignty',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: 'https://stardusttosovereignty.com',
  },
};

export default function EnterPage() {
  return (
    <main className="min-h-screen bg-structural-grid flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-12">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-stone-100 tracking-tight">
              Stardust to Sovereignty
            </h1>

            {/* First Sentence - Isolated Anchor */}
            <div className="py-6">
              <p className="text-xl md:text-2xl font-medium text-stone-100 leading-relaxed">
                A system that maps human consciousness.
              </p>
            </div>

            {/* Body Copy - Airy spacing */}
            <div className="space-y-8 text-base md:text-lg leading-relaxed text-stone-200 max-w-2xl mx-auto">
              <p>
                Beginning with patterns observed in the universe and tracing how those same patterns express themselves through human life, the body, perception, and the world we are shaping.
              </p>
              <p>
                The system opens into a wide field that brings together cosmology, biology, consciousness, and lived experience.
                It creates a framework for seeing how these layers interrelate and how that awareness reshapes what it means to be human at this moment in time.
              </p>
              <p>
                Stardust to Sovereignty is made accessible through several forms.
                Each offers a different way to enter and explore the same underlying system.
              </p>
            </div>

            {/* Ways to Enter - Three Cards */}
            <div className="pt-12">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-cyan-300 mb-8">
                Ways to Enter
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* Book One Card */}
                <div className="terminator-border">
                  <div className="p-6 bg-cosmic-blue rounded-lg h-full flex flex-col hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                      Book One
                    </h3>
                    <p className="text-base font-medium text-stone-200 mb-4">
                      Stardust to Sovereignty: A Cosmic Tapestry
                    </p>
                    <p className="text-sm text-stone-300 mb-6 flex-grow">
                      The first published volume.
                      Complete and open for preorder.
                    </p>
                    <Button href="/books" variant="secondary" className="mt-auto">
                      Enter →
                    </Button>
                  </div>
                </div>

                {/* Console Card */}
                <div className="terminator-border">
                  <div className="p-6 bg-cosmic-blue rounded-lg h-full flex flex-col hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                      The Console
                    </h3>
                    <p className="text-sm text-stone-300 mb-6 flex-grow">
                      An interactive digital environment for exploring the system through multiple perspectives.
                      In development.
                    </p>
                    <Button href="/console" variant="secondary" className="mt-auto">
                      Enter →
                    </Button>
                  </div>
                </div>

                {/* Codex Card */}
                <div className="terminator-border">
                  <div className="p-6 bg-cosmic-blue rounded-lg h-full flex flex-col hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                      The Codex
                    </h3>
                    <p className="text-sm text-stone-300 mb-6 flex-grow">
                      A collection of long-form essays and inquiries that deepen and expand the work.
                      Available now.
                    </p>
                    <Button href="/codex" variant="secondary" className="mt-auto">
                      Enter →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs text-stone-400">
          Author-published by S2S Press
        </p>
      </footer>
    </main>
  );
}
