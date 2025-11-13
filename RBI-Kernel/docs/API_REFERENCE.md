# RBI Kernel API Reference

## Base URL
```
http://localhost:3000  (development)
https://api.yourdomain.com  (production)
```

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
  "categories": [1, 2, 3]  // Optional
}
```

**Response:**
```json
{
  "similarity": 0.87,
  "method": "similarity_with_categories",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### POST /api/analyze
Analyze content across 4 dimensions.

**Request:**
```json
{
  "content": "Your content here",
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
    "dimension4": 0.8   // Integrity
  },
  "categories": [1, 2, 13],
  "analysis": {
    "vector": {...},
    "harmonicFrequency": {...},
    "coherenceMatrix": {...},
    "contextDynamics": {...},
    "verification": {...}
  }
}
```

---

### POST /api/verify-integrity
Verify content integrity and coherence.

**Request:**
```json
{
  "content": "Content to verify",
  "categories": [1, 2, 3]
}
```

**Response:**
```json
{
  "verified": true,
  "confidence": 0.875,
  "proof": "{...}",
  "vector": {...},
  "contextDynamics": {...}
}
```

---

### POST /api/vector
Convert content to 4D vector.

**Request:**
```json
{
  "content": "Content to convert"
}
```

**Response:**
```json
{
  "vector": {
    "dimension1": 0.8,
    "dimension2": 0.9,
    "dimension3": 0.85,
    "dimension4": 0.8
  },
  "metadata": {
    "categories": [1, 2, 13],
    "contextStrength": 2.1,
    "stability": 0.9,
    "coherence": 0.85
  }
}
```

---

### POST /api/find-similar
Find similar items using 4D vectors.

**Request:**
```json
{
  "query": {
    "vector": {...},
    "categories": [1, 2, 3]
  },
  "candidates": [...],
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
  "topN": 5
}
```

---

## S2S API Endpoints

### POST /rbi/score
Resonance scoring with Orb system.

### POST /rbi/analyze
Full RBI analysis with all mathematical components.

### POST /rbi/verify-consciousness
Consciousness verification using Sovereign Logic.

### POST /rbi/vector
Resonance vector conversion.

### POST /rbi/neighbors
Neighbor finding with Orb system.

---

## Authentication

All endpoints require API key authentication:

```
Authorization: Bearer YOUR_API_KEY
```

Or as header:
```
X-API-Key: YOUR_API_KEY
```

---

## Rate Limiting

- **Free tier**: 1,000 calls/month
- **Starter**: 10,000 calls/month
- **Professional**: 100,000 calls/month
- **Enterprise**: Unlimited

---

## Error Responses

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Support

- **Documentation**: See README.md
- **Examples**: See test-examples.http
- **Support**: support@yourdomain.com

