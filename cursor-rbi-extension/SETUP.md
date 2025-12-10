# Setup Instructions for RBI Coherence Extension

## Prerequisites

1. **Build RBI-Kernel first:**
   ```bash
   cd ../RBI-Kernel
   npm install
   npm run build
   ```

   This creates the `dist/` folder that the extension needs.

2. **Install extension dependencies:**
   ```bash
   cd cursor-rbi-extension
   npm install
   ```

## Development Setup

1. **Compile the extension:**
   ```bash
   npm run compile
   ```

2. **Run in development mode:**
   - Press `F5` in VS Code/Cursor
   - Or use "Run Extension" from the debug panel
   - This opens a new Extension Development Host window

3. **Test the extension:**
   - Open a workspace in the Extension Development Host
   - The extension should activate automatically
   - Check the status bar for the RBI coherence indicator
   - Use command "RBI: Show Dashboard" to see the dashboard

## Configuration

The extension looks for RBI-Kernel in this order:
1. Path specified in `rbi.rbiKernelPath` setting (relative to workspace root)
2. `../RBI-Kernel` relative to extension directory
3. `RBI-Kernel` in workspace root

## Troubleshooting

### "RBI-Kernel not found" error

1. Make sure RBI-Kernel is built:
   ```bash
   cd ../RBI-Kernel
   npm run build
   ```

2. Check that `dist/` folder exists in RBI-Kernel

3. Configure the path in VS Code settings:
   ```json
   {
     "rbi.rbiKernelPath": "../RBI-Kernel"
   }
   ```

### Module import errors

If you see ES module import errors:
- Make sure RBI-Kernel is built (`npm run build` in RBI-Kernel)
- The extension uses dynamic imports to handle ES modules
- Check that `dist/field/computation/enhanced-engine.js` exists

### Extension not activating

1. Check the Output panel for errors
2. Look for "RBI Coherence Extension" in the output dropdown
3. Check that all dependencies are installed

## Next Steps

Once setup is complete:
1. The extension will automatically analyze files as you work
2. Click the status bar indicator to see the dashboard
3. Use commands to manually trigger analysis
4. Configure settings to customize behavior
