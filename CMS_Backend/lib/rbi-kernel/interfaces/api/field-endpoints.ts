/**
 * Interfaces Layer - Field Endpoints
 * 
 * REST API endpoints for field-level coherence operations.
 * Provides access to RBI field computation and validation.
 * 
 * Architecture Layer: 5 (Interfaces)
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { 
  computeResonance, 
  scoreVectors, 
  calculateTextSimilarity, 
  ResonanceParams,
  computeResonanceWithVectors,
  computeResonanceWithOrbs
} from '../../field/computation/coherence-calculator.js';
import { findNeighbors, NeighborSearchParams } from '../../field/computation/field-operators.js';
import { ResonanceVector } from '../../mathematics/resonance-vectors.js';
import { EnhancedResonanceEngine } from '../../field/computation/enhanced-engine.js';
import { verifyConsciousness } from '../../field/validation/proof-of-meaning.js';
import { ResonanceVectorMath } from '../../mathematics/resonance-vectors.js';
import { ResonanceEngine } from '../../field/computation/resonance-engine.js';

interface ScoreRequest {
  vectorSimilarity?: number;
  orbOverlap?: number;
  temporalDecay?: number;
  
  vectors?: {
    vector1: number[];
    vector2: number[];
  };
  
  texts?: {
    text1: string;
    text2: string;
  };
  
  resonanceVectors?: {
    vector1: ResonanceVector;
    vector2: ResonanceVector;
    orbAssociations?: number[];
  };
}

interface NeighborsRequest {
  query: {
    vector?: number[];
    resonanceVector?: ResonanceVector;
    text?: string;
    resonanceParams?: ResonanceParams;
    orbAssociations?: number[];
  };
  candidates: Array<{
    id: string;
    vector?: number[];
    resonanceVector?: ResonanceVector;
    text?: string;
    resonanceParams?: ResonanceParams;
    orbAssociations?: number[];
    metadata?: Record<string, any>;
  }>;
  topN?: number;
  useResonance?: boolean;
  useOrbSystem?: boolean;
}

export async function registerRbiRoutes(fastify: FastifyInstance) {
  /**
   * POST /rbi/score
   * Calculate resonance score from various input types
   */
  fastify.post<{ Body: ScoreRequest }>('/rbi/score', async (request, reply) => {
    const body = request.body;

    try {
      let score: number;
      let method: string;

      if (
        typeof body.vectorSimilarity === 'number' &&
        typeof body.orbOverlap === 'number' &&
        typeof body.temporalDecay === 'number'
      ) {
        score = computeResonance({
          vectorSimilarity: body.vectorSimilarity,
          orbOverlap: body.orbOverlap,
          temporalDecay: body.temporalDecay,
        });
        method = 'resonance';
      }
      else if (body.vectors?.vector1 && body.vectors?.vector2) {
        const similarity = scoreVectors(body.vectors.vector1, body.vectors.vector2);
        score = (similarity + 1) / 2;
        method = 'vector_similarity';
      }
      else if (body.texts?.text1 && body.texts?.text2) {
        score = calculateTextSimilarity(body.texts.text1, body.texts.text2);
        method = 'text_similarity';
      }
      else if (body.resonanceVectors?.vector1 && body.resonanceVectors?.vector2) {
        if (body.resonanceVectors.orbAssociations && body.resonanceVectors.orbAssociations.length > 0) {
          score = computeResonanceWithOrbs(
            body.resonanceVectors.vector1,
            body.resonanceVectors.vector2,
            body.resonanceVectors.orbAssociations
          );
          method = 'resonance_vectors_with_orbs';
        } else {
          score = computeResonanceWithVectors({
            vector1: body.resonanceVectors.vector1,
            vector2: body.resonanceVectors.vector2
          });
          method = 'resonance_vectors';
        }
      } else {
        return reply.status(400).send({
          error: 'Invalid request. Provide either: (vectorSimilarity, orbOverlap, temporalDecay) OR vectors OR texts OR resonanceVectors',
        });
      }

      return reply.send({
        score,
        method,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: error.message || 'Computation failed',
      });
    }
  });

  /**
   * POST /rbi/neighbors
   * Find top-N most similar items
   */
  fastify.post<{ Body: NeighborsRequest }>('/rbi/neighbors', async (request, reply) => {
    const body = request.body;

    try {
      if (!body.query || !body.candidates || !Array.isArray(body.candidates)) {
        return reply.status(400).send({
          error: 'Invalid request. Provide query and candidates array',
        });
      }

      const topN = body.topN || 10;
      const useResonance = body.useResonance || false;
      const useOrbSystem = body.useOrbSystem || false;

      const searchParams: NeighborSearchParams = {
        query: body.query,
        candidates: body.candidates,
        topN,
        useResonance,
        useOrbSystem,
      };

      const neighbors = findNeighbors(searchParams);

      return reply.send({
        neighbors,
        count: neighbors.length,
        topN,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: error.message || 'Neighbor search failed',
      });
    }
  });

  /**
   * POST /rbi/analyze
   * Full content analysis with enhanced RBI mathematics
   */
  fastify.post<{ Body: { content: string; title?: string } }>('/rbi/analyze', async (request, reply) => {
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
        signature: analysis.signature,
        orb_associations: analysis.orb_associations,
        mathematical: analysis.mathematical,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: error.message || 'Analysis failed',
      });
    }
  });

  /**
   * POST /rbi/verify-consciousness
   * Verify coherence using Proof-of-Meaning
   */
  fastify.post<{ Body: { content: string; orbAssociations: number[] } }>('/rbi/verify-consciousness', async (request, reply) => {
    const body = request.body;

    try {
      if (!body.content || !body.orbAssociations || !Array.isArray(body.orbAssociations)) {
        return reply.status(400).send({
          error: 'Invalid request. Provide content and orbAssociations array',
        });
      }

      const verification = verifyConsciousness(body.content, body.orbAssociations);

      const engine = EnhancedResonanceEngine.getInstance();
      const details = await engine.verifyConsciousness(body.content, body.orbAssociations);

      return reply.send({
        verified: verification.verified,
        confidence: verification.confidence,
        mathematicalProof: verification.mathematicalProof,
        resonanceVector: details.resonanceVector,
        fieldDynamics: details.fieldDynamics,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: error.message || 'Coherence verification failed',
      });
    }
  });

  /**
   * POST /rbi/vector
   * Convert content to 4D resonance vector
   */
  fastify.post<{ Body: { content: string; title?: string } }>('/rbi/vector', async (request, reply) => {
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
        vector: resonanceVector,
        metadata: {
          orbAssociations: analysis.orb_associations,
          fieldStrength: fieldDynamics.fieldStrength,
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
}

