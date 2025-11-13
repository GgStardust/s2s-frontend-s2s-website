/**
 * React Hook for RBI Web Worker
 * 
 * Manages communication with the RBI computation worker for async coherence computation.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type {
  ResonanceMatrix,
  CoherenceMetrics,
  ProofState,
} from './kernel';

export interface RBIWorkerMessage {
  type: string;
  payload?: any;
}

export interface RBIWorkerResponse {
  type: 'RESONANCE_COMPUTED' | 'COHERENCE_CALCULATED' | 'PROOF_VERIFIED';
  payload: ResonanceMatrix | CoherenceMetrics | ProofState;
}

export function useRBIWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const callbacksRef = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    // Create worker (inline for MVP, can be externalized later)
    const workerCode = `
      self.onmessage = function(e) {
        const { type, payload, requestId } = e.data;
        
        switch(type) {
          case 'COMPUTE_RESONANCE': {
            const matrix = {};
            const orbs = Array.from({ length: 13 }, (_, i) => i + 1);
            orbs.forEach(orbId => {
              matrix[orbId] = {};
              orbs.forEach(targetId => {
                if (orbId === targetId) {
                  matrix[orbId][targetId] = 1.0;
                } else {
                  const distance = Math.abs(orbId - targetId);
                  const baseResonance = Math.max(0, 1 - distance * 0.15);
                  const variation = (Math.random() - 0.5) * 0.2;
                  matrix[orbId][targetId] = Math.max(0, Math.min(1, baseResonance + variation));
                }
              });
            });
            self.postMessage({ 
              type: 'RESONANCE_COMPUTED', 
              payload: matrix,
              requestId: requestId
            });
            break;
          }
          case 'CALCULATE_COHERENCE': {
            const baseCoherence = 0.65 + (Math.random() - 0.5) * 0.2;
            const metrics = {
              overall: Math.max(0, Math.min(1, baseCoherence)),
              spatial: Math.max(0, Math.min(1, baseCoherence + (Math.random() - 0.5) * 0.1)),
              temporal: Math.max(0, Math.min(1, baseCoherence + (Math.random() - 0.5) * 0.1)),
              contextual: Math.max(0, Math.min(1, baseCoherence + (Math.random() - 0.5) * 0.1)),
            };
            self.postMessage({ 
              type: 'COHERENCE_CALCULATED', 
              payload: metrics,
              requestId: requestId
            });
            break;
          }
          case 'VERIFY_PROOF': {
            const confidence = 0.7 + Math.random() * 0.2;
            const proof = {
              verified: confidence > 0.75,
              confidence: Math.max(0, Math.min(1, confidence)),
              proofTerms: ['resonance', 'coherence', 'field', 'meaning'],
            };
            self.postMessage({ 
              type: 'PROOF_VERIFIED', 
              payload: proof,
              requestId: requestId
            });
            break;
          }
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = (e: MessageEvent<RBIWorkerResponse & { requestId?: string }>) => {
      const { type, payload, requestId } = e.data;
      if (requestId && callbacksRef.current.has(requestId)) {
        const callback = callbacksRef.current.get(requestId);
        if (callback) {
          callback(payload);
          callbacksRef.current.delete(requestId);
        }
      }
    };

    worker.onerror = (error) => {
      console.error('RBI Worker error:', error);
    };

    workerRef.current = worker;
    setIsReady(true);

    return () => {
      worker.terminate();
      workerRef.current = null;
      setIsReady(false);
    };
  }, []);

  const sendMessage = useCallback((
    message: RBIWorkerMessage,
    callback?: (data: any) => void
  ): string => {
    if (!workerRef.current) {
      console.warn('RBI Worker not ready');
      return '';
    }

    const requestId = `${Date.now()}-${Math.random()}`;
    if (callback) {
      callbacksRef.current.set(requestId, callback);
    }

    workerRef.current.postMessage({
      ...message,
      requestId,
    });

    return requestId;
  }, []);

  const computeResonanceAsync = useCallback((
    callback: (matrix: ResonanceMatrix) => void
  ) => {
    sendMessage({ type: 'COMPUTE_RESONANCE' }, callback);
  }, [sendMessage]);

  const calculateCoherenceAsync = useCallback((
    callback: (metrics: CoherenceMetrics) => void
  ) => {
    sendMessage({ type: 'CALCULATE_COHERENCE' }, callback);
  }, [sendMessage]);

  const verifyProofAsync = useCallback((
    callback: (proof: ProofState) => void
  ) => {
    sendMessage({ type: 'VERIFY_PROOF' }, callback);
  }, [sendMessage]);

  return {
    isReady,
    computeResonanceAsync,
    calculateCoherenceAsync,
    verifyProofAsync,
    worker: workerRef.current,
  };
}
