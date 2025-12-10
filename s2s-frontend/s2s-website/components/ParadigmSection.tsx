import { QUOTES } from '@/lib/content';

interface ParadigmSectionProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export default function ParadigmSection({ variant = 'full', className = '' }: ParadigmSectionProps) {
  return (
    <section className={`max-w-6xl mx-auto py-16 lg:py-24 border-t border-stone-300/30 px-6 ${className}`}>
      <div className="terminator-border">
        <div className="p-8 bg-cosmic-blue rounded-lg">
          {variant === 'full' ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300 mb-2">
                  The Paradigm
                </h2>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-cyan-300 text-2xl">✦</span>
                  <span className="text-sm text-cyan-300/80 italic">
                    {QUOTES.systemRevealsItself}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200 mb-4">
                  {QUOTES.longBeforeBook}
                </p>
                <p className="text-base leading-relaxed text-stone-200">
                  {QUOTES.whatYouAreEntering}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-cyan-300">
                  The Paradigm
                </h2>
              </div>
              <div className="lg:col-span-3">
                <p className="text-base leading-relaxed text-stone-200">
                  Stardust to Sovereignty presents a field-based model of human experience.
                  It describes perception, identity, and timing as intelligent systems
                  that can be understood, mapped, and navigated.
                  This is structural awareness.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
