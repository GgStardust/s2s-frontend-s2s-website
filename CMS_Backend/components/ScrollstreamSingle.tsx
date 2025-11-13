'use client';

import { useState, useEffect } from 'react';

interface ScrollstreamSingleProps {
  pulses: string[];
  autoRotate?: boolean;
  intervalMs?: number;
}

export default function ScrollstreamSingle({ 
  pulses, 
  autoRotate = true, 
  intervalMs = 5000 
}: ScrollstreamSingleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Auto-rotate if enabled and not reduced motion
  useEffect(() => {
    if (!autoRotate || isReducedMotion || pulses.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pulses.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [autoRotate, isReducedMotion, intervalMs, pulses.length]);

  const nextPulse = () => {
    setCurrentIndex((prev) => (prev + 1) % pulses.length);
  };

  const prevPulse = () => {
    setCurrentIndex((prev) => (prev - 1 + pulses.length) % pulses.length);
  };

  if (pulses.length === 0) return null;

  return (
    <div className="bg-deep-navy rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-deep-gold rounded-full mr-3"></div>
          <h2 className="text-creamy-white font-montserrat font-semibold text-lg uppercase tracking-wide">
            Scrollstream
          </h2>
        </div>
        {!isReducedMotion && pulses.length > 1 && (
          <div className="flex items-center text-deep-gold text-xs font-montserrat uppercase tracking-wide">
            <div className="w-2 h-2 bg-deep-gold rounded-full mr-2 animate-pulse"></div>
            Live Feed
          </div>
        )}
      </div>

      <div className="bg-cosmic-blue/20 rounded-lg px-4 py-3 border border-cosmic-blue/30 mb-4">
        <p className="text-creamy-white font-lora text-sm leading-relaxed">
          {pulses[currentIndex]}
        </p>
        <div className="mt-2 text-cosmic-blue text-xs font-montserrat uppercase tracking-wide">
          Live Transmission
        </div>
      </div>

      {pulses.length > 1 && (
        <div className="flex justify-between">
          <button
            onClick={prevPulse}
            className="text-deep-gold hover:text-creamy-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-deep-gold focus:ring-offset-2 focus:ring-offset-deep-navy rounded"
            aria-label="Previous transmission"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex space-x-1">
            {pulses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-deep-gold focus:ring-offset-2 focus:ring-offset-deep-navy ${
                  index === currentIndex ? 'bg-deep-gold' : 'bg-cosmic-blue/40'
                }`}
                aria-label={`Go to transmission ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextPulse}
            className="text-deep-gold hover:text-creamy-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-deep-gold focus:ring-offset-2 focus:ring-offset-deep-navy rounded"
            aria-label="Next transmission"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
