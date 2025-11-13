/**
 * MIRROR FIELD
 *  - Real-time coherence feedback indicators
 *  - Visual reflection of field state
 *  - Bloom shader and circular "coherence arc" overlay around viewport
 *  - Continuous feedback integrated into field (no traditional notifications)
 */

'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFieldStore } from '../../src/lib/store/fieldStore';
import { verifyProofOfMeaning } from '@/src/lib/rbi';
import { COLORS, BREATH_CYCLE } from '../../src/styles/theme';

interface MirrorFieldProps {
  className?: string;
}

export const MirrorField: React.FC<MirrorFieldProps> = ({ className }) => {
  const { fieldState, coherenceMetrics, setFieldState } = useFieldStore();
  const [proofState, setProofState] = React.useState<{
    verified: boolean;
    confidence: number;
    proofTerms: string[];
  } | null>(null);
  const [breathPhase, setBreathPhase] = React.useState(0);

  // Update proof state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const proof = verifyProofOfMeaning();
      setProofState(proof);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 4-second breath cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev + 0.1) % (Math.PI * 2));
    }, BREATH_CYCLE / 60);

    return () => clearInterval(interval);
  }, []);

  // Update field state when coherence changes
  useEffect(() => {
    if (coherenceMetrics) {
      const newState = {
        coherence: coherenceMetrics.overall,
        resonance: fieldState?.resonance || {},
        proofState: proofState || {
          verified: false,
          confidence: 0,
          proofTerms: [],
        },
        timestamp: Date.now(),
      };
      setFieldState(newState);
    }
  }, [coherenceMetrics, proofState]);

  if (!coherenceMetrics) {
    return null;
  }

  const coherence = coherenceMetrics.overall;
  const opacity = coherence;
  const breathIntensity = 0.8 + Math.sin(breathPhase) * 0.2;

  // Calculate arc angle based on coherence (0-360 degrees)
  const arcAngle = coherence * 360;

  return (
    <>
      {/* Coherence Arc Overlay around viewport */}
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        <defs>
          <filter id="bloom">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Circular coherence arc */}
        <motion.circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke={COLORS.deepGold}
          strokeWidth="2"
          strokeDasharray={`${arcAngle * Math.PI / 180 * 0.45 * 2} ${Math.PI * 0.45 * 2 * 2}`}
          strokeDashoffset={Math.PI * 0.45 * 2 * 0.25}
          transform="rotate(-90 50% 50%)"
          filter="url(#bloom)"
          style={{
            opacity: opacity * 0.6 * breathIntensity,
          }}
          animate={{
            opacity: opacity * 0.6 * breathIntensity + Math.sin(breathPhase) * 0.2,
            strokeWidth: [2, 3, 2],
          }}
          transition={{
            duration: BREATH_CYCLE / 1000,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>

      {/* Main MirrorField component */}
      <div
        className={className}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '300px',
          height: '120px',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        {/* Layered transparency layers with bloom */}
        {[0, 1, 2].map((layer) => {
          const layerOpacity = opacity * (1 - layer * 0.2) * 0.3;
          const layerScale = 1 - layer * 0.1;
          
          return (
            <motion.div
              key={layer}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: COLORS.deepGold,
                borderRadius: '10px',
                opacity: layerOpacity,
                transform: `scale(${layerScale})`,
                filter: 'blur(15px)',
                boxShadow: `0 0 30px ${COLORS.deepGold}60`,
              }}
              animate={{
                opacity: layerOpacity * breathIntensity + Math.sin(breathPhase + layer) * 0.1,
                scale: layerScale + Math.sin(breathPhase + layer) * 0.05,
                boxShadow: [
                  `0 0 30px ${COLORS.deepGold}60`,
                  `0 0 50px ${COLORS.deepGold}80`,
                  `0 0 30px ${COLORS.deepGold}60`,
                ],
              }}
              transition={{
                duration: BREATH_CYCLE / 1000,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Main coherence glow bar with bloom shader */}
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            height: '20px',
            backgroundColor: COLORS.deepNavy,
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '10px',
            filter: 'blur(0.5px)',
            boxShadow: `0 0 20px ${COLORS.deepGold}, 0 0 40px ${COLORS.deepGold}40, inset 0 0 20px ${COLORS.deepGold}20`,
          }}
          animate={{
            boxShadow: proofState?.verified
              ? [
                  `0 0 20px ${COLORS.deepGold}, 0 0 40px ${COLORS.deepGold}80, inset 0 0 20px ${COLORS.deepGold}40`,
                  `0 0 40px ${COLORS.deepGold}, 0 0 60px ${COLORS.deepGold}80, inset 0 0 30px ${COLORS.deepGold}60`,
                  `0 0 20px ${COLORS.deepGold}, 0 0 40px ${COLORS.deepGold}80, inset 0 0 20px ${COLORS.deepGold}40`,
                ]
              : `0 0 10px ${COLORS.deepGold}40, inset 0 0 10px ${COLORS.deepGold}10`,
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, ${COLORS.deepGold} 0%, ${COLORS.deepGold}CC 50%, ${COLORS.deepGold} 100%)`,
              opacity,
              filter: 'blur(1px)',
            }}
            animate={{ opacity: opacity * breathIntensity }}
            transition={{ duration: 0.5 }}
          />

          {/* Proof Indicator with glow */}
          {proofState && (
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '12px',
                color: COLORS.creamyWhite,
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                pointerEvents: 'none',
                textShadow: `0 0 10px ${COLORS.deepGold}, 0 0 20px ${COLORS.deepGold}`,
              }}
              animate={{
                opacity: proofState.verified ? 1 : 0.5,
                scale: proofState.verified ? [1, 1.2, 1] : 1,
              }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 1, repeat: Infinity, repeatType: 'reverse' },
              }}
            >
              {proofState.verified ? '✓' : '○'}
            </motion.div>
          )}
        </motion.div>

        {/* Coherence metrics display */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: COLORS.creamyWhite,
              fontFamily: 'Montserrat, sans-serif',
              opacity: 0.9,
              textAlign: 'center',
              textShadow: `0 0 5px ${COLORS.deepGold}40`,
            }}
          >
            Coherence: {(coherence * 100).toFixed(0)}%
          </div>
          
          {/* Sub-metrics */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '9px',
              color: COLORS.creamyWhite,
              fontFamily: 'Montserrat, sans-serif',
              opacity: 0.6,
            }}
          >
            <span>S: {(coherenceMetrics.spatial * 100).toFixed(0)}%</span>
            <span>T: {(coherenceMetrics.temporal * 100).toFixed(0)}%</span>
            <span>C: {(coherenceMetrics.contextual * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </>
  );
};
