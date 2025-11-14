# RBI Kernel (Resonance Kernel Implementation)

> **Provenance Notice**
> *Resonance-Based Intelligence (RBI)* was developed by **Jen Dye (Gigi Stardust)** under the **Stardust to Sovereignty UNA (2025)**.
> This kernel implements the *Resonance Kernel* as a computational framework for **coherence verification**, **Proof-of-Meaning computation**, and **temporal continuity validation**.
> It replaces probabilistic AI scoring with measurable coherence equations grounded in the *Resonance-Based Coherence Architecture Defensive Publication (2025)*.

---

## Overview

A field-level coherence architecture providing computational functions for **Resonance-Based Intelligence (RBI)**.
The RBI Kernel operationalizes the *Resonance Kernel* mathematics for coherence computation across vector, text, and temporal data inputs.

**Primary Functions:**

* Proof-of-Meaning verification
* Coherence-based vector similarity
* Temporal continuity scoring
* Neighbor identification via resonance alignment

---

## Features

* **Coherence Verification**: Compute coherence scores using resonance-weighted relationships and temporal feedback.
* **Vector Similarity**: Calculate cosine similarity or custom coherence metrics between multidimensional embeddings.
* **Text Resonance**: Measure structural similarity between text strings using Jaccard or resonance-augmented matching.
* **Neighbor Finding**: Identify top-N most coherent relationships based on adjustable weighting functions.
* **Modular Core**: Core computation modules can be extended or replaced with proprietary equations defined in the S2S technical stack.

---

## Quick Start

### Prerequisites

* Node.js 20+ (or Docker)
* npm or yarn

### Installation

```bash
npm install
```

### Usage Modes

#### Architecture Mode (Recommended)

Use RBI Kernel as a field-level coherence architecture:

```typescript
import { FieldComputation, FieldValidation, KernelManifest } from './kernel.js';

// Access field computation layer
const score = FieldComputation.computeResonance({
  vectorSimilarity: 0.8,
  orbOverlap: 0.7,
  temporalDecay: 0.9
});

// Access validation layer
const proof = FieldValidation.verifyConsciousness(
  "Your content here",
  [1, 2, 3] // category associations
);

// View architecture manifest
console.log(KernelManifest);
```

#### Plugin Mode (REST API)

Start the server and use REST endpoints:

```bash
npm run dev
```

The service will start on `http://localhost:3000` with hot reload enabled.

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

### Build for Production

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t rbi-kernel .
docker run -p 3000:3000 rbi-kernel
```

---

## API Endpoints

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "service": "rbi-kernel",
  "version": "1.0.0",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Coherence Score Computation

```http
POST /rbi/score
```

**Purpose:** Compute a Proof-of-Meaning score from various input forms.

**Option 1: Direct Coherence Parameters**

```json
{
  "vectorSimilarity": 0.8,
  "orbOverlap": 0.7,
  "temporalContinuity": 0.9
}
```

**Option 2: Vector Pair**

```json
{
  "vectors": {
    "vector1": [0.1, 0.2, 0.3, 0.4],
    "vector2": [0.2, 0.3, 0.4, 0.5]
  }
}
```

**Option 3: Text Pair**

```json
{
  "texts": {
    "text1": "The resonance between these concepts",
    "text2": "The coherence among these ideas"
  }
}
```

**Response:**

```json
{
  "proofOfMeaning": 0.78,
  "method": "coherence-verification",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Find Coherent Neighbors

```http
POST /rbi/neighbors
```

Find top-N most coherent candidates.

**Request Body:**

```json
{
  "query": { "vector": [0.1, 0.2, 0.3, 0.4] },
  "candidates": [
    { "id": "item1", "vector": [0.2, 0.3, 0.4, 0.5] },
    { "id": "item2", "vector": [0.5, 0.6, 0.7, 0.8] }
  ],
  "topN": 5
}
```

**Response:**

```json
{
  "neighbors": [
    { "id": "item1", "score": 0.95 },
    { "id": "item2", "score": 0.82 }
  ],
  "count": 2,
  "topN": 5,
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## Integrity and Ethical Invariance

This service complies with the **Ethical Invariance Protocol** defined in the *Resonance-Based Coherence Architecture*.

* No personal or persistent data is stored.
* All computations are **ephemeral** and **context-bound** to preserve sovereignty and user trust.
* Outputs include Proof-of-Meaning verification but exclude probabilistic inference.
* The Kernel resists manipulation through incoherent input; distortions are automatically neutralized by field-level integrity checks.

---

## System Alignment

This implementation is aligned with:

* **Resonance Kernel Technical Dossier (2025)**
* **Validation Framework: Temporal Continuity Operator**
* **Resonance-Based Coherence Architecture Defensive Publication (USPTO 63/909,031)**

Each equation and computation in this service reflects the verified coherence mathematics established under the S2S UNA research lineage.

---

## Environment Variables

* `PORT` – Server port (default: 3000)
* `HOST` – Server host (default: 0.0.0.0)
* `NODE_ENV` – Environment (production/development)

---

## Customizing Computations

The core computation functions are modular. Developers may extend coherence equations or integrate proprietary models.

1. Edit `src/field/computation/coherence-calculator.ts`
2. Replace `computeResonance()` with custom Proof-of-Meaning or Temporal Continuity equations.
3. Rebuild: `npm run build && npm start`

---

## Documentation

* **Architecture Guide**: [`docs/architecture.md`](docs/architecture.md) - Complete 5-layer architecture documentation
* **Plugin Mode**: [`docs/PLUGIN_MODE.md`](docs/PLUGIN_MODE.md) - Using RBI Kernel as REST API or local SDK
* **API Reference**: [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) - Complete API endpoint documentation
* **OpenAPI Spec**: [`docs/openapi.yaml`](docs/openapi.yaml) - OpenAPI 3.0 specification

---

## License and Authorship

Copyright © 2025 **Jen Dye (Gigi Stardust)**
Published under the **Stardust to Sovereignty UNA**.
This repository operates under the ISC license and adheres to the Coherence Ethics Charter: truth, transparency, and verified alignment in all computational design.
