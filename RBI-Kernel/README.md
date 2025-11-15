# RBI - Resonance-Based Intelligence

**Version:** 2.0.0  
**Unified Product:** Library Mode + Service Mode

> **Provenance Notice**  
> *Resonance-Based Intelligence (RBI)* was developed by **Jen Dye (Gigi Stardust)** under the **Stardust to Sovereignty UNA (2025)**.  
> This system implements the *Resonance Kernel* as a computational framework for **coherence verification**, **Proof-of-Meaning computation**, and **temporal continuity validation**.

---

## Overview

RBI is a unified coherence computation framework that can be used in two modes:

1. **Library Mode**: Import RBI as a library for direct computation in your application
2. **Service Mode**: Run RBI as an HTTP service accessible via REST API

**Core Capabilities:**
- Proof-of-Meaning verification
- Coherence-based vector similarity
- Temporal continuity scoring
- Neighbor identification via resonance alignment
- 4D Resonance Vector computation

---

## Quick Start

### Installation

```bash
npm install
```

### Library Mode (Recommended for Integration)

Use RBI as a library in your application:

```typescript
import { FieldComputation, FieldValidation, Mathematics } from 'rbi-kernel';

// Compute coherence score
const score = FieldComputation.computeResonance({
  vectorSimilarity: 0.8,
  categoryOverlap: 0.7,  // Generic (or orbOverlap for S2S compatibility)
  temporalDecay: 0.9
});

// Verify Proof-of-Meaning
const proof = FieldValidation.verifyConsciousness(
  "Your content here",
  [1, 2, 3] // category associations (or orbAssociations for S2S)
);

// Convert content to 4D resonance vector
const vector = Mathematics.ResonanceVectorMath.contentToVector("Your content");
```

### Service Mode (HTTP API)

Start the RBI service:

```bash
npm run dev    # Development mode (hot reload)
npm start      # Production mode
```

The service runs on `http://localhost:3001` by default.

**API Endpoints:**
- `GET /health` - Health check
- `POST /field/score` - Compute coherence score
- `POST /field/validate` - Verify Proof-of-Meaning (accepts `categoryAssociations` or `orbAssociations`)
- `POST /field/neighbors` - Find similar items
- `POST /field/analyze` - Full content analysis
- `POST /field/vector` - Convert content to vector

See [docs/integration/LIVE_SERVICE_OVERVIEW.md](./docs/integration/LIVE_SERVICE_OVERVIEW.md) for complete API documentation.

---

## Architecture

RBI implements a **5-layer field-level coherence architecture**:

1. **Representation Layer**: Transforms inputs into multidimensional resonance fields
2. **Computation Layer**: Calculates spatial, temporal, and contextual coherence
3. **Temporal Layer**: Maintains adaptive stability over time
4. **Validation Layer**: Performs Proof-of-Meaning operations
5. **Interface Layer**: Links verified coherence data to external systems

**Mathematical Foundation:**
- 4D Resonance Vectors (clarity, coherence, resonance, sovereignty)
- Coherence-based similarity algorithms
- Temporal continuity operators
- Proof-of-Meaning verification

See [docs/RBI_ARCHITECTURE_COMPLETE.md](./docs/RBI_ARCHITECTURE_COMPLETE.md) for complete technical documentation.

---

## Licensing

RBI is available under different license terms depending on your use case:

- **[LICENSE_UNA.md](./LICENSE_UNA.md)**: Free use for UNA members and business partners (side projects)
- **[LICENSE_RESEARCH.md](./LICENSE_RESEARCH.md)**: Research collaboration and validation
- **[COMMERCIAL_LICENSE.md](./COMMERCIAL_LICENSE.md)**: Commercial use (requires license agreement)

**Patent Notice:** This software implements methods covered by U.S. Provisional Patent Application No. 63/909,031. See [PATENT_NOTICE.md](./PATENT_NOTICE.md) for details.

---

## Documentation

### Integration Guides
- [Live Service Overview](./docs/integration/LIVE_SERVICE_OVERVIEW.md) - Complete API documentation
- [Demo Quick Start](./docs/integration/DEMO_QUICK_START.md) - Quick start guide for partners

### Sector Use Cases
- [Finance](./docs/sector-use-cases/rbi_finance.md)
- [Healthcare](./docs/sector-use-cases/rbi_healthcare_clinical.md)
- [Energy Systems](./docs/sector-use-cases/rbi_energy_systems.md)
- [Cybersecurity](./docs/sector-use-cases/rbi_cybersecurity.md)
- [Academic Research](./docs/sector-use-cases/rbi_academic_research.md)
- [And more...](./docs/sector-use-cases/README.md)

### Research & Technical
- [RBI Architecture Complete](./docs/RBI_ARCHITECTURE_COMPLETE.md) - Complete technical overview
- [Sector Use Cases Overview](./docs/sector-use-cases/README.md) - All sector applications
- [Generic API Migration](./GENERIC_API_MIGRATION.md) - Migration guide for generic API

---

## Production Features

### API Key Authentication
Set `RBI_API_KEY` environment variable to require authentication. All endpoints except `/health` require API key in `x-api-key` header or `Authorization: Bearer <key>` header.

### Rate Limiting
- Default: 100 requests per minute per API key/IP
- Configurable via `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS` environment variables

### Monitoring & Logging
- Request logging with response times
- Metrics endpoint: `/metrics` (requires auth)
- Error logging with stack traces in development mode

---

## Environment Variables

```bash
# Server Configuration
PORT=3001                    # Server port (default: 3001)
HOST=0.0.0.0                 # Server host (default: 0.0.0.0)
NODE_ENV=production          # Environment (production/development)

# Authentication
RBI_API_KEY=your-api-key     # API key for authentication (optional)

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window (default: 100)
RATE_LIMIT_WINDOW_MS=60000   # Rate limit window in ms (default: 60000)
```

---

## Build for Production

```bash
npm run build    # Compile TypeScript
npm start        # Run production server
```

---

## Deployment

### Vercel
```bash
vercel deploy
```

### Docker
```bash
docker build -t rbi-kernel:2.0.0 .
docker run -p 3001:3001 rbi-kernel:2.0.0
```

---

## Generic API vs S2S Compatibility

RBI-Kernel uses generic terminology in public APIs while maintaining full backward compatibility with S2S-specific terminology:

- **Generic (Preferred):** `categoryAssociations`, `categoryOverlap`, `computeResonanceWithCategories()`
- **S2S (Backward Compatible):** `orb_associations`, `orbOverlap`, `computeResonanceWithOrbs()`

S2S code using `orb_associations` continues to work unchanged. See [GENERIC_API_MIGRATION.md](./GENERIC_API_MIGRATION.md) for details.

---

## Integrity and Ethical Invariance

This service complies with the **Ethical Invariance Protocol** defined in the *Resonance-Based Coherence Architecture*.

- No personal or persistent data is stored
- All computations are **ephemeral** and **context-bound** to preserve sovereignty and user trust
- Outputs include Proof-of-Meaning verification but exclude probabilistic inference
- The Kernel resists manipulation through incoherent input; distortions are automatically neutralized by field-level integrity checks

---

## System Alignment

This implementation is aligned with:

- **Resonance Kernel Technical Dossier (2025)**
- **Validation Framework: Temporal Continuity Operator**
- **Resonance-Based Coherence Architecture Defensive Publication (USPTO 63/909,031)**

Each equation and computation in this service reflects the verified coherence mathematics established under the S2S UNA research lineage.

---

## License and Authorship

Copyright © 2025 **Jen Dye (Gigi Stardust)**  
Published under the **Stardust to Sovereignty UNA**.

This repository operates under multiple license terms depending on use case. See license files for details.

This repository adheres to the Coherence Ethics Charter: truth, transparency, and verified alignment in all computational design.

---

## Support

For questions about:
- **Licensing**: See license files or contact Gigi Stardust
- **Technical Integration**: See [docs/integration/](./docs/integration/)
- **Sector Use Cases**: See [docs/sector-use-cases/](./docs/sector-use-cases/)
- **Research Collaboration**: See [LICENSE_RESEARCH.md](./LICENSE_RESEARCH.md)

---

**Service Version:** 2.0.0  
**RBI-Kernel Version:** 2.0.0 (Unified Library + Service)
