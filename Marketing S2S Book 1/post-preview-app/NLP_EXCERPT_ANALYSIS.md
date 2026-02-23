# NLP Analysis: Standalone Excerpt Identification

## Linguistic Parameters for Standalone Excerpts

### 1. Syntactic Completeness
- **Full sentences**: Subject + predicate structure
- **No fragments**: Avoid incomplete thoughts, dependent clauses without main clause
- **Proper punctuation**: Ends with `.`, `!`, or `?`

### 2. Semantic Independence (Critical)
- **No anaphora**: Avoid pronouns (`this`, `that`, `it`, `these`, `they`) that refer to previous context
- **No cataphora**: Avoid forward references that need following context
- **Explicit subjects**: Use concrete nouns, not pronouns
- **Self-defining**: All concepts explained within the excerpt

### 3. Discourse Structure
- **No discourse markers**: Avoid "This is...", "That means...", "These represent..."
- **No temporal dependencies**: Avoid "then", "after", "when" that require setup
- **No conditional logic**: Avoid "if...then" without full context
- **No comparative references**: Avoid "same as", "like the", "similar to" without definition

### 4. Conceptual Density
- **High information content**: Meaningful statements, not filler
- **Architectural language**: Structural, systemic, observational
- **Declarative tone**: Statements of fact/observation
- **Poetic/evocative**: Works as standalone art

### 5. Length & Structure
- **20-150 words**: Optimal for Instagram
- **1-3 sentences**: Can be single powerful sentence or short sequence
- **Parallel structure**: Lists, repetition work well
- **Strong opening**: Can start mid-paragraph if complete

### 6. Content Filters (Exclusions)
- **Persona POV**: "I am", "I speak", "I am the one"
- **Instructional**: "you should", "you must", "try to", "feel it"
- **Meta-system**: "This system", "Book/Codex/Console", "was developed"
- **Fragments**: "It governs...", "This operates..." without context
- **Questions**: Unless they're complete standalone inquiries

## Pattern Recognition Rules

### High-Quality Patterns (Extract These)

1. **Opening Declarative Sequences**
   - Pattern: "Before X, before Y, before Z, there was..."
   - Example: "Before form, before structure, before the first breath of biological life, there was origin."

2. **Universal Statements**
   - Pattern: "Every X carries/contains/represents..."
   - Example: "Every time you breathe, you inhale atoms that once burned in distant stars."

3. **Metaphorical Declarations**
   - Pattern: "X is Y" or "X functions as Y"
   - Example: "Your bones sing with calcium forged in dying stars."

4. **Parallel Structure Lists**
   - Pattern: "X, Y, and Z all..."
   - Example: "Every cell, every organ, every system responds to frequencies..."

5. **Cosmic-Biological Connections**
   - Pattern: "The [cosmic] [process] [biological] [result]"
   - Example: "Stellar fire shaped the elements that would become your body."

6. **Standalone Bullet Points**
   - Pattern: "★ [Complete statement]"
   - Example: "★ Origin Intelligence is the primordial current through which consciousness first inhabits form."

7. **Self-Contained Observations**
   - Pattern: "[Subject] [verb] [object] [qualifier]"
   - Example: "The universe's first light still pulses through you right now."

### Low-Quality Patterns (Exclude These)

1. **Anaphoric References**
   - "This is...", "That means...", "It represents..."
   - "These traditions...", "This recognition..."

2. **Temporal Dependencies**
   - "When X happens, Y occurs..." (needs context)
   - "After recognizing X, Y becomes..." (needs setup)

3. **Conditional Logic**
   - "If X, then Y..." (incomplete without full context)
   - "When X functions optimally, you experience Y..." (instructional)

4. **Comparative References**
   - "The same as...", "Like the...", "Similar to..." (needs comparison target)

5. **Instructional Sequences**
   - "Pause. Breathe. Feel..." (commands)
   - "When you X, you Y..." (instructional)

## Extraction Algorithm

### Step 1: Sentence Segmentation
- Split on sentence boundaries (`.`, `!`, `?`)
- Handle abbreviations, decimals, ellipses
- Preserve multi-sentence sequences that work together

### Step 2: Anaphora Detection
- Identify pronouns at sentence start: `this`, `that`, `it`, `these`, `they`
- Check if pronoun has clear antecedent in same sentence
- If not, mark as dependent (needs context)

### Step 3: Discourse Marker Detection
- Identify discourse markers: "This is", "That means", "These represent"
- Mark as dependent if they start the sentence

### Step 4: Temporal Dependency Detection
- Identify temporal markers: "when", "after", "then", "before" (as conjunctions)
- Check if they create dependencies

### Step 5: Standalone Scoring
Score each candidate:
- +10: Explicit subject (noun, not pronoun)
- +10: No anaphora/cataphora
- +10: No discourse markers
- +10: No temporal dependencies
- +10: Conceptual density (architectural language)
- +5: Appropriate length (20-150 words)
- +5: Poetic/evocative language
- -20: Persona POV
- -20: Instructional language
- -20: Meta-system references
- -15: Fragments without context

### Step 6: Selection
- Select highest-scoring candidates per chapter
- Prioritize opening paragraphs (first 1-3 after header)
- Ensure variety across chapters
