#!/usr/bin/env python3
"""
Translate Category Pages (graafbakken, overige, sloop-sorteergrijpers) for be-fr and de-de
"""

import os
import re
from pathlib import Path

# Category translations
category_translations = {
    'be-fr': {
        'GRAAFBAKKEN': 'GODETS DE TERRASSEMENT',
        'Professionele graafbakken voor alle graafmachines.': 'Godets professionnels pour toutes les pelles mécaniques.',
        'OVERIGE': 'AUTRES',
        'Overige producten voor graafmachines.': 'Autres produits pour pelles mécaniques.',
        'SLOOP- EN SORTEERGRIJPERS': 'PINCES DE DÉMOLITION ET DE TRI',
        'Professionele grijpers voor sloop en recycling.': 'Pinces professionnelles pour la démolition et le recyclage.',
    },
    'de-de': {
        'GRAAFBAKKEN': 'BAGGERLÖFFEL',
        'Professionele graafbakken voor alle graafmachines.': 'Professionelle Baggerlöffel für alle Bagger.',
        'OVERIGE': 'SONSTIGE',
        'Overige producten voor graafmachines.': 'Sonstige Produkte für Bagger.',
        'SLOOP- EN SORTEERGRIJPERS': 'ABBRUCH- UND SORTIERGREIFER',
        'Professionele grijpers voor sloop en recycling.': 'Professionelle Greifer für Abbruch und Recycling.',
    }
}

def translate_category_page(filepath, locale):
    """Translate category page title and subtitle"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        translations = category_translations.get(locale, {})
        
        # Sort by length (longest first) to avoid partial replacements
        sorted_translations = sorted(translations.items(), key=lambda x: len(x[0]), reverse=True)
        
        for dutch, translation in sorted_translations:
            content = content.replace(dutch, translation)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    base_dir = Path('/Users/larsleenders/Downloads/Structon/web')
    
    categories = [
        'producten/graafbakken',
        'producten/overige',
        'producten/sloop-sorteergrijpers'
    ]
    
    locales = ['be-fr', 'de-de']
    
    total_updated = 0
    
    for locale in locales:
        print(f"\nProcessing {locale} category pages...")
        locale_dir = base_dir / locale
        
        for category in categories:
            category_file = locale_dir / category / 'index.html'
            if category_file.exists():
                if translate_category_page(category_file, locale):
                    total_updated += 1
                    print(f"  ✓ {category_file.relative_to(base_dir)}")
                else:
                    print(f"  - No changes for {category_file.relative_to(base_dir)}")
            else:
                print(f"  ✗ Not found: {category_file.relative_to(base_dir)}")
    
    print(f"\n✅ Total: {total_updated} category pages updated")

if __name__ == '__main__':
    main()
