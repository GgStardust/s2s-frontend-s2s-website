/**
 * RBI Integration Snippet for ThePeakBeyond eCommerce
 * 
 * Minimal code example showing RBI integration patterns.
 * This is a simplified version - see IMPLEMENTATION_GUIDE.md for complete examples.
 */

import axios from 'axios';

// RBI Service Configuration
const RBI_API_URL = process.env.RBI_API_URL || 'http://localhost:3001';
const RBI_API_KEY = process.env.RBI_API_KEY; // Optional

// RBI Service Client
class RBIService {
  private httpClient = axios.create({
    baseURL: RBI_API_URL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      ...(RBI_API_KEY && { 'x-api-key': RBI_API_KEY })
    }
  });

  /**
   * Semantic Search - Find products by natural language query
   */
  async searchProducts(
    query: string,
    products: Array<{ id: string; name: string; description: string }>,
    topN: number = 10
  ) {
    try {
      const response = await this.httpClient.post('/field/neighbors', {
        query: { text: query },
        candidates: products.map(p => ({
          id: p.id.toString(),
          text: `${p.name} ${p.description}`
        })),
        topN
      });

      // Return products in RBI relevance order
      return response.data.neighbors.map((n: { id: string; score: number }) => ({
        product: products.find(p => p.id.toString() === n.id),
        score: n.score
      })).filter((item: any) => item.product);
    } catch (error) {
      console.error('RBI search failed:', error);
      // Fallback to simple keyword matching
      const lowerQuery = query.toLowerCase();
      return products
        .filter(p => 
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
        )
        .slice(0, topN)
        .map(p => ({ product: p, score: 0.5 }));
    }
  }

  /**
   * Get Related Products - "You May Also Like" recommendations
   */
  async getRelatedProducts(
    product: { id: string; name: string; description: string },
    allProducts: Array<{ id: string; name: string; description: string }>,
    topN: number = 6
  ) {
    try {
      const response = await this.httpClient.post('/field/neighbors', {
        query: {
          text: `${product.name} ${product.description}`
        },
        candidates: allProducts
          .filter(p => p.id !== product.id)
          .map(p => ({
            id: p.id.toString(),
            text: `${p.name} ${p.description}`
          })),
        topN
      });

      return response.data.neighbors.map((n: { id: string; score: number }) => 
        allProducts.find(p => p.id.toString() === n.id)
      ).filter(Boolean);
    } catch (error) {
      console.error('RBI recommendations failed:', error);
      // Fallback: return random products
      return allProducts
        .filter(p => p.id !== product.id)
        .slice(0, topN);
    }
  }

  /**
   * Validate Product Description - Quality check before saving
   */
  async validateProduct(
    name: string,
    description: string,
    categoryIds?: number[]
  ) {
    try {
      const response = await this.httpClient.post('/field/validate', {
        content: `${name} ${description}`,
        categoryAssociations: categoryIds
      });

      return {
        valid: response.data.verified,
        coherence: response.data.sovereignLogic.coherence,
        confidence: response.data.confidence,
        issues: response.data.coherence < 0.70 ? ['Low coherence score'] : []
      };
    } catch (error) {
      console.error('RBI validation failed:', error);
      // Fallback: allow product (don't block on RBI failure)
      return {
        valid: true,
        coherence: 0.5,
        confidence: 0.5,
        issues: []
      };
    }
  }

  /**
   * Check for Duplicate Products
   */
  async checkDuplicates(
    product: { name: string; description: string },
    existingProducts: Array<{ id: string; name: string; description: string }>
  ) {
    try {
      const response = await this.httpClient.post('/field/neighbors', {
        query: {
          text: `${product.name} ${product.description}`
        },
        candidates: existingProducts.map(p => ({
          id: p.id.toString(),
          text: `${p.name} ${p.description}`
        })),
        topN: 5
      });

      // Flag if highest similarity > 0.90 (likely duplicate)
      const highestSimilarity = response.data.neighbors[0]?.score || 0;
      return {
        isDuplicate: highestSimilarity > 0.90,
        similarity: highestSimilarity,
        similarProduct: highestSimilarity > 0.90
          ? existingProducts.find(p => 
              p.id.toString() === response.data.neighbors[0].id
            )
          : null
      };
    } catch (error) {
      console.error('RBI duplicate check failed:', error);
      // Fallback: no duplicate detection
      return {
        isDuplicate: false,
        similarity: 0,
        similarProduct: null
      };
    }
  }

  /**
   * Analyze Product - Full coherence analysis
   */
  async analyzeProduct(name: string, description: string) {
    try {
      const response = await this.httpClient.post('/field/analyze', {
        content: `${name} ${description}`,
        title: name
      });

      return {
        overallScore: response.data.overallScore,
        clarity: response.data.signature.clarity,
        coherence: response.data.signature.coherence,
        resonance: response.data.signature.resonance,
        sovereignty: response.data.signature.sovereignty,
        fieldDynamics: response.data.fieldDynamics
      };
    } catch (error) {
      console.error('RBI analysis failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const rbiService = new RBIService();

// Usage Examples:

// 1. Semantic Search
// const results = await rbiService.searchProducts(
//   "help me sleep",
//   allProducts,
//   10
// );

// 2. Related Products
// const related = await rbiService.getRelatedProducts(
//   currentProduct,
//   allProducts,
//   6
// );

// 3. Validate Product
// const validation = await rbiService.validateProduct(
//   "Indica Flower",
//   "Relaxing, calming effects, helps with sleep",
//   [1, 2]
// );
// if (!validation.valid) {
//   throw new Error('Product description quality too low');
// }

// 4. Check Duplicates
// const duplicateCheck = await rbiService.checkDuplicates(
//   newProduct,
//   existingProducts
// );
// if (duplicateCheck.isDuplicate) {
//   throw new Error('Duplicate product detected');
// }

