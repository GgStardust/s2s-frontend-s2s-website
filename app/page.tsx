import { Metadata } from 'next';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Stardust to Sovereignty',
  description: 'A consciousness architecture that describes the structural principles through which perception, identity, time, and coherence organize.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Stardust to Sovereignty',
    description: 'A consciousness architecture that describes the structural principles through which perception, identity, time, and coherence organize.',
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

                {/* Body Copy */}
                <div className="space-y-6 text-base md:text-lg leading-relaxed text-stone-200">
                <p>
                  Stardust to Sovereignty is a consciousness architecture.
                  It emerges from studying the same organizing patterns in galaxies, biological systems, and human perception.
                </p>
                  <p>
                    It describes the structural principles through which perception, identity, time, and coherence organize.
                    These principles operate continuously and do not depend on interpretation.
                  </p>
                <p>
                  The system functions through visibility.
                  When structure becomes visible, perception reorganizes.
                  Coherence stabilizes as alignment.
                  These shifts are experienced directly, often before they can be named.
                </p>
                  <p>
                    The architecture described here is continuous across scale.
                    From stellar formation to biological systems.
                    From embodied awareness to collective fields.
                  </p>
                  <p>
                    The material is organized as an environment rather than a sequence.
                    It is designed to be returned to and navigated over time.
                    Recognition precedes application.
                  </p>
                  <p>
                    What follows is a description of a system that is already operating.
                  </p>
                </div>

                {/* Links */}
                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button href="/books" variant="secondary">
                    Enter the Book
                  </Button>
                  <Button href="/about" variant="secondary">
                    About the System
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
