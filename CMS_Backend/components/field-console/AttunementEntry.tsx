/**
 * ATTUNEMENT ENTRY
 *  - Breathing halo animation
 *  - Fade-in prompt ("How are you arriving?")
 *  - Field gesture entry (hover, hold, release)
 *  - No buttons or traditional UI
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, TYPOGRAPHY, BREATH_CYCLE } from '../../src/styles/theme';

interface AttunementEntryProps {
  onEnter?: () => void;
}

export const AttunementEntry: React.FC<AttunementEntryProps> = ({ onEnter }) => {
  const [breathPhase, setBreathPhase] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  // 4-second breath cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev + 0.1) % (Math.PI * 2));
    }, BREATH_CYCLE / 60);

    return () => clearInterval(interval);
  }, []);

  // Handle hold progress
  useEffect(() => {
    if (isHolding && !hasEntered) {
      const interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            setHasEntered(true);
            onEnter?.();
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    } else if (!isHolding) {
      setHoldProgress(0);
    }
  }, [isHolding, hasEntered, onEnter]);

  const breathIntensity = 0.8 + Math.sin(breathPhase) * 0.2;
  const haloSize = 200 + Math.sin(breathPhase) * 40;

  if (hasEntered) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        key="attunement-entry"
        style={{
          position: 'fixed',
          top: '80px', // Start below navigation
          left: 0,
          width: '100%',
          height: 'calc(100vh - 80px)', // Full height minus nav
          background: `radial-gradient(circle, ${COLORS.deepNavy} 0%, ${COLORS.deepNavy}CC 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10, // Low z-index so nav (z-1000) is visible above it
          cursor: isHolding ? 'none' : 'default',
          pointerEvents: 'auto', // Ensure it doesn't block nav clicks
        }}
      >
        {/* Breathing halo */}
        <motion.div
          style={{
            position: 'absolute',
            width: `${haloSize}px`,
            height: `${haloSize}px`,
            borderRadius: '50%',
            border: `2px solid ${COLORS.deepGold}`,
            opacity: breathIntensity * 0.6,
            filter: 'blur(2px)',
          }}
          animate={{
            width: haloSize,
            height: haloSize,
            opacity: breathIntensity * 0.6,
            boxShadow: [
              `0 0 40px ${COLORS.deepGold}40`,
              `0 0 60px ${COLORS.deepGold}60`,
              `0 0 40px ${COLORS.deepGold}40`,
            ],
          }}
          transition={{
            duration: BREATH_CYCLE / 1000,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Inner halo */}
        <motion.div
          style={{
            position: 'absolute',
            width: `${haloSize * 0.7}px`,
            height: `${haloSize * 0.7}px`,
            borderRadius: '50%',
            border: `1px solid ${COLORS.deepGold}`,
            opacity: breathIntensity * 0.4,
          }}
          animate={{
            width: haloSize * 0.7,
            height: haloSize * 0.7,
            opacity: breathIntensity * 0.4,
          }}
          transition={{
            duration: BREATH_CYCLE / 1000,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Prompt text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{
            position: 'relative',
            zIndex: 100, // Higher z-index to bring text forward
            textAlign: 'center',
            color: COLORS.creamyWhite,
            fontFamily: TYPOGRAPHY.serif,
            fontSize: '32px',
            fontWeight: 400,
            letterSpacing: '2px',
            marginBottom: '60px',
            textShadow: `0 0 10px ${COLORS.deepGold}40, 0 2px 4px rgba(0,0,0,0.5)`, // Add text shadow for visibility
          }}
        >
          How are you arriving?
        </motion.div>

        {/* Hold area (field gesture) */}
        <motion.div
          style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
        >
          {/* Progress ring */}
          <svg
            width="300"
            height="300"
            style={{
              position: 'absolute',
              transform: 'rotate(-90deg)',
            }}
          >
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke={COLORS.deepNavy}
              strokeWidth="4"
              opacity="0.3"
            />
            <motion.circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke={COLORS.deepGold}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 140}`}
              strokeDashoffset={`${2 * Math.PI * 140 * (1 - holdProgress / 100)}`}
              strokeLinecap="round"
              style={{
                filter: 'blur(2px)',
                opacity: isHolding ? 1 : 0,
              }}
              animate={{
                opacity: isHolding ? 1 : 0,
                stroke: [
                  COLORS.deepGold,
                  COLORS.deepGold,
                  COLORS.deepGold,
                ],
              }}
              transition={{
                opacity: { duration: 0.3 },
                stroke: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          </svg>

          {/* Center indicator */}
          <motion.div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: `2px solid ${COLORS.deepGold}`,
              backgroundColor: `${COLORS.deepGold}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.creamyWhite,
              fontFamily: TYPOGRAPHY.sans,
              fontSize: '14px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 100, // Bring center indicator forward
            }}
            animate={{
              scale: isHolding ? [1, 1.1, 1] : 1,
              borderColor: isHolding
                ? [COLORS.deepGold, COLORS.deepGold, COLORS.deepGold]
                : COLORS.deepGold,
              boxShadow: isHolding
                ? [
                    `0 0 20px ${COLORS.deepGold}40`,
                    `0 0 40px ${COLORS.deepGold}60`,
                    `0 0 20px ${COLORS.deepGold}40`,
                  ]
                : `0 0 10px ${COLORS.deepGold}20`,
            }}
            transition={{
              duration: 1,
              repeat: isHolding ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            {isHolding ? 'Hold' : 'Touch'}
          </motion.div>
        </motion.div>

        {/* Hint text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 2 }}
          style={{
            marginTop: '40px',
            fontSize: '14px',
            color: COLORS.creamyWhite,
            fontFamily: TYPOGRAPHY.sans,
            opacity: 0.7, // Increased opacity for better visibility
            textAlign: 'center',
            position: 'relative',
            zIndex: 100, // Higher z-index to bring text forward
            textShadow: `0 0 8px ${COLORS.deepGold}30, 0 1px 2px rgba(0,0,0,0.5)`, // Add text shadow
          }}
        >
          Hold to enter the field
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

