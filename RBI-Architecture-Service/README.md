# RBI Architecture Service

**Version:** 1.1.0-service

Continuously running coherence architecture service that provides field-level coherence computation accessible to all connected systems. This is a **generic, domain-agnostic** service that can be used across any application domain (AI, cybersecurity, finance, ecology, governance, education, art, etc.).

**Note:** The service is generic and domain-agnostic. S2S-specific features (like Orbs) are handled at the integration layer, not in the core service.

---

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Service runs on `http://localhost:3001`

### Production Build

```bash
npm run build
npm start
```

---

## Endpoints

### Core Endpoints
- **GET /health** - Health check (no auth required)
- **GET /metrics** - Service metrics (requires auth)
- **GET /field/status** - Returns service uptime and active fields (no auth required)
- **GET /architecture/manifest** - Returns complete 5-layer architecture manifest (no auth required)

### Field Operations
- **POST /field/score** - Returns clarity, coherence, resonance, sovereignty
- **POST /field/validate** - Runs Proof-of-Meaning verification
- **POST /field/neighbors** - Find top-N most similar items (similarity search)
- **POST /field/analyze** - Full content analysis with all 5 layers
- **POST /field/vector** - Convert content to 4D resonance vector

See [docs/LIVE_SERVICE_OVERVIEW.md](./docs/LIVE_SERVICE_OVERVIEW.md) for complete API documentation.
See [docs/DEMO_QUICK_START.md](./docs/DEMO_QUICK_START.md) for demo scenarios.

## Production Features

### API Key Authentication
Set `RBI_API_KEY` environment variable to require authentication. All endpoints except `/health` and `/field/status` require API key in `x-api-key` header or `Authorization: Bearer <key>` header.

### Rate Limiting
- Default: 100 requests per minute per API key/IP
- Configurable via `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS` environment variables
- Rate limit headers included in responses: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Monitoring & Logging
- Request logging with response times
- Metrics endpoint: `/metrics` (requires auth)
- Error logging with stack traces in development mode

### Error Handling
- Centralized error handling middleware
- Consistent error response format
- Request ID support for error tracking

---

## Adapters

Pre-built adapters for easy integration (examples from S2S project):

- **CMSAdapter** - Example adapter for CMS integration
- **ConsoleAdapter** - Example adapter for console integration
- **EditorAdapter** - Example adapter for editorial tools

**Note:** These adapters are examples from the S2S project. You can create your own adapters for your domain. See [docs/LIVE_SERVICE_OVERVIEW.md](./docs/LIVE_SERVICE_OVERVIEW.md) for connection guides.

---

## Deployment

### Vercel

```bash
vercel deploy
```

### Docker

```bash
docker build -t rbi-architecture-service:1.1.0 .
docker run -p 3001:3001 rbi-architecture-service:1.1.0
```

### Docker Compose

```bash
docker-compose up -d
```

---

## Documentation

- [Live Service Overview](./docs/LIVE_SERVICE_OVERVIEW.md) - Complete service documentation
- [Demo Quick Start](./docs/DEMO_QUICK_START.md) - Quick demo guide for partners
- [Demo Scenarios](./docs/DEMO_SCENARIOS.md) - Sector-specific demo scenarios
- [RBI-Kernel Documentation](../RBI-Kernel/docs/) - Core architecture documentation

---

## Dependencies

- **rbi-kernel** - RBI Kernel v1.0.0 (local file dependency)
- **express** - Web framework
- **dotenv** - Environment configuration

---

## License

ISC (Stardust-UNA-1.0)

---

**Service Version:** 1.1.0-service  
**RBI-Kernel Version:** 1.0.0

