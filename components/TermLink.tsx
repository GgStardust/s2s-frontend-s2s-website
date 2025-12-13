'use client';

import Link from 'next/link';
import { getGlossaryTerm } from '@/lib/glossary';

interface TermLinkProps {
  term: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Component for inline term links that link to glossary entries
 * Usage: <TermLink term="Sovereign Field">Sovereign Field</TermLink>
 * Or: <TermLink term="Sovereign Field" /> (uses term name as children)
 */
export default function TermLink({ term, children, className = '' }: TermLinkProps) {
  const glossaryTerm = getGlossaryTerm(term);
  
  if (!glossaryTerm) {
    // If term not found in glossary, just render the text without link
    return <span className={className}>{children || term}</span>;
  }

  const href = `/glossary#${glossaryTerm.slug}`;
  const displayText = children || term;

  return (
    <Link
      href={href}
      className={`text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition-colors ${className}`}
      title={`View definition: ${term}`}
    >
      {displayText}
    </Link>
  );
}
