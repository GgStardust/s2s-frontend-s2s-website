# RBI Integration Guide for ReliaQuest

**Goal:** Embed RBI resonance scoring inside GreyMatter for coherence-based threat detection, validation, and governance automation.

---

## 1. Reference Architecture

```
GreyMatter Event Bus ──► RBI /field/analyze ──► Resonance Vector + Proof
        │                            │
        │                            └─► RBI Temporal Buffer (baseline sync)
        └─► GreyMatter Automations ◄─┘
```

**Deployment Options**
- **Managed RBI Cloud:** Fastest path; GreyMatter connects over HTTPS with mTLS.
- **Private VPC / On-Prem:** Containerized RBI kernel deployed alongside GreyMatter for air-gapped tenants.

---

## 2. Data Contracts

### 2.1 Event Payload (Analyze)
- **Endpoint:** `POST /field/analyze`
- **Purpose:** Measure coherence drift across bundled security events.
- **Schema:**
```json
{
  "content": "{\"tenantId\":\"rq-1234\",\"events\":[...],\"baseline\":{\"hash\":\"abc123\"}}",
  "title": "GreyMatter Event Cluster",
  "metadata": {
    "source": "greymatter",
    "playbook": "threat-detection-v2",
    "timestamp": "2025-11-19T10:15:00Z"
  }
}
```
- **Response Highlights:** `signature.coherence`, `decisionTrail[]`, `proof`, `resonanceVector`.

### 2.2 Validation Payload
- **Endpoint:** `POST /field/validate`
- **Purpose:** Verify threat classifications / automations prior to escalation.
- **Schema:**
```json
{
  "content": "{\"threat\":{\"id\":\"INC-9981\",\"severity\":\"high\"},\"context\":{...}}",
  "categoryAssociations": [1, 7, 18],
  "title": "Threat Classification Validation"
}
```
- **Response Highlights:** `verified`, `sovereignLogic.coherence`, `confidence`, `proof`.

---

## 3. Implementation Steps

1. **Establish Connectivity**
   - Provision RBI API credentials + mTLS certs.
   - Create GreyMatter secret store entries (`RBI_API_URL`, `RBI_API_KEY`).

2. **Baseline Sync**
   - Export 30 days of normalized telemetry (per tenant) to seed RBI baseline.
   - Schedule nightly baseline refresh or enable streaming baseline updates.

3. **Event Bridge**
   - Extend GreyMatter event worker to call `reliaQuestRBIService.analyzeSecurityEvent`.
   - Map RBI resonance outputs to GreyMatter incident fields (coherence, decisionTrail, proof link).

4. **Automation Guardrails**
   - Before automation executes, call `validateThreatClassification`.
   - Block or downgrade automation when coherence < 0.65 or `verified === false`.

5. **Analyst UX**
   - Surface RBI decision trails inside GreyMatter UI (HTML/Markdown rendering).
   - Provide one-click “request proof” button tied to RBI proof payload.

6. **Coherence-Based Governance**
   - Define policy thresholds (e.g., escalate when resonance vector shows low sovereignty).
   - Trigger playbooks or analyst prompts based on RBI outputs.

---

## 4. Observability & SLAs

- **Latency Target:** <120 ms p95 end-to-end per request.
- **Retries:** Implement exponential backoff (max 3) on HTTP 429/5xx.
- **Alerting:** Monitor RBI availability endpoint; fall back to legacy detection when unavailable.
- **Logging:** Redact PII before sending to RBI. Use GUID linkage for cross-system tracing.

---

## 5. Example Code

See [integration-snippet.ts](./integration-snippet.ts) for a fully annotated TypeScript service that:
- Handles `analyzeSecurityEvent` and `validateThreatClassification`
- Calculates threat levels from coherence thresholds
- Generates analyst-facing explanations and decision trails

---

## 6. Rollout Checklist

- [ ] Connectivity + secrets configured
- [ ] Baseline data ingested and validated
- [ ] Shadow-mode scoring enabled in staging tenant
- [ ] KPI dashboard wired (false positives, MTTU, proof coverage)
- [ ] Playbooks updated with RBI thresholds
- [ ] Analyst enablement + runbook updates completed

---

**Status:** ✅ Ready for GreyMatter pilot + production rollout

