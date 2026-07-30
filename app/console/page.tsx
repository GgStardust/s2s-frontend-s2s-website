import type { Metadata } from 'next';
import Link from 'next/link';
import { CONSOLE } from '@/lib/coreSiteCopy';

export const metadata: Metadata = {
  title: CONSOLE.title,
  description: CONSOLE.lead,
  robots: { index: false, follow: true },
};

export default function ConsolePage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/75 font-sans mb-6">
          {CONSOLE.eyebrow}
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-stone-100 font-serif">
          {CONSOLE.title}
        </h1>
        <p className="mt-8 text-lg md:text-2xl leading-relaxed text-stone-300 font-serif">
          {CONSOLE.lead}
        </p>
        <p className="mt-6 text-base md:text-lg leading-relaxed text-stone-400 font-serif">
          {CONSOLE.body}
        </p>
        <div className="mt-12 pt-8 border-t border-stone-300/20">
          <Link
            href="/about"
            className="inline-flex min-h-[44px] items-center text-sm text-stone-300 hover:text-cyan-100 underline underline-offset-4 font-sans"
          >
            Return to the work →
          </Link>
        </div>
      </section>
    </main>
  );
}
