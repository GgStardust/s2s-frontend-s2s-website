/**
 * Interfaces Layer - Coherence Endpoints
 * 
 * Domain-agnostic API endpoints for coherence verification.
 * Provides generic interfaces that abstract field-level operations.
 * 
 * Architecture Layer: 5 (Interfaces)
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { 
  computeResonanceWithVectors,
  computeResonanceWithOrbs
} from '../../field/computation/coherence-calculator.js';
import { findNeighbors, NeighborSearchParams } from '../../field/computation/field-operators.js';
import { ResonanceVector } from '../../mathematics/resonance-vectors.js';
import { EnhancedResonanceEngine } from '../../field/computation/enhanced-engine.js';
import { SovereignLogic } from '../../mathematics/sovereign-logic.js';
import { ResonanceVectorMath } from '../../mathematics/resonance-vectors.js';
import { ResonanceEngine } from '../../field/computation/resonance-engine.js';

/**
 * Generic 4D Vector Interface
 * Domain-agnostic representation of the 4 dimensions
 */
interface Generic4DVector {
  dimension1: number; // Clarity / Understandability
  dimension2: number; // Coherence / Consistency
  dimension3: number; // Resonance / Alignment
  dimension4: number; // Integrity / Autonomy
}

/**
 * Convert generic 4D vector to ResonanceVector
 */
function toResonanceVector(vec: Generic4DVector): ResonanceVector {
  return {
    x: vec.dimension1,
    y: vec.dimension2,
    z: vec.dimension3,
    w: vec.dimension4
  };
}

/**
 * Convert ResonanceVector to generic 4D vector
 */
function fromResonanceVector(vec: ResonanceVector): Generic4DVector {
  return {
    dimension1: vec.x,
    dimension2: vec.y,
    dimension3: vec.z,
    dimension4: vec.w
  };
}

export async function registerGenericRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/similarity
   * Calculate similarity between two 4D vectors
   */
  fastify.post<{ 
    Body: { 
      vector1: Generic4DVector; 
      vector2: Generic4DVector;
      categories?: number[];
    } 
  }>('/api/similarity', async (request, reply) => {
    const body = request.body;

    try {
      if (!body.vector1 || !body.vector2) {
        return reply.status(400).send({
          error: 'Invalid request. Provide vector1 and vector2',
        });
      }

      const vec1 = toResonanceVector(body.vector1);
      const vec2 = toResonanceVector(body.vector2);

      let score: number;
      let method: string;

      if (body.categories && body.categories.length > 0) {
        score = computeResonanceWithOrbs(vec1, vec2, body.categories);
        method = 'similarity_with_categories';
      } else {
        score = computeResonanceWithVectors({
          vector1: vec1,
          vector2: vec2
        });
        method = 'vector_similarity';
      }

      return reply.send({
        similarity: score,
        method,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: error.message || 'Similarity calculation failed',
      });
    }
  });

  /**
   * POST /api/analyze
   * Analyze content across 4 dimensions
   */
  fastify.post<{ Body: { content: string; title?: string } }>('/api/analyze', async (request, reply) => {
    const body = request.body;

    try {
      if (!body.content) {
        return reply.status(400).send({
          error: 'Invalid request. Provide content field',
        });
      }

      const engine = EnhancedResonanceEngine.getInstance();
      const analysis = await engine.analyzeContentWithMathematics(body.content, body.title);

      return reply.send({
        overall_score: analysis.overall_score,
        dimensions: {
          dimension1: analysis.signature.clarity,
          dimension2: analysis.signature.coherence,
          dimension3: analysis.signature.resonance,
          dimension4: analysis.signature.sovereignty
        },
        categories: analysis.orb_associations,
        analysis: {
          vector: fromResonanceVector(analysis.mathematical.resonanceVector),
          harmonicFrequency: analysis.mathematical.harmonicFrequency,
          coherenceMatrix: {
            rank: analysis.mathematical.coherenceMatrix.coherenceRank,
            size: analysis.mathematical.coherenceMatrix.nxn.length
          },
          contextDynamics: {
            strength: analysis.mathematical.fieldDynamics.fieldStrength,
            stability: analysis.mathematical.fieldDynamics.stability,
            coherence: analysis.mathematical.fieldDynamics.coherence,
            gradient: analysis.mathematical.fieldDynamics.gradient
          },
          verification: {
            validity: analysis.mathematical.sovereignLogic.validity,
            coherence: analysis.mathematical.sovereignLogic.coherence,
            integrity: analysis.mathematical.sovereignLogic.sovereignty
          }
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: error.message || 'Analysis failed',
      });
    }
  });

  /**
   * POST /api/verify-integrity
   * Verify content integrity and coherence
   */
  fastify.post<{ Body: { content: string; categories: number[] } }>('/api/verify-integrity', async (request, reply) => {
    const body = request.body;

    try {
      if (!body.content || !body.categories || !Array.isArray(body.categories)) {
        return reply.status(400).send({
          error: 'Invalid request. Provide content and categories array',
        });
      }

      const verification = SovereignLogic.verifyConsciousness(body.content, body.categories);
      const engine = EnhancedResonanceEngine.getInstance();
      const details = await engine.verifyConsciousness(body.content, body.categories);

      return reply.send({
        verified: verification.verified,
        confidence: verification.confidence,
        proof: verification.mathematicalProof,
        vector: fromResonanceVector(details.resonanceVector),
        contextDynamics: {
          strength: details.fieldDynamics.fieldStrength,
          stability: details.fieldDynamics.stability,
          coherence: details.fieldDynamics.coherence,
          gradient: details.fieldDynamics.gradient
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: error.message || 'Integrity verification failed',
      });
    }
  });

  /**
   * POST /api/vector
   * Convert content to 4D vector representation
   */
  fastify.post<{ Body: { content: string; title?: string } }>('/api/vector', async (request, reply) => {
    const body = request.body;

    try {
      if (!body.content) {
        return reply.status(400).send({
          error: 'Invalid request. Provide content field',
        });
      }

      const baseEngine = ResonanceEngine.getInstance();
      const analysis = await baseEngine.analyzeContent(body.content, body.title);
      
      const resonanceVector = ResonanceVectorMath.signatureToVector(analysis.signature);
      const fieldDynamics = ResonanceVectorMath.calculateFieldDynamics(
        resonanceVector,
        analysis.orb_associations
      );

      return reply.send({
        vector: fromResonanceVector(resonanceVector),
        metadata: {
          categories: analysis.orb_associations,
          contextStrength: fieldDynamics.fieldStrength,
          stability: fieldDynamics.stability,
          coherence: fieldDynamics.coherence,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: error.message || 'Vector conversion failed',
      });
    }
  });

  /**
   * POST /api/find-similar
   * Find similar items using 4D vectors
   */
  fastify.post<{ 
    Body: {
      query: {
        vector?: Generic4DVector;
        text?: string;
        categories?: number[];
      };
      candidates: Array<{
        id: string;
        vector?: Generic4DVector;
        text?: string;
        categories?: number[];
        metadata?: Record<string, any>;
      }>;
      topN?: number;
      useCategories?: boolean;
    }
  }>('/api/find-similar', async (request, reply) => {
    const body = request.body;

    try {
      if (!body.query || !body.candidates || !Array.isArray(body.candidates)) {
        return reply.status(400).send({
          error: 'Invalid request. Provide query and candidates array',
        });
      }

      const topN = body.topN || 10;
      const useCategories = body.useCategories || false;

      const query: NeighborSearchParams['query'] = {
        text: body.query.text,
        orbAssociations: body.query.categories,
      };

      if (body.query.vector) {
        query.resonanceVector = toResonanceVector(body.query.vector);
      }

      const candidates = body.candidates.map(c => ({
        id: c.id,
        text: c.text,
        resonanceVector: c.vector ? toResonanceVector(c.vector) : undefined,
        orbAssociations: c.categories,
        metadata: c.metadata,
      }));

      const searchParams: NeighborSearchParams = {
        query,
        candidates,
        topN,
        useOrbSystem: useCategories,
      };

      const neighbors = findNeighbors(searchParams);

      const results = neighbors.map(n => ({
        id: n.id,
        score: n.score,
        coherence: n.coherence,
        contextDynamics: n.fieldDynamics ? {
          strength: n.fieldDynamics.fieldStrength,
          stability: n.fieldDynamics.stability,
          coherence: n.fieldDynamics.coherence
        } : undefined,
        metadata: n.metadata,
      }));

      return reply.send({
        results,
        count: results.length,
        topN,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: error.message || 'Similarity search failed',
      });
    }
  });
}

