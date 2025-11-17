# RBI Integration Guide for OpenAI

**Step-by-step implementation guide with exact API formats**

---

## Quick Start

### 1. Set Up RBI Architecture Service

```bash
# RBI Architecture Service should be running
# Default: http://localhost:3001
# Production: https://rbi-service.com (or your hosted instance)
```

### 2. Test RBI Service

```bash
# Health check
curl http://localhost:3001/health

# Should return:
# {"status":"healthy","service":"rbi-architecture-service","version":"2.0.0",...}
```

---

## API Endpoints (Exact Formats)

### POST /field/validate

**Purpose:** Validate GPT output quality and safety

**Request:**
```json
{
  "content": "GPT response text to validate",
  "categoryAssociations": [1, 2, 3]  // Optional: relevant categories
}
```

**Response:**
```json
{
  "verified": true,
  "sovereignLogic": {
    "coherence": 0.92,
    "validity": "valid"
  },
  "confidence": 0.95,
  "proof": "mathematical_validation_proof",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/field/validate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "The capital of France is Paris, a beautiful city known for its art and culture.",
    "categoryAssociations": [1]
  }'
```

---

### POST /field/analyze

**Purpose:** Full coherence analysis of GPT output

**Request:**
```json
{
  "content": "GPT response text to analyze",
  "title": "Optional title for context"
}
```

**Response:**
```json
{
  "overallScore": 0.91,
  "signature": {
    "clarity": 0.95,
    "coherence": 0.92,
    "resonance": 0.88,
    "sovereignty": 0.90
  },
  "mathematical": {
    "sovereignLogic": {
      "coherence": 0.92,
      "validity": "valid"
    }
  },
  "fieldDynamics": {
    "stability": 0.89,
    "continuity": 0.91
  },
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

## Backend Integration

### Python Example (OpenAI API Handler)

```python
import httpx
import os
from typing import Optional, Dict

RBI_API_URL = os.getenv('RBI_API_URL', 'http://localhost:3001')
RBI_API_KEY = os.getenv('RBI_API_KEY')  # Optional

class RBIService:
    def __init__(self):
        self.base_url = RBI_API_URL
        self.headers = {
            'Content-Type': 'application/json'
        }
        if RBI_API_KEY:
            self.headers['x-api-key'] = RBI_API_KEY
    
    async def validate_response(
        self, 
        content: str, 
        category_associations: Optional[list] = None
    ) -> Dict:
        """Validate GPT output quality"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.post(
                    f"{self.base_url}/field/validate",
                    json={
                        "content": content,
                        "categoryAssociations": category_associations or []
                    },
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"RBI validation failed: {e}")
            # Fallback: return valid (don't block on RBI failure)
            return {
                "verified": True,
                "sovereignLogic": {"coherence": 0.5, "validity": "unknown"},
                "confidence": 0.5
            }
    
    async def analyze_response(self, content: str, title: Optional[str] = None) -> Dict:
        """Full coherence analysis of GPT output"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.post(
                    f"{self.base_url}/field/analyze",
                    json={
                        "content": content,
                        "title": title
                    },
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"RBI analysis failed: {e}")
            return None

# Usage in OpenAI API handler
rbi_service = RBIService()

async def handle_gpt_response(gpt_response: str) -> Dict:
    """Process GPT response with RBI validation"""
    
    # Validate response quality
    validation = await rbi_service.validate_response(gpt_response)
    
    # Check if response meets quality threshold
    if validation.get("sovereignLogic", {}).get("validity") != "valid":
        # Option 1: Filter low-quality response
        # return {"error": "Response quality too low"}
        
        # Option 2: Request regeneration
        # return await regenerate_response()
        
        # Option 3: Log and allow (with warning)
        print(f"Low quality response detected: {validation}")
    
    # Return validated response with metadata
    return {
        "response": gpt_response,
        "validation": {
            "verified": validation.get("verified", False),
            "coherence": validation.get("sovereignLogic", {}).get("coherence", 0),
            "confidence": validation.get("confidence", 0),
            "proof": validation.get("proof")
        }
    }
```

---

## Frontend Integration (Optional)

### JavaScript/TypeScript Example

```typescript
const RBI_API_URL = process.env.RBI_API_URL || 'http://localhost:3001';

async function validateGPTResponse(response: string): Promise<ValidationResult> {
  try {
    const res = await fetch(`${RBI_API_URL}/field/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: response })
    });
    
    const validation = await res.json();
    return {
      valid: validation.verified,
      coherence: validation.sovereignLogic?.coherence || 0,
      confidence: validation.confidence || 0
    };
  } catch (error) {
    console.error('RBI validation failed:', error);
    return { valid: true, coherence: 0.5, confidence: 0.5 }; // Fallback
  }
}
```

---

## Environment Configuration

### .env file

```bash
# RBI Service Configuration
RBI_API_URL=http://localhost:3001
RBI_API_KEY=your-api-key-here  # Optional for production

# OpenAI Configuration (existing)
OPENAI_API_KEY=your-openai-key
```

---

## Error Handling

### Graceful Fallback Pattern

```python
async def validate_with_fallback(content: str) -> Dict:
    """Validate with graceful fallback"""
    try:
        validation = await rbi_service.validate_response(content)
        return validation
    except httpx.TimeoutException:
        # Timeout: allow response (don't block)
        print("RBI timeout: allowing response")
        return {"verified": True, "sovereignLogic": {"validity": "unknown"}}
    except httpx.HTTPError:
        # HTTP error: allow response (don't block)
        print("RBI error: allowing response")
        return {"verified": True, "sovereignLogic": {"validity": "unknown"}}
    except Exception as e:
        # Unknown error: log and allow
        print(f"RBI validation error: {e}")
        return {"verified": True, "sovereignLogic": {"validity": "unknown"}}
```

---

## Performance Optimization

### Caching Strategy

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
async def cached_validate(content_hash: str, content: str) -> Dict:
    """Cache validation results for identical content"""
    return await rbi_service.validate_response(content)

async def validate_cached(content: str) -> Dict:
    """Validate with caching"""
    content_hash = hashlib.md5(content.encode()).hexdigest()
    return await cached_validate(content_hash, content)
```

### Async Processing

```python
import asyncio

async def process_responses_async(responses: list) -> list:
    """Process multiple responses in parallel"""
    tasks = [rbi_service.validate_response(r) for r in responses]
    return await asyncio.gather(*tasks, return_exceptions=True)
```

---

## Testing

### Unit Test Example

```python
import pytest
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_rbi_validation():
    with patch('rbi_service.validate_response') as mock_validate:
        mock_validate.return_value = {
            "verified": True,
            "sovereignLogic": {"coherence": 0.92, "validity": "valid"}
        }
        
        result = await handle_gpt_response("Test response")
        assert result["validation"]["verified"] == True
        assert result["validation"]["coherence"] == 0.92
```

---

## Deployment

### Production Configuration

1. **Set up RBI Architecture Service:**
   - Deploy to production infrastructure
   - Configure API key authentication
   - Set up monitoring and logging

2. **Update OpenAI API:**
   - Add RBI service URL to environment variables
   - Deploy updated API handlers
   - Monitor performance metrics

3. **Gradual Rollout:**
   - Start with 10% of traffic
   - Monitor performance and quality
   - Gradually increase to 100%

---

## Monitoring

### Key Metrics

- **Validation Rate:** % of responses validated
- **Quality Score:** Average coherence score
- **Response Time:** RBI validation latency
- **Error Rate:** RBI service errors
- **Cost Savings:** Verification cost reduction

---

**See [integration-snippet.ts](./integration-snippet.ts) for complete code example.**

