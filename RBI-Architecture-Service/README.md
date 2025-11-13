# RBI Architecture Service

**Version:** 1.1.0-service

Continuously running coherence architecture service that provides field-level coherence computation accessible to all connected systems (CMS, Console, Editorial Tools, Website).

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

- **GET /health** - Health check (no auth required)
- **GET /metrics** - Service metrics (requires auth)
- **POST /field/score** - Returns clarity, coherence, resonance, sovereignty
- **GET /field/status** - Returns service uptime and active fields (no auth required)
- **POST /field/validate** - Runs Proof-of-Meaning verification

See [docs/LIVE_SERVICE_OVERVIEW.md](./docs/LIVE_SERVICE_OVERVIEW.md) for complete API documentation.

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

Pre-built adapters for easy integration:

- **CMSAdapter** - For S2S CMS
- **ConsoleAdapter** - For Field Console
- **EditorAdapter** - For Editorial Tools

See [docs/LIVE_SERVICE_OVERVIEW.md](./docs/LIVE_SERVICE_OVERVIEW.md) for connection guides.

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

