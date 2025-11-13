#!/usr/bin/env python3
"""
Add Codex-Book Threading metadata to all chapters and interludes
"""

import os
import re
from pathlib import Path

def add_codex_threading(file_path):
    """Add Codex-Book threading metadata to a file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Determine book assignment and codex destination
    filename = Path(file_path).stem
    
    if filename.startswith('CHAPTER_'):
        book_assignment = "Book 1: Stardust to Sovereignty"
        codex_destination = f"/book_fragments/{filename.lower()}/"
        dashboard_component = "book_chapter"
        is_primary_source = True
    elif filename.startswith('INTERLUDE_'):
        book_assignment = "Book 1: Stardust to Sovereignty"
        codex_destination = f"/book_fragments/{filename.lower()}/"
        dashboard_component = "book_interlude"
        is_primary_source = True
    else:
        return content  # Skip unknown files
    
    # Check if codex threading already exists
    if "# Codex-Book Threading" in content:
        return content  # Already has threading
    
    # Find the insertion point (after quadrant, before overlays)
    pattern = r'(quadrant: "FOUNDATIONAL_QUADRANT")\n\n(# Overlays)'
    replacement = f'''{r'\1'}

# Codex-Book Threading
book_assignment: "{book_assignment}"
codex_destination: "{codex_destination}"
dashboard_component: "{dashboard_component}"
is_primary_source: {str(is_primary_source).lower()}

{r'\2'}'''
    
    new_content = re.sub(pattern, replacement, content)
    
    return new_content

def main():
    """Process all files in the generated content directory"""
    
    content_dir = Path("BOOK_COMPILER_DEMONSTRATION/03_GENERATED_CONTENT")
    
    if not content_dir.exists():
        print(f"Directory {content_dir} does not exist")
        return
    
    processed_count = 0
    
    for file_path in content_dir.glob("*.md"):
        if file_path.name == ".DS_Store":
            continue
            
        print(f"Processing {file_path.name}...")
        
        new_content = add_codex_threading(file_path)
        
        if new_content != file_path.read_text(encoding='utf-8'):
            file_path.write_text(new_content, encoding='utf-8')
            processed_count += 1
            print(f"  ✅ Updated {file_path.name}")
        else:
            print(f"  ⏭️  No changes needed for {file_path.name}")
    
    print(f"\n🎯 Processed {processed_count} files")

if __name__ == "__main__":
    main()

