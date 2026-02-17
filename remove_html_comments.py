#!/usr/bin/env python3
"""
Remove all HTML comments from HTML files
Removes: <!-- comment -->
"""

import os
import re
from pathlib import Path

# Base path
base_path = '/Users/larsleenders/Downloads/Structon/web'

def remove_html_comments(content):
    """Remove HTML comments from content"""
    # Pattern to match HTML comments: <!-- ... -->
    # This handles multi-line comments as well
    pattern = r'<!--.*?-->'
    cleaned = re.sub(pattern, '', content, flags=re.DOTALL)
    return cleaned

def process_html_file(filepath):
    """Process a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        # Remove comments
        cleaned_content = remove_html_comments(original_content)
        
        # Only write if content changed
        if cleaned_content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned_content)
            return True
        return False
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    updated_count = 0
    total_count = 0
    
    # Find all HTML files recursively
    for html_file in Path(base_path).rglob('*.html'):
        total_count += 1
        if process_html_file(html_file):
            updated_count += 1
            # Show relative path
            rel_path = html_file.relative_to(base_path)
            print(f"✓ Cleaned: {rel_path}")
    
    print(f"\n✅ Processed {total_count} HTML files")
    print(f"✅ Updated {updated_count} files (removed comments)")
    print(f"✅ Skipped {total_count - updated_count} files (no comments found)")

if __name__ == '__main__':
    main()
