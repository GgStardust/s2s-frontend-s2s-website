'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  "This book is life-changing. It speaks in a language my mind has never heard but my being has always known.",
  "The opening lines hit with the force of scripture—bold, ancient, and utterly new.",
  "The language opened my entire conceptual framework. It doesn't just describe consciousness—it activates it.",
  "Mesmerizing. It revealed a space inside me I've only partially explored in meditation or the night sky.",
  "The synthesis of free will and determinism was an absolute gut punch—clarity I didn't know was possible.",
  "Seeing intuition described so accurately felt uncanny—like the book was naming the inner mechanics of my mind.",
  "A rare blend of science, poetry, and cosmic intelligence. This work reorganizes how you think.",
  "I found myself wanting more. Every page feels like the beginning of a new way of understanding.",
  "This book awakens real questions—about death, identity, awareness, and what it means to be the universe in human form.",
  "I recognized myself in these pages in a way that was both exhilarating and unsettling. The accuracy is startling.",
  "The meaning and truth of this work is expansive. I can feel myself beyond myself—as part of Universal Cosmic Intelligence. Literally mind-blowing.",
];

export default function TestimonialsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsVisible(true);
      }, 600); // Half of crossfade duration
    }, 6500); // 6.5 seconds total (6s visible + 0.5s transition)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[80px] flex items-center justify-center">
      <div
        className={`text-base md:text-lg leading-relaxed text-stone-50 italic text-center max-w-3xl mx-auto px-4 transition-opacity duration-[1200ms] ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        "{testimonials[currentIndex]}"
      </div>
    </div>
  );
}
