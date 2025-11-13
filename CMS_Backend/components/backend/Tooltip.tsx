import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ 
  children, 
  content, 
  side = 'top',
  className = '' 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const sideClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };
  
  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-backend-primary',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-backend-primary',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-backend-primary',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-backend-primary'
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-2 py-1 text-sm text-white bg-backend-primary rounded shadow-lg whitespace-nowrap ${sideClasses[side]} ${className}`}
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[side]}`} />
        </div>
      )}
    </div>
  );
}

