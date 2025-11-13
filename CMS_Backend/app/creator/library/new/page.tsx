'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewContentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Dynamic Editor
    router.replace('/creator/dynamic-editor');
  }, [router]);

  return (
    <div className="min-h-screen bg-deep-navy flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-gold mx-auto mb-4"></div>
        <p className="text-creamy-white">Redirecting to Dynamic Editor...</p>
      </div>
    </div>
  );
}