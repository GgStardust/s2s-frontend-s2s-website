'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ConsoleLayout from '@/components/ConsoleLayout';

interface DiagnosticResult {
  session: any;
  result: {
    sfi: {
      score: number;
      state: string;
      orb_profile: Record<string, number>;
    };
    readiness: {
      foundational_readiness: number;
      functional_readiness: number;
      advanced_readiness: number;
    };
    pathway_match?: {
      pathway_template: any;
      match_score: number;
      reasoning: string;
    };
  };
  pathway?: any;
}

export default function DiagnosticSummary() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for result immediately
    const storedResult = localStorage.getItem('diagnostic_result');
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        // Validate result structure
        if (parsed && parsed.result && parsed.result.sfi) {
          setResult(parsed);
          setIsLoading(false);
          return;
        } else {
          console.error('Invalid diagnostic result structure:', parsed);
        }
      } catch (error) {
        console.error('Error parsing diagnostic result:', error);
      }
    }
    
    // If no valid result, wait a bit longer for async storage, then redirect
    const timeoutId = setTimeout(() => {
      const checkAgain = localStorage.getItem('diagnostic_result');
      if (!checkAgain) {
        console.log('No diagnostic result found, redirecting to diagnostic');
        router.push('/diagnostic');
      } else {
        // Try to parse again
        try {
          const parsed = JSON.parse(checkAgain);
          if (parsed && parsed.result && parsed.result.sfi) {
            setResult(parsed);
            setIsLoading(false);
          } else {
            router.push('/diagnostic');
          }
        } catch (error) {
          router.push('/diagnostic');
        }
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [router]);

  if (isLoading || !result) {
    return (
      <ConsoleLayout>
        <div className="text-center">Loading results...</div>
      </ConsoleLayout>
    );
  }

  const { sfi, readiness, pathway_match } = result.result;

  return (
    <ConsoleLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 text-editorial-text text-center">
          Your Diagnostic Results
        </h1>

        {/* SFI Score */}
        <div className="bg-gray-50 border-l-4 border-editorial-gold p-6 md:p-8 rounded-r-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-editorial-text">Sovereign Field Index</h2>
          <div className="mb-4">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-5xl font-bold text-editorial-gold">{Math.round(sfi.score)}</span>
              <span className="text-xl text-editorial-text/70">/ 100</span>
            </div>
            <p className="text-lg text-editorial-text/80 italic">{sfi.state.replace(/_/g, ' ')}</p>
          </div>
        </div>

        {/* Practice Readiness */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-editorial-text">Foundational</h3>
            <div className="text-3xl font-bold text-editorial-gold mb-2">
              {Math.round(readiness.foundational_readiness * 100)}%
            </div>
            <p className="text-sm text-editorial-text/60">Practices 1-4</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-editorial-text">Functional</h3>
            <div className="text-3xl font-bold text-editorial-gold mb-2">
              {Math.round(readiness.functional_readiness * 100)}%
            </div>
            <p className="text-sm text-editorial-text/60">Practices 5-8</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-editorial-text">Advanced</h3>
            <div className="text-3xl font-bold text-editorial-gold mb-2">
              {Math.round(readiness.advanced_readiness * 100)}%
            </div>
            <p className="text-sm text-editorial-text/60">Practices 9-12</p>
          </div>
        </div>

        {/* Pathway Match */}
        {pathway_match && (
          <div className="bg-gray-50 border-l-4 border-editorial-gold p-6 md:p-8 rounded-r-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-editorial-text">Your Practice Pathway</h2>
            <h3 className="text-xl font-semibold mb-2 text-editorial-gold">
              {pathway_match.pathway_template.name}
            </h3>
            {pathway_match.pathway_template.description && (
              <p className="text-lg text-editorial-text/80 mb-4">
                {pathway_match.pathway_template.description}
              </p>
            )}
            <p className="text-sm text-editorial-text/60 italic">
              Match: {Math.round(pathway_match.match_score * 100)}% — {pathway_match.reasoning}
            </p>
          </div>
        )}

        {/* Next Steps */}
        <div className="text-center">
          {result.pathway ? (
            <button
              onClick={() => router.push('/pathway')}
              className="px-8 py-4 bg-editorial-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              View Your Pathway
            </button>
          ) : (
            <p className="text-editorial-text/60 mb-4">
              Your pathway will be available shortly.
            </p>
          )}
        </div>
      </div>
    </ConsoleLayout>
  );
}

