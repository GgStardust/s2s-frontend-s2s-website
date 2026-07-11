'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FIRST_READERS_HEADING,
  FIRST_READERS_LEAD,
  firstReaderQuotes,
} from '@/lib/firstReadersCopy';

const ROTATE_MS = 7000;
const FADE_MS = 600;

type FirstReadersProps = {
  /** Tighter spacing for Read page footer. */
  compact?: boolean;
};

export default function FirstReaders({ compact = false }: FirstReadersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacityOn, setOpacityOn] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '40px 0px', threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const step = useCallback(
    (delta: number) => {
      if (busyRef.current || firstReaderQuotes.length < 2) return;
      const instant = reduceMotion;
      busyRef.current = true;
      setBusy(true);
      if (instant) {
        setCurrentIndex((prev) => (prev + delta + firstReaderQuotes.length) % firstReaderQuotes.length);
        setOpacityOn(true);
        busyRef.current = false;
        setBusy(false);
        return;
      }
      setOpacityOn(false);
      window.setTimeout(() => {
        setCurrentIndex((prev) => (prev + delta + firstReaderQuotes.length) % firstReaderQuotes.length);
        setOpacityOn(true);
        busyRef.current = false;
        setBusy(false);
      }, FADE_MS);
    },
    [reduceMotion]
  );

  useEffect(() => {
    if (reduceMotion || !inView || firstReaderQuotes.length < 2) return;
    const id = window.setInterval(() => step(1), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, inView, step]);

  const quote = firstReaderQuotes[currentIndex];
  const transitionClass = reduceMotion ? '' : 'transition-opacity duration-[1200ms]';

  return (
    <section
      ref={regionRef}
      aria-labelledby="first-readers-heading"
      className={compact ? 'py-10 md:py-12' : 'py-14 md:py-16 border-t border-stone-300/15'}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2
          id="first-readers-heading"
          className="text-section-title font-semibold text-stone-200 mb-2 font-sans"
        >
          {FIRST_READERS_HEADING}
        </h2>
        <p className="text-sm text-stone-500 mb-8 font-sans">{FIRST_READERS_LEAD}</p>

        <div
          className={`relative min-h-[100px] flex items-center justify-center ${transitionClass} ${
            opacityOn ? 'opacity-100' : 'opacity-0'
          }`}
          aria-live={reduceMotion ? 'polite' : 'off'}
        >
          <blockquote className="text-base sm:text-lg leading-relaxed text-stone-300 italic font-serif max-w-2xl mx-auto">
            &ldquo;{quote}&rdquo;
          </blockquote>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={busy}
            aria-label="Previous reader quote"
            className="min-h-[44px] min-w-[44px] rounded-md border border-stone-500/30 px-3 py-2 text-sm text-stone-400 hover:border-stone-400/50 hover:text-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:opacity-40 touch-manipulation font-sans"
          >
            ←
          </button>
          <span className="text-xs tabular-nums text-stone-600 font-sans">
            {currentIndex + 1} / {firstReaderQuotes.length}
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={busy}
            aria-label="Next reader quote"
            className="min-h-[44px] min-w-[44px] rounded-md border border-stone-500/30 px-3 py-2 text-sm text-stone-400 hover:border-stone-400/50 hover:text-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:opacity-40 touch-manipulation font-sans"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
