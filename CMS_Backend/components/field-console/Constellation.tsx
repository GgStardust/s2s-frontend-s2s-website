/**
 * CONSTELLATION
 *  - Visualizes 13 Orb nodes in 3D space
 *  - Breathes on a 4s cycle
 *  - Emits R_ij connections using RBI kernel
 *  - Uses Fibonacci spiral positioning with resonance-based adjustments
 *  - Perlin noise drift (20s cycle)
 *  - Golden-ratio camera composition with slow orbital motion
 *  - Orb glyph textures with emissive Deep Gold glow
 *  - Atmospheric lighting and particle fog
 */

'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useFieldStore } from '../../src/lib/store/fieldStore';
import { computeResonance, calculateCoherence } from '@/src/lib/rbi';
import { COLORS, BREATH_CYCLE, GOLDEN_RATIO } from '../../src/styles/theme';
import { generateResonanceBasedPositions } from '../../src/lib/utils/fibonacci';
import { getDriftOffset } from '../../src/lib/utils/perlin';

interface ConstellationProps {
  onOrbSelect?: (orbId: number) => void;
}

// Particle fog component
function ParticleFog() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1000;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={COLORS.deepNavy}
        transparent
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Individual Orb component with glyph texture
function Orb({
  id,
  position,
  coherence,
  resonanceStrength,
  onSelect,
  time,
}: {
  id: number;
  position: [number, number, number];
  coherence: number;
  resonanceStrength: number;
  onSelect: () => void;
  time: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);
  
  // Load Orb glyph texture
  // Note: useTexture will handle loading errors gracefully
  const glyphTexture = useTexture(`/glyphs/${id}.png`);

  // 4-second breath cycle
  const breathPhase = (time / (BREATH_CYCLE / 1000)) * Math.PI * 2;
  const breathScale = 1 + Math.sin(breathPhase) * 0.1;
  
  // Perlin noise drift (20s cycle)
  const driftTime = time / 20;
  const [driftX, driftY, driftZ] = getDriftOffset(id, driftTime, 0.3);
  
  // Glow intensity = coherence score (as per design DNA)
  const glowIntensity = coherence * (0.8 + Math.sin(breathPhase) * 0.2);
  const orbScale = (0.3 + coherence * 0.2) * breathScale;

  useFrame(() => {
    if (meshRef.current) {
      // Apply drift
      meshRef.current.position.x = position[0] + driftX;
      meshRef.current.position.y = position[1] + driftY;
      meshRef.current.position.z = position[2] + driftZ;
      
      // Scale with breath
      meshRef.current.scale.setScalar(orbScale);
    }
  });

  return (
    <group>
      {/* Orb sphere with glyph texture and emissive glow */}
      <mesh
        ref={meshRef}
        position={position}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? orbScale * 1.2 : orbScale}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          map={glyphTexture || undefined}
          emissive={COLORS.deepGold}
          emissiveIntensity={glowIntensity}
          emissiveMap={glyphTexture || undefined}
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Orb label */}
      <Text
        position={[position[0] + driftX, position[1] + driftY + 1.5, position[2] + driftZ]}
        fontSize={0.3}
        color={COLORS.creamyWhite}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Montserrat-Regular.ttf"
      >
        {id}
      </Text>

      {/* Glow effect (point light) */}
      <pointLight
        position={[position[0] + driftX, position[1] + driftY, position[2] + driftZ]}
        color={COLORS.deepGold}
        intensity={glowIntensity * 0.5}
        distance={5}
        decay={2}
      />
    </group>
  );
}

// Connection line component
function ConnectionLine({
  from,
  to,
  strength,
  time,
}: {
  from: [number, number, number];
  to: [number, number, number];
  strength: number;
  time: number;
}) {
  const breathPhase = (time / (BREATH_CYCLE / 1000)) * Math.PI * 2;
  const opacity = strength * (0.5 + Math.sin(breathPhase) * 0.2);
  const lineWidth = strength * 0.05;

  const points = useMemo(() => [new THREE.Vector3(...from), new THREE.Vector3(...to)], [from, to]);

  return (
    <Line
      points={points}
      color={COLORS.deepGold}
      lineWidth={lineWidth}
      opacity={opacity}
      transparent
    />
  );
}

// Camera controller with golden-ratio composition and slow orbital motion
function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useFrame((state) => {
    if (controlsRef.current) {
      // Slow orbital motion (60 second rotation)
      const time = state.clock.elapsedTime;
      const radius = 15;
      const angle = (time / 60) * Math.PI * 2;
      
      // Golden ratio based camera position
      const phi = Math.acos(-1 + (2 * 0.618) / GOLDEN_RATIO); // Golden angle
      const theta = angle;
      
      camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.y = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.z = radius * Math.cos(phi);
      
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      minDistance={10}
      maxDistance={30}
      autoRotate={true}
      autoRotateSpeed={0.5} // Slow orbital motion
    />
  );
}

// Main 3D scene
function ConstellationScene({ onOrbSelect }: { onOrbSelect?: (orbId: number) => void }) {
  const { orbs, resonanceMatrix, setResonanceMatrix, setCoherenceMetrics, selectOrb } = useFieldStore();
  const [time, setTime] = React.useState(0);

  // Initialize Orbs and compute resonance on mount
  useEffect(() => {
    // Compute resonance matrix
    const matrix = computeResonance();
    setResonanceMatrix(matrix);

    // Compute coherence metrics
    const metrics = calculateCoherence();
    setCoherenceMetrics(metrics);

    // Generate 3D positions using Fibonacci spiral + resonance adjustments
    const positions = generateResonanceBasedPositions(13, matrix, 8);
    
    // Create Orbs with positions and coherence
    const initialOrbs = positions.map((pos, i) => ({
      id: i + 1,
      name: `Orb ${i + 1}`,
      position: pos,
      coherence: metrics.overall + (Math.random() - 0.5) * 0.2,
      glow: metrics.overall,
    }));

    useFieldStore.getState().setOrbs(initialOrbs);
  }, []);

  // Update time for animations
  useFrame((state) => {
    setTime(state.clock.elapsedTime);
  });

  // Calculate connection lines from resonance matrix
  const connections = useMemo(() => {
    if (!resonanceMatrix || orbs.length === 0) return [];
    
    const lines: Array<{ from: number; to: number; strength: number; fromPos: [number, number, number]; toPos: [number, number, number] }> = [];
    const threshold = 0.3; // Only show connections above threshold
    
    orbs.forEach((orb) => {
      Object.entries(resonanceMatrix[orb.id] || {}).forEach(([targetId, strength]) => {
        const target = parseInt(targetId);
        if (target > orb.id && strength > threshold) {
          const targetOrb = orbs.find((o) => o.id === target);
          if (targetOrb) {
            lines.push({
              from: orb.id,
              to: target,
              strength,
              fromPos: orb.position,
              toPos: targetOrb.position,
            });
          }
        }
      });
    });
    
    return lines;
  }, [resonanceMatrix, orbs]);

  const handleOrbClick = (orbId: number) => {
    selectOrb(orbId);
    onOrbSelect?.(orbId);
  };

  // Calculate average resonance strength for each Orb
  const getOrbResonanceStrength = (orbId: number): number => {
    if (!resonanceMatrix || !resonanceMatrix[orbId]) return 0;
    const strengths = Object.values(resonanceMatrix[orbId]).filter((s, idx, arr) => {
      const id = parseInt(Object.keys(resonanceMatrix[orbId])[idx]);
      return id !== orbId;
    });
    return strengths.length > 0 ? strengths.reduce((a, b) => a + b, 0) / strengths.length : 0;
  };

  return (
    <>
      {/* Atmospheric lighting */}
      <ambientLight intensity={0.15} color={COLORS.deepNavy} />
      
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.4}
        color={COLORS.creamyWhite}
        castShadow
      />

      {/* Additional rim lighting for depth */}
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.2}
        color={COLORS.deepGold}
      />

      {/* Particle fog */}
      <ParticleFog />

      {/* Connection lines */}
      {connections.map((conn) => (
        <ConnectionLine
          key={`${conn.from}-${conn.to}`}
          from={conn.fromPos}
          to={conn.toPos}
          strength={conn.strength}
          time={time}
        />
      ))}

      {/* Orbs */}
      {orbs.map((orb) => (
        <Orb
          key={orb.id}
          id={orb.id}
          position={orb.position}
          coherence={orb.coherence}
          resonanceStrength={getOrbResonanceStrength(orb.id)}
          onSelect={() => handleOrbClick(orb.id)}
          time={time}
        />
      ))}

      {/* Camera controller with golden-ratio composition */}
      <CameraController />
    </>
  );
}

// Main component
export const Constellation: React.FC<ConstellationProps> = ({ onOrbSelect }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.deepNavy}CC 50%, ${COLORS.deepNavy} 100%)`,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <ConstellationScene onOrbSelect={onOrbSelect} />
      </Canvas>
    </div>
  );
};
