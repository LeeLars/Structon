#!/usr/bin/env python3
"""
Update brand page titles to include 'graafmachine'
Changes: "Kraanbak voor [Brand]" -> "Kraanbak voor [Brand] graafmachine"
"""

import os
import re

# Base path
base_path = '/Users/larsleenders/Downloads/Structon/web'

# Locales to process
locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']

# Brand folders
brands = [
    'caterpillar', 'komatsu', 'hitachi', 'volvo', 'liebherr',
    'jcb', 'case', 'kobelco', 'hyundai', 'develon',
    'kubota', 'yanmar', 'takeuchi', 'wacker-neuson', 'sany'
]

# Translation mapping for "graafmachine"
translations = {
    'be-nl': 'graafmachine',
    'nl-nl': 'graafmachine',
    'be-fr': 'pelle mécanique',
    'de-de': 'Bagger'
}

def update_brand_page(filepath, locale):
    """Update a single brand page"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Get the translation for this locale
        machine_word = translations.get(locale, 'graafmachine')
        
        # Pattern to match the h1 title
        # Matches: <h1 class="brand-title-large">Kraanbak voor [Brand]</h1>
        # Or French: <h1 class="brand-title-large">Godet pour [Brand]</h1>
        # Or German: <h1 class="brand-title-large">Baggerlöffel für [Brand]</h1>
        
        patterns = [
            # Dutch
            (r'(<h1 class="brand-title-large">Kraanbak voor )([^<]+)(</h1>)',
             r'\1\2 graafmachine\3'),
            # French
            (r'(<h1 class="brand-title-large">Godet pour )([^<]+)(</h1>)',
             r'\1\2 pelle mécanique\3'),
            # German
            (r'(<h1 class="brand-title-large">Baggerlöffel für )([^<]+)(</h1>)',
             r'\1\2 Bagger\3'),
        ]
        
        original_content = content
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content)
        
        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    updated_count = 0
    
    for locale in locales:
        for brand in brands:
            filepath = os.path.join(base_path, locale, 'kraanbakken', brand, 'index.html')
            
            if os.path.exists(filepath):
                if update_brand_page(filepath, locale):
                    updated_count += 1
                    print(f"✓ Updated: {locale}/kraanbakken/{brand}/index.html")
            else:
                print(f"⚠ Not found: {filepath}")
    
    print(f"\n✅ Updated {updated_count} brand pages")

if __name__ == '__main__':
    main()
