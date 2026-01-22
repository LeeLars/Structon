#!/usr/bin/env python3
"""
Fix html lang attributes for each locale folder.
"""

import os
import re

LOCALE_LANG = {
    'be-nl': 'nl-BE',
    'nl-nl': 'nl-NL',
    'be-fr': 'fr-BE',
    'de-de': 'de-DE'
}

def fix_lang_in_file(filepath, lang):
    """Fix html lang attribute in a single file."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Replace html lang attribute
    content = re.sub(r'<html lang="[^"]*"', f'<html lang="{lang}"', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def fix_locale(web_root, locale):
    """Fix all HTML files in a locale folder."""
    
    lang = LOCALE_LANG.get(locale)
    if not lang:
        return 0
    
    locale_folder = os.path.join(web_root, locale)
    if not os.path.exists(locale_folder):
        return 0
    
    count = 0
    for root, dirs, files in os.walk(locale_folder):
        for filename in files:
            if filename.endswith('.html'):
                filepath = os.path.join(root, filename)
                if fix_lang_in_file(filepath, lang):
                    count += 1
    
    return count

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_root = os.path.join(os.path.dirname(script_dir), 'web')
    
    print("Fixing html lang attributes...")
    
    for locale in LOCALE_LANG:
        count = fix_locale(web_root, locale)
        print(f"  ✓ /{locale}/ -> lang=\"{LOCALE_LANG[locale]}\" ({count} files)")
    
    print("Done!")

if __name__ == '__main__':
    main()
