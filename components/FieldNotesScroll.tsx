'use client';

import { useEffect, useState } from 'react';
import { allScrollLines } from '@/content/essays-data';

export default function FieldNotesScroll() {
  const [displayLines, setDisplayLines] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle and select 10-15 lines
    const shuffled = [...allScrollLines].sort(() => Math.random() - 0.5);
    setDisplayLines(shuffled.slice(0, 12));
  }, []);

  if (displayLines.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto py-12 border-t border-stone-300/30 px-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-cyan-300 mb-2">
          Field Notes
        </h2>
        <p className="text-sm text-stone-400 italic">
          Scrollstream: excerpts from the Codex
        </p>
      </div>
      <div className="terminator-border overflow-hidden rounded-lg">
        <div className="p-6 bg-cosmic-blue">
          <div className="flex gap-8 animate-scroll-horizontal">
            {displayLines.map((line, index) => (
              <div
                key={index}
                className="flex-shrink-0 text-sm text-stone-300 italic whitespace-nowrap"
              >
                {line}
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {displayLines.map((line, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 text-sm text-stone-300 italic whitespace-nowrap"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-horizontal {
          animation: scroll-horizontal 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
