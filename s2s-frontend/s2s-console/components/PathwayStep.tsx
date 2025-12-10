'use client';

import { useState } from 'react';
import CodexReader from './CodexReader';
import PracticeModule from './PracticeModule';

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

interface PathwayStepProps {
  step: {
    id: string;
    step_number: number;
    title?: string;
    description?: string;
    type: string;
    practice_id?: number;
    codex_entry_id?: string;
    instructions?: string;
    est_duration_minutes?: number;
  };
  pathwayId: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
  onComplete?: () => void;
}

export default function PathwayStep({ step, pathwayId, isCompleted, isCurrent, onComplete }: PathwayStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [showContent, setShowContent] = useState(false);
  const [showFullView, setShowFullView] = useState(false);

  const loadContent = async () => {
    if (content) {
      setShowContent(!showContent);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch step content from backend
      const response = await fetch(`${CMS_BACKEND_URL}/api/console/v3/pathway/steps/${step.id}/content`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
        setShowContent(true);
      } else {
        const error = await response.json();
        console.error('Error loading step content:', error);
        alert(error.error || 'Failed to load step content');
      }
    } catch (error) {
      console.error('Error loading step content:', error);
      alert('Failed to load step content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (isCompleted || !onComplete) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${CMS_BACKEND_URL}/api/console/v3/pathway/steps/${step.id}/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_pathway_id: pathwayId,
          }),
        }
      );
      if (response.ok) {
        onComplete();
      } else {
        const error = await response.json();
        console.error('Error completing step:', error);
        alert(error.error || 'Failed to complete step');
      }
    } catch (error) {
      console.error('Error completing step:', error);
      alert('Failed to complete step. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-6 hover:border-editorial-gold/50 transition-colors">
      {/* Step Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg ${
          isCompleted 
            ? 'bg-editorial-gold text-white' 
            : isCurrent 
            ? 'bg-editorial-gold/20 text-editorial-gold border-2 border-editorial-gold' 
            : 'bg-gray-100 text-editorial-text/60'
        }`}>
          {isCompleted ? '✓' : step.step_number}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-editorial-text">
                {step.title || `Step ${step.step_number}`}
              </h3>
              {step.description && (
                <p className="text-editorial-text/70 mb-3 leading-relaxed">{step.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-block px-3 py-1 bg-gray-100 rounded text-sm text-editorial-text/60">
                {step.type.replace(/_/g, ' ')}
              </span>
              {step.practice_id && (
                <span className="inline-block px-3 py-1 bg-editorial-gold/20 rounded text-sm text-editorial-text font-medium">
                  Practice {step.practice_id}
                </span>
              )}
              {step.est_duration_minutes && (
                <span className="text-xs text-editorial-text/50">
                  ~{step.est_duration_minutes} min
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={loadContent}
          disabled={isLoading}
          className="px-4 md:px-6 py-2 md:py-3 bg-editorial-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          {isLoading ? 'Loading...' : showContent ? 'Hide Content' : 'View Content'}
        </button>
        {!isCompleted && isCurrent && (
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="px-4 md:px-6 py-2 md:py-3 border-2 border-editorial-gold text-editorial-gold font-semibold rounded-lg hover:bg-editorial-gold/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {isLoading ? 'Completing...' : 'Mark Complete'}
          </button>
        )}
        {isCompleted && (
          <span className="px-4 md:px-6 py-2 md:py-3 bg-gray-100 text-editorial-text/60 font-semibold rounded-lg text-sm md:text-base">
            Completed
          </span>
        )}
      </div>

      {/* Step Content */}
      {showContent && content && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          {content.type === 'practice' && content.practice && (
            <div>
              {showFullView ? (
                <div>
                  <button
                    onClick={() => setShowFullView(false)}
                    className="mb-4 text-sm text-editorial-text/60 hover:text-editorial-text underline"
                  >
                    ← Back to Step
                  </button>
                  <PracticeModule
                    practiceId={content.practice.id}
                    instructions={content.instructions}
                    onComplete={onComplete}
                  />
                </div>
              ) : (
                <div className="prose max-w-none">
                  <h4 className="text-lg md:text-xl font-semibold mb-3 text-editorial-text">
                    Practice: {content.practice.name}
                  </h4>
                  {content.practice.core_function && (
                    <p className="text-base md:text-lg text-editorial-text/80 mb-4 italic">
                      {content.practice.core_function}
                    </p>
                  )}
                  {content.instructions && (
                    <div className="bg-gray-50 border-l-4 border-editorial-gold p-4 md:p-6 rounded-r-lg mb-4">
                      <p className="text-sm md:text-base text-editorial-text/90 whitespace-pre-line">
                        {content.instructions}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => setShowFullView(true)}
                    className="mt-4 px-6 py-3 bg-editorial-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base"
                  >
                    View Full Practice Module
                  </button>
                </div>
              )}
            </div>
          )}
          {content.type === 'codex_entry' && content.id && (
            <div>
              {showFullView ? (
                <div>
                  <button
                    onClick={() => setShowFullView(false)}
                    className="mb-4 text-sm text-editorial-text/60 hover:text-editorial-text underline"
                  >
                    ← Back to Step
                  </button>
                  <CodexReader entryId={content.id} onClose={() => setShowFullView(false)} />
                </div>
              ) : (
                <div className="prose max-w-none">
                  <h4 className="text-lg md:text-xl font-semibold mb-3 text-editorial-text">
                    {content.title || 'Codex Entry'}
                  </h4>
                  {content.codex_category && (
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded text-xs md:text-sm text-editorial-text/60 mb-4">
                      {content.codex_category}
                    </span>
                  )}
                  {content.orb_associations && content.orb_associations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {content.orb_associations.map((orb: number) => (
                        <span
                          key={orb}
                          className="px-3 py-1 bg-editorial-gold/20 rounded text-xs md:text-sm text-editorial-text"
                        >
                          Orb {orb}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setShowFullView(true)}
                    className="mt-4 px-6 py-3 bg-editorial-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base"
                  >
                    Read Full Entry
                  </button>
                </div>
              )}
            </div>
          )}
          {(content.type === 'reading' || content.type === 'reflection') && (
            <div className="prose max-w-none">
              {content.title && (
                <h4 className="text-lg md:text-xl font-semibold mb-3 text-editorial-text">{content.title}</h4>
              )}
              {content.description && (
                <p className="text-base md:text-lg text-editorial-text/80 mb-4">{content.description}</p>
              )}
              {content.instructions && (
                <div className="bg-gray-50 border-l-4 border-editorial-gold p-4 md:p-6 rounded-r-lg">
                  <p className="text-sm md:text-base text-editorial-text/90 whitespace-pre-line">
                    {content.instructions}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

