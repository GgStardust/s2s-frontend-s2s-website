/**
 * RBI Integration Snippet for Little Hero Books
 * 
 * Minimal example showing how to integrate RBI validation into your project.
 * This is a simplified version - see IMPLEMENTATION_GUIDE.md for complete examples.
 */

import axios from 'axios';

const RBI_SERVICE_URL = process.env.RBI_SERVICE_URL || 'http://localhost:3001';

/**
 * Validate order before processing
 * Use this before expensive AI API calls to catch invalid data early
 */
export async function validateOrder(order: any) {
  try {
    const response = await axios.post(`${RBI_SERVICE_URL}/field/validate`, {
      content: JSON.stringify(order),
      categoryAssociations: [1, 2, 3] // Your category IDs (optional)
    });
    
    return {
      verified: response.data.verified,
      confidence: response.data.confidence,
      validity: response.data.sovereignLogic.validity,
      coherence: response.data.sovereignLogic.coherence
    };
  } catch (error: any) {
    console.error('RBI validation error:', error.message);
    // Fallback: allow processing if RBI service is unavailable
    return { verified: true, fallback: true };
  }
}

/**
 * Score quality of content
 * Use this to get quality metrics (clarity, coherence, resonance, sovereignty)
 */
export async function scoreQuality(content: string) {
  try {
    const response = await axios.post(`${RBI_SERVICE_URL}/field/score`, {
      content
    });
    
    return {
      clarity: response.data.clarity,
      coherence: response.data.coherence,
      resonance: response.data.resonance,
      sovereignty: response.data.sovereignty,
      overallScore: (
        response.data.clarity + 
        response.data.coherence + 
        response.data.resonance + 
        response.data.sovereignty
      ) / 4
    };
  } catch (error: any) {
    console.error('RBI scoring error:', error.message);
    return null;
  }
}

/**
 * Find similar items (duplicate detection)
 * Use this to prevent duplicate processing
 */
export async function findSimilarOrders(queryOrder: any, candidateOrders: any[]) {
  try {
    const response = await axios.post(`${RBI_SERVICE_URL}/field/neighbors`, {
      query: { text: JSON.stringify(queryOrder) },
      candidates: candidateOrders.map(order => ({
        id: order.id,
        text: JSON.stringify(order)
      })),
      topN: 5
    });
    
    return response.data.neighbors;
  } catch (error: any) {
    console.error('RBI similarity search error:', error.message);
    return [];
  }
}

/**
 * Example: Use in API route
 */
export async function processOrder(order: any) {
  // 1. Validate order before expensive operations
  const validation = await validateOrder(order);
  if (!validation.verified) {
    throw new Error('Order validation failed');
  }
  
  // 2. Check for duplicates
  const similar = await findSimilarOrders(order, await getExistingOrders());
  if (similar.length > 0 && similar[0].score > 0.95) {
    return { reuse: true, existingOrderId: similar[0].id };
  }
  
  // 3. Process order (AI generation, etc.)
  // ... your processing logic ...
  
  // 4. Score quality of result
  const quality = await scoreQuality(JSON.stringify(order));
  if (quality && quality.overallScore < 0.85) {
    // Flag for review
    return { needsReview: true, quality };
  }
  
  return { success: true, quality };
}

// Helper function (implement based on your data store)
async function getExistingOrders(): Promise<any[]> {
  // Return array of existing orders for duplicate checking
  return [];
}

