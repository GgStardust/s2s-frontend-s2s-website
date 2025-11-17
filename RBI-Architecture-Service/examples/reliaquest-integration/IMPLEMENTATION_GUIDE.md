# RBI Integration Guide for ReliaQuest

**Step-by-step implementation guide for SIEM integration**

---

## API Integration

### POST /field/analyze

**Purpose:** Coherence analysis of security events

**Request:**
```json
{
  "content": "JSON stringified security event and baseline",
  "title": "Security Event Coherence Analysis"
}
```

### POST /field/validate

**Purpose:** Validate threat classifications

**Request:**
```json
{
  "content": "JSON stringified threat and context",
  "categoryAssociations": [1, 7]
}
```

---

## Integration Examples

See [integration-snippet.ts](./integration-snippet.ts) for complete code examples.

---

**Status:** ✅ Ready for SIEM integration

