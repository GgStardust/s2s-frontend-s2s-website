# RBI Kernel - Plugin Mode Usage

## Overview

While RBI Kernel is designed as a **field-level coherence architecture**, it can be used in plugin mode for integration into existing systems.

## Plugin Mode vs Architecture Mode

### Architecture Mode (Recommended)
- Use the complete 5-layer architecture
- Access field operations directly
- Full control over coherence computation
- Import from `kernel.ts`

### Plugin Mode
- Use RBI Kernel as a service/plugin
- Access through REST API endpoints
- Simplified integration
- No direct architecture access

---

## Local Plugin SDK Mode (Integration SDK)

### Local Plugin SDK Mode

RBI can also operate as a **local plugin SDK** through `@rbi/plugin`.

This mode is ideal for environments like Tableau, ETL pipelines, or web apps that need coherence verification **without a network service**.

#### Example

```typescript
import { RBIPlugin } from '@rbi/plugin'

const plugin = new RBIPlugin({ endpoint: 'https://rbi.local' })

plugin.on('coherenceUpdate', (result) => console.log('Coherence:', result.coherence))

const result = await plugin.evaluate({
  session_id: 'abc123',
  user_behavior: [0.9, 0.8, 0.7]
})
```

#### Comparison with REST Mode

| Feature | REST API Plugin | Local SDK Plugin |
|---------|----------------|------------------|
| Access | HTTP requests | Local import |
| Performance | Dependent on network | Instant |
| Integration | External systems | Embedded systems |
| Customization | Limited | Full field access |
| Use Case | Isolated RBI microservice | Embedded in analytics or data platforms |

---

## Plugin Mode Integration

### REST API Integration

RBI Kernel provides REST API endpoints that can be integrated into any system:

#### Field-Level Endpoints (`/rbi/*`)

```bash
# Calculate resonance score
POST /rbi/score
{
  "resonanceVectors": {
    "vector1": { "x": 0.8, "y": 0.7, "z": 0.9, "w": 0.6 },
    "vector2": { "x": 0.7, "y": 0.8, "z": 0.6, "w": 0.9 },
    "orbAssociations": [1, 2, 3]
  }
}

# Find similar items
POST /rbi/neighbors
{
  "query": {
    "resonanceVector": { "x": 0.8, "y": 0.7, "z": 0.9, "w": 0.6 },
    "orbAssociations": [1, 2]
  },
  "candidates": [...],
  "topN": 10
}

# Analyze content
POST /rbi/analyze
{
  "content": "Your content here",
  "title": "Optional title"
}

# Verify coherence
POST /rbi/verify-consciousness
{
  "content": "Your content here",
  "orbAssociations": [1, 2, 3]
}
```

#### Generic Endpoints (`/api/*`)

```bash
# Calculate similarity (domain-agnostic)
POST /api/similarity
{
  "vector1": {
    "dimension1": 0.8,
    "dimension2": 0.7,
    "dimension3": 0.9,
    "dimension4": 0.6
  },
  "vector2": {
    "dimension1": 0.7,
    "dimension2": 0.8,
    "dimension3": 0.6,
    "dimension4": 0.9
  },
  "categories": [1, 2, 3]
}

# Verify integrity (domain-agnostic)
POST /api/verify-integrity
{
  "content": "Your content here",
  "categories": [1, 2, 3]
}
```

---

## Integration Examples

### JavaScript/TypeScript

```typescript
// Using fetch
const response = await fetch('http://localhost:3000/rbi/score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resonanceVectors: {
      vector1: { x: 0.8, y: 0.7, z: 0.9, w: 0.6 },
      vector2: { x: 0.7, y: 0.8, z: 0.6, w: 0.9 }
    }
  })
});

const result = await response.json();
console.log(result.score);
```

### Python

```python
import requests

response = requests.post('http://localhost:3000/rbi/score', json={
    'resonanceVectors': {
        'vector1': {'x': 0.8, 'y': 0.7, 'z': 0.9, 'w': 0.6},
        'vector2': {'x': 0.7, 'y': 0.8, 'z': 0.6, 'w': 0.9}
    }
})

result = response.json()
print(result['score'])
```

### cURL

```bash
curl -X POST http://localhost:3000/rbi/score \
  -H "Content-Type: application/json" \
  -d '{
    "resonanceVectors": {
      "vector1": {"x": 0.8, "y": 0.7, "z": 0.9, "w": 0.6},
      "vector2": {"x": 0.7, "y": 0.8, "z": 0.6, "w": 0.9}
    }
  }'
```

---

## Deployment as Plugin

### Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Environment Variables

```bash
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

---

## Limitations of Plugin Mode

When using RBI Kernel in plugin mode:

1. **No Direct Architecture Access:** Cannot access field layers directly
2. **Network Overhead:** All operations go through HTTP
3. **Limited Customization:** Cannot customize layer operations
4. **Dependency on Service:** Requires RBI Kernel service to be running

---

## When to Use Plugin Mode

Use plugin mode when:
- Integrating into systems that cannot import TypeScript/JavaScript modules
- Need simple REST API integration
- Multiple services need to share RBI Kernel
- Want to isolate RBI Kernel in a separate service

---

## When to Use Architecture Mode

Use architecture mode when:
- Building applications in TypeScript/JavaScript
- Need direct access to field operations
- Want to customize layer behavior
- Need maximum performance (no network overhead)

---

## Migration from Plugin to Architecture

To migrate from plugin mode to architecture mode:

1. Install RBI Kernel as a dependency
2. Import from `kernel.ts` instead of using HTTP
3. Replace API calls with direct function calls
4. Remove network dependencies

```typescript
// Before (Plugin Mode)
const response = await fetch('/rbi/score', {...});
const result = await response.json();

// After (Architecture Mode)
import { FieldComputation } from 'rbi-kernel';
const score = FieldComputation.computeResonance({...});
```

---

## Best Practices

1. **Use Architecture Mode When Possible:** Better performance and flexibility
2. **Use Plugin Mode for Integration:** When architecture mode is not feasible
3. **Cache Results:** In plugin mode, cache frequently used computations
4. **Error Handling:** Handle network errors in plugin mode
5. **Rate Limiting:** Implement rate limiting for plugin mode endpoints

---

## References

- Architecture Documentation: `docs/architecture.md`
- API Documentation: `docs/openapi.yaml`
- Kernel Export: `src/kernel.ts`

