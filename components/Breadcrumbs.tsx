'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);

  const segmentLabels: Record<string, string> = {
    order: 'Order',
    direct: 'Order direct',
    books: 'Read',
    about: 'About',
    codex: 'Source Field',
    'source-field': 'Source Field',
    console: 'Console',
    success: 'Success',
  };

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label =
      segmentLabels[segment] ??
      segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
      <ol className="flex items-center space-x-2 text-sm text-stone-300">
        <li>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center py-2 hover:text-cyan-300 transition-colors touch-manipulation"
          >
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            <span className="mx-2 text-stone-500">/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-stone-200" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="inline-flex min-h-[44px] items-center py-2 hover:text-cyan-300 transition-colors touch-manipulation"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
