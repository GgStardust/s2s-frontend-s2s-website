'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Zap, Brain, Target, Compass } from 'lucide-react';

interface ResonanceVector {
  x: number; // Clarity dimension
  y: number; // Coherence dimension  
  z: number; // Resonance dimension
  w: number; // Sovereignty dimension
}

interface SimpleResonanceVectorProps {
  vector: ResonanceVector;
  realTime?: boolean;
  showTrajectory?: boolean;
  comparisonVector?: ResonanceVector;
  onVectorUpdate?: (vector: ResonanceVector) => void;
  className?: string;
}

// Calculate vector magnitude
const calculateMagnitude = (vector: ResonanceVector): number => {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z + vector.w * vector.w);
};

// Calculate vector color based on dimensions
const getVectorColor = (vector: ResonanceVector): string => {
  const magnitude = calculateMagnitude(vector);
  const hue = (vector.w * 360) % 360; // Sovereignty determines hue
  const saturation = Math.min(100, magnitude * 100);
  const lightness = 50 + (vector.x * 20); // Clarity affects lightness
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Calculate similarity between vectors
const calculateSimilarity = (vector1: ResonanceVector, vector2: ResonanceVector): number => {
  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z + vector1.w * vector2.w;
  const magnitude1 = calculateMagnitude(vector1);
  const magnitude2 = calculateMagnitude(vector2);
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (magnitude1 * magnitude2);
};

export default function SimpleResonanceVector({
  vector,
  realTime = false,
  showTrajectory = false,
  comparisonVector,
  onVectorUpdate,
  className = ''
}: SimpleResonanceVectorProps) {
  const [trajectory, setTrajectory] = useState<ResonanceVector[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredVector, setHoveredVector] = useState<string | null>(null);

  // Update trajectory when vector changes
  useEffect(() => {
    if (showTrajectory) {
      setTrajectory(prev => [...prev, vector].slice(-50)); // Keep last 50 points
    }
  }, [vector, showTrajectory]);

  const handleVectorClick = (vectorType: 'main' | 'comparison') => {
    if (vectorType === 'main') {
      onVectorUpdate?.(vector);
    } else if (comparisonVector) {
      onVectorUpdate?.(comparisonVector);
    }
  };

  const similarity = comparisonVector ? calculateSimilarity(vector, comparisonVector) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">4D Resonance Vector Visualization</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Clarity: {vector.x.toFixed(3)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Coherence: {vector.y.toFixed(3)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Resonance: {vector.z.toFixed(3)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Sovereignty: {vector.w.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* 2D Vector Visualization */}
      <div className="bg-gray-900 rounded-lg p-6 h-80 mb-6">
        <div className="relative w-full h-full">
          {/* Coordinate axes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full relative">
              {/* X-axis */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500"></div>
              <div className="absolute top-1/2 right-0 text-red-400 text-sm">X (Clarity)</div>
              
              {/* Y-axis */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-green-500"></div>
              <div className="absolute left-1/2 top-0 text-green-400 text-sm">Y (Coherence)</div>
              
              {/* Z-axis (diagonal) */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-0 left-0 w-full h-full transform rotate-45">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500"></div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 text-blue-400 text-sm">Z (Resonance)</div>
            </div>
          </div>

          {/* Main vector point */}
          <div 
            className="absolute w-6 h-6 rounded-full border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + vector.x * 20}%`,
              top: `${50 - vector.y * 20}%`,
              backgroundColor: getVectorColor(vector),
              boxShadow: `0 0 20px ${getVectorColor(vector)}`
            }}
            onClick={() => handleVectorClick('main')}
            onMouseEnter={() => setHoveredVector('main')}
            onMouseLeave={() => setHoveredVector(null)}
          >
            <div className="w-full h-full rounded-full bg-white/20"></div>
          </div>

          {/* Comparison vector point */}
          {comparisonVector && (
            <div 
              className="absolute w-4 h-4 rounded-full border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${50 + comparisonVector.x * 20}%`,
                top: `${50 - comparisonVector.y * 20}%`,
                backgroundColor: getVectorColor(comparisonVector),
                boxShadow: `0 0 15px ${getVectorColor(comparisonVector)}`
              }}
              onClick={() => handleVectorClick('comparison')}
              onMouseEnter={() => setHoveredVector('comparison')}
              onMouseLeave={() => setHoveredVector(null)}
            >
              <div className="w-full h-full rounded-full bg-white/20"></div>
            </div>
          )}

          {/* Vector from origin */}
          <div 
            className="absolute w-1 bg-current transform origin-left"
            style={{
              left: '50%',
              top: '50%',
              height: `${calculateMagnitude(vector) * 100}px`,
              transform: `rotate(${Math.atan2(vector.y, vector.x) * 180 / Math.PI}deg)`,
              color: getVectorColor(vector)
            }}
          ></div>

          {/* Comparison vector from origin */}
          {comparisonVector && (
            <div 
              className="absolute w-0.5 bg-current transform origin-left"
              style={{
                left: '50%',
                top: '50%',
                height: `${calculateMagnitude(comparisonVector) * 100}px`,
                transform: `rotate(${Math.atan2(comparisonVector.y, comparisonVector.x) * 180 / Math.PI}deg)`,
                color: getVectorColor(comparisonVector)
              }}
            ></div>
          )}

          {/* Trajectory points */}
          {showTrajectory && trajectory.length > 1 && (
            <div className="absolute inset-0">
              {trajectory.slice(-20).map((point, index) => (
                <div
                  key={index}
                  className="absolute w-1 h-1 rounded-full bg-cyan-400 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${50 + point.x * 20}%`,
                    top: `${50 - point.y * 20}%`,
                    opacity: index / trajectory.length
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vector information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-2">Vector Magnitude</h4>
          <div className="text-2xl font-bold text-blue-400">
            {calculateMagnitude(vector).toFixed(3)}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-2">4D Coordinates</h4>
          <div className="text-sm text-gray-300">
            <div>X: {vector.x.toFixed(3)}</div>
            <div>Y: {vector.y.toFixed(3)}</div>
            <div>Z: {vector.z.toFixed(3)}</div>
            <div>W: {vector.w.toFixed(3)}</div>
          </div>
        </div>

        {comparisonVector && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Similarity</h4>
            <div className="text-2xl font-bold text-green-400">
              {(similarity * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Interactive controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAnimating 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isAnimating ? 'Stop Animation' : 'Start Animation'}
          </button>
          
          <button
            onClick={() => setTrajectory([])}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
          >
            Clear Trajectory
          </button>
        </div>

        <div className="text-sm text-gray-400">
          {hoveredVector === 'main' && 'Main Vector'}
          {hoveredVector === 'comparison' && 'Comparison Vector'}
        </div>
      </div>
    </div>
  );
}
