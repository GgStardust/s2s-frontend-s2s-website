# RBI S2S Sandbox

**Purpose:** Demonstrate RBI Kernel value by analyzing codebases and structured data

**Status:** 🟡 In Development

---

## Overview

The RBI Sandbox allows developers to:
1. Upload codebases (GitHub repo URL or zip file)
2. Upload data files (CSV, TSV, XML, JSON)
3. Get RBI analysis showing:
   - Code coherence metrics
   - Architectural pattern detection
   - Dependency relationship mapping
   - Technical debt identification
   - Refactoring suggestions based on RBI coherence

---

## Features (Planned)

### Codebase Analysis
- **Structure Analysis:** File tree, directory organization, entry points
- **Dependency Mapping:** External/internal dependencies, frameworks, languages
- **Pattern Detection:** Architectural patterns (MVC, Microservices, etc.), design patterns
- **Metrics:** Lines of code, complexity, test coverage, documentation
- **Relationship Mapping:** Import/export relationships, dependencies

### Data File Analysis
- **CSV/TSV:** Column structure, data types, sample data
- **XML:** Element structure, attributes, hierarchies
- **JSON:** Schema extraction, type detection, relationships

### RBI Analysis
- **Coherence Scoring:** How well-structured is the codebase/data?
- **Resonance Mapping:** Relationships between components
- **Proof-of-Meaning:** Structural integrity verification
- **Value Report:** ROI and improvement suggestions

---

## Implementation Status

### ✅ Completed
- ✅ Metadata parsers created in RBI-Kernel:
  - Codebase metadata parser
  - CSV/TSV parser
  - XML parser
  - JSON parser

### ⏳ In Progress
- 🔄 Sandbox UI (upload interface)
- 🔄 Analysis engine integration
- 🔄 Report generation

### 📋 Planned
- [ ] Upload handler (GitHub API or file upload)
- [ ] Analysis orchestration
- [ ] Value report generator
- [ ] Demo examples

---

## Usage (Future)

```typescript
import { 
  parseCodebaseStructure,
  parseCSVTSV,
  parseXML,
  parseJSON,
  codebaseToContentMetadata
} from 'rbi-kernel/metadata';

// Analyze codebase
const codebaseMetadata = parseCodebaseStructure(fileTree);
const contentMetadata = codebaseToContentMetadata(codebaseMetadata);

// Run RBI analysis
const rbiAnalysis = await analyzeContentWithMathematics(
  codebaseSummary,
  'My Codebase',
  contentMetadata
);
```

---

## Revenue Model

- **Free:** Basic analysis (coherence score only)
- **Pro Report:** $49-$99 per report (detailed analysis + suggestions)
- **Enterprise Analysis:** $500-$2,000 per analysis (custom metrics + consulting)

---

**Next Steps:** Build Sandbox UI and integrate with RBI-Kernel parsers
