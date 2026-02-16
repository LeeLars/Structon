#!/usr/bin/env python3
"""
Add Canonical Script to All HTML Files
Adds the canonical.js script tag to all HTML files in all locales
"""

import os
import re
from pathlib import Path

def add_canonical_script(filepath):
    """Add canonical.js script to HTML file if not already present"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if canonical.js is already included
        if 'canonical.js' in content:
            return False
        
        # Find the closing </head> tag and add the script before it
        # Calculate the correct relative path to assets/js/canonical.js
        file_path = Path(filepath)
        web_dir = Path('/Users/larsleenders/Downloads/Structon/web')
        
        # Get relative path from file to web root
        try:
            rel_path = os.path.relpath(web_dir, file_path.parent)
            if rel_path == '.':
                script_path = 'assets/js/canonical.js'
            else:
                script_path = f"{rel_path}/assets/js/canonical.js"
        except ValueError:
            # If paths are on different drives, use absolute path
            script_path = '../assets/js/canonical.js'
        
        # Normalize path separators
        script_path = script_path.replace('\\', '/')
        
        # Add script tag before </head>
        script_tag = f'  <script src="{script_path}" defer></script>\n'
        
        # Insert before </head>
        if '</head>' in content:
            content = content.replace('</head>', f'{script_tag}</head>')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    base_dir = Path('/Users/larsleenders/Downloads/Structon/web')
    
    locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']
    total_updated = 0
    
    for locale in locales:
        locale_dir = base_dir / locale
        if not locale_dir.exists():
            continue
        
        print(f"\nProcessing {locale}...")
        count = 0
        
        for html_file in locale_dir.rglob('*.html'):
            if add_canonical_script(html_file):
                count += 1
                print(f"  ✓ {html_file.relative_to(base_dir)}")
        
        print(f"Updated {count} files in {locale}")
        total_updated += count
    
    print(f"\n✅ Total: {total_updated} files updated with canonical.js script")

if __name__ == '__main__':
    main()
