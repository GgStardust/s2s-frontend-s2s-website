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
        <div className="max-w-2xl mx-auto">
          <div className="p-8 md:p-12 bg-cosmic-blue rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)]">
              <div className="text-center space-y-8">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-stone-100 tracking-tight">
                  Stardust to Sovereignty
                </h1>

                {/* First Sentence - Isolated Anchor */}
                <div className="py-4">
                  <p className="text-xl md:text-2xl font-medium text-stone-100 leading-relaxed">
                    Stardust to Sovereignty is consciousness technology.
                  </p>
                </div>

                {/* Body Copy - 4 Blocks Max */}
                <div className="space-y-6 text-base md:text-lg leading-relaxed text-stone-200">
                  <p>
                    It is a structural system that makes structure perceptible in how perception, identity, time, and coherence organize.
                  </p>
                  <p>
                    The technology operates through pattern recognition at multiple levels of organization.
                    The same structural principles appear in cosmological systems, biological systems, and human cognition.
                  </p>
                  <p>
                    When structure becomes observable, perception reorganizes.
                    Structural alignment stabilizes through alignment.
                    These changes occur prior to interpretation.
                  </p>
                  <p>
                    Written works, interfaces, and applied frameworks surface the system.
                    Stardust to Sovereignty: A Cosmic Tapestry is the first published volume within the system.
                  </p>
                  <p>
                    The material is organized as a structured environment designed for orientation rather than a linear sequence.
                    Engagement develops through orientation and return.
                  </p>
                </div>

                {/* Final Line - Closer to Buttons */}
                <p className="text-base md:text-lg leading-relaxed text-stone-200 pt-2">
                  What follows is an active system.
                </p>

                {/* Navigation */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button href="/about" variant="secondary">
                    Enter the System
                  </Button>
                  <Button href="/books" variant="secondary">
                    Book One: A Cosmic Tapestry
                  </Button>
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
