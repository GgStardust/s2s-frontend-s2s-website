'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 13 Orbs with their colors from tailwind config
const ORBS = [
  { id: 1, name: 'Origin Intelligence', color: '#8B0000', position: [0, 0, 0] },
  { id: 2, name: 'Resonance Mechanics', color: '#1E90FF', position: [3, 2, 1] },
  { id: 3, name: 'Photonic Intelligence', color: '#FFFFFF', position: [-3, 2, -1] },
  { id: 4, name: 'Harmonic Architectures', color: '#FFD700', position: [2, -2, 2] },
  { id: 5, name: 'Temporal Sovereignty', color: '#9370DB', position: [-2, -2, -2] },
  { id: 6, name: 'Starline Memory', color: '#4169E1', position: [4, 0, -2] },
  { id: 7, name: 'Alchemical Current', color: '#FF4500', position: [-4, 0, 2] },
  { id: 8, name: 'Quantum Intuition', color: '#00CED1', position: [1, 3, -3] },
  { id: 9, name: 'Temporal Fluidity', color: '#48D1CC', position: [-1, -3, 3] },
  { id: 10, name: 'Ancestral Repatterning', color: '#8B4513', position: [3, -1, -3] },
  { id: 11, name: 'Radiant Transparency', color: '#F0E68C', position: [-3, 1, 3] },
  { id: 12, name: 'Sovereign Field', color: '#DAA520', position: [2, 3, 1] },
  { id: 13, name: 'Bridging Intelligence', color: '#9932CC', position: [-2, -3, -1] },
];

interface OrbProps {
  orb: typeof ORBS[0];
  onClick: () => void;
  isHovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

function Orb({ orb, onClick, isHovered, onPointerOver, onPointerOut }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.005;

      // Breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      meshRef.current.scale.setScalar(isHovered ? scale * 1.2 : scale);
    }

    if (glowRef.current) {
      // Pulse glow
      const glowScale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      glowRef.current.scale.setScalar(isHovered ? glowScale * 1.5 : glowScale);
    }
  });

  return (
    <group position={orb.position as [number, number, number]}>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[0.6, 32, 32]}>
        <meshBasicMaterial
          color={orb.color}
          transparent
          opacity={isHovered ? 0.3 : 0.15}
        />
      </Sphere>

      {/* Main orb */}
      <Sphere
        ref={meshRef}
        args={[0.4, 32, 32]}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <meshStandardMaterial
          color={orb.color}
          emissive={orb.color}
          emissiveIntensity={isHovered ? 0.8 : 0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>

      {/* Label (visible on hover) */}
      {isHovered && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color="#F8F7F4"
          anchorX="center"
          anchorY="middle"
        >
          {orb.name}
        </Text>
      )}
    </group>
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (linesRef.current) {
      // Subtle pulse animation
      const opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
    }
  });

  // Create connections between orbs (fractal geometry)
  const connections = useMemo(() => {
    const points: THREE.Vector3[] = [];

    // Connect Orb 1 (center) to all others
    ORBS.slice(1).forEach(orb => {
      points.push(
        new THREE.Vector3(...(ORBS[0].position as [number, number, number])),
        new THREE.Vector3(...(orb.position as [number, number, number]))
      );
    });

    // Additional meaningful connections based on Orb relationships
    const additionalConnections = [
      [2, 4], // Resonance <-> Harmonic
      [7, 10], // Alchemical <-> Ancestral
      [8, 9], // Quantum <-> Temporal Fluidity
      [11, 12], // Radiant <-> Sovereign
    ];

    additionalConnections.forEach(([a, b]) => {
      points.push(
        new THREE.Vector3(...(ORBS[a - 1].position as [number, number, number])),
        new THREE.Vector3(...(ORBS[b - 1].position as [number, number, number]))
      );
    });

    return points;
  }, []);

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={connections.length}
          array={new Float32Array(connections.flatMap(v => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#D4AF37" transparent opacity={0.1} />
    </lineSegments>
  );
}

function Scene({ onOrbClick, hoveredOrb, setHoveredOrb }: {
  onOrbClick: (orbId: number) => void;
  hoveredOrb: number | null;
  setHoveredOrb: (id: number | null) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />

      <ConnectionLines />

      {ORBS.map((orb) => (
        <Orb
          key={orb.id}
          orb={orb}
          onClick={() => onOrbClick(orb.id)}
          isHovered={hoveredOrb === orb.id}
          onPointerOver={() => setHoveredOrb(orb.id)}
          onPointerOut={() => setHoveredOrb(null)}
        />
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={8}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function OrbConstellation() {
  const [hoveredOrb, setHoveredOrb] = useState<number | null>(null);

  const handleOrbClick = (orbId: number) => {
    window.location.href = `/orbs/${orbId}`;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-void-black via-deep-indigo to-void-black">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        className="w-full h-full"
      >
        <Scene
          onOrbClick={handleOrbClick}
          hoveredOrb={hoveredOrb}
          setHoveredOrb={setHoveredOrb}
        />
      </Canvas>

      {/* Hover info overlay */}
      {hoveredOrb && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-deep-indigo/90 backdrop-blur-sm px-6 py-3 rounded-lg border border-living-gold/30">
          <p className="text-bone-white text-sm">
            Click to explore Orb {hoveredOrb}
          </p>
        </div>
      )}
    </div>
  );
}
