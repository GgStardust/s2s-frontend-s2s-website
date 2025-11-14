# RBI Kernel Testing Guide

## Quick Start

### 1. Start the Service
```bash
cd rbi-service
npm run dev
```

### 2. Test Health Check
```bash
curl http://localhost:3000/health
```

### 3. Test API Endpoints

#### Analyze Content
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"content": "Test content for analysis"}'
```

#### Calculate Similarity
```bash
curl -X POST http://localhost:3000/api/similarity \
  -H "Content-Type: application/json" \
  -d '{
    "vector1": {"dimension1": 0.8, "dimension2": 0.9, "dimension3": 0.85, "dimension4": 0.8},
    "vector2": {"dimension1": 0.7, "dimension2": 0.8, "dimension3": 0.9, "dimension4": 0.75}
  }'
```

#### Verify Integrity
```bash
curl -X POST http://localhost:3000/api/verify-integrity \
  -H "Content-Type: application/json" \
  -d '{"content": "Content to verify", "categories": [1, 2, 3]}'
```

---

## Test Examples

See `test-examples.http` for complete test suite with REST Client extension.

---

## Expected Responses

### Analyze Response
```json
{
  "overall_score": 0.82,
  "dimensions": {
    "dimension1": 0.8,
    "dimension2": 0.9,
    "dimension3": 0.85,
    "dimension4": 0.8
  },
  "categories": [1, 2, 13],
  "analysis": {...}
}
```

### Similarity Response
```json
{
  "similarity": 0.87,
  "method": "similarity_with_categories",
  "timestamp": "..."
}
```

---

## Troubleshooting

### Service Not Starting
- Check Node.js version (20+)
- Check port 3000 availability
- Check for TypeScript errors: `npm run typecheck`

### Endpoint Errors
- Verify service is running
- Check request format
- Check authentication (if enabled)

---

## Next Steps

Once tests pass, see `SETUP.md` for deployment instructions.

