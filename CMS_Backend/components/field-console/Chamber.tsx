/**
 * CHAMBER
 *  - Portal depth with layered transparency
 *  - Transparent glass layers with depth fade transitions
 *  - Field gradients respond to coherence
 *  - Resonance-based transitions between views
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFieldStore } from '../../src/lib/store/fieldStore';
import { propagateResonance } from '@/src/lib/rbi';
import { COLORS, BREATH_CYCLE } from '../../src/styles/theme';
import { fetchConsoleContent, senseField } from '../../src/lib/api/console-api';
import type { ConsoleContent, FieldSensingState } from '../../src/lib/api/console-api';

interface ChamberProps {
  onExit?: () => void;
}

export const Chamber: React.FC<ChamberProps> = ({ onExit }) => {
  const { selectedOrbId, orbs, coherenceMetrics, closePortal } = useFieldStore();
  const [propagation, setPropagation] = React.useState<{
    depth: number;
    layers: number[];
    intensity: number;
  } | null>(null);
  const [breathPhase, setBreathPhase] = React.useState(0);
  const [chamberContent, setChamberContent] = useState<ConsoleContent[]>([]);
  const [fieldState, setFieldState] = useState<FieldSensingState | null>(null);

  const selectedOrb = orbs.find((o) => o.id === selectedOrbId);

  React.useEffect(() => {
    if (selectedOrbId) {
      const prop = propagateResonance(selectedOrbId);
      setPropagation(prop);
      
      // Load console content for this Orb
      fetchConsoleContent({ orb_id: selectedOrbId })
        .then(content => {
          setChamberContent(content);
          
          // Sense field for visible content
          if (content.length > 0) {
            const contentIds = content.map(c => c.id);
            senseField(contentIds).then(setFieldState).catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, [selectedOrbId]);

  // 4-second breath cycle
  React.useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev + 0.1) % (Math.PI * 2));
    }, BREATH_CYCLE / 60);

    return () => clearInterval(interval);
  }, []);

  const handleExit = () => {
    closePortal();
    onExit?.();
  };

  if (!selectedOrb || !coherenceMetrics) {
    return null;
  }

  const breathIntensity = 0.8 + Math.sin(breathPhase) * 0.2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.deepNavy}CC 50%, ${COLORS.deepGold}40 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'hidden',
        }}
        onClick={handleExit}
      >
        {/* Transparent glass layers with depth fade */}
        {propagation?.layers.map((layer, idx) => {
          const layerOpacity = (1 - idx * 0.15) * 0.4;
          const layerScale = 1 - (idx * 0.08);
          const depthFade = Math.pow(0.7, idx); // Exponential depth fade

          return (
            <motion.div
              key={layer}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: layerOpacity * depthFade * breathIntensity,
                scale: layerScale + Math.sin(breathPhase + idx) * 0.03,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: 1.5 + idx * 0.3,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                width: `${100 - idx * 8}%`,
                height: `${100 - idx * 8}%`,
                background: `radial-gradient(circle, ${COLORS.deepGold}20 0%, transparent 70%)`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${COLORS.deepGold}30`,
                borderRadius: '50%',
                pointerEvents: 'none',
                mixBlendMode: 'screen',
              }}
            />
          );
        })}

        {/* Main content with glass effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: 'relative',
            width: '500px',
            maxWidth: '90vw',
            padding: '40px',
            background: `linear-gradient(135deg, ${COLORS.deepNavy}80 0%, ${COLORS.deepNavy}60 100%)`,
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: `1px solid ${COLORS.deepGold}40`,
            borderRadius: '20px',
            boxShadow: `0 8px 32px ${COLORS.deepGold}20, inset 0 0 60px ${COLORS.deepGold}10`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.creamyWhite,
            fontFamily: 'Montserrat, sans-serif',
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            style={{ fontSize: '28px', marginBottom: '30px', fontWeight: 600 }}
            animate={{ opacity: breathIntensity }}
          >
            {selectedOrb.name}
          </motion.div>
          
          {/* Coherence Bar with glass effect */}
          <div
            style={{
              width: '100%',
              height: '30px',
              backgroundColor: `${COLORS.deepNavy}80`,
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              overflow: 'hidden',
              marginBottom: '30px',
              border: `1px solid ${COLORS.deepGold}30`,
            }}
          >
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, ${COLORS.deepGold} 0%, ${COLORS.deepGold}CC 100%)`,
                boxShadow: `0 0 20px ${COLORS.deepGold}60`,
              }}
              initial={{ width: 0 }}
              animate={{
                width: `${coherenceMetrics.overall * 100}%`,
                boxShadow: [
                  `0 0 20px ${COLORS.deepGold}60`,
                  `0 0 40px ${COLORS.deepGold}80`,
                  `0 0 20px ${COLORS.deepGold}60`,
                ],
              }}
              transition={{
                width: { duration: 1, ease: 'easeOut' },
                boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          </div>

          {/* Coherence Metrics */}
          <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '10px' }}>
            Coherence: {(coherenceMetrics.overall * 100).toFixed(0)}%
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7, textAlign: 'center', lineHeight: 1.8 }}>
            Spatial: {(coherenceMetrics.spatial * 100).toFixed(0)}% | 
            Temporal: {(coherenceMetrics.temporal * 100).toFixed(0)}% | 
            Contextual: {(coherenceMetrics.contextual * 100).toFixed(0)}%
          </div>

          {/* Field Sensing State */}
          {fieldState && (
            <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.8 }}>
              <div>Field Strength: {(fieldState.fieldStrength * 100).toFixed(0)}%</div>
              <div>Visible Content: {fieldState.visibleContent.length} items</div>
              {fieldState.visibleContent.length > 0 && (
                <div style={{ marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                  {fieldState.visibleContent.slice(0, 3).map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '8px', padding: '8px', backgroundColor: `${COLORS.deepNavy}60`, borderRadius: '4px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: '10px', opacity: 0.7 }}>
                        Resonance: {(item.resonance.strength * 100).toFixed(0)}% | 
                        Proof: {item.proofStatus}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chamber Content Preview */}
          {chamberContent.length > 0 && (
            <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.8 }}>
              <div style={{ marginBottom: '8px', fontWeight: 600 }}>Related Content ({chamberContent.length})</div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {chamberContent.map((content, idx) => (
                  <motion.div
                    key={content.id || idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Navigate to content detail or open in modal
                      console.log('Content clicked:', content);
                    }}
                    style={{
                      marginBottom: '8px',
                      padding: '8px',
                      fontSize: '11px',
                      backgroundColor: `${COLORS.deepNavy}60`,
                      border: `1px solid ${COLORS.deepGold}30`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      opacity: 0.8,
                    }}
                    whileHover={{
                      opacity: 1,
                      borderColor: COLORS.deepGold,
                      backgroundColor: `${COLORS.deepNavy}80`,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{content.title}</div>
                    {content.console_context && (
                      <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px' }}>
                        Context: {content.console_context}
                      </div>
                    )}
                    {content.orb_associations && content.orb_associations.length > 0 && (
                      <div style={{ fontSize: '10px', opacity: 0.7 }}>
                        Orbs: {content.orb_associations.join(', ')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Exit Hint */}
          <motion.div
            style={{
              marginTop: '40px',
              fontSize: '12px',
              opacity: 0.5,
              cursor: 'pointer',
              padding: '10px 20px',
              border: `1px solid ${COLORS.deepGold}30`,
              borderRadius: '8px',
            }}
            whileHover={{ opacity: 0.8, borderColor: COLORS.deepGold }}
            onClick={(e) => {
              e.stopPropagation();
              handleExit();
            }}
          >
            Click to return
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
