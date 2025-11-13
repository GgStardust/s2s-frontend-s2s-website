import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  header?: ReactNode;
}

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, sidebar, header, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('min-h-screen bg-backend-secondary', className)}
        {...props}
      >
        {header && (
          <header className="bg-white border-b border-backend-default sticky top-0 z-10">
            {header}
          </header>
        )}

        <div className="flex">
          {sidebar && (
            <aside className="w-64 bg-white border-r border-backend-default min-h-[calc(100vh-64px)] sticky top-16">
              {sidebar}
            </aside>
          )}

          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    );
  }
);

Layout.displayName = 'Layout';

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, subtitle, action, breadcrumbs, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-8', className)}
        {...props}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-backend-muted mb-3">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-backend-primary transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-backend-primary">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-backend-primary mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base text-backend-secondary">
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div className="ml-4 flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, title, description, action, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('mb-8', className)}
        {...props}
      >
        {(title || description || action) && (
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              {title && (
                <h2 className="text-xl font-semibold text-backend-primary">
                  {title}
                </h2>
              )}
              {action && (
                <div className="ml-4 flex-shrink-0">
                  {action}
                </div>
              )}
            </div>
            {description && (
              <p className="text-sm text-backend-secondary">
                {description}
              </p>
            )}
          </div>
        )}

        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-16 px-6 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 text-backend-muted">
            {icon}
          </div>
        )}

        <h3 className="text-lg font-semibold text-backend-primary mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-backend-secondary max-w-md mb-6">
            {description}
          </p>
        )}

        {action && action}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
