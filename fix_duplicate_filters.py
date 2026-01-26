#!/usr/bin/env python3
"""
Script to remove duplicate tonnage filter sections from industry pages.
Keeps only the first (correct) filter section and removes subsequent duplicates.
"""

import re
from pathlib import Path

def remove_duplicate_filters(file_path):
    """Remove duplicate tonnage-filter-section from HTML file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match the entire tonnage-filter-section
    pattern = r'<section class="tonnage-filter-section">.*?</section>\s*\n\s*\n'
    
    # Find all matches
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    if len(matches) <= 1:
        return False  # No duplicates
    
    # Keep only the first match, remove all others
    for match in reversed(matches[1:]):  # Reverse to maintain string positions
        content = content[:match.start()] + content[match.end():]
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    base_path = Path('web')
    locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']
    
    fixed_count = 0
    
    for locale in locales:
        locale_path = base_path / locale / 'industrieen'
        if not locale_path.exists():
            continue
        
        for industry_dir in locale_path.iterdir():
            if not industry_dir.is_dir():
                continue
            
            index_file = industry_dir / 'index.html'
            if not index_file.exists():
                continue
            
            if remove_duplicate_filters(index_file):
                print(f"✓ Fixed: {index_file}")
                fixed_count += 1
            else:
                print(f"  OK: {index_file}")
    
    print(f"\n✅ Fixed {fixed_count} files with duplicate filters")

if __name__ == '__main__':
    main()
