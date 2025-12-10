'use client';

import { useState } from 'react';

interface ExpandableExcerptProps {
  label: string;
  title: string;
  excerpt: string;
  fullText?: string;
  italicExcerpt?: string;
}

export default function ExpandableExcerpt({
  label,
  title,
  excerpt,
  fullText,
  italicExcerpt,
}: ExpandableExcerptProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show first 2-3 lines of excerpt (approximately 150 characters)
  const previewLength = 150;
  const showPreview = excerpt.length > previewLength && !isExpanded;
  const previewText = showPreview ? excerpt.substring(0, previewLength) + '...' : excerpt;

  return (
    <div 
      className="terminator-border cursor-pointer transition-all"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-6 bg-cosmic-blue rounded-lg">
        <p className="text-sm text-cyan-300/80 mb-2">{label}</p>
        <h3 className="text-lg font-medium text-cyan-300 mb-3">{title}</h3>
        <div>
          <p className="text-base leading-relaxed text-stone-200 italic mb-3">
            {showPreview ? previewText : excerpt}
          </p>
          {fullText && (
            <>
              {!isExpanded && (
                <p className="text-sm text-cyan-300/80 hover:text-cyan-300 cursor-pointer inline-block">
                  Click to expand →
                </p>
              )}
              {isExpanded && (
                <div className="space-y-3">
                  <p className="text-base leading-relaxed text-stone-200">
                    {fullText}
                  </p>
                  <p className="text-sm text-cyan-300/80 hover:text-cyan-300 cursor-pointer inline-block">
                    Click to collapse
                  </p>
                </div>
              )}
            </>
          )}
          {italicExcerpt && (
            <>
              {!isExpanded && (
                <p className="text-sm text-cyan-300/80 hover:text-cyan-300 cursor-pointer inline-block">
                  Click to expand →
                </p>
              )}
              {isExpanded && (
                <div className="space-y-3">
                  <p className="text-base leading-relaxed text-stone-700 italic">
                    {italicExcerpt}
                  </p>
                  <p className="text-sm text-cyan-300/80 hover:text-cyan-300 cursor-pointer inline-block">
                    Click to collapse
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
