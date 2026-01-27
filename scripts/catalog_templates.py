"""
HTML Templates for Structon Catalog Pages
"""

BASE_URL = 'https://leelars.github.io/Structon'
LOCALES = ['be-nl', 'nl-nl', 'be-fr', 'de-de']

def get_hreflang_tags(locale, path_suffix):
    tags = []
    locale_map = {'be-nl': 'nl-BE', 'nl-nl': 'nl-NL', 'be-fr': 'fr-BE', 'de-de': 'de-DE'}
    for loc in LOCALES:
        tags.append(f'  <link rel="alternate" hreflang="{locale_map[loc]}" href="{BASE_URL}/{loc}/{path_suffix}">')
    tags.append(f'  <link rel="alternate" hreflang="x-default" href="{BASE_URL}/be-nl/{path_suffix}">')
    return '\n'.join(tags)

def get_category_html(category_slug, locale, CATEGORIES, SUBCATEGORIES, LABELS, BASE_URL, LOCALES):
    category = CATEGORIES[category_slug]
    labels = LABELS[locale]
    title = category['title_translations'].get(locale, category['title'])
    description = category['description_translations'].get(locale, category['description'])
    assets_prefix = '../../../assets'
    home_link = '../../index.html'
    products_link = '../index.html'
    path_suffix = f'producten/{category_slug}/'
    hreflang_tags = get_hreflang_tags(locale, path_suffix)
    canonical = f'  <link rel="canonical" href="{BASE_URL}/{locale}/{path_suffix}">'
    
    # Build subcategory cards
    subcat_cards = []
    for subcat_slug in category.get('subcategories', []):
        subcat = SUBCATEGORIES.get(subcat_slug, {})
        subcat_title = subcat.get('title_translations', {}).get(locale, subcat.get('title', subcat_slug))
        subcat_cards.append(f'''<a href="{subcat_slug}/" class="subcategory-card">
              <div class="subcategory-image"><img src="{assets_prefix}/images/categories/{subcat_slug}.jpg" alt="{subcat_title}" onerror="this.src='{assets_prefix}/images/placeholder.jpg'"></div>
              <div class="subcategory-overlay"></div>
              <div class="subcategory-content"><h3>{subcat_title}</h3></div>
            </a>''')
    subcategories_html = '\n            '.join(subcat_cards)
    
    return f'''<!DOCTYPE html>
<html lang="{locale.replace('-', '_')}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{description[:155]}">
  <title>{title} {labels['meta_suffix']}</title>
  <link rel="preload" href="{assets_prefix}/css/fonts.css" as="style">
  <link rel="stylesheet" href="{assets_prefix}/css/fonts.css">
  <link rel="stylesheet" href="{assets_prefix}/css/global.css?v=8">
  <link rel="stylesheet" href="{assets_prefix}/css/components/mega-menu.css">
  <link rel="stylesheet" href="{assets_prefix}/css/pages/category.css">
  <link rel="stylesheet" href="{assets_prefix}/css/pages/products.css">
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
          <a href="{home_link}">{labels['home']}</a><span>/</span>
          <a href="{products_link}">{labels['products']}</a><span>/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <div class="page-hero-content">
          <div class="page-hero-text">
            <h1 class="page-title">{title.upper()}</h1>
            <p class="page-subtitle">{description}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section category-section">
      <div class="container">
        <div class="category-layout">
          <aside class="filters-sidebar" id="filters-sidebar">
            <div class="filters-header">
              <h3 class="filters-title">{labels['filters']}</h3>
              <button class="btn-text" id="clear-filters">{labels['clear']}</button>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['brand']}</h4>
              <div id="brand-filters-loading" class="filter-loading"><div class="spinner-small"></div><span>{labels['loading_brands']}</span></div>
              <div id="brand-filters-container" style="display: none;"></div>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['volume']}</h4>
              <div class="range-slider">
                <input type="range" id="volume-min" min="0" max="5000" value="0" step="100">
                <input type="range" id="volume-max" min="0" max="5000" value="5000" step="100">
                <div class="range-values"><span id="volume-min-value">0L</span><span id="volume-max-value">5000L</span></div>
              </div>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['excavator_class']}</h4>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="1500"><span>1,5 - 3 ton</span></label>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="4000"><span>3 - 8 ton</span></label>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="12000"><span>8 - 15 ton</span></label>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="20000"><span>15 - 25 ton</span></label>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="30000"><span>25 - 50 ton</span></label>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['width']}</h4>
              <label class="checkbox-label"><input type="checkbox" name="width" value="300"><span>300mm</span></label>
              <label class="checkbox-label"><input type="checkbox" name="width" value="600"><span>600mm</span></label>
              <label class="checkbox-label"><input type="checkbox" name="width" value="800"><span>800mm</span></label>
              <label class="checkbox-label"><input type="checkbox" name="width" value="1200"><span>1200mm</span></label>
              <label class="checkbox-label"><input type="checkbox" name="width" value="1500"><span>1500mm</span></label>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['attachment']}</h4>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW05"><span>CW05</span></label>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW10"><span>CW10</span></label>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW20"><span>CW20</span></label>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW30"><span>CW30</span></label>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW40"><span>CW40</span></label>
            </div>
            <button class="btn btn-primary btn-full" id="apply-filters" style="display: none;">{labels['apply_filters']}</button>
          </aside>
          <div class="category-content">
            <div id="category-header" class="category-header" style="display: block;">
              <h2 class="category-header-title" id="category-header-title">{title.upper()}</h2>
              <p class="category-header-description" id="category-header-description">{description}</p>
            </div>
            <div id="subcategories-section" style="display: block; margin-bottom: 40px;">
              <h2 class="subcategories-title">{labels['subcategories']}</h2>
              <div class="subcategories-grid" id="subcategories-grid">
            {subcategories_html}
              </div>
            </div>
            <div class="products-toolbar">
              <div class="toolbar-left">
                <button class="btn-filter-toggle" id="toggle-filters">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
                  {labels['filters']}
                </button>
                <span class="products-count-text"><strong id="products-count">0</strong> {labels['products_found']}</span>
              </div>
              <div class="toolbar-right">
                <label for="sort-select" class="sort-label">{labels['sort']}</label>
                <select id="sort-select" class="sort-select">
                  <option value="newest">{labels['newest']}</option>
                  <option value="oldest">{labels['oldest']}</option>
                  <option value="title_asc">{labels['name_az']}</option>
                  <option value="title_desc">{labels['name_za']}</option>
                </select>
              </div>
            </div>
            <div class="products-list" id="products-grid"><div class="loading"><div class="spinner"></div><p>{labels['loading']}</p></div></div>
            <div class="pagination" id="pagination" style="display: none;">
              <button class="pagination-btn" id="prev-page" disabled>{labels['prev']}</button>
              <span class="pagination-info" id="pagination-info">Pagina 1 van 1</span>
              <button class="pagination-btn" id="next-page" disabled>{labels['next']}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <div id="footer-placeholder"></div>
  <script src="{assets_prefix}/js/components/header-loader.js"></script>
  <script src="{assets_prefix}/js/components/footer-loader.js"></script>
  <script type="module" src="{assets_prefix}/js/main.js?v=2"></script>
  <script type="module" src="{assets_prefix}/js/pages/all-products.js?v=3"></script>
  <script src="{assets_prefix}/js/components/login-modal.js?v=2"></script>
  <script src="{assets_prefix}/js/client-filters.js"></script>
  <script>
    (function() {{
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const productenIndex = pathParts.indexOf('producten');
      if (productenIndex !== -1 && pathParts[productenIndex + 1]) {{
        const category = pathParts[productenIndex + 1];
        if (!window.location.search.includes('cat=')) {{
          window.history.replaceState(null, '', window.location.pathname + '?cat=' + category);
        }}
      }}
    }})();
  </script>
</body>
</html>'''


def get_subcategory_html(subcategory_slug, locale, CATEGORIES, SUBCATEGORIES, LABELS, BASE_URL, LOCALES):
    subcategory = SUBCATEGORIES[subcategory_slug]
    parent_slug = subcategory['parent_category']
    parent = CATEGORIES[parent_slug]
    labels = LABELS[locale]
    title = subcategory['title_translations'].get(locale, subcategory['title'])
    description = subcategory['description_translations'].get(locale, subcategory['description'])
    parent_title = parent['title_translations'].get(locale, parent['title'])
    assets_prefix = '../../../../assets'
    home_link = '../../../index.html'
    products_link = '../../index.html'
    category_link = '../'
    path_suffix = f'producten/{parent_slug}/{subcategory_slug}/'
    hreflang_tags = get_hreflang_tags(locale, path_suffix)
    canonical = f'  <link rel="canonical" href="{BASE_URL}/{locale}/{path_suffix}">'
    
    return f'''<!DOCTYPE html>
<html lang="{locale.replace('-', '_')}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{description[:155]}">
  <title>{title} {labels['meta_suffix']}</title>
  <link rel="preload" href="{assets_prefix}/css/fonts.css" as="style">
  <link rel="stylesheet" href="{assets_prefix}/css/fonts.css">
  <link rel="stylesheet" href="{assets_prefix}/css/global.css?v=8">
  <link rel="stylesheet" href="{assets_prefix}/css/components/mega-menu.css">
  <link rel="stylesheet" href="{assets_prefix}/css/pages/category.css">
  <link rel="stylesheet" href="{assets_prefix}/css/pages/products.css">
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
          <a href="{home_link}">{labels['home']}</a><span>/</span>
          <a href="{products_link}">{labels['products']}</a><span>/</span>
          <a href="{category_link}">{parent_title}</a><span>/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <div class="page-hero-content">
          <div class="page-hero-text">
            <h1 class="page-title">{title.upper()}</h1>
            <p class="page-subtitle">{description}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section category-section">
      <div class="container">
        <div class="category-layout">
          <aside class="filters-sidebar" id="filters-sidebar">
            <div class="filters-header">
              <h3 class="filters-title">{labels['filters']}</h3>
              <button class="btn-text" id="clear-filters">{labels['clear']}</button>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['brand']}</h4>
              <div id="brand-filters-loading" class="filter-loading"><div class="spinner-small"></div><span>{labels['loading_brands']}</span></div>
              <div id="brand-filters-container" style="display: none;"></div>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['volume']}</h4>
              <div class="range-slider">
                <input type="range" id="volume-min" min="0" max="5000" value="0" step="100">
                <input type="range" id="volume-max" min="0" max="5000" value="5000" step="100">
                <div class="range-values"><span id="volume-min-value">0L</span><span id="volume-max-value">5000L</span></div>
              </div>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['excavator_class']}</h4>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="1500"><span>1,5 - 3 ton</span></label>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="4000"><span>3 - 8 ton</span></label>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="12000"><span>8 - 15 ton</span></label>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="20000"><span>15 - 25 ton</span></label>
              <label class="checkbox-label"><input type="checkbox" name="excavator" value="30000"><span>25 - 50 ton</span></label>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['width']}</h4>
              <label class="checkbox-label"><input type="checkbox" name="width" value="300"><span>300mm</span></label>
              <label class="checkbox-label"><input type="checkbox" name="width" value="600"><span>600mm</span></label>
              <label class="checkbox-label"><input type="checkbox" name="width" value="800"><span>800mm</span></label>
              <label class="checkbox-label"><input type="checkbox" name="width" value="1200"><span>1200mm</span></label>
              <label class="checkbox-label"><input type="checkbox" name="width" value="1500"><span>1500mm</span></label>
            </div>
            <div class="filter-group">
              <h4 class="filter-group-title">{labels['attachment']}</h4>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW05"><span>CW05</span></label>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW10"><span>CW10</span></label>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW20"><span>CW20</span></label>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW30"><span>CW30</span></label>
              <label class="checkbox-label"><input type="checkbox" name="attachment" value="CW40"><span>CW40</span></label>
            </div>
            <button class="btn btn-primary btn-full" id="apply-filters" style="display: none;">{labels['apply_filters']}</button>
          </aside>
          <div class="category-content">
            <div id="category-header" class="category-header" style="display: none;"></div>
            <div id="subcategories-section" style="display: none;"></div>
            <div class="products-toolbar">
              <div class="toolbar-left">
                <button class="btn-filter-toggle" id="toggle-filters">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
                  {labels['filters']}
                </button>
                <span class="products-count-text"><strong id="products-count">0</strong> {labels['products_found']}</span>
              </div>
              <div class="toolbar-right">
                <label for="sort-select" class="sort-label">{labels['sort']}</label>
                <select id="sort-select" class="sort-select">
                  <option value="newest">{labels['newest']}</option>
                  <option value="oldest">{labels['oldest']}</option>
                  <option value="title_asc">{labels['name_az']}</option>
                  <option value="title_desc">{labels['name_za']}</option>
                </select>
              </div>
            </div>
            <div class="products-list" id="products-grid"><div class="loading"><div class="spinner"></div><p>{labels['loading']}</p></div></div>
            <div class="pagination" id="pagination" style="display: none;">
              <button class="pagination-btn" id="prev-page" disabled>{labels['prev']}</button>
              <span class="pagination-info" id="pagination-info">Pagina 1 van 1</span>
              <button class="pagination-btn" id="next-page" disabled>{labels['next']}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <div id="footer-placeholder"></div>
  <script src="{assets_prefix}/js/components/header-loader.js"></script>
  <script src="{assets_prefix}/js/components/footer-loader.js"></script>
  <script type="module" src="{assets_prefix}/js/main.js?v=2"></script>
  <script type="module" src="{assets_prefix}/js/pages/all-products.js?v=3"></script>
  <script src="{assets_prefix}/js/components/login-modal.js?v=2"></script>
  <script src="{assets_prefix}/js/client-filters.js"></script>
  <script>
    (function() {{
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const productenIndex = pathParts.indexOf('producten');
      if (productenIndex !== -1 && pathParts[productenIndex + 2]) {{
        const subcategory = pathParts[productenIndex + 2];
        if (!window.location.search.includes('cat=')) {{
          window.history.replaceState(null, '', window.location.pathname + '?cat=' + subcategory);
        }}
      }}
    }})();
  </script>
</body>
</html>'''
