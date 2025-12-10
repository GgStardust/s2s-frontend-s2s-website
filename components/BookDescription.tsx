import { BOOK_DESCRIPTIONS } from '@/lib/content';
import Button from '@/components/ui/Button';
import { BUTTON_LABELS } from '@/lib/content';

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
          <Button href="/preorder" variant="primary">
            {BUTTON_LABELS.preorder}
          </Button>
          <Button href="/about-the-book" variant="tertiary">
            Read About the Book →
          </Button>
        </div>
      )}
    </div>
  );
}
