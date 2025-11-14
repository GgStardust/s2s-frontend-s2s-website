# RBI Kernel Setup Guide

## Prerequisites

- Node.js 20+
- npm or yarn
- TypeScript knowledge (helpful but not required)

---

## Installation

```bash
cd rbi-service
npm install
npm run build
```

---

## Development

```bash
npm run dev
```

Service runs on `http://localhost:3000`

---

## Testing

```bash
# Health check
curl http://localhost:3000/health

# Test endpoint
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"content": "Test content"}'
```

See `TESTING.md` for complete test examples.

---

## Deployment

### Option 1: Railway (Free Tier)
1. Sign up for Railway
2. Connect GitHub repository
3. Deploy automatically
4. Set environment variables

### Option 2: Render (Free Tier)
1. Sign up for Render
2. Connect GitHub repository
3. Deploy automatically
4. Set environment variables

### Option 3: Docker
```bash
docker build -t rbi-service .
docker run -p 3000:3000 rbi-service
```

---

## Environment Variables

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_...
```

---

## Database Setup

### Using Supabase (Free Tier)
1. Sign up for Supabase
2. Create new project
3. Get connection string
4. Set DATABASE_URL environment variable

### Using PostgreSQL
1. Install PostgreSQL
2. Create database
3. Run migrations
4. Set DATABASE_URL

---

## Monitoring

### Health Check
```
GET /health
```

### Metrics
- Response times
- Error rates
- API call counts
- Usage per customer

---

## Security

- API key authentication
- Rate limiting
- Input validation
- Error handling
- HTTPS (production)

---

## Support

For setup issues, see README.md or contact support.

