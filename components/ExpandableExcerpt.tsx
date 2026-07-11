'use client';

import { useId, useState } from 'react';

export interface ExcerptParaphrase {
  /** Optional short heading; omitted when only body copy is needed. */
  label?: string;
  text: string;
}

interface ExpandableExcerptProps {
  label: string;
  title: string;
  excerpt: string;
  fullText?: string;
  italicExcerpt?: string;
  /** Always visible; summarizes a longer arc in plain language. */
  paraphrase?: ExcerptParaphrase;
}

export default function ExpandableExcerpt({
  label,
  title,
  excerpt,
  fullText,
  italicExcerpt,
  paraphrase,
}: ExpandableExcerptProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();

  const previewLength = 150;
  const showPreview = excerpt.length > previewLength && !isExpanded;
  const previewText = showPreview ? excerpt.substring(0, previewLength) + '...' : excerpt;

  const hasExpandable = Boolean((fullText && fullText.length > 0) || (italicExcerpt && italicExcerpt.length > 0));

  const toggle = () => {
    if (hasExpandable) setIsExpanded((v) => !v);
  };

  return (
    <article className="terminator-border">
      <div className="p-6 bg-cosmic-blue rounded-lg">
        <p className="text-sm text-cyan-300/80 mb-2">{label}</p>
        <h3 className="text-lg font-medium text-cyan-300 mb-2">{title}</h3>
        <div id={contentId}>
          <p className="text-base leading-relaxed text-stone-200 italic mb-3">{showPreview ? previewText : excerpt}</p>
          {hasExpandable ? (
            <>
              {isExpanded ? (
                <div className="space-y-3">
                  {fullText ? (
                    <p className="text-base leading-relaxed text-stone-200 whitespace-pre-line">{fullText}</p>
                  ) : null}
                  {italicExcerpt ? (
                    <p className="text-base leading-relaxed text-stone-200 italic">{italicExcerpt}</p>
                  ) : null}
                </div>
              ) : null}
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                onClick={toggle}
                className="mt-2 inline-flex min-h-[44px] items-center text-sm text-cyan-300/80 hover:text-cyan-300 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm px-1 touch-manipulation"
              >
                {isExpanded ? 'Collapse excerpt' : 'Expand excerpt →'}
              </button>
            </>
          ) : null}
        </div>
        {paraphrase ? (
          <div className="mt-4 pt-4 border-t border-stone-500/25">
            {paraphrase.label?.trim() ? (
              <p className="text-xs font-medium text-cyan-300/70 uppercase tracking-wide">{paraphrase.label}</p>
            ) : null}
            <p className={`text-sm text-stone-400 leading-relaxed ${paraphrase.label?.trim() ? 'mt-2' : ''}`}>
              {paraphrase.text}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
