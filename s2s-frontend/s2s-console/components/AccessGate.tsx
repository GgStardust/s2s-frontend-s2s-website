'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessCheck } from '@/lib/useAccessCheck';
import ConsoleLayout from './ConsoleLayout';

interface AccessGateProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that gates Console routes behind access check
 * Redirects to console info page if no access
 */
export default function AccessGate({ children, redirectTo = '/console' }: AccessGateProps) {
  const { hasAccess, isLoading, error } = useAccessCheck();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !hasAccess) {
      // Redirect to console info page if no access
      router.push(redirectTo);
    }
  }, [hasAccess, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <ConsoleLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-editorial-text/60 mb-4">Checking access...</p>
          </div>
        </div>
      </ConsoleLayout>
    );
  }

  if (error) {
    return (
      <ConsoleLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <p className="text-red-600 mb-4">Error checking access: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-editorial-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      </ConsoleLayout>
    );
  }

  if (!hasAccess) {
    // Show message while redirecting
    return (
      <ConsoleLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <p className="text-editorial-text/60 mb-4">Redirecting...</p>
          </div>
        </div>
      </ConsoleLayout>
    );
  }

  return <>{children}</>;
}



