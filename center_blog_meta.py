#!/usr/bin/env python3
"""
Center the article meta information in blog articles
Adds justify-content: center to align meta info under breadcrumb and title
"""

import os
import re

# Base path
base_path = '/Users/larsleenders/Downloads/Structon/web'

# Blog articles per locale
blogs_nl = [
    'de-juiste-graafbak-kiezen',
    'cw-snelwissels-waarom-overstappen-loont',
    'onderhoud-van-je-kraanbak'
]

blogs_fr = [
    'choisir-le-bon-godet',
    'attaches-rapides-cw-pourquoi-passer-le-cap',
    'entretien-de-votre-godet'
]

blogs_de = [
    'den-richtigen-baggerloeffel-waehlen',
    'cw-schnellwechsler-warum-sich-der-umstieg-lohnt',
    'wartung-ihres-baggerloeffels'
]

def center_article_meta(filepath):
    """Center the article meta in a blog article"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find and update the article-meta div to add justify-content: center
        old_pattern = r'<div class="article-meta" style="margin-top: var\(--space-4\); display: flex; gap: var\(--space-4\); font-size: var\(--text-sm\); color: rgba\(255,255,255,0\.9\);">'
        new_meta = '<div class="article-meta" style="margin-top: var(--space-4); display: flex; justify-content: center; gap: var(--space-4); font-size: var(--text-sm); color: rgba(255,255,255,0.9);">'
        
        new_content = content.replace(old_pattern, new_meta)
        
        # Only write if content changed
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    updated_count = 0
    
    # Process Dutch blogs (be-nl and nl-nl)
    for locale in ['be-nl', 'nl-nl']:
        for blog in blogs_nl:
            filepath = os.path.join(base_path, locale, 'blog', blog, 'index.html')
            if os.path.exists(filepath):
                if center_article_meta(filepath):
                    updated_count += 1
                    print(f"✓ Centered: {locale}/blog/{blog}/")
    
    # Process French blogs
    for blog in blogs_fr:
        filepath = os.path.join(base_path, 'be-fr', 'blog', blog, 'index.html')
        if os.path.exists(filepath):
            if center_article_meta(filepath):
                updated_count += 1
                print(f"✓ Centered: be-fr/blog/{blog}/")
    
    # Process German blogs
    for blog in blogs_de:
        filepath = os.path.join(base_path, 'de-de', 'blog', blog, 'index.html')
        if os.path.exists(filepath):
            if center_article_meta(filepath):
                updated_count += 1
                print(f"✓ Centered: de-de/blog/{blog}/")
    
    print(f"\n✅ Centered article meta in {updated_count} blog articles")

if __name__ == '__main__':
    main()
