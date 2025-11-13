# RBI Sandbox Tutorial

**Learn how to analyze codebases and data files with RBI**

---

## Overview

The RBI Sandbox allows you to upload codebases or data files and get RBI analysis showing:
- Code coherence metrics
- Architectural pattern detection
- Dependency relationship mapping
- Technical debt identification
- Refactoring suggestions based on RBI coherence

---

## Step 1: Prepare Your Codebase

### Option A: GitHub Repository

Provide the repository URL:
```
https://github.com/your-org/your-repo
```

### Option B: Upload Files

Upload a zip file containing your codebase structure.

---

## Step 2: Run Analysis

### Using the Sandbox UI

1. Navigate to the Sandbox
2. Enter your repository URL or upload files
3. Click "Analyze with RBI"
4. Wait for analysis to complete (typically 1-2 minutes)

### Using the API

```typescript
import { 
  parseCodebaseStructure,
  parseDependencies,
  detectPatterns,
  calculateMetrics,
  codebaseToContentMetadata
} from 'rbi-kernel/metadata';
import { EnhancedResonanceEngine } from 'rbi-kernel';

// Parse codebase
const fileTree = await getFileTree(repositoryUrl);
const structure = parseCodebaseStructure(fileTree);
const dependencies = parseDependencies(packageFiles);
const patterns = detectPatterns(codeFiles);
const metrics = calculateMetrics(codeFiles);

// Convert to metadata
const metadata = codebaseToContentMetadata({
  codebase_structure: structure,
  dependencies,
  patterns,
  metrics
});

// Run RBI analysis
const engine = EnhancedResonanceEngine.getInstance();
const analysis = await engine.analyzeContentWithMathematics(
  codebaseSummary,
  'My Codebase',
  metadata
);
```

---

## Step 3: Interpret Results

### Coherence Score

- **0.0 - 0.4**: Low coherence - significant refactoring needed
- **0.4 - 0.7**: Moderate coherence - some improvements possible
- **0.7 - 0.9**: Good coherence - minor optimizations
- **0.9 - 1.0**: Excellent coherence - well-structured

### Architectural Patterns Detected

RBI identifies:
- **MVC** (Model-View-Controller)
- **Layered Architecture**
- **Microservices**
- **Design Patterns** (Factory, Singleton, Observer, etc.)

### Metrics Provided

- **Lines of Code**: Total codebase size
- **Complexity Score**: Cyclomatic complexity approximation
- **Test Coverage**: Percentage of code covered by tests
- **Documentation Coverage**: Percentage of code documented

### Dependencies Analysis

- **External Dependencies**: Third-party libraries
- **Internal Dependencies**: Inter-module relationships
- **Frameworks**: Detected frameworks (React, Vue, etc.)
- **Languages**: Programming languages used

---

## Step 4: Use Recommendations

### Refactoring Suggestions

Based on RBI coherence analysis, you'll receive suggestions for:
- **High Coherence Areas**: Well-structured code to reference
- **Low Coherence Areas**: Code needing refactoring
- **Dependency Optimization**: Opportunities to reduce coupling
- **Pattern Improvements**: Better architectural patterns

### Example Output

```json
{
  "coherence": 0.72,
  "proofStatus": "proven",
  "recommendations": [
    "Consider extracting shared utilities from src/components/",
    "High coupling detected between modules A and B",
    "Test coverage below threshold (45% < 70%)"
  ],
  "patterns": {
    "architectural": ["MVC", "Layered Architecture"],
    "design": ["Factory Pattern", "Observer Pattern"]
  },
  "metrics": {
    "lines_of_code": 12500,
    "complexity_score": 3.2,
    "test_coverage": 0.45,
    "documentation_coverage": 0.32
  }
}
```

---

## Analyzing Data Files

### CSV/TSV Files

```typescript
import { parseCSVTSV, csvTSVToContentMetadata } from 'rbi-kernel/metadata';

const csvContent = await readFile('data.csv');
const metadata = parseCSVTSV(csvContent, { hasHeader: true });
const contentMetadata = csvTSVToContentMetadata(metadata, csvContent);

// Run RBI analysis
const analysis = await engine.analyzeContentWithMathematics(
  csvContent,
  'User Data CSV',
  contentMetadata
);
```

### XML Files

```typescript
import { parseXML, xmlToContentMetadata } from 'rbi-kernel/metadata';

const xmlContent = await readFile('data.xml');
const metadata = parseXML(xmlContent);
const contentMetadata = xmlToContentMetadata(metadata, xmlContent);
```

### JSON Files

```typescript
import { parseJSON, jsonToContentMetadata } from 'rbi-kernel/metadata';

const jsonContent = await readFile('data.json');
const metadata = parseJSON(jsonContent);
const contentMetadata = jsonToContentMetadata(metadata, jsonContent);
```

---

## Best Practices

1. **Start Small**: Analyze individual modules before entire codebases
2. **Compare Over Time**: Run analysis after refactoring to measure improvement
3. **Focus on Low Coherence**: Prioritize areas with coherence < 0.5
4. **Use Patterns**: Reference detected patterns to understand architecture
5. **Check Dependencies**: Review dependency analysis for optimization opportunities

---

## Troubleshooting

### "Analysis Failed"

- Check that files are accessible
- Verify file structure is valid
- Ensure sufficient permissions

### "Low Coherence Score"

- Review architectural patterns
- Check for circular dependencies
- Examine test coverage
- Look for code duplication

### "No Patterns Detected"

- Ensure code follows common patterns
- Check that files are properly structured
- Verify language detection is correct

---

## Next Steps

- **Integrate RBI**: Use RBI Architecture Service in your CI/CD pipeline
- **Monitor Coherence**: Track coherence over time
- **Refactor Based on RBI**: Use recommendations to improve code quality

---

**Ready to analyze?** Start with a small module and work your way up to full codebase analysis.

