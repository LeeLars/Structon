#!/usr/bin/env python3
"""
Create redirect pages for nested legacy URLs (slotenbakken, kraanbakken, etc.).
"""

import os

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

def create_redirect_for_folder(web_root, folder_path):
    """Create redirect for a folder and all its subfolders."""
    full_path = os.path.join(web_root, folder_path)
    
    if not os.path.exists(full_path):
        return 0
    
    count = 0
    
    for root, dirs, files in os.walk(full_path):
        for filename in files:
            if filename == 'index.html':
                filepath = os.path.join(root, filename)
                rel_path = os.path.relpath(root, web_root)
                page_path = rel_path + '/'
                
                content = REDIRECT_TEMPLATE.format(
                    default_locale=DEFAULT_LOCALE,
                    page_path=page_path
                )
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"  ✓ /{rel_path}/ -> /{DEFAULT_LOCALE}/{page_path}")
                count += 1
    
    return count

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_root = os.path.join(os.path.dirname(script_dir), 'web')
    
    # Nested folders to redirect
    nested_folders = [
        'slotenbakken',
        'kraanbakken', 
        'industrieen',
        'sectoren',
        'kennisbank',
        'account',
    ]
    
    print("Creating nested legacy redirect pages...")
    print()
    
    total = 0
    for folder in nested_folders:
        print(f"Processing /{folder}/...")
        count = create_redirect_for_folder(web_root, folder)
        total += count
        print()
    
    print(f"Total: {total} redirect pages created")

if __name__ == '__main__':
    main()
