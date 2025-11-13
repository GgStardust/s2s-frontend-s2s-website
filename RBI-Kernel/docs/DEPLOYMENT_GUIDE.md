# RBI Kernel Deployment Guide

**Version:** 1.0.0  
**Date:** 2025-11-11

---

## Overview

This guide covers deployment options for the RBI Kernel, including local development, npm package usage, and production deployment.

---

## Prerequisites

- **Node.js:** 20.x or higher
- **npm:** 9.x or higher (or yarn/pnpm)
- **TypeScript:** 5.x (included as dev dependency)

---

## Local Development Setup

### 1. Clone or Navigate to RBI-Kernel

```bash
cd RBI-Kernel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` with hot reload enabled.

### 5. Verify Installation

```bash
# Health check
curl http://localhost:3000/health

# Should return:
# {"status":"ok","service":"rbi-kernel","version":"1.0.0",...}
```

---

## Using as npm Package (Local File Dependency)

### 1. Install as Local Dependency

In your project's `package.json`:

```json
{
  "dependencies": {
    "rbi-kernel": "file:../RBI-Kernel"
  }
}
```

Then run:
```bash
npm install
```

### 2. Import and Use

```typescript
// Import architecture layers
import { 
  FieldComputation, 
  FieldValidation, 
  Mathematics,
  KernelManifest 
} from 'rbi-kernel';

// Import specific modules
import { ResonanceVectorMath } from 'rbi-kernel/mathematics';
import { EnhancedResonanceEngine } from 'rbi-kernel/field';
import type { ResonanceVector } from 'rbi-kernel/types';

// Use the kernel
const engine = EnhancedResonanceEngine.getInstance();
const analysis = await engine.analyzeContentWithMathematics(content);
```

### 3. Build Your Project

Ensure RBI-Kernel is built before building your project:

```bash
cd RBI-Kernel && npm run build && cd ..
npm run build  # Your project
```

---

## Using as npm Package (Published)

### 1. Install from npm (when published)

```bash
npm install rbi-kernel
```

### 2. Import and Use

Same as local file dependency (see above).

---

## Docker Deployment

### 1. Build Docker Image

```bash
cd RBI-Kernel
docker build -t rbi-kernel:1.0.0 .
```

### 2. Run Container

```bash
docker run -p 3000:3000 rbi-kernel:1.0.0
```

### 3. Docker Compose (if available)

```yaml
version: '3.8'
services:
  rbi-kernel:
    build: ./RBI-Kernel
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - HOST=0.0.0.0
```

---

## Production Deployment

### Environment Variables

```bash
PORT=3000          # Server port (default: 3000)
HOST=0.0.0.0       # Server host (default: 0.0.0.0)
NODE_ENV=production # Environment mode
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

Or using PM2:

```bash
pm2 start dist/index.js --name rbi-kernel
```

### Using Systemd (Linux)

Create `/etc/systemd/system/rbi-kernel.service`:

```ini
[Unit]
Description=RBI Kernel Service
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/RBI-Kernel
ExecStart=/usr/bin/node dist/index.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl start rbi-kernel
sudo systemctl enable rbi-kernel
```

---

## Integration with Existing Projects

### S2S CMS Integration

**Location:** `S2S File Processing at Cursor/CLEANED_SYSTEM/`

**Setup:**
1. Add to `package.json`:
   ```json
   {
     "dependencies": {
       "rbi-kernel": "file:../../RBI-Kernel"
     }
   }
   ```

2. Install:
   ```bash
   npm install
   ```

3. Use wrapper files (already set up):
   ```typescript
   import { EnhancedResonanceEngine } from '@/lib/mathematics/enhanced-resonance-engine';
   ```

### Field Console Integration

**Location:** `S2S File Processing at Cursor/CLEANED_SYSTEM/field-console/`

**Setup:**
1. Add to `package.json`:
   ```json
   {
     "dependencies": {
       "rbi-kernel": "file:../../../../RBI-Kernel"
     }
   }
   ```

2. Install:
   ```bash
   npm install
   ```

3. Use directly:
   ```typescript
   import { ResonanceVectorMath } from 'rbi-kernel';
   ```

---

## Version Management

### Current Version

- **Package Version:** 1.0.0 (in `package.json`)
- **Kernel Manifest Version:** 1.0.0 (in `src/kernel.ts`)

### Version Consistency

Ensure version consistency across:
- `package.json` - `version` field
- `src/kernel.ts` - `KernelManifest.architecture.version`
- Documentation files
- Git tags (when repository is initialized)

### Updating Version

1. Update `package.json`:
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. Update `src/kernel.ts`:
   ```typescript
   export const KernelManifest = {
     architecture: {
       version: '1.0.1',
       // ...
     }
   }
   ```

3. Rebuild:
   ```bash
   npm run build
   ```

---

## Testing

### Run Tests

```bash
npm run test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Watch Mode

```bash
npm run test:watch
```

---

## Troubleshooting

### Build Issues

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

### Import Issues

**Problem:** Cannot find module 'rbi-kernel'

**Solution:**
1. Ensure RBI-Kernel is built: `cd RBI-Kernel && npm run build`
2. Ensure dependency is installed: `npm install`
3. Check `package.json` has correct path: `"rbi-kernel": "file:../RBI-Kernel"`

### Port Already in Use

**Problem:** Port 3000 already in use

**Solution:**
```bash
# Use different port
PORT=3001 npm run dev
```

### Module Resolution Errors

**Problem:** Cannot resolve exports from 'rbi-kernel'

**Solution:**
1. Check `package.json` exports field is correct
2. Ensure using correct import paths:
   - `rbi-kernel` - Main manifest
   - `rbi-kernel/mathematics` - Mathematics exports
   - `rbi-kernel/field` - Field computation exports
   - `rbi-kernel/types` - Type exports

---

## Performance Considerations

### Optimization

- **Build Optimization:** TypeScript compilation with optimizations
- **Runtime Performance:** Singleton pattern for engines
- **Memory Management:** Efficient vector operations

### Scaling

For high-traffic deployments:
- Use load balancer
- Deploy multiple instances
- Consider caching for repeated computations
- Monitor performance metrics

---

## Security

### Current Status

- No authentication required (development)
- No rate limiting (development)
- Input validation on all endpoints

### Production Recommendations

1. **Add Authentication:**
   - API key authentication
   - OAuth 2.0
   - JWT tokens

2. **Add Rate Limiting:**
   - Per-IP limits
   - Per-API-key quotas
   - Tiered access levels

3. **Input Validation:**
   - Sanitize all inputs
   - Validate request sizes
   - Enforce content type validation

4. **HTTPS:**
   - Use TLS/SSL in production
   - Secure API endpoints
   - Protect sensitive data

---

## Monitoring

### Health Checks

Monitor the health endpoint:
```bash
curl http://localhost:3000/health
```

### Logging

The server uses Fastify's built-in logger. Configure logging level:

```typescript
const fastify = Fastify({
  logger: {
    level: 'info' // 'debug' | 'info' | 'warn' | 'error'
  }
});
```

### Metrics

Consider adding:
- Request count metrics
- Response time metrics
- Error rate metrics
- Computation performance metrics

---

## Backup and Recovery

### Backup Strategy

1. **Code:** Git repository (when initialized)
2. **Configuration:** Environment variables
3. **Data:** No persistent data (stateless service)

### Recovery

1. Restore from git repository
2. Rebuild: `npm run build`
3. Restart service

---

## Support

### Documentation

- **Architecture:** `docs/ARCHITECTURE_OVERVIEW.md`
- **API Reference:** `docs/TECHNICAL/API_REFERENCE.md`
- **Theoretical Foundations:** `docs/THEORETICAL/FOUNDATIONS.md`
- **Testing:** `TEST_RESULTS.md`

### Issues

For issues or questions:
1. Check documentation
2. Review test results
3. Check migration notes: `RBI_LOCAL_MIGRATION_NOTES.md`

---

## Git Tagging (When Repository Initialized)

### Create Version Tag

```bash
# Ensure all changes are committed
git add .
git commit -m "RBI-Kernel v1.0.0 — Consolidated architecture & test suite"

# Create annotated tag
git tag -a v1.0.0 -m "RBI-Kernel v1.0.0 Release"

# Push tag to origin
git push origin v1.0.0
```

### Verify Tag

```bash
git tag -l
git show v1.0.0
```

---

## Next Steps

After deployment:

1. ✅ Verify health endpoint responds
2. ✅ Test API endpoints
3. ✅ Monitor performance
4. ✅ Set up authentication (production)
5. ✅ Configure rate limiting (production)
6. ✅ Set up monitoring and alerts

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-11

