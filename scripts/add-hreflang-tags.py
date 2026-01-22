#!/usr/bin/env python3
"""
Add hreflang tags to all HTML pages in locale folders.
This improves SEO by telling search engines about language alternatives.
"""

import os
import re

# Configuration
LOCALES = ['be-nl', 'nl-nl', 'be-fr', 'de-de']
HREFLANG_MAP = {
    'be-nl': 'nl-BE',
    'nl-nl': 'nl-NL', 
    'be-fr': 'fr-BE',
    'de-de': 'de-DE'
}
DEFAULT_LOCALE = 'be-nl'
BASE_URL = 'https://structon.be'

def get_hreflang_tags(page_path, current_locale):
    """Generate hreflang tags for a page."""
    tags = []
    
    for locale in LOCALES:
        hreflang = HREFLANG_MAP[locale]
        url = f'{BASE_URL}/{locale}/{page_path}'
        tags.append(f'  <link rel="alternate" hreflang="{hreflang}" href="{url}">')
    
    # Add x-default pointing to default locale
    default_url = f'{BASE_URL}/{DEFAULT_LOCALE}/{page_path}'
    tags.append(f'  <link rel="alternate" hreflang="x-default" href="{default_url}">')
    
    return '\n'.join(tags)

def add_hreflang_to_file(filepath, locale_folder, locale):
    """Add hreflang tags to a single HTML file."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has hreflang
    if 'hreflang=' in content:
        return False
    
    # Get relative page path from locale folder
    rel_path = os.path.relpath(filepath, locale_folder)
    # Convert to URL path (e.g., contact/index.html -> contact/)
    if rel_path == 'index.html':
        page_path = ''
    else:
        page_path = os.path.dirname(rel_path) + '/'
    
    # Generate hreflang tags
    hreflang_tags = get_hreflang_tags(page_path, locale)
    
    # Find </head> and insert before it
    if '</head>' in content:
        # Add hreflang tags before </head>
        hreflang_block = f'\n  <!-- Hreflang tags for multilanguage SEO -->\n{hreflang_tags}\n'
        content = content.replace('</head>', hreflang_block + '</head>')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def process_locale_folder(web_root, locale):
    """Process all HTML files in a locale folder."""
    
    locale_folder = os.path.join(web_root, locale)
    
    if not os.path.exists(locale_folder):
        print(f"  Locale folder not found: {locale}")
        return 0
    
    fixed_count = 0
    
    for root, dirs, files in os.walk(locale_folder):
        for filename in files:
            if filename.endswith('.html'):
                filepath = os.path.join(root, filename)
                if add_hreflang_to_file(filepath, locale_folder, locale):
                    rel_path = os.path.relpath(filepath, web_root)
                    print(f"    ✓ {rel_path}")
                    fixed_count += 1
    
    return fixed_count

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_root = os.path.join(os.path.dirname(script_dir), 'web')
    
    if not os.path.exists(web_root):
        print(f"Web root not found: {web_root}")
        return
    
    print("Adding hreflang tags to locale pages...")
    print(f"Base URL: {BASE_URL}")
    print(f"Locales: {', '.join(LOCALES)}")
    print()
    
    total_fixed = 0
    for locale in LOCALES:
        print(f"Processing /{locale}/...")
        count = process_locale_folder(web_root, locale)
        total_fixed += count
        print(f"  Added hreflang to {count} files")
        print()
    
    print(f"Total files updated: {total_fixed}")

if __name__ == '__main__':
    main()
