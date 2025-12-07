# RBI Integration Guide for Little Hero Books

**API v1 Complete - Simple, practical implementation guide with exact API formats**

---

## 🎉 API v1 New Features

**All endpoints now support:**
- ✅ **JSON Objects Directly** - No stringification needed! Send JSON objects, strings, or text
- ✅ **Decision Trails** - See which validation rules were active
- ✅ **JSON Schema Extraction** - Automatic schema detection in responses
- ✅ **Codebase Analysis** - Analyze n8n workflows, backend, frontend code
- ✅ **Batch Operations** - Process multiple orders at once
- ✅ **Baseline Management** - Track drift over time

**See [API v1 Implementation Guide](../../API_V1_IMPLEMENTATION_GUIDE.md) for complete overview.**

---

## Quick Start

### 1. Install RBI-Kernel

```bash
# Clone RBI-Kernel repository
git clone https://github.com/GgStardust/rbi-kernel.git
cd rbi-kernel
npm install
```

### 2. Start RBI Service

```bash
# Run in service mode
npm run dev
```

Service runs on `http://localhost:3001`

### 3. Test Service

```bash
# Health check
curl http://localhost:3001/health

# Should return:
# {"status":"healthy","service":"rbi-kernel","version":"2.0.0",...}
```

---

## API Endpoints (Exact Formats)

### POST /field/score

**Purpose:** Get quality scores (clarity, coherence, resonance, sovereignty)

**Request:**
```json
{
  "content": "Text content to analyze"
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
  "timestamp": "2025-11-11T22:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/field/score \
  -H "Content-Type: application/json" \
  -d '{"content": "Character consistency check across 12 poses"}'
```

---

### POST /field/validate

**Purpose:** Validate content with Proof-of-Meaning verification

**Request (JSON Object - API v1):**
```json
{
  "content": {
    "name": "Emma",
    "age": 4,
    "hairColor": "blonde",
    "skinTone": "fair"
  },
  "categoryAssociations": [1, 2, 3]  // Optional
}
```

**Or (JSON String - still works):**
```json
{
  "content": "{\"name\":\"Emma\",\"age\":4}",
  "categoryAssociations": [1, 2, 3]
}
```

**Response (API v1):**
```json
{
  "verified": true,
  "confidence": 0.875,
  "decisionTrail": {
    "activeAssociations": [1, 2, 3],
    "validationRules": [
      { "rule": "coherence_validation", "result": "passed", "weight": 0.4 },
      { "rule": "association_validation", "result": "passed", "weight": 0.3 },
      { "rule": "confidence_threshold", "result": "passed", "weight": 0.3 }
    ],
    "metadata": {
      "contentType": "json",
      "hasSchema": true,
      "associationsProvided": true
    }
  },
  "jsonSchema": {
    "name": { "type": "string" },
    "age": { "type": "number" },
    "hairColor": { "type": "string" },
    "skinTone": { "type": "string" }
  },
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
  "timestamp": "2025-11-11T22:00:00.000Z"
}
```

**Example (JSON Object - API v1):**
```bash
curl -X POST http://localhost:3001/field/validate \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "name": "Emma",
      "age": 4,
      "hairColor": "blonde",
      "skinTone": "fair"
    },
    "categoryAssociations": [1, 2, 3]
  }'
```

---

### POST /field/neighbors

**Purpose:** Find similar items (duplicate detection, similarity search)

**Request (JSON Objects - API v1):**
```json
{
  "query": {
    "text": {
      "name": "Emma",
      "age": 4,
      "hairColor": "blonde"
    }
  },
  "candidates": [
    { "id": "order-1", "text": { "name": "Emmy", "age": 4, "hairColor": "blonde" } },
    { "id": "order-2", "text": { "name": "Emma", "age": 5, "hairColor": "blonde" } }
  ],
  "topN": 5
}
```

**Or (JSON Strings - still works):**
```json
{
  "query": {
    "text": "Query text to find similar items"
  },
  "candidates": [
    { "id": "item1", "text": "Candidate text 1" },
    { "id": "item2", "text": "Candidate text 2" }
  ],
  "topN": 5
}
```

**Response:**
```json
{
  "neighbors": [
    { "id": "item1", "score": 0.95 },
    { "id": "item2", "score": 0.82 }
  ],
  "count": 2,
  "topN": 5,
  "timestamp": "2025-11-11T22:00:00.000Z"
}
```

**Example (JSON Objects - API v1):**
```bash
curl -X POST http://localhost:3001/field/neighbors \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "text": {
        "name": "Emma",
        "age": 4,
        "hairColor": "blonde",
        "skinTone": "fair"
      }
    },
    "candidates": [
      {
        "id": "order-1",
        "text": {
          "name": "Emmy",
          "age": 4,
          "hairColor": "blonde",
          "skinTone": "fair"
        }
      },
      {
        "id": "order-2",
        "text": {
          "name": "Emma",
          "age": 5,
          "hairColor": "blonde",
          "skinTone": "fair"
        }
      }
    ],
    "topN": 3
  }'
```

---

### POST /field/analyze

**Purpose:** Full content analysis with all 5 layers

**Request:**
```json
{
  "content": "Content to analyze",
  "title": "Optional title"  // Optional
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
    "fieldStrength": 2.15,
    "stability": 0.91,
    "coherence": 0.90,
    "gradient": [0.1, 0.05, -0.02, 0.08]
  },
  "sovereignLogic": {
    "validity": "proven",
    "coherence": 0.90,
    "sovereignty": 0.90
  },
  "timestamp": "2025-11-11T22:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/field/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Complete order analysis: character specs, customization, options"
  }'
```

---

## Integration Examples

### 1. Backend Integration (TypeScript)

**File:** `back-end/src/lib/rbi-service.ts`

```typescript
import axios from 'axios';

const RBI_SERVICE_URL = process.env.RBI_SERVICE_URL || 'http://localhost:3001';

/**
 * Validate order before processing
 */
export async function validateOrder(order: any) {
  // API v1: Send JSON object directly (no stringification needed!)
  const response = await axios.post(`${RBI_SERVICE_URL}/field/validate`, {
    content: order,  // JSON object directly
    categoryAssociations: [1, 2, 3] // Your category IDs
  });
  
  return {
    verified: response.data.verified,
    confidence: response.data.confidence,
    validity: response.data.sovereignLogic.validity,
    coherence: response.data.sovereignLogic.coherence
  };
}

/**
 * Score quality of assets
 */
export async function scoreQuality(content: string) {
  const response = await axios.post(`${RBI_SERVICE_URL}/field/score`, {
    content
  });
  
  return {
    clarity: response.data.clarity,
    coherence: response.data.coherence,
    resonance: response.data.resonance,
    sovereignty: response.data.sovereignty,
    overallScore: (response.data.clarity + response.data.coherence + 
                   response.data.resonance + response.data.sovereignty) / 4
  };
}

/**
 * Find similar orders (duplicate detection)
 */
export async function findSimilarOrders(queryOrder: any, candidateOrders: any[]) {
  // API v1: Send JSON objects directly
  const response = await axios.post(`${RBI_SERVICE_URL}/field/neighbors`, {
    query: { text: queryOrder },  // JSON object directly
    candidates: candidateOrders.map(order => ({
      id: order.id,
      text: order  // JSON object directly
    })),
    topN: 5
  });
  
  return response.data.neighbors;
}

/**
 * Full order analysis
 */
export async function analyzeOrder(order: any) {
  const response = await axios.post(`${RBI_SERVICE_URL}/field/analyze`, {
    content: JSON.stringify(order)
  });
  
  return {
    overallScore: response.data.overallScore,
    signature: response.data.signature,
    fieldDynamics: response.data.fieldDynamics,
    sovereignLogic: response.data.sovereignLogic
  };
}
```

**Usage in API route:**
```typescript
// back-end/src/app/api/orders/[orderId]/route.ts
import { validateOrder, scoreQuality } from '@/lib/rbi-service';

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  const order = await req.json();
  
  // Validate order before processing
  const validation = await validateOrder(order);
  if (!validation.verified) {
    return Response.json({ error: 'Order validation failed' }, { status: 400 });
  }
  
  // Score quality
  const quality = await scoreQuality(JSON.stringify(order));
  
  return Response.json({ validation, quality });
}
```

---

### 2. n8n Workflow Integration

**Add HTTP Request Node:**

1. **Node Type:** HTTP Request
2. **Method:** POST
3. **URL:** `http://localhost:3001/field/validate`
4. **Headers:**
   - `Content-Type: application/json`
5. **Body (JSON):**
```json
{
  "content": "={{ $json.order }}",
  "categoryAssociations": [1, 2, 3]
}
```

**Example n8n workflow step:**
```json
{
  "parameters": {
    "method": "POST",
    "url": "http://localhost:3001/field/validate",
    "authentication": "none",
    "sendBody": true,
    "contentType": "json",
    "bodyParameters": {
      "parameters": [
        {
          "name": "content",
          "value": "={{ JSON.stringify($json.order) }}"
        },
        {
          "name": "categoryAssociations",
          "value": "=[1, 2, 3]"
        }
      ]
    },
    "options": {}
  },
  "name": "RBI Validate Order",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 1,
  "position": [250, 300]
}
```

---

### 3. Environment Variables

**Add to `.env` file:**
```bash
# RBI Architecture Service
RBI_SERVICE_URL=http://localhost:3001

# For production (optional)
RBI_API_KEY=your-api-key-here
```

**For production with authentication:**
```bash
# Add header to requests
x-api-key: your-api-key-here
# OR
Authorization: Bearer your-api-key-here
```

---

## Use Cases for Little Hero Books

### 1. Order Validation (Workflow 1)

**Before expensive AI calls:**
```typescript
// Validate order at intake
const validation = await validateOrder(order);
if (!validation.verified || validation.confidence < 0.8) {
  // Reject or flag for review
  return { error: 'Order validation failed', validation };
}
// Proceed with AI generation
```

### 2. Duplicate Detection (Workflow 2A)

**Prevent duplicate character generation:**
```typescript
// Check for similar orders
const similar = await findSimilarOrders(order, existingOrders);
if (similar.length > 0 && similar[0].score > 0.95) {
  // Reuse existing character
  return { reuse: true, existingOrderId: similar[0].id };
}
// Generate new character
```

### 3. Quality Assurance (Workflow 7)

**Score quality of generated assets:**
```typescript
// Score character consistency
const quality = await scoreQuality(JSON.stringify({
  poses: order.poses,
  characterHash: order.characterHash
}));

if (quality.overallScore < 0.85) {
  // Flag for human review
  return { needsReview: true, quality };
}
// Auto-approve high quality
```

### 4. Pre-Screening (Human Review)

**Auto-approve high-quality orders:**
```typescript
// Pre-screen before human review
const analysis = await analyzeOrder(order);
if (analysis.overallScore >= 0.95 && analysis.sovereignLogic.validity === 'proven') {
  // Auto-approve
  return { autoApproved: true, analysis };
}
// Send to human review
```

---

## Error Handling

**Example error handling:**
```typescript
try {
  const response = await axios.post(`${RBI_SERVICE_URL}/field/validate`, {
    content: JSON.stringify(order)
  });
  
  return response.data;
} catch (error: any) {
  if (error.response) {
    // API error
    console.error('RBI API error:', error.response.data);
    return { error: error.response.data.error || 'Validation failed' };
  } else if (error.request) {
    // Network error
    console.error('RBI service unavailable');
    return { error: 'Service unavailable', fallback: true };
  } else {
    // Other error
    console.error('Error:', error.message);
    return { error: 'Unknown error' };
  }
}
```

---

## Testing

### Test Service Health
```bash
curl http://localhost:3001/health
```

### Test Validation
```bash
curl -X POST http://localhost:3001/field/validate \
  -H "Content-Type: application/json" \
  -d '{"content": "Test order validation"}'
```

### Test Scoring
```bash
curl -X POST http://localhost:3001/field/score \
  -H "Content-Type: application/json" \
  -d '{"content": "Test quality scoring"}'
```

### Test Similarity
```bash
curl -X POST http://localhost:3001/field/neighbors \
  -H "Content-Type: application/json" \
  -d '{
    "query": { "text": "Test query" },
    "candidates": [
      { "id": "1", "text": "Test candidate 1" },
      { "id": "2", "text": "Test candidate 2" }
    ],
    "topN": 2
  }'
```

---

## Production Deployment

### Option 1: Same Server
Run RBI service on same server as Little Hero Books backend.

### Option 2: Separate Service
Deploy RBI service separately and update `RBI_SERVICE_URL` in environment variables.

### Option 3: Docker
```bash
cd rbi-kernel
docker build -t rbi-kernel:2.0.0 .
docker run -p 3001:3001 rbi-kernel:2.0.0
```

---

## API v1 New Endpoints

### Codebase Analysis

**POST /field/analyze/codebase**

Analyze n8n workflows, backend, frontend code:

```bash
curl -X POST http://localhost:3001/field/analyze/codebase \
  -H "Content-Type: application/json" \
  -d '{
    "codebase": {
      "fileTree": [
        { "path": "workflows/order-processing.json", "type": "file", "size": 2048 }
      ],
      "codeFiles": [
        {
          "path": "workflows/order-processing.json",
          "content": "{ \"nodes\": [...] }",
          "language": "json"
        }
      ]
    }
  }'
```

### Batch Operations

**POST /field/batch**

Process multiple orders at once:

```bash
curl -X POST http://localhost:3001/field/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "content": { "name": "Emma", "age": 4 }, "title": "Order 1" },
      { "content": { "name": "Alex", "age": 5 }, "title": "Order 2" }
    ],
    "operation": "validate"
  }'
```

### Baseline Management

**Store baseline for drift detection:**

```bash
# Store baseline
curl -X POST http://localhost:3001/field/baseline \
  -H "Content-Type: application/json" \
  -d '{
    "id": "character-baseline",
    "name": "Character Spec Baseline",
    "resonanceVector": { "x": 0.5, "y": 0.5, "z": 0.5, "w": 0.5 }
  }'

# Compare against baseline
curl -X POST http://localhost:3001/field/baseline/compare \
  -H "Content-Type: application/json" \
  -d '{
    "baselineId": "character-baseline",
    "content": { "name": "Emma", "age": 4 }
  }'
```

See [API v1 Implementation Guide](../../API_V1_IMPLEMENTATION_GUIDE.md) for complete details.

---

## Next Steps

1. **Start RBI service:** `cd rbi-architecture-service && npm run dev`
2. **Test endpoints:** Use curl examples above
3. **Add to backend:** Create `rbi-service.ts` file (updated examples above)
4. **Integrate in workflows:** Add validation calls before expensive operations
5. **Use API v1 features:** JSON objects, batch operations, codebase analysis
6. **Test integration:** Verify responses match expected formats

---

## Support

- **RBI-Kernel README:** See [RBI-Kernel README](../../README.md) for complete documentation
- **API Reference:** See [RBI Architecture Documentation](../../docs/RBI_ARCHITECTURE_COMPLETE.md)
- **Service Mode:** See [Service Mode](../../README.md#service-mode) for running RBI as an API

---

**Ready to integrate?** Start with order validation, then expand to other workflows.

