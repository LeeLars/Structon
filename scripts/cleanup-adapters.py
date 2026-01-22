#!/usr/bin/env python3
"""
Remove all remaining Adapters/Adapterstukken references from locale folders.
"""

import os
import re

def cleanup_file(filepath):
    """Remove adapters references from a file."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Remove adapters mega menu section (lines 434-538 approximately)
    # Pattern: from <div class="menu-item"> with adapters to closing </div>
    adapters_menu_pattern = r'<div class="menu-item">\s*<a href="[^"]*\?cat=adapters[^"]*">.*?</div>\s*</div>\s*</div>\s*</div>\s*</div>\s*(?=<div class="menu-item">|</div>\s*<div class="nav-actions">)'
    content = re.sub(adapters_menu_pattern, '', content, flags=re.DOTALL)
    
    # Remove adapters nav link in mobile menu
    content = re.sub(r'<a href="[^"]*\?cat=adapters[^"]*" class="nav-link">Adapterstukken</a>\s*', '', content)
    
    # Remove footer adapters link
    content = re.sub(r'<a href="/adapters/[^"]*" class="footer-link">Adapters</a>\s*', '', content)
    content = re.sub(r'<a href="\.\./adapters/[^"]*" class="footer-link">Adapters</a>\s*', '', content)
    
    # Remove inline adapters references in text (but keep "adapter" as technical term)
    content = re.sub(r'<a href="[^"]*\?cat=adapters[^"]*">adapterstukken</a>', 'aanbouwdelen', content)
    content = re.sub(r'<a href="[^"]*\?cat=adapters[^"]*">Adapterstukken</a>', 'aanbouwdelen', content)
    
    # Remove any remaining cat=adapters links
    content = re.sub(r'<a href="[^"]*\?cat=adapters[^"]*"[^>]*>[^<]*</a>\s*', '', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def process_folder(web_root, folder):
    """Process all HTML files in a folder."""
    
    folder_path = os.path.join(web_root, folder)
    if not os.path.exists(folder_path):
        return 0
    
    count = 0
    for root, dirs, files in os.walk(folder_path):
        for filename in files:
            if filename.endswith('.html'):
                filepath = os.path.join(root, filename)
                if cleanup_file(filepath):
                    rel_path = os.path.relpath(filepath, web_root)
                    print(f"  ✓ {rel_path}")
                    count += 1
    
    return count

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_root = os.path.join(os.path.dirname(script_dir), 'web')
    
    print("Cleaning up Adapters references...")
    print()
    
    total = 0
    for folder in ['be-nl', 'nl-nl', 'be-fr', 'de-de']:
        print(f"Processing /{folder}/...")
        count = process_folder(web_root, folder)
        total += count
    
    print()
    print(f"Total files cleaned: {total}")

if __name__ == '__main__':
    main()
