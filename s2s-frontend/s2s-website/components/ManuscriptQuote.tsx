import { QUOTES } from '@/lib/content';

interface ManuscriptQuoteProps {
  quote: keyof typeof QUOTES;
  source?: string;
  variant?: 'default' | 'italic' | 'highlight';
  className?: string;
}

export default function ManuscriptQuote({ 
  quote, 
  source, 
  variant = 'default',
  className = '' 
}: ManuscriptQuoteProps) {
  const quoteText = QUOTES[quote];
  
  const baseClasses = "text-base leading-relaxed text-stone-200";
  const variantClasses = {
    default: "",
    italic: "italic",
    highlight: "italic text-cyan-300/90",
  };

  return (
    <div className={`border-l-2 border-cyan-400/50 pl-4 ${className}`}>
      <p className={`${baseClasses} ${variantClasses[variant]} mb-2`}>
        {quoteText}
      </p>
      {source && (
        <p className="text-sm text-cyan-300/80">{source}</p>
      )}
    </div>
  );
}
