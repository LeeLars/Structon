#!/usr/bin/env python3
"""
Fix tonnage filter: Change 1,5 ton to 1 ton in all product pages
"""

import os
import re
from pathlib import Path

# Base directory
base_dir = Path('/Users/larsleenders/Downloads/Structon/web')

# Find all HTML files in locale product folders
locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']
changed_files = []

for locale in locales:
    product_dir = base_dir / locale / 'producten'
    if not product_dir.exists():
        continue
    
    # Find all index.html files recursively
    for html_file in product_dir.rglob('index.html'):
        try:
            content = html_file.read_text(encoding='utf-8')
            original_content = content
            
            # Replace 1,5 - 3 ton with 1 - 3 ton (for excavator filter)
            content = re.sub(
                r'(<input name="excavator" type="checkbox" value="1500"/>\s*<span>\s*)1,5 - 3 ton',
                r'\g<1>1 - 3 ton',
                content
            )
            
            # Also handle variations with different spacing
            content = re.sub(
                r'(<input name="excavator" type="checkbox" value="1500"[^>]*>\s*<span[^>]*>\s*)1,5\s*-\s*3\s*ton',
                r'\g<1>1 - 3 ton',
                content,
                flags=re.IGNORECASE
            )
            
            if content != original_content:
                html_file.write_text(content, encoding='utf-8')
                changed_files.append(str(html_file.relative_to(base_dir)))
                print(f'✓ Fixed: {html_file.relative_to(base_dir)}')
        
        except Exception as e:
            print(f'✗ Error processing {html_file}: {e}')

print(f'\n✅ Updated {len(changed_files)} files')
print('Changed files:')
for f in changed_files[:10]:  # Show first 10
    print(f'  - {f}')
if len(changed_files) > 10:
    print(f'  ... and {len(changed_files) - 10} more')
