#!/usr/bin/env python3
"""
Structon Product Sync Script
Fetches all products from CMS API and generates static product detail pages.

Usage:
    python scripts/sync_products.py

This script can be run manually or via GitHub Actions on every push.
"""

import os
import json
import urllib.request
from pathlib import Path
from datetime import date

# Configuration
API_BASE = 'https://structon-production.up.railway.app/api'
WEB_ROOT = Path(__file__).parent.parent / 'web'
LOCALES = ['be-nl', 'nl-nl', 'be-fr', 'de-de']
BASE_URL = 'https://structon.be'
TODAY = date.today().isoformat()

# Locale-specific labels
LABELS = {
    'be-nl': {'home': 'Home', 'products': 'Producten', 'add_to_quote': 'Toevoegen aan offerte', 'specs': 'Specificaties', 'description': 'Beschrijving', 'stock': 'Op voorraad', 'out_of_stock': 'Niet op voorraad', 'width': 'Breedte', 'volume': 'Inhoud', 'weight': 'Gewicht', 'attachment': 'Ophanging', 'excavator': 'Graafmachine', 'meta_suffix': '| Structon'},
    'nl-nl': {'home': 'Home', 'products': 'Producten', 'add_to_quote': 'Toevoegen aan offerte', 'specs': 'Specificaties', 'description': 'Beschrijving', 'stock': 'Op voorraad', 'out_of_stock': 'Niet op voorraad', 'width': 'Breedte', 'volume': 'Inhoud', 'weight': 'Gewicht', 'attachment': 'Ophanging', 'excavator': 'Graafmachine', 'meta_suffix': '| Structon'},
    'be-fr': {'home': 'Accueil', 'products': 'Produits', 'add_to_quote': 'Ajouter au devis', 'specs': 'Spécifications', 'description': 'Description', 'stock': 'En stock', 'out_of_stock': 'Rupture de stock', 'width': 'Largeur', 'volume': 'Contenu', 'weight': 'Poids', 'attachment': 'Fixation', 'excavator': 'Excavatrice', 'meta_suffix': '| Structon'},
    'de-de': {'home': 'Startseite', 'products': 'Produkte', 'add_to_quote': 'Zum Angebot hinzufügen', 'specs': 'Spezifikationen', 'description': 'Beschreibung', 'stock': 'Auf Lager', 'out_of_stock': 'Nicht auf Lager', 'width': 'Breite', 'volume': 'Inhalt', 'weight': 'Gewicht', 'attachment': 'Aufhängung', 'excavator': 'Bagger', 'meta_suffix': '| Structon'}
}


def fetch_all_products():
    """Fetch all products from CMS API."""
    products = []
    offset = 0
    limit = 100
    
    while True:
        url = f"{API_BASE}/products?limit={limit}&offset={offset}"
        print(f"  Fetching: {url}")
        
        try:
            with urllib.request.urlopen(url, timeout=30) as response:
                data = json.loads(response.read().decode())
                batch = data.get('products', [])
                
                if not batch:
                    break
                    
                products.extend(batch)
                offset += limit
                
                if len(batch) < limit:
                    break
        except Exception as e:
            print(f"  ❌ Error fetching products: {e}")
            break
    
    return products


def get_hreflang_tags(locale, path_suffix):
    """Generate hreflang tags."""
    tags = []
    locale_map = {'be-nl': 'nl-BE', 'nl-nl': 'nl-NL', 'be-fr': 'fr-BE', 'de-de': 'de-DE'}
    for loc in LOCALES:
        tags.append(f'  <link rel="alternate" hreflang="{locale_map[loc]}" href="{BASE_URL}/{loc}/{path_suffix}">')
    tags.append(f'  <link rel="alternate" hreflang="x-default" href="{BASE_URL}/be-nl/{path_suffix}">')
    return '\n'.join(tags)


def generate_product_page(product, locale):
    """Generate HTML for a product detail page."""
    labels = LABELS[locale]
    
    title = product.get('title', 'Product')
    slug = product.get('slug', '')
    description = product.get('description', '')
    category_slug = product.get('category_slug', 'producten')
    category_title = product.get('category_title', 'Producten')
    subcategory_slug = product.get('subcategory_slug', '')
    subcategory_title = product.get('subcategory_title', '')
    
    # Image
    images = product.get('cloudinary_images', [])
    image_url = images[0]['url'] if images else ''
    
    # Specs
    width = product.get('width')
    volume = product.get('volume')
    weight = product.get('weight')
    attachment = product.get('attachment_type', '')
    excavator_min = product.get('excavator_weight_min')
    excavator_max = product.get('excavator_weight_max')
    stock = product.get('stock_quantity', 0)
    
    # Build path - product is at deepest level
    if subcategory_slug:
        path_suffix = f'producten/{category_slug}/{subcategory_slug}/{slug}/'
        assets_prefix = '../../../../../assets'
        home_link = '../../../../index.html'
        products_link = '../../../index.html'
        category_link = '../../'
        subcategory_link = '../'
        breadcrumb_html = f'''<a href="{home_link}">{labels['home']}</a><span>/</span>
          <a href="{products_link}">{labels['products']}</a><span>/</span>
          <a href="{category_link}">{category_title}</a><span>/</span>
          <a href="{subcategory_link}">{subcategory_title}</a><span>/</span>
          <span aria-current="page">{title}</span>'''
    else:
        path_suffix = f'producten/{category_slug}/{slug}/'
        assets_prefix = '../../../../assets'
        home_link = '../../../index.html'
        products_link = '../../index.html'
        category_link = '../'
        breadcrumb_html = f'''<a href="{home_link}">{labels['home']}</a><span>/</span>
          <a href="{products_link}">{labels['products']}</a><span>/</span>
          <a href="{category_link}">{category_title}</a><span>/</span>
          <span aria-current="page">{title}</span>'''
    
    hreflang_tags = get_hreflang_tags(locale, path_suffix)
    canonical = f'  <link rel="canonical" href="{BASE_URL}/{locale}/{path_suffix}">'
    
    # Meta description
    meta_desc = product.get('seo_description') or description[:155] or f'{title} - Professionele kraanbak van Structon'
    
    # Specs HTML
    specs_rows = []
    if width:
        specs_rows.append(f'<tr><td>{labels["width"]}</td><td>{width} mm</td></tr>')
    if volume:
        specs_rows.append(f'<tr><td>{labels["volume"]}</td><td>{volume} L</td></tr>')
    if weight:
        specs_rows.append(f'<tr><td>{labels["weight"]}</td><td>{weight} kg</td></tr>')
    if attachment:
        specs_rows.append(f'<tr><td>{labels["attachment"]}</td><td>{attachment}</td></tr>')
    if excavator_min and excavator_max:
        specs_rows.append(f'<tr><td>{labels["excavator"]}</td><td>{excavator_min} - {excavator_max} ton</td></tr>')
    specs_html = '\n              '.join(specs_rows)
    
    # Stock status
    stock_class = 'in-stock' if stock > 0 else 'out-of-stock'
    stock_text = labels['stock'] if stock > 0 else labels['out_of_stock']
    
    return f'''<!DOCTYPE html>
<html lang="{locale.replace('-', '_')}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{meta_desc}">
  <title>{title} {labels['meta_suffix']}</title>
  <link rel="preload" href="{assets_prefix}/css/fonts.css" as="style">
  <link rel="stylesheet" href="{assets_prefix}/css/fonts.css">
  <link rel="stylesheet" href="{assets_prefix}/css/global.css?v=8">
  <link rel="stylesheet" href="{assets_prefix}/css/components/mega-menu.css">
  <link rel="stylesheet" href="{assets_prefix}/css/pages/product.css">
  <link rel="icon" type="image/svg+xml" href="{assets_prefix}/images/static/favicon.svg">
{canonical}
{hreflang_tags}
</head>
<body>
  <div id="header-placeholder"></div>
  <main style="padding-top: 0;">
    <section class="page-hero" style="padding-top: var(--space-8);">
      <div class="container">
        <nav class="breadcrumb" aria-label="Kruimelpad">
          {breadcrumb_html}
        </nav>
      </div>
    </section>
    <section class="section product-section">
      <div class="container">
        <div class="product-layout">
          <div class="product-gallery">
            <div class="product-image-main">
              <img src="{image_url}" alt="{title}" id="main-image">
            </div>
          </div>
          <div class="product-info">
            <h1 class="product-title">{title}</h1>
            <div class="product-stock {stock_class}">{stock_text}</div>
            <div class="product-description">
              <h3>{labels['description']}</h3>
              <p>{description}</p>
            </div>
            <div class="product-specs">
              <h3>{labels['specs']}</h3>
              <table class="specs-table">
              {specs_html}
              </table>
            </div>
            <button class="btn btn-primary btn-split" id="add-to-quote" data-product-id="{product.get('id', '')}">
              <span>{labels['add_to_quote']}</span>
              <span class="btn-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
  <div id="footer-placeholder"></div>
  <script src="{assets_prefix}/js/components/header-loader.js"></script>
  <script src="{assets_prefix}/js/components/footer-loader.js"></script>
  <script type="module" src="{assets_prefix}/js/main.js?v=2"></script>
  <script src="{assets_prefix}/js/components/login-modal.js?v=2"></script>
</body>
</html>'''


def sync_products():
    """Main sync function."""
    print("🔄 Structon Product Sync")
    print("=" * 40)
    
    # Fetch products
    print("\n📥 Fetching products from CMS...")
    products = fetch_all_products()
    print(f"  Found {len(products)} products")
    
    if not products:
        print("  ⚠️ No products found, exiting")
        return
    
    # Generate pages
    pages_created = 0
    for locale in LOCALES:
        print(f"\n📁 Processing locale: {locale}")
        
        for product in products:
            if not product.get('is_active', True):
                continue
                
            slug = product.get('slug')
            category_slug = product.get('category_slug')
            subcategory_slug = product.get('subcategory_slug')
            
            if not slug or not category_slug:
                continue
            
            # Determine path
            if subcategory_slug:
                product_dir = WEB_ROOT / locale / 'producten' / category_slug / subcategory_slug / slug
            else:
                product_dir = WEB_ROOT / locale / 'producten' / category_slug / slug
            
            product_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate HTML
            html = generate_product_page(product, locale)
            (product_dir / 'index.html').write_text(html, encoding='utf-8')
            pages_created += 1
        
        print(f"  ✅ Created {len([p for p in products if p.get('is_active', True)])} product pages")
    
    print(f"\n🎉 Done! Created {pages_created} product pages total")
    return products


def update_sitemaps_with_products(products):
    """Add product URLs to sitemaps."""
    print("\n🗺️ Updating sitemaps with product URLs...")
    
    for locale in LOCALES:
        sitemap_path = WEB_ROOT / f'sitemap-{locale}.xml'
        if not sitemap_path.exists():
            continue
        
        content = sitemap_path.read_text(encoding='utf-8')
        
        # Check if products section already exists
        if '<!-- Product Pages -->' in content:
            # Remove old product section
            start = content.find('<!-- Product Pages -->')
            end = content.find('</urlset>')
            content = content[:start] + '</urlset>'
        
        # Generate product URLs
        product_urls = ['\n  <!-- Product Pages -->']
        locale_map = {'be-nl': 'nl-BE', 'nl-nl': 'nl-NL', 'be-fr': 'fr-BE', 'de-de': 'de-DE'}
        
        for product in products:
            if not product.get('is_active', True):
                continue
            
            slug = product.get('slug')
            category_slug = product.get('category_slug')
            subcategory_slug = product.get('subcategory_slug')
            
            if not slug or not category_slug:
                continue
            
            if subcategory_slug:
                path = f'producten/{category_slug}/{subcategory_slug}/{slug}/'
            else:
                path = f'producten/{category_slug}/{slug}/'
            
            loc = f'{BASE_URL}/{locale}/{path}'
            
            hreflangs = []
            for loc_code in LOCALES:
                alt_url = f"{BASE_URL}/{loc_code}/{path}"
                hreflangs.append(f'    <xhtml:link rel="alternate" hreflang="{locale_map[loc_code]}" href="{alt_url}"/>')
            hreflangs.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{BASE_URL}/be-nl/{path}"/>')
            
            product_urls.append(f'''  <url>
    <loc>{loc}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
{chr(10).join(hreflangs)}
  </url>''')
        
        # Insert before </urlset>
        new_content = content.replace('</urlset>', '\n'.join(product_urls) + '\n</urlset>')
        sitemap_path.write_text(new_content, encoding='utf-8')
        print(f"  ✅ Updated sitemap-{locale}.xml")


if __name__ == '__main__':
    products = sync_products()
    if products:
        update_sitemaps_with_products(products)
