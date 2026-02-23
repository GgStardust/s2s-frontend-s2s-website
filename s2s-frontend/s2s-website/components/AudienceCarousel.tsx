'use client';

import { useState, useEffect } from 'react';

interface AudienceSlide {
  title: string;
  statements: string[];
}

const slides: AudienceSlide[] = [
  {
    title: 'The Pattern-Tracker',
    statements: [
      'You see the structure beneath experience.',
      'You notice emotional and relational patterns long before others name them.',
      'Systems thinking and intuitive knowing operate as one intelligence in you.',
    ],
  },
  {
    title: 'The Creative Initiator',
    statements: [
      'Your inner world is catalytic.',
      'Intensity becomes fuel, insight becomes form, and transformation becomes art.',
      'You create from the pressure of something intelligent moving through you.',
    ],
  },
  {
    title: 'The Relational Mirror',
    statements: [
      'Connection is signal.',
      'You read people through coherence, resonance, and subtle shifts.',
      'You experience relationships as dynamic fields, not static roles.',
    ],
  },
  {
    title: 'The Intuitive Leader',
    statements: [
      'People look to you for clarity, timing, and direction.',
      'You navigate by instinct you haven\'t fully articulated.',
      'You sense trajectories before they unfold.',
    ],
  },
  {
    title: 'The Threshold-Walker',
    statements: [
      'You are moving through an inner shift—identity reorganizing, perception expanding.',
      'Linear explanations no longer match your experience.',
      'You sense a deeper architecture beneath your life. The structure becomes visible.',
    ],
  },
  {
    title: 'The Future-Human',
    statements: [
      'Time feels layered, intuition arrives fully formed, and coherence matters more than convention.',
      'You recognize yourself in ideas that speak to origin, signal, and multidimensional intelligence.',
    ],
  },
];

export default function AudienceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(newIndex);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(newIndex);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <div
      className="relative group w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-lg w-full relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / slides.length)}%)`,
            width: `${slides.length * 100}%`
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-4"
              style={{ width: `${100 / slides.length}%` }}
            >
              <h3 className="text-xl lg:text-2xl font-semibold tracking-tight text-cyan-300 mb-4 text-center">
                {slide.title}
              </h3>
              <ul className="space-y-3 text-base leading-relaxed text-stone-200 max-w-3xl mx-auto">
                {slide.statements.map((statement, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-cyan-400/60 mr-3 mt-1 flex-shrink-0">✦</span>
                    <span>{statement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToSlide(index);
            }}
            type="button"
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex
                ? 'w-8 bg-cyan-300'
                : 'w-2 bg-cyan-300/30 hover:bg-cyan-300/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows - Visible on hover */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goToPrevious();
        }}
        type="button"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cosmic-blue/90 hover:bg-cosmic-blue border border-cyan-300/40 hover:border-cyan-300/70 text-cyan-300 hover:text-cyan-200 transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goToNext();
        }}
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cosmic-blue/90 hover:bg-cosmic-blue border border-cyan-300/40 hover:border-cyan-300/70 text-cyan-300 hover:text-cyan-200 transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
