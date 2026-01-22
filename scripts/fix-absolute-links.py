#!/usr/bin/env python3
"""
Fix absolute links in locale folders to be relative within the locale.
/contact/ -> contact/ (from locale root) or ../contact/ (from subpage)
"""

import os
import re

# Pages that exist in locale folders
LOCALE_PAGES = [
    'contact', 'over-ons', 'blog', 'faq', 'dealer', 'configurator', 
    'producten', 'privacy', 'voorwaarden', 'login', 'sitemap-pagina',
    'offerte-aanvragen', 'sorteergrijpers', 'sloophamers', 'slotenbakken',
    'kraanbakken', 'industrieen', 'sectoren', 'kennisbank', 'account'
]

def fix_links_in_file(filepath, locale_folder):
    """Fix absolute links in a file."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Calculate depth from locale folder
    rel_path = os.path.relpath(filepath, locale_folder)
    depth = rel_path.count(os.sep)
    
    # Prefix to get back to locale root
    if depth == 0:
        prefix = ''
    else:
        prefix = '../' * depth
    
    # Fix absolute links to locale pages
    for page in LOCALE_PAGES:
        # /page/ -> prefix + page/
        pattern = rf'href="/({page})(/[^"]*)?(")'
        replacement = rf'href="{prefix}\1\2\3'
        content = re.sub(pattern, replacement, content)
        
        # Also fix /page without trailing slash
        pattern = rf'href="/({page})"'
        replacement = rf'href="{prefix}\1/"'
        content = re.sub(pattern, replacement, content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def process_locale(web_root, locale):
    """Process all HTML files in a locale folder."""
    
    locale_folder = os.path.join(web_root, locale)
    if not os.path.exists(locale_folder):
        return 0
    
    count = 0
    for root, dirs, files in os.walk(locale_folder):
        for filename in files:
            if filename.endswith('.html'):
                filepath = os.path.join(root, filename)
                if fix_links_in_file(filepath, locale_folder):
                    rel_path = os.path.relpath(filepath, web_root)
                    print(f"  ✓ {rel_path}")
                    count += 1
    
    return count

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_root = os.path.join(os.path.dirname(script_dir), 'web')
    
    print("Fixing absolute links in locale folders...")
    print()
    
    total = 0
    for locale in ['be-nl', 'nl-nl', 'be-fr', 'de-de']:
        print(f"Processing /{locale}/...")
        count = process_locale(web_root, locale)
        total += count
        print()
    
    print(f"Total files fixed: {total}")

if __name__ == '__main__':
    main()
