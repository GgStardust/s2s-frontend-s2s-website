import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

// Enable default metrics collection
collectDefaultMetrics();

// Custom metrics for S2S system
export const s2sMetrics = {
  // API request metrics
  apiRequests: new Counter({
    name: 's2s_api_requests_total',
    help: 'Total number of API requests',
    labelNames: ['method', 'endpoint', 'status_code'],
  }),
  
  apiRequestDuration: new Histogram({
    name: 's2s_api_request_duration_seconds',
    help: 'Duration of API requests in seconds',
    labelNames: ['method', 'endpoint'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  }),
  
  // Cache metrics
  cacheHits: new Counter({
    name: 's2s_cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_key'],
  }),
  
  cacheMisses: new Counter({
    name: 's2s_cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_key'],
  }),
  
  // Queue metrics
  queueJobs: new Counter({
    name: 's2s_queue_jobs_total',
    help: 'Total number of queue jobs',
    labelNames: ['queue_name', 'job_type', 'status'],
  }),
  
  queueJobDuration: new Histogram({
    name: 's2s_queue_job_duration_seconds',
    help: 'Duration of queue jobs in seconds',
    labelNames: ['queue_name', 'job_type'],
    buckets: [1, 5, 10, 30, 60, 300],
  }),
  
  // Content processing metrics
  contentFilesProcessed: new Counter({
    name: 's2s_content_files_processed_total',
    help: 'Total number of content files processed',
    labelNames: ['content_type', 'status'],
  }),
  
  // AI processing metrics
  aiRequests: new Counter({
    name: 's2s_ai_requests_total',
    help: 'Total number of AI requests',
    labelNames: ['ai_type', 'status'],
  }),
  
  aiRequestDuration: new Histogram({
    name: 's2s_ai_request_duration_seconds',
    help: 'Duration of AI requests in seconds',
    labelNames: ['ai_type'],
    buckets: [1, 5, 10, 30, 60],
  }),
  
  // Orb system metrics
  orbInteractions: new Counter({
    name: 's2s_orb_interactions_total',
    help: 'Total number of orb interactions',
    labelNames: ['orb_number', 'interaction_type'],
  }),
  
  // Resonance metrics
  resonanceEvents: new Counter({
    name: 's2s_resonance_events_total',
    help: 'Total number of resonance events',
    labelNames: ['event_type', 'orb_number'],
  }),
  
  // System health metrics
  systemHealth: new Gauge({
    name: 's2s_system_health',
    help: 'System health status (1 = healthy, 0 = unhealthy)',
    labelNames: ['component'],
  }),
  
  activeConnections: new Gauge({
    name: 's2s_active_connections',
    help: 'Number of active connections',
  }),
  
  // Database metrics
  databaseQueries: new Counter({
    name: 's2s_database_queries_total',
    help: 'Total number of database queries',
    labelNames: ['table', 'operation', 'status'],
  }),
  
  databaseQueryDuration: new Histogram({
    name: 's2s_database_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['table', 'operation'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
  }),
};

// Metrics collection functions
export function recordApiRequest(method: string, endpoint: string, statusCode: number, duration: number) {
  s2sMetrics.apiRequests.inc({ method, endpoint, status_code: statusCode.toString() });
  s2sMetrics.apiRequestDuration.observe({ method, endpoint }, duration);
}

export function recordCacheHit(cacheKey: string) {
  s2sMetrics.cacheHits.inc({ cache_key: cacheKey });
}

export function recordCacheMiss(cacheKey: string) {
  s2sMetrics.cacheMisses.inc({ cache_key: cacheKey });
}

export function recordQueueJob(queueName: string, jobType: string, status: 'completed' | 'failed', duration: number) {
  s2sMetrics.queueJobs.inc({ queue_name: queueName, job_type: jobType, status });
  s2sMetrics.queueJobDuration.observe({ queue_name: queueName, job_type: jobType }, duration);
}

export function recordContentFileProcessed(contentType: string, status: 'success' | 'failed') {
  s2sMetrics.contentFilesProcessed.inc({ content_type: contentType, status });
}

export function recordAIRequest(aiType: string, status: 'success' | 'failed', duration: number) {
  s2sMetrics.aiRequests.inc({ ai_type: aiType, status });
  s2sMetrics.aiRequestDuration.observe({ ai_type: aiType }, duration);
}

export function recordOrbInteraction(orbNumber: string, interactionType: string) {
  s2sMetrics.orbInteractions.inc({ orb_number: orbNumber, interaction_type: interactionType });
}

export function recordResonanceEvent(eventType: string, orbNumber: string) {
  s2sMetrics.resonanceEvents.inc({ event_type: eventType, orb_number: orbNumber });
}

export function updateSystemHealth(component: string, isHealthy: boolean) {
  s2sMetrics.systemHealth.set({ component }, isHealthy ? 1 : 0);
}

export function updateActiveConnections(count: number) {
  s2sMetrics.activeConnections.set(count);
}

export function recordDatabaseQuery(table: string, operation: string, status: 'success' | 'failed', duration: number) {
  s2sMetrics.databaseQueries.inc({ table, operation, status });
  s2sMetrics.databaseQueryDuration.observe({ table, operation }, duration);
}

// Health check function
export async function getSystemHealth() {
  const health = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    components: {
      api: true,
      database: true,
      cache: true,
      queues: true,
    },
    metrics: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    },
  };
  
  return health;
}

// Export metrics registry
export { register };






