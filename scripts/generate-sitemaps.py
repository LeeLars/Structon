#!/usr/bin/env python3
"""
Generate locale-specific sitemaps and sitemap index for multilanguage SEO.
"""

import os
from datetime import datetime

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
TODAY = datetime.now().strftime('%Y-%m-%d')

def get_all_pages(web_root, locale):
    """Get all HTML pages in a locale folder."""
    locale_folder = os.path.join(web_root, locale)
    pages = []
    
    for root, dirs, files in os.walk(locale_folder):
        for filename in files:
            if filename.endswith('.html'):
                filepath = os.path.join(root, filename)
                rel_path = os.path.relpath(filepath, locale_folder)
                
                # Convert to URL path
                if rel_path == 'index.html':
                    url_path = ''
                else:
                    url_path = os.path.dirname(rel_path) + '/'
                
                pages.append(url_path)
    
    return sorted(pages)

def generate_locale_sitemap(web_root, locale, pages):
    """Generate sitemap XML for a single locale."""
    
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        ''
    ]
    
    for page in pages:
        url = f'{BASE_URL}/{locale}/{page}'
        
        # Determine priority and changefreq based on page type
        if page == '':
            priority = '1.0'
            changefreq = 'daily'
        elif page in ['producten/', 'contact/', 'over-ons/']:
            priority = '0.9'
            changefreq = 'weekly'
        elif 'kraanbakken/' in page or 'slotenbakken/' in page:
            priority = '0.8'
            changefreq = 'weekly'
        else:
            priority = '0.7'
            changefreq = 'monthly'
        
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>{url}</loc>')
        xml_lines.append(f'    <lastmod>{TODAY}</lastmod>')
        xml_lines.append(f'    <changefreq>{changefreq}</changefreq>')
        xml_lines.append(f'    <priority>{priority}</priority>')
        
        # Add hreflang alternates
        for alt_locale in LOCALES:
            hreflang = HREFLANG_MAP[alt_locale]
            alt_url = f'{BASE_URL}/{alt_locale}/{page}'
            xml_lines.append(f'    <xhtml:link rel="alternate" hreflang="{hreflang}" href="{alt_url}"/>')
        
        # Add x-default
        default_url = f'{BASE_URL}/{DEFAULT_LOCALE}/{page}'
        xml_lines.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{default_url}"/>')
        
        xml_lines.append('  </url>')
        xml_lines.append('')
    
    xml_lines.append('</urlset>')
    
    return '\n'.join(xml_lines)

def generate_sitemap_index(locales):
    """Generate sitemap index XML."""
    
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ''
    ]
    
    for locale in locales:
        xml_lines.append('  <sitemap>')
        xml_lines.append(f'    <loc>{BASE_URL}/sitemap-{locale}.xml</loc>')
        xml_lines.append(f'    <lastmod>{TODAY}</lastmod>')
        xml_lines.append('  </sitemap>')
        xml_lines.append('')
    
    xml_lines.append('</sitemapindex>')
    
    return '\n'.join(xml_lines)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_root = os.path.join(os.path.dirname(script_dir), 'web')
    
    print("Generating locale-specific sitemaps...")
    print(f"Base URL: {BASE_URL}")
    print()
    
    for locale in LOCALES:
        locale_folder = os.path.join(web_root, locale)
        if not os.path.exists(locale_folder):
            print(f"  Skipping {locale} (folder not found)")
            continue
        
        pages = get_all_pages(web_root, locale)
        sitemap_content = generate_locale_sitemap(web_root, locale, pages)
        
        sitemap_path = os.path.join(web_root, f'sitemap-{locale}.xml')
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap_content)
        
        print(f"  ✓ sitemap-{locale}.xml ({len(pages)} URLs)")
    
    print()
    print("Generating sitemap index...")
    
    index_content = generate_sitemap_index(LOCALES)
    index_path = os.path.join(web_root, 'sitemap.xml')
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    print(f"  ✓ sitemap.xml (index with {len(LOCALES)} sitemaps)")
    print()
    print("Done!")

if __name__ == '__main__':
    main()
