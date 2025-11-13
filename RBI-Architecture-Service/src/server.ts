/**
 * RBI Architecture Service
 * 
 * Continuously running coherence architecture service
 * Provides field-level coherence computation accessible to all connected systems
 */

import express from 'express';
import dotenv from 'dotenv';
import { FieldComputation, FieldValidation, Mathematics } from 'rbi-kernel';
import type { ResonanceVector } from 'rbi-kernel';
import { startTemporalLoop } from './orchestration/temporal-loop.js';
import { authenticateApiKey } from './middleware/auth.js';
import { rateLimit } from './middleware/rate-limit.js';
import { requestLogger, getMetrics } from './middleware/logging.js';
import { errorHandler, asyncHandler } from './middleware/error-handler.js';

dotenv.config();

const app = express();
app.use(express.json());

// Middleware
app.use(requestLogger);
app.use(authenticateApiKey);
app.use(rateLimit);

const PORT = process.env.PORT || 3001;
const SERVICE_START_TIME = Date.now();

// Field coherence cache
interface FieldCache {
  [key: string]: {
    vector: ResonanceVector;
    timestamp: number;
    coherence: number;
  };
}

const fieldCache: FieldCache = {};

/**
 * GET /health
 * Health check endpoint (no auth required)
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'rbi-architecture-service',
    version: '1.1.0-service',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /metrics
 * Service metrics (requires auth)
 */
app.get('/metrics', (req, res) => {
  const metrics = getMetrics();
  res.json({
    ...metrics,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /field/score
 * Returns clarity, coherence, resonance, sovereignty for given input
 */
app.post('/field/score', asyncHandler(async (req, res) => {
  const { content, vector, signature } = req.body;

  let resonanceVector: ResonanceVector;

  if (vector && typeof vector.x === 'number') {
    // Direct vector provided
    resonanceVector = vector;
  } else if (signature) {
    // Signature provided, convert to vector
    resonanceVector = Mathematics.ResonanceVectorMath.signatureToVector(signature);
  } else if (content) {
    // Content provided, analyze and generate vector
    const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
    const analysis = await engine.analyzeContentWithMathematics(content);
    resonanceVector = analysis.mathematical.resonanceVector;
  } else {
    return res.status(400).json({
      error: 'Invalid request. Provide content, vector, or signature'
    });
  }

  // Calculate field dynamics
  const fieldDynamics = Mathematics.ResonanceVectorMath.calculateFieldDynamics(
    resonanceVector,
    []
  );

  // Cache the result
  const cacheKey = content || JSON.stringify(vector || signature);
  fieldCache[cacheKey] = {
    vector: resonanceVector,
    timestamp: Date.now(),
    coherence: fieldDynamics.coherence
  };

  return res.json({
    clarity: resonanceVector.x,
    coherence: resonanceVector.y,
    resonance: resonanceVector.z,
    sovereignty: resonanceVector.w,
    fieldDynamics: {
      fieldStrength: fieldDynamics.fieldStrength,
      stability: fieldDynamics.stability,
      coherence: fieldDynamics.coherence
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /field/status
 * Returns service uptime and active fields
 */
app.get('/field/status', (req, res) => {
  const uptime = Math.floor((Date.now() - SERVICE_START_TIME) / 1000);
  const activeFields = Object.keys(fieldCache).length;

  return res.json({
    status: 'operational',
    service: 'rbi-architecture-service',
    version: '1.1.0-service',
    uptime: {
      seconds: uptime,
      formatted: formatUptime(uptime)
    },
    activeFields: activeFields,
    cacheSize: activeFields,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /field/validate
 * Runs Proof-of-Meaning verification
 */
app.post('/field/validate', asyncHandler(async (req, res) => {
  const { content, orbAssociations = [] } = req.body;

  if (!content) {
    return res.status(400).json({
      error: 'Invalid request. Content is required'
    });
  }

  // Use FieldValidation layer
  const verification = FieldValidation.verifyConsciousness(content, orbAssociations);

  // Get enhanced analysis for full context
  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  const analysis = await engine.analyzeContentWithMathematics(content);

  return res.json({
    verified: verification.verified,
    confidence: verification.confidence,
    mathematicalProof: verification.mathematicalProof,
    resonanceVector: analysis.mathematical.resonanceVector,
    fieldDynamics: analysis.mathematical.fieldDynamics,
    sovereignLogic: {
      validity: analysis.mathematical.sovereignLogic.validity,
      coherence: analysis.mathematical.sovereignLogic.coherence,
      sovereignty: analysis.mathematical.sovereignLogic.sovereignty
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * Helper function to format uptime
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Error handling middleware (must be last)
app.use(errorHandler);

// Start temporal continuity loop
startTemporalLoop(fieldCache);

// Start server
app.listen(PORT, () => {
  console.log(`🌀 RBI Architecture Service v1.1.0-service`);
  console.log(`📡 Running on http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`📊 Status: http://localhost:${PORT}/field/status`);
  console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
  console.log(`🎯 Score: http://localhost:${PORT}/field/score`);
  console.log(`✅ Validate: http://localhost:${PORT}/field/validate`);
  console.log(`🔐 API Key: ${process.env.RBI_API_KEY ? 'Configured' : 'Not configured (development mode)'}`);
});

