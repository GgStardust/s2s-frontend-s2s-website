import React from 'react';

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
}

export function Progress({ 
  value, 
  max = 100, 
  className = '',
  showValue = false 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-backend-secondary rounded-full h-2">
        <div 
          className="bg-backend-accent h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="text-xs text-backend-secondary mt-1 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

