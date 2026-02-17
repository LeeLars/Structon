#!/usr/bin/env python3
"""
Update blog article meta styling and calculate accurate reading times
Changes gray meta to white text (breadcrumb style) and fixes reading times
"""

import os
import re
from bs4 import BeautifulSoup

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

def calculate_reading_time(html_content):
    """Calculate reading time based on word count (200 words per minute)"""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find article content
    article = soup.find('article', class_='article-content')
    if not article:
        return 5  # Default fallback
    
    # Get text content
    text = article.get_text()
    
    # Count words
    words = len(text.split())
    
    # Calculate minutes (200 words per minute average reading speed)
    minutes = max(1, round(words / 200))
    
    return minutes

def update_blog_article(filepath, locale):
    """Update a single blog article"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Calculate reading time
        reading_time = calculate_reading_time(content)
        
        # Get reading time text based on locale
        reading_labels = {
            'be-nl': f'{reading_time} min leestijd',
            'nl-nl': f'{reading_time} min leestijd',
            'be-fr': f'{reading_time} min de lecture',
            'de-de': f'{reading_time} Min. Lesezeit'
        }
        
        reading_text = reading_labels.get(locale, f'{reading_time} min leestijd')
        
        # Find and update the article-meta div
        # Old pattern with gray color
        old_pattern = r'<div class="article-meta" style="margin-top: var\(--space-4\); display: flex; gap: var\(--space-4\); font-size: var\(--text-sm\); color: var\(--color-gray-600\);">\s*<span>[^<]+</span>\s*<span>([^<]+)</span>\s*<span>([^<]+)</span>\s*</div>'
        
        # Extract category and date
        match = re.search(old_pattern, content)
        if not match:
            print(f"  ⚠ Could not find article-meta in {filepath}")
            return False
        
        category = match.group(1)
        date = match.group(2)
        
        # New meta with white text (breadcrumb style)
        new_meta = f'''<div class="article-meta" style="margin-top: var(--space-4); display: flex; gap: var(--space-4); font-size: var(--text-sm); color: rgba(255,255,255,0.9);">
            <span>{reading_text}</span>
            <span>•</span>
            <span>{category}</span>
            <span>•</span>
            <span>{date}</span>
          </div>'''
        
        # Replace
        new_content = re.sub(old_pattern, new_meta, content)
        
        # Only write if content changed
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True, reading_time
        return False, reading_time
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False, 0

def main():
    """Main function"""
    updated_count = 0
    
    # Process Dutch blogs (be-nl and nl-nl)
    for locale in ['be-nl', 'nl-nl']:
        for blog in blogs_nl:
            filepath = os.path.join(base_path, locale, 'blog', blog, 'index.html')
            if os.path.exists(filepath):
                updated, reading_time = update_blog_article(filepath, locale)
                if updated:
                    updated_count += 1
                    print(f"✓ Updated: {locale}/blog/{blog}/ ({reading_time} min)")
    
    # Process French blogs
    for blog in blogs_fr:
        filepath = os.path.join(base_path, 'be-fr', 'blog', blog, 'index.html')
        if os.path.exists(filepath):
            updated, reading_time = update_blog_article(filepath, 'be-fr')
            if updated:
                updated_count += 1
                print(f"✓ Updated: be-fr/blog/{blog}/ ({reading_time} min)")
    
    # Process German blogs
    for blog in blogs_de:
        filepath = os.path.join(base_path, 'de-de', 'blog', blog, 'index.html')
        if os.path.exists(filepath):
            updated, reading_time = update_blog_article(filepath, 'de-de')
            if updated:
                updated_count += 1
                print(f"✓ Updated: de-de/blog/{blog}/ ({reading_time} min)")
    
    print(f"\n✅ Updated {updated_count} blog articles with correct reading times and white meta text")

if __name__ == '__main__':
    main()
