/**
 * FIELD CONSOLE
 * 
 * Main orchestrator component that manages the 4-phase loop:
 * Constellation → Chamber → Mirror → Stream
 * 
 * This is the living interface organism that expresses the field's resonance.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Constellation } from './Constellation';
import { Chamber } from './Chamber';
import { MirrorField } from './MirrorField';
import { ScrollStream } from './ScrollStream';
import { SignalChamber } from './SignalChamber';
import { AttunementEntry } from './AttunementEntry';
import { ConceptMapView } from './ConceptMapView';
import { useFieldStore } from '../../src/lib/store/fieldStore';
import { updateCoherenceField, computeResonance, calculateCoherence } from '@/src/lib/rbi';
import { useRBIWorker } from '../../src/lib/rbi/useRBIWorker';
import { COLORS } from '../../src/styles/theme';

interface FieldConsoleProps {
  className?: string;
}

export const FieldConsole: React.FC<FieldConsoleProps> = ({ className }) => {
  const [hasEntered, setHasEntered] = useState(false);
  const [showConceptMap, setShowConceptMap] = useState(false);
  const {
    currentPhase,
    isPortalOpen,
    setFieldState,
    setCoherenceMetrics,
    setResonanceMatrix,
  } = useFieldStore();

  // Initialize Web Worker for async RBI computations
  const { isReady, computeResonanceAsync, calculateCoherenceAsync } = useRBIWorker();

  // Initialize field state on mount
  useEffect(() => {
    if (isReady) {
      // Use Web Worker for async computation
      computeResonanceAsync((resonance) => {
        setResonanceMatrix(resonance);
      });

      calculateCoherenceAsync((coherence) => {
        setCoherenceMetrics(coherence);
        const fieldState = updateCoherenceField();
        setFieldState(fieldState);
      });
    } else {
      // Fallback to synchronous computation
      const resonance = computeResonance();
      const coherence = calculateCoherence();
      const fieldState = updateCoherenceField();

      setResonanceMatrix(resonance);
      setCoherenceMetrics(coherence);
      setFieldState(fieldState);
    }
  }, [isReady]);

  // Update field state periodically using Web Worker
  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      computeResonanceAsync((resonance) => {
        setResonanceMatrix(resonance);
      });

      calculateCoherenceAsync((coherence) => {
        setCoherenceMetrics(coherence);
        const fieldState = updateCoherenceField();
        setFieldState(fieldState);
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isReady]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Attunement Entry Screen */}
      {!hasEntered && <AttunementEntry onEnter={() => setHasEntered(true)} />}

      {/* Main Field Console (visible after attunement) */}
      {hasEntered && (
        <>
          {/* Phase 1: Constellation (always visible as base layer) */}
          <Constellation />

          {/* Phase 2: Chamber (portal opens when Orb is selected) */}
          {isPortalOpen && <Chamber />}

          {/* Phase 3: Mirror Field (always visible, shows coherence feedback) */}
          <MirrorField />

          {/* Phase 4: ScrollStream (always visible, flows at bottom) */}
          <ScrollStream />

          {/* Signal Chamber (participant input) */}
          <SignalChamber />

          {/* Concept Map View (toggleable) */}
          {showConceptMap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                width: '400px',
                maxHeight: '80vh',
                overflowY: 'auto',
                backgroundColor: `${COLORS.deepNavy}95`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${COLORS.deepGold}40`,
                borderRadius: '12px',
                zIndex: 300,
                boxShadow: `0 8px 32px ${COLORS.deepGold}20`,
              }}
            >
              <div style={{ padding: '10px', borderBottom: `1px solid ${COLORS.deepGold}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Concept Map</h3>
                <button
                  onClick={() => setShowConceptMap(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: COLORS.creamyWhite,
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '0 8px',
                  }}
                >
                  ×
                </button>
              </div>
              <ConceptMapView />
            </motion.div>
          )}

          {/* Toggle Concept Map Button */}
          {!showConceptMap && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowConceptMap(true)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '10px 16px',
                backgroundColor: `${COLORS.deepGold}80`,
                border: `1px solid ${COLORS.deepGold}`,
                borderRadius: '8px',
                color: COLORS.deepNavy,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                zIndex: 200,
                boxShadow: `0 4px 16px ${COLORS.deepGold}30`,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 6px 20px ${COLORS.deepGold}50` }}
              whileTap={{ scale: 0.95 }}
            >
              View Concept Map
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

