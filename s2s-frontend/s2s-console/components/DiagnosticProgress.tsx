'use client';

interface DiagnosticProgressProps {
  currentIndex: number;
  totalQuestions: number;
}

export default function DiagnosticProgress({ currentIndex, totalQuestions }: DiagnosticProgressProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-editorial-gold h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="flex justify-between items-center text-sm text-editorial-text/60">
        <span className="hidden sm:inline">Question {currentIndex + 1} of {totalQuestions}</span>
        <span className="sm:hidden">{currentIndex + 1}/{totalQuestions}</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

