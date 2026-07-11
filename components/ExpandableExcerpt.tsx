'use client';

import { useId, useState } from 'react';

export interface ExcerptParaphrase {
  label?: string;
  text: string;
}

interface ExpandableExcerptProps {
  label: string;
  title: string;
  excerpt: string;
  fullText?: string;
  italicExcerpt?: string;
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
    <article className="rounded-sm border border-stone-400/20 bg-cosmic-blue-light/20">
      <div className="p-6 md:p-7">
        <p className="text-xs uppercase tracking-[0.15em] text-stone-500 mb-2 font-sans">{label}</p>
        <h3 className="text-lg font-medium text-stone-100 mb-3 font-serif">{title}</h3>
        <div id={contentId}>
          <p className="text-base leading-relaxed text-stone-300 italic mb-3 font-serif">
            {showPreview ? previewText : excerpt}
          </p>
          {hasExpandable ? (
            <>
              {isExpanded ? (
                <div className="space-y-3">
                  {fullText ? (
                    <p className="text-base leading-relaxed text-stone-300 whitespace-pre-line font-serif">{fullText}</p>
                  ) : null}
                  {italicExcerpt ? (
                    <p className="text-base leading-relaxed text-stone-300 italic font-serif">{italicExcerpt}</p>
                  ) : null}
                </div>
              ) : null}
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                onClick={toggle}
                className="mt-2 inline-flex min-h-[44px] items-center text-sm text-stone-400 hover:text-stone-200 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 rounded-sm px-1 touch-manipulation font-sans"
              >
                {isExpanded ? 'Collapse excerpt' : 'Expand excerpt →'}
              </button>
            </>
          ) : null}
        </div>
        {paraphrase ? (
          <div className="mt-4 pt-4 border-t border-stone-500/20">
            {paraphrase.label?.trim() ? (
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide font-sans">{paraphrase.label}</p>
            ) : null}
            <p className={`text-sm text-stone-500 leading-relaxed font-sans ${paraphrase.label?.trim() ? 'mt-2' : ''}`}>
              {paraphrase.text}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
