'use client';

import { useState } from 'react';
import { Essay } from '@/content/essays-data';

interface FeaturedEssayProps {
  essay: Essay;
}

export default function FeaturedEssay({ essay }: FeaturedEssayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="terminator-border">
      <div className="p-8 bg-cosmic-blue rounded-lg">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded text-sm font-medium">
              {essay.orbName}
            </span>
            <span className="text-stone-400 text-sm">Featured Essay</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-cyan-300 mb-3">
            {essay.title}
          </h2>
        </div>

        {!isExpanded ? (
          <>
            <p className="text-base leading-relaxed text-stone-200 mb-6">
              {essay.excerpt}
            </p>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2 text-sm font-medium"
            >
              Read Full Essay →
            </button>
          </>
        ) : (
          <>
            <div className="prose prose-invert prose-cyan max-w-none mb-6">
              <div className="text-base leading-relaxed text-stone-200 whitespace-pre-line">
                {essay.fullContent}
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2 text-sm font-medium"
            >
              Show Less ↑
            </button>
          </>
        )}
      </div>
    </div>
  );
}
