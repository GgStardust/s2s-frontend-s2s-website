'use client';

import { useState, useEffect } from 'react';
import { getAllScrollstream } from '@/lib/content';
import Symbol from './Symbol';

interface ScrollstreamFlowProps {
  className?: string;
}

export default function ScrollstreamFlow({ className = '' }: ScrollstreamFlowProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [userResonance, setUserResonance] = useState<number[]>([]);
  const [backgroundPhrases, setBackgroundPhrases] = useState<string[]>([]);
  const scrollstream = getAllScrollstream();

  // Filter scrollstream based on user resonance (if any)
  const filteredScrollstream = userResonance.length > 0 
    ? scrollstream.filter((_, index) => userResonance.includes(index % 13))
    : scrollstream;

  // Update background phrases when main phrase changes
  useEffect(() => {
    if (filteredScrollstream.length === 0) return;
    
    // Get 3 different phrases that aren't the current one
    const availablePhrases = filteredScrollstream.filter((_, index) => index !== currentPhrase);
    const shuffled = [...availablePhrases].sort(() => Math.random() - 0.5);
    setBackgroundPhrases(shuffled.slice(0, 3));
  }, [currentPhrase, filteredScrollstream]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % filteredScrollstream.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, filteredScrollstream.length]);

  const handlePhraseClick = (phrase: string, index: number) => {
    // Show context/source of the phrase
    console.log('Phrase clicked:', phrase, 'Index:', index);
  };

  return (
    <div className={`relative w-full h-24 bg-deep-navy overflow-hidden ${className}`}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-deep-navy via-deep-navy/95 to-deep-navy"></div>
      
      {/* Floating Text Fragments */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Current Phrase */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl px-8">
              <p 
                className="text-creamy-white text-lg md:text-xl font-lora italic leading-relaxed cursor-pointer hover:text-deep-gold transition-colors duration-300"
                onClick={() => handlePhraseClick(filteredScrollstream[currentPhrase], currentPhrase)}
              >
                &quot;{filteredScrollstream[currentPhrase]}&quot;
              </p>
            </div>
          </div>

          {/* Dynamic Background Fragments */}
          {backgroundPhrases.map((phrase, index) => {
            // Position them away from the center to avoid interference
            const positions = [
              { left: '10%', top: '20%' },  // Top left
              { left: '70%', top: '70%' },  // Bottom right
              { left: '15%', top: '75%' }   // Bottom left
            ];
            const position = positions[index] || { left: '50%', top: '50%' };
            
            return (
              <div
                key={`bg-${phrase.substring(0, 10)}-${index}`}
                className="absolute text-creamy-white/20 text-sm font-lora italic animate-float cursor-pointer hover:text-creamy-white/40 transition-colors duration-300"
                style={{
                  left: position.left,
                  top: position.top,
                  animationDelay: `${index * 3}s`,
                  animationDuration: '12s'
                }}
                onClick={() => handlePhraseClick(phrase, index)}
                title="Click to explore related content"
              >
                {phrase.substring(0, 35)}...
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-4">
        {/* Play/Pause - Text Only for MVP */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-deep-gold/30 hover:bg-deep-gold/50 rounded-lg text-creamy-white text-sm font-medium transition-all duration-300 border border-deep-gold/40 hover:border-deep-gold/60"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Resonance Filter */}
        <button className="px-4 py-2 bg-deep-navy/80 hover:bg-deep-gold/40 rounded-full text-creamy-white text-xs font-semibold transition-all duration-300 border border-creamy-white/20 hover:border-deep-gold/60">
          My Field
        </button>
      </div>

      {/* Field Reading Indicator */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-deep-gold rounded-full animate-pulse"></div>
          <span className="text-creamy-white/60 text-sm font-semibold">
            Scrollstream Active
          </span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-deep-navy/50">
        <div 
          className="h-full bg-gradient-to-r from-deep-gold to-creamy-white transition-all duration-1000"
          style={{ width: `${((currentPhrase + 1) / filteredScrollstream.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
