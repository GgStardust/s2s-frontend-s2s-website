# Developer Onboarding Guide

**RBI Architecture Service v1.1.0-service**

---

## Quick Start

### 1. Get Your API Key

Contact us to receive your API key for the RBI Architecture Service.

### 2. Make Your First Request

```bash
curl -X POST https://api.rbi-kernel.com/field/score \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test of the RBI coherence architecture."
  }'
```

### 3. Check Service Status

```bash
curl https://api.rbi-kernel.com/field/status
```

---

## Integration Options

### Option 1: Direct HTTP (Simple)

```typescript
const response = await fetch('https://api.rbi-kernel.com/field/score', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Your content here'
  })
});

const score = await response.json();
console.log(score.clarity, score.coherence, score.resonance, score.sovereignty);
```

### Option 2: Use Adapters (Recommended)

Pre-built adapters available for:
- CMS Integration
- Console Integration
- Editorial Tools

See [LIVE_SERVICE_OVERVIEW.md](./LIVE_SERVICE_OVERVIEW.md) for adapter details.

---

## Core Concepts

### Resonance Vectors

RBI returns 4D resonance vectors:
- **Clarity (x)**: How clear and understandable the content is
- **Coherence (y)**: How well-structured and internally consistent
- **Resonance (z)**: How well it aligns with intended purpose
- **Sovereignty (w)**: How independently valid and self-contained

### Proof-of-Meaning

The `/field/validate` endpoint provides mathematical verification of structural integrity.

---

## Rate Limits

- **Default:** 100 requests per minute
- **Headers:** Check `X-RateLimit-Remaining` to monitor usage
- **Upgrade:** Contact for higher limits

---

## Support

- **Documentation:** [LIVE_SERVICE_OVERVIEW.md](./LIVE_SERVICE_OVERVIEW.md)
- **API Reference:** See endpoints section
- **Issues:** Contact support

---

**Ready to build?** Start with the `/field/score` endpoint and explore from there.

