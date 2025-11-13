import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, subtitle, headerAction, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border border-backend-default rounded-lg shadow-sm',
          'hover:shadow-md transition-shadow',
          className
        )}
        {...props}
      >
        {(title || subtitle || headerAction) && (
          <div className="px-6 py-4 border-b border-backend-default">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-backend-primary">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-backend-secondary">
                    {subtitle}
                  </p>
                )}
              </div>
              {headerAction && (
                <div className="ml-4 flex-shrink-0">
                  {headerAction}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-6 py-4">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-backend-default rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
}

export const CardGrid = forwardRef<HTMLDivElement, CardGridProps>(
  ({ className, columns = 3, children, ...props }, ref) => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid gap-6',
          gridCols[columns],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardGrid.displayName = 'CardGrid';
