#!/bin/bash

# Cleanup script to archive Heather Kessinger-specific files
# This separates dissertation analysis from the core RBI Kernel codebase

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ARCHIVE_DIR="$PROJECT_ROOT/archive/heather-dissertation-analysis"

echo "Creating archive directory..."
mkdir -p "$ARCHIVE_DIR"
mkdir -p "$ARCHIVE_DIR/docs"
mkdir -p "$ARCHIVE_DIR/docs/converted_markdown"
mkdir -p "$ARCHIVE_DIR/original_documents"

echo "Moving root-level Heather documents..."
if [ -f "$PROJECT_ROOT/dissertation_outline_april25.docx" ]; then
    mv "$PROJECT_ROOT/dissertation_outline_april25.docx" "$ARCHIVE_DIR/original_documents/"
fi
if [ -f "$PROJECT_ROOT/Kessinger_Heather_804_abstract_keywords_250412.docx" ]; then
    mv "$PROJECT_ROOT/Kessinger_Heather_804_abstract_keywords_250412.docx" "$ARCHIVE_DIR/original_documents/"
fi
if [ -f "$PROJECT_ROOT/Kessinger_Heather_804_IS_250412.pdf" ]; then
    mv "$PROJECT_ROOT/Kessinger_Heather_804_IS_250412.pdf" "$ARCHIVE_DIR/original_documents/"
fi
if [ -f "$PROJECT_ROOT/Kessinger^J Heather_802_final paper_24122.pdf" ]; then
    mv "$PROJECT_ROOT/Kessinger^J Heather_802_final paper_24122.pdf" "$ARCHIVE_DIR/original_documents/"
fi

echo "Moving converted markdown files..."
if [ -d "$PROJECT_ROOT/docs/converted_markdown" ]; then
    mv "$PROJECT_ROOT/docs/converted_markdown"/* "$ARCHIVE_DIR/docs/converted_markdown/" 2>/dev/null || true
    rmdir "$PROJECT_ROOT/docs/converted_markdown" 2>/dev/null || true
fi

echo "Moving Heather-specific analysis reports..."
if [ -f "$PROJECT_ROOT/docs/RBI_ANALYSIS_REPORT.md" ]; then
    mv "$PROJECT_ROOT/docs/RBI_ANALYSIS_REPORT.md" "$ARCHIVE_DIR/docs/"
fi
if [ -f "$PROJECT_ROOT/docs/RBI_ANALYSIS_REPORT.html" ]; then
    mv "$PROJECT_ROOT/docs/RBI_ANALYSIS_REPORT.html" "$ARCHIVE_DIR/docs/"
fi
if [ -f "$PROJECT_ROOT/docs/RBI_Resonance_Map.md" ]; then
    mv "$PROJECT_ROOT/docs/RBI_Resonance_Map.md" "$ARCHIVE_DIR/docs/"
fi
if [ -f "$PROJECT_ROOT/docs/S2S_RBI_SYNERGY_REPORT.md" ]; then
    mv "$PROJECT_ROOT/docs/S2S_RBI_SYNERGY_REPORT.md" "$ARCHIVE_DIR/docs/"
fi
if [ -f "$PROJECT_ROOT/docs/refactored_analysis.json" ]; then
    mv "$PROJECT_ROOT/docs/refactored_analysis.json" "$ARCHIVE_DIR/docs/"
fi
if [ -f "$PROJECT_ROOT/docs/RES_Based_Methodology_Reflection.md" ]; then
    mv "$PROJECT_ROOT/docs/RES_Based_Methodology_Reflection.md" "$ARCHIVE_DIR/docs/"
fi

echo "Moving S2S Enhanced Reflection files..."
if [ -f "$PROJECT_ROOT/docs/S2S_Enhanced_Reflection.md" ]; then
    mv "$PROJECT_ROOT/docs/S2S_Enhanced_Reflection.md" "$ARCHIVE_DIR/docs/"
fi
if [ -f "$PROJECT_ROOT/docs/S2S_Enhanced_Reflection_Final_with_Appendix.md" ]; then
    mv "$PROJECT_ROOT/docs/S2S_Enhanced_Reflection_Final_with_Appendix.md" "$ARCHIVE_DIR/docs/"
fi
if [ -f "$PROJECT_ROOT/docs/S2S_Enhanced_Reflection_S2SAligned.md" ]; then
    mv "$PROJECT_ROOT/docs/S2S_Enhanced_Reflection_S2SAligned.md" "$ARCHIVE_DIR/docs/"
fi
if [ -f "$PROJECT_ROOT/docs/S2S_Enhanced_Reflection_S2SAligned.html" ]; then
    mv "$PROJECT_ROOT/docs/S2S_Enhanced_Reflection_S2SAligned.html" "$ARCHIVE_DIR/docs/"
fi

echo "Moving Heather-specific scripts..."
if [ -f "$PROJECT_ROOT/scripts/generate-enhanced-reflection.ts" ]; then
    mv "$PROJECT_ROOT/scripts/generate-enhanced-reflection.ts" "$ARCHIVE_DIR/"
fi

echo "Moving temporary/backup files..."
if [ -f "$PROJECT_ROOT/src/field/computation/resonance-engine.original.ts.backup" ]; then
    mv "$PROJECT_ROOT/src/field/computation/resonance-engine.original.ts.backup" "$ARCHIVE_DIR/"
fi
if [ -f "$PROJECT_ROOT/rbi_kernel_refactored.py" ]; then
    mv "$PROJECT_ROOT/rbi_kernel_refactored.py" "$ARCHIVE_DIR/"
fi
if [ -f "$PROJECT_ROOT/REFACTORING_SUMMARY.md" ]; then
    mv "$PROJECT_ROOT/REFACTORING_SUMMARY.md" "$ARCHIVE_DIR/"
fi

echo "Creating README in archive..."
cat > "$ARCHIVE_DIR/README.md" << 'EOF'
# Heather Kessinger Dissertation Analysis Archive

This directory contains all files related to the RBI × S2S analysis of Heather Kessinger's doctoral dissertation materials.

## Contents

- `original_documents/` - Original PDF and DOCX files from Heather
- `docs/converted_markdown/` - Converted Markdown versions of documents
- `docs/` - Analysis reports, reflections, and resonance maps
- `generate-enhanced-reflection.ts` - Script specific to generating Heather's reflection format

## Purpose

These files demonstrate a real-world application of RBI × S2S as a consciousness technology for analyzing decolonial research, embodied knowledge, and anti-archive methodologies. The analysis serves as a case study for how the system interprets geometric field coherence and translates it into narrative resonance.

## Note

These files are archived separately from the core RBI Kernel codebase to maintain separation between case studies and the production system.
EOF

echo ""
echo "✅ Cleanup complete!"
echo "📁 Files archived to: $ARCHIVE_DIR"
echo ""
echo "Remaining in workspace:"
echo "  - Core RBI Kernel code (src/)"
echo "  - Generic processing scripts (scripts/analyze-documents.ts, etc.)"
echo "  - Core documentation (docs/API_REFERENCE.md, etc.)"
echo "  - S2S integration (scripts/s2s/)"
echo ""

