# RBI Coherence Extension for Cursor/VS Code

Resonance-Based Intelligence (RBI) coherence monitoring extension for Cursor and VS Code. Provides real-time architectural coherence analysis, project health tracking, and code quality validation.

## Features

- **Real-time Coherence Analysis** - Monitors code files as you work
- **Project Health Dashboard** - Visual dashboard showing overall coherence metrics
- **Architectural Drift Detection** - Identifies files with low coherence scores
- **Status Bar Indicator** - Quick view of project coherence in status bar
- **Proof-of-Meaning Validation** - Validates code integrity using RBI's mathematical framework
- **File Pattern Watching** - Configurable file patterns for analysis

## Installation

### Development Installation

1. **Install dependencies:**
   ```bash
   cd cursor-rbi-extension
   npm install
   ```

2. **Compile the extension:**
   ```bash
   npm run compile
   ```

3. **Open in VS Code/Cursor:**
   - Press `F5` to open a new Extension Development Host window
   - Or use "Run Extension" from the debug panel

4. **Package for distribution:**
   ```bash
   npm run package
   ```
   This creates a `.vsix` file that can be installed.

### Production Installation

1. Install the `.vsix` file:
   ```bash
   code --install-extension rbi-coherence-extension-0.1.0.vsix
   ```

## Configuration

The extension can be configured in VS Code/Cursor settings:

- `rbi.enabled` - Enable/disable RBI monitoring (default: `true`)
- `rbi.analysisDelay` - Delay in milliseconds before analyzing files after changes (default: `1000`)
- `rbi.coherenceThreshold` - Minimum coherence score threshold for warnings (default: `0.7`)
- `rbi.watchPatterns` - File patterns to watch (default: `["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]`)
- `rbi.rbiKernelPath` - Path to RBI-Kernel directory (default: `../RBI-Kernel`)

## Usage

### Commands

- **RBI: Show Dashboard** - Opens the coherence dashboard
- **RBI: Analyze Workspace** - Manually trigger workspace analysis
- **RBI: Refresh** - Refresh all coherence analysis

### Status Bar

The status bar shows your overall project coherence score. Click it to open the dashboard.

### Dashboard

The dashboard displays:
- Overall coherence percentage
- Number of files analyzed
- Files with low coherence scores
- Detailed metrics for each file
- Issues and warnings

## Requirements

- VS Code or Cursor version 1.80.0 or higher
- RBI-Kernel must be accessible (either in workspace or configured path)
- Node.js for development

## Architecture

The extension uses RBI's 5-layer field-level coherence architecture:

1. **Layer 1 (Input Processing)** - File watching and content extraction
2. **Layer 2 (Coherence Calculation)** - RBI mathematical computation
3. **Layer 3 (Temporal Continuity)** - Historical tracking (future)
4. **Layer 4 (Validation)** - Proof-of-Meaning verification
5. **Layer 5 (Integration)** - VS Code/Cursor integration

## Development

### Project Structure

```
cursor-rbi-extension/
├── src/
│   ├── extension.ts          # Main entry point
│   ├── services/
│   │   ├── rbi-analyzer.ts   # RBI integration
│   │   └── file-watcher.ts   # File monitoring
│   └── ui/
│       ├── status-bar.ts     # Status bar display
│       └── dashboard.ts       # Dashboard webview
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run compile      # Compile TypeScript
npm run watch        # Watch mode for development
npm run package      # Create .vsix package
```

## Troubleshooting

### RBI-Kernel Not Found

If you see an error about RBI-Kernel not being found:

1. Ensure RBI-Kernel is in your workspace or accessible
2. Configure `rbi.rbiKernelPath` in settings to point to RBI-Kernel directory
3. The extension looks for RBI-Kernel in:
   - Configured path (relative to workspace root)
   - `../RBI-Kernel` relative to extension
   - `RBI-Kernel` in workspace root

### Performance Issues

If analysis is slow:

1. Increase `rbi.analysisDelay` to reduce frequency
2. Narrow `rbi.watchPatterns` to fewer file types
3. Exclude large directories in `.vscodeignore`

## License

ISC

## Author

Stardust to Sovereignty UNA
