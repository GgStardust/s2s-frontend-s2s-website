'use client';

import { useState } from 'react';
import { Essay } from '@/content/essays-data';

interface EssayCardProps {
  essay: Essay;
}

export default function EssayCard({ essay }: EssayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="terminator-border">
      <div className="p-6 bg-cosmic-blue rounded-lg h-full">
        <div className="mb-3">
          <span className="px-2 py-1 bg-cyan-400/20 text-cyan-300 rounded text-xs font-medium">
            {essay.orbName}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-3 tracking-tight text-cyan-300">
          {essay.title}
        </h3>
        {!isExpanded ? (
          <>
            <p className="text-sm text-stone-300 mb-4 leading-relaxed line-clamp-4">
              {essay.excerpt}
            </p>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 text-sm"
            >
              Read Full Essay →
            </button>
          </>
        ) : (
          <>
            <div className="text-sm text-stone-300 mb-4 leading-relaxed whitespace-pre-line">
              {essay.fullContent}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 text-sm"
            >
              Show Less ↑
            </button>
          </>
        )}
      </div>
    </div>
  );
}
