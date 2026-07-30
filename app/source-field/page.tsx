import type { Metadata } from 'next';
import Link from 'next/link';
import { SOURCE_FIELD } from '@/lib/coreSiteCopy';

export const metadata: Metadata = {
  title: 'Source Field',
  description:
    'Where Gigi Stardust keeps S2S material before its final form is known.',
};

export default function SourceFieldPage() {
  return (
    <main className="min-h-screen bg-structural-grid pb-20">
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/75 font-sans mb-6">
          {SOURCE_FIELD.eyebrow}
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-stone-100 font-serif text-balance">
          {SOURCE_FIELD.title}
        </h1>
        <p className="mt-8 max-w-3xl text-lg md:text-2xl leading-relaxed text-stone-300 font-serif">
          {SOURCE_FIELD.lead}
        </p>
      </header>

      <article className="max-w-4xl mx-auto px-6">
        <section className="py-14 md:py-20 border-t border-stone-300/20">
          <div className="max-w-3xl space-y-6">
            {SOURCE_FIELD.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="py-14 md:py-20 border-t border-stone-300/20">
          <h2 className="text-3xl md:text-4xl text-stone-100 font-serif">
            {SOURCE_FIELD.methodHeading}
          </h2>
          <ol className="mt-9 space-y-3">
            {SOURCE_FIELD.method.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[3rem_1fr] items-center gap-4 rounded-lg border border-stone-300/15 bg-cosmic-blue/75 px-5 py-4"
              >
                <span className="text-xs tracking-[0.18em] text-cyan-300/65 font-sans">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-lg text-stone-200 font-serif">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-14 md:py-20 border-y border-stone-300/20">
          <div className="terminator-border">
            <div className="rounded-lg bg-cosmic-blue p-7 md:p-10">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70 font-sans">
                {SOURCE_FIELD.publicHeading}
              </p>
              <p className="mt-6 text-lg md:text-xl leading-relaxed text-stone-300 font-serif">
                {SOURCE_FIELD.publicBody}
              </p>
            </div>
          </div>
        </section>

        <nav className="py-14 flex flex-col sm:flex-row gap-4 justify-center font-sans" aria-label="Continue through the work">
          <Link
            href="/books"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-stone-300/25 px-6 py-3 text-stone-200 hover:border-cyan-300/45 hover:text-cyan-100 transition-colors"
          >
            Book One
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 text-stone-400 hover:text-stone-200 underline underline-offset-4"
          >
            Return to the work
          </Link>
        </nav>
      </article>
    </main>
  );
}
