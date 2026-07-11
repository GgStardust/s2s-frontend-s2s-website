'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const testimonials = [
  "This book is life-changing. It speaks in a language my mind has never heard but my being has always known.",
  "The opening lines hit with the force of scripture: bold, ancient, and utterly new.",
  "The language opened my entire conceptual framework. It doesn't just describe consciousness; it activates it.",
  "Mesmerizing. It revealed a space inside me I've only partially explored in meditation or the night sky.",
  "The synthesis of free will and determinism was an absolute gut punch, clarity I didn't know was possible.",
  "Seeing intuition described so accurately felt uncanny, like the book was naming the inner mechanics of my mind.",
  "A rare blend of science, poetry, and cosmic intelligence. This work reorganizes how you think.",
  "I found myself wanting more. Every page feels like the beginning of a new way of understanding.",
  "This book awakens real questions: about death, identity, awareness, and what it means to be the universe in human form.",
  "I recognized myself in these pages in a way that was both exhilarating and unsettling. The accuracy is startling.",
  "The meaning and truth of this work is expansive. I can feel myself beyond myself, as part of Universal Cosmic Intelligence. Literally mind-blowing.",
];

const ROTATE_MS = 6500;
const FADE_MS = 600;

export default function TestimonialsTicker() {
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
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: '40px 0px', threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const step = useCallback((delta: number) => {
    if (busyRef.current || testimonials.length < 2) return;
    const instant = reduceMotion;
    busyRef.current = true;
    setBusy(true);
    if (instant) {
      setCurrentIndex((prev) => (prev + delta + testimonials.length) % testimonials.length);
      setOpacityOn(true);
      busyRef.current = false;
      setBusy(false);
      return;
    }
    setOpacityOn(false);
    window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + delta + testimonials.length) % testimonials.length);
      setOpacityOn(true);
      busyRef.current = false;
      setBusy(false);
    }, FADE_MS);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !inView || testimonials.length < 2) return;
    const id = window.setInterval(() => {
      step(1);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, inView, step]);

  const quote = testimonials[currentIndex];
  const transitionClass = reduceMotion
    ? ''
    : 'transition-opacity duration-[1200ms]';

  return (
    <div ref={regionRef} className="flex flex-col gap-5">
      <div
        className={`relative min-h-[120px] flex items-center justify-center ${transitionClass} ${
          opacityOn ? 'opacity-100' : 'opacity-0'
        }`}
        aria-live={reduceMotion ? 'polite' : 'off'}
      >
        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-stone-50 italic text-center max-w-3xl mx-auto px-2 sm:px-4 font-serif">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={busy}
          className="min-h-[44px] min-w-[44px] rounded-md border border-stone-500/40 bg-black/20 px-4 py-2 text-sm text-stone-300 hover:border-cyan-500/50 hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-40 touch-manipulation"
        >
          Previous
        </button>
        <span className="text-xs tabular-nums text-stone-500 font-sans">
          {currentIndex + 1} / {testimonials.length}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={busy}
          className="min-h-[44px] min-w-[44px] rounded-md border border-stone-500/40 bg-black/20 px-4 py-2 text-sm text-stone-300 hover:border-cyan-500/50 hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-40 touch-manipulation"
        >
          Next
        </button>
      </div>
    </div>
  );
}
