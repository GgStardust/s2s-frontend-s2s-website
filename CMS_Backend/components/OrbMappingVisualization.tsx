/**
 * Orb Mapping Visualization Component
 * 
 * Displays Orb associations and Undercurrent links:
 * - Interactive Orb grid (1-13)
 * - Undercurrent connections (1-12)
 * - Resonance flow visualization
 * - Click-to-explore functionality
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Tooltip } from '@/components/backend';
import { 
  Circle, 
  Hexagon, 
  Star, 
  Zap, 
  Clock, 
  Cpu, 
  Flame, 
  Brain, 
  Activity, 
  TreePine, 
  Sun, 
  Shield, 
  Link,
  Info
} from 'lucide-react';

interface OrbMappingVisualizationProps {
  orbAssociations?: number[];
  undercurrentLinks?: number[];
  resonanceStrength?: number;
  onOrbClick?: (orbId: number) => void;
  onUndercurrentClick?: (undercurrentId: number) => void;
  className?: string;
}

const ORB_ICONS = {
  1: Circle,    // Origin Intelligence
  2: Activity,     // Resonance Mechanics
  3: Sun,       // Photonic Intelligence
  4: Hexagon,   // Harmonic Architectures
  5: Clock,     // Temporal Sovereignty
  6: Cpu,    // Starline Memory
  7: Flame,     // Alchemical Current
  8: Brain,     // Quantum Intuition
  9: Activity,     // Temporal Fluidity
  10: TreePine, // Ancestral Repatterning
  11: Sun,      // Radiant Transparency
  12: Shield,   // Sovereign Field
  13: Link    // Bridging Intelligence
};

const ORB_NAMES = {
  1: 'Origin Intelligence',
  2: 'Resonance Mechanics',
  3: 'Photonic Intelligence',
  4: 'Harmonic Architectures',
  5: 'Temporal Sovereignty',
  6: 'Starline Memory',
  7: 'Alchemical Current',
  8: 'Quantum Intuition',
  9: 'Temporal Fluidity',
  10: 'Ancestral Repatterning',
  11: 'Radiant Transparency',
  12: 'Sovereign Field',
  13: 'Bridging Intelligence'
};

const ORB_DESCRIPTIONS = {
  1: 'Photonic blueprinting meets biological activation',
  2: 'Frequency becomes form',
  3: 'Light mirrors awareness',
  4: 'Geometry stabilizes coherence',
  5: 'Spiral time and agency',
  6: 'Galactic/ancestral recall as signal',
  7: 'Density to light through compression',
  8: 'Nonlinear directional knowing',
  9: 'Attunement across timelines',
  10: 'Lineage transformation',
  11: 'Luminous truth expression',
  12: 'Structural indivisibility',
  13: 'Human ↔ nonhuman communication'
};

const UNDERCURRENT_NAMES = {
  1: 'Body as Energetic Technology',
  2: 'Vibration & Frequency in Reality Creation',
  3: 'Interconnection Through Light & Energy',
  4: 'Higher Intelligence & Consciousness Evolution',
  5: 'Sovereignty as Gateway to Liberation',
  6: 'Collective Awakening',
  7: 'Resting & Action Potential',
  8: 'Intuition & Knowing',
  9: 'Time as Nonlinear',
  10: 'Energy Imprints & Ancestral Memory',
  11: 'Sacred Patterns & Geometry',
  12: 'Free Will vs Universal Flow'
};

export function OrbMappingVisualization({
  orbAssociations = [],
  undercurrentLinks = [],
  resonanceStrength = 0,
  onOrbClick,
  onUndercurrentClick,
  className = ''
}: OrbMappingVisualizationProps) {
  const [selectedOrb, setSelectedOrb] = useState<number | null>(null);
  const [selectedUndercurrent, setSelectedUndercurrent] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleOrbClick = (orbId: number) => {
    setSelectedOrb(orbId);
    setSelectedUndercurrent(null);
    setShowDetails(true);
    if (onOrbClick) {
      onOrbClick(orbId);
    }
  };

  const handleUndercurrentClick = (undercurrentId: number) => {
    setSelectedUndercurrent(undercurrentId);
    setSelectedOrb(null);
    setShowDetails(true);
    if (onUndercurrentClick) {
      onUndercurrentClick(undercurrentId);
    }
  };

  const getOrbIntensity = (orbId: number) => {
    if (orbAssociations.includes(orbId)) {
      return Math.min(resonanceStrength * 0.3 + 0.7, 1);
    }
    return 0.2;
  };

  const getUndercurrentIntensity = (undercurrentId: number) => {
    if (undercurrentLinks.includes(undercurrentId)) {
      return Math.min(resonanceStrength * 0.2 + 0.6, 1);
    }
    return 0.3;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Orb Grid */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-backend-primary">
            Orb Associations
          </h3>
          <Badge variant="outline" className="text-sm">
            {orbAssociations.length} active
          </Badge>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 13 }, (_, i) => i + 1).map((orbId) => {
            const Icon = ORB_ICONS[orbId as keyof typeof ORB_ICONS];
            const isActive = orbAssociations.includes(orbId);
            const intensity = getOrbIntensity(orbId);
            
            return (
              <Tooltip key={orbId} content={ORB_NAMES[orbId as keyof typeof ORB_NAMES]}>
                <button
                  onClick={() => handleOrbClick(orbId)}
                  className={`
                    relative p-3 rounded-lg border-2 transition-all duration-200
                    ${isActive 
                      ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }
                    ${selectedOrb === orbId ? 'ring-2 ring-blue-300' : ''}
                  `}
                  style={{
                    opacity: intensity,
                    transform: `scale(${isActive ? 1.05 : 1})`
                  }}
                >
                  <Icon className={`h-6 w-6 mx-auto ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="text-xs font-medium mt-1 text-center">
                    {orbId}
                  </div>
                  {isActive && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>
      </Card>

      {/* Undercurrent Links */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-backend-primary">
            Undercurrent Links
          </h3>
          <Badge variant="outline" className="text-sm">
            {undercurrentLinks.length} active
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((undercurrentId) => {
            const isActive = undercurrentLinks.includes(undercurrentId);
            const intensity = getUndercurrentIntensity(undercurrentId);
            
            return (
              <button
                key={undercurrentId}
                onClick={() => handleUndercurrentClick(undercurrentId)}
                className={`
                  p-2 rounded text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }
                  ${selectedUndercurrent === undercurrentId ? 'ring-2 ring-green-300' : ''}
                `}
                style={{ opacity: intensity }}
              >
                <div className="text-sm font-medium">
                  {undercurrentId}. {UNDERCURRENT_NAMES[undercurrentId as keyof typeof UNDERCURRENT_NAMES]}
                </div>
                {isActive && (
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Details Panel */}
      {showDetails && (selectedOrb || selectedUndercurrent) && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-backend-primary">
              Details
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(false)}
            >
              ×
            </Button>
          </div>
          
          {selectedOrb && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {React.createElement(ORB_ICONS[selectedOrb as keyof typeof ORB_ICONS], {
                  className: "h-8 w-8 text-blue-600"
                })}
                <div>
                  <h4 className="text-lg font-semibold">
                    Orb {selectedOrb}: {ORB_NAMES[selectedOrb as keyof typeof ORB_NAMES]}
                  </h4>
                  <p className="text-sm text-backend-secondary">
                    {ORB_DESCRIPTIONS[selectedOrb as keyof typeof ORB_DESCRIPTIONS]}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Active</Badge>
                <Badge variant="outline">
                  Resonance: {(getOrbIntensity(selectedOrb) * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          )}
          
          {selectedUndercurrent && (
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-semibold">
                  Undercurrent {selectedUndercurrent}: {UNDERCURRENT_NAMES[selectedUndercurrent as keyof typeof UNDERCURRENT_NAMES]}
                </h4>
                <p className="text-sm text-backend-secondary mt-1">
                  This undercurrent represents a fundamental pattern in consciousness and reality creation.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Active</Badge>
                <Badge variant="outline">
                  Resonance: {(getUndercurrentIntensity(selectedUndercurrent) * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Resonance Flow Visualization */}
      {orbAssociations.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-backend-primary mb-4">
            Resonance Flow
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${resonanceStrength * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium">
              {(resonanceStrength * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-backend-secondary mt-2">
            Overall resonance strength across all active Orbs and Undercurrents
          </p>
        </Card>
      )}
    </div>
  );
}
