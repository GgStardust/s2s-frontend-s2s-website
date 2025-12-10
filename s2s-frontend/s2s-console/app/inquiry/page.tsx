'use client';

import { useState, useEffect } from 'react';
import ConsoleLayout from '@/components/ConsoleLayout';
import AccessGate from '@/components/AccessGate';

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

interface InquiryResponse {
  inquiry_id: string;
  question: string;
  response: string;
  matched_question?: {
    id: string;
    question_text: string;
    category?: string;
  } | null;
  rbi_analysis?: {
    coherence?: number;
    proof_status?: string;
    field_dynamics?: any;
  };
  orbital_interpretation?: any;
  metadata?: any;
}

interface InquiryHistory {
  id: string;
  user_question: string;
  response_text: string;
  created_at: string;
  matched_inquiry_question_id?: string;
}

export default function InquiryPage() {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<InquiryResponse | null>(null);
  const [inquiryHistory, setInquiryHistory] = useState<InquiryHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load inquiry history on mount
  useEffect(() => {
    loadInquiryHistory();
  }, []);

  const loadInquiryHistory = async () => {
    try {
      const sessionId = localStorage.getItem('diagnostic_session_id');
      if (!sessionId) return;

      const response = await fetch(`${CMS_BACKEND_URL}/api/console/v3/inquiry?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setInquiryHistory(data.inquiries || []);
      }
    } catch (err) {
      console.error('Error loading inquiry history:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setCurrentResponse(null);

    try {
      const sessionId = localStorage.getItem('diagnostic_session_id');
      const email = localStorage.getItem('diagnostic_email');

      const response = await fetch(`${CMS_BACKEND_URL}/api/console/v3/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          session_id: sessionId || undefined,
          email: email || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit inquiry');
      }

      const data: InquiryResponse = await response.json();
      setCurrentResponse(data);
      setQuestion('');
      
      // Reload history to include new inquiry
      await loadInquiryHistory();
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your question');
      console.error('Inquiry error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AccessGate>
      <ConsoleLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-editorial-text">
          Inquiry
        </h1>
        <p className="text-lg md:text-xl text-editorial-text/80 mb-8 italic font-serif">
          Ask questions about your pathway, practices, or field state
        </p>

        {/* Inquiry Form */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-editorial-text mb-2">
                Your Question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to know about your pathway, practices, or field state?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-editorial-gold focus:border-editorial-gold outline-none resize-none font-serif text-editorial-text bg-white"
                rows={4}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!question.trim() || isSubmitting}
                className="px-8 py-3 bg-editorial-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Ask'}
              </button>
              {inquiryHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-6 py-3 border border-editorial-gold text-editorial-gold font-semibold rounded-lg hover:bg-editorial-gold/10 transition-colors"
                >
                  {showHistory ? 'Hide' : 'Show'} History ({inquiryHistory.length})
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Current Response */}
        {currentResponse && (
          <div className="mb-8">
            <div className="bg-gray-50 border-l-4 border-editorial-gold p-6 md:p-8 rounded-r-lg">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-editorial-text mb-2">Your Question</h2>
                <p className="text-lg text-editorial-text/90 font-serif italic">
                  {currentResponse.question}
                </p>
              </div>

              {currentResponse.matched_question && (
                <div className="mb-4 text-sm text-editorial-text/60">
                  <span className="font-medium">Related question:</span>{' '}
                  {currentResponse.matched_question.category && (
                    <span className="capitalize">{currentResponse.matched_question.category}</span>
                  )}
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-editorial-text mb-3">Response</h2>
                <div className="prose prose-lg max-w-none">
                  <div className="text-editorial-text/90 leading-relaxed font-serif whitespace-pre-wrap">
                    {currentResponse.response}
                  </div>
                </div>
              </div>

              {currentResponse.rbi_analysis && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-editorial-text/70 mb-2">Field Analysis</h3>
                  <div className="text-sm text-editorial-text/60 space-y-1">
                    {currentResponse.rbi_analysis.coherence !== undefined && (
                      <p>
                        <span className="font-medium">Coherence:</span>{' '}
                        {(currentResponse.rbi_analysis.coherence * 100).toFixed(0)}%
                      </p>
                    )}
                    {currentResponse.rbi_analysis.proof_status && (
                      <p>
                        <span className="font-medium">Proof Status:</span>{' '}
                        <span className="capitalize">{currentResponse.rbi_analysis.proof_status}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inquiry History */}
        {showHistory && inquiryHistory.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-editorial-text mb-4">Inquiry History</h2>
            <div className="space-y-4">
              {inquiryHistory.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-gray-50 border-l-4 border-gray-300 p-6 rounded-r-lg"
                >
                  <div className="mb-3">
                    <p className="text-lg font-semibold text-editorial-text mb-2">Question</p>
                    <p className="text-editorial-text/90 font-serif italic">
                      {inquiry.user_question}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-editorial-text mb-2">Response</p>
                    <div className="text-editorial-text/80 leading-relaxed font-serif whitespace-pre-wrap">
                      {inquiry.response_text}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-editorial-text/60">
                    {new Date(inquiry.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentResponse && !showHistory && inquiryHistory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-editorial-text/60 mb-4">
              Ask a question to get started
            </p>
            <p className="text-editorial-text/50 font-serif italic">
              Your questions will be answered using Orbital Brain, providing S2S-aligned responses based on your field state.
            </p>
          </div>
        )}
      </div>
      </ConsoleLayout>
    </AccessGate>
  );
}

