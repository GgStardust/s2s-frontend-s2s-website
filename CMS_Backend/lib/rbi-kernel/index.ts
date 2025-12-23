/**
 * RBI Kernel Server
 * 
 * REST API server for RBI field-level coherence architecture.
 * Provides interfaces to field computation and validation operations.
 */

import Fastify from 'fastify';
import { registerRbiRoutes } from './interfaces/api/field-endpoints.js';
import { registerGenericRoutes } from './interfaces/api/coherence-endpoints.js';

const fastify = Fastify({
  logger: true,
});

// Root endpoint - API information
fastify.get('/', async (request, reply) => {
  const baseUrl = `${request.protocol}://${request.hostname}`;
  return reply.send({
    service: 'rbi-kernel',
    version: '1.0.0',
    description: 'RBI Kernel - Field-Level Coherence Architecture',
    architecture: '5-layer field-level coherence verification framework',
    endpoints: {
      rbi: {
        score: `${baseUrl}/rbi/score`,
        neighbors: `${baseUrl}/rbi/neighbors`,
        analyze: `${baseUrl}/rbi/analyze`,
        verifyConsciousness: `${baseUrl}/rbi/verify-consciousness`,
        vector: `${baseUrl}/rbi/vector`,
      },
      generic: {
        similarity: `${baseUrl}/api/similarity`,
        analyze: `${baseUrl}/api/analyze`,
        verifyIntegrity: `${baseUrl}/api/verify-integrity`,
        vector: `${baseUrl}/api/vector`,
        findSimilar: `${baseUrl}/api/find-similar`,
      },
    },
    documentation: `${baseUrl}/docs/openapi.yaml`,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return reply.send({
    status: 'ok',
    service: 'rbi-kernel',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Register field endpoints
registerRbiRoutes(fastify);

// Register coherence endpoints
registerGenericRoutes(fastify);

// Start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  const start = async () => {
    try {
      const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
      const host = process.env.HOST || '0.0.0.0';

      await fastify.listen({ port, host });
      console.log(`🌀 RBI Kernel - Field-Level Coherence Architecture`);
      console.log(`📡 Running on http://${host}:${port}`);
      console.log(`📊 Health check: http://${host}:${port}/health`);
      console.log(`📈 S2S API: http://${host}:${port}/rbi/*`);
      console.log(`🌐 Generic API: http://${host}:${port}/api/*`);
      console.log(`📚 Documentation: http://${host}:${port}/docs/openapi.yaml`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

  start();
}
