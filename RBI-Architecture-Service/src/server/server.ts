/**
 * RBI Architecture Service
 * 
 * Continuously running coherence architecture service
 * Provides field-level coherence computation accessible to all connected systems
 */

import express from 'express';
import dotenv from 'dotenv';
import { FieldComputation, FieldValidation, Mathematics, KernelManifest } from '../kernel.js';
import {
  validateBoundaries,
  type BoundaryValidationResult
} from '../field/validation/boundary-validator.js';
import {
  registerValidator,
  getValidatorsByDomain,
  FinanceValidator,
  CybersecurityValidator,
  AIPlatformsValidator
} from '../field/validation/validators/index.js';
import { analyzeTimeSeries, type TimePoint } from '../field/temporal/index.js';
import { analyzeGlobalField, type MultiInputItem } from '../field/computation/global-field.js';
import { FieldPropagationEngine } from '../field/propagation/propagation-engine.js';
import { StabilizationEngine } from '../field/stabilization/stabilization-engine.js';
import { baselineManager, type Baseline } from './baseline/baseline-manager.js';
import type { ResonanceVector, NeighborSearchParams } from '../types.js';
import { startTemporalLoop } from './orchestration/temporal-loop.js';
import { AlertManager } from './orchestration/alert-manager.js';
import { MonitoringEngine } from './orchestration/monitoring-engine.js';
import { authenticateApiKey } from './middleware/auth.js';
import { rateLimit, getRateLimitStats } from './middleware/rate-limit.js';
import { coherenceRateLimit, getCoherenceRateLimitStats } from './middleware/coherence-rate-limit.js';
import { requestLogger, getMetrics, Logger } from './middleware/logging.js';
import { errorHandler, asyncHandler, Errors } from './middleware/error-handler.js';
import { boundaryEnforcement } from './middleware/boundary-enforcement.js';
import { preValidation } from './middleware/pre-validation.js';
import { fastPathValidate } from './middleware/fast-path-validator.js';
import { createFieldCache, type FieldCacheEntry } from './cache/lru-cache.js';
import { CostTracker } from './cost/cost-tracker.js';
import { CostAnalytics } from './cost/cost-analytics.js';
import { OptimizationEngine } from './cost/optimization-engine.js';
import { parseJSON, jsonToContentMetadata } from '../metadata/json-metadata.js';
import { 
  parseCodebaseStructure, 
  parseDependencies, 
  detectPatterns, 
  calculateMetrics, 
  parseRelationships,
  codebaseToContentMetadata 
} from '../metadata/codebase-metadata.js';
import type { ContentMetadata } from '../field/computation/enhanced-engine.js';
import { detectAndParseJSON as detectAndParseJSONUtil } from './utils/content-detector.js';

dotenv.config();

const app = express();

// CORS middleware - allow all origins for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

// Serve static files (UI) - before auth middleware
app.use(express.static('public'));

// Serve demo files for testing
app.use('/demos', express.static('tests/sandbox/demos'));

// Register domain-specific boundary validators
registerValidator(new FinanceValidator());
registerValidator(new CybersecurityValidator());
registerValidator(new AIPlatformsValidator());

// Middleware
app.use(requestLogger);

// Cost tracking middleware (after logger to reuse timings)
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const domainFromBody =
      req.body && typeof req.body === 'object' && typeof req.body.domain === 'string'
        ? req.body.domain
        : undefined;

    costTracker.record({
      endpoint: req.path,
      timestamp: Date.now(),
      durationMs: duration,
      computeUnits: Math.max(1, Math.round(duration / 750)),
      domain: domainFromBody
    });
  });

  next();
});
app.use(authenticateApiKey);
app.use(rateLimit);
app.use(coherenceRateLimit);
app.use(preValidation); // Pre-validation before enforcement
app.use(boundaryEnforcement); // Boundary enforcement

const PORT = process.env.PORT || 3001;
const SERVICE_START_TIME = Date.now();

// Field coherence cache with LRU and TTL
const CACHE_MAX_SIZE = parseInt(process.env.CACHE_MAX_SIZE || '1000', 10);
const CACHE_TTL = parseInt(process.env.FIELD_CACHE_MAX_AGE || '3600000', 10); // 1 hour default
const fieldCache = createFieldCache(CACHE_MAX_SIZE, CACHE_TTL);
const propagationEngine = new FieldPropagationEngine();
const stabilizationEngine = new StabilizationEngine();
const alertManager = new AlertManager();
const monitoringEngine = new MonitoringEngine(alertManager);
const costTracker = new CostTracker();
const costAnalytics = new CostAnalytics(costTracker);
const optimizationEngine = new OptimizationEngine();

// Clean expired cache entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleaned = fieldCache.cleanExpired();
    if (cleaned > 0) {
      Logger.debug(`Cleaned ${cleaned} expired cache entries`);
    }
  }, 5 * 60 * 1000);
}

// Use shared utility for JSON detection
const detectAndParseJSON = detectAndParseJSONUtil;

/**
 * GET /health
 * Health check endpoint (no auth required)
 * Enhanced with dependency checks
 */
app.get('/health', (req, res) => {
  const checks: Record<string, { status: string; message?: string }> = {
    service: { status: 'healthy' },
    cache: { status: 'operational' },
    temporalLoop: { status: 'active' }
  };

  // Check cache health
  const cacheMetrics = fieldCache.getMetrics();
  if (cacheMetrics.size > cacheMetrics.maxSize * 0.95) {
    checks.cache = { status: 'warning', message: 'Cache near capacity' };
  }

  const allHealthy = Object.values(checks).every(check => check.status === 'healthy' || check.status === 'operational' || check.status === 'active');
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    service: 'rbi-architecture-service',
    version: '2.0.0',
    checks,
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

app.get('/cost/analytics', (req, res) => {
  const summary = costAnalytics.summary();
  const insights = costAnalytics.buildInsights();
  res.json({
    summary,
    insights,
    timestamp: new Date().toISOString()
  });
});

app.get('/cost/recommendations', (req, res) => {
  const insights = costAnalytics.buildInsights();
  const recommendations = optimizationEngine.buildRecommendations(insights);
  res.json({
    recommendations,
    timestamp: new Date().toISOString()
  });
});

app.get('/rate-limit/analytics', (req, res) => {
  res.json({
    basic: getRateLimitStats(),
    coherence: getCoherenceRateLimitStats(),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /monitoring/status
 * Returns aggregated monitoring status
 */
app.get('/monitoring/status', (req, res) => {
  const status = monitoringEngine.getStatus();
  res.json({
    ...status,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /monitoring/alerts
 */
app.get('/monitoring/alerts', (req, res) => {
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
  const alerts = monitoringEngine.getAlerts(limit);
  res.json({
    alerts,
    count: alerts.length,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /monitoring/alerts/:id/ack
 */
app.post('/monitoring/alerts/:id/ack', (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw Errors.badRequest('alert id required', undefined, req.headers['x-request-id'] as string);
  }

  monitoringEngine.acknowledgeAlert(id);
  res.json({
    acknowledged: true,
    id,
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
  let jsonSchema: any = undefined;

  if (vector && typeof vector.x === 'number') {
    // Direct vector provided
    resonanceVector = vector;
  } else if (signature) {
    // Signature provided, convert to vector
    resonanceVector = Mathematics.ResonanceVectorMath.signatureToVector(signature);
  } else if (content) {
    // Layer 1 (Representation): Detect and parse JSON if present
    const parsed = detectAndParseJSON(content);
    
    // Content provided, analyze and generate vector
    const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
    const analysis = await engine.analyzeContentWithMathematics(
      parsed.contentString, 
      undefined, 
      parsed.metadata
    );
    resonanceVector = analysis.mathematical.resonanceVector;
    jsonSchema = parsed.jsonSchema;
  } else {
    throw Errors.badRequest('Provide content, vector, or signature', undefined, req.headers['x-request-id'] as string);
  }

  // Calculate field dynamics
  const fieldDynamics = Mathematics.ResonanceVectorMath.calculateFieldDynamics(
    resonanceVector,
    []
  );

  // Cache the result using LRU cache
  // Use parsed content string for cache key to handle JSON consistently
  const cacheKey = (content && typeof content === 'object' ? JSON.stringify(content) : content) || JSON.stringify(vector || signature);
  const cached = fieldCache.get(cacheKey);
  
  if (cached) {
    Logger.debug('Cache hit for field score', { cacheKey: cacheKey.substring(0, 50) }, req);
    return res.json({
      clarity: cached.vector.x,
      coherence: cached.vector.y,
      resonance: cached.vector.z,
      sovereignty: cached.vector.w,
      fieldDynamics: {
        fieldStrength: Mathematics.ResonanceVectorMath.calculateFieldDynamics(cached.vector, []).fieldStrength,
        stability: Mathematics.ResonanceVectorMath.calculateFieldDynamics(cached.vector, []).stability,
        coherence: cached.coherence
      },
      ...(jsonSchema && { jsonSchema }),
      timestamp: new Date().toISOString(),
      cached: true
    });
  }

  Logger.debug('Cache miss for field score', { cacheKey: cacheKey.substring(0, 50) }, req);
  fieldCache.set(cacheKey, {
    vector: resonanceVector,
    coherence: fieldDynamics.coherence
  });

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
    ...(jsonSchema && { jsonSchema }),
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /field/status
 * Returns service uptime and active fields with cache metrics
 */
app.get('/field/status', (req, res) => {
  const uptime = Math.floor((Date.now() - SERVICE_START_TIME) / 1000);
  const cacheMetrics = fieldCache.getMetrics();

  return res.json({
    status: 'operational',
    service: 'rbi-architecture-service',
    version: '2.0.0',
    uptime: {
      seconds: uptime,
      formatted: formatUptime(uptime)
    },
    activeFields: cacheMetrics.size,
    cache: {
      size: cacheMetrics.size,
      maxSize: cacheMetrics.maxSize,
      hitRate: cacheMetrics.hitRate,
      hits: cacheMetrics.hits,
      misses: cacheMetrics.misses,
      evictions: cacheMetrics.evictions
    },
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
  const { content, categoryAssociations = [], orbAssociations = [], boundaries, domain } = req.body;

  if (!content) {
    throw Errors.badRequest('Content is required', undefined, req.headers['x-request-id'] as string);
  }

  // Layer 1 (Representation): Detect and parse JSON if present
  const parsed = detectAndParseJSON(content);
  const contentString = parsed.contentString;
  // Get content as object for boundary validation (if it was originally an object or JSON string)
  const contentObject = (typeof content === 'object' && content !== null) 
    ? content 
    : (parsed.isJSON ? JSON.parse(contentString) : undefined);

  // Support both categoryAssociations (generic) and orbAssociations (S2S-specific)
  // orbAssociations is maintained for backward compatibility with S2S systems
  const associations = categoryAssociations.length > 0 ? categoryAssociations : orbAssociations;

  // Use FieldValidation layer
  const verification = FieldValidation.verifyConsciousness(contentString, associations);

  // Enhance decision trail with JSON schema info if available
  if (verification.decisionTrail && parsed.jsonSchema) {
    verification.decisionTrail.metadata.hasSchema = true;
  }

  // Get enhanced analysis for full context
  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  // Merge JSON metadata with category associations
  const metadata: FieldComputation.ContentMetadata | undefined = {
    ...parsed.metadata,
    ...(associations.length > 0 ? { orb_associations: associations } : {})
  };
  const analysis = await engine.analyzeContentWithMathematics(contentString, undefined, metadata);

  // Boundary validation (if boundaries provided)
  let boundaryValidation: BoundaryValidationResult | undefined = undefined;
  if (boundaries && contentObject && domain) {
    // Get validator for the domain
    const validators = getValidatorsByDomain(domain);
    
    if (validators.length > 0) {
      // Use first validator for the domain
      const validator = validators[0];
      const originalCoherence = analysis.mathematical.sovereignLogic.coherence;
      boundaryValidation = validator.validate(contentObject, boundaries, originalCoherence);
      
      // Update decision trail with boundary validation
      if (verification.decisionTrail) {
        verification.decisionTrail.validationRules.push({
          rule: 'boundary_validation',
          applied: true,
          weight: 0.3,
          result: boundaryValidation.valid ? 'passed' : 'failed'
        });
        
        // Add boundary violations to reasoning path
        if (boundaryValidation.violations.length > 0) {
          verification.decisionTrail.reasoningPath.push({
            step: 'boundary_validation',
            input: { domain, boundaries },
            output: { violations: boundaryValidation.violations.length, valid: boundaryValidation.valid },
            rule: 'boundary_check'
          });
        }
      }
    }
  }

  // Use adjusted coherence if boundary validation was performed
  const finalCoherence = boundaryValidation 
    ? boundaryValidation.adjustedCoherence 
    : analysis.mathematical.sovereignLogic.coherence;

  const responsePayload = {
    verified: verification.verified && (boundaryValidation ? boundaryValidation.valid : true),
    confidence: verification.confidence,
    mathematicalProof: verification.mathematicalProof,
    decisionTrail: verification.decisionTrail,
    resonanceVector: analysis.mathematical.resonanceVector,
    fieldDynamics: analysis.mathematical.fieldDynamics,
    sovereignLogic: {
      validity: analysis.mathematical.sovereignLogic.validity,
      coherence: finalCoherence,
      sovereignty: analysis.mathematical.sovereignLogic.sovereignty
    },
    ...(boundaryValidation && {
      boundaryValidation: {
        valid: boundaryValidation.valid,
        violations: boundaryValidation.violations,
        originalCoherence: boundaryValidation.originalCoherence,
        adjustedCoherence: boundaryValidation.adjustedCoherence
      }
    }),
    ...(parsed.jsonSchema && { jsonSchema: parsed.jsonSchema }),
    timestamp: new Date().toISOString()
  };

  res.locals.coherenceScore = finalCoherence;

  monitoringEngine.record({
    timestamp: Date.now(),
    coherence: finalCoherence,
    domain: domain || 'generic',
    requestId: (req.headers['x-request-id'] as string) || undefined
  });

  return res.json(responsePayload);
}));

/**
 * POST /field/propagate
 * Runs field propagation strategies (diffusion, wave)
 */
app.post('/field/propagate', asyncHandler(async (req, res) => {
  const { nodes, relationships = [], seedValues = {}, strategy = 'diffusion', config } = req.body;

  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw Errors.badRequest(
      'nodes array is required with at least one entry',
      undefined,
      req.headers['x-request-id'] as string
    );
  }

  if (strategy !== 'diffusion' && strategy !== 'wave') {
    throw Errors.badRequest(
      'strategy must be either "diffusion" or "wave"',
      undefined,
      req.headers['x-request-id'] as string
    );
  }

  const response = propagationEngine.propagate({
    nodes,
    relationships: Array.isArray(relationships) ? relationships : [],
    seedValues: typeof seedValues === 'object' && seedValues !== null ? seedValues : {},
    strategy,
    config
  });

  return res.json({
    strategy: response.result.strategy,
    graph: response.graph,
    ...(response.result.strategy === 'diffusion'
      ? {
          iterations: response.result.iterations,
          nodeValues: response.result.nodeValues,
          steps: response.result.steps
        }
      : {
          maxDepthReached: (response.result as any).maxDepthReached,
          nodeValues: response.result.nodeValues,
          steps: response.result.steps
        }),
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /field/stabilize
 * Runs adaptive stabilization and drift correction
 */
app.post('/field/stabilize', asyncHandler(async (req, res) => {
  const { history, thresholds = [], sensitivity } = req.body;

  if (!Array.isArray(history) || history.length === 0) {
    throw Errors.badRequest(
      'history array with timestamp + coherence is required',
      undefined,
      req.headers['x-request-id'] as string
    );
  }

  const normalizedHistory = history.map((point: any) => {
    if (typeof point !== 'object' || point === null) {
      throw Errors.badRequest(
        'history points must be objects with timestamp and coherence',
        undefined,
        req.headers['x-request-id'] as string
      );
    }
    if (typeof point.timestamp !== 'number' || typeof point.coherence !== 'number') {
      throw Errors.badRequest(
        'history points require numeric timestamp and coherence',
        undefined,
        req.headers['x-request-id'] as string
      );
    }
    return {
      timestamp: point.timestamp,
      coherence: point.coherence,
      resonance: typeof point.resonance === 'number' ? point.resonance : undefined,
      sovereignty: typeof point.sovereignty === 'number' ? point.sovereignty : undefined
    };
  });

  const normalizedThresholds = Array.isArray(thresholds)
    ? thresholds.map((threshold: any) => ({
        metric: String(threshold.metric || 'coherence'),
        current: typeof threshold.current === 'number' ? threshold.current : 0.8,
        min: typeof threshold.min === 'number' ? threshold.min : 0,
        max: typeof threshold.max === 'number' ? threshold.max : 1,
        recommended: typeof threshold.recommended === 'number' ? threshold.recommended : threshold.current,
        confidence: typeof threshold.confidence === 'number' ? threshold.confidence : 0.5
      }))
    : [];

  const result = stabilizationEngine.stabilize({
    history: normalizedHistory,
    thresholds: normalizedThresholds,
    sensitivity
  });

  return res.json({
    drift: result.drift,
    thresholds: result.thresholds,
    adjustments: result.adjustments,
    recommendations: result.recommendations,
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /field/enforce
 * Standalone boundary enforcement endpoint
 * 
 * Performs boundary validation and returns enforcement result.
 * Does not perform full Proof-of-Meaning validation.
 */
app.post('/field/enforce', asyncHandler(async (req, res) => {
  const { content, boundaries, domain } = req.body;

  if (!content || !boundaries || !domain) {
    throw Errors.badRequest(
      'content, boundaries, and domain are required',
      undefined,
      req.headers['x-request-id'] as string
    );
  }

  // Get content as object
  const contentObject = (typeof content === 'object' && content !== null) 
    ? content 
    : (typeof content === 'string' ? JSON.parse(content) : undefined);

  if (!contentObject) {
    throw Errors.badRequest(
      'content must be a valid object or JSON string',
      undefined,
      req.headers['x-request-id'] as string
    );
  }

  // Fast-path validation
  const result = fastPathValidate(contentObject, boundaries, domain);

  return res.json({
    enforced: result.valid,
    violations: result.violations || [],
    coherence: result.coherence,
    reason: result.reason,
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /field/pre-validate
 * Pre-validation endpoint
 * 
 * Performs lightweight validation checks before full processing.
 * Useful for quick validation without full coherence calculation.
 */
app.post('/field/pre-validate', asyncHandler(async (req, res) => {
  const { content, boundaries, domain } = req.body;

  if (!content) {
    throw Errors.badRequest(
      'content is required',
      undefined,
      req.headers['x-request-id'] as string
    );
  }

  // Import pre-validation function
  const { preValidate } = await import('./middleware/pre-validation.js');
  const result = preValidate(content, boundaries, domain);

  return res.json({
    valid: result.valid,
    reason: result.reason,
    warnings: result.warnings || [],
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
    throw Errors.badRequest('Provide query and candidates array', undefined, req.headers['x-request-id'] as string);
  }

  // Layer 1 (Representation): Detect and parse JSON in query if present
  let searchQuery = query;
  if (query.text && !query.resonanceVector) {
    const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
    const parsed = detectAndParseJSON(query.text);
    const analysis = await engine.analyzeContentWithMathematics(parsed.contentString, undefined, parsed.metadata);
    searchQuery = {
      ...query,
      resonanceVector: analysis.mathematical.resonanceVector
    };
  }

  // Convert text/JSON candidates to resonance vectors if needed
  const processedCandidates = await Promise.all(
    candidates.map(async (candidate: any) => {
      if (candidate.text && !candidate.resonanceVector) {
        const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
        const parsed = detectAndParseJSON(candidate.text);
        const analysis = await engine.analyzeContentWithMathematics(parsed.contentString, undefined, parsed.metadata);
        return {
          ...candidate,
          resonanceVector: analysis.mathematical.resonanceVector,
          ...(parsed.jsonSchema && { jsonSchema: parsed.jsonSchema })
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
    throw Errors.badRequest('Content is required', undefined, req.headers['x-request-id'] as string);
  }

  // Layer 1 (Representation): Detect and parse JSON if present
  const parsed = detectAndParseJSON(content);

  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  const analysis = await engine.analyzeContentWithMathematics(parsed.contentString, title, parsed.metadata);

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
    ...(parsed.jsonSchema && { jsonSchema: parsed.jsonSchema }),
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /field/analyze/codebase
 * Codebase analysis endpoint
 * 
 * Layer 1 (Representation): Parses codebase structure, dependencies, patterns
 * Layer 2 (Computation): Analyzes code coherence through RBI resonance engine
 * 
 * Accepts codebase structure and analyzes it for:
 * - Architectural patterns
 * - Design patterns
 * - Dependencies (external, internal, frameworks)
 * - Code metrics (complexity, test coverage, documentation)
 * - Import/export relationships
 */
app.post('/field/analyze/codebase', asyncHandler(async (req, res) => {
  const { codebase } = req.body;

  if (!codebase) {
    throw Errors.badRequest('Codebase structure is required', undefined, req.headers['x-request-id'] as string);
  }

  // Layer 1 (Representation): Parse codebase structure
  const structure = codebase.fileTree 
    ? parseCodebaseStructure(codebase.fileTree)
    : undefined;
  
  const dependencies = codebase.packageFiles
    ? parseDependencies(codebase.packageFiles)
    : undefined;
  
  const patterns = codebase.codeFiles
    ? detectPatterns(codebase.codeFiles)
    : undefined;
  
  const metrics = codebase.codeFiles
    ? calculateMetrics(codebase.codeFiles)
    : undefined;
  
  const relationships = codebase.codeFiles
    ? parseRelationships(codebase.codeFiles)
    : undefined;

  // Convert to ContentMetadata for RBI analysis
  const codebaseMetadata = {
    codebase_structure: structure,
    dependencies,
    patterns,
    metrics,
    relationships
  };
  
  const metadata = codebaseToContentMetadata(codebaseMetadata);

  // Layer 2 (Computation): Analyze codebase through RBI resonance engine
  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  const codebaseString = JSON.stringify({
    structure,
    dependencies,
    patterns,
    metrics,
    relationships
  });
  
  const analysis = await engine.analyzeContentWithMathematics(codebaseString, 'Codebase Analysis', metadata);

  return res.json({
    overallScore: analysis.overall_score,
    signature: {
      clarity: analysis.signature.clarity,
      coherence: analysis.signature.coherence,
      resonance: analysis.signature.resonance,
      sovereignty: analysis.signature.sovereignty
    },
    resonanceVector: analysis.mathematical.resonanceVector,
    fieldDynamics: analysis.mathematical.fieldDynamics,
    codebase: {
      structure,
      dependencies,
      patterns,
      metrics,
      relationships
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /field/analyze/timeseries
 * Analyze time-series data through RBI's field computation
 * 
 * Architecture Layer: 3 (Temporal Continuity)
 * 
 * Processes multiple time points globally (non-linear) to detect trends,
 * drift, and stability patterns over time.
 * 
 * Request body:
 * {
 *   "timePoints": [
 *     { "timestamp": "2024-01-01T00:00:00Z", "data": {...} },
 *     { "timestamp": "2024-01-02T00:00:00Z", "data": {...} }
 *   ],
 *   "baseline": { "x": 0.5, "y": 0.5, "z": 0.5, "w": 0.5 } // Optional
 * }
 * 
 * Useful for:
 * - Detecting drift from baseline patterns
 * - Identifying trends in data over time
 * - Monitoring stability and consistency
 * - Time-series anomaly detection
 */
app.post('/field/analyze/timeseries', asyncHandler(async (req, res) => {
  const { timePoints, baseline } = req.body;

  if (!timePoints || !Array.isArray(timePoints) || timePoints.length === 0) {
    throw Errors.badRequest(
      'timePoints array is required and must not be empty',
      undefined,
      req.headers['x-request-id'] as string
    );
  }

  // Validate time points structure
  const validTimePoints: TimePoint[] = timePoints.map((point: any, idx: number) => {
    if (!point.timestamp || !point.data) {
      throw Errors.badRequest(
        `Time point at index ${idx} must have timestamp and data`,
        undefined,
        req.headers['x-request-id'] as string
      );
    }
    return {
      timestamp: point.timestamp,
      data: point.data,
      metadata: point.metadata
    };
  });

  // Parse baseline if provided
  let baselineVector: ResonanceVector | undefined;
  if (baseline) {
    if (typeof baseline.x === 'number' && 
        typeof baseline.y === 'number' && 
        typeof baseline.z === 'number' && 
        typeof baseline.w === 'number') {
      baselineVector = baseline;
    } else if (baseline.signature) {
      baselineVector = Mathematics.ResonanceVectorMath.signatureToVector(baseline.signature);
    } else {
      throw Errors.badRequest(
        'Baseline must be a resonance vector or signature',
        undefined,
        req.headers['x-request-id'] as string
      );
    }
  }

  // Layer 3 (Temporal Continuity): Analyze time-series
  const analysis = await analyzeTimeSeries(validTimePoints, baselineVector);

  return res.json({
    trend: analysis.trend,
    drift: analysis.drift,
    stability: analysis.stability,
    fieldDynamics: {
      average: analysis.fieldDynamics.average,
      range: analysis.fieldDynamics.range,
      evolution: analysis.fieldDynamics.evolution
    },
    resonanceVectors: analysis.resonanceVectors,
    coherence: analysis.coherence,
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /field/batch
 * Process multiple items in parallel (batch operations)
 * 
 * Architecture Layer: 2 (Computation) + Layer 1 (Representation)
 * 
 * Processes an array of items in parallel, applying RBI analysis to each.
 * Useful for bulk processing, parallel computation, and efficient handling
 * of multiple inputs.
 * 
 * Request body:
 * {
 *   "items": [
 *     { "content": "...", "title": "Item 1" },
 *     { "content": {...}, "title": "Item 2" },
 *     { "content": "...", "title": "Item 3" }
 *   ],
 *   "operation": "analyze" | "validate" | "score" | "vector" // Default: "analyze"
 * }
 * 
 * Response:
 * {
 *   "results": [
 *     { "index": 0, "result": {...}, "error": null },
 *     { "index": 1, "result": {...}, "error": null }
 *   ],
 *   "summary": {
 *     "total": 3,
 *     "successful": 3,
 *     "failed": 0
 *   }
 * }
 */
app.post('/field/batch', asyncHandler(async (req, res) => {
  const { items, operation = 'analyze' } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw Errors.badRequest(
      'items array is required and must not be empty',
      undefined,
      req.headers['x-request-id'] as string
    );
  }

  // No hard limit for self-hosted deployments
  // Resource constraints will naturally limit processing capacity
  // Operational scaffolding and system administration will handle limits when deployed as a service

  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  const results = await Promise.all(
    items.map(async (item: any, index: number) => {
      try {
        if (!item.content) {
          throw new Error('Item must have content');
        }

        const parsed = detectAndParseJSON(item.content);
        let result: any;

        switch (operation) {
          case 'analyze': {
            const analysis = await engine.analyzeContentWithMathematics(
              parsed.contentString,
              item.title,
              parsed.metadata
            );
            result = {
              overallScore: analysis.overall_score,
              signature: analysis.signature,
              resonanceVector: analysis.mathematical.resonanceVector,
              fieldDynamics: analysis.mathematical.fieldDynamics,
              ...(parsed.jsonSchema && { jsonSchema: parsed.jsonSchema })
            };
            break;
          }

          case 'validate': {
            const associations = item.categoryAssociations || item.orbAssociations || [];
            const verification = FieldValidation.verifyConsciousness(parsed.contentString, associations);
            
            // Enhance decision trail with JSON schema info if available
            if (verification.decisionTrail && parsed.jsonSchema) {
              verification.decisionTrail.metadata.hasSchema = true;
            }
            
            const analysis = await engine.analyzeContentWithMathematics(
              parsed.contentString,
              item.title,
              {
                ...parsed.metadata,
                ...(associations.length > 0 ? { orb_associations: associations } : {})
              }
            );
            result = {
              verified: verification.verified,
              confidence: verification.confidence,
              decisionTrail: verification.decisionTrail,
              signature: analysis.signature,
              resonanceVector: analysis.mathematical.resonanceVector,
              fieldDynamics: analysis.mathematical.fieldDynamics,
              ...(parsed.jsonSchema && { jsonSchema: parsed.jsonSchema })
            };
            break;
          }

          case 'score': {
            const analysis = await engine.analyzeContentWithMathematics(
              parsed.contentString,
              item.title,
              parsed.metadata
            );
            const fieldDynamics = Mathematics.ResonanceVectorMath.calculateFieldDynamics(
              analysis.mathematical.resonanceVector,
              analysis.orb_associations || []
            );
            result = {
              clarity: analysis.mathematical.resonanceVector.x,
              coherence: analysis.mathematical.resonanceVector.y,
              resonance: analysis.mathematical.resonanceVector.z,
              sovereignty: analysis.mathematical.resonanceVector.w,
              fieldDynamics,
              ...(parsed.jsonSchema && { jsonSchema: parsed.jsonSchema })
            };
            break;
          }

          case 'vector': {
            const analysis = await engine.analyzeContentWithMathematics(
              parsed.contentString,
              item.title,
              parsed.metadata
            );
            result = {
              resonanceVector: analysis.mathematical.resonanceVector,
              fieldDynamics: analysis.mathematical.fieldDynamics,
              ...(parsed.jsonSchema && { jsonSchema: parsed.jsonSchema })
            };
            break;
          }

          default:
            throw new Error(`Unknown operation: ${operation}`);
        }

        return {
          index,
          result,
          error: null
        };
      } catch (error: any) {
        return {
          index,
          result: null,
          error: error.message || 'Unknown error'
        };
      }
    })
  );

  const successful = results.filter(r => r.error === null).length;
  const failed = results.length - successful;

  return res.json({
    results,
    summary: {
      total: items.length,
      successful,
      failed
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /field/analyze/multi-input
 * Process multiple diverse inputs globally (non-linear field computation)
 * 
 * Architecture Layer: 2 (Computation) + Layer 1 (Representation)
 * 
 * Processes multiple diverse inputs (JSON, code, text) simultaneously
 * in a global, non-linear field computation. All inputs are considered
 * together to compute global coherence, not processed linearly.
 * 
 * This is different from batch operations:
 * - Batch: Processes items independently in parallel
 * - Multi-input: Processes all items together in a single global field computation
 * 
 * Request body:
 * {
 *   "inputs": [
 *     { "content": {...}, "title": "JSON Data" },
 *     { "content": "code here", "title": "Code Snippet" },
 *     { "content": "text here", "title": "Document" }
 *   ]
 * }
 * 
 * Response includes:
 * - Individual analysis for each input
 * - Global field metrics computed from all inputs together
 * - Coherence matrix showing relationships between all inputs
 * 
 * Useful for:
 * - Processing diverse data types together (JSON + code + text)
 * - Computing global coherence across multiple sources
 * - Multi-layered, non-linear analysis
 */
app.post('/field/analyze/multi-input', asyncHandler(async (req, res) => {
  const { inputs } = req.body;

  if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
    throw Errors.badRequest(
      'inputs array is required and must not be empty',
      undefined,
      req.headers['x-request-id'] as string
    );
  }

  // No hard limit for self-hosted deployments
  // Resource constraints will naturally limit processing capacity
  // Operational scaffolding and system administration will handle limits when deployed as a service

  // Validate inputs structure
  const validInputs: MultiInputItem[] = inputs.map((input: any, idx: number) => {
    if (input.content === undefined && input.content === null) {
      throw Errors.badRequest(
        `Input at index ${idx} must have content`,
        undefined,
        req.headers['x-request-id'] as string
      );
    }
    return {
      content: input.content,
      title: input.title,
      metadata: input.metadata
    };
  });

  // Layer 2 (Computation): Analyze global field from all inputs together
  const analysis = await analyzeGlobalField(validInputs);

  return res.json({
    individual: analysis.individual.map(item => ({
      index: item.index,
      title: item.title,
      overallScore: item.analysis.overall_score,
      signature: item.analysis.signature,
      resonanceVector: item.resonanceVector,
      fieldDynamics: item.fieldDynamics
    })),
    global: {
      averageVector: analysis.global.averageVector,
      fieldDynamics: analysis.global.fieldDynamics,
      coherenceMatrix: analysis.global.coherenceMatrix,
      fieldStrength: analysis.global.fieldStrength,
      stability: analysis.global.stability,
      orbAssociations: analysis.global.orbAssociations
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
    throw Errors.badRequest('Content is required', undefined, req.headers['x-request-id'] as string);
  }

  // Layer 1 (Representation): Detect and parse JSON if present
  const parsed = detectAndParseJSON(content);

  const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
  const analysis = await engine.analyzeContentWithMathematics(parsed.contentString, title, parsed.metadata);
  const fieldDynamics = Mathematics.ResonanceVectorMath.calculateFieldDynamics(
    analysis.mathematical.resonanceVector,
    analysis.orb_associations || []
  );
  
  Logger.debug('Vector conversion completed', { 
    contentLength: content.length 
  }, req);

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
 * POST /field/baseline
 * Store a baseline resonance vector or signature
 * 
 * Architecture Layer: 3 (Temporal Continuity)
 * 
 * Request body:
 * {
 *   "id": "baseline-1",
 *   "name": "Character Spec Baseline",
 *   "resonanceVector": { "x": 0.5, "y": 0.5, "z": 0.5, "w": 0.5 },
 *   "signature": { "clarity": 0.5, "coherence": 0.5, "resonance": 0.5, "sovereignty": 0.5 },
 *   "metadata": { "description": "...", "category": "...", "tags": [...] }
 * }
 */
app.post('/field/baseline', asyncHandler(async (req, res) => {
  const { id, name, resonanceVector, signature, metadata } = req.body;

  if (!id || !name) {
    throw Errors.badRequest('id and name are required', undefined, req.headers['x-request-id'] as string);
  }

  // Convert signature to vector if provided
  let vector: ResonanceVector;
  if (resonanceVector && typeof resonanceVector.x === 'number') {
    vector = resonanceVector;
  } else if (signature) {
    vector = Mathematics.ResonanceVectorMath.signatureToVector(signature);
  } else {
    throw Errors.badRequest('resonanceVector or signature is required', undefined, req.headers['x-request-id'] as string);
  }

  const baseline: Baseline = {
    id,
    name,
    resonanceVector: vector,
    signature,
    metadata
  };

  baselineManager.store(baseline);

  return res.json({
    id: baseline.id,
    name: baseline.name,
    resonanceVector: baseline.resonanceVector,
    signature: baseline.signature,
    metadata: baseline.metadata,
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /field/baseline/:id
 * Retrieve a baseline by ID
 */
app.get('/field/baseline/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const baseline = baselineManager.retrieve(id);

  if (!baseline) {
    throw Errors.notFound(`Baseline ${id} not found`, req.headers['x-request-id'] as string);
  }

  return res.json({
    id: baseline.id,
    name: baseline.name,
    resonanceVector: baseline.resonanceVector,
    signature: baseline.signature,
    metadata: baseline.metadata,
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /field/baseline
 * List all baselines (optionally filtered)
 * 
 * Query params:
 * - name: filter by name (partial match)
 * - category: filter by category
 * - tag: filter by tag
 */
app.get('/field/baseline', asyncHandler(async (req, res) => {
  const { name, category, tag } = req.query;

  const baselines = baselineManager.search({
    name: name as string,
    category: category as string,
    tag: tag as string
  });

  return res.json({
    baselines: baselines.map(b => ({
      id: b.id,
      name: b.name,
      resonanceVector: b.resonanceVector,
      signature: b.signature,
      metadata: b.metadata
    })),
    count: baselines.length,
    timestamp: new Date().toISOString()
  });
}));

/**
 * DELETE /field/baseline/:id
 * Delete a baseline
 */
app.delete('/field/baseline/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = baselineManager.delete(id);

  if (!deleted) {
    throw Errors.notFound(`Baseline ${id} not found`, req.headers['x-request-id'] as string);
  }

  return res.json({
    id,
    deleted: true,
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /field/baseline/compare
 * Compare current content/vector against a baseline
 * 
 * Request body:
 * {
 *   "baselineId": "baseline-1",
 *   "content": "..." OR "resonanceVector": { ... } OR "signature": { ... }
 * }
 */
app.post('/field/baseline/compare', asyncHandler(async (req, res) => {
  const { baselineId, content, resonanceVector, signature } = req.body;

  if (!baselineId) {
    throw Errors.badRequest('baselineId is required', undefined, req.headers['x-request-id'] as string);
  }

  // Get current vector
  let currentVector: ResonanceVector;
  if (resonanceVector && typeof resonanceVector.x === 'number') {
    currentVector = resonanceVector;
  } else if (signature) {
    currentVector = Mathematics.ResonanceVectorMath.signatureToVector(signature);
  } else if (content) {
    const parsed = detectAndParseJSON(content);
    const engine = FieldComputation.EnhancedResonanceEngine.getInstance();
    const analysis = await engine.analyzeContentWithMathematics(parsed.contentString, undefined, parsed.metadata);
    currentVector = analysis.mathematical.resonanceVector;
  } else {
    throw Errors.badRequest('content, resonanceVector, or signature is required', undefined, req.headers['x-request-id'] as string);
  }

  const comparison = baselineManager.compare(baselineId, currentVector);

  if (!comparison) {
    throw Errors.notFound(`Baseline ${baselineId} not found`, req.headers['x-request-id'] as string);
  }

  return res.json({
    ...comparison,
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
startTemporalLoop(fieldCache, monitoringEngine);

// Export app for Vercel serverless functions
export default app;

// Start server (only in non-Vercel environments)
if (process.env.VERCEL !== '1') {
app.listen(PORT, () => {
  console.log(`🌀 RBI Architecture Service v2.0.0`);
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

