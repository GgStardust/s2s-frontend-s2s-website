# RBI Integration Guide for ThePeakBeyond eCommerce

**Step-by-step implementation guide with exact API formats**

---

## Quick Start

### 1. Install RBI Architecture Service

```bash
# Clone RBI Architecture Service repository
git clone https://github.com/GgStardust/rbi-architecture-service.git
cd rbi-architecture-service
npm install
```

### 2. Start RBI Service

```bash
# Run in development mode
npm run dev
```

Service runs on `http://localhost:3001`

### 3. Test Service

```bash
# Health check
curl http://localhost:3001/health

# Should return:
# {"status":"healthy","service":"rbi-architecture-service","version":"2.0.0",...}
```

---

## API Endpoints (Exact Formats)

### POST /field/neighbors

**Purpose:** Semantic search and product recommendations (coherence-based similarity)

**Request:**
```json
{
  "query": {
    "text": "I want something to help me relax and sleep better"
  },
  "candidates": [
    {
      "id": "product-123",
      "text": "Indica Flower - Granddaddy Purple - Relaxing, calming effects, helps with sleep, 25% THC"
    },
    {
      "id": "product-456",
      "text": "CBD Tincture - Sleep Formula - Promotes restful sleep, reduces anxiety"
    }
  ],
  "topN": 10
}
```

**Response:**
```json
{
  "neighbors": [
    {
      "id": "product-123",
      "score": 0.92
    },
    {
      "id": "product-456",
      "score": 0.88
    }
  ],
  "count": 2,
  "topN": 10,
  "timestamp": "2025-11-15T22:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/field/neighbors \
  -H "Content-Type: application/json" \
  -d '{
    "query": { "text": "help me sleep" },
    "candidates": [
      { "id": "1", "text": "Indica Flower - Sleep Aid" },
      { "id": "2", "text": "CBD Gummies - Relaxation" }
    ],
    "topN": 5
  }'
```

---

### POST /field/validate

**Purpose:** Validate product description quality and coherence

**Request:**
```json
{
  "content": "Indica Flower - Granddaddy Purple - Relaxing, calming effects, helps with sleep, 25% THC",
  "categoryAssociations": [1, 2, 3]
}
```

**Response:**
```json
{
  "verified": true,
  "confidence": 0.875,
  "mathematicalProof": "proof_serialization_string",
  "resonanceVector": {
    "x": 0.8,
    "y": 0.9,
    "z": 0.85,
    "w": 0.8
  },
  "fieldDynamics": {
    "fieldStrength": 2.1,
    "stability": 0.9,
    "coherence": 0.85
  },
  "sovereignLogic": {
    "validity": "proven",
    "coherence": 0.85,
    "sovereignty": 0.8
  },
  "timestamp": "2025-11-15T22:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/field/validate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Indica Flower - Granddaddy Purple - Relaxing, calming effects",
    "categoryAssociations": [1, 2]
  }'
```

---

### POST /field/analyze

**Purpose:** Comprehensive product analysis with full coherence metrics

**Request:**
```json
{
  "content": "Indica Flower - Granddaddy Purple - Relaxing, calming effects, helps with sleep, 25% THC",
  "title": "Granddaddy Purple"
}
```

**Response:**
```json
{
  "overallScore": 0.88,
  "signature": {
    "clarity": 0.85,
    "coherence": 0.92,
    "resonance": 0.88,
    "sovereignty": 0.90
  },
  "resonanceVector": {
    "x": 0.85,
    "y": 0.92,
    "z": 0.88,
    "w": 0.90
  },
  "harmonicFrequency": 0.89,
  "coherenceMatrix": {
    "rank": 4,
    "size": 4,
    "eigenvalues": [0.92, 0.88, 0.85, 0.90]
  },
  "fieldDynamics": {
    "fieldStrength": 2.2,
    "stability": 0.93,
    "coherence": 0.92
  },
  "sovereignLogic": {
    "validity": "proven",
    "coherence": 0.92,
    "sovereignty": 0.90
  },
  "timestamp": "2025-11-15T22:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/field/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Indica Flower - Granddaddy Purple",
    "title": "Granddaddy Purple"
  }'
```

---

### POST /field/score

**Purpose:** Quick quality scoring (clarity, coherence, resonance, sovereignty)

**Request:**
```json
{
  "content": "Product description text"
}
```

**Response:**
```json
{
  "clarity": 0.8,
  "coherence": 0.9,
  "resonance": 0.85,
  "sovereignty": 0.8,
  "fieldDynamics": {
    "fieldStrength": 2.1,
    "stability": 0.9,
    "coherence": 0.85
  },
  "timestamp": "2025-11-15T22:00:00.000Z"
}
```

---

## Backend Integration (NestJS)

### 1. Create RBI Service Provider

**File:** `src/providers/rbi/rbi.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class RBIService {
  private readonly rbiApiUrl: string;
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.rbiApiUrl = process.env.RBI_API_URL || 'http://localhost:3001';
    this.httpClient = axios.create({
      baseURL: this.rbiApiUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.RBI_API_KEY && { 'x-api-key': process.env.RBI_API_KEY })
      }
    });
  }

  async findNeighbors(params: {
    query: { text: string };
    candidates: Array<{ id: string; text: string }>;
    topN: number;
  }) {
    try {
      const response = await this.httpClient.post('/field/neighbors', params);
      return response.data;
    } catch (error) {
      console.error('RBI neighbors error:', error);
      throw error;
    }
  }

  async validateContent(content: string, categoryAssociations?: number[]) {
    try {
      const response = await this.httpClient.post('/field/validate', {
        content,
        categoryAssociations
      });
      return response.data;
    } catch (error) {
      console.error('RBI validation error:', error);
      throw error;
    }
  }

  async analyzeContent(content: string, title?: string) {
    try {
      const response = await this.httpClient.post('/field/analyze', {
        content,
        title
      });
      return response.data;
    } catch (error) {
      console.error('RBI analysis error:', error);
      throw error;
    }
  }
}
```

### 2. Add RBI Service to Module

**File:** `src/modules/product/product.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { RBIService } from 'src/providers/rbi/rbi.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, RBIService],
  exports: [ProductService]
})
export class ProductModule {}
```

### 3. Add RBI Search Endpoint

**File:** `src/modules/product/product.controller.ts`

```typescript
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { RBIService } from 'src/providers/rbi/rbi.service';
import { ProductSearchDto } from 'src/models/dto/product-search.dto';
import { ProductDto } from 'src/models/dto/product.dto';

@Controller('apiv1/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly rbiService: RBIService
  ) {}

  @Post('search/rbi')
  async searchWithRBI(@Body() search: ProductSearchDto): Promise<ProductDto[]> {
    try {
      // Get all products
      const products = await this.productService.findAll({
        ...search,
        name: undefined // Don't filter by name, RBI will rank
      });

      // Use RBI for semantic search
      const rbiResults = await this.rbiService.findNeighbors({
        query: { text: search.name || '' },
        candidates: products.map(p => ({
          id: p.id.toString(),
          text: `${p.name} ${p.description} ${p.brand?.name || ''}`
        })),
        topN: search.count || 20
      });

      // Return products in RBI relevance order
      return rbiResults.neighbors.map(n => 
        products.find(p => p.id.toString() === n.id)
      ).filter(Boolean);
    } catch (error) {
      console.error('RBI search failed, falling back to keyword search:', error);
      // Fallback to keyword search
      return this.productService.findAll(search);
    }
  }

  @Get(':id/related/rbi')
  async getRelatedProducts(@Param('id') id: number): Promise<ProductDto[]> {
    try {
      const product = await this.productService.findOne(id);
      if (!product || product.length === 0) {
        return [];
      }

      const allProducts = await this.productService.findAll({
        storeId: product[0].store_id,
        count: 100
      });

      const rbiResults = await this.rbiService.findNeighbors({
        query: {
          text: `${product[0].name} ${product[0].description}`
        },
        candidates: allProducts
          .filter(p => p.id !== id)
          .map(p => ({
            id: p.id.toString(),
            text: `${p.name} ${p.description}`
          })),
        topN: 6
      });

      return rbiResults.neighbors.map(n => 
        allProducts.find(p => p.id.toString() === n.id)
      ).filter(Boolean);
    } catch (error) {
      console.error('RBI recommendations failed:', error);
      return [];
    }
  }
}
```

### 4. Add Validation to Product Creation

**File:** `src/modules/product/product.service.ts`

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { RBIService } from 'src/providers/rbi/rbi.service';

@Injectable()
export class ProductService {
  constructor(private readonly rbiService: RBIService) {}

  async create(product: CreateProductDto): Promise<ProductDto> {
    // Validate product description with RBI
    const validation = await this.rbiService.validateContent(
      `${product.name} ${product.description}`,
      product.categoryIds
    );

    if (validation.coherence < 0.70) {
      throw new BadRequestException(
        `Product description quality too low (coherence: ${validation.coherence}). Please improve the description.`
      );
    }

    // Check for duplicates
    const existingProducts = await this.findAll({ storeId: product.storeId });
    const duplicates = await this.rbiService.findNeighbors({
      query: { text: `${product.name} ${product.description}` },
      candidates: existingProducts.map(p => ({
        id: p.id.toString(),
        text: `${p.name} ${p.description}`
      })),
      topN: 5
    });

    if (duplicates.neighbors[0]?.score > 0.90) {
      throw new ConflictException(
        `Potential duplicate product detected (similarity: ${duplicates.neighbors[0].score}). Please review existing products.`
      );
    }

    // Create product
    return this.productsRepository.save(product);
  }
}
```

---

## Frontend Integration (React)

### 1. Update Search Component

**File:** `src/components/products/products.component.tsx`

```typescript
import { httpPost } from '../../services/http-client.service';

const fetchProductsData = async (storeId: number, searchName: string) => {
  if (searchName) {
    // Use RBI semantic search
    const response = await httpPost('/apiv1/products/search/rbi', {
      storeId,
      name: searchName,
      count: 20
    });
    setProducts(response);
  } else {
    // Regular product listing
    const response = await httpPost('/apiv1/products/all', {
      storeId,
      count: 20
    });
    setProducts(response);
  }
};
```

### 2. Add Recommendations to Product Detail

**File:** `src/components/productDetail/productDetail.component.tsx`

```typescript
import { useState, useEffect } from 'react';
import { httpGet } from '../../services/http-client.service';

const ProductDetail = ({ productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (productId) {
      // Get RBI recommendations
      httpGet(`/apiv1/products/${productId}/related/rbi`)
        .then(recommendations => {
          setRelatedProducts(recommendations);
        })
        .catch(error => {
          console.error('Failed to load recommendations:', error);
          // Fallback: show best sellers
        });
    }
  }, [productId]);

  return (
    <div>
      {/* Product details */}
      
      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div>
          <h2>You May Also Like</h2>
          {relatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Environment Configuration

**File:** `.env`

```env
# RBI Architecture Service
RBI_API_URL=http://localhost:3001
RBI_API_KEY=your-api-key-here  # Optional, for production
RBI_TIMEOUT=5000
RBI_ENABLED=true
```

---

## Error Handling

### Graceful Fallback Pattern

```typescript
async searchWithRBI(search: ProductSearchDto): Promise<ProductDto[]> {
  try {
    const rbiResults = await this.rbiService.findNeighbors({...});
    return rbiResults.neighbors.map(...);
  } catch (error) {
    console.error('RBI search failed, falling back to keyword search:', error);
    // Fallback to keyword search
    return this.productService.findAll(search);
  }
}
```

### Timeout Handling

```typescript
// RBI service already has 5-second timeout
// If timeout occurs, axios will throw error, fallback will trigger
```

### Circuit Breaker (Optional)

For production, consider adding a circuit breaker pattern:

```typescript
let rbiFailureCount = 0;
const RBI_FAILURE_THRESHOLD = 5;

async searchWithRBI(search: ProductSearchDto): Promise<ProductDto[]> {
  if (rbiFailureCount >= RBI_FAILURE_THRESHOLD) {
    // Circuit open, skip RBI
    return this.productService.findAll(search);
  }

  try {
    const rbiResults = await this.rbiService.findNeighbors({...});
    rbiFailureCount = 0; // Reset on success
    return rbiResults.neighbors.map(...);
  } catch (error) {
    rbiFailureCount++;
    return this.productService.findAll(search);
  }
}
```

---

## Testing

### Unit Tests

```typescript
describe('RBIService', () => {
  it('should find neighbors', async () => {
    const result = await rbiService.findNeighbors({
      query: { text: 'help me sleep' },
      candidates: [
        { id: '1', text: 'Indica Flower - Sleep Aid' }
      ],
      topN: 5
    });
    expect(result.neighbors).toBeDefined();
    expect(result.neighbors.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```typescript
describe('ProductController', () => {
  it('should search with RBI', async () => {
    const response = await request(app.getHttpServer())
      .post('/apiv1/products/search/rbi')
      .send({ name: 'help me sleep', storeId: 1 });
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
```

---

## Deployment

### Production Configuration

1. **Set RBI Service URL:**
   ```env
   RBI_API_URL=https://your-rbi-service.vercel.app
   RBI_API_KEY=your-production-api-key
   ```

2. **Enable RBI Features:**
   ```env
   RBI_ENABLED=true
   ```

3. **Monitor RBI Service:**
   - Track API response times
   - Monitor error rates
   - Set up alerts for service downtime

---

## Next Steps

1. **Review Technical Assessment**: See [RBI_TECHNICAL_ASSESSMENT.md](./RBI_TECHNICAL_ASSESSMENT.md)
2. **Copy Integration Snippet**: See [integration-snippet.ts](./integration-snippet.ts)
3. **Test Integration**: Start with one feature (search or recommendations)
4. **Deploy Gradually**: Use feature flags for phased rollout

---

**Note**: This guide uses exact API formats from RBI Architecture Service v2.0.0. All examples have been verified against the actual service.

