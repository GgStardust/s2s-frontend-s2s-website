'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ConsoleLayout from '@/components/ConsoleLayout';
import DiagnosticProgress from '@/components/DiagnosticProgress';

const CMS_BACKEND_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL || 'http://localhost:4000';

/**
 * Convert technical descriptions to helpful guidance for participants
 */
function getHelpfulDescription(technicalDesc: string, questionText: string): string {
  // Map by question text first (most specific)
  const questionTextMap: Record<string, string> = {
    'When you enter a room, what registers first?': 'Notice what you actually experience, not what you think you should notice. What catches your attention first—the feeling of the space, the people, or something else?',
    'How fixed or fluid does your identity feel across contexts?': 'Think about how you experience yourself across different situations—work, relationships, alone time. Does your sense of self feel consistent or does it shift?',
    'How often do you use your body as information rather than emotion?': 'Consider how your body communicates information to you, separate from emotional reactions. Do you notice physical sensations as signals that guide you?',
    'How do you make decisions about timing?': 'Reflect on how you actually decide when to act. Do you wait for an internal sense of readiness, follow external schedules, or something else?',
    'How wide or narrow is your perception when tracking situations?': 'Think about how you take in information. Do you notice many details at once, or do you focus on specific elements? Both are valid—what actually happens for you?',
    'Where does your authority come from when making decisions?': 'What actually guides your decisions? Is it internal knowing, external input, analysis, or something else? Be honest about what you actually rely on.',
    'How easily do you see repeating structures across life domains?': 'Do you notice patterns that show up in different areas of your life—work, relationships, creative projects? Some people see these immediately, others don\'t. What\'s true for you?',
    'How familiar is the sense of receiving intuitive directionality?': 'Think about moments when you\'ve felt a clear sense of direction or knowing that wasn\'t from logic or analysis. How familiar is that experience?',
    'Where does your attention stabilize first?': 'When you enter a new space or situation, where does your attention naturally land? In your body, the environment, other people, or your thoughts?',
    'What changes your state the fastest?': 'What actually shifts your internal state most quickly? Someone else\'s energy, the environment, your own thoughts, or something more subtle?',
    'When you make decisions, what leads?': 'What actually guides your decisions in the moment? Logic, feeling, bodily sense, intuitive hits, or external input? Notice what\'s actually happening, not what you think should happen.',
    'What happens in your system under pressure?': 'When you\'re under pressure or stress, what actually happens in your system? Do you tense up, freeze, collapse, focus intensely, or something else?',
    'Which type of environment increases your clarity the most?': 'What kind of space actually helps you think and feel more clearly? Quiet spaces, nature, movement, being with others, or focused environments?',
    'How do you experience time in a typical day?': 'Reflect on how time actually feels to you day-to-day. Is it linear and scheduled, fluid and irregular, or something else?',
    'What pattern repeats the most in your relationships?': 'Think about patterns you notice in your relationships. What tends to repeat? Overgiving, withdrawing, intensity cycles, or something else?',
    'When something important ends, what happens in your system?': 'Consider how your system actually responds when something important ends or changes. Do you stay functional, collapse, feel relief, or something else?',
    'What do you trust most when entering a new situation?': 'What actually guides you when you enter something new? Your instincts, reasoning, reading the room, other people\'s cues, or your embodied feeling?',
    'What is your dominant creative state?': 'How does your creative process actually work? Steady output, bursts of intensity, long gestation periods, reactive creation, or nonlinear waves?',
    'How do you experience your body when something is true?': 'When something feels true to you, what happens in your body? Warmth, expansion, stillness, clarity, relief, or a subtle click?',
    'What interrupts your clarity the most?': 'What actually disrupts your sense of clarity? Emotional overwhelm, relational tension, overstimulation, overthinking, unclear boundaries, or lack of rest?',
    'How does your system respond to new information?': 'When you encounter new information, what actually happens? Immediate recognition, slow integration, resistance then clarity, confusion first, overwhelm, or excitement?',
    'What is your dominant perceptual channel?': 'How do you primarily take in information? Through seeing, hearing, feeling, intuitive knowing, or sensing the field/energy around you?',
  };

  // Map by technical description keywords (fallback)
  const descriptionMap: Record<string, string> = {
    'Signal Orientation': 'Notice what you actually experience, not what you think you should notice. What catches your attention first?',
    'Identity Fluidity': 'Think about how you experience yourself across different situations. Does your sense of self feel consistent or does it shift?',
    'Somatic Signal Intelligence': 'Consider how your body communicates information to you, separate from emotional reactions. Do you notice physical sensations as signals?',
    'Temporal Relationship': 'Reflect on how you actually decide when to act. Do you wait for an internal sense of readiness, follow schedules, or something else?',
    'Perceptual Scaling': 'Think about how you take in information. Do you notice many details at once, or do you focus on specific elements?',
    'Decision Sovereignty': 'What actually guides your decisions? Is it internal knowing, external input, analysis, or something else?',
    'Pattern Recognition': 'Do you notice patterns that show up in different areas of your life? Some people see these immediately, others don\'t. What\'s true for you?',
    'Networked Intelligence': 'Think about moments when you\'ve felt a clear sense of direction or knowing that wasn\'t from logic. How familiar is that experience?',
    'modulation sensitivity': 'What actually shifts your internal state most quickly? Someone else\'s energy, the environment, your own thoughts, or something more subtle?',
    'decision orientation': 'What actually guides your decisions in the moment? Logic, feeling, bodily sense, intuitive hits, or external input?',
    'collapse patterns': 'When you\'re under pressure, what actually happens in your system? Do you tense up, freeze, collapse, focus intensely, or something else?',
    'environmental regulation': 'What kind of space actually helps you think and feel more clearly? Quiet spaces, nature, movement, being with others, or focused environments?',
    'temporal coherence': 'Reflect on how time actually feels to you day-to-day. Is it linear and scheduled, fluid and irregular, or something else?',
    'relational coherence': 'Think about patterns you notice in your relationships. What tends to repeat?',
    'disintegration': 'Consider how your system actually responds when something important ends or changes. What actually happens?',
    'foundational calibration': 'What actually guides you when you enter something new? Your instincts, reasoning, reading the room, or your embodied feeling?',
    'creative infrastructure': 'How does your creative process actually work? Steady output, bursts of intensity, long gestation periods, or nonlinear waves?',
    'somatic coherence': 'When something feels true to you, what happens in your body? Warmth, expansion, stillness, clarity, or a subtle click?',
    'distortion sources': 'What actually disrupts your sense of clarity? Emotional overwhelm, relational tension, overstimulation, or something else?',
    'integration style': 'When you encounter new information, what actually happens? Immediate recognition, slow integration, resistance then clarity, or something else?',
    'perceptual channel': 'How do you primarily take in information? Through seeing, hearing, feeling, intuitive knowing, or sensing the field around you?',
  };

  // First try to match by exact question text
  if (questionTextMap[questionText]) {
    return questionTextMap[questionText];
  }

  // Then try to match by description keywords
  for (const [key, value] of Object.entries(descriptionMap)) {
    if (technicalDesc.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // If no match, return empty string (don't show generic description)
  return '';
}

interface Question {
  id: number;
  question_text: string;
  question_description?: string;
  response_type: 'single_choice' | 'multi_choice' | 'scale';
  answer_options?: string[];
  order_index: number;
}

export default function DiagnosticQuestion() {
  const params = useParams();
  const router = useRouter();
  const questionIndex = parseInt(params.index as string, 10);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load session and questions from localStorage
    const storedSessionId = localStorage.getItem('diagnostic_session_id');
    const storedQuestions = localStorage.getItem('diagnostic_questions');

    if (!storedSessionId || !storedQuestions) {
      router.push('/diagnostic');
      return;
    }

    setSessionId(storedSessionId);
    const parsedQuestions = JSON.parse(storedQuestions);
    setQuestions(parsedQuestions);

    if (questionIndex >= 0 && questionIndex < parsedQuestions.length) {
      setCurrentQuestion(parsedQuestions[questionIndex]);
    } else {
      router.push('/diagnostic');
    }
  }, [questionIndex, router]);

  const handleAnswer = async (answer: string | number) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setSelectedAnswer(answer);
    
    // Auto-submit after a brief delay to show selection
    setTimeout(async () => {
      await handleSubmit(answer);
    }, 300);
  };

  const handleSubmit = async (answer?: string | number) => {
    const answerToSubmit = answer !== undefined ? answer : selectedAnswer;
    if (answerToSubmit === null || !currentQuestion || !sessionId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${CMS_BACKEND_URL}/api/console/v3/sessions/${sessionId}/responses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question_id: currentQuestion.id,
            answer: answerToSubmit,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit answer');
      }

      const data = await response.json();

      if (data.is_complete) {
        // Complete the diagnostic
        const completeResponse = await fetch(
          `${CMS_BACKEND_URL}/api/console/v3/sessions/${sessionId}/complete`,
          {
            method: 'POST',
          }
        );

        if (!completeResponse.ok) {
          const errorData = await completeResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to complete diagnostic');
        }

        const completeData = await completeResponse.json();
        
        // Ensure we have the result data
        if (!completeData || !completeData.result) {
          console.error('Invalid diagnostic result data:', completeData);
          throw new Error('Invalid diagnostic result data');
        }
        
        // Store result in localStorage BEFORE navigation
        try {
          localStorage.setItem('diagnostic_result', JSON.stringify(completeData));
          console.log('Diagnostic result stored in localStorage');
        } catch (storageError) {
          console.error('Error storing diagnostic result:', storageError);
          throw new Error('Failed to save diagnostic result');
        }
        
        // Clear session data to prevent navigation issues
        localStorage.removeItem('diagnostic_session_id');
        localStorage.removeItem('diagnostic_questions');
        
        // Use window.location for reliable navigation
        window.location.href = '/diagnostic/summary';
        return; // Exit early to prevent further execution
      } else if (data.next_question) {
        // Move to next question
        const nextIndex = questions.findIndex((q) => q.id === data.next_question.id);
        if (nextIndex !== -1) {
          router.push(`/diagnostic/question/${nextIndex}`);
        } else {
          // Fallback: increment index
          router.push(`/diagnostic/question/${questionIndex + 1}`);
        }
      } else {
        // Fallback: increment index
        if (questionIndex + 1 < questions.length) {
          router.push(`/diagnostic/question/${questionIndex + 1}`);
        } else {
          // Complete if no more questions - trigger completion
          try {
            const completeResponse = await fetch(
              `${CMS_BACKEND_URL}/api/console/v3/sessions/${sessionId}/complete`,
              {
                method: 'POST',
              }
            );

            if (!completeResponse.ok) {
              throw new Error('Failed to complete diagnostic');
            }

            const completeData = await completeResponse.json();
            
            if (!completeData || !completeData.result) {
              throw new Error('Invalid diagnostic result data');
            }
            
            try {
              localStorage.setItem('diagnostic_result', JSON.stringify(completeData));
              console.log('Diagnostic result stored in localStorage (fallback)');
            } catch (storageError) {
              console.error('Error storing diagnostic result:', storageError);
              throw new Error('Failed to save diagnostic result');
            }
            
            localStorage.removeItem('diagnostic_session_id');
            localStorage.removeItem('diagnostic_questions');
            
            // Use window.location for reliable navigation
            window.location.href = '/diagnostic/summary';
          } catch (completeError: any) {
            console.error('Error completing diagnostic:', completeError);
            alert(completeError.message || 'Failed to complete diagnostic. Please try again.');
            setIsSubmitting(false);
          }
        }
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      alert(error.message || 'Failed to submit answer. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <ConsoleLayout>
        <div className="text-center">Loading...</div>
      </ConsoleLayout>
    );
  }

  return (
    <ConsoleLayout>
      <div className="max-w-3xl mx-auto">
        <DiagnosticProgress currentIndex={questionIndex} totalQuestions={questions.length} />

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-editorial-text">
            {currentQuestion.question_text}
          </h2>
          {(() => {
            const helpfulDesc = getHelpfulDescription(
              currentQuestion.question_description || '',
              currentQuestion.question_text
            );
            return helpfulDesc ? (
              <p className="text-base text-editorial-text/80 mb-6 leading-relaxed">
                {helpfulDesc}
              </p>
            ) : null;
          })()}
        </div>

        {/* Answer Options */}
        <div className="space-y-4 mb-8">
          {currentQuestion.response_type === 'scale' ? (
            // Scale (1-5)
            <div className="flex flex-wrap gap-4 justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-16 h-16 rounded-lg font-semibold text-lg transition-all ${
                    selectedAnswer === value
                      ? 'bg-editorial-gold text-white'
                      : 'bg-gray-100 text-editorial-text hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          ) : currentQuestion.answer_options && currentQuestion.answer_options.length > 0 ? (
            // Single or Multi Choice
            <div className="space-y-3">
              {currentQuestion.answer_options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full px-6 py-4 rounded-lg text-left transition-all border-2 min-h-[56px] flex items-center ${
                    selectedAnswer === option
                      ? 'border-editorial-gold bg-editorial-gold/10 text-editorial-text font-medium'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-editorial-text'
                  }`}
                >
                  <span className="text-base leading-relaxed">{option}</span>
                </button>
              ))}
            </div>
          ) : (
            // Text input fallback
            <input
              type="text"
              value={selectedAnswer as string || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-editorial-gold focus:border-editorial-gold outline-none text-editorial-text"
            />
          )}
        </div>

        {/* Loading indicator when submitting */}
        {isSubmitting && (
          <div className="text-center mt-8">
            <p className="text-editorial-text/60 italic">Processing your response...</p>
          </div>
        )}
      </div>
    </ConsoleLayout>
  );
}

