# RBI Architecture Service - Code Examples

**Practical examples for integrating RBI into your applications**

---

## Basic Usage

### Get Field Score

```typescript
const response = await fetch('https://api.rbi-kernel.com/field/score', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Your content to analyze'
  })
});

const score = await response.json();
console.log('Clarity:', score.clarity);
console.log('Coherence:', score.coherence);
console.log('Resonance:', score.resonance);
console.log('Sovereignty:', score.sovereignty);
```

### Validate Content

```typescript
const response = await fetch('https://api.rbi-kernel.com/field/validate', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Content to validate',
    categoryAssociations: [1, 2, 3] // Optional - domain-specific categories
    // Note: orbAssociations also supported for S2S projects
  })
});

const validation = await response.json();
if (validation.verified) {
  console.log('Content is verified!');
  console.log('Confidence:', validation.confidence);
  console.log('Proof Status:', validation.sovereignLogic.validity);
}
```

---

## Using Adapters

### CMS Adapter

```typescript
import { CMSAdapter } from './adapters/cms-adapter';

const adapter = new CMSAdapter({
  baseUrl: 'https://api.rbi-kernel.com',
  apiKey: 'your-api-key'
});

// Score content
const score = await adapter.pushData('Content to analyze');

// Validate content
const validation = await adapter.validateContent(
  'Content to validate',
  [1, 2, 3] // category associations (domain-specific)
  // Note: For S2S projects, these map to orbAssociations
);
```

### Console Adapter

```typescript
import { ConsoleAdapter } from './adapters/console-adapter';

const adapter = new ConsoleAdapter({
  baseUrl: 'https://api.rbi-kernel.com',
  apiKey: 'your-api-key'
});

// Fetch score for inquiry
const score = await adapter.fetchScore('User inquiry text');
```

---

## Error Handling

```typescript
async function analyzeWithRBI(content: string) {
  try {
    const response = await fetch('https://api.rbi-kernel.com/field/score', {
      method: 'POST',
      headers: {
        'x-api-key': 'your-api-key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key');
      }
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('RBI analysis failed:', error);
    // Fallback logic here
    return null;
  }
}
```

---

## Rate Limit Handling

```typescript
async function analyzeWithRetry(content: string, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch('https://api.rbi-kernel.com/field/score', {
      method: 'POST',
      headers: {
        'x-api-key': 'your-api-key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
      const remaining = response.headers.get('X-RateLimit-Remaining');
      
      console.log(`Rate limited. Remaining: ${remaining}, Retry after: ${retryAfter}s`);
      
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }
}
```

---

## Batch Processing

```typescript
async function analyzeBatch(contents: string[]) {
  const results = await Promise.all(
    contents.map(async (content, index) => {
      try {
        const response = await fetch('https://api.rbi-kernel.com/field/score', {
          method: 'POST',
          headers: {
            'x-api-key': 'your-api-key',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content })
        });

        if (!response.ok) {
          return { index, error: response.status };
        }

        const score = await response.json();
        return { index, score };
      } catch (error) {
        return { index, error: error.message };
      }
    })
  );

  return results;
}
```

---

## Monitoring Service Health

```typescript
async function checkServiceHealth() {
  const response = await fetch('https://api.rbi-kernel.com/health');
  const health = await response.json();
  
  console.log('Service Status:', health.status);
  console.log('Version:', health.version);
  
  return health.status === 'healthy';
}

async function getServiceMetrics(apiKey: string) {
  const response = await fetch('https://api.rbi-kernel.com/metrics', {
    headers: {
      'x-api-key': apiKey
    }
  });

  const metrics = await response.json();
  console.log('Total Requests:', metrics.totalRequests);
  console.log('Error Rate:', metrics.errorRate + '%');
  console.log('Avg Response Time:', metrics.avgResponseTime + 'ms');
  
  return metrics;
}
```

---

## React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useRBIAnalysis(content: string) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!content) return;

    setLoading(true);
    setError(null);

    fetch('https://api.rbi-kernel.com/field/score', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_RBI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    })
      .then(res => res.json())
      .then(data => {
        setScore(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [content]);

  return { score, loading, error };
}

// Usage
function MyComponent() {
  const { score, loading, error } = useRBIAnalysis('Content to analyze');

  if (loading) return <div>Analyzing...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!score) return null;

  return (
    <div>
      <p>Clarity: {score.clarity}</p>
      <p>Coherence: {score.coherence}</p>
      <p>Resonance: {score.resonance}</p>
      <p>Sovereignty: {score.sovereignty}</p>
    </div>
  );
}
```

---

## Node.js Service Example

```typescript
import express from 'express';
import { CMSAdapter } from './adapters/cms-adapter';

const app = express();
app.use(express.json());

const rbiAdapter = new CMSAdapter({
  baseUrl: process.env.RBI_SERVICE_URL || 'https://api.rbi-kernel.com',
  apiKey: process.env.RBI_API_KEY
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { content } = req.body;
    
    const score = await rbiAdapter.pushData(content);
    
    res.json({
      success: true,
      score: {
        clarity: score.clarity,
        coherence: score.coherence,
        resonance: score.resonance,
        sovereignty: score.sovereignty
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000);
```

---

## TypeScript Types

```typescript
interface FieldScore {
  clarity: number;
  coherence: number;
  resonance: number;
  sovereignty: number;
  fieldDynamics: {
    fieldStrength: number;
    stability: number;
    coherence: number;
  };
  timestamp: string;
}

interface ValidationResult {
  verified: boolean;
  confidence: number;
  mathematicalProof: string;
  resonanceVector: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  sovereignLogic: {
    validity: 'proven' | 'partial' | 'unproven';
    coherence: number;
    sovereignty: number;
  };
  timestamp: string;
}
```

---

## Next Steps

- See [DEVELOPER_ONBOARDING.md](./DEVELOPER_ONBOARDING.md) for setup
- See [LIVE_SERVICE_OVERVIEW.md](./LIVE_SERVICE_OVERVIEW.md) for API reference
- Check adapters for framework-specific integration

