# Demo Quick Start Guide

**For demonstrating RBI Architecture Service to top-tier tech partners**

---

## Quick Setup (5 minutes)

### 1. Start the Service

```bash
cd RBI-Architecture-Service
npm install
npm run dev
```

Service runs on `http://localhost:3001`

### 2. Test Basic Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Architecture manifest
curl http://localhost:3001/architecture/manifest

# Field status
curl http://localhost:3001/field/status
```

---

## Essential Demo Endpoints

### 1. Show Architecture (`GET /architecture/manifest`)
**Why:** Shows the complete 5-layer framework

```bash
curl http://localhost:3001/architecture/manifest | jq
```

**Key Points:**
- Shows all 5 layers
- Shows what's implemented
- Shows available endpoints
- Demonstrates this is a complete architecture, not just an API

---

### 2. Score Content (`POST /field/score`)
**Why:** Core value - coherence scoring

```bash
curl -X POST http://localhost:3001/field/score \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test of the RBI coherence architecture for financial transaction verification."
  }' | jq
```

**Shows:**
- 4D resonance vector (clarity, coherence, resonance, sovereignty)
- Field dynamics (strength, stability, coherence)
- Response time (<100ms)

---

### 3. Find Similar Items (`POST /field/neighbors`)
**Why:** Demonstrates similarity search - key for fraud detection, recommendations

```bash
curl -X POST http://localhost:3001/field/neighbors \
  -H "Content-Type: application/json" \
  -d '{
    "query": { "text": "Suspicious transaction pattern" },
    "candidates": [
      { "id": "tx1", "text": "Large wire transfer at unusual hour" },
      { "id": "tx2", "text": "Normal purchase transaction" },
      { "id": "tx3", "text": "Rapid multiple transfers from same account" }
    ],
    "topN": 3
  }' | jq
```

**Shows:**
- Similarity search capability
- Use case: Fraud detection, anomaly detection
- Returns ranked results with scores

---

### 4. Full Analysis (`POST /field/analyze`)
**Why:** Shows complete architecture in action

```bash
curl -X POST http://localhost:3001/field/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Network security log showing 10,000 requests from single IP in 5 minutes. Pattern indicates potential DDoS attack or bot activity."
  }' | jq
```

**Shows:**
- Complete 5-layer analysis
- Coherence matrix (relationship mapping)
- Field dynamics (stability, strength)
- Harmonic frequency analysis
- Sovereign logic validation

---

### 5. Verify with Proof (`POST /field/validate`)
**Why:** Shows mathematical verification - key differentiator

```bash
curl -X POST http://localhost:3001/field/validate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "AI-generated content that needs verification for accuracy and coherence."
  }' | jq
```

**Shows:**
- Proof-of-Meaning verification
- Mathematical proof (not just confidence score)
- Sovereign logic validation
- Explainable results

---

## Demo Script (10 minutes)

### Opening (1 min)
1. "I've built a coherence verification architecture"
2. Show `/architecture/manifest` - "Complete 5-layer framework"
3. "Provisional patent filed - novel technology"

### Core Demo (5 min)
1. **Score** - Show basic coherence scoring
2. **Neighbors** - Show similarity search (fraud detection example)
3. **Analyze** - Show full architecture analysis
4. **Validate** - Show Proof-of-Meaning

### Value Prop (2 min)
- Cost: 90-99% cheaper than AI
- Speed: 10-100x faster
- Explainable: Mathematical proof
- Market: $1B-$10B opportunity

### Closing (2 min)
- "90% ready - need help with final 10%"
- "Zero-budget launch or white-label deal"
- "What can you help with?"

---

## Key Talking Points

### What Makes This Different
1. **Not just an API** - Complete 5-layer architecture
2. **Mathematical verification** - Proof-of-Meaning, not just scoring
3. **Cost reduction** - 90-99% cheaper than AI
4. **Explainable** - Coherence scores with proofs
5. **Multiple capabilities** - Scoring, validation, similarity, analysis

### What You Need Help With
1. **Technical** - Production infrastructure, scaling
2. **Business** - Go-to-market, partnerships
3. **Strategic** - Positioning, market access

### The Opportunity
- **Market:** $1B-$10B in replaceable AI spending
- **Status:** 90% complete, provisional patent filed
- **Timeline:** Can launch in 1-2 weeks (zero budget) or 12-18 weeks (white-label)

---

## What Partners Should See

### Technical Depth
- Complete architecture (not just endpoints)
- Mathematical foundations
- Multiple computation modes
- Field-level operations

### Business Potential
- Huge market opportunity
- Clear value proposition
- Multiple sectors
- Ready to scale

### Partnership Opportunity
- Technology is ready
- Market is ready
- Need execution help
- Win-win potential

---

**Ready to demo?** Start the service and use these endpoints to show the full potential.

