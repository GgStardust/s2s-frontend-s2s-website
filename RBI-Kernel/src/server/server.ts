/**
 * RBI Architecture Service
 * 
 * Continuously running coherence architecture service
 * Provides field-level coherence computation accessible to all connected systems
 */

import express from 'express';
import dotenv from 'dotenv';
import { FieldComputation, FieldValidation, Mathematics, KernelManifest } from '../kernel.js';
import type { ResonanceVector, NeighborSearchParams } from '../types.js';
import { startTemporalLoop } from './orchestration/temporal-loop.js';
import { authenticateApiKey } from './middleware/auth.js';
import { rateLimit } from './middleware/rate-limit.js';
import { requestLogger, getMetrics } from './middleware/logging.js';
import { errorHandler, asyncHandler } from './middleware/error-handler.js';

dotenv.config();

const app = express();
app.use(express.json());

// Serve static files (UI) - before auth middleware
app.use(express.static('public'));

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
    service: 'rbi-kernel',
    version: '2.0.0',
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
    service: 'rbi-kernel',
    version: '2.0.0',
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
 * 
 * Note: categoryAssociations is optional and domain-specific.
 * For S2S projects, this maps to orbAssociations. For other domains,
 * use appropriate category identifiers.
 */
app.post('/field/validate', asyncHandler(async (req, res) => {
  const { content, categoryAssociations = [], orbAssociations = [] } = req.body;

  if (!content) {
    return res.status(400).json({
      error: 'Invalid request. Content is required'
    });
  }

  // Support both categoryAssociations (generic) and orbAssociations (S2S-specific)
  // orbAssociations is maintained for backward compatibility with S2S systems
  const associations = categoryAssociations.length > 0 ? categoryAssociations : orbAssociations;

  // Use FieldValidation layer
  const verification = FieldValidation.verifyConsciousness(content, associations);

  // Get enhanced analysis for full context
  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  const metadata = associations.length > 0 ? { categoryAssociations: associations } : undefined;
  const analysis = await engine.analyzeContentWithMathematics(content, undefined, metadata);

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
 * POST /field/neighbors
 * Find top-N most similar items (similarity search)
 * 
 * Demonstrates neighbor finding capability - useful for:
 * - Fraud detection (find similar transactions)
 * - Content recommendation (find similar content)
 * - Anomaly detection (find similar patterns)
 */
app.post('/field/neighbors', asyncHandler(async (req, res) => {
  const { query, candidates, topN = 10 } = req.body;

  if (!query || !candidates || !Array.isArray(candidates)) {
    return res.status(400).json({
      error: 'Invalid request. Provide query and candidates array'
    });
  }

  // Convert text queries to resonance vectors if needed
  let searchQuery = query;
  if (query.text && !query.resonanceVector) {
    const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
    const analysis = await engine.analyzeContentWithMathematics(query.text);
    searchQuery = {
      ...query,
      resonanceVector: analysis.mathematical.resonanceVector
    };
  }

  // Convert text candidates to resonance vectors if needed
  const processedCandidates = await Promise.all(
    candidates.map(async (candidate: any) => {
      if (candidate.text && !candidate.resonanceVector) {
        const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
        const analysis = await engine.analyzeContentWithMathematics(candidate.text);
        return {
          ...candidate,
          resonanceVector: analysis.mathematical.resonanceVector
        };
      }
      return candidate;
    })
  );

  const searchParams: NeighborSearchParams = {
    query: searchQuery,
    candidates: processedCandidates,
    topN,
    useResonance: true
  };

  const neighbors = FieldComputation.findNeighbors(searchParams);

  return res.json({
    neighbors,
    count: neighbors.length,
    topN,
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /field/analyze
 * Full content analysis with all 5 layers
 * 
 * Demonstrates complete architecture:
 * - Representation layer (input processing)
 * - Computation layer (resonance calculation)
 * - Temporal layer (stability tracking)
 * - Validation layer (Proof-of-Meaning)
 * - Interfaces layer (formatted output)
 */
app.post('/field/analyze', asyncHandler(async (req, res) => {
  const { content, title } = req.body;

  if (!content) {
    return res.status(400).json({
      error: 'Invalid request. Content is required'
    });
  }

  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  const analysis = await engine.analyzeContentWithMathematics(content, title);

  return res.json({
    overallScore: analysis.overall_score,
    signature: {
      clarity: analysis.signature.clarity,
      coherence: analysis.signature.coherence,
      resonance: analysis.signature.resonance,
      sovereignty: analysis.signature.sovereignty
    },
    resonanceVector: analysis.mathematical.resonanceVector,
    harmonicFrequency: analysis.mathematical.harmonicFrequency,
    coherenceMatrix: {
      rank: analysis.mathematical.coherenceMatrix.coherenceRank,
      size: analysis.mathematical.coherenceMatrix.nxn.length,
      eigenvalues: analysis.mathematical.coherenceMatrix.eigenvalues
    },
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
 * POST /field/vector
 * Convert content to 4D resonance vector
 * 
 * Useful for:
 * - Building vector databases
 * - Pre-computing vectors for similarity search
 * - Vector-based operations
 */
app.post('/field/vector', asyncHandler(async (req, res) => {
  const { content, title } = req.body;

  if (!content) {
    return res.status(400).json({
      error: 'Invalid request. Content is required'
    });
  }

  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  const analysis = await engine.analyzeContentWithMathematics(content, title);
  const fieldDynamics = Mathematics.ResonanceVectorMath.calculateFieldDynamics(
    analysis.mathematical.resonanceVector,
    analysis.orb_associations || []
  );

  return res.json({
    vector: analysis.mathematical.resonanceVector,
    fieldDynamics: {
      fieldStrength: fieldDynamics.fieldStrength,
      stability: fieldDynamics.stability,
      coherence: fieldDynamics.coherence,
      gradient: fieldDynamics.gradient
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /architecture/manifest
 * Returns the complete 5-layer architecture manifest
 * 
 * Shows partners the full architecture structure
 */
app.get('/architecture/manifest', (req, res) => {
  return res.json({
    manifest: KernelManifest,
    layers: {
      representation: {
        layer: 1,
        purpose: 'Transforms inputs into multidimensional resonance fields',
        status: 'integrated'
      },
      computation: {
        layer: 2,
        purpose: 'Calculates spatial, temporal, and contextual coherence',
        status: 'fully_implemented',
        endpoints: ['/field/score', '/field/analyze', '/field/neighbors', '/field/vector']
      },
      temporal: {
        layer: 3,
        purpose: 'Maintains adaptive stability over time',
        status: 'active',
        features: ['temporal_continuity_loop', 'drift_detection', 'field_stabilization']
      },
      validation: {
        layer: 4,
        purpose: 'Performs Proof-of-Meaning operations',
        status: 'fully_implemented',
        endpoints: ['/field/validate']
      },
      interfaces: {
        layer: 5,
        purpose: 'Links verified coherence data to external systems',
        status: 'active',
        endpoints: ['/field/score', '/field/validate', '/field/analyze', '/field/neighbors', '/field/vector']
      }
    },
    mathematics: {
      purpose: 'Mathematical foundations for field-level coherence',
      components: ['ResonanceVectorMath', 'SovereignLogic', 'CoherenceMatrix', 'FieldDynamics']
    },
    timestamp: new Date().toISOString()
  });
});

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

// Export app for Vercel serverless functions
export default app;

// Start server (only in non-Vercel environments)
if (process.env.VERCEL !== '1') {
app.listen(PORT, () => {
  console.log(`🌀 RBI Architecture Service v1.1.0-service`);
  console.log(`📡 Running on http://localhost:${PORT}`);
    console.log(`\n📋 Core Endpoints:`);
    console.log(`   💚 Health: http://localhost:${PORT}/health`);
    console.log(`   📊 Status: http://localhost:${PORT}/field/status`);
    console.log(`   📈 Metrics: http://localhost:${PORT}/metrics`);
    console.log(`\n🎯 Field Operations:`);
    console.log(`   🎯 Score: POST http://localhost:${PORT}/field/score`);
    console.log(`   ✅ Validate: POST http://localhost:${PORT}/field/validate`);
    console.log(`   🔍 Neighbors: POST http://localhost:${PORT}/field/neighbors`);
    console.log(`   📊 Analyze: POST http://localhost:${PORT}/field/analyze`);
    console.log(`   📐 Vector: POST http://localhost:${PORT}/field/vector`);
    console.log(`\n🏗️  Architecture:`);
    console.log(`   📖 Manifest: GET http://localhost:${PORT}/architecture/manifest`);
    console.log(`\n🔐 API Key: ${process.env.RBI_API_KEY ? 'Configured' : 'Not configured (development mode)'}`);
});
}

