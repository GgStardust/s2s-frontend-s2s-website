# RBI Kernel API Reference

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000` (development)

---

## Overview

The RBI Kernel provides two sets of API endpoints:

1. **Generic API** (`/api/*`) - General-purpose coherence and similarity endpoints
2. **S2S API** (`/rbi/*`) - RBI-specific endpoints with Orb system integration

---

## Generic API Endpoints

### POST /api/similarity

Calculate similarity between two 4D vectors.

**Request:**
```json
{
  "vector1": {
    "dimension1": 0.8,
    "dimension2": 0.9,
    "dimension3": 0.85,
    "dimension4": 0.8
  },
  "vector2": {
    "dimension1": 0.7,
    "dimension2": 0.8,
    "dimension3": 0.9,
    "dimension4": 0.75
  },
  "categories": [1, 2, 3]  // Optional: Orb associations
}
```

**Response:**
```json
{
  "similarity": 0.87,
  "method": "similarity_with_categories",
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request

---

### POST /api/analyze

Analyze content across 4 dimensions with full mathematical layer.

**Request:**
```json
{
  "content": "Your content here for resonance analysis",
  "title": "Optional title"
}
```

**Response:**
```json
{
  "overall_score": 0.82,
  "dimensions": {
    "dimension1": 0.8,  // Clarity
    "dimension2": 0.9,  // Coherence
    "dimension3": 0.85, // Resonance
    "dimension4": 0.8   // Sovereignty
  },
  "categories": [1, 2, 13],
  "analysis": {
    "vector": {
      "x": 0.8,
      "y": 0.9,
      "z": 0.85,
      "w": 0.8
    },
    "harmonicFrequency": {
      "fundamental": 0.5,
      "harmonics": [1.0, 1.5, 2.0, 2.5],
      "dissonance": 0.2,
      "spectralDensity": 0.75
    },
    "coherenceMatrix": {
      "rank": 3,
      "size": 3
    },
    "contextDynamics": {
      "strength": 2.1,
      "stability": 0.9,
      "coherence": 0.85,
      "gradient": [0.8, 0.9, 0.85, 0.8]
    },
    "verification": {
      "validity": "proven",
      "coherence": 0.85,
      "integrity": 0.8
    }
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (missing content)

---

### POST /api/verify-integrity

Verify content integrity and coherence using Proof-of-Meaning.

**Request:**
```json
{
  "content": "Content to verify for structural integrity",
  "categories": [1, 2, 3]  // Optional: Orb associations
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
    "gradient": [0.8, 0.9, 0.85, 0.8],
    "stability": 0.9,
    "coherence": 0.85
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request

---

### POST /api/vector

Convert content to 4D resonance vector.

**Request:**
```json
{
  "content": "Content to convert to resonance vector"
}
```

**Response:**
```json
{
  "vector": {
    "dimension1": 0.8,  // Clarity
    "dimension2": 0.9,  // Coherence
    "dimension3": 0.85, // Resonance
    "dimension4": 0.8   // Sovereignty
  },
  "metadata": {
    "categories": [1, 2, 13],
    "contextStrength": 2.1,
    "stability": 0.9,
    "coherence": 0.85
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request

---

### POST /api/find-similar

Find similar items using 4D vectors.

**Request:**
```json
{
  "query": {
    "vector": {
      "dimension1": 0.8,
      "dimension2": 0.9,
      "dimension3": 0.85,
      "dimension4": 0.8
    },
    "categories": [1, 2, 3]  // Optional
  },
  "candidates": [
    {
      "id": "item1",
      "vector": {...},
      "categories": [1, 2]
    }
  ],
  "topN": 5,
  "useCategories": true
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "item1",
      "score": 0.95,
      "coherence": 0.9,
      "contextDynamics": {...}
    }
  ],
  "count": 1,
  "topN": 5,
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request

---

## S2S API Endpoints (RBI-Specific)

### POST /rbi/score

Calculate resonance score from various input types.

**Request Options:**

**Option 1: Resonance Parameters**
```json
{
  "vectorSimilarity": 0.8,
  "orbOverlap": 0.7,
  "temporalDecay": 0.9
}
```

**Option 2: Vectors**
```json
{
  "vectors": {
    "vector1": [0.8, 0.9, 0.85, 0.8],
    "vector2": [0.7, 0.8, 0.9, 0.75]
  }
}
```

**Option 3: Texts**
```json
{
  "texts": {
    "text1": "First text content",
    "text2": "Second text content"
  }
}
```

**Option 4: Resonance Vectors with Orbs**
```json
{
  "resonanceVectors": {
    "vector1": {
      "x": 0.8, "y": 0.9, "z": 0.85, "w": 0.8
    },
    "vector2": {
      "x": 0.7, "y": 0.8, "z": 0.9, "w": 0.75
    },
    "orbAssociations": [1, 2, 3]
  }
}
```

**Response:**
```json
{
  "score": 0.85,
  "method": "resonance",
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request

---

### POST /rbi/neighbors

Find top-N most similar items using RBI algorithms.

**Request:**
```json
{
  "query": {
    "text": "Query text for neighbor search",
    "vector": {...},  // Optional: 4D resonance vector
    "orbAssociations": [1, 2, 3]  // Optional
  },
  "candidates": [
    {
      "id": "item1",
      "text": "Candidate text",
      "vector": {...},  // Optional
      "orbAssociations": [1, 2]  // Optional
    }
  ],
  "topN": 10,
  "useResonance": false,
  "useOrbSystem": false
}
```

**Response:**
```json
{
  "neighbors": [
    {
      "id": "item1",
      "score": 0.95,
      "metadata": {
        "vectorSimilarity": 0.95,
        "orbOverlap": 0.8
      }
    }
  ],
  "count": 1,
  "topN": 10,
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (missing query or candidates)

---

### POST /rbi/analyze

Full RBI analysis with all mathematical components.

**Request:**
```json
{
  "content": "Content for full RBI analysis",
  "title": "Optional title",
  "orbAssociations": [1, 2, 3]  // Optional
}
```

**Response:**
```json
{
  "overall_score": 0.82,
  "signature": {
    "clarity": 0.8,
    "coherence": 0.9,
    "resonance": 0.85,
    "sovereignty": 0.8
  },
  "orb_associations": [1, 2, 13],
  "mathematical": {
    "resonanceVector": {
      "x": 0.8, "y": 0.9, "z": 0.85, "w": 0.8
    },
    "harmonicFrequency": {...},
    "coherenceMatrix": {...},
    "fieldDynamics": {...},
    "sovereignLogic": {
      "validity": "proven",
      "coherence": 0.85,
      "sovereignty": 0.8
    }
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request

---

### POST /rbi/verify-consciousness

Consciousness verification using Sovereign Logic.

**Request:**
```json
{
  "content": "Content to verify for consciousness coherence",
  "orbAssociations": [1, 2, 3]
}
```

**Response:**
```json
{
  "verified": true,
  "confidence": 0.875,
  "mathematicalProof": "proof_serialization",
  "resonanceVector": {
    "x": 0.8, "y": 0.9, "z": 0.85, "w": 0.8
  },
  "fieldDynamics": {
    "fieldStrength": 2.1,
    "gradient": [0.8, 0.9, 0.85, 0.8],
    "stability": 0.9,
    "coherence": 0.85
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request

---

### POST /rbi/vector

Convert content or signature to 4D resonance vector.

**Request:**
```json
{
  "content": "Content to convert",
  "signature": {...}  // Optional: EnergeticSignature
}
```

**Response:**
```json
{
  "vector": {
    "x": 0.8,  // Clarity
    "y": 0.9,  // Coherence
    "z": 0.85, // Resonance
    "w": 0.8   // Sovereignty
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request

---

## Type Definitions

### ResonanceVector

```typescript
interface ResonanceVector {
  x: number; // Clarity dimension
  y: number; // Coherence dimension
  z: number; // Resonance dimension
  w: number; // Sovereignty dimension
}
```

### EnergeticSignature

```typescript
interface EnergeticSignature {
  clarity: number;
  coherence: number;
  resonance: number;
  sovereignty: number;
}
```

### EnhancedResonanceAnalysis

```typescript
interface EnhancedResonanceAnalysis {
  overall_score: number;
  signature: EnergeticSignature;
  orb_associations: number[];
  mathematical: {
    resonanceVector: ResonanceVector;
    harmonicFrequency: HarmonicFrequency;
    coherenceMatrix: CoherenceMatrix;
    fieldDynamics: FieldDynamics;
    sovereignLogic: CoherenceProof;
  };
}
```

### CoherenceProof

```typescript
interface CoherenceProof {
  statement: string;
  proof: ProofTerm;
  coherence: number;
  sovereignty: number;
  validity: 'proven' | 'partial' | 'unproven' | 'error';
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message describing what went wrong",
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error

---

## Health Check

### GET /health

Check service health and version.

**Response:**
```json
{
  "status": "ok",
  "service": "rbi-kernel",
  "version": "1.0.0",
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

---

## Root Endpoint

### GET /

Get API information and available endpoints.

**Response:**
```json
{
  "service": "rbi-kernel",
  "version": "1.0.0",
  "description": "RBI Kernel - Field-Level Coherence Architecture",
  "architecture": "5-layer field-level coherence verification framework",
  "endpoints": {
    "rbi": {
      "score": "http://localhost:3000/rbi/score",
      "neighbors": "http://localhost:3000/rbi/neighbors",
      "analyze": "http://localhost:3000/rbi/analyze",
      "verifyConsciousness": "http://localhost:3000/rbi/verify-consciousness",
      "vector": "http://localhost:3000/rbi/vector"
    },
    "generic": {
      "similarity": "http://localhost:3000/api/similarity",
      "analyze": "http://localhost:3000/api/analyze",
      "verifyIntegrity": "http://localhost:3000/api/verify-integrity",
      "vector": "http://localhost:3000/api/vector",
      "findSimilar": "http://localhost:3000/api/find-similar"
    }
  },
  "documentation": "http://localhost:3000/docs/openapi.yaml",
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

---

## Rate Limiting

Currently, no rate limiting is enforced. Future versions may include:
- Per-IP rate limits
- API key-based quotas
- Tiered access levels

---

## Authentication

Currently, no authentication is required. Future versions may include:
- API key authentication
- OAuth 2.0 support
- JWT token validation

---

## OpenAPI Specification

Full OpenAPI 3.0 specification available at:
```
GET /docs/openapi.yaml
```

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11
