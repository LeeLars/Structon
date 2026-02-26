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
    'be-nl': {'home': 'Home', 'products': 'Producten', 'add_to_quote': 'Toevoegen aan offerte', 'specs': 'Specificaties', 'description': 'Beschrijving', 'stock': 'Op voorraad', 'out_of_stock': 'Niet op voorraad', 'width': 'Breedte', 'volume': 'Inhoud', 'weight': 'Gewicht', 'attachment': 'Ophanging', 'excavator': 'Graafmachine', 'meta_suffix': '| Structon', 'highlights_title': 'Zekerheid', 'highlight_hardox': 'Hardox staal', 'highlight_delivery': 'Levering mogelijk', 'highlight_warranty': '2 jaar garantie op laswerk', 'highlight_made_in': 'Belgische productie', 'documentation': 'Documentatie', 'doc_drawing': 'Technische tekening (PDF)', 'doc_brochure': 'Productbrochure (PDF)'},
    'nl-nl': {'home': 'Home', 'products': 'Producten', 'add_to_quote': 'Toevoegen aan offerte', 'specs': 'Specificaties', 'description': 'Beschrijving', 'stock': 'Op voorraad', 'out_of_stock': 'Niet op voorraad', 'width': 'Breedte', 'volume': 'Inhoud', 'weight': 'Gewicht', 'attachment': 'Ophanging', 'excavator': 'Graafmachine', 'meta_suffix': '| Structon', 'highlights_title': 'Zekerheid', 'highlight_hardox': 'Hardox staal', 'highlight_delivery': 'Levering mogelijk', 'highlight_warranty': '2 jaar garantie op laswerk', 'highlight_made_in': 'Belgische productie', 'documentation': 'Documentatie', 'doc_drawing': 'Technische tekening (PDF)', 'doc_brochure': 'Productbrochure (PDF)'},
    'be-fr': {'home': 'Accueil', 'products': 'Produits', 'add_to_quote': 'Ajouter au devis', 'specs': 'Spécifications', 'description': 'Description', 'stock': 'En stock', 'out_of_stock': 'Rupture de stock', 'width': 'Largeur', 'volume': 'Contenu', 'weight': 'Poids', 'attachment': 'Fixation', 'excavator': 'Excavatrice', 'meta_suffix': '| Structon', 'highlights_title': 'Garanties', 'highlight_hardox': 'Acier Hardox', 'highlight_delivery': 'Livraison possible', 'highlight_warranty': '2 ans de garantie sur les soudures', 'highlight_made_in': 'Fabrication belge', 'documentation': 'Documentation', 'doc_drawing': 'Dessin technique (PDF)', 'doc_brochure': 'Brochure produit (PDF)'},
    'de-de': {'home': 'Startseite', 'products': 'Produkte', 'add_to_quote': 'Zum Angebot hinzufügen', 'specs': 'Spezifikationen', 'description': 'Beschreibung', 'stock': 'Auf Lager', 'out_of_stock': 'Nicht auf Lager', 'width': 'Breite', 'volume': 'Inhalt', 'weight': 'Gewicht', 'attachment': 'Aufhängung', 'excavator': 'Bagger', 'meta_suffix': '| Structon', 'highlights_title': 'Sicherheit', 'highlight_hardox': 'Hardox-Stahl', 'highlight_delivery': 'Lieferung möglich', 'highlight_warranty': '2 Jahre Garantie auf Schweißnähte', 'highlight_made_in': 'Belgische Fertigung', 'documentation': 'Dokumentation', 'doc_drawing': 'Technische Zeichnung (PDF)', 'doc_brochure': 'Produktbroschüre (PDF)'}
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



def generate_key_specs_html(product, labels):
    html = ""
    
    specs = [
        ('width', product.get('width'), labels.get('width', 'Breedte'), 'mm'),
        ('weight', product.get('weight'), labels.get('weight', 'Gewicht'), 'kg'),
        ('attachment_type', product.get('attachment_type'), labels.get('attachment', 'Ophanging'), ''),
        ('excavator_weight_range', f"{product.get('excavator_weight_min')}-{product.get('excavator_weight_max')}", labels.get('excavator', 'Klasse'), 't') if product.get('excavator_weight_min') else None
    ]
    
    for key, value, label, unit in specs:
        if value:
            display_value = f"{value} {unit}".strip()
            html += f'''
              <div class="key-spec">
                <span class="key-spec-label">{label}</span>
                <span class="key-spec-value">{display_value}</span>
              </div>'''
    
    return html


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
    
    # Build specifications table rows
    specs_table_rows = []
    if width:
        specs_table_rows.append(f'''<tr>
                  <th>{labels["width"]}</th>
                  <td>{width} mm</td>
                </tr>''')
    if volume:
        specs_table_rows.append(f'''<tr>
                  <th>{labels["volume"]}</th>
                  <td>{volume} L</td>
                </tr>''')
    if weight:
        specs_table_rows.append(f'''<tr>
                  <th>{labels["weight"]}</th>
                  <td>{weight} kg</td>
                </tr>''')
    if attachment:
        specs_table_rows.append(f'''<tr>
                  <th>{labels["attachment"]}</th>
                  <td>{attachment}</td>
                </tr>''')
    if excavator_min and excavator_max:
        specs_table_rows.append(f'''<tr>
                  <th>Graafmachine klasse</th>
                  <td>{excavator_min} - {excavator_max} ton</td>
                </tr>''')
    
    # Add standard rows
    specs_table_rows.append('''<tr>
                  <th>Materiaal</th>
                  <td>Hardox 450 staal</td>
                </tr>''')
    specs_table_rows.append('''<tr>
                  <th>Productie</th>
                  <td>Op maat gemaakt in België</td>
                </tr>''')
    specs_table_rows.append('''<tr>
                  <th>Levertijd</th>
                  <td>2-3 weken</td>
                </tr>''')
    specs_table_rows.append('''<tr>
                  <th>Garantie</th>
                  <td>12 maanden fabrieksgarantie</td>
                </tr>''')
    
    specs_table_html = '\n                '.join(specs_table_rows)
    
    # Stock status
    stock_class = 'in-stock' if stock > 0 else 'out-of-stock'
    stock_text = labels['stock'] if stock > 0 else labels['out_of_stock']
    
    # Prepare cart data for add-to-quote button
    # Prepare cart data for add-to-quote button
    cart_data = {
        'id': product.get('id', ''),
        'slug': slug,
        'category_slug': category_slug,
        'subcategory_slug': subcategory_slug,
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
    

    # Prepare data for new template structure
    key_specs_html = generate_key_specs_html(product, labels)
    
    import json
    cart_data_json_attr = json.dumps(cart_data).replace('"', '&quot;')
    
    # Gallery
    gallery_section = f'''
          <div class="product-gallery animate-on-scroll">
            <div class="product-thumbnails">
              <div class="product-thumbnail active" data-image="{image_url}">
                <img src="{image_url}" alt="{title} - View 1">
              </div>
              <div class="product-thumbnail" data-image="{image_url}">
                <img src="{image_url}" alt="{title} - View 2">
              </div>
              <div class="product-thumbnail" data-image="{image_url}">
                <img src="{image_url}" alt="{title} - View 3">
              </div>
            </div>
            <div class="product-image-main">
              <img src="{image_url}" alt="{title}" id="main-product-image">
            </div>
          </div>'''

    # Info Column
    info_section = f'''
          <div class="product-info-wrapper animate-on-scroll">
            <div class="product-header">
              <span class="product-category-label">{category_title} / {subcategory_title}</span>
              <h1 class="product-title">{title.upper()}</h1>
              <p class="product-subtitle">{description}</p>
            </div>

            <div class="product-key-specs">
              {key_specs_html}
            </div>

            <div class="product-purchase-card">
              <div class="product-price-container" id="product-price-container" data-product-id="{cart_data['id']}" style="display: none;">
                <div class="product-price-label">Prijs:</div>
                <div class="product-price" id="product-price">
                  <span class="price-loading">Prijs laden...</span>
                </div>
                <div class="stock-status {stock_class}">{stock_text}</div>
              </div>
              
              <div class="product-cta-section">
                <div class="product-quantity-wrapper">
                  <div class="quantity-selector">
                    <button type="button" class="quantity-btn minus" onclick="var i=this.nextElementSibling;i.value=Math.max(1,parseInt(i.value||1)-1)">-</button>
                    <input type="number" id="quantity" name="quantity" value="1" min="1" max="99">
                    <button type="button" class="quantity-btn plus" onclick="var i=this.previousElementSibling;i.value=Math.min(99,parseInt(i.value||1)+1)">+</button>
                  </div>
                  
                  <div class="product-actions">
                    <button class="btn-split btn-split-primary" id="add-to-quote" data-product='{cart_data_json_attr}'>
                      <span class="btn-split-text">{labels['add_to_quote']}</span>
                      <span class="btn-split-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </span>
                    </button>
                  </div>
                </div>
                
                <ul class="product-usps">
                  <li>Voor 15:00 besteld, morgen verzonden</li>
                  <li>Gratis verzending vanaf €500</li>
                  <li>Geproduceerd in België (Hardox staal)</li>
                </ul>
              </div>
            </div>

            <div class="expert-box-sidebar">
              <div class="expert-header">
                <div class="expert-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <span class="expert-title">Hulp nodig bij uw keuze?</span>
                  <span class="expert-subtitle">Onze experts helpen u graag verder.</span>
                </div>
              </div>
              <a href="tel:+32469702138" class="expert-contact">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                +32 469 70 21 38
              </a>
            </div>
          </div>'''
    
    # Extra Sections
    details_section = '''
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
    </section>'''

    specs_section = f'''
    <section class="section specifications-section">
      <div class="container">
        <div class="specifications-content">
          <div class="specifications-description">
            <h2 class="specifications-title">PRODUCTBESCHRIJVING</h2>
            <p>Deze hoogwaardige kraanbak is speciaal ontworpen voor professionele graafwerkzaamheden. De robuuste constructie en doordachte vorm maken deze bak ideaal voor diverse toepassingen in de grond-, weg- en waterbouw.</p>
            <p>Vervaardigd uit slijtvast Hardox staal voor maximale duurzaamheid en een lange levensduur, zelfs onder zware werkomstandigheden. De geoptimaliseerde geometrie zorgt voor uitstekende prestaties in verschillende grondsoorten.</p>
          </div>
          
          <div class="specifications-table-wrapper">
            <h3 class="specifications-subtitle">Technische Specificaties</h3>
            <table class="specifications-table">
              <tbody>
                {specs_table_html}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>'''

    sticky_cta = f'''
    <div class="product-sticky-cta">
      <button class="btn-split btn-split-primary" id="add-to-quote-sticky" data-product='{cart_data_json_attr}'>
        <span class="btn-split-text">{labels['add_to_quote']}</span>
        <span class="btn-split-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </span>
      </button>
    </div>'''


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
        <h1 class="hero-title">{title.upper()}</h1>
      </div>
    </section>
    
    <!-- Product Main Section -->
    <section class="section product-section">
      <div class="container">
        <div class="product-layout">
          {gallery_section}
          {info_section}
        </div>
      </div>
    </section>
    
    {details_section}
    {specs_section}
    {sticky_cta}
    
  </main>
  <div id="footer-placeholder"></div>
  <script src="{assets_prefix}/js/components/header-loader.js"></script>
  <script src="{assets_prefix}/js/components/footer-loader.js"></script>
  <script type="module" src="{assets_prefix}/js/main.js?v=2"></script>
  <script src="{assets_prefix}/js/components/login-modal.js?v=2"></script>
  <script src="{assets_prefix}/js/services/quote-cart-service.js"></script>
  <script src="{assets_prefix}/js/components/quote-cart-ui.js"></script>
  <script src="{assets_prefix}/js/components/product-price.js"></script>
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
