#!/usr/bin/env python3
"""
Update Structon sitemaps with new clean category/subcategory URLs.
"""

from pathlib import Path
from datetime import date
from catalog_data import CATEGORIES, SUBCATEGORIES

WEB_ROOT = Path(__file__).parent.parent / 'web'
BASE_URL = 'https://structon.be'
LOCALES = ['be-nl', 'nl-nl', 'be-fr', 'de-de']
TODAY = date.today().isoformat()

def generate_url_entry(loc, locale, path, priority='0.8', changefreq='weekly'):
    """Generate a single URL entry with hreflang tags."""
    hreflangs = []
    locale_map = {'be-nl': 'nl-BE', 'nl-nl': 'nl-NL', 'be-fr': 'fr-BE', 'de-de': 'de-DE'}
    
    for loc_code in LOCALES:
        alt_url = f"{BASE_URL}/{loc_code}/{path}"
        hreflangs.append(f'    <xhtml:link rel="alternate" hreflang="{locale_map[loc_code]}" href="{alt_url}"/>')
    hreflangs.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{BASE_URL}/be-nl/{path}"/>')
    
    return f'''  <url>
    <loc>{loc}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
{chr(10).join(hreflangs)}
  </url>
'''

def get_new_catalog_urls(locale):
    """Generate URL entries for all category and subcategory pages."""
    entries = []
    
    # Category pages
    for cat_slug in CATEGORIES:
        path = f'producten/{cat_slug}/'
        loc = f'{BASE_URL}/{locale}/{path}'
        entries.append(generate_url_entry(loc, locale, path, priority='0.9', changefreq='weekly'))
        
        # Subcategory pages
        for subcat_slug in CATEGORIES[cat_slug].get('subcategories', []):
            subpath = f'producten/{cat_slug}/{subcat_slug}/'
            subloc = f'{BASE_URL}/{locale}/{subpath}'
            entries.append(generate_url_entry(subloc, locale, subpath, priority='0.8', changefreq='weekly'))
    
    return entries

def update_sitemap(locale):
    """Update a locale-specific sitemap with new catalog URLs."""
    sitemap_path = WEB_ROOT / f'sitemap-{locale}.xml'
    
    if not sitemap_path.exists():
        print(f"  ⚠️ Sitemap not found: {sitemap_path}")
        return
    
    content = sitemap_path.read_text(encoding='utf-8')
    
    # Check if catalog URLs already exist
    if f'producten/graafbakken/' in content:
        print(f"  ℹ️ Catalog URLs already in sitemap-{locale}.xml")
        return
    
    # Find the closing </urlset> tag and insert new URLs before it
    new_urls = get_new_catalog_urls(locale)
    new_content = '\n  <!-- Category & Subcategory Pages (Clean URLs) -->\n'
    new_content += '\n'.join(new_urls)
    
    # Insert before </urlset>
    updated = content.replace('</urlset>', new_content + '\n</urlset>')
    
    sitemap_path.write_text(updated, encoding='utf-8')
    print(f"  ✅ Updated sitemap-{locale}.xml with {len(new_urls)} new URLs")

def main():
    print("🗺️ Updating Structon Sitemaps")
    print("=" * 40)
    
    for locale in LOCALES:
        print(f"\n📁 Processing: sitemap-{locale}.xml")
        update_sitemap(locale)
    
    print("\n🎉 Done!")

if __name__ == '__main__':
    main()
