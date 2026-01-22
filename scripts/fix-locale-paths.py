#!/usr/bin/env python3
"""
Fix asset paths for locale folders.
Updates relative paths in HTML files to account for the extra folder depth.
"""

import os
import re
import sys

def fix_paths_in_file(filepath, locale_folder):
    """Fix asset and link paths in a single HTML file."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Calculate depth from locale folder
    rel_path = os.path.relpath(filepath, locale_folder)
    depth = rel_path.count(os.sep)
    
    # Prefix to get back to web root from this file
    # depth 0 = index.html in locale folder -> ../
    # depth 1 = contact/index.html -> ../../
    prefix = '../' * (depth + 1)
    
    # For subpages that already have ../ we need to add one more ../
    # The original depth determines how many ../ they had
    # depth 0 = index.html -> had assets/ -> needs ../assets/
    # depth 1 = contact/index.html -> had ../assets/ -> needs ../../assets/
    # depth 2 = slotenbakken/caterpillar/index.html -> had ../../assets/ -> needs ../../../assets/
    
    # Build the original prefix pattern (what the file currently has)
    if depth == 0:
        original_prefix = ''
    else:
        original_prefix = '\.\./'.join([''] * depth) + '\.\./'
        # depth 1 -> "\.\./ "
        # depth 2 -> "\.\./\.\./"
    
    # Patterns to fix
    replacements = [
        (r'href="' + original_prefix + r'assets/', f'href="{prefix}assets/'),
        (r"href='" + original_prefix + r"assets/", f"href='{prefix}assets/"),
        (r'src="' + original_prefix + r'assets/', f'src="{prefix}assets/'),
        (r"src='" + original_prefix + r"assets/", f"src='{prefix}assets/"),
    ]
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    # Only write if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def fix_locale_folder(web_root, locale):
    """Fix all HTML files in a locale folder."""
    
    locale_folder = os.path.join(web_root, locale)
    
    if not os.path.exists(locale_folder):
        print(f"Locale folder not found: {locale_folder}")
        return
    
    fixed_count = 0
    
    for root, dirs, files in os.walk(locale_folder):
        for filename in files:
            if filename.endswith('.html'):
                filepath = os.path.join(root, filename)
                if fix_paths_in_file(filepath, locale_folder):
                    rel_path = os.path.relpath(filepath, web_root)
                    print(f"  Fixed: {rel_path}")
                    fixed_count += 1
    
    print(f"Fixed {fixed_count} files in /{locale}/")
    return fixed_count

def main():
    # Get web root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    web_root = os.path.join(os.path.dirname(script_dir), 'web')
    
    if not os.path.exists(web_root):
        print(f"Web root not found: {web_root}")
        sys.exit(1)
    
    locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']
    
    print(f"Fixing asset paths in locale folders...")
    print(f"Web root: {web_root}")
    print()
    
    total_fixed = 0
    for locale in locales:
        locale_path = os.path.join(web_root, locale)
        if os.path.exists(locale_path):
            print(f"Processing /{locale}/...")
            total_fixed += fix_locale_folder(web_root, locale)
            print()
    
    print(f"Total files fixed: {total_fixed}")

if __name__ == '__main__':
    main()
