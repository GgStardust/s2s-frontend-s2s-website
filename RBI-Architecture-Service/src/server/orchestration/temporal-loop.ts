/**
 * Temporal Loop Orchestration
 * 
 * Manages continuous field coherence monitoring and temporal continuity validation
 */
import { FieldComputation } from '../../kernel.js';
import { LRUCache } from '../cache/lru-cache.js';
import type { FieldCacheEntry } from '../cache/lru-cache.js';
import { Logger } from '../middleware/logging.js';
import { MonitoringEngine } from './monitoring-engine.js';

/**
 * Start temporal loop for continuous field monitoring
 * Now works with LRU cache which handles TTL internally
 */
export function startTemporalLoop(
  fieldCache: LRUCache<FieldCacheEntry>,
  monitoringEngine?: MonitoringEngine
): void {
  const INTERVAL_MS = parseInt(process.env.TEMPORAL_LOOP_INTERVAL || '60000', 10); // 1 minute default
  
  setInterval(() => {
    // Clean expired entries (LRU cache handles TTL)
    const cleaned = fieldCache.cleanExpired();
    
    if (cleaned > 0) {
      Logger.debug(`Temporal loop: cleaned ${cleaned} expired cache entries`);
      }
    
    // Optional: Perform temporal continuity checks on active fields
    // This can be extended to validate coherence over time
    const metrics = fieldCache.getMetrics();
    if (metrics.size > 0) {
      Logger.debug('Temporal loop: field coherence check', {
        activeFields: metrics.size,
        hitRate: metrics.hitRate
      });
    }

    if (monitoringEngine) {
      const entries = fieldCache.entries();
      entries.forEach(entry => {
        monitoringEngine.record({
          timestamp: Date.now(),
          coherence: entry.value.vector.y,
          latency: entry.value.metrics?.latency,
          requestId: entry.value.requestId
        });
      });
    }
  }, INTERVAL_MS);
  
  Logger.info(`Temporal loop started`, { interval: INTERVAL_MS });
}

