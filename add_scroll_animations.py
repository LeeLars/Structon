#!/usr/bin/env python3
"""
Add scroll-reveal classes to homepage elements for all locales
"""

import os
import re
from pathlib import Path

def add_scroll_classes(filepath):
    """Add scroll-reveal classes to homepage elements"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Add scroll-reveal to category blocks with stagger delays
        content = re.sub(
            r'<a href="producten/\?cat=graafbakken" class="category-block">',
            r'<a href="producten/?cat=graafbakken" class="category-block scroll-reveal scroll-reveal-delay-1">',
            content
        )
        
        content = re.sub(
            r'<a href="producten/\?cat=sorteergrijpers" class="category-block">',
            r'<a href="producten/?cat=sorteergrijpers" class="category-block scroll-reveal scroll-reveal-delay-2">',
            content
        )
        
        content = re.sub(
            r'<a href="producten/\?cat=overige" class="category-block">',
            r'<a href="producten/?cat=overige" class="category-block scroll-reveal scroll-reveal-delay-3">',
            content
        )
        
        # Add scroll-reveal to USP section
        content = re.sub(
            r'<div class="usp-left">',
            r'<div class="usp-left scroll-reveal-left">',
            content
        )
        
        content = re.sub(
            r'<div class="usp-list">',
            r'<div class="usp-list scroll-reveal-right">',
            content
        )
        
        # Add scroll-reveal to featured products section
        content = re.sub(
            r'<section class="section-featured">',
            r'<section class="section-featured scroll-reveal">',
            content
        )
        
        # Add scroll-reveal to brands section
        content = re.sub(
            r'<section class="section-brands">',
            r'<section class="section-brands scroll-reveal">',
            content
        )
        
        # Add scroll-reveal to about section
        content = re.sub(
            r'<section class="section-about">',
            r'<section class="section-about scroll-reveal">',
            content
        )
        
        # Add scroll-reveal to industries section
        content = re.sub(
            r'<section class="section-industries">',
            r'<section class="section-industries scroll-reveal">',
            content
        )
        
        # Add scroll animation script before closing body tag
        if '<script src="../assets/js/scroll-animations.js"></script>' not in content:
            content = content.replace(
                '</body>',
                '  <script src="../assets/js/scroll-animations.js"></script>\n</body>'
            )
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    base_dir = Path('/Users/larsleenders/Downloads/Structon/web')
    locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']
    
    total_updated = 0
    
    for locale in locales:
        print(f"\nProcessing {locale} homepage...")
        homepage = base_dir / locale / 'index.html'
        
        if homepage.exists():
            if add_scroll_classes(homepage):
                total_updated += 1
                print(f"  ✓ {homepage.relative_to(base_dir)}")
            else:
                print(f"  - No changes for {homepage.relative_to(base_dir)}")
        else:
            print(f"  ✗ Not found: {homepage.relative_to(base_dir)}")
    
    print(f"\n✅ Total: {total_updated} homepage(s) updated with scroll animations")

if __name__ == '__main__':
    main()
