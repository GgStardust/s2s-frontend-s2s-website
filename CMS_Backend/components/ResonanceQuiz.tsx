'use client';

import { useState } from 'react';
import { getAllOrbs } from '@/lib/content';
import { Orb } from '@/lib/types';

const QUIZ_QUESTIONS = [
  {
    question: 'What energizes you most?',
    options: [
      { text: 'Deep, quiet reflection and inner work', orbScores: { 1: 3, 6: 2, 8: 1 } },
      { text: 'Creating harmony and beauty in the world', orbScores: { 4: 3, 3: 2, 7: 1 } },
      { text: 'Transforming challenges into wisdom', orbScores: { 7: 3, 5: 2, 9: 1 } },
      { text: 'Connecting with others through shared purpose', orbScores: { 2: 3, 10: 2, 12: 1 } }
    ]
  },
  {
    question: 'How do you relate to time?',
    options: [
      { text: 'I feel time as a living, flowing medium', orbScores: { 5: 3, 9: 2, 1: 1 } },
      { text: 'I work with natural rhythms and cycles', orbScores: { 6: 3, 4: 2, 8: 1 } },
      { text: 'I sense multiple timelines simultaneously', orbScores: { 9: 3, 5: 2, 11: 1 } },
      { text: 'I focus on the present moment', orbScores: { 8: 3, 1: 2, 3: 1 } }
    ]
  },
  {
    question: 'When facing a challenge, you...',
    options: [
      { text: 'Seek the deeper pattern and meaning', orbScores: { 1: 3, 8: 2, 6: 1 } },
      { text: 'Look for the harmonic solution', orbScores: { 4: 3, 2: 2, 7: 1 } },
      { text: 'Transform it through inner alchemy', orbScores: { 7: 3, 5: 2, 9: 1 } },
      { text: 'Connect with others for support', orbScores: { 2: 3, 10: 2, 12: 1 } }
    ]
  }
];

export default function ResonanceQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [primaryOrb, setPrimaryOrb] = useState<Orb | null>(null);
  
  const orbs = getAllOrbs();

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate scores
      const scores: { [orbId: number]: number } = {};
      newAnswers.forEach((answerIndex, questionIndex) => {
        const question = QUIZ_QUESTIONS[questionIndex];
        const option = question.options[answerIndex];
        Object.entries(option.orbScores).forEach(([orbId, score]) => {
          scores[Number(orbId)] = (scores[Number(orbId)] || 0) + score;
        });
      });
      
      const maxScore = Math.max(...Object.values(scores));
      const primaryOrbId = Object.keys(scores).find(orbId => scores[Number(orbId)] === maxScore);
      if (primaryOrbId) {
        setPrimaryOrb(orbs.find(orb => orb.id === Number(primaryOrbId)) || null);
      }
      setIsComplete(true);
    }
  };

  if (isComplete && primaryOrb) {
    return (
      <div className="bg-deep-navy rounded-2xl p-8 text-creamy-white text-center">
        <div className="w-24 h-24 bg-deep-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-deep-navy">{primaryOrb.id}</span>
        </div>
        <h2 className="text-3xl font-bold text-creamy-white mb-4">Your Primary Resonance</h2>
        <h3 className="text-2xl font-semibold text-deep-gold mb-6">{primaryOrb.title}</h3>
        <p className="text-lg text-creamy-white/90 mb-8 max-w-2xl mx-auto">
          {primaryOrb.synthesis}
        </p>
        <button 
          onClick={() => window.location.href = `/orbs/${primaryOrb.slug}`}
          className="bg-deep-gold text-deep-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-creamy-white transition-colors"
        >
          Explore Your Orb
        </button>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="bg-deep-navy rounded-2xl p-8 text-creamy-white">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-creamy-white/80">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
          <span className="text-sm text-deep-gold">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-creamy-white/20 rounded-full h-2">
          <div 
            className="bg-deep-gold h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-creamy-white mb-8 text-center">
        {question.question}
      </h2>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="w-full p-6 text-left rounded-xl border-2 border-creamy-white/30 bg-creamy-white/10 hover:border-deep-gold hover:bg-deep-gold/20 transition-all duration-200 group"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-creamy-white/60 group-hover:border-deep-gold group-hover:bg-deep-gold/20 flex items-center justify-center mr-4">
                <div className="w-2 h-2 rounded-full bg-deep-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-lg text-creamy-white group-hover:text-creamy-white">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
