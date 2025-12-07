# RBI Architecture Service

**Resonance-Based Intelligence as a Service - REST API for Coherence Computation**

---

## Start Here

**New to RBI? Follow this path:**

1. **[Quick Start Guide](./QUICK_START_GUIDE.md)** **START HERE**
   - Get RBI working in 15 minutes
   - Explains category associations, testing, RBI concepts
   - Step-by-step integration examples

2. **Project-Specific Guides:**
   - [Little Hero Books](./examples/little-hero-books/IMPLEMENTATION_GUIDE.md) - LHL integration
   - [TPB Email Insights](./examples/tpb-email-insights/IMPLEMENTATION_GUIDE.md) - TPB integration

3. **Complete Reference:**
   - [API v1 Implementation Guide](./API_V1_IMPLEMENTATION_GUIDE.md) - Full API reference

**Quick Links:**
- [Quick Start Guide](./QUICK_START_GUIDE.md) - 15-minute setup
- [API v1 Implementation Guide](./API_V1_IMPLEMENTATION_GUIDE.md) - Complete reference
- [Getting Started](./GETTING_STARTED.md) - Detailed setup instructions

---

## Overview

RBI Architecture Service provides RBI (Resonance-Based Intelligence) as a REST API service. It offers field-level coherence computation, Proof-of-Meaning verification, and temporal continuity validation through HTTP endpoints.

**Provenance Notice:**
*Resonance-Based Intelligence (RBI)* was developed by **Jen Dye (Gigi Stardust)** under the **Stardust to Sovereignty UNA (2025)**. This service implements the *Resonance Kernel* as a computational framework for coherence verification, Proof-of-Meaning computation, and temporal continuity validation.

---

## Features

**API v1 Complete** - Full reflection of RBI's 5-layer architecture:

- **REST API Service**: HTTP endpoints for RBI operations
- **JSON Auto-Detection**: Send JSON objects, strings, or text - auto-detected
- **Codebase Analysis**: Analyze code structure, patterns, dependencies
- **Time-Series Analysis**: Trend detection, drift analysis, stability monitoring
- **Batch Operations**: Process multiple items in parallel
- **Multi-Input Processing**: Global field computation across diverse inputs
- **Decision Trails**: Track which validation rules were active
- **Baseline Management**: Store, compare, and detect drift from baselines
- **Coherence Verification**: Compute coherence scores using resonance-weighted relationships
- **Proof-of-Meaning**: Mathematical verification of content integrity
- **Vector Similarity**: Calculate coherence metrics between multidimensional embeddings
- **Neighbor Finding**: Identify top-N most coherent relationships
- **Production Ready**: API key authentication, rate limiting, monitoring, error handling

---

## Quick Start

### Installation

```bash
npm install
npm run build
```

### Configuration

Copy `.env.example` to `.env` and configure (optional for development):

```bash
cp .env.example .env
```

Edit `.env` to set:
- `PORT`: Server port (default: 3001)
- `RBI_API_KEY`: API key for authentication (optional for development)
- `ENABLE_RATE_LIMIT`: Enable rate limiting (set to `true` to enable, disabled by default)
- `RATE_LIMIT`: Maximum requests per window (default: 100, only used if `ENABLE_RATE_LIMIT=true`)
- `LOG_LEVEL`: Logging level (debug, info, warn, error)

### Start the Service

```bash
npm run dev
```

Service runs on `http://localhost:3001`

### Try It Now

**Quick Test:**
```bash
# In one terminal: npm run dev
# In another terminal:
node examples/quick-test.js
```

**Or use cURL:**
```bash
# Health check
curl http://localhost:3001/health

# Score content
curl -X POST http://localhost:3001/field/score \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a test"}'
```

**Or run the examples:**
```bash
node examples/basic-usage.js
```

**Documentation:**
- **[Quick Start Guide](./QUICK_START_GUIDE.md)** - 15-minute setup (start here!)
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Detailed instructions
- [API v1 Implementation Guide](./API_V1_IMPLEMENTATION_GUIDE.md) - Complete overview

### Production

```bash
npm start
```

## API Documentation

Full API documentation is available in `openapi.yaml` (OpenAPI 3.0.3 spec).

View interactive API docs:
- Use [Swagger UI](https://editor.swagger.io/) or [Redoc](https://redocly.com/) to view `openapi.yaml`
- Or use tools like `swagger-ui-express` to serve docs at runtime

---

## API Endpoints

### Core Endpoints

**Health Check:**
```
GET /health
```

**Score Content:**
```
POST /field/score
{
  "content": "Text content" OR { "json": "object" } OR "JSON string"
}
```

**Validate Content:**
```
POST /field/validate
{
  "content": "Text" OR { "json": "object" },
  "categoryAssociations": [1, 2, 3]  // Optional
}
```

**Find Neighbors (Similarity Search):**
```
POST /field/neighbors
{
  "query": { "text": "Query" OR { "json": "object" } },
  "candidates": [
    { "id": "item1", "text": "Text" OR { "json": "object" } }
  ],
  "topN": 5
}
```

**Full Analysis:**
```
POST /field/analyze
{
  "content": "Text" OR { "json": "object" },
  "title": "Optional title"
}
```

### API v1 New Endpoints

**Codebase Analysis:**
```
POST /field/analyze/codebase
{
  "codebase": {
    "fileTree": [...],
    "codeFiles": [...],
    "packageFiles": [...]
  }
}
```

**Time-Series Analysis:**
```
POST /field/analyze/timeseries
{
  "timePoints": [
    { "timestamp": "2024-01-01T00:00:00Z", "data": {...} }
  ],
  "baseline": { "x": 0.5, "y": 0.5, "z": 0.5, "w": 0.5 }  // Optional
}
```

**Batch Operations:**
```
POST /field/batch
{
  "items": [
    { "content": "...", "title": "Item 1" }
  ],
  "operation": "analyze" | "validate" | "score" | "vector"
}
```

**Multi-Input Processing:**
```
POST /field/analyze/multi-input
{
  "inputs": [
    { "content": {...}, "title": "JSON" },
    { "content": "code", "title": "Code" },
    { "content": "text", "title": "Text" }
  ]
}
```

**Baseline Management:**
```
POST /field/baseline          # Store baseline
GET /field/baseline/:id       # Retrieve baseline
GET /field/baseline            # List baselines
DELETE /field/baseline/:id    # Delete baseline
POST /field/baseline/compare  # Compare against baseline
```

See [API v1 Implementation Guide](./API_V1_IMPLEMENTATION_GUIDE.md) for complete details.

---

## Examples

See `examples/` directory for integration examples:
- **Little Hero Books**: Complete integration example with value assessment and API v1 implementation guide
- **TPB Email Insights**: Implementation guide for TPB Email Insights use case
- **Basic Usage**: Simple API usage examples

**Quick Links:**
- [API v1 Implementation Guide](./API_V1_IMPLEMENTATION_GUIDE.md) - Complete overview
- [Little Hero Books Guide](./examples/little-hero-books/IMPLEMENTATION_GUIDE.md) - LHL-specific
- [TPB Email Insights Guide](./examples/tpb-email-insights/IMPLEMENTATION_GUIDE.md) - TPB-specific

---

## Documentation

- **API Reference**: See `docs/` directory
- **Sector Use Cases**: See `docs/sector-use-cases/` for industry-specific applications
- **Integration Guides**: See `examples/` for partner integration examples

---

## Licensing

This service is available under multiple license options:
- **LICENSE_UNA.md**: For UNA members and collaborators
- **LICENSE_RESEARCH.md**: For research and academic use
- **COMMERCIAL_LICENSE.md**: For commercial use
- **PATENT_NOTICE.md**: Patent information

See individual license files for terms.

---

## Architecture

RBI Architecture Service implements a 5-layer field-level coherence architecture:

1. **Representation Layer**: Input processing and metadata extraction
2. **Computation Layer**: Resonance calculation and coherence scoring
3. **Temporal Layer**: Stability tracking and continuity validation
4. **Validation Layer**: Proof-of-Meaning verification
5. **Interfaces Layer**: REST API endpoints and formatted output

---

## Support

- **Documentation**: See `docs/` directory
- **Examples**: See `examples/` directory
- **Issues**: GitHub Issues (when repo is public)

---

**Version:** 2.0.0  
**License:** See LICENSE files  
**Repository:** https://github.com/GgStardust/rbi-architecture-service

