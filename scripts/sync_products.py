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
    
    # Specs HTML - Grid format
    specs_items = []
    if width:
        specs_items.append(f'''<div class="spec-item">
                <div class="spec-label">{labels["width"]}</div>
                <div class="spec-value">{width} mm</div>
              </div>''')
    if volume:
        specs_items.append(f'''<div class="spec-item">
                <div class="spec-label">{labels["volume"]}</div>
                <div class="spec-value">{volume} L</div>
              </div>''')
    if weight:
        specs_items.append(f'''<div class="spec-item">
                <div class="spec-label">{labels["weight"]}</div>
                <div class="spec-value">{weight} kg</div>
              </div>''')
    if attachment:
        specs_items.append(f'''<div class="spec-item">
                <div class="spec-label">{labels["attachment"]}</div>
                <div class="spec-value">{attachment}</div>
              </div>''')
    if excavator_min and excavator_max:
        specs_items.append(f'''<div class="spec-item">
                <div class="spec-label">{labels["excavator"]}</div>
                <div class="spec-value">{excavator_min} - {excavator_max} ton</div>
              </div>''')
    specs_html = '\n              '.join(specs_items)
    
    # Stock status
    stock_class = 'in-stock' if stock > 0 else 'out-of-stock'
    stock_text = labels['stock'] if stock > 0 else labels['out_of_stock']
    
    # Prepare cart data for add-to-quote button
    cart_data = {
        'id': product.get('id', ''),
        'slug': slug,
        'title': title,
        'image': image_url,
        'category': category_title,
        'subcategory': subcategory_title,
        'specs': {}
    }
    if width:
        cart_data['specs']['width'] = f"{width} mm"
    if volume:
        cart_data['specs']['volume'] = f"{volume} L"
    if weight:
        cart_data['specs']['weight'] = f"{weight} kg"
    if attachment:
        cart_data['specs']['attachment'] = attachment
    if excavator_min and excavator_max:
        cart_data['specs']['excavator'] = f"{excavator_min}-{excavator_max}t"
    
    import html as html_module
    cart_data_json = html_module.escape(json.dumps(cart_data, ensure_ascii=False))
    
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
  <link rel="stylesheet" href="{assets_prefix}/css/components/quote-cart.css">
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
    
    <!-- Product Main Section -->
    <section class="section product-section">
      <div class="container">
        <div class="product-layout">
          <div class="product-gallery animate-on-scroll">
            <div class="product-image-main">
              <img src="{image_url}" alt="{title}" id="main-image">
            </div>
            <div class="product-badges">
              <span class="badge badge-quality">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Belgische Kwaliteit
              </span>
              <span class="badge badge-stock {stock_class}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {stock_text}
              </span>
            </div>
          </div>
          <div class="product-info animate-on-scroll">
            <h1 class="product-title">{title.upper()}</h1>
            <p class="product-subtitle">{description}</p>
            
            <div class="product-specs-grid">
              {specs_html}
            </div>
            
            <div class="product-actions">
              <button class="btn-split btn-split-primary" id="add-to-quote" data-product="{cart_data_json}">
                <span class="btn-split-text">{labels['add_to_quote']}</span>
                <span class="btn-split-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </button>
              <button class="btn-split btn-split-outline" id="contact-seller">
                <span class="btn-split-text">Contact opnemen</span>
                <span class="btn-split-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </span>
              </button>
            </div>
            
            <div class="product-trust-signals">
              <div class="trust-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Belgische productie</span>
              </div>
              <div class="trust-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Hardox staal</span>
              </div>
              <div class="trust-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span>Levering mogelijk</span>
              </div>
              <div class="trust-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>2 Jaar garantie op laswerk</span>
              </div>
            </div>
            
            <!-- Documentation Section -->
            <div class="product-documentation">
              <h3 class="documentation-title">Documentatie</h3>
              <div class="documentation-links">
                <a href="#" class="documentation-link" onclick="alert('Technische tekening wordt binnenkort beschikbaar gesteld'); return false;">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>Technische tekening (PDF)</span>
                </a>
                <a href="#" class="documentation-link" onclick="alert('Productbrochure wordt binnenkort beschikbaar gesteld'); return false;">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  <span>Productbrochure (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Product Details Section -->
    <section class="section product-details-section fade-in">
      <div class="container">
        <div class="product-details-layout">
          <div class="product-detail-card">
            <div class="detail-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            </div>
            <h3>Technische Specificaties</h3>
            <p>Alle kraanbakken worden vervaardigd uit hoogwaardig Hardox staal voor maximale sterkte en duurzaamheid. Perfect afgestemd op uw graafmachine.</p>
          </div>
          <div class="product-detail-card">
            <div class="detail-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3>Op Maat Gemaakt</h3>
            <p>Elke kraanbak wordt op maat geproduceerd in onze werkplaats in Beernem, België. Kwaliteit en precisie gegarandeerd.</p>
          </div>
          <div class="product-detail-card">
            <div class="detail-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3>Snelle Levering</h3>
            <p>Afhalen in Beernem of levering op locatie. Neem contact op voor levertijden en mogelijkheden.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Contact Section -->
    <section class="section product-contact-section fade-in">
      <div class="container">
        <div class="contact-card">
          <div class="contact-content">
            <h2>VRAGEN OVER DIT PRODUCT?</h2>
            <p>Ons verkoopteam staat klaar om u te helpen met al uw vragen over kraanbakken, specificaties en levertijden.</p>
            <div class="contact-info">
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <div>
                  <strong>Telefoon</strong>
                  <a href="tel:+3250123456">+32 50 12 34 56</a>
                </div>
              </div>
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <div>
                  <strong>Email</strong>
                  <a href="mailto:info@structon.be">info@structon.be</a>
                </div>
              </div>
              <div class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <div>
                  <strong>Adres</strong>
                  <span>Beernem, België</span>
                </div>
              </div>
            </div>
          </div>
          <div class="contact-actions">
            <a href="/Structon/contact/" class="btn-split btn-split-primary">
              <span class="btn-split-text">Contacteer ons</span>
              <span class="btn-split-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </a>
            <a href="/Structon/offerte-aanvragen/" class="btn-split btn-split-outline">
              <span class="btn-split-text">Offerte aanvragen</span>
              <span class="btn-split-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Sticky Mobile CTA -->
    <div class="product-sticky-cta">
      <button class="btn-split btn-split-primary" id="add-to-quote-sticky" data-product="{cart_data_json}">
        <span class="btn-split-text">{labels['add_to_quote']}</span>
        <span class="btn-split-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </span>
      </button>
    </div>
  </main>
  <div id="footer-placeholder"></div>
  <script src="{assets_prefix}/js/components/header-loader.js"></script>
  <script src="{assets_prefix}/js/components/footer-loader.js"></script>
  <script type="module" src="{assets_prefix}/js/main.js?v=2"></script>
  <script src="{assets_prefix}/js/components/login-modal.js?v=2"></script>
  <script src="{assets_prefix}/js/services/quote-cart-service.js"></script>
  <script src="{assets_prefix}/js/components/quote-cart-ui.js"></script>
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
