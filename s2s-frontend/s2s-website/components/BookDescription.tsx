import { BOOK_DESCRIPTIONS, BUTTON_LABELS, MIXAM_ORDER_URL } from '@/lib/content';
import Button from '@/components/ui/Button';

interface BookDescriptionProps {
  variant?: 'full' | 'withSystem';
  showButtons?: boolean;
  className?: string;
}

export default function BookDescription({ 
  variant = 'full', 
  showButtons = false,
  className = '' 
}: BookDescriptionProps) {
  const description = variant === 'withSystem' 
    ? BOOK_DESCRIPTIONS.bookOne.fullWithSystem
    : BOOK_DESCRIPTIONS.bookOne.full;

  return (
    <div className={className}>
      <p className="text-base leading-relaxed text-stone-200 mb-6">
        {description}
      </p>
      {showButtons && (
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href={MIXAM_ORDER_URL} variant="primary" external>
            {BUTTON_LABELS.getBookOne}
          </Button>
          <Button href="/about" variant="tertiary">
            Read About the Book →
          </Button>
        </div>
      )}
    </div>
  );
}
