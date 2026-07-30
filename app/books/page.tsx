import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { BOOK_ONE } from '@/lib/coreSiteCopy';

export const metadata: Metadata = {
  title: BOOK_ONE.title,
  description:
    'The Cosmic Tapestry is the first book to emerge from Stardust to Sovereignty. Gigi Stardust is currently returning to it line by line.',
};

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-book-vessel pb-20">
      <header className="max-w-6xl mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-12 lg:gap-16 items-center">
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="rounded-sm p-2 bg-cosmic-blue-light/30">
              <Image
                src="/book-cover.png"
                alt={`${BOOK_ONE.title} book cover`}
                width={320}
                height={480}
                className="w-full h-auto block max-w-[280px] lg:max-w-[320px] rounded-sm"
                priority
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/75 font-sans mb-6">
              {BOOK_ONE.eyebrow}
            </p>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-stone-100 font-serif text-balance">
              {BOOK_ONE.title}
            </h1>
            <p className="mt-7 text-lg md:text-2xl leading-relaxed text-stone-300 font-serif">
              {BOOK_ONE.lead}
            </p>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6">
        <section className="py-14 md:py-20 border-t border-stone-300/20">
          <div className="space-y-6 max-w-3xl">
            {BOOK_ONE.origin.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="py-14 md:py-20 border-t border-stone-300/20">
          <div className="grid grid-cols-1 md:grid-cols-[0.65fr_1.35fr] gap-8 md:gap-14">
            <h2 className="text-2xl md:text-3xl leading-tight text-stone-100 font-serif">
              {BOOK_ONE.insideHeading}
            </h2>
            <div>
              <p className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
                {BOOK_ONE.thesis}
              </p>
              <div className="mt-10 pt-8 border-t border-stone-300/15">
                <h3 className="text-xl md:text-2xl text-stone-100 font-serif">
                  {BOOK_ONE.orbsHeading}
                </h3>
                <p className="mt-4 text-base md:text-lg leading-relaxed text-stone-300 font-serif">
                  {BOOK_ONE.orbs}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 border-y border-stone-300/20">
          <div className="grid grid-cols-1 md:grid-cols-[0.65fr_1.35fr] gap-8 md:gap-14">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70 font-sans">
                What is happening now
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl text-stone-100 font-serif">
                {BOOK_ONE.statusHeading}
              </h2>
            </div>
            <div className="space-y-6">
              {BOOK_ONE.status.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
                  {paragraph}
                </p>
              ))}
              <p className="pt-4 text-sm leading-relaxed text-stone-500 font-sans">
                {BOOK_ONE.availability}
              </p>
              <div className="pt-3">
                <Button href="/order" variant="primary" className="px-7">
                  {BOOK_ONE.purchaseLabel}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <nav className="py-14 flex flex-col sm:flex-row gap-4 justify-center font-sans" aria-label="Continue through the work">
          <Link
            href="/about"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-stone-300/25 px-6 py-3 text-stone-200 hover:border-cyan-300/45 hover:text-cyan-100 transition-colors"
          >
            The larger work
          </Link>
          <Link
            href="/source-field"
            className="inline-flex min-h-[44px] items-center justify-center px-6 py-3 text-stone-400 hover:text-stone-200 underline underline-offset-4"
          >
            Enter the Source Field
          </Link>
        </nav>
      </article>
    </main>
  );
}
