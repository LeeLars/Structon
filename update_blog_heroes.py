#!/usr/bin/env python3
"""
Update blog article heroes to use page-hero design instead of article-hero
Changes the gradient hero to match the standard page-hero design
"""

import os
import re

# Base path
base_path = '/Users/larsleenders/Downloads/Structon/web'

# Locales to process
locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']

# Blog articles
blogs = [
    'de-juiste-graafbak-kiezen',
    'cw-snelwissels-waarom-overstappen-loont',
    'onderhoud-van-je-kraanbak'
]

# French blog slugs
blogs_fr = [
    'choisir-le-bon-godet',
    'attaches-rapides-cw-pourquoi-passer-le-cap',
    'entretien-de-votre-godet'
]

# German blog slugs
blogs_de = [
    'den-richtigen-baggerloeffel-waehlen',
    'cw-schnellwechsler-warum-sich-der-umstieg-lohnt',
    'wartung-ihres-baggerloeffels'
]

def get_new_hero_html(locale, blog_title, meta_info):
    """Generate new page-hero HTML"""
    
    breadcrumb_labels = {
        'be-nl': {'home': 'Home', 'blog': 'Blog'},
        'nl-nl': {'home': 'Home', 'blog': 'Blog'},
        'be-fr': {'home': 'Accueil', 'blog': 'Blog'},
        'de-de': {'home': 'Startseite', 'blog': 'Blog'}
    }
    
    labels = breadcrumb_labels.get(locale, breadcrumb_labels['be-nl'])
    
    return f'''<section class="page-hero" style="padding-top: var(--space-8);">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../../index.html">{labels['home']}</a>
        <span>/</span>
        <a href="../">{labels['blog']}</a>
        <span>/</span>
        <span aria-current="page">{blog_title}</span>
      </nav>
      
      <div class="page-hero-content">
        <div class="page-hero-text">
          <h1 class="page-title">{blog_title}</h1>
          <div class="article-meta" style="margin-top: var(--space-4); display: flex; gap: var(--space-4); font-size: var(--text-sm); color: var(--color-gray-600);">
            {meta_info}
          </div>
        </div>
      </div>
    </div>
  </section>'''

def update_blog_page(filepath, locale):
    """Update a single blog page"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract the blog title from the h1
        title_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL)
        if not title_match:
            print(f"  ⚠ Could not find h1 title in {filepath}")
            return False
        
        blog_title = title_match.group(1).strip()
        
        # Extract meta info (reading time, category, date)
        meta_match = re.search(r'<div class="article-meta"[^>]*>(.*?)</div>', content, re.DOTALL)
        meta_info = meta_match.group(1).strip() if meta_match else ''
        
        # Remove inline styles from meta spans
        meta_info = re.sub(r'<span[^>]*>', '<span>', meta_info)
        
        # Find and replace the entire article-hero section
        hero_pattern = r'<section class="article-hero">.*?</section>'
        
        new_hero = get_new_hero_html(locale, blog_title, meta_info)
        
        new_content = re.sub(hero_pattern, new_hero, content, flags=re.DOTALL)
        
        # Remove the old article-hero CSS from the style tag
        style_pattern = r'\.article-hero \{[^}]+\}[^\}]*\.article-hero h1 \{[^}]+\}[^\}]*\.article-meta \{[^}]+\}'
        new_content = re.sub(style_pattern, '', new_content, flags=re.DOTALL)
        
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
        for blog in blogs:
            filepath = os.path.join(base_path, locale, 'blog', blog, 'index.html')
            if os.path.exists(filepath):
                if update_blog_page(filepath, locale):
                    updated_count += 1
                    print(f"✓ Updated: {locale}/blog/{blog}/")
    
    # Process French blogs
    for blog in blogs_fr:
        filepath = os.path.join(base_path, 'be-fr', 'blog', blog, 'index.html')
        if os.path.exists(filepath):
            if update_blog_page(filepath, 'be-fr'):
                updated_count += 1
                print(f"✓ Updated: be-fr/blog/{blog}/")
    
    # Process German blogs
    for blog in blogs_de:
        filepath = os.path.join(base_path, 'de-de', 'blog', blog, 'index.html')
        if os.path.exists(filepath):
            if update_blog_page(filepath, 'de-de'):
                updated_count += 1
                print(f"✓ Updated: de-de/blog/{blog}/")
    
    print(f"\n✅ Updated {updated_count} blog article pages")

if __name__ == '__main__':
    main()
