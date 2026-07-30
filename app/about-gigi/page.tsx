import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GIGI, SITE } from '@/lib/coreSiteCopy';

export const metadata: Metadata = {
  title: SITE.author,
  description: `${SITE.author} is the creator and steward of ${SITE.name}.`,
};

export default function AboutGigiPage() {
  return (
    <main className="min-h-screen bg-structural-grid pb-20">
      <article className="max-w-5xl mx-auto px-6 pt-16 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-[0.72fr_1.28fr] gap-10 md:gap-16 items-start">
          <div className="md:sticky md:top-36">
            <div className="terminator-border max-w-sm mx-auto md:mx-0">
              <div className="rounded-lg bg-cosmic-blue p-2">
                <Image
                  src="/author-gigi-stardust.jpg"
                  alt={SITE.author}
                  width={600}
                  height={800}
                  className="w-full h-auto rounded-md"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="pb-16">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/75 font-sans mb-6">
              {GIGI.eyebrow}
            </p>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-stone-100 font-serif">
              {GIGI.title}
            </h1>
            <blockquote className="mt-8 border-l-2 border-cyan-300/40 pl-6">
              <p className="text-xl md:text-2xl leading-relaxed text-stone-200 font-serif italic">
                {GIGI.lead}
              </p>
            </blockquote>

            <div className="mt-10 space-y-7">
              {GIGI.body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-base md:text-lg leading-relaxed text-stone-300 font-serif">
                  {paragraph}
                </p>
              ))}
            </div>

            <p className="mt-12 pt-9 border-t border-stone-300/20 text-xl md:text-2xl leading-relaxed text-stone-200 font-serif">
              {GIGI.closing}
            </p>

            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex min-h-[44px] items-center text-sm text-stone-300 hover:text-cyan-100 underline underline-offset-4 font-sans"
              >
                Enter Stardust to Sovereignty →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
