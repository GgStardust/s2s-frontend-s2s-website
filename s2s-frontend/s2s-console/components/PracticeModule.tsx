'use client';

import { useState, useEffect } from 'react';

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

interface PracticeModuleProps {
  practiceId: number;
  instructions?: string;
  onComplete?: () => void;
}

export default function PracticeModule({ practiceId, instructions, onComplete }: PracticeModuleProps) {
  const [practice, setPractice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const loadPractice = async () => {
      try {
        const response = await fetch(`${CMS_BACKEND_URL}/api/console/v3/practices/${practiceId}`);
        if (!response.ok) {
          throw new Error('Failed to load practice');
        }
        const data = await response.json();
        setPractice(data);
      } catch (error) {
        console.error('Error loading practice:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPractice();
  }, [practiceId]);

  const handleComplete = async () => {
    if (!onComplete) return;
    
    setIsCompleting(true);
    try {
      // Mark practice as completed
      // TODO: Add practice completion API endpoint
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onComplete();
    } catch (error) {
      console.error('Error completing practice:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <p className="text-editorial-text/60">Loading practice...</p>
        </div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <p className="text-editorial-text/60">Practice not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6">
      {/* Practice Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
          <span className="px-3 md:px-4 py-1 md:py-2 bg-editorial-gold/20 rounded-lg text-editorial-gold font-semibold text-sm md:text-base">
            Practice {practiceId}
          </span>
          <span className="px-3 md:px-4 py-1 md:py-2 bg-gray-100 rounded-lg text-editorial-text/60 text-xs md:text-sm capitalize">
            {practice.layer}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 md:mb-4 text-editorial-text">
          {practice.name}
        </h1>
        {practice.core_function && (
          <p className="text-lg md:text-xl text-editorial-text/80 italic mb-4 md:mb-6">
            {practice.core_function}
          </p>
        )}
      </div>

      {/* Practice Instructions */}
      <div className="bg-gray-50 border-l-4 border-editorial-gold p-4 md:p-6 lg:p-8 rounded-r-lg mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-editorial-text">Instructions</h2>
        {instructions ? (
          <div className="prose prose-sm md:prose-base max-w-none">
            <div
              className="text-sm md:text-base text-editorial-text/90 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: instructions }}
            />
          </div>
        ) : (
          <p className="text-sm md:text-base text-editorial-text/70 italic">
            Practice instructions will be provided here. This is a lived module—a way of inhabiting reality, not a task to complete.
          </p>
        )}
      </div>

      {/* Practice Details */}
      {practice.description && (
        <div className="mb-6 md:mb-8">
          <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-editorial-text">
            About This Practice
          </h3>
          <p className="text-sm md:text-base text-editorial-text/80 leading-relaxed">
            {practice.description}
          </p>
        </div>
      )}

      {/* Practice Steps (if available) */}
      {practice.steps && practice.steps.length > 0 && (
        <div className="mb-6 md:mb-8">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-editorial-text">
            Practice Steps
          </h3>
          <ol className="space-y-3 md:space-y-4">
            {practice.steps.map((step: any, index: number) => (
              <li key={index} className="flex gap-3 md:gap-4">
                <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-editorial-gold/20 text-editorial-gold flex items-center justify-center font-semibold text-sm md:text-base">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm md:text-base text-editorial-text/90 leading-relaxed">{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Completion Action */}
      {onComplete && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-editorial-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg"
          >
            {isCompleting ? 'Completing...' : 'Mark Practice Complete'}
          </button>
          <p className="mt-4 text-xs md:text-sm text-editorial-text/60 italic">
            Remember: This is a way of inhabiting reality, not a task. Complete when you feel ready to move forward.
          </p>
        </div>
      )}
    </div>
  );
}

