#!/usr/bin/env python3
"""
Cursor Delta-Comparison Script
Performs comprehensive diff analysis between two manuscript versions
"""

import os
import re
import json
from pathlib import Path
from difflib import unified_diff, SequenceMatcher
from typing import List, Dict, Tuple, Optional
import math

# Chapter order from reference manuscript
CHAPTER_ORDER = [
    # Front Matter
    "SERIES_NOTE",
    "PROLOGUE",
    "INTRODUCTION",
    # Part 1
    "CHAPTER_01_THE_STARDUST_WITHIN",
    "INTERLUDE_FROM_STARDUST_TO_TECHNOLOGY",
    "CHAPTER_02_THE_BODY_AS_ADVANCED_BIOLOGICAL_TECHNOLOGY",
    "INTERLUDE_FROM_TECHNOLOGY_TO_INTELLIGENCE",
    "CHAPTER_03_METABOLIC_INTELLIGENCE",
    "INTERLUDE_THROUGH_COLLAPSE_AND_COHERENCE",
    "CHAPTER_04_RESONANCE_AND_THE_ENERGETIC_UNIVERSE",
    "INTERLUDE_FROM_STRUCTURE_TO_SOVEREIGNTY",
    # Part 2
    "CHAPTER_05_DEFINING_ENERGETIC_SOVEREIGNTY",
    "INTERLUDE_FROM_SOVEREIGNTY_TO_MEMORY",
    "CHAPTER_06_STEPPING_BEYOND_LIMITATIONS",
    "INTERLUDE_FROM_MEMORY_TO_TRANSFORMATION",
    "CHAPTER_07_THE_ALCHEMICAL_CURRENT",
    "INTERLUDE_FROM_ALCHEMY_TO_DISINTEGRATION",
    "CHAPTER_08_SOVEREIGN_DISINTEGRATION",
    "INTERLUDE_FROM_SIGNAL_TO_FLOW",
    # Part 3
    "CHAPTER_09_TEMPORAL_FLUIDITY",
    "INTERLUDE_FROM_FLUIDITY_TO_LANGUAGE",
    "CHAPTER_10_LANGUAGE_AS_SONIC_GRID",
    "INTERLUDE_FROM_LANGUAGE_TO_ARCHITECTURE",
    "CHAPTER_11_SACRED_ARCHITECTURE",
    "INTERLUDE_FROM_ARCHITECTURE_TO_FIELD",
    "CHAPTER_12_THE_SOVEREIGN_FIELD",
    "INTERLUDE_FROM_FIELD_TO_AI",
    "CHAPTER_13_AI_AND_BRIDGING_INTELLIGENCE",
    "INTERLUDE_FROM_AI_TO_BLUEPRINT",
    # Part 4
    "CHAPTER_14_THE_LIVING_BLUEPRINT",
    "INTERLUDE_FROM_BLUEPRINT_TO_BECOMING",
    "CHAPTER_15_BEYOND_STARDUST",
    # Back Matter
    "CONCLUSION",
    "AFTERWORD_LIVING_SYSTEM_INTERFACE",
    "EPILOGUE",
    # Appendices
    "ORB_AXIS_MAP",
    "SCROLLSTREAM_PRIMARY_PULSES",
    "SOMATIC_CODEX_DIAGRAM",
]


def normalize_filename(filename: str) -> str:
    """Normalize filename: remove timestamps, unify casing, extract base name."""
    # Remove extension
    base = filename.replace('.md', '').replace('.txt', '')
    # Remove timestamps (patterns like "12.39.54 PM" or similar)
    base = re.sub(r'\s*\d{1,2}\.?\d{1,2}\.?\d{1,2}\s*(AM|PM|am|pm)?', '', base, flags=re.IGNORECASE)
    # Remove other timestamp patterns
    base = re.sub(r'_\d{8}_\d{6}', '', base)  # _20251028_123045
    base = re.sub(r'-\d{8}', '', base)  # -20251028
    # Convert to uppercase for matching
    return base.upper().replace(' ', '_')


def get_chapter_index(normalized_name: str) -> int:
    """Get sort index based on chapter order."""
    # Try exact match
    if normalized_name in CHAPTER_ORDER:
        return CHAPTER_ORDER.index(normalized_name)
    
    # Try partial match for chapters
    for i, chapter in enumerate(CHAPTER_ORDER):
        if chapter in normalized_name or normalized_name in chapter:
            return i
    
    # If not found, add to end
    return len(CHAPTER_ORDER) + 1


def extract_files(directory: str) -> Dict[str, str]:
    """Extract all .md and .txt files, normalize names."""
    files = {}
    for root, dirs, filenames in os.walk(directory):
        if '__MACOSX' in root:
            continue
        for filename in filenames:
            if filename.endswith(('.md', '.txt')):
                full_path = os.path.join(root, filename)
                normalized = normalize_filename(filename)
                if normalized not in files:
                    files[normalized] = full_path
    return files


def count_words(text: str) -> int:
    """Count words in text."""
    words = re.findall(r'\b\w+\b', text)
    return len(words)


def count_sentences(text: str) -> List[str]:
    """Split text into sentences."""
    # Simple sentence splitting
    sentences = re.split(r'[.!?]+\s+', text)
    return [s.strip() for s in sentences if s.strip()]


def avg_sentence_length(text: str) -> float:
    """Calculate average sentence length in words."""
    sentences = count_sentences(text)
    if not sentences:
        return 0.0
    total_words = sum(count_words(s) for s in sentences)
    return total_words / len(sentences) if sentences else 0.0


def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate similarity percentage using SequenceMatcher."""
    matcher = SequenceMatcher(None, text1, text2)
    return matcher.ratio() * 100


def find_orb_references(text: str) -> set:
    """Find all Orb-related references."""
    orb_patterns = [
        r'orb\s+\d+',
        r'orbit',
        r'frequency',
        r'field',
        r'architecture',
        r'resonance',
        r'harmonic',
        r'sovereign',
    ]
    found = set()
    text_lower = text.lower()
    for pattern in orb_patterns:
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        found.update(matches)
    return found


def find_long_paragraphs(text: str, min_words: int = 120) -> List[Tuple[int, str]]:
    """Find paragraphs longer than min_words."""
    paragraphs = text.split('\n\n')
    long_paras = []
    for i, para in enumerate(paragraphs):
        word_count = count_words(para)
        if word_count > min_words:
            long_paras.append((i, para[:200] + '...' if len(para) > 200 else para))
    return long_paras


def calculate_diff_metrics(old_text: str, new_text: str) -> Dict:
    """Calculate comprehensive diff metrics."""
    old_lines = old_text.splitlines()
    new_lines = new_text.splitlines()
    
    # Calculate diff
    diff_lines = list(unified_diff(old_lines, new_lines, n=3, lineterm=''))
    
    added = sum(1 for line in diff_lines if line.startswith('+') and not line.startswith('+++'))
    removed = sum(1 for line in diff_lines if line.startswith('-') and not line.startswith('---'))
    
    # Word counts
    old_words = count_words(old_text)
    new_words = count_words(new_text)
    word_change = ((new_words - old_words) / old_words * 100) if old_words > 0 else 0
    
    # Sentence lengths
    old_avg_sent = avg_sentence_length(old_text)
    new_avg_sent = avg_sentence_length(new_text)
    sent_delta = new_avg_sent - old_avg_sent
    
    # Similarity
    similarity = calculate_similarity(old_text, new_text)
    change_percent = 100 - similarity
    
    return {
        'added_lines': added,
        'removed_lines': removed,
        'words_before': old_words,
        'words_after': new_words,
        'word_change_percent': word_change,
        'avg_sentence_before': old_avg_sent,
        'avg_sentence_after': new_avg_sent,
        'sentence_delta': sent_delta,
        'change_percent': change_percent,
        'similarity': similarity,
    }


def compare_chapter(old_path: Optional[str], new_path: Optional[str], chapter_name: str) -> Dict:
    """Compare a single chapter between versions."""
    old_text = ''
    new_text = ''
    
    if old_path and os.path.exists(old_path):
        with open(old_path, 'r', encoding='utf-8') as f:
            old_text = f.read()
    
    if new_path and os.path.exists(new_path):
        with open(new_path, 'r', encoding='utf-8') as f:
            new_text = f.read()
    
    if not old_text and not new_text:
        return None
    
    # Calculate metrics
    if old_text and new_text:
        metrics = calculate_diff_metrics(old_text, new_text)
    elif new_text:
        # New file
        metrics = {
            'added_lines': len(new_text.splitlines()),
            'removed_lines': 0,
            'words_before': 0,
            'words_after': count_words(new_text),
            'word_change_percent': 100,
            'avg_sentence_before': 0,
            'avg_sentence_after': avg_sentence_length(new_text),
            'sentence_delta': avg_sentence_length(new_text),
            'change_percent': 100,
            'similarity': 0,
        }
    else:
        # Deleted file
        metrics = {
            'added_lines': 0,
            'removed_lines': len(old_text.splitlines()),
            'words_before': count_words(old_text),
            'words_after': 0,
            'word_change_percent': -100,
            'avg_sentence_before': avg_sentence_length(old_text),
            'avg_sentence_after': 0,
            'sentence_delta': -avg_sentence_length(old_text),
            'change_percent': 100,
            'similarity': 0,
        }
    
    # Find annotations
    long_paras = []
    new_orb_refs = set()
    
    if new_text:
        long_paras = find_long_paragraphs(new_text)
        new_orb_refs = find_orb_references(new_text)
        if old_text:
            old_orb_refs = find_orb_references(old_text)
            new_orb_refs = new_orb_refs - old_orb_refs
    
    metrics['long_paragraphs'] = len(long_paras)
    metrics['new_orb_references'] = list(new_orb_refs)
    metrics['old_path'] = old_path
    metrics['new_path'] = new_path
    
    # Generate diff
    if old_text and new_text:
        diff = list(unified_diff(
            old_text.splitlines(keepends=True),
            new_text.splitlines(keepends=True),
            fromfile=f'{chapter_name} (old)',
            tofile=f'{chapter_name} (new)',
            n=3,
            lineterm=''
        ))
        metrics['diff'] = ''.join(diff)
    elif new_text:
        metrics['diff'] = f"New file: {chapter_name}\n" + new_text
    else:
        metrics['diff'] = f"Deleted file: {chapter_name}"
    
    return metrics


def main():
    """Main processing function."""
    # Extract files
    print("Extracting files from v1...")
    v1_files = extract_files('v1_extracted')
    print(f"  Found {len(v1_files)} files")
    
    print("Extracting files from v2...")
    v2_files = extract_files('v2_extracted')
    print(f"  Found {len(v2_files)} files")
    
    # Get all unique chapter names
    all_chapters = set(v1_files.keys()) | set(v2_files.keys())
    
    # Sort chapters according to reference order
    sorted_chapters = sorted(all_chapters, key=lambda x: (get_chapter_index(x), x))
    
    print(f"\nComparing {len(sorted_chapters)} chapters...")
    
    # Compare chapters
    comparisons = []
    diff_files = {}
    
    os.makedirs('delta_output', exist_ok=True)
    
    for chapter_norm in sorted_chapters:
        old_path = v1_files.get(chapter_norm)
        new_path = v2_files.get(chapter_norm)
        
        # Find actual filename for display
        if new_path:
            display_name = os.path.basename(new_path).replace('.md', '').replace('.txt', '')
        elif old_path:
            display_name = os.path.basename(old_path).replace('.md', '').replace('.txt', '')
        else:
            display_name = chapter_norm
        
        print(f"  Comparing: {display_name}...")
        metrics = compare_chapter(old_path, new_path, display_name)
        
        if metrics:
            metrics['chapter'] = display_name
            metrics['normalized'] = chapter_norm
            comparisons.append(metrics)
            
            # Save diff file
            diff_filename = f"{chapter_norm.lower()}_diff.txt"
            diff_path = os.path.join('delta_output', diff_filename)
            with open(diff_path, 'w', encoding='utf-8') as f:
                f.write(metrics['diff'])
            diff_files[chapter_norm] = diff_path
    
    # Generate summary table
    print("\nGenerating summary table...")
    summary_rows = []
    for comp in comparisons:
        summary_rows.append({
            'Chapter': comp['chapter'],
            'Words Before': comp['words_before'],
            'Words After': comp['words_after'],
            '% Change': f"{comp['word_change_percent']:.1f}%",
            'Avg Sentence Δ': f"{comp['sentence_delta']:.1f}",
            'Notes': f"Added: {comp['added_lines']}, Removed: {comp['removed_lines']}, Long paras: {comp['long_paragraphs']}, New Orb refs: {len(comp['new_orb_references'])}"
        })
    
    # Write summary table as markdown
    summary_md = "# Delta Comparison Summary\n\n"
    summary_md += "| Chapter | Words Before | Words After | % Change | Avg Sentence Δ | Notes |\n"
    summary_md += "|---------|-------------|-------------|----------|----------------|-------|\n"
    for row in summary_rows:
        summary_md += f"| {row['Chapter']} | {row['Words Before']} | {row['Words After']} | {row['% Change']} | {row['Avg Sentence Δ']} | {row['Notes']} |\n"
    
    with open('delta_summary.md', 'w', encoding='utf-8') as f:
        f.write(summary_md)
    
    # Compile unified manuscript
    print("\nCompiling unified manuscript...")
    compile_unified_manuscript(sorted_chapters, v1_files, v2_files, comparisons)
    
    # Write detailed metrics JSON
    with open('delta_output/metrics.json', 'w', encoding='utf-8') as f:
        json.dump(comparisons, f, indent=2, default=str)
    
    print("\n✓ Complete!")
    print(f"  - Summary: delta_summary.md")
    print(f"  - Unified manuscript: STARDUST_TO_SOVEREIGNTY_COMPILED_PREP.md")
    print(f"  - Diffs: delta_output/")
    print(f"  - Metrics: delta_output/metrics.json")


def compile_unified_manuscript(sorted_chapters: List[str], v1_files: Dict, v2_files: Dict, comparisons: List[Dict]):
    """Compile unified manuscript with source tags."""
    output = []
    output.append("# Stardust to Sovereignty - Compiled Prep Manuscript\n")
    output.append("*This file contains the newer version (v2) with source annotations.*\n\n")
    
    for chapter_norm in sorted_chapters:
        new_path = v2_files.get(chapter_norm)
        old_path = v1_files.get(chapter_norm)
        
        # Use new version if available, otherwise old
        source_path = new_path if new_path else old_path
        
        if not source_path:
            continue
        
        # Get chapter display name
        display_name = os.path.basename(source_path).replace('.md', '').replace('.txt', '')
        
        # Determine source version
        if new_path:
            source_tag = "<!-- from v2 (12.39.54 PM version) -->"
        else:
            source_tag = "<!-- from v1 (old version, not in v2) -->"
        
        output.append(f"\n\n{source_tag}\n")
        output.append(f"# {display_name}\n\n")
        
        # Read content
        try:
            with open(source_path, 'r', encoding='utf-8') as f:
                content = f.read()
                output.append(content)
                if not content.endswith('\n'):
                    output.append('\n')
        except Exception as e:
            output.append(f"[Error reading file: {e}]\n")
        
        # Add annotations if available
        comp = next((c for c in comparisons if c['normalized'] == chapter_norm), None)
        if comp:
            if comp['long_paragraphs'] > 0:
                output.append(f"\n<!-- ANNOTATION: {comp['long_paragraphs']} paragraphs longer than 120 words -->\n")
            if comp['new_orb_references']:
                output.append(f"\n<!-- ANNOTATION: New Orb references: {', '.join(comp['new_orb_references'][:5])} -->\n")
    
    # Write compiled manuscript
    with open('STARDUST_TO_SOVEREIGNTY_COMPILED_PREP.md', 'w', encoding='utf-8') as f:
        f.write(''.join(output))


if __name__ == '__main__':
    main()

