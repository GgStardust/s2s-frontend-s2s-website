'use client';

import Link from 'next/link';
import { essays } from '@/content/essays-data';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function SourceFieldEssayPage() {
  const params = useParams();
  const id = params?.id as string;
  const essay = essays.find((e) => e.id === id);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    const handleBeforePrint = () => {
      window.alert('Printing is disabled for this content.');
      return false;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeprint', handleBeforePrint);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeprint', handleBeforePrint);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  if (!essay) {
    return (
      <main className="min-h-screen bg-structural-grid">
        <div className="max-w-4xl mx-auto py-20 px-6">
          <div className="terminator-border">
            <div className="p-8 bg-cosmic-blue rounded-lg text-center">
              <h1 className="text-2xl font-semibold text-cyan-300 mb-4">Essay unavailable</h1>
              <p className="text-stone-300 mb-6">This essay is unavailable at the moment.</p>
              <Link href="/source-field" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
                ← Back to Source Field
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-structural-grid">
      <div className="fixed inset-0 pointer-events-none z-50 select-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent opacity-0" />
      </div>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-8">
          <Link
            href="/source-field"
            className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 text-sm inline-flex items-center gap-2"
          >
            ← Back to Source Field
          </Link>
        </div>

        <article className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded text-sm font-medium">
                  {essay.orbName}
                </span>
                {essay.category === 'featured' && (
                  <span className="px-3 py-1 bg-cyan-400/10 text-cyan-300/80 rounded text-xs">Featured</span>
                )}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-cyan-300 mb-2">{essay.title}</h1>
            </div>

            <div
              className="prose prose-invert prose-cyan max-w-none text-base leading-relaxed text-stone-200 whitespace-pre-line select-none"
              style={
                {
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                } as React.CSSProperties
              }
              onCopy={(e) => {
                e.preventDefault();
                e.clipboardData.setData('text/plain', '');
                return false;
              }}
              onCut={(e) => {
                e.preventDefault();
                return false;
              }}
              onPaste={(e) => {
                e.preventDefault();
                return false;
              }}
              onDragStart={(e) => {
                e.preventDefault();
                return false;
              }}
            >
              {essay.fullContent}
            </div>

            <div className="mt-8 pt-6 border-t border-cyan-400/30">
              <Link
                href="/source-field"
                className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 text-sm"
              >
                ← Back to Source Field
              </Link>
            </div>
          </div>
        </article>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          body {
            background: white !important;
          }
          main,
          article,
          .terminator-border {
            display: none !important;
          }
        }
        @page {
          size: auto;
          margin: 0;
        }
      `}</style>
    </main>
  );
}
