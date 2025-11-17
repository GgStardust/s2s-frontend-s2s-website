# RBI Architecture Service

**Resonance-Based Intelligence as a Service - REST API for Coherence Computation**

---

## Overview

RBI Architecture Service provides RBI (Resonance-Based Intelligence) as a REST API service. It offers field-level coherence computation, Proof-of-Meaning verification, and temporal continuity validation through HTTP endpoints.

**Provenance Notice:**
*Resonance-Based Intelligence (RBI)* was developed by **Jen Dye (Gigi Stardust)** under the **Stardust to Sovereignty UNA (2025)**. This service implements the *Resonance Kernel* as a computational framework for coherence verification, Proof-of-Meaning computation, and temporal continuity validation.

---

## Features

- **REST API Service**: HTTP endpoints for RBI operations
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

### Development

```bash
npm run dev
```

Service runs on `http://localhost:3001`

### Production

```bash
npm start
```

---

## API Endpoints

### Health Check
```
GET /health
```

### Field Operations

**Score Content:**
```
POST /field/score
{
  "content": "Text content to analyze"
}
```

**Validate Content:**
```
POST /field/validate
{
  "content": "Content to validate",
  "categoryAssociations": [1, 2, 3]  // Optional
}
```

**Find Neighbors (Similarity Search):**
```
POST /field/neighbors
{
  "query": { "text": "Query text" },
  "candidates": [
    { "id": "item1", "text": "Candidate text" }
  ],
  "topN": 5
}
```

**Full Analysis:**
```
POST /field/analyze
{
  "content": "Content to analyze",
  "title": "Optional title"
}
```

See [API Documentation](./docs/API_REFERENCE.md) for complete endpoint details.

---

## Examples

See `examples/` directory for integration examples:
- **Little Hero Books**: Complete integration example with value assessment and implementation guide
- **Basic Usage**: Simple API usage examples

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

