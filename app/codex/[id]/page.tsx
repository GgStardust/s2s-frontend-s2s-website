'use client';

import Link from 'next/link';
import { essays } from '@/content/essays-data';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EssayPage() {
  const params = useParams();
  const id = params?.id as string;
  const essay = essays.find(e => e.id === id);

  // Protection: Disable text selection, right-click, and keyboard shortcuts
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts (Ctrl+C, Cmd+C, Ctrl+A, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+A / Cmd+A (select all)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+P / Cmd+P (print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+S / Cmd+S (save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Block F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    // Disable print dialog
    const handleBeforePrint = () => {
      window.alert('Printing is disabled for this content.');
      return false;
    };

    // Disable drag
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
              <h1 className="text-2xl font-semibold text-cyan-300 mb-4">Essay Not Found</h1>
              <p className="text-stone-300 mb-6">The essay you're looking for doesn't exist.</p>
              <Link href="/codex" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
                ← Back to Codex
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-structural-grid">
      {/* Protection overlay - makes it harder to screenshot */}
      <div className="fixed inset-0 pointer-events-none z-50 select-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent opacity-0">
          {/* Subtle watermark effect */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Back button */}
        <div className="mb-8">
          <Link 
            href="/codex" 
            className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 text-sm inline-flex items-center gap-2"
          >
            ← Back to Codex
          </Link>
        </div>

        {/* Essay content */}
        <article className="terminator-border">
          <div className="p-8 bg-cosmic-blue rounded-lg">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded text-sm font-medium">
                  {essay.orbName}
                </span>
                {essay.category === 'featured' && (
                  <span className="px-3 py-1 bg-cyan-400/10 text-cyan-300/80 rounded text-xs">
                    Featured
                  </span>
                )}
                {essay.tags && essay.tags.length > 0 && (
                  <>
                    {essay.tags.slice(0, 5).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-stone-700/50 text-stone-300 rounded text-xs font-normal"
                      >
                        {tag.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {essay.tags.length > 5 && (
                      <span className="px-2 py-1 bg-stone-700/30 text-stone-400 rounded text-xs">
                        +{essay.tags.length - 5} more
                      </span>
                    )}
                  </>
                )}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-cyan-300 mb-2">
                {essay.title}
              </h1>
            </div>

            {/* Content - with protection styles */}
            <div 
              className="prose prose-invert prose-cyan max-w-none text-base leading-relaxed text-stone-200 select-none"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                WebkitTouchCallout: 'none',
              } as React.CSSProperties}
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-semibold text-cyan-300 mt-8 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-cyan-300 mt-6 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-cyan-300 mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props} />,
                  li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-cyan-200" {...props} />,
                  em: ({node, ...props}) => <em className="italic" {...props} />,
                  code: ({node, ...props}) => <code className="bg-stone-800 px-1.5 py-0.5 rounded text-sm" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-cyan-400/50 pl-4 italic my-4" {...props} />,
                }}
              >
                {essay.fullContent}
              </ReactMarkdown>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-cyan-400/30">
              <Link 
                href="/codex" 
                className="text-cyan-300/80 hover:text-cyan-300 underline underline-offset-2 text-sm"
              >
                ← Back to Codex
              </Link>
            </div>
          </div>
        </article>
      </div>

      {/* Print protection CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          body {
            background: white !important;
          }
          main, article, .terminator-border {
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
