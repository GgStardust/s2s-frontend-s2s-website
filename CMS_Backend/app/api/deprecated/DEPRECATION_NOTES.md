# API Route Deprecation Notes

## Purpose
This folder contains API routes that have been moved out of the main build to reduce complexity and focus on MVP functionality.

## Routes Moved Here

### Experimental/Unused AI Routes
- `ai/apply-content-mapping/` - Experimental content mapping
- `ai/enhanced-analysis/` - Enhanced analysis (redundant with analyze)
- `ai/library-training/` - Library training (not actively used)
- `ai/map-book-content/` - Alternative mapping approach
- `ai/orb-aware-mapping/` - Experimental orb mapping
- `ai/orb-resonance-suggestions/` - Suggestions (not critical)
- `ai/smart-book-mapping/` - Smart mapping (experimental)
- `ai/suggest-essays/` - Essay suggestions (not critical)

### Other Experimental Routes
- `chapter-sources/` - Alternative chapter source management
- `codex/validate-orb/` - Orb validation (redundant)
- `embeddings/init/` - Embedding initialization (not actively used)
- `external-research/` - External research (experimental)
- `field-experience/load/` - Field experience loading (experimental)
- `migrate/orbital-context/` - Migration tool (one-time use)
- `monitoring/` - Monitoring (redundant with health/system)
- `orb-threads/` - Orb threads (experimental)
- `orbital/` - Orbital processing (experimental)
- `orbs/` - Orbs API (redundant with other routes)
- `real-world-content/` - Real world content (experimental)
- `realtime/connection/` - Real-time (not fully integrated)
- `reflection/logs/` - Reflection logs (experimental)
- `research/` - Research API (experimental)
- `test/orbital-context/` - Test route (should be in tests/)
- `training/extract-dataset/` - Training dataset extraction (one-time use)
- `validate/` - Validation (redundant with resonance/analyze)

## Routes Kept (Essential MVP)

### Core Content Management
- `content-files/` - Core content file management
- `content-files/sync/` - Content synchronization
- `content-files/update/` - Content updates

### Core Resonance
- `resonance/analyze/` - Resonance analysis
- `resonance/discover/` - Resonance discovery
- `resonance/feed/` - Resonance feed
- `resonance/patterns/` - Resonance patterns

### Core AI (Book Compiler)
- `ai/analyze/` - AI content analysis
- `ai/merge-chapter/` - Chapter merging (book compiler)
- `ai/resonance-source-selection/` - Source selection (book compiler)
- `ai/conversation/` - AI conversation
- `ai/process-content/` - Content processing
- `ai/style-training/` - Style training

### Core Book Management
- `books/` - Book management
- `books/[id]/` - Individual book operations
- `books/[id]/chapters/` - Book chapters
- `chapters/` - Chapter management
- `chapters/[id]/` - Individual chapter operations
- `chapters/assign-files/` - Chapter file assignment

### Health & Stats
- `health/system/` - System health check (NEW)
- `health-check/` - Content health check
- `stats/` - System statistics

### Fiction Resources
- `fiction-resources/` - Fiction resource management

### Multi-Tenant
- `tenant-content/` - Tenant content
- `tenant-settings/` - Tenant settings
- `tenants/` - Tenant management
- `user-roles/` - User roles

### Search & Discovery
- `search/semantic/` - Semantic search
- `scrollstreams/` - Scrollstreams
- `scrollstreams/resonance/` - Scrollstream resonance
- `knowledge-graph/` - Knowledge graph

## Restoration
If any deprecated route is needed, it can be moved back to `app/api/` and the deprecation note removed.

