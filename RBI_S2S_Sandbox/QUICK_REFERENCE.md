# RBI Sandbox Quick Reference

**Quick links and references for RBI assessment creation**

---

## RBI Architecture Service

**Repository:** https://github.com/GgStardust/rbi-architecture-service  
**Local Path:** `RBI-Architecture-Service/` (in S2S monorepo)  
**Examples Location:** `RBI-Architecture-Service/examples/`

### Key Files

- **README.md** - Service overview and quick start
- **src/server/server.ts** - API endpoint implementations (verify formats here)
- **examples/** - Integration examples (Little Hero Books, ThePeakBeyond eCommerce)

### API Endpoints

All endpoints run on `http://localhost:3001` (or production URL):

- `GET /health` - Health check
- `POST /field/score` - Quality scoring
- `POST /field/validate` - Proof-of-Meaning validation
- `POST /field/neighbors` - Similarity search and recommendations
- `POST /field/analyze` - Full coherence analysis
- `POST /field/vector` - Vector conversion

**Verify exact formats in:** `RBI-Architecture-Service/src/server/server.ts`

---

## Assessment File Structure

```
project-name/
├── README.md                          # Project overview
├── RBI_TECHNICAL_ASSESSMENT.md        # Technical feasibility (main doc)
├── IMPLEMENTATION_GUIDE.md            # Step-by-step integration
├── integration-snippet.ts            # Minimal code example
└── VERIFICATION.md                    # Documentation verification
```

---

## Key Principles

1. **RBI-Forward** - Assume RBI is part of the solution
2. **Maximum Value** - Identify optimal RBI use case combination
3. **Technical Focus** - For developer/CTO audience
4. **Codebase Context** - Brief acknowledgment, not modernization guide
5. **AI/ML Cohesion** - Always include future ML/LLM integration value

---

## Verification Checklist

- [ ] All API formats match `RBI-Architecture-Service/src/server/server.ts`
- [ ] Code examples tested and working
- [ ] Integration snippet is minimal and clean
- [ ] README links to RBI Architecture Service repo
- [ ] Technical assessment includes feasibility scores
- [ ] Codebase context is brief (not modernization guide)
- [ ] AI/ML cohesion section included
- [ ] Business value is one narrative paragraph

---

## Repository Links

- **RBI Architecture Service:** https://github.com/GgStardust/rbi-architecture-service
- **Examples:** https://github.com/GgStardust/rbi-architecture-service/tree/main/examples

---

**See [ASSESSMENT_GUIDE.md](./ASSESSMENT_GUIDE.md) for complete guide.**

