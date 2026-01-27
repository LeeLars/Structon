#!/usr/bin/env python3
"""
Structon Catalog Page Generator
Generates static HTML pages for categories and subcategories with clean URLs.
"""

import os
from pathlib import Path

WEB_ROOT = Path(__file__).parent.parent / 'web'
LOCALES = ['be-nl', 'nl-nl', 'be-fr', 'de-de']
BASE_URL = 'https://leelars.github.io/Structon'

# Import data from separate file
from catalog_data import CATEGORIES, SUBCATEGORIES, LABELS

def get_hreflang_tags(locale, path_suffix):
    tags = []
    locale_map = {'be-nl': 'nl-BE', 'nl-nl': 'nl-NL', 'be-fr': 'fr-BE', 'de-de': 'de-DE'}
    for loc in LOCALES:
        tags.append(f'  <link rel="alternate" hreflang="{locale_map[loc]}" href="{BASE_URL}/{loc}/{path_suffix}">')
    tags.append(f'  <link rel="alternate" hreflang="x-default" href="{BASE_URL}/be-nl/{path_suffix}">')
    return '\n'.join(tags)

def get_canonical_tag(locale, path_suffix):
    return f'  <link rel="canonical" href="{BASE_URL}/{locale}/{path_suffix}">'

def generate_category_page(category_slug, locale):
    from catalog_templates import get_category_html
    return get_category_html(category_slug, locale, CATEGORIES, SUBCATEGORIES, LABELS, BASE_URL, LOCALES)

def generate_subcategory_page(subcategory_slug, locale):
    from catalog_templates import get_subcategory_html
    return get_subcategory_html(subcategory_slug, locale, CATEGORIES, SUBCATEGORIES, LABELS, BASE_URL, LOCALES)

def main():
    print("🚀 Structon Catalog Page Generator")
    print("=" * 50)
    
    pages_created = 0
    
    for locale in LOCALES:
        print(f"\n📁 Processing locale: {locale}")
        
        # Create category pages
        for category_slug in CATEGORIES:
            category_dir = WEB_ROOT / locale / 'producten' / category_slug
            category_dir.mkdir(parents=True, exist_ok=True)
            
            html = generate_category_page(category_slug, locale)
            (category_dir / 'index.html').write_text(html, encoding='utf-8')
            pages_created += 1
            print(f"  ✅ Created: /{locale}/producten/{category_slug}/")
            
            # Create subcategory pages
            for subcat_slug in CATEGORIES[category_slug].get('subcategories', []):
                subcat_dir = category_dir / subcat_slug
                subcat_dir.mkdir(parents=True, exist_ok=True)
                
                html = generate_subcategory_page(subcat_slug, locale)
                (subcat_dir / 'index.html').write_text(html, encoding='utf-8')
                pages_created += 1
                print(f"    ✅ Created: /{locale}/producten/{category_slug}/{subcat_slug}/")
    
    print(f"\n🎉 Done! Created {pages_created} pages across {len(LOCALES)} locales.")
    print("\n📋 Next steps:")
    print("  1. Update internal links to use clean URLs")
    print("  2. Update sitemap.xml with new URLs")
    print("  3. Commit and push to GitHub")

if __name__ == '__main__':
    main()
