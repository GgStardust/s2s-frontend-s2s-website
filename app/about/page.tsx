import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, WORK } from '@/lib/coreSiteCopy';

export const metadata: Metadata = {
  title: 'The Work',
  description:
    'The question at the center of Stardust to Sovereignty, and how it travels from the body into relationship, place, civilization, and the cosmos.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/75 font-sans mb-6">
          {WORK.eyebrow}
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-stone-100 font-serif text-balance">
          {WORK.title}
        </h1>
        <p className="mt-8 max-w-3xl text-lg md:text-2xl leading-relaxed text-stone-300 font-serif">
          {WORK.lead}
        </p>
      </header>

      <article className="max-w-4xl mx-auto px-6">
        <section className="py-14 md:py-20 border-t border-stone-300/20">
          <div className="grid grid-cols-1 md:grid-cols-[0.7fr_1.3fr] gap-8 md:gap-14">
            <h2 className="text-2xl md:text-3xl leading-tight text-stone-100 font-serif">
              {WORK.originHeading}
            </h2>
            <div className="space-y-6">
              {WORK.originBody.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 border-t border-stone-300/20">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70 font-sans">
            {WORK.movementHeading}
          </p>
          <ol className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {WORK.movement.map((stage, index) => (
              <li
                key={stage}
                className="min-h-32 rounded-lg border border-stone-300/15 bg-cosmic-blue-light/20 p-5 flex flex-col justify-between"
              >
                <span className="text-xs text-stone-600 font-sans">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-lg text-stone-200 font-serif">{stage}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-14 md:py-20 border-t border-stone-300/20">
          <div className="grid grid-cols-1 md:grid-cols-[0.7fr_1.3fr] gap-8 md:gap-14">
            <h2 className="text-2xl md:text-3xl leading-tight text-stone-100 font-serif">
              {WORK.formsHeading}
            </h2>
            <div>
              <p className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
                {WORK.formsBody}
              </p>
              <blockquote className="mt-10 border-l-2 border-cyan-300/40 pl-6">
                <p className="text-lg md:text-xl leading-relaxed text-stone-200 font-serif italic">
                  {WORK.orientation}
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-y border-stone-300/20 text-center">
          <p className="text-3xl md:text-4xl leading-relaxed text-stone-100 font-serif">
            {WORK.closing}
          </p>
        </section>

        <nav className="py-14 flex flex-col sm:flex-row gap-4 justify-center font-sans" aria-label="Continue through the work">
          <Link
            href="/s2s"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-stone-300/25 px-6 py-3 text-stone-200 hover:border-cyan-300/45 hover:text-cyan-100 transition-colors"
          >
            Explore S2S
          </Link>
          <Link
            href="/about-gigi"
            className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 text-stone-400 hover:text-stone-200 underline underline-offset-4"
          >
            About {SITE.author}
          </Link>
        </nav>
      </article>
    </main>
  );
}
