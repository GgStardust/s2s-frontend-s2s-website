'use client';

interface PathwayProgressProps {
  totalSteps: number;
  completedSteps: number;
  currentStepNumber?: number;
  progressPercentage: number;
}

export default function PathwayProgress({
  totalSteps,
  completedSteps,
  currentStepNumber,
  progressPercentage,
}: PathwayProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-editorial-text">Pathway Progress</h2>
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-bold text-editorial-gold">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-sm text-editorial-text/60">
            {completedSteps} of {totalSteps} steps
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 overflow-hidden">
          <div
            className="bg-editorial-gold h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
        {steps.map((stepNum) => {
          const isCompleted = stepNum <= completedSteps;
          const isCurrent = stepNum === currentStepNumber;
          
          return (
            <div
              key={stepNum}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isCompleted
                  ? 'bg-editorial-gold text-white'
                  : isCurrent
                  ? 'bg-editorial-gold/20 border-2 border-editorial-gold text-editorial-gold'
                  : 'bg-gray-100 text-editorial-text/40'
              }`}
            >
              <div className="text-xs md:text-sm font-semibold mb-1">
                {isCompleted ? '✓' : stepNum}
              </div>
              <div className="text-[10px] md:text-xs opacity-75 hidden sm:block">
                {isCompleted ? 'Done' : isCurrent ? 'Now' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-editorial-gold">{completedSteps}</div>
          <div className="text-sm text-editorial-text/60">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-editorial-text/60">
            {totalSteps - completedSteps}
          </div>
          <div className="text-sm text-editorial-text/60">Remaining</div>
        </div>
        <div className="text-center col-span-2 md:col-span-1">
          <div className="text-2xl font-bold text-editorial-text/60">
            {currentStepNumber || '—'}
          </div>
          <div className="text-sm text-editorial-text/60">Current Step</div>
        </div>
      </div>
    </div>
  );
}

