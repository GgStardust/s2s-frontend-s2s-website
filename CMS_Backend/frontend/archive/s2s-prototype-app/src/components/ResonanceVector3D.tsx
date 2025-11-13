'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Box } from '@react-three/drei';
import * as THREE from 'three';
import { TrendingUp, Activity, Zap, Brain, Target, Compass } from 'lucide-react';

interface ResonanceVector {
  x: number; // Clarity dimension
  y: number; // Coherence dimension  
  z: number; // Resonance dimension
  w: number; // Sovereignty dimension
}

interface ResonanceVector3DProps {
  vector: ResonanceVector;
  realTime?: boolean;
  showTrajectory?: boolean;
  comparisonVector?: ResonanceVector;
  onVectorUpdate?: (vector: ResonanceVector) => void;
  className?: string;
}

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// 4D to 3D projection for visualization
const projectTo3D = (vector: ResonanceVector): Vector3D => ({
  x: vector.x * Math.cos(vector.w * Math.PI / 2),
  y: vector.y * Math.sin(vector.w * Math.PI / 2),
  z: vector.z
});

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

export default function ResonanceVector3D({
  vector,
  realTime = false,
  showTrajectory = false,
  comparisonVector,
  onVectorUpdate,
  className = ''
}: ResonanceVector3DProps) {
  const [trajectory, setTrajectory] = useState<Vector3D[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredVector, setHoveredVector] = useState<string | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const comparisonMeshRef = useRef<THREE.Mesh>(null);
  // const lineRef = useRef<THREE.Line>(null);

  // Update trajectory when vector changes
  useEffect(() => {
    if (showTrajectory) {
      const projected = projectTo3D(vector);
      setTrajectory(prev => [...prev, projected].slice(-50)); // Keep last 50 points
    }
  }, [vector, showTrajectory]);

  // Real-time animation
  useFrame((state) => {
    if (realTime && meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  const handleVectorClick = useCallback((vectorType: 'main' | 'comparison') => {
    if (vectorType === 'main') {
      onVectorUpdate?.(vector);
    } else if (comparisonVector) {
      onVectorUpdate?.(comparisonVector);
    }
  }, [vector, comparisonVector, onVectorUpdate]);

  const projectedVector = projectTo3D(vector);
  const projectedComparison = comparisonVector ? projectTo3D(comparisonVector) : null;
  const similarity = comparisonVector ? calculateSimilarity(vector, comparisonVector) : 0;

  return (
    <div className={`w-full h-96 ${className}`}>
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

      <div className="bg-gray-900 rounded-lg p-4 h-80">
        <div className="w-full h-full">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <pointLight position={[-10, -10, -10]} />

            {/* Coordinate axes */}
            <Line
              points={[[-5, 0, 0], [5, 0, 0]]}
              color="red"
              lineWidth={2}
            />
            <Line
              points={[[0, -5, 0], [0, 5, 0]]}
              color="green"
              lineWidth={2}
            />
            <Line
              points={[[0, 0, -5], [0, 0, 5]]}
              color="blue"
              lineWidth={2}
            />

            {/* Axis labels */}
            <Text
              position={[5.5, 0, 0]}
              fontSize={0.5}
              color="red"
            >
              X (Clarity)
            </Text>
            <Text
              position={[0, 5.5, 0]}
              fontSize={0.5}
              color="green"
            >
              Y (Coherence)
            </Text>
            <Text
              position={[0, 0, 5.5]}
              fontSize={0.5}
              color="blue"
            >
              Z (Resonance)
            </Text>

            {/* Main resonance vector */}
            <Sphere
              ref={meshRef}
              position={[projectedVector.x, projectedVector.y, projectedVector.z]}
              args={[0.3, 32, 32]}
              onClick={() => handleVectorClick('main')}
              onPointerOver={() => setHoveredVector('main')}
              onPointerOut={() => setHoveredVector(null)}
            >
              <meshStandardMaterial
                color={getVectorColor(vector)}
                emissive={getVectorColor(vector)}
                emissiveIntensity={0.2}
              />
            </Sphere>

            {/* Comparison vector */}
            {projectedComparison && (
              <Sphere
                ref={comparisonMeshRef}
                position={[projectedComparison.x, projectedComparison.y, projectedComparison.z]}
                args={[0.2, 32, 32]}
                onClick={() => handleVectorClick('comparison')}
                onPointerOver={() => setHoveredVector('comparison')}
                onPointerOut={() => setHoveredVector(null)}
              >
                <meshStandardMaterial
                  color={getVectorColor(comparisonVector!)}
                  emissive={getVectorColor(comparisonVector!)}
                  emissiveIntensity={0.1}
                />
              </Sphere>
            )}

            {/* Trajectory line */}
            {showTrajectory && trajectory.length > 1 && (
              <Line
                points={trajectory.map(p => [p.x, p.y, p.z] as [number, number, number])}
                color="cyan"
                lineWidth={2}
              />
            )}

            {/* Vector from origin */}
            <Line
              points={[[0, 0, 0], [projectedVector.x, projectedVector.y, projectedVector.z]]}
              color={getVectorColor(vector)}
              lineWidth={3}
            />

            {/* Comparison vector from origin */}
            {projectedComparison && (
              <Line
                points={[[0, 0, 0], [projectedComparison.x, projectedComparison.y, projectedComparison.z]]}
                color={getVectorColor(comparisonVector!)}
                lineWidth={2}
              />
            )}

            <OrbitControls enableDamping dampingFactor={0.05} />
          </Canvas>
        </div>
      </div>

      {/* Vector information */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div className="mt-4 flex items-center justify-between">
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
