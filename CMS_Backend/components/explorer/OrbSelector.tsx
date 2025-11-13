'use client';

import { useEffect } from 'react';
import { Orb } from '@/lib/types';

interface OrbSelectorProps {
  orbs: Orb[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export default function OrbSelector({ orbs, selectedId, onSelect }: OrbSelectorProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentIndex = orbs.findIndex(orb => orb.id === selectedId);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : orbs.length - 1;
        onSelect(orbs[prevIndex].id);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = orbs.findIndex(orb => orb.id === selectedId);
        const nextIndex = currentIndex < orbs.length - 1 ? currentIndex + 1 : 0;
        onSelect(orbs[nextIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orbs, selectedId, onSelect]);

  return (
    <div className="bg-white rounded-xl p-6 border border-deep-gold/20">
      <h2 className="text-deep-navy font-montserrat font-semibold text-lg mb-6">
        Select Orb
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {orbs.map((orb) => (
          <button
            key={orb.id}
            onClick={() => onSelect(orb.id)}
            className={`
              w-14 h-14 rounded-full flex items-center justify-center text-sm font-montserrat font-bold
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-deep-gold focus:ring-offset-2
              ${selectedId === orb.id
                ? 'bg-deep-gold text-creamy-white shadow-lg transform scale-105'
                : 'bg-deep-navy text-creamy-white hover:bg-deep-gold hover:text-creamy-white hover:shadow-md'
              }
            `}
            aria-current={selectedId === orb.id ? 'true' : 'false'}
            aria-label={`Select Orb ${orb.id}: ${orb.title}`}
          >
            {orb.id}
          </button>
        ))}
      </div>
    </div>
  );
}
