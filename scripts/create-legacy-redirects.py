#!/usr/bin/env python3
"""
Create redirect pages for legacy URLs (outside locale folders).
These redirect to the appropriate locale version based on user preference.
"""

import os

# Configuration
DEFAULT_LOCALE = 'be-nl'

REDIRECT_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <title>Redirecting...</title>
  <script>
    (function() {{
      var locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de'];
      var defaultLocale = '{default_locale}';
      var targetPage = '{page_path}';
      
      function getStoredLocale() {{
        try {{
          var stored = localStorage.getItem('structon_locale');
          if (stored && locales.indexOf(stored) !== -1) return stored;
        }} catch (e) {{}}
        return null;
      }}
      
      function detectLocale() {{
        var languages = navigator.languages || [navigator.language || ''];
        var mapping = {{
          'nl-be': 'be-nl', 'nl-nl': 'nl-nl', 'nl': 'be-nl',
          'fr-be': 'be-fr', 'fr': 'be-fr',
          'de-de': 'de-de', 'de': 'de-de',
          'en': 'be-nl'
        }};
        for (var i = 0; i < languages.length; i++) {{
          var lang = languages[i].toLowerCase();
          if (mapping[lang]) return mapping[lang];
          var langOnly = lang.split('-')[0];
          if (mapping[langOnly]) return mapping[langOnly];
        }}
        return defaultLocale;
      }}
      
      var locale = getStoredLocale() || detectLocale();
      var basePath = window.location.pathname.includes('/Structon/') ? '/Structon/' : '/';
      window.location.replace(basePath + locale + '/' + targetPage);
    }})();
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0;url=/{default_locale}/{page_path}">
  </noscript>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>
'''

def create_redirect(web_root, page_folder, page_path):
    """Create a redirect page for a legacy URL."""
    
    folder_path = os.path.join(web_root, page_folder)
    index_path = os.path.join(folder_path, 'index.html')
    
    # Skip if folder doesn't exist
    if not os.path.exists(folder_path):
        return False
    
    # Create redirect content
    content = REDIRECT_TEMPLATE.format(
        default_locale=DEFAULT_LOCALE,
        page_path=page_path
    )
    
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_root = os.path.join(os.path.dirname(script_dir), 'web')
    
    # Legacy pages to redirect (folder -> page path in locale)
    legacy_pages = [
        ('contact', 'contact/'),
        ('over-ons', 'over-ons/'),
        ('blog', 'blog/'),
        ('faq', 'faq/'),
        ('dealer', 'dealer/'),
        ('configurator', 'configurator/'),
        ('producten', 'producten/'),
        ('privacy', 'privacy/'),
        ('voorwaarden', 'voorwaarden/'),
        ('login', 'login/'),
        ('sitemap-pagina', 'sitemap-pagina/'),
        ('offerte-aanvragen', 'offerte-aanvragen/'),
        ('sorteergrijpers', 'sorteergrijpers/'),
        ('sloophamers', 'sloophamers/'),
    ]
    
    print("Creating legacy redirect pages...")
    print()
    
    created = 0
    for folder, page_path in legacy_pages:
        if create_redirect(web_root, folder, page_path):
            print(f"  ✓ /{folder}/ -> /{DEFAULT_LOCALE}/{page_path}")
            created += 1
    
    print()
    print(f"Created {created} redirect pages")

if __name__ == '__main__':
    main()
