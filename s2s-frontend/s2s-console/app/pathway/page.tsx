'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ConsoleLayout from '@/components/ConsoleLayout';
import AccessGate from '@/components/AccessGate';
import PathwayProgress from '@/components/PathwayProgress';
import PathwayStep from '@/components/PathwayStep';

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

interface PathwayStep {
  id: string;
  step_number: number;
  title?: string;
  description?: string;
  type: string;
  practice_id?: number;
}

interface Pathway {
  id: string;
  pathway_template_id: string;
  progress_percentage: number;
  status: string;
  current_step_id?: string;
  completed_step_ids?: string[];
}

interface PathwayTemplate {
  id: string;
  name: string;
  description?: string;
}

export default function PathwayView() {
  const router = useRouter();
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [template, setTemplate] = useState<PathwayTemplate | null>(null);
  const [steps, setSteps] = useState<PathwayStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedStepIds, setCompletedStepIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadPathway = async () => {
      try {
        const email = localStorage.getItem('diagnostic_email');
        const sessionId = localStorage.getItem('diagnostic_session_id');

        if (!sessionId) {
          router.push('/diagnostic');
          return;
        }

        const params = new URLSearchParams();
        if (sessionId) params.append('session_id', sessionId);
        if (email) params.append('email', email);

        const response = await fetch(
          `${CMS_BACKEND_URL}/api/console/v3/pathway?${params.toString()}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            // No pathway yet, redirect to diagnostic
            router.push('/diagnostic');
            return;
          }
          throw new Error('Failed to load pathway');
        }

        const data = await response.json();
        setPathway(data.pathway);
        setTemplate(data.template);
        setSteps(data.steps || []);
        if (data.pathway?.completed_step_ids) {
          setCompletedStepIds(new Set(data.pathway.completed_step_ids));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading pathway:', error);
        setIsLoading(false);
      }
    };

    loadPathway();
  }, [router]);

  if (isLoading) {
    return (
      <ConsoleLayout>
        <div className="text-center">Loading pathway...</div>
      </ConsoleLayout>
    );
  }

  if (!pathway || !template) {
    return (
      <ConsoleLayout>
        <div className="text-center">
          <p className="text-lg text-editorial-text/70 mb-4">
            No pathway found. Please complete the diagnostic first.
          </p>
          <button
            onClick={() => router.push('/diagnostic')}
            className="px-8 py-4 bg-editorial-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Diagnostic
          </button>
        </div>
      </ConsoleLayout>
    );
  }

  return (
    <AccessGate>
      <ConsoleLayout>
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 md:mb-6 text-editorial-text">
          Your Practice Pathway
        </h1>

        {/* Pathway Info */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 text-editorial-text">
            {template.name}
          </h2>
          {template.description && (
            <p className="text-base md:text-lg text-editorial-text/80 mb-4 md:mb-6">
              {template.description}
            </p>
          )}
        </div>

        {/* Pathway Progress */}
        <PathwayProgress
          totalSteps={steps.length}
          completedSteps={completedStepIds.size}
          currentStepNumber={steps.find(s => s.id === pathway.current_step_id)?.step_number}
          progressPercentage={pathway.progress_percentage}
        />

        {/* Pathway Steps */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-editorial-text">
            Pathway Steps
          </h2>
          {steps.length === 0 ? (
            <p className="text-base md:text-lg text-editorial-text/60">No steps available yet.</p>
          ) : (
            steps.map((step) => (
              <PathwayStep
                key={step.id}
                step={step}
                pathwayId={pathway.id}
                isCompleted={completedStepIds.has(step.id)}
                isCurrent={step.id === pathway.current_step_id}
                onComplete={() => {
                  // Refresh pathway data
                  const newCompleted = new Set(completedStepIds);
                  newCompleted.add(step.id);
                  setCompletedStepIds(newCompleted);
                  // Reload pathway to get updated progress
                  window.location.reload();
                }}
              />
            ))
          )}
        </div>
      </div>
      </ConsoleLayout>
    </AccessGate>
  );
}

