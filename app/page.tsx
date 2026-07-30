import type { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ENTRY_POINTS, HOME, SITE } from '@/lib/coreSiteCopy';

export const metadata: Metadata = {
  title: {
    absolute: SITE.name,
  },
  description: SITE.description,
  alternates: {
    canonical: 'https://stardusttosovereignty.com',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-structural-grid relative z-10 pb-20">
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80 font-sans mb-7">
            {HOME.eyebrow}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-[5.4rem] lg:leading-[1.02] font-semibold tracking-tight text-stone-100 font-serif text-balance">
            {HOME.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg md:text-2xl leading-relaxed text-stone-200 font-serif">
            {HOME.lead}
          </p>
          <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-stone-400 font-serif">
            {HOME.premise}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button href="/about" variant="primary" className="px-8">
              Enter the work
            </Button>
            <Button href="/source-field" variant="secondary" className="px-8">
              Visit the Source Field
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-t border-stone-300/20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-14 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70 font-sans">
              The question beneath the work
            </p>
            <h2 className="mt-5 max-w-4xl text-3xl md:text-5xl leading-tight text-stone-100 font-serif text-balance">
              {HOME.inquiry}
            </h2>
          </div>
          <div className="rounded-lg border border-stone-300/15 bg-cosmic-blue-light/25 p-7 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70 font-sans">
              Sovereignty
            </p>
            <p className="mt-5 text-lg leading-relaxed text-stone-300 font-serif">
              {HOME.sovereignty}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 border-t border-stone-300/20">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70 font-sans">
          Where the question travels
        </p>
        <ol className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-lg border border-stone-300/15 bg-stone-300/15">
          {HOME.scale.map((scale, index) => (
            <li
              key={scale}
              className="min-h-28 bg-cosmic-blue px-5 py-5 flex flex-col justify-between"
            >
              <span className="text-xs text-stone-600 font-sans">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-base md:text-lg text-stone-200 font-serif">{scale}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 border-t border-stone-300/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ENTRY_POINTS.map((entry, index) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="group min-h-full rounded-lg border border-stone-300/15 bg-cosmic-blue-light/25 p-7 md:p-8 hover:border-cyan-300/35 hover:bg-cosmic-blue-light/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70 font-sans">
                {String(index + 1).padStart(2, '0')} · {entry.label}
              </p>
              <h2 className="mt-5 text-2xl leading-snug text-stone-100 font-serif">
                {entry.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-400 font-serif">
                {entry.description}
              </p>
              <span className="mt-7 inline-block text-sm text-stone-300 group-hover:text-cyan-200 font-sans">
                Enter →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-t border-stone-300/20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70 font-sans">
              Living Literary Technology
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl text-stone-100 font-serif leading-tight">
              The work can change form and still remember where it came from.
            </h2>
          </div>
          <div className="terminator-border">
            <div className="rounded-lg bg-cosmic-blue p-7 md:p-10">
              <p className="text-lg md:text-xl leading-relaxed text-stone-200 font-serif">
                {HOME.livingLiteraryTechnology}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 md:py-20 border-t border-stone-300/20 text-center">
        <p className="text-2xl md:text-3xl leading-relaxed text-stone-200 font-serif">
          {HOME.closing}
        </p>
      </section>
    </main>
  );
}
