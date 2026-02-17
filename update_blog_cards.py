#!/usr/bin/env python3
"""
Update blog overview pages to remove SVG placeholders and improve card design
Removes the gradient background + SVG icon and replaces with cleaner design
"""

import os
import re

# Base path
base_path = '/Users/larsleenders/Downloads/Structon/web'

# Locales to process
locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de']

def get_new_blog_card_html(href, category, title, excerpt, date):
    """Generate new blog card HTML without SVG placeholder"""
    
    # Use category-based gradient colors
    gradient_map = {
        'Advies': 'linear-gradient(135deg, #236773 0%, #2d7f8d 100%)',
        'Conseils': 'linear-gradient(135deg, #236773 0%, #2d7f8d 100%)',
        'Beratung': 'linear-gradient(135deg, #236773 0%, #2d7f8d 100%)',
        'Technisch': 'linear-gradient(135deg, #1a4f59 0%, #236773 100%)',
        'Technique': 'linear-gradient(135deg, #1a4f59 0%, #236773 100%)',
        'Technik': 'linear-gradient(135deg, #1a4f59 0%, #236773 100%)',
        'Onderhoud': 'linear-gradient(135deg, #2d7f8d 0%, #1a4f59 100%)',
        'Entretien': 'linear-gradient(135deg, #2d7f8d 0%, #1a4f59 100%)',
        'Wartung': 'linear-gradient(135deg, #2d7f8d 0%, #1a4f59 100%)',
    }
    
    gradient = gradient_map.get(category, 'linear-gradient(135deg, #236773 0%, #1a4f59 100%)')
    
    return f'''<a href="{href}" class="blog-card">
          <div class="blog-card-image" style="background: {gradient};"></div>
          <div class="blog-card-content">
            <span class="blog-card-category">{category}</span>
            <h3 class="blog-card-title">{title}</h3>
            <p class="blog-card-excerpt">{excerpt}</p>
            <span class="blog-card-meta">{date}</span>
          </div>
        </a>'''

def update_blog_overview(filepath):
    """Update a single blog overview page"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all blog cards and extract their data
        card_pattern = r'<a href="([^"]+)" class="blog-card">.*?<span class="blog-card-category">([^<]+)</span>.*?<h3 class="blog-card-title">([^<]+)</h3>.*?<p class="blog-card-excerpt">([^<]+)</p>.*?<span class="blog-card-meta">([^<]+)</span>.*?</a>'
        
        cards = re.findall(card_pattern, content, re.DOTALL)
        
        if not cards:
            print(f"  ⚠ No blog cards found in {filepath}")
            return False
        
        # Replace each card
        for href, category, title, excerpt, date in cards:
            # Find the old card HTML (including the SVG)
            old_card_pattern = rf'<a href="{re.escape(href)}" class="blog-card">.*?</a>'
            new_card = get_new_blog_card_html(href, category, title, excerpt, date)
            content = re.sub(old_card_pattern, new_card, content, count=1, flags=re.DOTALL)
        
        # Write the updated content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    updated_count = 0
    
    for locale in locales:
        filepath = os.path.join(base_path, locale, 'blog', 'index.html')
        if os.path.exists(filepath):
            if update_blog_overview(filepath):
                updated_count += 1
                print(f"✓ Updated: {locale}/blog/index.html")
        else:
            print(f"⚠ Not found: {filepath}")
    
    print(f"\n✅ Updated {updated_count} blog overview pages")

if __name__ == '__main__':
    main()
