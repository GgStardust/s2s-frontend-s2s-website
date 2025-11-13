# S2S RBI System - Monorepo Setup

This workspace uses **pnpm workspaces** to manage multiple related packages.

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+ (`npm install -g pnpm`)

### Installation

```bash
# Install all dependencies for all packages
pnpm install

# Or install in a specific package
cd CMS_Backend && pnpm install
```

### Development

```bash
# Run all packages in development mode
pnpm dev:cms        # CMS_Backend on port 3000
pnpm dev:console    # S2S_Console on port 5001
pnpm dev:service    # RBI-Architecture-Service on port 3001
pnpm dev:website    # RBI_Website on port 8000

# Or run from individual packages
cd CMS_Backend && pnpm dev
```

### Building

```bash
# Build all packages
pnpm build:all

# Build specific package
cd RBI-Kernel && pnpm build
```

## Workspace Structure

```
S2S_RBI_System/
├── package.json              # Root workspace config
├── CMS_Backend/              # Main CMS and API server
├── S2S_Console/              # Field Console frontend
├── RBI-Kernel/               # Core RBI computation engine
├── Orbital-Brain/            # Narrative intelligence layer
├── RBI-Architecture-Service/ # Standalone RBI service
├── RBI_Website/              # Marketing website
└── RBI_Editorial_Tools/     # Content processing tools
```

## Package Dependencies

### Shared Packages
- **RBI-Kernel**: Used by CMS_Backend, RBI-Architecture-Service
- **Orbital-Brain**: Used by CMS_Backend, S2S_Console (types only)

### Dependency Rules
- **S2S_Console**: Should NOT import RBI-Kernel directly (architecture violation)
- **CMS_Backend**: Can import both RBI-Kernel and Orbital-Brain
- **RBI-Architecture-Service**: Uses RBI-Kernel only

## Troubleshooting

### pnpm not found
```bash
npm install -g pnpm
```

### Workspace dependencies not resolving
```bash
pnpm install
```

### Package build errors
```bash
# Clean and rebuild
pnpm -r exec rm -rf node_modules dist
pnpm install
pnpm build:all
```

## Next Steps

1. ✅ Monorepo setup complete
2. ⏳ Move AI API to Orbital-Brain (shared service)
3. ⏳ Add Sandbox metadata parsers
4. ⏳ Production-harden RBI-Architecture-Service

---

**Last Updated:** 2025-01-XX

