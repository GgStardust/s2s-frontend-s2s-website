# API Response Format Standard

**Unified response format for all CMS_Backend API endpoints**

---

## Standard Response Structure

All API responses follow this structure:

```typescript
{
  content: string;              // Primary content/response
  metadata: {                   // Request/response metadata
    [key: string]: any;
  };
  rbi_output?: {                // RBI analysis results (when applicable)
    resonanceVector?: {
      x: number;  // clarity
      y: number;  // coherence
      z: number;  // resonance
      w: number;  // sovereignty
    };
    fieldDynamics?: {
      fieldStrength: number;
      stability: number;
      coherence: number;
    };
    proofStatus?: 'proven' | 'partial' | 'unproven' | 'error';
    coherenceScore?: number;
  };
}
```

---

## Endpoint-Specific Formats

### `/api/ai/conversation`

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Your inquiry" }
  ],
  "currentContent": "",
  "title": "",
  "orbContext": null,
  "metadata": {}
}
```

**Response:**
```json
{
  "content": "AI-generated response text",
  "metadata": {
    "model": "gpt-4o",
    "timestamp": "2025-01-XX...",
    "orb_associations": [1, 7],
    "tags": ["tag1", "tag2"]
  },
  "rbi_output": {
    "resonanceVector": {
      "x": 0.8,
      "y": 0.9,
      "z": 0.85,
      "w": 0.8
    },
    "proofStatus": "proven",
    "coherenceScore": 0.85
  },
  "orbital_interpretation": {
    "primary_orb": { "id": 7, "name": "Alchemical Current", "score": 0.92 },
    "matched_content": []
  }
}
```

### `/api/console/content`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "content-id",
      "title": "Content Title",
      "content": "Content body...",
      "console_context": "context",
      "console_relation": "relation",
      "orb_associations": [1, 2],
      "tags": ["tag1"]
    }
  ],
  "metadata": {
    "count": 10,
    "filters": {
      "console_context": "context",
      "orb_id": 1
    }
  }
}
```

### `/api/resonance/analyze`

**Response:**
```json
{
  "content": "Analyzed content...",
  "metadata": {
    "title": "Content Title",
    "timestamp": "2025-01-XX..."
  },
  "rbi_output": {
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
    "proofStatus": "proven",
    "coherenceScore": 0.85,
    "validatedOrbs": [1, 7],
    "metrics": {
      "strength": 8,
      "clarity": 9,
      "coherence": 9,
      "pattern": 8
    }
  }
}
```

---

## Error Response Format

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "timestamp": "2025-01-XX...",
  "requestId": "optional-request-id"
}
```

**Status Codes:**
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Migration Notes

**Current State:**
- Most endpoints return unified format
- Some legacy endpoints may have different structures
- Console handles both formats gracefully

**Future:**
- All endpoints will standardize to unified format
- Legacy endpoints will be deprecated
- Console will be updated to expect unified format only

---

## Console Integration

Console components expect:
- `content` - Primary text/content
- `metadata` - Additional metadata
- `rbi_output` - RBI analysis (when available)

Components handle missing fields gracefully with fallbacks.

---

**Status:** Format documented. Implementation in progress across all endpoints.

